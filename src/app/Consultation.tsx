import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Menu, X } from "lucide-react";
import brandLogo from "../assets/logo.svg";
import { localizeHref } from "./components/hooks/useLocale";

const bannerVideo = new URL("../assets/banner.webm", import.meta.url).href;

const menuItems = [
  { label: "Avaleht", href: localizeHref("/") },
  { label: "Hinnad", href: localizeHref("/#hinnad") },
  { label: "Portfoolio", href: localizeHref("/portfolio") },
  { label: "Kontakt", href: localizeHref("/contact") },
];

function RoadmapPreview() {
  return (
    <div className="relative w-full max-w-[420px] mx-auto">
      <div className="rounded-md border border-[#98d9ff] bg-white shadow-[0_12px_30px_rgba(10,37,64,0.14)] overflow-hidden">
        <video
          src={bannerVideo}
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          aria-label="Kliendid Kodulehele tutvustusvideo"
          className="w-full h-auto block"
        />
      </div>

      <div className="absolute left-[-8px] top-[22px] w-[120px] h-[60px] -z-10 rounded-sm border border-[#cce8fb] bg-white/95 shadow-[0_8px_20px_rgba(10,37,64,0.12)]" />
      <div className="absolute right-[-8px] top-[22px] w-[120px] h-[60px] -z-10 rounded-sm border border-[#cce8fb] bg-white/95 shadow-[0_8px_20px_rgba(10,37,64,0.12)]" />
    </div>
  );
}

function NameForm() {
  return (
    <section className="border-t border-[#d4e4f3] pt-7 px-5 pb-9 md:px-10 md:pt-10 md:pb-11">
      <h2 className="font-['Poppins'] font-semibold text-center text-[#0f172a] mb-6 md:mb-8" style={{ fontSize: "clamp(1.6rem,4.2vw,2.4rem)", lineHeight: "1.15" }}>
        Täida andmed broneerimiseks:
      </h2>

      <div className="rounded-xl border border-[#cfe3f2] bg-white p-2 md:p-3">
        <iframe
          src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ0sSNKWMKAtzkpleuWjqz4RnBTcDOYvlRtsQHspQQ21HvHceqVbZTS9WPA5x9vmh7vYigl04cD0?gv=true"
          style={{ border: 0 }}
          width="100%"
          height="600"
          frameBorder="0"
          title="Google Calendar Appointment Scheduling"
        />
      </div>

      <div className="mt-8 space-y-4">
        <p className="font-['Poppins'] font-semibold text-[#0f172a] text-center" style={{ fontSize: "17px", lineHeight: "1.35" }}>
          Usaldatud 32+ Eesti ettevõtte poolt.
        </p>

        <div className="rounded-xl border border-[#cfe3f2] bg-[#edf5fc] p-4 md:p-5">
          <p className="font-['Poppins'] font-semibold text-[#0f172a] mb-2" style={{ fontSize: "15px", lineHeight: "1.35" }}>
            Nõusolek ja tingimused:
          </p>
          <p className="font-['Inter'] text-[#334155]" style={{ fontSize: "12px", lineHeight: "1.45" }}>
            Oma andmete edastamisega annate nõusoleku, et Kliendid Kodulehele võib teiega ühendust võtta telefoni,
            tekstisõnumi või e-posti teel, kasutades automaatseid valimissüsteeme ja tehisintellekti, isegi kui
            teie number on riiklikus "Ära helista" (Do Not Call) nimekirjas. Me ei müü teie isikuandmeid. Teavet
            edastades nõustute meie privaatsuspoliitika ja teenustingimustega.
          </p>
        </div>
      </div>
    </section>
  );
}

function CompactFooter() {
  return (
    <footer className="bg-gradient-to-b from-[#0284c7] to-[#1d4ed8] text-white px-5 py-8 md:px-10">
      <div className="flex items-center justify-between mb-6">
        <a href={localizeHref("/")} className="flex items-center gap-2 no-underline text-white">
          <img src={brandLogo} alt="" className="w-7 h-7" />
          <span className="font-['Inter'] font-medium tracking-tight" style={{ fontSize: "25px" }}>
            Kliendid Kodulehele
          </span>
        </a>
      </div>

      <div className="grid grid-cols-2 gap-3 font-['Poppins']" style={{ fontSize: "13px", lineHeight: "1.3" }}>
        <a href={localizeHref("/")} className="text-white/90 no-underline">Avaleht</a>
        <a href={localizeHref("/contact")} className="text-white/90 no-underline">Kontakt</a>
      </div>
    </footer>
  );
}

