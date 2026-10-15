/**
 * Canonical + hreflang helpers derived from the same route list that drives the
 * router, the prerenderer and sitemap.xml.
 *
 * Before this, every page hand-wrote its hreflang block — so the five service
 * landing pages emitted none at all, while sitemap.xml declared alternates for
 * them. These helpers make that class of drift impossible.
 *
 * They return plain arrays of <link> elements rather than a component, because
 * react-helmet-async only inspects direct children of <Helmet>; a wrapper
 * component would be ignored. Spread the result instead:
 *
 *   <Helmet>
 *     <title>…</title>
 *     {...seoLinks("/teenused/google-seo", isEnglish)}
 *   </Helmet>
 */

const ORIGIN = "https://kliendidkodulehele.ee";

/** Estonian path in, absolute et/en URL pair out. */
export function localeUrls(etPath: string) {
  const path = etPath === "/" ? "/" : `/${etPath.replace(/^\/+|\/+$/g, "")}`;
  return {
    et: `${ORIGIN}${path}`,
    en: path === "/" ? `${ORIGIN}/en/` : `${ORIGIN}/en${path}`,
  };
}

export function canonicalFor(etPath: string, isEnglish: boolean) {
  const { et, en } = localeUrls(etPath);
  return isEnglish ? en : et;
}

/** Canonical + the full et / en / x-default cluster, ready to spread. */
export function seoLinks(etPath: string, isEnglish: boolean) {
  const { et, en } = localeUrls(etPath);
  return [
    <link key="canonical" rel="canonical" href={isEnglish ? en : et} />,
    <link key="alt-et" rel="alternate" hrefLang="et-EE" href={et} />,
    <link key="alt-en" rel="alternate" hrefLang="en" href={en} />,
    <link key="alt-default" rel="alternate" hrefLang="x-default" href={et} />,
  ];
}
