import { motion } from "motion/react";
import { useInView } from "./hooks/useAnimations";
import { cld, cldSrcSet } from "../../lib/cloudinary";
import * as m from "../../paraglide/messages.js";

const FOUNDERS = [
  {
    name: "Romet",
    url: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1785916436/copy_of_romet_scalingwebs_i4h6yt.webp",
  },
  {
    name: "Marti",
    url: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1785916382/marti_fqg5nd.png",
  },
];

export function About() {
  const { ref, inView } = useInView(0.15);

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

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-6 lg:gap-10 lg:items-stretch">
          <motion.div
            className="flex flex-col justify-center gap-8 bg-[#f5f5f5] rounded-2xl p-6 lg:p-9 border border-[#ececec]"
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <p className="font-['Poppins'] text-[#2f2f2f]" style={{ fontSize: "17px", lineHeight: "1.8" }}>
              {m.about_story()}
            </p>
            <div className="flex items-center gap-3 pt-6 border-t border-[#e0e0e0]">
              <span className="font-['Poppins'] font-bold text-[#1977f2]" style={{ fontSize: "32px", lineHeight: "1" }}>
                {m.about_stat_number()}
              </span>
              <span className="font-['Inter'] text-[#505050]" style={{ fontSize: "14.5px", lineHeight: "1.4" }}>
                {m.about_stat_label()}
              </span>
            </div>
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-4 lg:gap-5"
            initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.5, delay: 0.28 }}
          >
            {FOUNDERS.map((founder) => (
              <figure key={founder.name} className="flex flex-col gap-3">
                <div className="aspect-[3/4] w-full overflow-hidden rounded-2xl border border-black/5 bg-[#f5f5f5] shadow-[0_24px_60px_-28px_rgba(0,0,0,0.22)]">
                  <img
                    src={cld(founder.url, { w: 480 })}
                    srcSet={cldSrcSet(founder.url, [320, 480, 640])}
                    sizes="(min-width: 1024px) 240px, 45vw"
                    alt={founder.name}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover object-top"
                  />
                </div>
                <figcaption>
                  <p className="font-['Poppins'] font-semibold text-black" style={{ fontSize: "15px" }}>
                    {founder.name}
                  </p>
                  <p className="font-['Inter'] text-[#707070]" style={{ fontSize: "13px" }}>
                    {m.about_role_cofounder()}
                  </p>
                </figcaption>
              </figure>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}