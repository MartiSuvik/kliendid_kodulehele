import { useState } from "react";
import { motion } from "motion/react";
import confetti from "canvas-confetti";
import { cld, cldSrcSet } from "../../lib/cloudinary";
import { trackLead } from "../../lib/analytics";
import * as m from "../../paraglide/messages.js";

const CONTACT_WEBHOOK_URL = "https://hook.eu1.make.com/vau19fpxdf9oh3wogukdub9arbvg3mgq";

const YT_VIDEO_ID = "0X7_ijQXQCA";
const HERO_VIDEO_PUBLIC_ID = "kliendidkodulehele_hero_video";
const HERO_VIDEO_PREVIEW_SRC = `https://res.cloudinary.com/dl4bzhitw/video/upload/f_auto,q_auto:low,w_480,so_0,eo_4/${HERO_VIDEO_PUBLIC_ID}.mp4`;
const HERO_VIDEO_PLAYER_SRC = `https://player.cloudinary.com/embed/?cloud_name=dl4bzhitw&public_id=${HERO_VIDEO_PUBLIC_ID}&autoplay=true`;

/** Centered play glyph (+ optional caption) shared by both click-to-play video variants. */
function PlayOverlay({ label }: { label?: string }) {
  return (
    <span className="absolute inset-0 flex flex-col items-center justify-center gap-3">
      <span className="flex items-center justify-center w-16 h-16 rounded-full bg-white/90 group-hover:bg-white group-hover:scale-110 transition-all shadow-lg">
        <svg className="w-14 h-14 text-[#1977f2] ml-1" viewBox="0 0 24 24" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
      {label && (
        <span
          className="rounded-full bg-black/55 px-3.5 py-1.5 font-['Inter'] font-medium text-white backdrop-blur-sm"
          style={{ fontSize: "13.5px" }}
        >
          {label}
        </span>
      )}
    </span>
  );
}

function LiteYouTube({ videoId }: { videoId: string }) {
  const [active, setActive] = useState(false);
  const thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  if (active) {
    return (
      <iframe
        className="w-full h-full absolute inset-0"
        src={`https://www.youtube.com/embed/${videoId}?si=rHK23xG88QAc9GLO&controls=0&autoplay=1`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    );
  }

  return (
    <button
      className="w-full h-full absolute inset-0 flex items-center justify-center group cursor-pointer border-0 p-0 bg-transparent"
      onClick={() => setActive(true)}
      aria-label="Play video"
    >
      <img
        src={thumb}
        alt="Video thumbnail"
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(e) => {
          // hqdefault.jpg 403s for some videos — fall back once to mqdefault.
          const img = e.currentTarget;
          if (!img.dataset.fallback) {
            img.dataset.fallback = "1";
            img.src = `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`;
          }
        }}
      />
      <PlayOverlay />
    </button>
  );
}

/**
 * Estonian hero video: a ~125KB muted 4s loop (trimmed + q_auto:low, 480px wide)
 * stands in for the ~42MB Cloudinary player, which only loads once clicked.
 */
function LiteCloudinaryVideo() {
  const [active, setActive] = useState(false);

  if (active) {
    return (
      <iframe
        src={HERO_VIDEO_PLAYER_SRC}
        className="w-full h-full absolute inset-0"
        style={{ aspectRatio: "640 / 360" }}
        allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
        allowFullScreen
        frameBorder="0"
        title="Kliendid Kodulehele hero video"
      />
    );
  }

  return (
    <button
      className="w-full h-full absolute inset-0 flex items-center justify-center group cursor-pointer border-0 p-0 bg-transparent"
      onClick={() => setActive(true)}
      aria-label="Käivita video"
    >
      <video
        src={HERO_VIDEO_PREVIEW_SRC}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full h-full object-cover"
      />
      <PlayOverlay label="Vajuta vaatamiseks" />
    </button>
  );
}

