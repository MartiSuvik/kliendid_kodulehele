import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Self-built Google-reviews carousel. The data is extracted from the real
 * Google reviews (name, photo, rating, message); the 1-star review and any
 * empty-message entries are omitted. Replaces the third-party EmbedSocial embed.
 */

// `text` is Estonian (shown on /); `textEn` is the original Google-source English (shown on /en/).
type Review = { name: string; avatar: string; text: string; textEn: string };

const REVIEWS: Review[] = [
  {
    name: "Merliis Sulg",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjV1Wl6LftzSoBPN_rSIlVRXwuiFiLya2SQQj1ZgyaV14sdYVOEC=s96-c-rp-mo-br100",
    text: "Väga hea teenus ja tulemused. Saime täpselt selle, mida soovisime, et muuta meie veebileht tõhusamaks, ning statistika oli hea. Soovitan!",
    textEn: "Super good service and results. Really got what we wanted in terms of making our site more effective, and the statistics were good. Recommend!",
  },
  {
    name: "Nuts In Love",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWoUL79VA2cVzdEtq20v6T3L8i9YMriuZfXz-Vr3TFCWEuEQ90=s96-c-rp-mo-br100",
    text: "Väga rahul koostööga! Kogu klienditeekond on nüüd palju selgem ja tellimuste süsteem automaatsem, mis säästab meile ka aega. Marti ja tiim teevad oma tööd kirega. 5-tärni teenus!",
    textEn: "Very satisfied with the cooperation! The entire customer journey is now much clearer and the order system more automated, which also saves us time. Marti and the team do their work with passion. 5-star service!",
  },
  {
    name: "Vama Kali Ashram",
    avatar: "https://lh3.googleusercontent.com/a/ACg8ocKTaHL_zqX3yeo1fbaecxwkB_3ya2jzZiWno9-nSSO8yCspuw=s96-c-rp-mo-br100",
    text: "Kliendid Kodulehele muutis Vama Kali Ashrami digitaalse kohaloleku täielikult. Vajasime veebilehte, mis peegeldaks meie ruumi sügavat vaimset energiat ja teeks külastajatele samal ajal väga lihtsaks retriitide broneerimise ja info leidmise…",
    textEn: "Kliendid Kodulehele completely transformed the digital presence of Vama Kali Ashram. We needed a website that reflects the deep spiritual energy of our space while making it incredibly easy for visitors to book retreats and find information…",
  },
  {
    name: "Kundalini Kakao",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjUJJYKHMIJIc-V1y2cv8WI3EzWq_7PFAvX8v9t8a2NGPnmEHXo=s96-c-rp-mo-br100",
    text: "Suurepärane koostöö Kliendid Kodulehelega! Pöördusime nende poole, et uuendada Kundalini Kakao veebilehte ja viia SEO uuele tasemele. Nad kaardistasid kohe meie lehe kitsaskohad ja pakkusid lahendusi, mis päriselt toetavad müüki…",
    textEn: "Great collaboration with Kliendid Kodulehele! We turned to them to update the Kundalini Kakao website and take SEO to a new level. They immediately mapped the bottlenecks on our site and proposed solutions that genuinely support sales…",
  },
  {
    name: "zippelgazz",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWhk8HsGchaR7GDladFpIuhvUX9D5cMifM8VxfU5NMV1OWTfJvn=s96-c-rp-mo-br100",
    text: "Soovitan rõõmuga, sain tiimi abiga oma veebilehe õhku. Suur tänu, et aitasite minu visioonid lõpuni viia.",
    textEn: "Happy to recommend, got my website live with the help of the team. Thank you so much for helping my vision reach the finish line.",
  },
  {
    name: "Kehateadvus",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWqJeKY0_ZlOCjOsjP4QLnrcsHunc6qCpCPzt9Pp_vLftFInOA=s96-c-rp-mo-br100",
    text: "Otsisime Kehateadvuse veebilehele uuendust, mis ei oleks ainult visuaalselt rahustav ja ilus, vaid muudaks klientidele teenuste leidmise ja broneerimise võimalikult lihtsaks…",
    textEn: "We were looking for an update to the Kehateadvus website that would not only look visually calming and beautiful, but also make it as easy as possible for clients to find and book services…",
  },
  {
    name: "Joseph Saliste",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWXTmJM85qEORcrgaUTw2kSqNQfTjb7EXwAP852anukIk-7SxVf=s96-c-rp-mo-br100",
    text: "Hea analüüs veebilehe ja e-poe turunduse teemadel ning kiire teenindus veebilehel muudatuste tegemisel! Soovitan soojalt!",
    textEn: "Good analysis on website and e-commerce marketing topics, and fast service when making changes to the website! I highly recommend it!",
  },
  {
    name: "Sandra Serena Sulin",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjU06mrDAn5I5s2I3hxbEAM1T8cBhat21AcWMzJ4p6bFcn35P1JaoQ=s96-c-rp-mo-ba12-br100",
    text: "Sain ilusa ja kvaliteetse veebilehe. Soovitan!",
    textEn: "I got a beautiful, high-quality website. I recommend it!",
  },
  {
    name: "Janar Saharenko",
    avatar: "https://lh3.googleusercontent.com/a-/ALV-UjWUb-Gkrpfdx5a_p_hluHQqfgNzmR9iBh5IROlRD_MLGESAYcI=s96-c-rp-mo-br100",
    text: "Lahenduste leidmine on nende tugev külg. Isegi kui minupoolne teema tundus alguses neile üpris kauge, oli näha, et nad soovivad päriselt teada, millega ma tegelen, et nullist loodav süsteem saaks kindlasti minule mugavaks…",
    textEn: "Finding solutions is their strong suit. Even though my topic seemed quite far from their usual work at first, it was clear they genuinely wanted to understand what I do, so the system built from scratch would be truly convenient for me…",
  },
];

