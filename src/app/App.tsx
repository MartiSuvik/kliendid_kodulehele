import { Helmet } from "react-helmet-async";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { CaseStudies } from "./components/CaseStudies";
import { GoogleReviews } from "./components/GoogleReviews";
import { FAQ } from "./components/FAQ";
import { Pricing } from "./components/Pricing";
import { Footer } from "./components/Footer";
import { useScrollProgress } from "./components/hooks/useAnimations";
import * as m from "../paraglide/messages.js";
import { TestimonialsSpotlight } from "./components/TestimonialsSpotlight";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { useRef } from "react";
import { cld } from "../lib/cloudinary";

function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={className}
      style={{
        animation: `revealUp 0.7s ease-out ${delay}s both`,
      }}
    >
      {children}
    </div>
  );
}

declare global {
  interface CSSProperties {
    animation?: string;
  }
}

export default function App() {
  const progress = useScrollProgress();
  const isEnglish = document.documentElement.lang === "en";
  const canonical = isEnglish ? "https://kliendidkodulehele.ee/en/" : "https://kliendidkodulehele.ee/";

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": ["ProfessionalService", "LocalBusiness"],
    "name": "Kliendid Kodulehele",
    "legalName": "EFFI AI SOLUTIONS OÜ",
    "url": "https://kliendidkodulehele.ee",
    "logo": "https://kliendidkodulehele.ee/logo.svg",
    "image": "https://kliendidkodulehele.ee/logo.svg",
    "description": "SEO, veebidisain ja AI-lahendused Tallinnas. Aitame teenusettevõtetel saada kliente prognoositavalt.",
    "areaServed": {
      "@type": "Country",
      "name": "Estonia"
    },
    "priceRange": "€€",
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"],
        "opens": "09:00",
        "closes": "18:00"
      }
    ]
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "url": "https://kliendidkodulehele.ee",
    "name": "Kliendid Kodulehele"
  };

// e_trim crops the white padding around each wordmark so logos read at a usable size.
// w_360 caps delivery at ~2× the rendered size (max-h-9 / max-w-[180px]).
const LOGO_V = "v1782485171";
const logo = (id: string) => cld(`${LOGO_V}/${id}`, { prefix: "e_trim", w: 360 });

// `label` is Estonian (shown on /); `labelEn` is shown on /en/.
const results: { company: string; value: number; label: string; labelEn: string; logo: string | null }[] = [
  { company: "Centrumfoto", value: 32, label: "uut klienti", labelEn: "new clients", logo: logo("1_xnojog.png") },
  { company: "Kundalini Kakao", value: 17, label: "uut klienti e-poodi", labelEn: "new e-shop customers", logo: logo("2_pdy1xc.png") },
  { company: "Türi Elamuspark", value: 28, label: "uut külastajat seiklusparki", labelEn: "new adventure-park visitors", logo: null },
  { company: "Haage Autoteenindus", value: 12, label: "päringut", labelEn: "inquiries", logo: logo("3_tutlcu.png") },
  { company: "Citysightseeing", value: 23, label: "uut piletiostu", labelEn: "new ticket purchases", logo: logo("4_ugjsys.png") },
  { company: "Lõuna-Eesti Arborist", value: 8, label: "uut päringut", labelEn: "new inquiries", logo: logo("5_ophjsz.png") },
];