const brandLogos = [
  { name: "Lottemaa", url: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1785872040/7_lj7ue8.png" },
  { name: "Elitekliinik", url: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1785872039/8_mfcukt.png" },
  { name: "Citysightseeing", url: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1782485171/4_ugjsys.png" },
  { name: "Cityproperty", url: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1782485171/6_dmafk2.png" },
  { name: "Haage Autoteenindus", url: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1782485171/3_tutlcu.png" },
  { name: "Centrumfoto", url: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1782485171/1_xnojog.png" },
  { name: "Tõstukikeskus", url: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1777195593/4_uojv1x.png" },
  { name: "Sininevalgus", url: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1777195593/2_myphby.png" },
];

export function Hero() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    // Capture before any async/state work — React nulls currentTarget after the handler.
    const form = event.currentTarget;
    const formData = new FormData(form);

    setIsSubmitting(true);
    setSubmitError(null);

    const payload = {
      email: String(formData.get("email") ?? ""),
      website: String(formData.get("website") ?? ""),
      packageSlug: "avaleht-hero",
      packageLabel: "Homepage hero form",
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
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.name = key;
        hiddenInput.value = String(value);
        hiddenForm.appendChild(hiddenInput);
      });

      document.body.appendChild(hiddenForm);
      hiddenForm.submit();
      hiddenForm.remove();

      form.reset();
      setIsSubmitted(true);
      trackLead("hero_form");
      confetti({ particleCount: 90, spread: 70, startVelocity: 32, origin: { y: 0.45 } });
    } catch {
      setSubmitError(m.contact_error());
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClass =
    "w-full rounded-xl border border-[#dcdcdc] bg-[#fafafa] px-5 h-[58px] font-['Poppins'] text-black " +
    "placeholder:text-[#9a9a9a] outline-none transition-colors duration-200 " +
    "focus:border-[#1977f2] focus:bg-white focus:ring-4 focus:ring-[#1977f2]/15";

  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-16 pt-8 pb-8 lg:pt-12 lg:pb-12">
        {/* Headline + lead form — stacked, form-first for paid traffic */}
        <div className="max-w-[680px] mx-auto text-center">
          {/* The H1 is the category phrase, because that is what the page needs
              to rank for. The emotional headline below still does the selling —
              it is unchanged visually, just no longer the H1. */}
          <h1
            className="font-['Poppins'] font-semibold uppercase text-[#1977f2] mb-4"
            style={{ fontSize: "12px", letterSpacing: "0.14em" }}
          >
            {m.hero_h1()}
          </h1>

          <p
            className="font-['Poppins'] text-black font-semibold text-[28px] lg:text-[38px] mb-7"
            style={{ lineHeight: "1.18", letterSpacing: "-0.02em" }}
          >
            {m.hero_headline()}
          </p>

          <div className="max-w-[520px] mx-auto">
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 text-left">
                <label htmlFor="hero-email" className="sr-only">
                  {m.hero_form_email_label()}
                </label>
                <input
                  id="hero-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  placeholder={m.hero_form_email_placeholder()}
                  className={fieldClass}
                  style={{ fontSize: "16px" }}
                />

                <label htmlFor="hero-website" className="sr-only">
                  {m.hero_form_website_label()}
                </label>
                <input
                  id="hero-website"
                  name="website"
                  type="text"
                  inputMode="url"
                  autoComplete="url"
                  placeholder={m.hero_form_website_placeholder()}
                  className={fieldClass}
                  style={{ fontSize: "16px" }}
                />

                {/* Fat primary CTA — keeps the site's signature gradient glow */}
                <div className="relative group mt-1">
                  <div className="pointer-events-none absolute -inset-px rounded-xl bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 blur-lg opacity-60 transition-opacity duration-1000 group-hover:opacity-100 group-hover:duration-200" />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="relative w-full bg-[#1977f2] text-white font-['Poppins'] font-semibold rounded-xl px-8 py-[22px] cursor-pointer hover:bg-[#0f66d8] disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
                    style={{ fontSize: "18px", letterSpacing: "-0.01em" }}
                  >
                    {isSubmitting ? m.hero_form_submitting() : m.hero_form_submit()}
                  </button>
                </div>

                <p
                  className="font-['Inter'] text-[#8a8a8a] text-center mt-1"
                  style={{ fontSize: "13px" }}
                >
                  {m.hero_form_note()}
                </p>

                {submitError && (
                  <p className="font-['Poppins'] text-[#c0392b] text-center" style={{ fontSize: "14px" }}>
                    {submitError}
                  </p>
                )}
              </form>
            ) : (
              <div className="rounded-2xl border border-[#d7e7fb] bg-[#f2f8ff] px-6 py-8">
                <h2
                  className="font-['Poppins'] font-semibold text-black mb-2"
                  style={{ fontSize: "24px", lineHeight: "1.25" }}
                >
                  {m.contact_success_heading()}
                </h2>
                <p className="font-['Poppins'] text-[#505050]" style={{ fontSize: "16px", lineHeight: "1.6" }}>
                  {m.contact_success_body()}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Video — directly under the form */}
        <div className="w-full max-w-[820px] mx-auto mt-12 lg:mt-14">
          <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
            {document.documentElement.lang === "en" ? (
              <LiteYouTube videoId={YT_VIDEO_ID} />
            ) : (
              <LiteCloudinaryVideo />
            )}
          </div>
        </div>

        {/* Trust badges 
        <div className="flex flex-wrap gap-3 mt-10">
          {[
            { icon: CheckCircle, text: m.hero_badge_clients() },
            { icon: Users, text: m.hero_badge_experience() },
            { icon: Zap, text: m.hero_badge_results() },
          ].map((badge, i) => (
            <motion.div
              key={i}
              className="bg-[#f5f5f5] rounded-xl px-5 py-4 flex items-center gap-3 flex-1 min-w-[200px]"
              initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
            >
              <badge.icon size={18} className="text-green-500 shrink-0" />
              <span className="font-['Poppins'] font-medium text-black" style={{ fontSize: '14px' }}>{badge.text}</span>
            </motion.div>
          ))}
        </div>*/}

        {/* Brands marquee */}
        <div className="mt-10 lg:mt-12">
          <p
            className="font-['Inter'] text-[#707070] text-center mb-4"
            style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase" }}
          >
            {m.hero_brands_label()}
          </p>

          <div className="relative overflow-hidden rounded-2xl border border-[#ececec] bg-[#fafafa] py-4 lg:py-5">
            <div className="logo-marquee-fade-left" aria-hidden="true" />
            <div className="logo-marquee-fade-right" aria-hidden="true" />

            <div className="logo-marquee-track">
              {[...brandLogos, ...brandLogos].map((logo, index) => (
                <div
                  key={`${logo.name}-${index}`}
                  className="h-12 lg:h-14 min-w-[140px] lg:min-w-[170px] px-5 flex items-center justify-center"
                >
                  <img
                    src={cld(logo.url, { w: 240 })}
                    srcSet={cldSrcSet(logo.url, [170, 240, 340])}
                    sizes="(min-width: 1024px) 170px, 140px"
                    alt={logo.name}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full max-w-full object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
