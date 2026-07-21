import { Check, Monitor, Search, Star } from "lucide-react";
import { motion } from "motion/react";
import { useInView, useMagnetic } from "./hooks/useAnimations";
import * as m from "../../paraglide/messages.js";
import { localizeHref } from "./hooks/useLocale";

type PricingCard = {
  slug: "minimum" | "standard";
  label: string;
  badge: string | null;
  icon: "search" | "monitor";
  pricePrefix: string;
  price: string;
  priceSuffix: string;
  description: string;
  highlight: string | null;
  features: string[];
  cta: string;
  featured: boolean;
};

function MagneticCTA({ label, href }: { label: string; href: string }) {
  const magnetic = useMagnetic(0.2);

  return (
    <motion.button
      type="button"
      ref={magnetic.ref}
      onClick={() => {
        window.location.href = href;
      }}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
      className="relative w-full py-3 rounded-xl font-['Poppins'] font-medium mb-3 cursor-pointer overflow-hidden bg-[#1977f2] text-white hover:bg-[#1a67db] shadow-[0_12px_28px_rgba(25,119,242,0.22)]"
      style={{ fontSize: '16px', transition: 'background-color 0.2s' }}
    >
      <span className="relative z-10">{label}</span>
    </motion.button>
  );
}

export function Pricing() {
  const { ref, inView } = useInView(0.1);

  const cards: PricingCard[] = [
    {
      slug: "minimum",
      label: m.plan_visibility_label(),
      badge: m.plan_visibility_badge(),
      icon: "search",
      pricePrefix: m.plan_visibility_price_prefix(),
      price: m.plan_visibility_price(),
      priceSuffix: m.plan_visibility_price_suffix(),
      description: m.plan_visibility_description(),
      highlight: m.plan_visibility_highlight(),
      features: [
        m.plan_visibility_feature_1(),
        m.plan_visibility_feature_2(),
        m.plan_visibility_feature_3(),
        m.plan_visibility_feature_4(),
        m.plan_visibility_feature_5(),
      ],
      cta: m.plan_visibility_cta(),
      featured: true,
    },
    {
      slug: "standard",
      label: m.plan_website_label(),
      badge: null,
      icon: "monitor",
      pricePrefix: m.plan_website_price_prefix(),
      price: m.plan_website_price(),
      priceSuffix: m.plan_website_price_suffix(),
      description: m.plan_website_description(),
      highlight: m.plan_website_highlight(),
      features: [
        m.plan_website_feature_1(),
        m.plan_website_feature_2(),
        m.plan_website_feature_3(),
        m.plan_website_feature_4(),
        m.plan_website_feature_5(),
      ],
      cta: m.plan_website_cta(),
      featured: false,
    },
  ];

  return (
    <section id="hinnad" className="bg-white py-20 lg:py-28">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-16" ref={ref}>
        <motion.div
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="bg-white rounded-lg shadow-sm px-5 py-1.5 flex items-center gap-3">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <rect x="2" y="4" width="12" height="10" rx="1" stroke="#505050" strokeWidth="1.33" />
              <path d="M5 4V2" stroke="#505050" strokeWidth="1.33" strokeLinecap="round" />
              <path d="M11 4V2" stroke="#505050" strokeWidth="1.33" strokeLinecap="round" />
            </svg>
            <span className="font-['Inter'] text-[#505050]" style={{ fontSize: '14px' }}>{m.pricing_badge()}</span>
          </div>
        </motion.div>

        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h2 className="font-['Poppins'] text-black" style={{ fontSize: '30px' }}>
            {m.pricing_heading_1()} {" "}
            <span className="font-['Cormorant_Garamond'] italic font-light" style={{ fontSize: '35px' }}>{m.pricing_heading_italic()}</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cards.map((plan, i) => (
            <motion.div
              key={plan.slug}
              className={`rounded-[24px] p-7 flex flex-col relative overflow-hidden ${
                plan.featured
                  ? "bg-white border-2 border-[#2f6ef3] shadow-[0_18px_40px_rgba(47,110,243,0.12)]"
                  : "bg-white border border-[#dfe5f1] shadow-[0_12px_30px_rgba(15,23,42,0.06)]"
              }`}
              initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
              animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
              transition={{ duration: 0.5, delay: 0.2 + i * 0.12 }}
              whileHover={{
                scale: 1.03,
                transition: { duration: 0.25 },
              }}
            >

              <div className="inline-flex items-center gap-3 rounded-[18px] bg-[#eaf1ff] px-4 py-3 text-[#2563eb] mb-5 w-fit">
                {plan.icon === "search" ? <Search size={22} strokeWidth={2.2} /> : <Monitor size={22} strokeWidth={2.2} />}
                <span className="font-['Poppins'] font-medium" style={{ fontSize: '20px' }}>
                  {plan.label}
                </span>
              </div>

              <div className="mb-5">
                <p className="font-['Poppins'] text-[#111827] mb-1" style={{ fontSize: '18px', lineHeight: '1.1' }}>
                  {plan.pricePrefix}
                </p>
                <div className="flex items-end gap-3 flex-wrap">
                  <span className="font-['Poppins'] font-semibold text-[#0f172a]" style={{ fontSize: '60px', lineHeight: '0.92', letterSpacing: '-0.03em' }}>
                    {plan.price}
                  </span>
                  <span className="font-['Poppins'] text-[#111827] pb-2" style={{ fontSize: '22px', lineHeight: '1.2' }}>
                    {plan.priceSuffix}
                  </span>
                </div>
              </div>

              <p className="font-['Poppins'] text-[#374151]" style={{ fontSize: '16px', lineHeight: '1.5' }}>
                {plan.description}
              </p>

              {plan.highlight && (
                <div className="rounded-xl px-5 py-3 mb-5 mt-6 text-center bg-[#eef4ff] text-[#2563eb]">
                  <span className="font-['Poppins'] font-medium" style={{ fontSize: '15px' }}>
                    {plan.highlight}
                  </span>
                </div>
              )}

              {plan.featured && (
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex -space-x-2.5">
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-[#f59e0b] text-white flex items-center justify-center font-['Poppins'] font-semibold text-[11px]">KL</div>
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-[#14b8a6] text-white flex items-center justify-center font-['Poppins'] font-semibold text-[11px]">MR</div>
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-[#8b5cf6] text-white flex items-center justify-center font-['Poppins'] font-semibold text-[11px]">AN</div>
                    <div className="h-8 w-8 rounded-full border-2 border-white bg-[#1977f2] text-white flex items-center justify-center font-['Poppins'] font-semibold text-[11px]">+29</div>
                  </div>
                  <span className="font-['Poppins'] text-[#4b5563]" style={{ fontSize: '14px', lineHeight: '1.25' }}>
                    32 firmat juba valis selle
                  </span>
                </div>
              )}

              <ul className="flex-1 flex flex-col gap-2 mb-7 mt-1">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <Check size={16} className="shrink-0 mt-1 text-[#2563eb]" />
                    <span className="font-['Poppins'] text-[#374151]" style={{ fontSize: '15px', lineHeight: '1.7' }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <MagneticCTA label={plan.cta} href={localizeHref("/audit")} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