function GoogleG({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden="true" className="shrink-0">
      <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z" />
      <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z" />
      <path fill="#FBBC05" d="M11.69 28.18c-.44-1.32-.69-2.73-.69-4.18s.25-2.86.69-4.18v-5.7H4.34A21.98 21.98 0 0 0 2 24c0 3.55.85 6.91 2.34 9.88l7.35-5.7z" />
      <path fill="#EA4335" d="M24 9.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 2.97 29.93 1 24 1 15.4 1 7.96 5.93 4.34 13.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z" />
    </svg>
  );
}

function Stars() {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label="5 / 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={15} className="fill-[#fbbc04] text-[#fbbc04]" strokeWidth={0} />
      ))}
    </div>
  );
}

function Avatar({ src, name }: { src: string; name: string }) {
  const [failed, setFailed] = useState(false);
  const initial = name.trim().charAt(0).toUpperCase();
  if (failed) {
    return (
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#1977f2] font-['Poppins'] font-semibold text-white" style={{ fontSize: "18px" }}>
        {initial}
      </span>
    );
  }
  return (
    <img
      src={src}
      alt={name}
      width={48}
      height={48}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setFailed(true)}
      className="h-12 w-12 shrink-0 rounded-full object-cover"
    />
  );
}

export function ReviewsCarousel() {
  // Detect locale from the URL prefix (same signal as main.tsx). This is stable
  // across re-renders; document.documentElement.lang is unreliable on the
  // KoduleheSeo page, whose Helmet overrides <html lang>.
  const isEnglish = /^\/en(\/|$)/i.test(window.location.pathname);
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCards = (dir: number) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const amount = card ? card.offsetWidth + 20 : el.clientWidth * 0.85;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section className="bg-white py-16 lg:py-20">
      <div className="mx-auto max-w-[1120px] px-5 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-5">
          <div className="max-w-[680px]">
            <div className="flex items-center gap-2.5">
              <GoogleG />
              <Stars />
              <span className="font-['Inter'] font-semibold text-[#0b1220]" style={{ fontSize: "14px" }}>
                {isEnglish ? "5.0" : "5,0"}
              </span>
              <span className="font-['Inter'] text-[#475569]" style={{ fontSize: "14px" }}>
                {isEnglish ? "Google reviews" : "Google arvustused"}
              </span>
            </div>
            <h2 className="mt-4 font-['Poppins'] font-bold tracking-tight text-[#0b1220]" style={{ fontSize: "clamp(28px, 3.6vw, 40px)", lineHeight: "1.15" }}>
              {isEnglish ? "What our clients say" : "Mida kliendid meist arvavad"}
            </h2>
          </div>

          <div className="hidden shrink-0 gap-2 sm:flex">
            <button
              type="button"
              aria-label={isEnglish ? "Previous" : "Eelmine"}
              onClick={() => scrollByCards(-1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#0b1220] transition-colors hover:border-[#1977f2] hover:text-[#1977f2]"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              aria-label={isEnglish ? "Next" : "Järgmine"}
              onClick={() => scrollByCards(1)}
              className="grid h-11 w-11 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#0b1220] transition-colors hover:border-[#1977f2] hover:text-[#1977f2]"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {REVIEWS.map((r, i) => (
            <motion.article
              key={r.name}
              data-card
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: (i % 3) * 0.06, ease: [0.16, 1, 0.3, 1] }}
              className="flex w-[300px] shrink-0 snap-start flex-col rounded-2xl border border-[#e7edf4] bg-white p-6 shadow-[0_18px_40px_-28px_rgba(15,40,90,0.35)] sm:w-[360px]"
            >
              <div className="flex items-center gap-3.5">
                <Avatar src={r.avatar} name={r.name} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-['Poppins'] font-semibold text-[#0b1220]" style={{ fontSize: "16px", lineHeight: "1.2" }}>
                    {r.name}
                  </p>
                  <div className="mt-1.5">
                    <Stars />
                  </div>
                </div>
                <GoogleG size={20} />
              </div>

              <p className="mt-5 font-['Inter'] text-[#475467] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:6] overflow-hidden" style={{ fontSize: "15px", lineHeight: "1.65" }}>
                {isEnglish ? r.textEn : r.text}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
