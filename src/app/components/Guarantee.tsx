import { ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useInView } from "./hooks/useAnimations";
import * as m from "../../paraglide/messages.js";

export function Guarantee() {
  const { ref, inView } = useInView(0.2);

  return (
    <section id="garantii" className="bg-white py-20 lg:py-28">
      <div className="max-w-[800px] mx-auto px-6 lg:px-16 text-center" ref={ref}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <ShieldCheck size={48} className="text-[#1977f2] mx-auto mb-6" strokeWidth={1.5} />
        </motion.div>
        <motion.h2
          className="font-['Poppins'] text-black mb-6"
          style={{ fontSize: '30px' }}
          initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          {m.guarantee_heading_1()}{" "}
          <span className="font-['Cormorant_Garamond'] italic font-light" style={{ fontSize: '35px' }}>{m.guarantee_heading_italic()}</span>.
          <br />{m.guarantee_heading_2()}
        </motion.h2>
        <motion.p
          className="font-['Poppins'] text-[#505050] mb-8"
          style={{ fontSize: '16px', lineHeight: '1.7' }}
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, delay: 0.25 }}
        >
          {m.guarantee_body()}
        </motion.p>
        <motion.div
          className="bg-[#f5f5f5] rounded-2xl p-8 border border-gray-200"
          initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <p className="font-['Poppins'] font-semibold text-black" style={{ fontSize: '18px', lineHeight: '1.7' }}>
            {m.guarantee_statement()}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
