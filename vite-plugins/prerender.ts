import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";

/**
 * Build-time prerender: boots `vite preview` over the freshly built dist/,
 * drives a headless Chrome over every route, and writes the post-render DOM
 * back out as static HTML.
 *
 * Why a real browser instead of Node SSR: ~15 module-scope reads of
 * `window.location` / `document.documentElement` across 12 files (six of them
 * at the top level of page components, so they throw on import, not on render),
 * plus Paraglide's cookie-based locale strategy. A real browser runs all of it
 * unchanged. It also means react-helmet-async has already written <title>,
 * canonical, hreflang and every ld+json block into a real <head> by the time we
 * serialise — no Helmet SSR wiring needed.
 *
 * And critically: IntersectionObserver actually fires, so useInView flips true
 * and sections serialise at opacity:1. A Node SSR build would emit the whole
 * page body at opacity:0 (useInView is false on the server) — readable by
 * Google but styled invisible, which is the hidden-text pattern it penalises.
 */

/**
 * Third-party hosts blocked during the crawl. Without this every deploy fires
 * ~20 Meta Pixel PageView events, 20 Clarity sessions and 20 ContentSquare
 * sessions — and index.html's deferred loader uses
 * requestIdleCallback(..., {timeout: 2000}), which WILL fire inside a 3-second
 * prerender and bake the Silktide cookie banner into every static page.
 */
const BLOCKED = [
  "connect.facebook.net",
  "facebook.com/tr",
  "clarity.ms",
  "contentsquare.net",
  "googletagmanager.com",
  "google-analytics.com",
  "cdn.jsdelivr.net/gh/silktide",
  "embedsocial.com",
  "get.geojs.io",
  "maps.google.com",
  "maps.googleapis.com",
  // ElevenLabs widget: holds connections open, so networkidle0 never settles
  // and the crawl hits its 45s navigation timeout.
  "unpkg.com/@elevenlabs",
  "elevenlabs.io",
];

/** A page smaller than this, or with no <h1>, means the SPA never rendered. */
const MIN_BYTES = 15_000;

/**
 * Removes DOM that the page's own inline loaders injected at runtime.
 *
 * Blocking the network requests stops the third-party code from *executing*
 * during the crawl, but the inline Meta Pixel / Clarity / ContentSquare /
 * Silktide snippets still insert their <script src> tags into the DOM — and
 * page.content() serialises them. Ship that and every tag loads TWICE in a real
 * browser: once from the baked-in tag, once from the inline snippet that
 * re-injects it. For the Meta Pixel that means duplicate PageView and Lead
 * events on a live ad account; for Silktide it throws
 * "Identifier 'SilktideConsentManager' has already been declared".
 *
 * index.html contains no cross-origin <script src> of its own — the only script
 * tags it ships are the relative Vite bundle and inline snippets — so removing
 * every absolute-URL script tag restores exactly the authored <head>.
 */
