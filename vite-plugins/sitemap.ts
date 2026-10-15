import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";

/**
 * Generates dist/sitemap.xml from the same src/routes.ts manifest that drives
 * the router and the prerenderer, so the three can never drift. Replaces the
 * hand-maintained public/sitemap.xml, which had gone stale (every lastmod
 * frozen at 2026-05-30) and was missing /google-audit, /en/google-audit and
 * /en/kodulehe-tegemine-seo.
 */

const ORIGIN = "https://kliendidkodulehele.ee";

export type SitemapEntry = {
  url: string;
  page: string;
  priority: number;
  changefreq: string;
};

/** Date that page's source last changed, so lastmod means something. */
function lastmodFor(page: string, fallback: string) {
  try {
    const out = execFileSync(
      "git",
      ["log", "-1", "--format=%cs", "--", `src/app/${page}.tsx`],
      { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] },
    ).trim();
    return out || fallback;
  } catch {
    return fallback;
  }
}

export function sitemap(opts: { entries: SitemapEntry[] }): Plugin {
  let config: ResolvedConfig;

  return {
    name: "kk-sitemap",
    apply: "build",
    enforce: "post",
    configResolved(c) {
      config = c;
    },
    async closeBundle() {
      const today = new Date().toISOString().slice(0, 10);
      const lastmodCache = new Map<string, string>();

      const body = opts.entries
        .map((e) => {
          if (!lastmodCache.has(e.page)) {
            lastmodCache.set(e.page, lastmodFor(e.page, today));
          }
          // Both locales of a page share one hreflang cluster, derived here so
          // sitemap alternates cannot disagree with the in-page <link rel=alternate>.
          const etPath = e.url.replace(/^\/en/, "") || "/";
          const enPath = etPath === "/" ? "/en/" : `/en${etPath}`;
          return `  <url>
    <loc>${ORIGIN}${e.url}</loc>
    <lastmod>${lastmodCache.get(e.page)}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(2)}</priority>
    <xhtml:link rel="alternate" hreflang="et" href="${ORIGIN}${etPath}" />
    <xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}${enPath}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${etPath}" />
  </url>`;
        })
        .join("\n");

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${body}
</urlset>
`;

      await writeFile(path.join(config.build.outDir, "sitemap.xml"), xml, "utf8");
      config.logger.info(`  ✓ sitemap.xml — ${opts.entries.length} URLs`);
    },
  };
}