export default function Consultation() {
  const [menuOpen, setMenuOpen] = useState(false);
  const isEnglish = document.documentElement.lang === "en";

  const closeMenu = () => setMenuOpen(false);

  return (
    <div className="bg-[#edf3f8] min-h-screen py-0 md:py-8">
      <Helmet>
        <title>{isEnglish ? "Free Consultation — Kliendid Kodulehele" : "Tasuta konsultatsioon — Kliendid Kodulehele"}</title>
        <meta name="description" content={isEnglish ? "Book a free 30-minute consultation. We'll analyze your website and create an action plan for reaching Google Top 3." : "Broneeri tasuta 30-minutiline konsultatsioon. Analüüsime sinu veebilehe olukorda ja koostame tegevuskava Google TOP 3 jõudmiseks."} />
        <link rel="canonical" href={isEnglish ? "https://kliendidkodulehele.ee/en/konsultatsioon" : "https://kliendidkodulehele.ee/konsultatsioon"} />
        <meta property="og:title" content={isEnglish ? "Free Consultation — Kliendid Kodulehele" : "Tasuta konsultatsioon — Kliendid Kodulehele"} />
        <meta property="og:description" content={isEnglish ? "Book a free 30-minute consultation." : "Broneeri tasuta 30-minutiline konsultatsioon."} />
        <link rel="alternate" hrefLang="et" href="https://kliendidkodulehele.ee/konsultatsioon" />
        <link rel="alternate" hrefLang="en" href="https://kliendidkodulehele.ee/en/konsultatsioon" />
      </Helmet>
      <div className="max-w-[430px] md:max-w-[860px] mx-auto bg-[#f3f7fb] shadow-[0_0_0_1px_rgba(148,163,184,0.18),0_24px_70px_rgba(15,23,42,0.12)] relative overflow-hidden">
        <header className="bg-[#0f172a] text-white px-4 h-[78px] flex items-center justify-between">
          <a href={localizeHref("/")} className="flex items-center gap-2 no-underline text-white">
            <img src={brandLogo} alt="" className="w-7 h-7" />
            <span className="font-['Inter'] font-medium tracking-tight" style={{ fontSize: "25px" }}>
              Kliendid Kodulehele
            </span>
          </a>
          <button aria-label="Ava menüü" className="cursor-pointer" onClick={() => setMenuOpen(true)}>
            <Menu size={30} />
          </button>
        </header>

        {menuOpen && (
          <>
            <button
              type="button"
              aria-label="Sulge menüü"
              className="fixed inset-0 bg-black/40 z-40"
              onClick={closeMenu}
            />
            <aside className="fixed right-0 top-0 h-full w-[280px] bg-[#0f172a] text-white z-50 p-6 shadow-[-8px_0_24px_rgba(0,0,0,0.2)]">
              <div className="flex items-center justify-between mb-8">
                <span className="font-['Poppins'] font-semibold" style={{ fontSize: "20px" }}>
                  Menüü
                </span>
                <button type="button" aria-label="Sulge" onClick={closeMenu} className="cursor-pointer">
                  <X size={24} />
                </button>
              </div>

              <nav className="flex flex-col gap-4">
                {menuItems.map((item) => (
                  <a
                    key={item.href}
                    href={item.href}
                    onClick={closeMenu}
                    className="text-white no-underline font-['Poppins'] py-2 border-b border-white/15"
                    style={{ fontSize: "16px" }}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            </aside>
          </>
        )}

        <main>
          <section className="px-5 pt-8 pb-8 md:px-10 md:pt-10 md:pb-10 text-center">
            <h1 className="font-['Poppins'] font-semibold text-[#0f172a] max-w-[760px] mx-auto" style={{ fontSize: "clamp(2.2rem,6.2vw,3.4rem)", lineHeight: "1.1" }}>
              🚀 Broneeri 15-minutiline strateegiakõne
            </h1>
            <p className="font-['Poppins'] font-medium text-[#0f172a] mt-5 max-w-[760px] mx-auto" style={{ fontSize: "clamp(1.2rem,3.1vw,1.8rem)", lineHeight: "1.25" }}>
              Kuidas saada 90 päevaga Google’i esilehele?
            </p>
            <p className="font-['Inter'] text-[#334155] mt-4 max-w-[760px] mx-auto" style={{ fontSize: "16px", lineHeight: "1.55" }}>
              Liitu lühikese ja konkreetse videokõnega, kus vaatame üle sinu ettevõtte potentsiaali ja paneme paika
              plaani nähtavuse kasvatamiseks.
            </p>

            <div className="mt-6 md:mt-8">
              <RoadmapPreview />
            </div>
          </section>

          <NameForm />
        </main>

        <CompactFooter />
      </div>
    </div>
  );
}