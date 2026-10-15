import { motion } from "motion/react";
import {
  Activity,
  Check,
  CircleAlert,
  FileText,
  ListChecks,
  MousePointerClick,
  PhoneCall,
  Search,
  Sparkles,
  TrendingUp,
  X,
} from "lucide-react";
import { useInView } from "./hooks/useAnimations";
import { WhyNow } from "./WhyNow";
import { HowWeWork } from "./HowWeWork";
import * as m from "../../paraglide/messages.js";

/**
 * The homepage sales argument, told as diagrams rather than paragraphs.
 *
 * Four movements, each its own <section> so every one carries a real <h2>:
 *
 *   1. The proposition, then the buyer's journey as a connected rail of icons.
 *      The two steps where the shortlist forms are filled, the others outlined.
 *   2. Why now, evidenced by Statistikaamet (see WhyNow.tsx).
 *   3. The four unknown numbers, drawn as a funnel whose values are all "?".
 *      That is the whole point: the numbers exist, you just cannot see them.
 *   4. What the first 90 days should show, as a chart of four curves rising in
 *      sequence, then the guarantee as a promise/no-promise contrast.
 *
 * Text here is labels only, three to six words. Anything that needs a sentence
 * belongs on a service page. The layouts assume that and will break down if the
 * copy grows back into prose.
 *
 * The guarantee deliberately does NOT promise leads or customers, and says so
 * out loud: we do not control who closes a deal. It reverses risk on
 * visibility, which we do control.
 */

/** Deep enough that white body copy clears AA at any size, unlike #1977f2. */
const GUARANTEE_BLUE = "#0b3ea3";
/** Near-black, tinted toward the brand hue rather than a flat neutral. */
const DARK_GROUND = "#0a0e16";
const BLUE = "#1977f2";

/** Node diameter, and therefore where the connecting rail has to sit. */
const NODE = 48;
/** Tailwind's gap-x-8 between the four journey columns. */
const RAIL_GAP = 32;

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";

/** One observer per section, since the sections enter view separately. */
function useReveal(threshold = 0.1) {
  const { ref, inView } = useInView(threshold);
  const show = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay, ease: EASE_OUT },
  });
  return { ref, inView, show };
}

/** `decisive` marks the two steps where the shortlist is actually formed. */
function getPathSteps() {
  return [
    { Icon: CircleAlert, title: m.vp_path_1_title(), desc: m.vp_path_1_desc(), decisive: false },
    { Icon: Search, title: m.vp_path_2_title(), desc: m.vp_path_2_desc(), decisive: true },
    { Icon: ListChecks, title: m.vp_path_3_title(), desc: m.vp_path_3_desc(), decisive: true },
    { Icon: PhoneCall, title: m.vp_path_4_title(), desc: m.vp_path_4_desc(), decisive: false },
  ];
}

/**
 * The funnel. Widths are illustrative shape, not measured data, which is why
 * every value renders as "?" — the section's claim is that these are unknown.
 * The last row is the inverse: the share that never arrives.
 */
function getFunnel() {
  return [
    { label: m.vp_measure_q1(), width: 100, lost: false },
    { label: m.vp_measure_q2(), width: 34, lost: false },
    { label: m.vp_measure_q3(), width: 9, lost: false },
    { label: m.vp_measure_q4(), width: 91, lost: true },
  ];
}

function getTracked() {
  return [
    { Icon: Search, title: m.vp_measure_1_title(), desc: m.vp_measure_1_desc() },
    { Icon: FileText, title: m.vp_measure_2_title(), desc: m.vp_measure_2_desc() },
    { Icon: MousePointerClick, title: m.vp_measure_3_title(), desc: m.vp_measure_3_desc() },
    { Icon: Activity, title: m.vp_measure_4_title(), desc: m.vp_measure_4_desc() },
  ];
}

