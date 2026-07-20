import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { ArrowRight, Check, ShieldCheck, ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import brandLogo from "../assets/logo.svg";
import { ContactLinksInline } from "./components/ContactLinks";
import { trackLead } from "../lib/analytics";
import { ReviewsCarousel } from "./components/ReviewsCarousel";
import { cld } from "../lib/cloudinary";

/* -------------------------------------------------------------------------- */
/*  Constants                                                                  */
/* -------------------------------------------------------------------------- */

const CONTACT_WEBHOOK_URL = "https://hook.eu1.make.com/vau19fpxdf9oh3wogukdub9arbvg3mgq";
const CANONICAL = "https://kliendidkodulehele.ee/teenused/ai-tugi";

const ink = "#0b1220";
const darkBlue = "#0b1f47";

// Locale from the URL prefix (stable; this page's Helmet overrides <html lang>).
// English copy renders on /en/...; Estonian everywhere else.
const isEnglish = /^\/en(\/|$)/i.test(window.location.pathname);

/* -------------------------------------------------------------------------- */
/*  Conversion tracking                                                        */
/* -------------------------------------------------------------------------- */

function track(event: string, detail?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  const w = window as unknown as {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
  };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...detail });
  if (typeof w.gtag === "function") w.gtag("event", event, detail || {});
}

function goToSection(id: string) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

/** Smooth-scroll to the sample form and record the CTA click. */
function scrollToForm(source: string) {
  track("sample_cta_click", { source });
  goToSection("naidis");
}

/* -------------------------------------------------------------------------- */
/*  Primitives                                                                 */
/* -------------------------------------------------------------------------- */

function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}

function Eyebrow({ children, tone = "blue" }: { children: React.ReactNode; tone?: "blue" | "light" }) {
  const color = tone === "light" ? "#7eb2ff" : "#1977f2";
  return (
    <span
      className="font-['Inter'] font-semibold uppercase"
      style={{ fontSize: "12.5px", letterSpacing: "0.1em", color }}
    >
      <span className="mr-2 inline-block h-[6px] w-[6px] rounded-full align-middle" style={{ background: color }} />
      {children}
    </span>
  );
}

