import { useState } from "react";
import { motion } from "motion/react";
import { useMagnetic } from "./hooks/useAnimations";
import { cld, cldSrcSet } from "../../lib/cloudinary";
import * as m from "../../paraglide/messages.js";

const YT_VIDEO_ID = "0X7_ijQXQCA";
const HERO_VIDEO_PUBLIC_ID = "kliendidkodulehele_hero_video";
const HERO_VIDEO_PREVIEW_SRC = `https://res.cloudinary.com/dl4bzhitw/video/upload/f_auto,q_auto:low,w_480,so_0,eo_4/${HERO_VIDEO_PUBLIC_ID}.mp4`;
const HERO_VIDEO_PLAYER_SRC =
  "https://player.cloudinary.com/embed/?cloud_name=dl4bzhitw&public_id=Kui_sa_oled_Eesti_ettevo%CC%83tja_siis_on_95_to%CC%83ena%CC%88osus_fudzdu&autoplay=true";

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
  const magnetic = useMagnetic(0.25);

  return (
    <section className="bg-white overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-16 pt-16 pb-8 lg:pt-24 lg:pb-12">
        {/* Status badge */}
        <motion.div
          className="flex items-center gap-2 mb-8"
          initial={{ opacity: 0, filter: "blur(8px)" }}
          animate={{ opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
          </span>
          <span className="font-['Inter'] text-[#4d4d4d]" style={{ fontSize: '12px' }}>{m.hero_location()}</span>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left — #1 Hero Reveal */}
          <motion.div
            className="flex-1 max-w-[540px]"
            initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <h1 className="font-['Poppins'] text-black mb-6 font-semibold" style={{ fontSize: '44px', lineHeight: '1.15' }}>
              {m.hero_headline()}
            </h1>

            {/* #9 Magnetic CTA */}
            <motion.div
              className="relative inline-flex items-center justify-center group"
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <div className="pointer-events-none absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500 via-pink-500 to-yellow-400 blur-lg opacity-60 transition-all duration-1000 group-hover:opacity-100 group-hover:duration-200" />
              <motion.button
                type="button"
                ref={magnetic.ref}
                onClick={() => {
                  window.location.href = (window as any).__localePrefix + "/audit";
                }}
                onMouseMove={magnetic.onMouseMove}
                onMouseLeave={magnetic.onMouseLeave}
                className="relative bg-[#1977f2] text-white font-['Poppins'] font-medium px-8 py-4 rounded-xl hover:bg-[#3a50e0] cursor-pointer"
                style={{ fontSize: '16px', transition: 'background-color 0.2s' }}
              >
                {m.hero_cta()}
              </motion.button>
            </motion.div>
          </motion.div>

          {/* Right - Video placeholder */}
          <motion.div
            className="flex-1 w-full max-w-[570px]"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="relative rounded-xl overflow-hidden bg-black aspect-video">
              {document.documentElement.lang === "en" ? (
                <LiteYouTube videoId={YT_VIDEO_ID} />
              ) : (
                <LiteCloudinaryVideo />
              )}
            </div>
          </motion.div>
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
        <motion.div
          className="mt-10 lg:mt-12"
          initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.6, delay: 0.9 }}
        >
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
        </motion.div>
      </div>
    </section>
  );
}
