import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import brandLogo from "../../assets/logo.svg";
import * as m from "../../paraglide/messages.js";
import { getLocale, setLocale, baseLocale } from "../../paraglide/runtime.js";
import { localizeHref } from "./hooks/useLocale";

function getNavItems() {
  return [
    { label: m.nav_benefits(), href: localizeHref("/#miks?") },
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

export function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const locale = getLocale();
  const navItems = getNavItems();
  const serviceItems = getServiceItems();

  const navigate = (href: string) => {
    setMobileOpen(false);
    setServicesDropdownOpen(false);

    const targetUrl = new URL(href, window.location.origin);
    const isSamePage = targetUrl.pathname === window.location.pathname;

    if (isSamePage && targetUrl.hash) {
      const sectionId = decodeURIComponent(targetUrl.hash.slice(1));
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        window.history.replaceState(null, "", `${targetUrl.pathname}${targetUrl.hash}`);
        return;
      }
    }

    window.location.href = href;
  };

  const switchLocale = () => {
    const newLocale = locale === baseLocale ? "en" : "et";
    const currentPath = window.location.pathname;
    if (newLocale === "en") {
      // Going to English: add /en prefix
      window.location.href = `/en${currentPath === "/" ? "" : currentPath}`;
    } else {
      // Going to Estonian: strip /en prefix
      const stripped = currentPath.replace(/^\/en\/?/i, "/");
      window.location.href = stripped || "/";
    }
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
            <button
              key={item.href}
              onClick={() => navigate(item.href)}
              className="font-['Poppins'] text-black hover:text-[#1977f2] transition-colors cursor-pointer"
              style={{ fontSize: '14px' }}
            >
              {item.label}
            </button>
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
            
            <AnimatePresence>
              {servicesDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                  className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-max"
                >
                  {serviceItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => {
                        navigate(item.href);
                        setServicesDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-black hover:bg-gray-50 hover:text-[#1977f2] transition-colors font-['Poppins']"
                      style={{ fontSize: '14px' }}
                    >
                      {item.label}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => navigate(localizeHref("/portfolio"))}
            className="font-['Poppins'] text-black hover:text-[#1977f2] transition-colors cursor-pointer"
            style={{ fontSize: '14px' }}
          >
            {m.nav_portfolio()}
          </button>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={switchLocale}
            className="font-['Inter'] font-medium text-black hover:text-[#1977f2] transition-colors cursor-pointer px-3 py-2 rounded-lg border border-gray-200 hover:border-gray-300"
            style={{ fontSize: '13px' }}
          >
            {m.lang_switch()}
          </button>
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
                <button
                  key={item.href}
                  onClick={() => navigate(item.href)}
                  className="font-['Poppins'] text-black text-left cursor-pointer"
                  style={{ fontSize: '14px' }}
                >
                  {item.label}
                </button>
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
                        <button
                          key={item.href}
                          onClick={() => {
                            navigate(item.href);
                            setServicesDropdownOpen(false);
                            setMobileOpen(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-black text-sm font-['Poppins'] ml-2 border-l-2 border-gray-200"
                          style={{ fontSize: '13px' }}
                        >
                          {item.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={() => navigate(localizeHref("/portfolio"))}
                className="font-['Poppins'] text-black text-left cursor-pointer"
                style={{ fontSize: '14px' }}
              >
                {m.nav_portfolio()}
              </button>

              <button
                onClick={switchLocale}
                className="font-['Inter'] font-medium text-black text-center cursor-pointer px-3 py-2 rounded-lg border border-gray-200"
                style={{ fontSize: '13px' }}
              >
                {m.lang_switch()}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