/** Small rising trend line — "growth after we came". */
function Sparkline() {
  return (
    <svg viewBox="0 0 120 40" preserveAspectRatio="none" fill="none" aria-hidden="true" className="w-full" style={{ height: 40 }}>
      <path d="M2 35 L22 31 L42 32 L62 23 L82 24 L102 13 L118 6 L118 40 L2 40 Z" fill="rgba(25,119,242,0.07)" />
      <path
        d="M2 35 L22 31 L42 32 L62 23 L82 24 L102 13 L118 6"
        stroke="#1977f2"
        strokeWidth={2.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function ResultsCarousel() {
  // URL-prefix locale detection (stable across re-renders).
  const isEnglish = /^\/en(\/|$)/i.test(window.location.pathname);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="py-24 lg:py-32">
      <div className="mx-auto max-w-[1120px] px-5 lg:px-8">
        <div className="flex items-end justify-between gap-6">
          <div className="max-w-[720px]">
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-['Poppins'] font-bold tracking-tight text-[#0b1220]" style={{ fontSize: "clamp(28px, 3.6vw, 40px)", lineHeight: "1.15" }}>
                {isEnglish ? "What happens after working with us" : "Mis juhtub pärast meiega koostööd"}
              </h2>
            </Reveal>
          </div>

          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              aria-label={isEnglish ? "Previous" : "Eelmine"}
              onClick={() => scrollByCards(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#0b1220] transition-colors hover:border-[#1977f2] hover:text-[#1977f2]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label={isEnglish ? "Next" : "Järgmine"}
              onClick={() => scrollByCards(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#0b1220] transition-colors hover:border-[#1977f2] hover:text-[#1977f2]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-12 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {results.map((r, i) => (
            <Reveal key={r.company} delay={(i % 3) * 0.06} className="snap-start shrink-0">
              <article data-card className="flex w-[280px] flex-col rounded-2xl border border-[#e7edf4] bg-white p-6 sm:w-[332px]">
                <div className="flex h-9 items-center">
                  {r.logo ? (
                    <img
                      src={r.logo}
                      alt={r.company}
                      loading="lazy"
                      decoding="async"
                      className="max-h-9 w-auto max-w-[180px] object-contain object-left"
                    />
                  ) : (
                    <span className="font-['Poppins'] font-semibold text-[#0b1220]" style={{ fontSize: "18px", lineHeight: "1.1" }}>
                      {r.company}
                    </span>
                  )}
                </div>

                <div className="mt-6">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-['Poppins'] font-bold text-[#1977f2]" style={{ fontSize: "46px", lineHeight: "1" }}>
                      +{r.value}
                    </span>
                    <span className="mt-1.5 inline-flex shrink-0 items-center gap-1 rounded-full bg-[#eaf7ee] px-2.5 py-1 font-['Inter'] font-semibold text-[#166534]" style={{ fontSize: "11px" }}>
                      <TrendingUp size={12} /> {isEnglish ? "Growth" : "Kasv"}
                    </span>
                  </div>
                  <p className="mt-2.5 font-['Inter'] font-medium text-[#0b1220]" style={{ fontSize: "16px", lineHeight: "1.35" }}>
                    {isEnglish ? `${r.labelEn} per month` : `${r.label} iga kuu`}
                  </p>
                  <p className="mt-1 font-['Inter'] text-[#475569]" style={{ fontSize: "13.5px" }}>
                    {isEnglish ? "thanks to our work" : "tänu meie tehtud tööle"}
                  </p>
                </div>

                <div className="mt-6 border-t border-[#eef2f7] pt-4">
                  <Sparkline />
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
  
  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>{m.meta_title()}</title>
        <meta name="description" content={m.meta_description()} />
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={m.meta_title()} />
        <meta property="og:description" content={m.meta_og_description()} />
        <meta property="og:url" content={canonical} />
        <meta name="twitter:title" content={m.meta_title()} />
        <meta name="twitter:description" content={m.meta_og_description()} />
        <link rel="alternate" hrefLang="et" href="https://kliendidkodulehele.ee/" />
        <link rel="alternate" hrefLang="en" href="https://kliendidkodulehele.ee/en/" />
        <link rel="alternate" hrefLang="x-default" href="https://kliendidkodulehele.ee/" />
        <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      </Helmet>
      {/* 10. Scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-[3px] bg-[#1977f2] z-[100] transition-none"
        style={{ width: `${progress * 100}%` }}
      />
      <Navigation />
      <Hero />
      <TestimonialsSpotlight />
      <ResultsCarousel />
      <About />
      <FAQ />
      <Footer />
    </div>
  );
}
