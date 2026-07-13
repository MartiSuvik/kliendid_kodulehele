import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useInView, useCountUp } from "./hooks/useAnimations";
import redImage from "../../assets/red.avif";
import greenImage from "../../assets/green.avif";
import * as m from "../../paraglide/messages.js";

const beforeStats = [
  { label: m.difference_stat_position(), value: 86, display: "86", color: "bg-[#962424]" },
  { label: m.difference_stat_market(), value: 1, display: "1%", color: "bg-[#962424]", suffix: "%" },
  { label: m.difference_stat_clicks(), value: 5, display: "5", color: "bg-[#962424]" },
  { label: m.difference_stat_clients(), value: 2, display: "1-2", color: "bg-[#d41c1c]" },
];

const afterStats = [
  { label: m.difference_stat_position(), value: 3, display: "3", color: "bg-[#2fba51]" },
  { label: m.difference_stat_market(), value: 35, display: "35%", color: "bg-[#2fba51]", suffix: "%" },
  { label: m.difference_stat_clicks(), value: 250, display: "250+", color: "bg-[#2fba51]", suffix: "+" },
  { label: m.difference_stat_clients(), value: 30, display: "30+", color: "bg-[#16a34a]", suffix: "+" },
];

function CountUpStat({ value, suffix, trigger }: { value: number; suffix?: string; trigger: boolean }) {
  const count = useCountUp(value, 1200, trigger);
  return <>{count}{suffix || ""}</>;
}

export function Difference() {
  const [showAfter, setShowAfter] = useState(false);
  const stats = showAfter ? afterStats : beforeStats;
  const { ref, inView } = useInView(0.15);
  const [countTrigger, setCountTrigger] = useState(false);

  useEffect(() => {
    if (inView) {
      // small delay so the section is visible first
      const t = setTimeout(() => setCountTrigger(true), 300);
      return () => clearTimeout(t);
    }
  }, [inView]);

  // Re-trigger count on toggle
  const handleToggle = (after: boolean) => {
    setCountTrigger(false);
    setShowAfter(after);
    setTimeout(() => setCountTrigger(true), 50);
  };

  return (
    <section className="bg-white py-20 lg:py-28">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-16" ref={ref}>
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-sm px-5 py-1.5 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 1L10 5.5L15 6.5L11.5 10L12.5 15L8 12.5L3.5 15L4.5 10L1 6.5L6 5.5L8 1Z" stroke="#505050" strokeWidth="1.33" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span className="font-['Inter'] text-[#505050]" style={{ fontSize: '14px' }}>{m.difference_badge()}</span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="font-['Poppins'] text-black" style={{ fontSize: '30px' }}>
            {m.difference_heading_1()}{" "}
            <span className="font-['Cormorant_Garamond'] italic font-light" style={{ fontSize: '35px' }}>{m.difference_heading_italic()}</span>
          </h2>
        </motion.div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-5 lg:p-8 border border-gray-100 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* #4 Left — fades in from left */}
            <motion.div
              className="flex-1"
              initial={{ opacity: 0, x: -40 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              {/* Toggle */}
              <div className="bg-[#f5f5f5] rounded-xl p-2 inline-flex gap-2 mb-8">
                <button
                  onClick={() => handleToggle(false)}
                  className={`px-4 py-2 rounded-lg font-['Poppins'] transition-all cursor-pointer ${!showAfter ? "bg-white shadow-sm text-black" : "text-black"}`}
                  style={{ fontSize: '16px' }}
                >
                  {m.difference_toggle_before()}
                </button>
                <button
                  onClick={() => handleToggle(true)}
                  className={`px-4 py-2 rounded-lg font-['Poppins'] transition-all cursor-pointer ${showAfter ? "bg-white shadow-sm text-black" : "text-black"}`}
                  style={{ fontSize: '16px' }}
                >
                  {m.difference_toggle_after()}
                </button>
              </div>

              {/* Profile */}
              <div className="bg-[#f5f5f5] rounded-2xl p-5 flex items-center gap-4 mb-4">
                <div className="bg-black rounded-lg w-[26px] h-[26px] flex items-center justify-center shrink-0">
                  <svg width="16" height="11" viewBox="0 0 20 14" fill="none">
                    <path d="M1 7.5L7 13L19 1" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div>
                  <p className="font-['Poppins'] font-semibold text-black" style={{ fontSize: '18px' }}>{m.difference_company_name()}</p>
                </div>
              </div>

              {/* #5 Stats with count-up */}
              <div className="flex flex-col gap-3">
                <AnimatePresence mode="wait">
                  {stats.map((stat, i) => (
                    <motion.div
                      key={`${showAfter}-${i}`}
                      className="bg-[#f5f5f5] rounded-2xl px-5 py-3 flex items-center justify-between"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }}
                    >
                      <span className="font-['Poppins'] font-medium text-black" style={{ fontSize: '16px' }}>{stat.label}</span>
                      <span className={`${stat.color} text-white font-['Poppins'] font-semibold px-3 py-1 rounded-md`} style={{ fontSize: '16px' }}>
                        <CountUpStat value={stat.value} suffix={stat.suffix} trigger={countTrigger} />
                      </span>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>

            {/* #4 Right — slides in from right */}
            <motion.div
              className="flex-1 bg-[#f5f5f5] rounded-2xl p-5 flex items-center justify-center min-h-[400px] overflow-hidden"
              initial={{ opacity: 0, x: 60 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <ImageWithFallback
                src={showAfter ? greenImage : redImage}
                alt={showAfter ? m.difference_toggle_after() : m.difference_toggle_before()}
                className="w-full h-full object-cover rounded-xl"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
