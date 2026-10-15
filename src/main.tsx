import type { ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { setLocale } from "./paraglide/runtime.js";
import { matchRoute, notFoundPage } from "./routes";
import "./styles/index.css";

// Route resolution lives in src/routes.ts so the prerenderer, the sitemap
// generator and this file can never disagree about what exists.
const rawPath = window.location.pathname;
const { page, isEnglish, locale } = matchRoute(rawPath);

// Always set locale explicitly so a stale cookie can't override the URL.
// reload:false is important — paraglide's setLocale defaults to reload:true,
// which made every /en/ visit load the document TWICE (and therefore fire a
// second Meta Pixel PageView and a second Clarity session). We set the locale
// before the first render, so the reload buys nothing.
setLocale(locale, { reload: false });
document.documentElement.lang = locale;

// Build locale prefix for internal links
(window as any).__localePrefix = isEnglish ? "/en" : "";

// Geo-redirect: send human visitors located outside Estonia from an Estonian-language
// page to the /en/ equivalent. Search-engine crawlers are excluded so Google (which crawls
// from the US) can index both /(et) and /en/(en) independently — hreflang then serves the
// right language per searcher. Runs once per session.
//
// Uses geojs.io (HTTPS + CORS, no key). The previous ip-api.com endpoint returned 403 over
// HTTPS on the free tier, so the redirect silently never fired.
//
// NOTE: the `headless` term in this regex is load-bearing for the build — the prerenderer
// (vite-plugins/prerender.ts) drives a headless Chrome whose default UA contains
// "HeadlessChrome", so this check keeps the build from being redirected to /en/.
const GEO_FLAG = "geo_checked";
const isCrawler = /bot|crawl|spider|slurp|mediapartners|adsbot|inspectiontool|lighthouse|headless|facebookexternalhit|embedly|bingpreview|duckduck|yandex|baidu|pinterest|whatsapp|telegram|slackbot|twitterbot/i.test(navigator.userAgent);
if (!isEnglish && !isCrawler && !sessionStorage.getItem(GEO_FLAG)) {
  sessionStorage.setItem(GEO_FLAG, "1");
  fetch("https://get.geojs.io/v1/ip/country.json")
    .then((r) => r.json())
    .then((data) => {
      if (data && data.country && data.country !== "EE") {
        // Preserve the current path under /en/
        const enPath = "/en" + (rawPath === "/" ? "/" : rawPath);
        window.location.replace(enPath + window.location.search + window.location.hash);
      }
    })
    .catch(() => { /* silently ignore on API failure */ });
}

// Lazy by default, so only the matched page's chunk is fetched — same per-page
// code splitting the previous ternary chain produced.
const pages = import.meta.glob<{ default: ComponentType<any> }>("./app/*.tsx");
const loadPage = pages[`./app/${page}.tsx`] ?? pages[`./app/${notFoundPage}.tsx`];

loadPage().then(({ default: Page }) => {
  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <Page />
    </HelmetProvider>,
  );
});
