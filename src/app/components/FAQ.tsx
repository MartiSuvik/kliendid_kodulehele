import { useState, useRef, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion } from "motion/react";
import { useInView } from "./hooks/useAnimations";
import * as m from "../../paraglide/messages.js";

/** FAQ copy grouped by topic. Question order matches messages/{et,en}.json faq_q1..faq_q27. */
function getFaqGroups() {
  return [
    {
      label: m.faq_cat_results(),
      items: [
        { question: m.faq_q1(), answer: m.faq_a1() },
        { question: m.faq_q2(), answer: m.faq_a2() },
        { question: m.faq_q3(), answer: m.faq_a3() },
      ],
    },
    {
      label: m.faq_cat_website(),
      items: [
        { question: m.faq_q4(), answer: m.faq_a4() },
        { question: m.faq_q5(), answer: m.faq_a5() },
        { question: m.faq_q6(), answer: m.faq_a6() },
        { question: m.faq_q7(), answer: m.faq_a7() },
      ],
    },
    {
      label: m.faq_cat_ecommerce(),
      items: [
        { question: m.faq_q8(), answer: m.faq_a8() },
        { question: m.faq_q9(), answer: m.faq_a9() },
        { question: m.faq_q10(), answer: m.faq_a10() },
        { question: m.faq_q11(), answer: m.faq_a11() },
      ],
    },
    {
      label: m.faq_cat_seo(),
      items: [
        { question: m.faq_q12(), answer: m.faq_a12() },
        { question: m.faq_q13(), answer: m.faq_a13() },
        { question: m.faq_q14(), answer: m.faq_a14() },
        { question: m.faq_q15(), answer: m.faq_a15() },
        { question: m.faq_q16(), answer: m.faq_a16() },
        { question: m.faq_q17(), answer: m.faq_a17() },
      ],
    },
    {
      label: m.faq_cat_cro(),
      items: [
        { question: m.faq_q18(), answer: m.faq_a18() },
        { question: m.faq_q19(), answer: m.faq_a19() },
        { question: m.faq_q20(), answer: m.faq_a20() },
      ],
    },
    {
      label: m.faq_cat_ai(),
      items: [
        { question: m.faq_q21(), answer: m.faq_a21() },
        { question: m.faq_q22(), answer: m.faq_a22() },
        { question: m.faq_q23(), answer: m.faq_a23() },
      ],
    },
    {
      label: m.faq_cat_general(),
      items: [
        { question: m.faq_q24(), answer: m.faq_a24() },
        { question: m.faq_q25(), answer: m.faq_a25() },
        { question: m.faq_q26(), answer: m.faq_a26() },
        { question: m.faq_q27(), answer: m.faq_a27() },
      ],
    },
  ];
}

function AccordionItem({ faq, isOpen, onToggle, index, inView }: {
  faq: { question: string; answer: string };
  isOpen: boolean;
  onToggle: () => void;
  index: number;
  inView: boolean;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [maxH, setMaxH] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setMaxH(contentRef.current.scrollHeight);
    }
  }, [isOpen]);

  return (
    <motion.div
      className="bg-white rounded-xl overflow-hidden border border-[#eee]"
      initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
      animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
      transition={{ duration: 0.4, delay: 0.15 + index * 0.08 }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 cursor-pointer"
      >
        <span className="font-['Inter'] font-medium text-black text-left" style={{ fontSize: '16px', letterSpacing: '-0.3px' }}>
          {faq.question}
        </span>
        {/* #7 Icon rotates 180° */}
        <div
          className="bg-white rounded-full w-8 h-8 flex items-center justify-center border border-[#eee] shrink-0 ml-3 transition-transform duration-300"
          style={{ transform: isOpen ? "rotate(45deg)" : "rotate(0deg)" }}
        >
          <Plus size={16} />
        </div>
      </button>
      {/* #7 Smooth slide-down with max-height transition */}
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-400 ease-in-out"
        style={{
          maxHeight: isOpen ? `${maxH}px` : "0px",
          opacity: isOpen ? 1 : 0,
          transition: "max-height 0.4s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.3s ease",
        }}
      >
        <div className="px-4 pb-4">
          <p className="font-['Poppins'] text-[#505050]" style={{ fontSize: '15px', lineHeight: '1.7' }}>
            {faq.answer}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function FAQ() {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const { ref, inView } = useInView(0.1);
  const faqGroups = getFaqGroups();
  // Schema stays flat and is generated from the same strings the page renders,
  // so the structured data can never drift from the visible copy.
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqGroups.flatMap((group) =>
      group.items.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    ),
  };

  return (
    <section id="kkk" className="bg-[#f5f5f5] py-20 lg:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-[900px] mx-auto px-6 lg:px-16" ref={ref}>
        {/* Badge */}
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-sm px-5 py-1.5 flex items-center gap-2.5">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="8" r="6.5" stroke="#505050" strokeWidth="1.33"/>
              <path d="M6 6.5C6 5.4 6.9 4.5 8 4.5C9.1 4.5 10 5.4 10 6.5C10 7.3 9.5 8 8.8 8.3C8.3 8.5 8 9 8 9.5" stroke="#505050" strokeWidth="1.33" strokeLinecap="round"/>
              <circle cx="8" cy="11.5" r="0.5" fill="#505050"/>
            </svg>
            <span className="font-['Inter'] text-[#505050]" style={{ fontSize: '14px' }}>{m.faq_badge()}</span>
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
            {m.faq_heading_1()}{" "}
            <span className="font-['Cormorant_Garamond'] italic font-light" style={{ fontSize: '38px' }}>{m.faq_heading_italic()}</span>
          </h2>
        </motion.div>

        {/* Questions, grouped by topic */}
        <div className="flex flex-col gap-8">
          {faqGroups.map((group, gi) => (
            <div key={group.label}>
              <motion.p
                className="font-['Inter'] text-[#707070] mb-3 px-1"
                style={{ fontSize: "12px", letterSpacing: "0.12em", textTransform: "uppercase" }}
                initial={{ opacity: 0, y: 8 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 + gi * 0.05 }}
              >
                {group.label}
              </motion.p>

              <div className="bg-[#eee] rounded-xl p-3 flex flex-col gap-2.5">
                {group.items.map((faq, i) => {
                  const key = `${gi}-${i}`;
                  return (
                    <AccordionItem
                      key={key}
                      faq={faq}
                      isOpen={openKey === key}
                      onToggle={() => setOpenKey(openKey === key ? null : key)}
                      index={i}
                      inView={inView}
                    />
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
