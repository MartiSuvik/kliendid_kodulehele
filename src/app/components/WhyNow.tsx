import { useEffect, useRef } from "react";
import { motion } from "motion/react";
import { useInView } from "./hooks/useAnimations";
import { globeDotVectors } from "./globeDots";
import * as m from "../../paraglide/messages.js";

/**
 * Why AI search matters here, evidenced rather than asserted.
 *
 * The claim is Statistikaamet's own headline, linked, so the strongest sentence
 * on the homepage is one a reader can check. Everything else in this section is
 * two short lines: the statistic has to be the thing you remember.
 */

const STAT_URL =
  "https://stat.ee/et/uudised/pea-pooled-eesti-inimesed-kasutavad-tehisintellekti";

/** Tallinn first and largest: the point is that this is happening here. */
const MARKERS: { location: [number, number]; size: number }[] = [
  { location: [59.437, 24.7536], size: 0.055 }, // Tallinn
  { location: [58.378, 26.7289], size: 0.026 }, // Tartu
  { location: [56.9496, 24.1052], size: 0.024 }, // Riga
  { location: [60.1699, 24.9384], size: 0.026 }, // Helsinki
  { location: [59.3293, 18.0686], size: 0.024 }, // Stockholm
  { location: [52.52, 13.405], size: 0.024 }, // Berlin
  { location: [51.5074, -0.1278], size: 0.024 }, // London
  { location: [40.7128, -74.006], size: 0.026 }, // New York
  { location: [37.7749, -122.4194], size: 0.026 }, // San Francisco
];

/**
 * Rotating dot globe, drawn with canvas 2D.
 *
 * This was `cobe` first, as the reference component used. On this stack cobe
 * never gets its land texture into the shader: the sphere and the markers draw
 * but the continents do not, on 2.0.1 and 0.6.3 alike, and on its own README
 * config as much as ours. Rather than keep guessing at a third party WebGL bug
 * for a decorative element, the globe is drawn directly. That also drops a
 * dependency, a WebGL context and ~16 KB from the page.
 *
 * Cheap by construction: the dot vectors are precomputed, each frame is one
 * rotation plus one batched Path2D fill, it runs at 30fps, and it only runs
 * while the section is actually on screen.
 */
