import type { ComponentType } from "react";
import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { setLocale } from "./paraglide/runtime.js";
import "./styles/index.css";

// Detect /en/ prefix for English locale
const rawPath = window.location.pathname;
const isEnglish = rawPath.toLowerCase().startsWith("/en/") || rawPath.toLowerCase() === "/en";

// Always set locale explicitly so a stale cookie can't override the URL
if (isEnglish) {
  setLocale("en");
  document.documentElement.lang = "en";
} else {
  setLocale("et");
  document.documentElement.lang = "et";
}

// Strip the /en prefix for route matching
const strippedPath = isEnglish
  ? rawPath.replace(/^\/en\/?/i, "/")
  : rawPath;
const path = strippedPath.toLowerCase();

const isPortfolioPage = path === "/portfolio" || path === "/portfolio/";
const isAuditPage = path === "/audit" || path === "/audit/";
// /contact and /konsultatsioon were retired in favour of /audit; Netlify 301s
// them at the edge (see public/_redirects), so they never reach this router.
// Google Ads landing page. The legacy /teenused/muugikonversioon route now
// resolves to this page as well, so it must be checked before isServicesPage.
const isKoduleheSeoPage =
  path === "/kodulehe-tegemine-seo" ||
  path === "/kodulehe-tegemine-seo/" ||
  path === "/teenused/muugikonversioon" ||
  path === "/teenused/muugikonversioon/";
// Each service now has its own full landing page (duplicated from muugikonversioon),
// checked before the generic isServicesPage fallback.
const isGoogleSeoPage = path === "/teenused/google-seo" || path === "/teenused/google-seo/";
const isKoduleheArendusPage = path === "/teenused/kodulehe-arendus" || path === "/teenused/kodulehe-arendus/";
const isAiTugiPage = path === "/teenused/ai-tugi" || path === "/teenused/ai-tugi/";
const isSotsiaalmeediaPage = path === "/teenused/sotsiaalmeedia" || path === "/teenused/sotsiaalmeedia/";
const isServicesPage = path.startsWith("/teenused/");

// Build locale prefix for internal links
(window as any).__localePrefix = isEnglish ? "/en" : "";

// Geo-redirect: send human visitors located outside Estonia from an Estonian-language
// page to the /en/ equivalent. Search-engine crawlers are excluded so Google (which crawls
// from the US) can index both /(et) and /en/(en) independently — hreflang then serves the
// right language per searcher. Runs once per session.
//
// Uses geojs.io (HTTPS + CORS, no key). The previous ip-api.com endpoint returned 403 over
// HTTPS on the free tier, so the redirect silently never fired.
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

// Route → lazy page loader. Only the matched page's chunk is fetched, so the
// entry bundle no longer carries all 8 pages (removes ~503 KiB of unused JS).
const loadPage: () => Promise<{ default: ComponentType<any> }> =
  isPortfolioPage
    ? () => import("./app/Portfolio.tsx")
    : isAuditPage
      ? () => import("./app/Audit.tsx")
      : isKoduleheSeoPage
        ? () => import("./app/KoduleheSeo.tsx")
        : isGoogleSeoPage
          ? () => import("./app/GoogleSeo.tsx")
          : isKoduleheArendusPage
            ? () => import("./app/KoduleheArendus.tsx")
            : isAiTugiPage
              ? () => import("./app/AiTugi.tsx")
              : isSotsiaalmeediaPage
                ? () => import("./app/Sotsiaalmeedia.tsx")
                : isServicesPage
                  ? () => import("./app/Services.tsx")
                  : () => import("./app/App.tsx");

loadPage().then(({ default: Page }) => {
  createRoot(document.getElementById("root")!).render(
    <HelmetProvider>
      <Page />
    </HelmetProvider>,
  );
});
