/**
 * Single source of truth for every route on the site.
 *
 * IMPORTANT: this module must have ZERO imports. `vite.config.ts` imports it,
 * and Vite bundles the config with esbuild — if anything here pulled in a
 * `.tsx` file (which in turn imports CSS and SVGs) config loading would fail.
 * That is why routes carry a `page` *name* rather than a `() => import(...)`
 * loader; `main.tsx` resolves the name via `import.meta.glob`, which preserves
 * the per-page code splitting the old ternary chain gave us.
 *
 * Adding a page = create `src/app/<Page>.tsx`, then add one line to `routes`.
 * That single line registers the client route, gets both the Estonian and the
 * English URL prerendered to static HTML, and adds both to sitemap.xml.
 */

export type Route = {
  /** Canonical Estonian path. Leading slash, no trailing slash (except "/"). */
  path: string;
  /** Basename of the component in src/app/ — resolved via import.meta.glob. */
  page: string;
  /** Extra paths that render the same component. Prerendered, but kept out of the sitemap. */
  aliases?: string[];
  /** Does an /en/ twin exist? Defaults to true. */
  en?: boolean;
  /** Prerender it, but keep it out of sitemap.xml. */
  noindex?: boolean;
  priority?: number;
  changefreq?: "daily" | "weekly" | "monthly" | "yearly";
};

export const routes: Route[] = [
  { path: "/", page: "App", priority: 1.0, changefreq: "weekly" },
  { path: "/portfolio", page: "Portfolio", priority: 0.9, changefreq: "monthly" },
  { path: "/audit", page: "Audit", priority: 0.6, changefreq: "monthly" },
  { path: "/google-audit", page: "GoogleAudit", priority: 0.6, changefreq: "monthly" },
  {
    // Google Ads landing page. /teenused/muugikonversioon is the legacy URL and
    // must resolve here, ahead of the generic /teenused/* fallback.
    path: "/kodulehe-tegemine-seo",
    page: "KoduleheSeo",
    aliases: ["/teenused/muugikonversioon"],
    priority: 0.9,
    changefreq: "monthly",
  },
  { path: "/teenused/google-seo", page: "GoogleSeo", priority: 0.85, changefreq: "monthly" },
  { path: "/teenused/kodulehe-arendus", page: "KoduleheArendus", priority: 0.85, changefreq: "monthly" },
  { path: "/teenused/ai-tugi", page: "AiTugi", priority: 0.8, changefreq: "monthly" },
  { path: "/teenused/sotsiaalmeedia", page: "Sotsiaalmeedia", priority: 0.8, changefreq: "monthly" },
];

/**
 * Rendered for any unmatched /teenused/* path. Kept so a client-side link to a
 * retired slug still shows something rather than a blank screen — but such URLs
 * are no longer prerendered, so the server correctly answers 404.
 */
export const servicesFallbackPage = "Services";

/** Rendered at /404 and written to dist/404.html. */
export const notFoundPage = "NotFound";

/** Splits an incoming pathname into locale + normalised Estonian path. Pure. */
export function stripLocale(pathname: string) {
  const isEnglish = /^\/en(\/|$)/i.test(pathname);
  const raw = isEnglish ? pathname.replace(/^\/en/i, "") || "/" : pathname;
  const lower = raw.toLowerCase();
  // Normalise trailing slashes centrally — the old router did this per route.
  const path = lower.length > 1 ? lower.replace(/\/+$/, "") : "/";
  return { isEnglish, path, locale: (isEnglish ? "en" : "et") as "en" | "et" };
}

/** Resolves a pathname to a page name. Pure — no window access. */
export function matchRoute(pathname: string) {
  const { isEnglish, path, locale } = stripLocale(pathname);

  const hit = routes.find((r) => r.path === path || r.aliases?.includes(path));
  if (hit) return { page: hit.page, isEnglish, locale, matched: true };

  if (path === "/404") return { page: notFoundPage, isEnglish, locale, matched: true };

  // Unknown /teenused/* still renders the generic template client-side.
  if (path.startsWith("/teenused/")) {
    return { page: servicesFallbackPage, isEnglish, locale, matched: false };
  }

  return { page: notFoundPage, isEnglish, locale, matched: false };
}

/** Every URL the prerenderer visits. `index` marks sitemap inclusion. */
export function allUrls(): { url: string; route: Route; index: boolean }[] {
  const out: { url: string; route: Route; index: boolean }[] = [];
  for (const r of routes) {
    for (const p of [r.path, ...(r.aliases ?? [])]) {
      const isCanonical = p === r.path && !r.noindex;
      out.push({ url: p, route: r, index: isCanonical });
      if (r.en !== false) {
        out.push({ url: p === "/" ? "/en/" : `/en${p}`, route: r, index: isCanonical });
      }
    }
  }
  return out;
}
