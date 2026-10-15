import { useEffect } from "react";
import { animate, motion, useMotionTemplate, useMotionValue } from "motion/react";
import { FileText, MapPin, MessageSquare, RotateCcw, Search, Sparkles } from "lucide-react";
import { useInView } from "./hooks/useAnimations";
import {
  ChatGptLogo,
  ClaudeLogo,
  CopilotLogo,
  GeminiLogo,
  PerplexityLogo,
} from "./PlatformLogos";
import * as m from "../../paraglide/messages.js";

/**
 * Three cards, each carrying one idea as a picture rather than a paragraph:
 * which engines we optimise for, how the keywords get chosen, and why the
 * result keeps paying out.
 *
 * All three visuals are decoration. Every card's claim is in its heading and
 * one line of text underneath, so the section reads correctly with animation
 * off, with WebGL off, and in the prerendered HTML.
 */

const BLUE = "#1977f2";
const EASE_OUT = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* Card shell                                                          */
/* ------------------------------------------------------------------ */

function Card({
  children,
  title,
  description,
}: {
  children: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-black/8 bg-white overflow-hidden">
      {/* The visual is inset on a tinted ground so it reads as a diagram
          rather than as a second card nested inside the first. */}
      <div className="relative h-[230px] sm:h-[250px] bg-[#f5f7fa] overflow-hidden">
        {children}
      </div>
      <div className="px-6 py-7 lg:px-7">
        <h3
          className="font-['Poppins'] font-semibold text-black"
          style={{ fontSize: "19px", lineHeight: 1.3 }}
        >
          {title}
        </h3>
        <p
          className="font-['Poppins'] text-[#4a5568] mt-2"
          style={{ fontSize: "15px", lineHeight: 1.6 }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 1. The engines                                                      */
/* ------------------------------------------------------------------ */

const PLATFORMS = [
  { Logo: CopilotLogo, box: 40, icon: 18, name: "Microsoft Copilot" },
  { Logo: ClaudeLogo, box: 52, icon: 24, name: "Claude" },
  { Logo: ChatGptLogo, box: 66, icon: 32, name: "ChatGPT" },
  { Logo: GeminiLogo, box: 52, icon: 24, name: "Gemini" },
  { Logo: PerplexityLogo, box: 40, icon: 18, name: "Perplexity" },
];

function EnginesVisual() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      {/* Fades the group into the card edges instead of cutting it off. */}
      <div
        className="flex items-center gap-3"
        style={{
          maskImage: "radial-gradient(74% 74% at 50% 50%, black 72%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(74% 74% at 50% 50%, black 72%, transparent 100%)",
        }}
      >
        {PLATFORMS.map((p, i) => (
          <span
            key={p.name}
            title={p.name}
            className="logo-bob flex items-center justify-center rounded-full bg-white shadow-[0_10px_24px_-12px_rgba(10,14,22,0.35)] ring-1 ring-black/5"
            style={{ width: p.box, height: p.box, animationDelay: `${i * 0.22}s` }}
          >
            <p.Logo className="block" style={{ width: p.icon, height: p.icon }} />
            <span className="sr-only">{p.name}</span>
          </span>
        ))}
      </div>

      <div
        aria-hidden="true"
        className="beam-sweep absolute h-32 w-px"
        style={{
          background: `linear-gradient(to bottom, transparent, ${BLUE}, transparent)`,
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Keyword discovery                                                */
/* ------------------------------------------------------------------ */

/**
 * Illustrative Estonian search phrases, deliberately identical in both locales:
 * they are sample queries from the market this agency sells into, not UI copy,
 * and translating them would misrepresent what people actually type.
 */
const KEYWORD_ROWS = [
  ["kodulehe tegemine hind", "SEO agentuur Tallinn", "veebipood loomine", "kes teeb kodulehti"],
  ["parim turundusagentuur", "AI otsingu optimeerimine", "kuidas Google'is esile tulla", "kohalik SEO"],
  ["kodulehe uuendamine", "e-poe SEO", "ChatGPT soovitab ettevõtet", "kodulehe analüüs"],
];

/** Lens radius, in the same pixel space as the drift below. */
const LENS_R = 46;

function KeywordsVisual() {
  const lensX = useMotionValue(0);

  // A lens the visitor has to discover by dragging is a lens most visitors
  // never find, and on a phone a draggable overlay competes with scrolling.
  // It drifts on its own instead.
  useEffect(() => {
    const controls = animate(lensX, [-96, 96, -96], {
      duration: 11,
      repeat: Infinity,
      ease: "easeInOut",
    });
    return () => controls.stop();
  }, [lensX]);

  const clip = useMotionTemplate`circle(${LENS_R - 12}px at calc(50% + ${lensX}px) 50%)`;
  const punch = useMotionTemplate`radial-gradient(circle ${
    LENS_R - 12
  }px at calc(50% + ${lensX}px) 50%, transparent 100%, black 100%)`;

  const rows = (highlighted: boolean) => (
    <div className="flex flex-col gap-2.5 w-full">
      {KEYWORD_ROWS.map((row, i) => (
        <div
          key={i}
          className={`${i % 2 === 0 ? "marquee-l" : "marquee-r"} flex gap-2.5 w-max`}
          style={{ animationDelay: `${i * -4}s` }}
        >
          {[...row, ...row, ...row].map((word, j) => (
            <span
              key={`${word}-${j}`}
              className={`font-['Poppins'] whitespace-nowrap rounded-full border px-3 py-1.5 ${
                highlighted
                  ? "border-[#1977f2]/35 bg-white text-[#1977f2] font-medium"
                  : "border-black/8 bg-white/70 text-[#8a94a6]"
              }`}
              style={{ fontSize: "12.5px" }}
            >
              {word}
            </span>
          ))}
        </div>
      ))}
    </div>
  );

  return (
    <div className="absolute inset-0 flex items-center overflow-hidden">
      {/* Base pass, with the lens area punched out so the two never double up. */}
      <motion.div
        className="w-full"
        style={{ maskImage: punch, WebkitMaskImage: punch }}
        aria-hidden="true"
      >
        {rows(false)}
      </motion.div>

      {/* Reveal pass, clipped to the lens. Identical markup, so the phrases line
          up exactly and only their styling changes. */}
      <motion.div
        className="absolute inset-0 flex items-center pointer-events-none"
        style={{ clipPath: clip }}
        aria-hidden="true"
      >
        {rows(true)}
      </motion.div>

      {/* The lens itself. */}
      <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 rounded-full border-2 border-[#1977f2]/70 shadow-[0_10px_30px_-8px_rgba(25,119,242,0.45)]"
        style={{
          x: lensX,
          width: LENS_R * 2 - 24,
          height: LENS_R * 2 - 24,
          marginLeft: -(LENS_R - 12),
          marginTop: -(LENS_R - 12),
        }}
      />

      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f5f7fa] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#f5f7fa] to-transparent" />

      {/* The phrases are decoration for sighted users but real evidence for a
          crawler, so one accessible copy is emitted once, unduplicated. */}
      <p className="sr-only">{KEYWORD_ROWS.flat().join(", ")}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Why it keeps paying                                              */
/* ------------------------------------------------------------------ */

/** Six spokes on an ellipse around the centre of a 400x300 viewBox. */
const SOURCES = [
  { Icon: Search, label: () => m.hw_src_1(), a: -90 },
  { Icon: Sparkles, label: () => m.hw_src_2(), a: -30 },
  { Icon: MapPin, label: () => m.hw_src_3(), a: 30 },
  { Icon: MessageSquare, label: () => m.hw_src_4(), a: 90 },
  { Icon: FileText, label: () => m.hw_src_5(), a: 150 },
  { Icon: RotateCcw, label: () => m.hw_src_6(), a: 210 },
];

const CX = 200;
const CY = 150;
const RX = 132;
const RY = 104;

function nodePos(a: number) {
  const rad = (a * Math.PI) / 180;
  return { x: CX + RX * Math.cos(rad), y: CY + RY * Math.sin(rad) };
}

function LastingVisual() {
  return (
    <div className="absolute inset-0">
      {/* Stretch rather than letterbox: the nodes are positioned as a
          percentage of this same box, so any letterboxing would slide the
          spokes off the icons at every width but one. */}
      <svg
        viewBox="0 0 400 300"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        {SOURCES.map((s, i) => {
          const p = nodePos(s.a);
          // Trim both ends so the spoke does not run under the icons.
          const dx = CX - p.x;
          const dy = CY - p.y;
          const len = Math.hypot(dx, dy);
          const ux = dx / len;
          const uy = dy / len;
          const x1 = p.x + ux * 26;
          const y1 = p.y + uy * 26;
          const x2 = CX - ux * 34;
          const y2 = CY - uy * 34;
          return (
            <g key={s.a}>
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="rgba(10,14,22,0.16)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              {/* The pulse travels node to centre: arrivals, not broadcasts. */}
              <line
                className="flow-in"
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={BLUE}
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="16 144"
                vectorEffect="non-scaling-stroke"
                style={{ animationDelay: `${i * 0.55}s` }}
              />
            </g>
          );
        })}
      </svg>

      {SOURCES.map((s) => {
        const p = nodePos(s.a);
        return (
          <div
            key={s.a}
            className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-black/8 bg-white shadow-[0_6px_16px_-10px_rgba(10,14,22,0.5)]"
            style={{ left: `${(p.x / 400) * 100}%`, top: `${(p.y / 300) * 100}%` }}
            title={s.label()}
          >
            <s.Icon size={15} strokeWidth={2} className="text-[#4a5568]" aria-hidden="true" />
            <span className="sr-only">{s.label()}</span>
          </div>
        );
      })}

      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#0a0e16] px-3.5 py-2.5 shadow-[0_14px_30px_-14px_rgba(10,14,22,0.8)]">
        <span
          className="font-['Poppins'] font-medium text-white whitespace-nowrap"
          style={{ fontSize: "12.5px" }}
        >
          {m.hw_3_center()}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function HowWeWork() {
  const { ref, inView } = useInView(0.1);
  const show = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay, ease: EASE_OUT },
  });

  const cards = [
    { visual: <EnginesVisual />, title: m.hw_1_title(), desc: m.hw_1_desc() },
    { visual: <KeywordsVisual />, title: m.hw_2_title(), desc: m.hw_2_desc() },
    { visual: <LastingVisual />, title: m.hw_3_title(), desc: m.hw_3_desc() },
  ];

  return (
    <section id="mida-me-teeme" className="bg-white py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-16" ref={ref}>
        <motion.p
          className="font-['Poppins'] font-medium text-[#8a94a6] mb-6"
          style={{ fontSize: "14px" }}
          {...show(0)}
        >
          {m.hw_label()}
        </motion.p>

        <motion.h2
          className="font-['Poppins'] font-semibold tracking-tight text-black max-w-[20ch]"
          style={{ fontSize: "clamp(28px, 4vw, 46px)", lineHeight: 1.12 }}
          {...show(0.05)}
        >
          {m.hw_heading()}
        </motion.h2>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12 lg:mt-16">
          {cards.map((card, i) => (
            <motion.div key={card.title} {...show(0.12 + i * 0.1)}>
              <Card title={card.title} description={card.desc}>
                {card.visual}
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