function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dots = globeDotVectors();
    const count = dots.length / 3;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Tilt so the sub-viewer point sits around 26N: that puts the
    // Mediterranean at the centre and Tallinn in the upper third, rather than
    // on the rim where its marker would be half clipped.
    const TILT = 0.45;
    const sinT = Math.sin(TILT);
    const cosT = Math.cos(TILT);

    // A point at longitude L is dead centre when phi is -L, so this opens on
    // Tallinn at 24.75E rather than in the middle of the Pacific.
    let phi = -0.432;
    let raf = 0;
    let last = 0;
    let running = false;
    let size = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      size = canvas.offsetWidth;
      canvas.width = Math.round(size * dpr);
      canvas.height = Math.round(size * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = () => {
      if (!size) return;
      const c = size / 2;
      const r = size * 0.42;
      ctx.clearRect(0, 0, size, size);

      // The sphere itself, lit from the upper left.
      const grad = ctx.createRadialGradient(c - r * 0.42, c - r * 0.5, r * 0.1, c, c, r);
      grad.addColorStop(0, "#1b2536");
      grad.addColorStop(1, "#080b12");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.fill();

      const sinP = Math.sin(phi);
      const cosP = Math.cos(phi);

      // Two passes so 1649 dots cost two rasterisations, not 1649.
      const near = new Path2D();
      const far = new Path2D();
      for (let i = 0; i < count; i++) {
        const x0 = dots[i * 3];
        const y0 = dots[i * 3 + 1];
        const z0 = dots[i * 3 + 2];
        // spin about the pole, then tilt
        const x1 = x0 * cosP + z0 * sinP;
        const z1 = z0 * cosP - x0 * sinP;
        const y2 = y0 * cosT - z1 * sinT;
        const z2 = z1 * cosT + y0 * sinT;
        if (z2 <= 0.02) continue; // back of the sphere
        const px = c + x1 * r;
        const py = c - y2 * r;
        const rad = size * (0.0026 + 0.0022 * z2);
        const path = z2 > 0.55 ? near : far;
        path.moveTo(px + rad, py);
        path.arc(px, py, rad, 0, Math.PI * 2);
      }
      ctx.fillStyle = "rgba(120,160,215,0.38)";
      ctx.fill(far);
      ctx.fillStyle = "rgba(198,222,255,0.92)";
      ctx.fill(near);

      // Clip so a marker halo near the limb cannot bleed off the sphere.
      ctx.save();
      ctx.beginPath();
      ctx.arc(c, c, r, 0, Math.PI * 2);
      ctx.clip();
      for (const marker of MARKERS) {
        const lat = (marker.location[0] * Math.PI) / 180;
        const lon = (marker.location[1] * Math.PI) / 180;
        const cl = Math.cos(lat);
        const x0 = cl * Math.sin(lon);
        const y0 = Math.sin(lat);
        const z0 = cl * Math.cos(lon);
        const x1 = x0 * cosP + z0 * sinP;
        const z1 = z0 * cosP - x0 * sinP;
        const y2 = y0 * cosT - z1 * sinT;
        const z2 = z1 * cosT + y0 * sinT;
        if (z2 <= 0) continue;
        const px = c + x1 * r;
        const py = c - y2 * r;
        const rad = r * marker.size;
        ctx.beginPath();
        ctx.arc(px, py, rad * 2.4, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59,140,255,0.18)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(px, py, rad, 0, Math.PI * 2);
        ctx.fillStyle = "#3b8cff";
        ctx.fill();
      }
      ctx.restore();
    };

    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (t - last < 33) return; // 30fps is plenty for a slow rotation
      phi += (t - last) * 0.00006;
      last = t;
      draw();
    };

    const start = () => {
      if (running) return;
      running = true;
      canvas.style.opacity = "1";
      if (still) {
        draw();
        return;
      }
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(raf);
    };

    resize();
    // Only spin while it is on screen: an offscreen render loop is pure drain.
    const io = new IntersectionObserver(
      (entries) => (entries[0]?.isIntersecting ? start() : stop()),
      { rootMargin: "120px" }
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      resize();
      draw();
    });
    ro.observe(canvas);

    const onVisibility = () => (document.hidden ? stop() : io.observe(canvas));
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="w-full aspect-square opacity-0 transition-opacity duration-700 [contain:layout_paint_size]"
    />
  );
}

export function WhyNow() {
  const { ref, inView } = useInView(0.1);
  const show = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: inView ? { opacity: 1, y: 0 } : {},
    transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="miks-praegu" className="bg-[#f5f7fa] py-24 lg:py-32">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-16" ref={ref}>
        <div className="grid gap-x-16 gap-y-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <motion.p
              className="font-['Poppins'] font-medium text-[#8a94a6] mb-6"
              style={{ fontSize: "14px" }}
              {...show(0)}
            >
            </motion.p>

            <motion.h2
              className="font-['Poppins'] font-semibold tracking-tight text-black"
              style={{ fontSize: "clamp(28px, 4vw, 46px)", lineHeight: 1.12 }}
              {...show(0.05)}
            >
              {m.why_heading()}
            </motion.h2>

            <motion.p
              className="font-['Poppins'] text-[#4a5568] mt-6 max-w-[46ch]"
              style={{ fontSize: "17px", lineHeight: 1.7 }}
              {...show(0.1)}
            >
              {m.why_body()}
            </motion.p>

            <motion.p className="mt-8" {...show(0.15)}>
              <a
                href={STAT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-['Poppins'] text-[#4a5568] underline underline-offset-4 decoration-black/25 hover:text-black hover:decoration-black transition-colors"
                style={{ fontSize: "14px" }}
              >
                {m.why_source()}
              </a>
            </motion.p>
          </div>

          {/* Decorative. Capped so it never dominates the statistic. */}
          <motion.div className="mx-auto w-full max-w-[420px]" {...show(0.2)}>
            <Globe />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
