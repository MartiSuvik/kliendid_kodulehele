import { Helmet } from "react-helmet-async";
import { Navigation } from "./components/Navigation";
import { Footer } from "./components/Footer";
import { localizeHref } from "./components/hooks/useLocale";
import * as m from "../paraglide/messages.js";

/**
 * Prerendered to dist/404.html and served by Netlify for any unmatched path.
 *
 * Copy is inline rather than in messages/*.json because a 404 is noindex and
 * never a ranking surface — adding 6 keys to both locale files for it would be
 * noise. Every other page's copy still belongs in paraglide.
 */
export default function NotFound() {
  const isEnglish = document.documentElement.lang === "en";

  const links = [
    { href: localizeHref("/"), label: isEnglish ? "Home" : "Avaleht" },
    { href: localizeHref("/teenused/google-seo"), label: m.service_seo_title() },
    { href: localizeHref("/teenused/kodulehe-arendus"), label: m.service_development_title() },
    { href: localizeHref("/portfolio"), label: m.nav_portfolio() },
    { href: localizeHref("/audit"), label: isEnglish ? "Free audit" : "Tasuta audit" },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Helmet>
        <title>
          {isEnglish
            ? "Page not found — Kliendid Kodulehele"
            : "Lehte ei leitud — Kliendid Kodulehele"}
        </title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Navigation />

      <main className="flex-1 flex items-center justify-center px-6 py-24 lg:py-32">
        <div className="max-w-[640px] w-full text-center">
          <p className="font-['Inter'] text-[#1977f2] mb-4" style={{ fontSize: "14px", letterSpacing: "0.08em" }}>
            404
          </p>
          <h1 className="font-['Inter'] text-[#111] mb-5" style={{ fontSize: "clamp(28px, 5vw, 44px)", lineHeight: 1.15, fontWeight: 600 }}>
            {isEnglish ? "This page doesn't exist" : "Sellist lehte ei ole"}
          </h1>
          <p className="font-['Inter'] text-[#505050] mb-10" style={{ fontSize: "17px", lineHeight: 1.6 }}>
            {isEnglish
              ? "The link may be outdated or mistyped. Here's where you probably meant to go:"
              : "Link võib olla aegunud või valesti sisestatud. Tõenäoliselt otsisid midagi järgnevast:"}
          </p>

          <nav className="flex flex-wrap justify-center gap-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="font-['Inter'] text-[#111] bg-white border border-[#e4e4e4] rounded-lg px-5 py-2.5 transition-colors hover:border-[#1977f2] hover:text-[#1977f2]"
                style={{ fontSize: "15px" }}
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
      </main>

      <Footer />
    </div>
  );
}
