import { motion } from "motion/react";
import { useInView } from "./hooks/useAnimations";
import * as m from "../../paraglide/messages.js";

const caseStudies = [
  {
    titleKey: "case_1_title" as const,
    image: "/1.svg",
    stat: "3,3x",
    statLabel: "SEO liiklus",
  },
  {
    titleKey: "case_2_title" as const,
    image: "/2.svg",
    stat: "10x",
    statLabel: "orgaaniline liiklus",
  },
  {
    titleKey: "case_3_title" as const,
    image: "/3.svg",
    stat: "75 700+",
    statLabel: "näitamist",
  },
];

export function CaseStudies() {
  const { ref, inView } = useInView(0.15);

  return (
    <section className="bg-white py-16 lg:py-24" ref={ref}>
      <div className="max-w-[1200px] mx-auto px-6 lg:px-16">
        <motion.div
          className="inline-flex items-center bg-[#f5f5f5] rounded-lg px-4 py-1.5 mb-5"
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.45 }}
        >
          <span className="font-['Inter'] text-[#505050]" style={{ fontSize: "14px" }}>
            Edulood
          </span>
        </motion.div>

        <motion.h2
          className="font-['Poppins'] text-black mb-10 font-semibold"
          style={{ fontSize: "34px", lineHeight: "1.15" }}
          initial={{ opacity: 0, y: 14, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.55, delay: 0.08 }}
        >
          Tõestatud{" "}
          <span className="font-['Cormorant_Garamond'] italic font-light" style={{ fontSize: "40px" }}>
            tulemused
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {caseStudies.map((cs, i) => (
            <motion.div
              key={i}
              className="bg-[#f5f5f5] rounded-2xl p-6 border border-[#ececec] flex flex-col gap-4"
              initial={{ opacity: 0, y: 16, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
            >
              <img
                src={cs.image}
                alt=""
                className="h-10 w-auto object-contain self-start"
                loading="lazy"
              />
              <div>
                <p className="font-['Poppins'] font-bold text-black" style={{ fontSize: "32px", lineHeight: "1.1" }}>
                  {cs.stat}
                </p>
                <p className="font-['Inter'] text-[#505050]" style={{ fontSize: "13px" }}>
                  {cs.statLabel}
                </p>
              </div>
              <p className="font-['Poppins'] text-[#2f2f2f]" style={{ fontSize: "14px", lineHeight: "1.6" }}>
                {m[cs.titleKey]()}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