function PrimaryCTA({
  source,
  children,
  className = "",
}: {
  source: string;
  children?: React.ReactNode;
  className?: string;
}) {
  const label = children ?? (isEnglish ? "Book a free AI demo" : "Broneeri tasuta AI-demo");
  return (
    <button
      type="button"
      data-event="sample_cta_click"
      onClick={() => scrollToForm(source)}
      className={`group inline-flex items-center justify-center gap-2 rounded-xl bg-[#1977f2] px-7 py-3.5 font-['Inter'] font-semibold text-white transition-[transform,background-color] duration-200 hover:bg-[#1166dd] active:scale-[0.985] ${className}`}
      style={{ fontSize: "16px", boxShadow: "0 10px 24px -12px rgba(25,119,242,0.6)" }}
    >
      {label}
      <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-0.5" />
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hand-drawn annotations — self-drawing pencil marks on scroll               */
/* -------------------------------------------------------------------------- */

const SKETCH = "#1977f2";
const drawView = { once: true, margin: "-60px" } as const;

/** Wavy hand-drawn underline. Place inside a `relative inline-block` wrapper. */
function SketchUnderline({ color = SKETCH, sw = 3, delay = 0.25, duration = 0.6 }: { color?: string; sw?: number; delay?: number; duration?: number }) {
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute left-0"
      style={{ bottom: "-0.16em", width: "100%", height: "0.42em", overflow: "visible" }}
      viewBox="0 0 300 14"
      preserveAspectRatio="none"
      fill="none"
    >
      <motion.path
        d="M3 8 C 56 2, 112 12, 168 6 C 214 1, 258 12, 297 6"
        stroke={color}
        strokeWidth={sw}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={drawView}
        transition={{ duration, ease: [0.4, 0, 0.2, 1], delay }}
      />
    </svg>
  );
}

/** Curved hand-drawn arrow with a head. Position absolutely via className/style. */
function SketchArrow({ color = SKETCH, delay = 0.3, className = "", style }: { color?: string; delay?: number; className?: string; style?: React.CSSProperties }) {
  return (
    <svg aria-hidden="true" className={`pointer-events-none ${className}`} style={style} width="100" height="78" viewBox="0 0 100 78" fill="none">
      <motion.path
        d="M10 64 C 30 70, 66 64, 84 22"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={drawView}
        transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1], delay }}
      />
      <motion.path
        d="M69 24 L 85 17 L 86 36"
        stroke={color}
        strokeWidth={2.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={drawView}
        transition={{ duration: 0.22, ease: "linear", delay: delay + 0.42 }}
      />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Minimal header                                                             */
/* -------------------------------------------------------------------------- */

function MinimalHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[#eaeef3] bg-white/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between px-5 py-3.5 lg:px-8">
        <a href="/" className="flex items-center gap-2 no-underline" aria-label="Kliendid Kodulehele">
          <img src={brandLogo} alt="" className="h-[26px] w-[26px] object-contain" />
          <span className="font-['Inter'] font-semibold tracking-tight text-[#0b1220]" style={{ fontSize: "20px" }}>
            Kliendid Kodulehele
          </span>
        </a>
        <div className="flex items-center gap-4">
          <ContactLinksInline source="service_header" className="hidden md:flex" />
          <button
            type="button"
            data-event="sample_cta_click"
            onClick={() => scrollToForm("header")}
            className="rounded-lg bg-[#0b1220] px-4 py-2.5 font-['Inter'] font-semibold text-white transition-[transform,background-color] duration-200 hover:bg-[#1b2438] active:scale-[0.98]"
            style={{ fontSize: "14px" }}
          >
            {isEnglish ? "Get a demo" : "Saa AI-demo"}
          </button>
        </div>
      </div>
    </header>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero website mockup                                                        */
/* -------------------------------------------------------------------------- */

function Bar({ w, h = 8, c = "#e6ebf2" }: { w: string; h?: number; c?: string }) {
  return <span className="block rounded-full" style={{ width: w, height: h, background: c }} />;
}

function BrowserMockup() {
  return (
    <div className="rounded-2xl border border-[#e7edf4] bg-white shadow-[0_30px_70px_-40px_rgba(15,40,90,0.45)]">
      {/* browser chrome */}
      <div className="flex items-center gap-2 border-b border-[#eef2f7] bg-[#f8fafc] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#e2766c]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#e9c46a]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#8ac0a0]" />
        <div className="ml-3 flex-1 rounded-md border border-[#e7edf4] bg-white px-3 py-1.5 font-['Inter'] text-[#9aa6b2]" style={{ fontSize: "11px" }}>
          sinuettevõte.ee
        </div>
      </div>

      {/* website content */}
      <div className="p-5 sm:p-6">
        {/* mini nav */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-5 w-5 rounded-md bg-[#1977f2]" />
            <Bar w="64px" h={8} c="#cdd9ea" />
          </div>
          <div className="flex items-center gap-3">
            <Bar w="28px" h={6} />
            <Bar w="28px" h={6} />
            <span className="rounded-md bg-[#0b1220] px-2.5 py-1 font-['Inter'] font-semibold text-white" style={{ fontSize: "9px" }}>
              Võta ühendust
            </span>
          </div>
        </div>

        {/* hero block */}
        <div className="mt-7 grid grid-cols-[1.25fr_0.75fr] gap-4">
          <div className="flex flex-col">
            <Bar w="92%" h={12} c="#0b1220" />
            <span className="mt-2 block">
              <Bar w="70%" h={12} c="#0b1220" />
            </span>
            <span className="mt-4 block">
              <Bar w="100%" h={7} />
            </span>
            <span className="mt-2 block">
              <Bar w="85%" h={7} />
            </span>
            <span className="mt-5 inline-flex w-fit items-center rounded-lg bg-[#1977f2] px-3 py-2 font-['Inter'] font-semibold text-white" style={{ fontSize: "10px" }}>
              Küsi pakkumist
            </span>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-[#eaf2ff] to-[#dbe9ff]" />
        </div>

        {/* trust row */}
        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-[#eef2f7] pt-5">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-2 rounded-lg border border-[#eef2f7] p-3">
              <Bar w="60%" h={6} c="#cdd9ea" />
              <Bar w="90%" h={5} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Section data                                                               */
/* -------------------------------------------------------------------------- */

const painRows = isEnglish
  ? [
      { title: "Inquiries get answered too late", text: "If the reply comes hours or days later, the client is often already gone." },
      { title: "Repeat questions eat your time", text: "Answering the same questions by hand takes time you could spend on the work." },
      { title: "Leads go cold after hours", text: "Inquiries that arrive after hours get no reply and vanish by morning." },
    ]
  : [
      { title: "Päringutele vastatakse liiga hilja", text: "Kui vastus tuleb tundide või päevade pärast, on klient sageli juba mujal." },
      { title: "Korduvad küsimused söövad aega", text: "Samadele küsimustele käsitsi vastamine võtab aega, mida saaks kulutada tööle." },
      { title: "Päringud jahtuvad öösel", text: "Väljaspool tööaega tulnud huvilised jäävad vastuseta ja kaovad hommikuks." },
    ];

const ordinary = [
  "Näeb okei välja",
  "Räägib ettevõttest",
  "Ei juhi inimest tegutsema",
  "Päringuid tuleb juhuslikult",
];

const converting = [
  "Näitab kohe, miks sind valida",
  "Juhib külastaja kontakti võtma",
  "Ehitab usaldust",
  "Aitab tuua rohkem müügivõimalusi",
];

const offerBlocks = isEnglish
  ? [
      { title: "A free AI demo", text: "Using your business as the example, we show how AI answers your clients and captures inquiries." },
      { title: "Instant replies, captured contacts", text: "AI answers repeat questions, qualifies leads, and collects contact details." },
      { title: "Saves time, keeps leads warm", text: "We automate inquiry capture and follow-ups so you can focus on the work." },
    ]
  : [
      { title: "Tasuta AI-demo", text: "Näitame sinu ettevõtte näitel, kuidas AI su klientidele vastab ja päringuid kogub." },
      { title: "Vastab kohe, kogub kontaktid", text: "AI vastab korduvatele küsimustele, kvalifitseerib huvilised ja kogub kontaktandmed." },
      { title: "Säästab aega ja hoiab huvi", text: "Automatiseerime päringute vastuvõtu ja järelkirjad, et sina saaksid keskenduda tööle." },
    ];

const fitFor = isEnglish
  ? [
      "You run a service business",
      "You get more inquiries than you can answer",
      "You want to reply to clients faster",
      "You get a lot of repeat questions",
      "You want inquiries sent straight to your CRM",
      "One new client is worth at least 900€",
    ]
  : [
      "Sul on teenuseettevõte",
      "Saad rohkem päringuid, kui jõuad vastata",
      "Tahad klientidele kiiremini vastata",
      "Sul on palju korduvaid küsimusi",
      "Tahad päringud otse CRM-i",
      "Üks uus klient on väärt vähemalt 900€",
    ];

const notFor = isEnglish
  ? [
      "You don't have inquiries to manage",
      "You don't need more clients",
      "You want to do everything manually",
      "You're looking for the cheapest possible option",
    ]
  : [
      "Sul pole päringuid, mida hallata",
      "Sul pole vaja rohkem kliente",
      "Tahad kõike käsitsi teha",
      "Otsid kõige odavamat lahendust",
    ];

/* -------------------------------------------------------------------------- */
/*  Form field helpers                                                         */
/* -------------------------------------------------------------------------- */

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block font-['Poppins'] text-[#6b6b6b]" style={{ fontSize: "18px" }}>
      {children}
    </label>
  );
}

function Field({
  name,
  label,
  type = "text",
  required = false,
  placeholder,
  autoComplete,
}: {
  name: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
}) {
  return (
    <div>
      <FieldLabel htmlFor={name}>{label}</FieldLabel>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full rounded-xl border border-[#d8d8d8] bg-[#efefef] px-5 py-3 font-['Poppins'] text-black outline-none"
        style={{ fontSize: "18px" }}
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Page                                                                       */
/* -------------------------------------------------------------------------- */

/* -------------------------------------------------------------------------- */
/*  Results carousel                                                           */
/* -------------------------------------------------------------------------- */

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

export default function AiTugi() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formStarted, setFormStarted] = useState(false);
  const [showSticky, setShowSticky] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const formRef = useRef<HTMLElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Mobile sticky CTA: appears after the hero, hides once the form is visible.
  useEffect(() => {
    const hero = heroRef.current;
    const form = formRef.current;
    if (!hero || !form) return;
    let pastHero = false;
    let formVisible = false;
    const update = () => setShowSticky(pastHero && !formVisible);
    const heroObs = new IntersectionObserver(([e]) => {
      pastHero = !e.isIntersecting;
      update();
    }, { threshold: 0.15 });
    const formObs = new IntersectionObserver(([e]) => {
      formVisible = e.isIntersecting;
      update();
    }, { threshold: 0.18 });
    heroObs.observe(hero);
    formObs.observe(form);
    return () => {
      heroObs.disconnect();
      formObs.disconnect();
    };
  }, []);

  const handleFormStart = () => {
    if (formStarted) return;
    setFormStarted(true);
    track("sample_form_start");
  };

  const fireConfetti = () => {
    const duration = 1800;
    const animationEnd = Date.now() + duration;
    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        window.clearInterval(interval);
        return;
      }
      const particleCount = Math.max(8, Math.floor(36 * (timeLeft / duration)));
      confetti({ particleCount, startVelocity: 26, spread: 64, origin: { x: 0.2, y: 0.7 }, colors: ["#1977f2", "#4285F4", "#9bc4ff"] });
      confetti({ particleCount, startVelocity: 26, spread: 64, origin: { x: 0.8, y: 0.7 }, colors: ["#1977f2", "#4285F4", "#9bc4ff"] });
    }, 220);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    setSubmitError(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      company: String(formData.get("company") ?? ""),
      website: String(formData.get("website") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      packageSlug: "ai-demo",
      packageLabel: "Tasuta AI-demo",
      submittedAt: new Date().toISOString(),
      pageUrl: window.location.href,
    };

    try {
      const iframeId = "make-webhook-target";
      let targetFrame = document.getElementById(iframeId) as HTMLIFrameElement | null;
      if (!targetFrame) {
        targetFrame = document.createElement("iframe");
        targetFrame.id = iframeId;
        targetFrame.name = iframeId;
        targetFrame.style.display = "none";
        document.body.appendChild(targetFrame);
      }
      const hiddenForm = document.createElement("form");
      hiddenForm.method = "POST";
      hiddenForm.action = CONTACT_WEBHOOK_URL;
      hiddenForm.target = iframeId;
      hiddenForm.style.display = "none";
      Object.entries(payload).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = String(value);
        hiddenForm.appendChild(input);
      });
      document.body.appendChild(hiddenForm);
      hiddenForm.submit();
      hiddenForm.remove();

      event.currentTarget.reset();
      setIsSubmitted(true);
      track("sample_form_submit", { value: 1 });
      trackLead("ai_tugi");
      fireConfetti();
    } catch {
      setSubmitError(
        isEnglish
          ? "Something went wrong. Please try again."
          : "Midagi läks valesti. Proovi palun uuesti.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ----------------------------------------------------------------------- */

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: isEnglish ? "AI customer support & automation" : "AI klienditugi ja automatiseerimine",
    serviceType: isEnglish ? "AI solutions and automation for service businesses" : "AI-lahendused ja automatiseerimine teenuseettevõttele",
    provider: {
      "@type": "Organization",
      name: "Kliendid Kodulehele",
      url: "https://kliendidkodulehele.ee",
    },
    areaServed: { "@type": "Country", name: "Estonia" },
    offers: {
      "@type": "Offer",
      description: isEnglish
        ? "An AI chatbot and automation for service businesses. The goal is to answer clients instantly and never lose an inquiry."
        : "AI-vestlusrobot ja automatiseerimine teenuseettevõttele. Eesmärk on vastata klientidele kohe ja mitte kaotada ühtegi päringut.",
    },
  };

  const heading = "font-['Poppins'] font-bold tracking-tight text-[#0b1220]";
  const body = "font-['Inter'] text-[#475467]";
  const container = "mx-auto max-w-[1120px] px-5 lg:px-8";

  return (
    <div className="min-h-screen bg-white" style={{ color: ink }}>
      <Helmet>
        <html lang={isEnglish ? "en" : "et"} />
        <title>
          {isEnglish
            ? "AI customer support & automation | Free AI demo"
            : "AI klienditugi ja automatiseerimine | Tasuta AI-demo"}
        </title>
        <meta
          name="description"
          content={
            isEnglish
              ? "AI that answers your clients 24/7, captures contacts, and sends them to your CRM. No inquiry goes unanswered. Book a free AI demo."
              : "AI, mis vastab su klientidele 24/7, kogub kontaktid ja saadab need CRM-i. Ükski päring ei jää enam vastuseta. Broneeri tasuta AI-demo."
          }
        />
        <link rel="canonical" href={isEnglish ? "https://kliendidkodulehele.ee/en/teenused/ai-tugi" : CANONICAL} />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={
            isEnglish
              ? "AI that never lets an inquiry slip | Free demo"
              : "AI, mis ei lase ühelgi päringul kaduda | Tasuta demo"
          }
        />
        <meta
          property="og:description"
          content={
            isEnglish
              ? "An AI chatbot and automation for service businesses — instant replies, lead qualification, straight to your CRM. A free demo before you decide."
              : "AI-vestlusrobot ja automatiseerimine teenuseettevõttele — vastab kohe, kvalifitseerib huvilised ja suunab CRM-i. Tasuta demo enne otsust."
          }
        />
        <meta property="og:url" content={isEnglish ? "https://kliendidkodulehele.ee/en/teenused/ai-tugi" : CANONICAL} />
        <meta property="og:locale" content={isEnglish ? "en_US" : "et_EE"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content={
            isEnglish
              ? "AI that never lets an inquiry slip | Free demo"
              : "AI, mis ei lase ühelgi päringul kaduda | Tasuta demo"
          }
        />
        <meta
          name="twitter:description"
          content={
            isEnglish
              ? "An AI assistant that answers your clients 24/7 and routes inquiries to your CRM. A free demo before you decide."
              : "AI-abiline, mis vastab su klientidele 24/7 ja suunab päringud CRM-i. Tasuta demo enne otsust."
          }
        />
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <MinimalHeader />

      {/* ================================================================== */}
      {/* 1. HERO                                                             */}
      {/* ================================================================== */}
      <section ref={heroRef} className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 -z-10"
          style={{ background: "radial-gradient(75% 60% at 100% 0%, #f1f6ff 0%, #ffffff 55%)" }}
        />
        <div className={`${container} grid items-center gap-14 pb-20 pt-14 lg:grid-cols-[1.02fr_0.98fr] lg:gap-16 lg:pb-28 lg:pt-24`}>
          <div>
            <Reveal delay={0.05}>
              <h1 className={`mt-5 ${heading}`} style={{ fontSize: "clamp(34px, 5vw, 54px)", lineHeight: "1.1" }}>
                {isEnglish ? (
                  <>No inquiry goes <span className="text-[#1977f2]"><span className="relative inline-block">unanswered.<SketchUnderline delay={0.45} /></span></span></>
                ) : (
                  <>Ükski päring ei jää enam <span className="text-[#1977f2]"><span className="relative inline-block">vastuseta.<SketchUnderline delay={0.45} /></span></span></>
                )}
              </h1>
            </Reveal>
            <Reveal delay={0.1}>
              <p className={`mt-6 max-w-[540px] ${body}`} style={{ fontSize: "18px", lineHeight: "1.65" }}>
                {isEnglish
                  ? "We set up an AI assistant that answers your clients instantly — day and night — and routes inquiries straight to you."
                  : "Paneme tööle AI-abilise, mis vastab su klientidele kohe — päeval ja öösel — ning suunab päringud otse sinuni."}
              </p>
            </Reveal>
            <Reveal delay={0.15}>
              <p className="mt-7 font-['Inter'] font-semibold text-[#13345f]" style={{ fontSize: "15.5px" }}>
                {isEnglish ? "Free AI demo · Answers 24/7 · Connects to your CRM" : "Tasuta AI-demo · Vastab 24/7 · Ühendub CRM-iga"}
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <span className="relative inline-block">
                  <PrimaryCTA source="hero" />
                </span>
              </div>
            </Reveal>
          </div>

          {/* Website mockup + steps */}
          <Reveal delay={0.15}>
            <div className="w-full">
              {/* Legacy browser mockup kept in the file as a fallback, hidden for now. */}
              <video
                src="/notification_1.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={isEnglish ? "Website preview animation" : "Veebilehe eelvaate animatsioon"}
                className="block h-auto w-full max-w-full object-contain object-center"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================== */}
      {/* GOOGLE REVIEWS (right after hero)                                   */}
      {/* ================================================================== */}
      <ReviewsCarousel />

      {/* ================================================================== */}
      {/* RESULTS CAROUSEL                                                    */}
      {/* ================================================================== */}
      <ResultsCarousel />

      {/* ================================================================== */}
      {/* 4. OFFER                                                            */}
      {/* ================================================================== */}
      <section id="pakkumine" className="bg-[#f8fafc] py-24 lg:py-32">
        <div className={container}>
          <div className="max-w-[720px]">
            <Reveal>
              <h2 className={heading} style={{ fontSize: "clamp(28px, 3.6vw, 40px)", lineHeight: "1.15" }}>
                {isEnglish ? "What you get working with us" : "Mida sa saad koos meiega töötades?"}
              </h2>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {offerBlocks.map((b, i) => (
              <Reveal key={b.title} delay={i * 0.07}>
                <div className="h-full rounded-2xl border border-[#e7edf4] bg-white p-7 lg:p-8">
                  <span className="font-['Poppins'] font-bold text-[#1977f2]" style={{ fontSize: "15px", letterSpacing: "0.04em" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-['Poppins'] font-semibold text-[#0b1220]" style={{ fontSize: "19px", lineHeight: "1.3" }}>
                    {b.title}
                  </h3>
                  <p className={`mt-2.5 ${body}`} style={{ fontSize: "15px", lineHeight: "1.65" }}>
                    {b.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Price card */}
          <Reveal delay={0.1}>
            <div className="mt-8 overflow-hidden rounded-3xl border border-[#1977f2] bg-white">
              <div className="grid gap-8 p-8 lg:grid-cols-[1.1fr_auto] lg:items-center lg:p-12">
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-['Poppins'] font-bold text-[#0b1220]" style={{ fontSize: "clamp(38px, 6vw, 52px)", lineHeight: "1" }}>
                      <span className="relative inline-block">{isEnglish ? "Free AI demo" : "Tasuta AI-demo"}</span>
                    </span>
                  </div>
                  <ul className="mt-5 space-y-2.5">
                    {(isEnglish
                      ? [
                          "An AI assistant that answers your clients",
                          "Available 24/7, even after hours",
                          "Qualifies inquiries and routes them to your CRM",
                          "A demo built around your business",
                        ]
                      : [
                          "AI-abiline, mis vastab su klientidele",
                          "Vastab 24/7, ka väljaspool tööaega",
                          "Kvalifitseerib päringud ja suunab CRM-i",
                          "Demo sinu ettevõtte näitel",
                        ]
                    ).map((t) => (
                      <li key={t} className="flex items-center gap-3">
                        <Check size={17} className="shrink-0 text-[#1977f2]" />
                        <span className="font-['Inter'] text-[#344054]" style={{ fontSize: "15.5px" }}>
                          {t}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative flex flex-col items-start gap-3 lg:items-end">
                  <PrimaryCTA source="pricing" className="w-full sm:w-auto">
                    {isEnglish ? "Book a free demo" : "Broneeri tasuta demo"}
                  </PrimaryCTA>
                  <p className="max-w-[320px] font-['Inter'] text-[#475569] lg:text-right" style={{ fontSize: "13px", lineHeight: "1.55" }}>
                    {isEnglish
                      ? "The demo carries no obligation. Before you decide, you'll see how AI would work in your business."
                      : "Demo ei kohusta ostma. Näed enne otsust, kuidas AI sinu ettevõttes töötaks."}
                  </p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 2. PROBLEM                                                          */}
      {/* ================================================================== */}
      <section className="bg-[#f8fafc] py-24 lg:py-32">
        <div className={container}>
          <div className="max-w-[720px]">
            <Reveal>
              <h2 className={heading} style={{ fontSize: "clamp(28px, 3.6vw, 40px)", lineHeight: "1.15" }}>
                {isEnglish ? (
                  <>"We can't reply to everyone" - <span className="relative inline-block">sound familiar?<SketchUnderline delay={0.3} /></span></>
                ) : (
                  <>"Me ei jõua kõigile vastata" - <span className="relative inline-block">tuttav mure?<SketchUnderline delay={0.3} /></span></>
                )}
              </h2>
            </Reveal>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-2xl border border-[#e7edf4] bg-[#e7edf4] sm:grid-cols-3">
            {painRows.map((row, i) => (
              <Reveal key={row.title} delay={i * 0.07} className="h-full">
                <div className="flex h-full flex-col bg-white p-7 lg:p-8">
                  <span className="font-['Poppins'] font-bold text-[#cdd9ea]" style={{ fontSize: "22px" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-4 font-['Poppins'] font-semibold text-[#0b1220]" style={{ fontSize: "18px", lineHeight: "1.3" }}>
                    {row.title}
                  </h3>
                  <p className={`mt-2.5 ${body}`} style={{ fontSize: "15px", lineHeight: "1.65" }}>
                    {row.text}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 3. REFRAME           {/*                                                
      <section className="py-24 lg:py-32">
        <div className={container}>
          <div className="max-w-[720px]">
            <Reveal>
              <h2 className={heading} style={{ fontSize: "clamp(28px, 3.6vw, 40px)", lineHeight: "1.15" }}>
                Mis vahe on kodulehel ja kodulehel mis <span className="relative inline-block">teenib sulle raha<SketchUnderline delay={0.3} /></span>?
              </h2>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-[#e7edf4] bg-[#fbfcfe] p-8 lg:p-9">
                <h3 className="font-['Poppins'] font-semibold text-[#475467]" style={{ fontSize: "20px" }}>
                  Tavaline koduleht
                </h3>
                <ul className="mt-6 space-y-4">
                  {ordinary.map((t) => (
                    <li key={t} className="flex items-center gap-3.5">
                      <span className="h-[2px] w-3.5 shrink-0 rounded-full bg-[#c4ccd6]" />
                      <span className="font-['Inter'] text-[#667085]" style={{ fontSize: "16px" }}>
                        {t}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div
                className="h-full rounded-2xl border border-[#cfe1ff] p-8 lg:p-9"
                style={{ background: "linear-gradient(180deg, #f3f8ff 0%, #eaf2ff 100%)" }}
              >
                <h3 className="font-['Poppins'] font-semibold text-[#0b1220]" style={{ fontSize: "20px" }}>
                  Koduleht, mis toob päringuid
                </h3>
                <ul className="mt-6 space-y-4">
                  {converting.map((t) => (
                    <li key={t} className="flex items-center gap-3.5">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#1977f2]">
                        <Check size={13} className="text-white" />
                      </span>
                      <span className="font-['Inter'] font-medium text-[#13345f]" style={{ fontSize: "16px" }}>
                        {t}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-10">
              <span className="relative inline-block">
                <PrimaryCTA source="reframe" />
                <SketchCircle delay={0.3} padX={15} padY={10} />
              </span>
            </div>
          </Reveal>
        </div>
      </section>
            ================================================================== */}

      {/* ================================================================== */}
      {/* 5. OUTCOME                                                          */}
      {/* ================================================================== */}
      <section className="py-24 lg:py-32">
        <div className={`${container} max-w-[820px]`}>
          <Reveal>
            <h2 className={heading} style={{ fontSize: "clamp(28px, 3.6vw, 40px)", lineHeight: "1.15" }}>
              {isEnglish ? "How much is one new client worth to you?" : "Kui palju on üks uus klient sulle väärt?"}
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <div className={`mt-6 space-y-4 ${body}`} style={{ fontSize: "17px", lineHeight: "1.7" }}>
              <p>
                {isEnglish
                  ? "If one new client is worth 900€, 1500€ or more to your business, just a couple of saved inquiries make the AI solution pay for itself."
                  : "Kui üks uus klient on sinu ettevõttele väärt 900€, 1500€ või rohkem, siis piisab paarist päästetud päringust, et AI-lahendus end ära tasuks."}
              </p>
              <p className="font-semibold text-[#0b1220]">
                {isEnglish ? "Often one missed inquiry is all it takes." : "Tihti piisab ühest vastamata jäänud päringust."}
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-col items-stretch gap-0 overflow-hidden rounded-2xl border border-[#d6e6ff] sm:flex-row sm:items-center">
              <div className="flex items-center justify-center bg-[#eff5ff] px-7 py-6">
                <span className="font-['Poppins'] font-bold text-[#13345f]" style={{ fontSize: "20px" }}>
                  {isEnglish ? "1 saved inquiry" : "1 päästetud päring"}
                </span>
              </div>
              <div className="flex items-center gap-3 px-7 py-6">
                <ArrowRight size={20} className="shrink-0 text-[#1977f2]" />
                <span className="font-['Inter'] font-medium text-[#0b1220]" style={{ fontSize: "17px" }}>
                  {isEnglish ? (
                    <>can cover <span className="relative inline-block">the entire cost of the solution<SketchUnderline delay={0.3} sw={2.5} /></span></>
                  ) : (
                    <>võib katta <span className="relative inline-block">kogu lahenduse hinna<SketchUnderline delay={0.3} sw={2.5} /></span></>
                  )}
                </span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <p className="mt-8 max-w-[680px] font-['Inter'] text-[#0b1220]" style={{ fontSize: "17px", lineHeight: "1.6" }}>
              {isEnglish
                ? "Our goal isn't just a chatbot. Our goal is that no good inquiry is ever lost because the reply came too late."
                : "Meie eesmärk ei ole lihtsalt vestlusrobot. Meie eesmärk on, et ükski hea päring ei läheks kaduma, sest vastus tuli liiga hilja."}
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-8">
              <PrimaryCTA source="outcome">{isEnglish ? "Book a free demo" : "Broneeri tasuta demo"}</PrimaryCTA>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 6. FIT                                                              */}
      {/* ================================================================== */}
      <section className="bg-[#f8fafc] py-24 lg:py-32">
        <div className={container}>
          <div className="max-w-[720px]">
            <Reveal>
              <h2 className={heading} style={{ fontSize: "clamp(28px, 3.6vw, 40px)", lineHeight: "1.15" }}>
                {isEnglish ? "Who is this for?" : "Kellele see sobib?"}
              </h2>
            </Reveal>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-2xl border border-[#cfe1ff] bg-white p-8 lg:p-9">
                <h3 className="font-['Poppins'] font-semibold text-[#0b1220]" style={{ fontSize: "20px" }}>
                  <span className="relative inline-block">{isEnglish ? "A good fit if…" : "Sobib, kui…"}<SketchUnderline delay={0.25} /></span>
                </h3>
                <ul className="mt-6 space-y-3.5">
                  {fitFor.map((t) => (
                    <li key={t} className="flex items-start gap-3.5">
                      <span className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-[#1977f2]" />
                      <span className="font-['Inter'] text-[#344054]" style={{ fontSize: "16px", lineHeight: "1.5" }}>
                        {t}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>

            <Reveal delay={0.08}>
              <div className="h-full rounded-2xl border border-[#e7edf4] bg-[#fbfcfe] p-8 lg:p-9">
                <h3 className="font-['Poppins'] font-semibold text-[#475467]" style={{ fontSize: "20px" }}>
                  {isEnglish ? "Not a fit if…" : "Ei sobi, kui…"}
                </h3>
                <ul className="mt-6 space-y-3.5">
                  {notFor.map((t) => (
                    <li key={t} className="flex items-start gap-3.5">
                      <span className="mt-[9px] h-2 w-2 shrink-0 rounded-full bg-[#c4ccd6]" />
                      <span className="font-['Inter'] text-[#667085]" style={{ fontSize: "16px", lineHeight: "1.5" }}>
                        {t}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* 7. FINAL CTA + FORM                                                 */}
      {/* ================================================================== */}
      <section ref={formRef} id="naidis" className="relative overflow-hidden" style={{ background: darkBlue }}>
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(70% 80% at 15% 0%, rgba(25,119,242,0.4) 0%, rgba(11,31,71,0) 60%)" }}
        />
        <div className={`${container} relative grid gap-12 py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-28`}>
          {/* Copy */}
          <div>
            <Reveal>
              <Eyebrow tone="light">{isEnglish ? "Free demo" : "Tasuta demo"}</Eyebrow>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="mt-5 font-['Poppins'] font-bold tracking-tight text-white" style={{ fontSize: "clamp(28px, 3.8vw, 42px)", lineHeight: "1.15" }}>
                {isEnglish ? "Want to see how AI would answer your clients?" : "Tahad näha, kuidas AI sinu klientidele vastaks?"}
              </h2>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[460px] font-['Inter'] text-white/70" style={{ fontSize: "16.5px", lineHeight: "1.7" }}>
                {isEnglish
                  ? "Book a free AI demo. Using your business as the example, we'll show how AI replies instantly and captures inquiries."
                  : "Broneeri tasuta AI-demo. Näitame sinu ettevõtte näitel, kuidas AI vastab kohe ja kogub päringuid."}
              </p>
            </Reveal>
          </div>

          {/* Form card */}
          <Reveal delay={0.1}>
            <div className="rounded-3xl bg-white p-6 sm:p-8">
              {!isSubmitted ? (
                <>
                  <h3 className="font-['Poppins'] font-bold text-[#0b1220]" style={{ fontSize: "24px" }}>
                    {isEnglish ? (
                      <>Book a free <span className="relative inline-block">AI demo<SketchUnderline delay={0.3} /></span></>
                    ) : (
                      <>Broneeri tasuta <span className="relative inline-block">AI-demo<SketchUnderline delay={0.3} /></span></>
                    )}
                  </h3>
                  <p className="mt-2 font-['Inter'] text-[#667085]" style={{ fontSize: "14.5px", lineHeight: "1.6" }}>
                    {isEnglish ? "The demo carries no obligation. We reply personally." : "Demo ei kohusta ostma. Vastame personaalselt."}
                  </p>

                  <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit} onFocus={handleFormStart} data-event="sample_form_start">
                    <Field name="company" label={isEnglish ? "Company" : "Ettevõte"} required autoComplete="organization" />
                    <Field name="website" label={isEnglish ? "Current website" : "Praegune koduleht"} placeholder={isEnglish ? "yoursite.com" : "nainenaide.ee"} required autoComplete="url" />
                    <Field name="email" label={isEnglish ? "Email" : "E-post"} type="email" required autoComplete="email" />
                    <Field name="phone" label={isEnglish ? "Phone" : "Telefon"} type="tel" required autoComplete="tel" />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      data-event="sample_form_submit"
                      className="mt-3 cursor-pointer rounded-xl bg-[#2d2d2d] px-6 py-3 font-['Poppins'] font-medium text-white transition-colors hover:bg-[#1f1f1f] disabled:opacity-60"
                      style={{ fontSize: "22px" }}
                    >
                      {isSubmitting
                        ? isEnglish
                          ? "Sending…"
                          : "Saadan…"
                        : isEnglish
                          ? "I want a free demo"
                          : "Soovin tasuta demot"}
                    </button>

                    {submitError && (
                      <p className="mt-1 font-['Poppins'] text-[#505050]" style={{ fontSize: "14px" }}>
                        {submitError}
                      </p>
                    )}

                    <p className="flex items-center gap-2 font-['Poppins'] text-[#475569]" style={{ fontSize: "12.5px" }}>
                      <ShieldCheck size={15} className="text-[#1977f2]" />
                      {isEnglish
                        ? "We use your details only to prepare the demo and to get in touch with you."
                        : "Sinu andmeid kasutame ainult demo tegemiseks ja sinuga ühenduse võtmiseks."}
                    </p>
                  </form>
                </>
              ) : (
                <div className="flex min-h-[380px] flex-col items-center justify-center text-center">
                  <span className="grid h-16 w-16 place-items-center rounded-full bg-[#eaf2ff]">
                    <Check size={30} className="text-[#1977f2]" />
                  </span>
                  <h3 className="mt-6 font-['Poppins'] font-bold text-[#0b1220]" style={{ fontSize: "26px", lineHeight: "1.2" }}>
                    {isEnglish ? "Thank you!" : "Aitäh!"}
                  </h3>
                  <p className="mt-3 max-w-[360px] font-['Poppins'] text-[#667085]" style={{ fontSize: "16px", lineHeight: "1.6" }}>
                    {isEnglish
                      ? "We'll review your details and get in touch soon."
                      : "Vaatame sinu info üle ja võtame sinuga peagi ühendust."}
                  </p>
                </div>
              )}
            </div>
          </Reveal>
        </div>

        {/* footer */}
        <div className="relative border-t border-white/10">
          <div className={`${container} flex flex-col items-center justify-between gap-3 py-7 sm:flex-row`}>
            <div className="flex items-center gap-2">
              <img src={brandLogo} alt="" className="h-[22px] w-[22px] object-contain" />
              <span className="font-['Inter'] font-semibold text-white" style={{ fontSize: "16px" }}>
                Kliendid Kodulehele
              </span>
            </div>
            <p className="font-['Inter'] text-white/40" style={{ fontSize: "12.5px" }}>
              © {new Date().getFullYear()} Kliendid Kodulehele · {isEnglish ? "AI solutions for service businesses" : "AI-lahendused teenuseettevõttele"}
            </p>
          </div>
        </div>
      </section>

      {/* ================================================================== */}
      {/* Mobile sticky CTA                                                   */}
      {/* ================================================================== */}
      <div
        className={`fixed inset-x-0 bottom-0 z-50 border-t border-[#eaeef3] bg-white/95 p-3 backdrop-blur-md transition-transform duration-300 lg:hidden ${
          showSticky ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
      >
        <button
          type="button"
          data-event="sample_cta_click"
          onClick={() => scrollToForm("sticky_mobile")}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1977f2] px-6 py-3.5 font-['Inter'] font-semibold text-white active:scale-[0.99]"
          style={{ fontSize: "16px" }}
        >
          {isEnglish ? "Book a free demo" : "Broneeri tasuta demo"}
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Hero step pill                                                             */
/* -------------------------------------------------------------------------- */

function StepPill({ index, children }: { index: number; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2.5 rounded-full border border-[#e7edf4] bg-white py-2 pl-2 pr-4 shadow-[0_12px_30px_-16px_rgba(15,40,90,0.4)]">
      <span className="grid h-7 w-7 place-items-center rounded-full bg-[#1977f2] font-['Poppins'] font-bold text-white" style={{ fontSize: "13px" }}>
        {index}
      </span>
      <span className="font-['Inter'] font-medium text-[#0b1220]" style={{ fontSize: "13.5px" }}>
        {children}
      </span>
    </span>
  );
}
