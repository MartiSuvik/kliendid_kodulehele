import { useEffect, useRef, useState } from "react";
import { Helmet } from "react-helmet-async";
import { motion } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import brandLogo from "../assets/logo.svg";
import { trackLead } from "../lib/analytics";
import { Footer } from "./components/Footer";
import { Navigation } from "./components/Navigation";

const AUDIT_API_URL = import.meta.env.VITE_SEO_AUDIT_API_URL ?? "/api/audits";

const isEnglish = /^\/en(\/|$)/i.test(window.location.pathname);

const copy = isEnglish
  ? {
      eyebrow: "FREE VISIBILITY CHECK",
      headline: "How many clients are you missing from Google?",
      subhead: "Enter your website. Get a simple report showing where people find you, what they search for, and where your competitors get ahead.",
      domainLabel: "Your website",
      domainPlaceholder: "yourcompany.ee",
      emailLabel: "Where should we send it?",
      emailPlaceholder: "you@company.ee",
      cta: "Show me my result",
      note: "Free · takes about 1 minute · no obligation",
      whatYouGet: "You get",
      getOne: "Your current Google positions",
      getTwo: "Searches where you are missing",
      getThree: "Whether AI recommends you",
      previewLabel: "Example result",
      googlePosition: "Google position",
      positionKeyword: "for “kakao”",
      positionSuffix: "place",
      missedIntro: "And the important part:",
      missed: "potential clients missed each month",
      simpleNote: "A simple answer. No SEO jargon.",
      successTitle: "Your report is on its way.",
      successBody: "We will check your website and send the result to your email.",
      back: "Back to website",
      language: "ET",
      title: "How many clients are you missing from Google? | Kliendid Kodulehele",
      description: "Get a free, simple visibility report for your website. See where you rank in Google and where your competitors get ahead.",
      error: "Something went wrong. Please try again.",
    }
  : {
      eyebrow: "TASUTA NÄHTAVUSE KONTROLL",
      headline: "Mitu klienti jääb sul Google'is saamata?",
      subhead: "Lihtne ülevaade sellest, kas su klient leiab sind.",
      domainLabel: "Sisesta oma koduleht",
      domainPlaceholder: "sinufirma.ee",
      emailLabel: "Mis meilile ülevaade saata?",
      emailPlaceholder: "sina@firma.ee",
      cta: "Näita minu tulemust",
      note: "Tasuta · jõuab sinuni 5 minuti jooksul",
      whatYouGet: "Saad teada ilma tehnilise jututa:",
      getOne: "Kas oled konkurentidest ees või taga",
      getTwo: "Kui taga, siis kuidas ette saada",
      getThree: "Kas kliendid leiavad sind AI-s",
      previewLabel: "Näide tulemusest",
      googlePosition: "Sa oled Googles",
      positionKeyword: "märksõnal „kakao”",
      positionSuffix: "koht",
      missedIntro: "JA KÕIGE TÄHTSAM:",
      missed: "klienti jääb kuus saamata",
      simpleNote: "Lihtne vastus ilma tehnilise jututa.",
      successTitle: "Ülevaade on teel.",
      successBody: "Su kodulehte kontrollitakse praegu. Tulemus tuleb e-mailile.",
      back: "Tagasi kodulehele",
      language: "EN",
      title: "Mitu klienti jääb sul Google'is saamata? | Kliendid Kodulehele",
      description: "Saa tasuta lihtne nähtavuse raport. Vaata, kus sinu koduleht Google'is paikneb ja kus konkurendid ette lähevad.",
      error: "Midagi läks valesti. Proovi uuesti.",
    };

const GRAIN_TEXTURE = "url(\"data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.150'/></svg>\")";

function horizonGlowBackground(ph: number) {
  const amt = 0.62;
  const dir = 1;
  const spin = ph * dir;
  const swell = 1 + Math.sin(spin * 0.8) * amt * 0.07;
  const backlight = 1 + Math.sin(spin * 0.8) * amt * 0.35;

  return [
    GRAIN_TEXTURE,
    `radial-gradient(${101 * swell}% ${49 * swell}% at 50% 100%, #fc8279 0%, #FB6A60 23.8%, #FDA096 51.4%, #F52929 79%, rgba(245, 41, 41, 0) 91%)`,
    `radial-gradient(${42.42 * backlight}% ${18.62 * backlight}% at 50% 100%, rgba(252, 158, 152, ${0.3672 * backlight}) 0%, rgba(251, 106, 96, ${0.1428 * backlight}) 38%, rgba(251, 106, 96, 0) 72%)`,
    `radial-gradient(53.53% 28.42% at 50% 100%, rgba(253, 160, 150, 0.1326) 0%, rgba(253, 160, 150, 0) 80%)`,
  ].join(", ");
}

