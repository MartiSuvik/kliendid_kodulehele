import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

/**
 * Home-page testimonial spotlight: one quote at a time, 2-column layout
 * (title/controls on the left, quote on the right). Replaces the
 * horizontal-scroll review-card carousel on "/" only; service pages keep
 * ReviewsCarousel unchanged.
 */

type Testimonial = { name: string; avatar: string; text: string; textEn: string };

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Merliis Sulg",
    avatar: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1785871331/memoji_6_ulbdm3.png",
    text: "Väga hea teenus ja tulemused. Saime täpselt selle, mida soovisime, et muuta meie veebileht tõhusamaks, ning statistika oli hea. Soovitan!",
    textEn: "Super good service and results. Really got what we wanted in terms of making our site more effective, and the statistics were good. Recommend!",
  },
  {
    name: "Nuts In Love",
    avatar: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1785871218/memoji_3_hdbtor.png",
    text: "Väga rahul koostööga! Kogu klienditeekond on nüüd palju selgem ja tellimuste süsteem automaatsem, mis säästab meile ka aega. Marti ja tiim teevad oma tööd kirega. 5-tärni teenus!",
    textEn: "Very satisfied with the cooperation! The entire customer journey is now much clearer and the order system more automated, which also saves us time. Marti and the team do their work with passion. 5-star service!",
  },
  {
    name: "Vama Kali Ashram",
    avatar: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1785871220/memoji_2_ucq8fg.png",
    text: "Kliendid Kodulehele muutis Vama Kali Ashrami digitaalse kohaloleku täielikult. Vajasime veebilehte, mis peegeldaks meie ruumi sügavat vaimset energiat ja teeks külastajatele samal ajal väga lihtsaks retriitide broneerimise ja info leidmise…",
    textEn: "Kliendid Kodulehele completely transformed the digital presence of Vama Kali Ashram. We needed a website that reflects the deep spiritual energy of our space while making it incredibly easy for visitors to book retreats and find information…",
  },
  {
    name: "Kundalini Kakao",
    avatar: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1785871222/memoji_1_ygqsjk.png",
    text: "Suurepärane koostöö Kliendid Kodulehelega! Pöördusime nende poole, et uuendada Kundalini Kakao veebilehte ja viia SEO uuele tasemele. Nad kaardistasid kohe meie lehe kitsaskohad ja pakkusid lahendusi, mis päriselt toetavad müüki…",
    textEn: "Great collaboration with Kliendid Kodulehele! We turned to them to update the Kundalini Kakao website and take SEO to a new level. They immediately mapped the bottlenecks on our site and proposed solutions that genuinely support sales…",
  },
  {
    name: "zippelgazz",
    avatar: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1785871225/memoji_kltmt5.png",
    text: "Soovitan rõõmuga, sain tiimi abiga oma veebilehe õhku. Suur tänu, et aitasite minu visioonid lõpuni viia.",
    textEn: "Happy to recommend, got my website live with the help of the team. Thank you so much for helping my vision reach the finish line.",
  },
  {
    name: "Kehateadvus",
    avatar: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1785871463/memoji_7_oufgll.png",
    text: "Otsisime Kehateadvuse veebilehele uuendust, mis ei oleks ainult visuaalselt rahustav ja ilus, vaid muudaks klientidele teenuste leidmise ja broneerimise võimalikult lihtsaks…",
    textEn: "We were looking for an update to the Kehateadvus website that would not only look visually calming and beautiful, but also make it as easy as possible for clients to find and book services…",
  },
  {
    name: "Joseph Saliste",
    avatar: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1785871521/memoji_8_jvc2qs.png",
    text: "Hea analüüs veebilehe ja e-poe turunduse teemadel ning kiire teenindus veebilehel muudatuste tegemisel! Soovitan soojalt!",
    textEn: "Good analysis on website and e-commerce marketing topics, and fast service when making changes to the website! I highly recommend it!",
  },
  {
    name: "Sandra Serena Sulin",
    avatar: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1785871332/memoji_5_rnudwz.png",
    text: "Sain ilusa ja kvaliteetse veebilehe. Soovitan!",
    textEn: "I got a beautiful, high-quality website. I recommend it!",
  },
  {
    name: "Janar Saharenko",
    avatar: "https://res.cloudinary.com/dl4bzhitw/image/upload/v1785871523/memoji_9_xcmvuh.png",
    text: "Lahenduste leidmine on nende tugev külg. Isegi kui minupoolne teema tundus alguses neile üpris kauge, oli näha, et nad soovivad päriselt teada, millega ma tegelen, et nullist loodav süsteem saaks kindlasti minule mugavaks…",
    textEn: "Finding solutions is their strong suit. Even though my topic seemed quite far from their usual work at first, it was clear they genuinely wanted to understand what I do, so the system built from scratch would be truly convenient for me…",
  },
];

