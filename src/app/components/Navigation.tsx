import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import brandLogo from "../../assets/logo.svg";
import * as m from "../../paraglide/messages.js";
import { getLocale, setLocale, baseLocale } from "../../paraglide/runtime.js";
import { localizeHref } from "./hooks/useLocale";
import { ContactLinksInline, ContactLinksStacked } from "./ContactLinks";

function getNavItems() {
  return [
    /* { label: m.nav_process(), href: "#protsess" }, */
   /* { label: m.nav_guarantee(), href: "#garantii" }, */
    { label: m.nav_faq(), href: localizeHref("/#kkk") },
  ];
}

function getServiceItems() {
  return [
    { label: m.service_seo_title(), href: localizeHref("/teenused/google-seo") },
    { label: m.service_development_title(), href: localizeHref("/teenused/kodulehe-arendus") },
    { label: m.service_conversion_title(), href: localizeHref("/teenused/muugikonversioon") },
    { label: m.service_ai_support_title(), href: localizeHref("/teenused/ai-tugi") },
    { label: m.service_social_title(), href: localizeHref("/teenused/sotsiaalmeedia") },
  ];
}

/**
 * Nav entries must be real `<a href>` so crawlers can follow them.
 *
 * These were `<button onClick={navigate}>`, which left exactly ONE crawlable
 * link on the whole site (the logo -> "/"). Googlebot cannot follow a button,
 * so it saw 15 sitemap URLs with no inbound links and indexed 2 of them.
 *
 * navigate() ended in `window.location.href = href` — a full page load — so an
 * anchor loses no behaviour. onClick now only intercepts same-page hash links,
 * to keep the smooth-scroll for "/#kkk" when you are already on "/".
 */
function NavLink({
  href,
  onNavigate,
  className,
  style,
  children,
}: {
  href: string;
  onNavigate?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      style={style}
      onClick={(e) => {
        const target = new URL(href, window.location.origin);
        if (target.pathname === window.location.pathname && target.hash) {
          const el = document.getElementById(decodeURIComponent(target.hash.slice(1)));
          if (el) {
            e.preventDefault();
            el.scrollIntoView({ behavior: "smooth" });
            window.history.replaceState(null, "", `${target.pathname}${target.hash}`);
          }
        }
        onNavigate?.();
      }}
    >
      {children}
    </a>
  );
}