function HorizonGlow() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = glowRef.current;
    if (!element) return;

    element.style.backgroundImage = horizonGlowBackground(0);

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let frame = 0;
    const startedAt = performance.now();
    const animate = (now: number) => {
      const t = (now - startedAt) / 1000;
      const ph = t * 0.72;
      element.style.backgroundImage = horizonGlowBackground(ph);
      frame = window.requestAnimationFrame(animate);
    };

    frame = window.requestAnimationFrame(animate);
    return () => window.cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundColor: "#F7F4EC",
        backgroundSize: "120px 120px, auto, auto, auto",
        backgroundBlendMode: "overlay, normal, normal, normal",
      }}
    />
  );
}

function ReportPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[500px]">
      <div className="absolute -inset-6 rounded-[36px] bg-[#e5484d]/[0.08] blur-2xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[28px] border border-[#e4d9da] bg-white p-4 shadow-[0_30px_80px_-42px_rgba(127,29,29,0.45)] sm:p-5">

        <div className="rounded-[22px] bg-[#e5484d] px-6 py-7 text-white sm:px-8 sm:py-9">
          <p className="font-['Inter'] text-[13px] font-medium uppercase tracking-[0.1em] text-white/75">{copy.googlePosition}</p>
          <div className="mt-3 flex items-end gap-3">
            <span className="font-['Poppins'] text-[86px] font-semibold leading-[0.84] tracking-[-0.07em]">8.</span>
            <span className="pb-1 font-['Poppins'] text-[25px] font-semibold leading-none">{copy.positionSuffix}</span>
          </div>
        </div>

        <div className="px-2 pb-2 pt-6">
          <p className="font-['Inter'] text-[13px] font-medium text-[#718096]">{copy.missedIntro}</p>
          <p className="mt-2 font-['Poppins'] text-[74px] font-semibold leading-none tracking-[-0.07em] text-[#e5484d]">184</p>
          <p className="mt-2 max-w-[250px] font-['Inter'] text-[16px] leading-6 text-[#283548]">{copy.missed}</p>
          <div className="mt-6 flex items-center gap-2 border-t border-[#edf1f6] pt-4 font-['Inter'] text-[12px] text-[#8996a6]">
            <span className="h-2 w-2 rounded-full bg-[#e5484d]" />
            {copy.simpleNote}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function GoogleAudit() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      email: String(formData.get("email") ?? ""),
      domain: String(formData.get("domain") ?? ""),
      consent: formData.get("consent") === "on",
      packageSlug: "seo-visibility-report",
      packageLabel: "Free SEO visibility report",
      submittedAt: new Date().toISOString(),
      pageUrl: window.location.href,
    };

    try {
      const response = await fetch(AUDIT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as { error?: string } | null;
        throw new Error(body?.error ?? copy.error);
      }

      form.reset();
      setIsSubmitted(true);
      trackLead("seo_visibility_report");
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : copy.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f9fc] text-[#0b1220]">
      <Helmet>
        <title>{copy.title}</title>
        <meta name="description" content={copy.description} />
        <link rel="canonical" href={isEnglish ? "https://kliendidkodulehele.ee/en/google-audit" : "https://kliendidkodulehele.ee/google-audit"} />
        <meta property="og:title" content={copy.title} />
        <meta property="og:description" content={copy.description} />
        <link rel="alternate" hrefLang="et" href="https://kliendidkodulehele.ee/google-audit" />
        <link rel="alternate" hrefLang="en" href="https://kliendidkodulehele.ee/en/google-audit" />
      </Helmet>

      <Navigation />

      <main>
        <section className="relative overflow-hidden px-6 py-16 sm:py-20 lg:px-12 lg:py-28">
          <HorizonGlow />
          <div className="relative z-10 mx-auto max-w-[920px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#fff0f0] px-3 py-1.5 font-['Inter'] text-[11px] font-semibold uppercase tracking-[0.08em] text-[#c83d43]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e5484d]" />
              {copy.eyebrow}
            </div>
            <h1 className="mx-auto max-w-[800px] font-['Poppins'] text-[clamp(40px,6vw,70px)] font-semibold leading-[1.04] tracking-[-0.045em] text-[#0b1220]">
              {copy.headline}
            </h1>
            <p className="mx-auto mt-5 max-w-[600px] font-['Inter'] text-[17px] leading-[1.55] text-[#526174] sm:text-[18px]">
              {copy.subhead}
            </p>

            <div className="mt-8">
              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="mx-auto max-w-[860px] rounded-[22px] border border-[#dfe7f2] bg-white p-5 text-left shadow-[0_24px_70px_-42px_rgba(11,31,71,0.5)] sm:p-6">
                  <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                    <label className="block">
                      <span className="mb-1.5 block px-1 font-['Inter'] text-[15px] sm:text-[12px] font-semibold text-[#526174]">{copy.domainLabel}</span>
                      <input
                        name="domain"
                        type="text"
                        required
                        autoComplete="url"
                        placeholder={copy.domainPlaceholder}
                        className="w-full rounded-xl border border-[#dbe4ef] bg-[#f8fafc] px-4 py-4 font-['Inter'] text-[18px] sm:text-[15px] text-[#0b1220] outline-none transition-colors placeholder:text-[#9aa8b8] focus:border-[#1977f2] focus:bg-white"
                      />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block px-1 font-['Inter'] text-[15px] sm:text-[12px] font-semibold text-[#526174]">{copy.emailLabel}</span>
                      <input
                        name="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder={copy.emailPlaceholder}
                        className="w-full rounded-xl border border-[#dbe4ef] bg-[#f8fafc] px-4 py-4 font-['Inter'] text-[18px] sm:text-[15px] text-[#0b1220] outline-none transition-colors placeholder:text-[#9aa8b8] focus:border-[#1977f2] focus:bg-white"
                      />
                    </label>
                  </div>
                  <div className="mt-4">
                    <label className="flex items-start gap-3">
                      <input
                        name="consent"
                        type="checkbox"
                        required
                        className="mt-1 h-5 w-5 shrink-0 rounded-sm border border-[#d1d5db] bg-white text-[#1977f2] focus:ring-2 focus:ring-[#1977f2]"
                        aria-required="true"
                      />
                      <span className="font-['Inter'] text-[15px] text-[#526174]">Nõustun, et minu andmeid kasutatakse ainult ülevaate saatmiseks.</span>
                    </label>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="group mx-auto mt-5 flex w-full max-w-[360px] items-center justify-center gap-2 rounded-xl bg-[#98b367] px-8 py-4 font-['Inter'] text-[18px] sm:text-[15px] font-semibold text-white transition-[background-color,transform] hover:bg-[#1166dd] active:scale-[0.99] disabled:cursor-wait disabled:opacity-70"
                    >
                      {isSubmitting ? "..." : copy.cta}
                      <ArrowRight size={17} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </button>

                    {submitError && <p className="px-1 pt-2 font-['Inter'] text-[12px] text-[#a64040]">{submitError}</p>}
                    <p className="px-1 pt-3 text-center font-['Inter'] text-[12px] text-[#8795a6]">{copy.note}</p>
                  </div>
                </form>
              ) : (
                <div className="mx-auto max-w-[600px] rounded-[22px] border border-[#cde9d8] bg-[#f1fbf5] p-6 text-left sm:p-7">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#2eaa65] text-white"><Check size={16} strokeWidth={2.5} /></span>
                    <div>
                      <h2 className="font-['Poppins'] text-[23px] font-semibold leading-tight text-[#0b1220]">{copy.successTitle}</h2>
                      <p className="mt-2 font-['Inter'] text-[15px] leading-6 text-[#526174]">{copy.successBody}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-6 pb-16 pt-16 sm:pb-20 lg:px-12 lg:pb-24 lg:pt-20">
          <div className="mx-auto grid max-w-[1040px] items-center gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:gap-20">
          <div className="max-w-[300px]">
            <p className="font-['Poppins'] text-[21px] font-semibold leading-tight text-[#0b1220]">{copy.whatYouGet}</p>
            <div className="mt-5 space-y-3">
              {[copy.getOne, copy.getTwo, copy.getThree].map((item) => (
                <div key={item} className="flex items-start gap-2.5 font-['Inter'] text-[13px] leading-5 text-[#526174]">
                  <Check size={15} className="mt-0.5 shrink-0 text-[#1977f2]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          >
            <ReportPreview />
          </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
