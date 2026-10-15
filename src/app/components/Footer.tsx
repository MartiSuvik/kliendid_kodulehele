import { motion } from "motion/react";
import { useInView, useMagnetic } from "./hooks/useAnimations";
import brandLogo from "../../assets/logo.svg";
import * as m from "../../paraglide/messages.js";
import { ContactLinksStacked } from "./ContactLinks";
import { localizeHref } from "./hooks/useLocale";
import {
  ADDRESS_COUNTRY_NAME,
  ADDRESS_LOCALITY,
  ADDRESS_POSTAL_CODE,
  ADDRESS_STREET,
  BUSINESS_LEGAL_NAME,
  BUSINESS_NAME,
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
  GBP_MAPS_URL,
  INFOREGISTER_URL,
  MAPS_EMBED_SRC,
} from "../data/contact";

/**
 * Every service page linked from every page.
 *
 * The header dropdown alone was not enough: its links were `<button onClick>`
 * and only mounted while open, so the whole site shipped exactly one crawlable
 * link. These footer links are plain `<a href>` in the DOM on every page, which
 * is what gives Googlebot a path to the service pages at all.
 */
function getFooterServiceLinks() {
  return [
    { label: m.service_seo_title(), href: localizeHref("/teenused/google-seo") },
    { label: m.service_development_title(), href: localizeHref("/teenused/kodulehe-arendus") },
    { label: m.service_conversion_title(), href: localizeHref("/teenused/muugikonversioon") },
    { label: m.service_ai_support_title(), href: localizeHref("/teenused/ai-tugi") },
    { label: m.service_social_title(), href: localizeHref("/teenused/sotsiaalmeedia") },
    { label: m.nav_portfolio(), href: localizeHref("/portfolio") },
  ];
}

export function Footer() {
  const { ref, inView } = useInView(0.15);
  const magnetic = useMagnetic(0.2);
  const serviceLinks = getFooterServiceLinks();

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

          {/* Contact — fills the right half of the existing justify-between row */}
          <motion.div
            initial={{ opacity: 0, y: 15, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <p
              className="font-['Poppins'] uppercase tracking-[0.14em] text-white/40 mb-3"
              style={{ fontSize: '11px' }}
            >
              {m.footer_contact_label()}
            </p>
            <ContactLinksStacked source="footer" />
          </motion.div>
        </div>

        {/* Services + NAP. Both are plain markup, present on every page, so the
            crawler always has a path to the service pages and a consistent
            address to tie the site to the Google Business Profile. */}
        <div className="grid gap-10 md:grid-cols-2 border-t border-white/10 pt-10 mb-10">
          <motion.nav
            aria-label={m.nav_services()}
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
          >
            <h2
              className="font-['Poppins'] uppercase tracking-[0.14em] text-white/40 mb-4"
              style={{ fontSize: '11px' }}
            >
              {m.nav_services()}
            </h2>
            <ul className="grid gap-2.5 sm:grid-cols-2 list-none p-0 m-0">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className="font-['Poppins'] text-white/70 hover:text-white transition-colors no-underline"
                    style={{ fontSize: '14px' }}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2
              className="font-['Poppins'] uppercase tracking-[0.14em] text-white/40 mb-4"
              style={{ fontSize: '11px' }}
            >
              {ADDRESS_LOCALITY}
            </h2>
            {/* NAP must match the Google Business Profile character for character. */}
            <address
              className="not-italic font-['Poppins'] text-white/70"
              style={{ fontSize: '14px', lineHeight: 1.7 }}
            >
              <span className="text-white">{BUSINESS_NAME}</span>
              <br />
              {BUSINESS_LEGAL_NAME}
              <br />
              {ADDRESS_STREET}, {ADDRESS_POSTAL_CODE} {ADDRESS_LOCALITY}, {ADDRESS_COUNTRY_NAME}
              <br />
              <a href={CONTACT_PHONE_HREF} className="text-white/70 hover:text-white transition-colors">
                {CONTACT_PHONE_DISPLAY}
              </a>
              <br />
              <a href={CONTACT_EMAIL_HREF} className="text-white/70 hover:text-white transition-colors">
                {CONTACT_EMAIL}
              </a>
            </address>
            <a
              href={GBP_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 font-['Poppins'] text-white/50 hover:text-white transition-colors underline"
              style={{ fontSize: '13px' }}
            >
              Google Maps
            </a>

            {/* Keyless Maps embed — no API key in the repo, no billing, and it
                survives prerendering. loading="lazy" keeps it off the critical
                path; the prerenderer blocks maps.google.com outright. */}
            <iframe
              title={`${BUSINESS_NAME} — ${ADDRESS_STREET}, ${ADDRESS_LOCALITY}`}
              src={MAPS_EMBED_SRC}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
              className="mt-4 w-full rounded-lg border-0"
              style={{ height: 220 }}
            />
          </motion.div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="font-['Poppins'] text-white/40 text-center" style={{ fontSize: '12px' }}>
            {m.footer_copyright()}{" "}
            <a
              href={INFOREGISTER_URL}
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