const AUTOPLAY_MS = 6500;
const EASE = [0.16, 1, 0.3, 1] as const;

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

function Stars({ size = 14 }: { size?: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label="5 / 5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={size} className="fill-[#fbbc04] text-[#fbbc04]" strokeWidth={0} />
      ))}
    </div>
  );
}

export function TestimonialsSpotlight() {
  const isEnglish = /^\/en(\/|$)/i.test(window.location.pathname);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const pausedRef = useRef(false);
  const total = TESTIMONIALS.length;
  const current = TESTIMONIALS[index];

  const go = (dir: number) => {
    setDirection(dir);
    setIndex((i) => (i + dir + total) % total);
  };

  useEffect(() => {
    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      setDirection(1);
      setIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [total]);

  return (
    <section
      className="bg-white py-20 lg:py-28"
      onMouseEnter={() => (pausedRef.current = true)}
      onMouseLeave={() => (pausedRef.current = false)}
    >
      <div className="mx-auto max-w-[1200px] px-6 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[360px_1fr] lg:gap-20">
          {/* Left column — title, rating badge, controls */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <motion.div
              className="inline-flex items-center gap-2.5 rounded-full border border-gray-200 bg-white px-4 py-1.5"
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5 }}
            >
              <GoogleG size={16} />
              <Stars size={13} />
              <span className="font-['Inter'] font-semibold text-[#0b1220]" style={{ fontSize: "13px" }}>
                {isEnglish ? "5.0" : "5,0"}
              </span>
              <span className="font-['Inter'] text-[#667085]" style={{ fontSize: "13px" }}>
                {isEnglish ? "Google reviews" : "Google arvustused"}
              </span>
            </motion.div>

            <motion.h2
              className="mt-6 font-['Poppins'] font-bold tracking-tight text-black"
              style={{ fontSize: "clamp(32px, 4vw, 46px)", lineHeight: "1.1" }}
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.08 }}
            >
              Tagasiside
              <br />
              <span className="font-['Cormorant_Garamond'] italic font-light">meie klientidelt</span>
            </motion.h2>

            <motion.div
              className="mt-10 flex items-center gap-5"
              initial={{ opacity: 0, y: 10, filter: "blur(8px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: 0.16 }}
            >
              <span className="font-['Inter'] tabular-nums text-gray-400" style={{ fontSize: "14px", letterSpacing: "0.02em" }}>
                {String(index + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label={isEnglish ? "Previous testimonial" : "Eelmine arvustus"}
                  onClick={() => go(-1)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#0b1220] transition-colors duration-200 hover:border-[#1977f2] hover:text-[#1977f2] active:scale-[0.96]"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label={isEnglish ? "Next testimonial" : "Järgmine arvustus"}
                  onClick={() => go(1)}
                  className="grid h-11 w-11 place-items-center rounded-full border border-[#e2e8f0] bg-white text-[#0b1220] transition-colors duration-200 hover:border-[#1977f2] hover:text-[#1977f2] active:scale-[0.96]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right column — quote spotlight */}
          <div className="relative min-h-[280px] pt-2 lg:min-h-[320px]">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -left-2 -top-8 select-none font-['Cormorant_Garamond'] text-gray-100"
              style={{ fontSize: "180px", lineHeight: 1 }}
            >
              &rdquo;
            </span>

            <div className="relative" aria-live="polite">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.name}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 24, filter: "blur(6px)" }}
                  animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, x: direction * -24, filter: "blur(6px)" }}
                  transition={{ duration: 0.45, ease: EASE }}
                >
                  <blockquote
                    className="font-['Inter'] text-[#0b1220]"
                    style={{ fontSize: "clamp(19px, 2.2vw, 25px)", lineHeight: "1.55" }}
                  >
                    {isEnglish ? current.textEn : current.text}
                  </blockquote>

                  <div className="mt-9 flex items-center gap-4">
                    <img
                      src={current.avatar}
                      alt=""
                      width={64}
                      height={64}
                      loading="lazy"
                      decoding="async"
                      className="h-16 w-16 shrink-0 rounded-full object-cover shadow-[0_18px_40px_-28px_rgba(15,40,90,0.5)] ring-4 ring-white"
                    />
                    <div className="min-w-0">
                      <p className="font-['Poppins'] font-semibold text-black" style={{ fontSize: "17px" }}>
                        {current.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <Stars />
                        <GoogleG size={15} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