function stripRuntimeInjections(html: string) {
  const cleaned = html
    // Third-party <script src="https://..."> injected by the inline loaders.
    .replace(/<script\b[^>]*\ssrc=["']https?:\/\/[^"']*["'][^>]*>\s*<\/script>/gi, "")
    // Silktide's banner markup, if it ever renders despite the request block.
    .replace(/<div id="stcm-wrapper"[\s\S]*?<\/div>\s*(?=<\/body>)/i, "");

  const leaked = cleaned.match(/<script\b[^>]*\ssrc=["']https?:\/\//gi);
  if (leaked) {
    throw new Error(
      `Prerender leaked ${leaked.length} third-party script tag(s) into static HTML. ` +
        `These would load twice in a real browser (duplicate Meta Pixel events).`,
    );
  }
  return cleaned;
}

export function prerender(opts: { urls: string[] }): Plugin {
  let config: ResolvedConfig;

  return {
    name: "kk-prerender",
    apply: "build",
    enforce: "post",
    configResolved(c) {
      config = c;
    },
    async closeBundle() {
      const { preview } = await import("vite");
      const puppeteer = (await import("puppeteer")).default;

      const server = await preview({
        root: config.root,
        configFile: false,
        build: { outDir: config.build.outDir },
        preview: { port: 4321, strictPort: true, open: false },
      });
      const origin = server.resolvedUrls!.local[0].replace(/\/$/, "");

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
      });

      // Collected in memory and flushed at the end: writing dist/index.html
      // mid-crawl would replace the SPA shell that `vite preview`'s history
      // fallback serves, so later routes would start from prerendered homepage
      // markup instead of an empty root.
      const snapshots = new Map<string, string>();
      const failures: string[] = [];

      try {
        for (const url of opts.urls) {
          const page = await browser.newPage();
          await page.setViewport({ width: 1440, height: 1200 });

          // Do NOT call setUserAgent(). Puppeteer's default UA contains
          // "HeadlessChrome", which main.tsx's isCrawler regex matches — that is
          // what stops the geo-redirect from bouncing the crawl to /en/.
          await page.setRequestInterception(true);
          page.on("request", (req) => {
            const u = req.url();
            if (BLOCKED.some((h) => u.includes(h))) return req.abort();
            if (req.resourceType() === "media") return req.abort();
            req.continue();
          });

          await page.goto(origin + url, { waitUntil: "networkidle0", timeout: 45_000 });
          await page.waitForFunction(
            "document.getElementById('root')?.childElementCount > 0",
            { timeout: 20_000 },
          );

          // Trip every IntersectionObserver so reveal animations settle at
          // opacity:1 rather than serialising mid-transition.
          await page.evaluate(async () => {
            // Half-viewport steps, and scrollHeight is re-read each iteration
            // because lazy content changes it mid-pass. Stepping a full
            // viewport at a time let elements with a negative viewport margin
            // slip past without their observer ever firing, which serialised
            // them at opacity 0.
            const step = Math.max(200, Math.round(window.innerHeight / 2));
            for (let y = 0, guard = 0; guard < 200; y += step, guard++) {
              window.scrollTo(0, y);
              await new Promise((r) => setTimeout(r, 150));
              if (y >= document.body.scrollHeight) break;
            }
            window.scrollTo(0, 0);
          });
          await new Promise((r) => setTimeout(r, 1400));

          // Safety net. A reveal whose IntersectionObserver never fired would
          // serialise at opacity 0: text a crawler reads but a visitor cannot
          // see, which is the hidden-text pattern Google penalises. The reveal
          // signature is an inline `opacity: 0` paired with a `translateY`, and
          // nothing else on this site shares it. Collapsed FAQ answers carry
          // max-height + transition; the always-mounted nav dropdown carries
          // visibility: hidden. Both are genuinely-hidden UI and stay untouched.
          await page.evaluate(() => {
            document.querySelectorAll("[style]").forEach((node) => {
              const el = node as HTMLElement;
              const style = el.getAttribute("style") || "";
              if (!/opacity:\s*0(?![.\d])/.test(style)) return;
              if (!/transform:\s*translateY/.test(style)) return;
              if (/visibility:\s*hidden/.test(style)) return;
              if (/max-height/.test(style)) return;
              el.style.opacity = "1";
              el.style.transform = "none";
            });
          });

          let html = await page.content();
          html = stripRuntimeInjections(html);
          await page.close();

          const hasH1 = /<h1[\s>]/i.test(html);
          if (!hasH1 || html.length < MIN_BYTES) {
            failures.push(`${url} — ${html.length}B, h1=${hasH1}`);
          }

          snapshots.set(url, html);
          config.logger.info(
            `  prerendered ${url.padEnd(34)} ${String(Math.round(html.length / 1024)).padStart(4)} KB`,
          );
        }
      } finally {
        await browser.close();
        await server.close();
      }

      if (failures.length) {
        throw new Error(
          `Prerender produced empty or broken output — refusing to ship:\n  ${failures.join("\n  ")}`,
        );
      }

      for (const [url, html] of snapshots) {
        const outFile =
          url === "/404"
            ? path.join(config.build.outDir, "404.html")
            : path.join(config.build.outDir, url.replace(/^\//, ""), "index.html");
        await mkdir(path.dirname(outFile), { recursive: true });
        await writeFile(outFile, html, "utf8");
      }

      config.logger.info(`  ✓ prerendered ${snapshots.size} pages to static HTML`);
    },
  };
}
