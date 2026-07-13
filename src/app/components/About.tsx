import { motion } from "motion/react";
import { useInView } from "./hooks/useAnimations";
import * as m from "../../paraglide/messages.js";

const bannerVideo = new URL("../../assets/banner.webm", import.meta.url).href;

export function About() {
  const { ref, inView } = useInView(0.15);
  const isEnglish = document.documentElement.lang === "en";

  return (
    <section id="meist" className="bg-white py-16 lg:py-24">
      <div className="max-w-[980px] mx-auto px-6 lg:px-16" ref={ref}>
        <motion.div
          className="inline-flex items-center bg-[#f5f5f5] rounded-lg px-4 py-1.5 mb-5"
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.45 }}
        >
          <span className="font-['Inter'] text-[#505050]" style={{ fontSize: "14px" }}>
            {m.about_badge()}
          </span>
        </motion.div>

        <motion.h2
          className="font-['Poppins'] text-black mb-8"
          style={{ fontSize: "34px", lineHeight: "1.15" }}
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          {m.about_heading_1()} <br />
          <span className="font-['Cormorant_Garamond'] italic font-light" style={{ fontSize: "40px" }}>
            {m.about_heading_italic()}
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-6 lg:items-start">
          <motion.div
            className="bg-[#f5f5f5] rounded-2xl p-6 lg:p-8 border border-[#ececec] flex flex-col gap-6"
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <p className="font-['Poppins'] text-[#2f2f2f]" style={{ fontSize: "16px", lineHeight: "1.8" }}>
              {m.about_p1()}
            </p>
            <hr className="border-[#e0e0e0]" />
            <p className="font-['Poppins'] text-[#2f2f2f]" style={{ fontSize: "16px", lineHeight: "1.8" }}>
              {m.about_p2()}
            </p>
            <hr className="border-[#e0e0e0]" />
            <p className="font-['Poppins'] text-[#2f2f2f]" style={{ fontSize: "16px", lineHeight: "1.8" }}>
              {m.about_p3()}
            </p>
          </motion.div>

          <motion.div
            className="aspect-[16/9] w-full overflow-hidden rounded-3xl border border-black/5 bg-black shadow-[0_24px_60px_-28px_rgba(0,0,0,0.22)]"
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            {/* Lazy-mount: the 577 KB banner only downloads once the section is
                near the viewport, so it never blocks first paint on the homepage. */}
            {inView && (
              <video
                src={bannerVideo}
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
                aria-label={isEnglish ? "Kliendid Kodulehele showreel" : "Kliendid Kodulehele tutvustusvideo"}
                className="block h-full w-full object-cover object-center"
              />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}