/** Target URL for the language toggle, so it can be an <a> with a real href. */
function localeSwitchHref(currentLocale: string) {
  const path = window.location.pathname;
  if (currentLocale === baseLocale) {
    return `/en${path === "/" ? "/" : path}`;
  }
  return path.replace(/^\/en\/?/i, "/") || "/";
}

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const locale = getLocale();
  const navItems = getNavItems();
  const serviceItems = getServiceItems();

  /** Anchors handle the navigation now; this just closes any open menu. */
  const closeMenus = () => {
    setMobileOpen(false);
    setServicesDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 lg:px-16 py-5">
        <a href={localizeHref("/")} className="flex items-center gap-2 no-underline">
          <img src={brandLogo} alt="" className="w-[26px] h-[26px] object-contain" />
          <span className="font-['Inter'] font-medium tracking-tight text-black" style={{ fontSize: '22px' }}>Kliendid Kodulehele</span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              onNavigate={closeMenus}
              className="font-['Poppins'] text-black hover:text-[#1977f2] transition-colors cursor-pointer no-underline"
              style={{ fontSize: '14px' }}
            >
              {item.label}
            </NavLink>
          ))}
          
          {/* Services Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
              className="font-['Poppins'] text-black hover:text-[#1977f2] transition-colors cursor-pointer flex items-center gap-1"
              style={{ fontSize: '14px' }}
            >
              {m.nav_services()}
              <ChevronDown size={14} className={`transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {/* Always mounted, hidden with CSS rather than conditionally
                rendered: a crawler only sees links that exist in the DOM, and
                these five service pages need every inbound link they can get.
                The panel is absolutely positioned, so keeping it mounted costs
                no layout; pointer-events/visibility stop it catching clicks. */}
            <motion.div
              initial={false}
              animate={{
                opacity: servicesDropdownOpen ? 1 : 0,
                y: servicesDropdownOpen ? 0 : -10,
              }}
              transition={{ duration: 0.15 }}
              aria-hidden={!servicesDropdownOpen}
              style={{
                pointerEvents: servicesDropdownOpen ? "auto" : "none",
                visibility: servicesDropdownOpen ? "visible" : "hidden",
              }}
              className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max"
            >
              {serviceItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  onNavigate={() => setServicesDropdownOpen(false)}
                  className="block w-full text-left px-4 py-2 text-black hover:bg-gray-50 hover:text-[#1977f2] transition-colors font-['Poppins'] no-underline"
                  style={{ fontSize: '14px' }}
                >
                  {item.label}
                </NavLink>
              ))}
            </motion.div>
          </div>

          <NavLink
            href={localizeHref("/portfolio")}
            onNavigate={closeMenus}
            className="font-['Poppins'] text-black hover:text-[#1977f2] transition-colors cursor-pointer no-underline"
            style={{ fontSize: '14px' }}
          >
            {m.nav_portfolio()}
          </NavLink>
        </div>

        <div className="hidden md:flex items-center gap-4">
          {/* Contact pair only from lg up — at md the nav row is already full. */}
          <ContactLinksInline source="header" className="hidden lg:flex" />
          <a
            href={localeSwitchHref(locale)}
            hrefLang={locale === baseLocale ? "en" : "et"}
            className="font-['Inter'] font-medium text-black hover:text-[#1977f2] transition-colors cursor-pointer px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300 no-underline"
            style={{ fontSize: '13px' }}
          >
            {m.lang_switch()}
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden cursor-pointer" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden overflow-hidden bg-white border-t border-gray-100"
          >
            <div className="px-6 py-4 flex flex-col gap-4">
              {navItems.map((item) => (
                <NavLink
                  key={item.href}
                  href={item.href}
                  onNavigate={closeMenus}
                  className="font-['Poppins'] text-black text-left cursor-pointer no-underline"
                  style={{ fontSize: '14px' }}
                >
                  {item.label}
                </NavLink>
              ))}
              
              {/* Mobile Services Dropdown */}
              <div>
                <button
                  onClick={() => setServicesDropdownOpen(!servicesDropdownOpen)}
                  className="font-['Poppins'] text-black text-left cursor-pointer flex items-center gap-1 w-full"
                  style={{ fontSize: '14px' }}
                >
                  {m.nav_services()}
                  <ChevronDown size={14} className={`transition-transform ${servicesDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <AnimatePresence>
                  {servicesDropdownOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15 }}
                      className="overflow-hidden"
                    >
                      {serviceItems.map((item) => (
                        <NavLink
                          key={item.href}
                          href={item.href}
                          onNavigate={closeMenus}
                          className="block w-full text-left px-4 py-2 text-black text-sm font-['Poppins'] ml-2 border-l-2 border-gray-200 no-underline"
                          style={{ fontSize: '13px' }}
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink
                href={localizeHref("/portfolio")}
                onNavigate={closeMenus}
                className="font-['Poppins'] text-black text-left cursor-pointer no-underline"
                style={{ fontSize: '14px' }}
              >
                {m.nav_portfolio()}
              </NavLink>

              <a
                href={localeSwitchHref(locale)}
                hrefLang={locale === baseLocale ? "en" : "et"}
                className="font-['Inter'] font-medium text-black text-center cursor-pointer px-3 py-2 rounded-lg border border-gray-200 no-underline"
                style={{ fontSize: '13px' }}
              >
                {m.lang_switch()}
              </a>

              <ContactLinksStacked
                source="header_mobile"
                tone="light"
                className="pt-4 mt-1 border-t border-gray-100"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