/**
 * The four layers, in the order they actually move. Each curve leaves the
 * baseline later than the one above it, which is the real claim: search
 * visibility moves first and the business result last.
 *
 * Every colour clears 3:1 on white, so the lines stay distinguishable as
 * graphical objects. `d` is drawn against a 720x240 viewBox.
 */
function getOutcomes() {
  return [
    {
      Icon: Search,
      color: BLUE,
      d: "M14,208 C150,204 210,150 330,120 C470,84 560,52 706,26",
      label: m.vp_90_1_label(),
      title: m.vp_90_1_title(),
      items: [m.vp_90_1_a(), m.vp_90_1_b(), m.vp_90_1_c()],
    },
    {
      Icon: Sparkles,
      color: GUARANTEE_BLUE,
      d: "M14,211 C170,210 240,182 360,158 C480,134 580,88 706,58",
      label: m.vp_90_2_label(),
      title: m.vp_90_2_title(),
      items: [m.vp_90_2_a(), m.vp_90_2_b(), m.vp_90_2_c()],
    },
    {
      Icon: MousePointerClick,
      color: "#5b7fa6",
      d: "M14,212 C190,212 280,196 400,176 C510,158 600,120 706,96",
      label: m.vp_90_3_label(),
      title: m.vp_90_3_title(),
      items: [m.vp_90_3_a(), m.vp_90_3_b(), m.vp_90_3_c()],
    },
    {
      Icon: TrendingUp,
      color: DARK_GROUND,
      d: "M14,213 C210,213 320,205 430,192 C540,178 620,152 706,132",
      label: m.vp_90_4_label(),
      title: m.vp_90_4_title(),
      items: [m.vp_90_4_a(), m.vp_90_4_b(), m.vp_90_4_c()],
    },
  ];
}

/* ------------------------------------------------------------------ */
/* 1. Proposition + the journey a buyer walks                          */
/* ------------------------------------------------------------------ */

