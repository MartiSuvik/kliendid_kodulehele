import { Search, Users, Rocket, BarChart3 } from "lucide-react";
import { motion } from "motion/react";
import { useInView } from "./hooks/useAnimations";
import * as m from "../../paraglide/messages.js";

const steps = [
  {
    icon: Search,
    title: m.process_step1_title(),
    description: m.process_step1_desc(),
  },
  {
    icon: Users,
    title: m.process_step2_title(),
    description: m.process_step2_desc(),
  },
  {
    icon: Rocket,
    title: m.process_step3_title(),
    description: m.process_step3_desc(),
  },
  {
    icon: BarChart3,
    title: m.process_step4_title(),
    description: m.process_step4_desc(),
  },
];

export function Process() {
  const { ref, inView } = useInView(0.1);

  return (
    <section id="protsess" className="bg-[#f5f5f5] py-20 lg:py-28">
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
              <path d="M2 8H14M8 2V14" stroke="#505050" strokeWidth="1.33" strokeLinecap="round"/>
            </svg>
            <span className="font-['Inter'] text-[#505050]" style={{ fontSize: '14px' }}>{m.process_badge()}</span>
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="font-['Poppins'] text-black" style={{ fontSize: '30px' }}>
            {m.process_heading_1()}{" "}
            <span className="font-['Cormorant_Garamond'] italic font-light" style={{ fontSize: '35px' }}>{m.process_heading_italic()}</span>.
          </h2>
        </motion.div>

        {/* #6 Staggered Steps */}
        <div className="flex flex-col gap-4">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="bg-gradient-to-b from-white to-white/80 rounded-xl border border-gray-200/40 p-7 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center gap-4"
              initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
            >
              <step.icon size={24} className="text-black shrink-0" strokeWidth={2} />
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <span className="font-['Poppins'] font-semibold text-black whitespace-nowrap" style={{ fontSize: '16px' }}>
                  {step.title}
                </span>
                <span className="font-['Poppins'] font-medium text-[#505050]" style={{ fontSize: '16px' }}>
                  {step.description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
