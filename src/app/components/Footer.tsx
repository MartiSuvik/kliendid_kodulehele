import { motion } from "motion/react";
import { useInView, useMagnetic } from "./hooks/useAnimations";
import brandLogo from "../../assets/logo.svg";
import * as m from "../../paraglide/messages.js";

export function Footer() {
  const { ref, inView } = useInView(0.15);
  const magnetic = useMagnetic(0.2);

  return (
    <footer className="bg-black text-white py-16">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-16" ref={ref}>
        <div className="flex flex-col md:flex-row items-start justify-between gap-8 mb-12">
          {/* Logo & tagline */}
          <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <img src={brandLogo} alt="" className="w-[26px] h-[26px] object-contain" />
              <span className="font-['Inter'] font-medium tracking-tight text-white" style={{ fontSize: '22px' }}>Kliendid Kodulehele</span>
            </div>
            <h3 className="font-['Poppins'] font-semibold text-white max-w-[300px]" style={{ fontSize: '24px', lineHeight: '1.3' }}>
              {m.footer_tagline()}
            </h3>
          </motion.div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="font-['Poppins'] text-white/40 text-center" style={{ fontSize: '12px' }}>
            {m.footer_copyright()}{" "}
            <a
              href="https://www.inforegister.ee/en/17306855-EFFI-AI-SOLUTIONS-OU/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white/70 transition-colors"
            >
              {m.footer_inforegister()}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}