function Proposition() {
  const { ref, show } = useReveal();
  const steps = getPathSteps();

  return (
    <section id="kuidas" className="bg-white py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-16" ref={ref}>
        {/* Asymmetric on purpose: the claim gets the wide column, the
            qualifier sits beside it rather than under it. */}
        <div className="grid gap-x-16 gap-y-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-end">
          <motion.h2
            className="font-['Poppins'] font-semibold tracking-tight text-black"
            style={{ fontSize: "clamp(30px, 4.4vw, 52px)", lineHeight: 1.08 }}
            {...show(0)}
          >
            {m.vp_heading_1()}{" "}
            {/* Own line from lg up: the turn in the sentence deserves the line
                break, and it stops the last two words orphaning. */}
          </motion.h2>
        </div>

        {/* One connected rail, not four columns. The dashes drift along it, so
            a static row of icons reads as a journey; the nodes are opaque so
            the line passes behind them. Horizontal from lg, vertical below. */}
        <ol className="relative grid gap-y-8 lg:grid-cols-4 lg:gap-x-8 list-none p-0 m-0">
          <div
            aria-hidden="true"
            className="rail-dashes-x absolute hidden h-px lg:block"
            style={{
              top: NODE / 2,
              left: NODE / 2,
              // The rail stops on the last node. With four equal columns it
              // sits 25% of the row in, less three quarters of a gap and a radius.
              right: `calc(25% - ${(RAIL_GAP * 3) / 4 + NODE / 2}px)`,
            }}
          />

          {steps.map((step, i) => (
            <motion.li key={step.title} className="relative" {...show(0.2 + i * 0.07)}>
              {i < steps.length - 1 && (
                <div
                  aria-hidden="true"
                  className="rail-dashes-y absolute w-px lg:hidden"
                  style={{ left: NODE / 2 - 0.5, top: NODE, bottom: -32 }}
                />
              )}

              <span
                className={`relative z-10 flex items-center justify-center rounded-full ${
                  step.decisive
                    ? "node-pulse text-white"
                    : "bg-white border border-black/12 text-[#8a94a6]"
                }`}
                style={{
                  width: NODE,
                  height: NODE,
                  backgroundColor: step.decisive ? BLUE : undefined,
                }}
              >
                <step.Icon size={20} strokeWidth={2} aria-hidden="true" />
              </span>

              <p
                className="font-['Poppins'] font-semibold text-black mt-5 mb-1.5"
                style={{ fontSize: "19px", lineHeight: 1.3 }}
              >
                {step.title}
              </p>
              <p
                className="font-['Poppins'] text-[#4a5568]"
                style={{ fontSize: "15px", lineHeight: 1.6 }}
              >
                {step.desc}
              </p>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 2. The funnel whose every value is unknown                          */
/* ------------------------------------------------------------------ */

function Measurement() {
  const { ref, inView, show } = useReveal();
  const funnel = getFunnel();
  const tracked = getTracked();

  return (
    <section
      id="mida-mootame"
      className="relative overflow-hidden py-24 lg:py-32"
      style={{ backgroundColor: DARK_GROUND }}
    >
      {/* Single soft light source, top left, so the ground is not flat black. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(115% 75% at 12% 0%, rgba(25,119,242,0.20) 0%, rgba(25,119,242,0) 58%)",
        }}
      />

      <div className="relative max-w-[1200px] mx-auto px-6 lg:px-16" ref={ref}>
        <motion.p
          className="font-['Poppins'] font-medium text-[#1977f2] mb-6"
          style={{ fontSize: "14px" }}
          {...show(0)}
        >
        </motion.p>

        <motion.h2
          className="font-['Poppins'] font-semibold tracking-tight text-white max-w-[18ch]"
          style={{ fontSize: "clamp(28px, 4vw, 46px)", lineHeight: 1.12 }}
          {...show(0.05)}
        >
          {m.vp_measure_heading()}
        </motion.h2>

        {/* The funnel. Each bar grows from the left on reveal and every value
            is a "?", which is the argument: the numbers exist, unmeasured. */}
        <ol className="grid gap-y-8 mt-12 lg:mt-16 list-none p-0 m-0">
          {funnel.map((row, i) => (
            <motion.li key={row.label} {...show(0.12 + i * 0.08)}>
              <div className="flex items-baseline justify-between gap-6 mb-3">
                <span
                  className="font-['Poppins'] text-white"
                  style={{ fontSize: "clamp(16px, 2.2vw, 19px)", lineHeight: 1.35 }}
                >
                  {row.label}
                </span>
                <span
                  className="font-['Poppins'] font-semibold text-[#1977f2] shrink-0"
                  style={{ fontSize: "26px", lineHeight: 1 }}
                  aria-label="?"
                >
                  ?
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-white/[0.07] overflow-hidden">
                <div
                  className="h-full rounded-full origin-left"
                  style={{
                    width: `${row.width}%`,
                    // The lost share is hatched rather than filled: it is the
                    // part of the funnel that never becomes anything.
                    backgroundColor: row.lost ? "transparent" : BLUE,
                    backgroundImage: row.lost
                      ? "repeating-linear-gradient(115deg, rgba(25,119,242,0.7) 0 5px, rgba(25,119,242,0) 5px 11px)"
                      : undefined,
                    transform: inView ? "scaleX(1)" : "scaleX(0)",
                    transition: `transform 1s ${EASE_CSS} ${0.2 + i * 0.12}s`,
                  }}
                />
              </div>
            </motion.li>
          ))}
        </ol>

        <motion.p
          className="font-['Poppins'] font-medium text-white/50 mt-16 lg:mt-20 pt-10 border-t border-white/10"
          style={{ fontSize: "14px" }}
          {...show(0.4)}
        >
          {m.vp_measure_bridge()}
        </motion.p>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
          {tracked.map((item, i) => (
            <motion.div
              key={item.title}
              className="rounded-2xl bg-white/[0.045] px-5 py-6"
              {...show(0.45 + i * 0.06)}
            >
              <item.Icon size={22} strokeWidth={1.8} className="text-[#1977f2] mb-4" aria-hidden="true" />
              <p
                className="font-['Poppins'] font-semibold text-white mb-1.5"
                style={{ fontSize: "17px", lineHeight: 1.35 }}
              >
                {item.title}
              </p>
              <p
                className="font-['Poppins'] text-white/60"
                style={{ fontSize: "14.5px", lineHeight: 1.55 }}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.p
          className="font-['Poppins'] text-white/50 mt-8"
          style={{ fontSize: "15px", lineHeight: 1.6 }}
          {...show(0.7)}
        >
          {m.vp_measure_note()}
        </motion.p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* 3. The first 90 days as a chart, then the guarantee                 */
/* ------------------------------------------------------------------ */

function NinetyDays() {
  const { ref, inView, show } = useReveal();
  const outcomes = getOutcomes();

  return (
    <section id="esimesed-90-paeva" className="bg-white py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-16" ref={ref}>
        <motion.p
          className="font-['Poppins'] font-medium text-[#8a94a6] mb-6"
          style={{ fontSize: "14px" }}
          {...show(0)}
        >
          {m.vp_90_label()}
        </motion.p>

        <motion.h2
          className="font-['Poppins'] font-semibold tracking-tight text-black max-w-[20ch]"
          style={{ fontSize: "clamp(28px, 4vw, 46px)", lineHeight: 1.12 }}
          {...show(0.05)}
        >
          {m.vp_90_heading()}
        </motion.h2>

        <motion.p
          className="font-['Poppins'] font-semibold text-black mt-4"
          style={{ fontSize: "20px" }}
          {...show(0.1)}
        >
          {m.vp_90_lead()}
        </motion.p>

        {/* The four curves leave the baseline in sequence, which is the claim.
            No y-axis: this is the shape of the first quarter, not a forecast.
            preserveAspectRatio="none" plus non-scaling strokes lets the chart
            keep a usable height on a phone without thinning the lines. */}
        <motion.div className="mt-12 lg:mt-16" {...show(0.15)}>
          <svg
            viewBox="0 0 720 240"
            preserveAspectRatio="none"
            role="img"
            aria-label={`${m.vp_90_heading()} — ${outcomes.map((o) => o.label).join(", ")}`}
            className="w-full h-[200px] sm:h-[250px] lg:h-[290px]"
          >
            <line
              x1="14"
              y1="222"
              x2="706"
              y2="222"
              stroke="rgba(0,0,0,0.18)"
              strokeWidth="1"
              strokeDasharray="5 5"
              vectorEffect="non-scaling-stroke"
            />
            {outcomes.map((o, i) => (
              <path
                key={o.label}
                d={o.d}
                fill="none"
                stroke={o.color}
                strokeWidth={i === outcomes.length - 1 ? 3 : 2.5}
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
                style={{
                  strokeDasharray: 1200,
                  strokeDashoffset: inView ? 0 : 1200,
                  transition: `stroke-dashoffset 1.7s ${EASE_CSS} ${0.15 + i * 0.18}s`,
                }}
              />
            ))}
          </svg>

          <div className="flex items-center justify-between mt-3">
            {["0", "30", "60", m.vp_chart_axis_end()].map((tick) => (
              <span
                key={tick}
                className="font-['Poppins'] text-[#8a94a6]"
                style={{ fontSize: "13px" }}
              >
                {tick}
              </span>
            ))}
          </div>
          {/* Reads as a key for the dashed line, not as a fifth axis tick. */}
          <div className="flex items-center gap-2 mt-3">
            <span
              aria-hidden="true"
              className="w-7 border-t border-dashed border-black/30"
            />
            <span
              className="font-['Poppins'] text-[#8a94a6]"
              style={{ fontSize: "13px" }}
            >
              {m.vp_chart_baseline()}
            </span>
          </div>
        </motion.div>

        {/* Legend and detail in one: the swatch ties each layer to its curve. */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6 mt-14 lg:mt-16">
          {outcomes.map((row, i) => (
            <motion.div key={row.label} {...show(0.25 + i * 0.08)}>
              <div
                className="h-[3px] w-10 rounded-full"
                style={{ backgroundColor: row.color }}
                aria-hidden="true"
              />
              <div className="flex items-center gap-2 mt-4">
                <row.Icon size={18} strokeWidth={2} style={{ color: row.color }} aria-hidden="true" />
                <p
                  className="font-['Poppins'] font-semibold text-black"
                  style={{ fontSize: "18px", lineHeight: 1.25 }}
                >
                  {row.label}
                </p>
              </div>
              <p
                className="font-['Poppins'] font-medium text-[#4a5568] mt-1 mb-4"
                style={{ fontSize: "14px" }}
              >
                {row.title}
              </p>
              <ul className="flex flex-wrap gap-2 list-none p-0 m-0">
                {row.items.map((item) => (
                  <li
                    key={item}
                    className="font-['Poppins'] text-[#4a5568] rounded-full bg-black/[0.045] px-3 py-1.5"
                    style={{ fontSize: "13px", lineHeight: 1.35 }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* The guarantee gets its own colour field, and states the offer as a
            contrast. Saying plainly what is NOT promised is what makes the
            second column believable. */}
        <motion.div
          className="mt-20 lg:mt-24 rounded-3xl px-8 py-12 lg:px-14 lg:py-14"
          style={{ backgroundColor: GUARANTEE_BLUE }}
          {...show(0.5)}
        >
          <div className="grid gap-x-16 gap-y-10 lg:grid-cols-[1fr_1.05fr] lg:items-start">
            <div>
              <h3
                className="font-['Poppins'] font-semibold text-white tracking-tight max-w-[16ch]"
                style={{ fontSize: "clamp(24px, 3vw, 36px)", lineHeight: 1.15 }}
              >
                {m.guarantee_heading_2()}
              </h3>
              <p
                className="font-['Poppins'] text-white/70 mt-4 max-w-[40ch]"
                style={{ fontSize: "16px", lineHeight: 1.65 }}
              >
                {m.guarantee_body()}
              </p>
            </div>

            <div className="grid gap-8 sm:grid-cols-2">
              <div>
                <p
                  className="font-['Poppins'] font-medium text-white/65 mb-4"
                  style={{ fontSize: "13px" }}
                >
                  {m.guarantee_not_label()}
                </p>
                <ul className="grid gap-2.5 list-none p-0 m-0">
                  {[m.guarantee_not_1(), m.guarantee_not_2()].map((item) => (
                    <li key={item} className="flex gap-2.5 items-start">
                      <X size={16} className="mt-[3px] shrink-0 text-white/55" aria-hidden="true" />
                      <span
                        className="font-['Poppins'] text-white/70"
                        style={{ fontSize: "15px", lineHeight: 1.5 }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <p
                  className="font-['Poppins'] font-medium text-white/65 mb-4"
                  style={{ fontSize: "13px" }}
                >
                  {m.guarantee_yes_label()}
                </p>
                <ul className="grid gap-2.5 list-none p-0 m-0">
                  {[m.guarantee_yes_1(), m.guarantee_yes_2(), m.guarantee_yes_3()].map((item) => (
                    <li key={item} className="flex gap-2.5 items-start">
                      <Check size={16} className="mt-[3px] shrink-0 text-white" aria-hidden="true" />
                      <span
                        className="font-['Poppins'] font-medium text-white"
                        style={{ fontSize: "15px", lineHeight: 1.5 }}
                      >
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <p
            className="font-['Poppins'] font-medium text-white border-t border-white/25 mt-10 pt-6"
            style={{ fontSize: "17px", lineHeight: 1.6 }}
          >
            {m.guarantee_statement()}
          </p>
        </motion.div>
      </div>
    </section>
  );
}

export function ValueProposition() {
  return (
    <>
      <Proposition />
      <WhyNow />
      <Measurement />
      <HowWeWork />
      <NinetyDays />
    </>
  );
}
