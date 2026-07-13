/**
 * Deferred third-party loading helpers.
 *
 * Heavy analytics / marketing / widget scripts inflate LCP and TBT when they run
 * during initial load. These helpers push them off the critical path: a callback
 * runs at the first of browser idle (requestIdleCallback, with a setTimeout
 * fallback) OR the first user interaction, whichever comes first.
 */

type Cb = () => void;

const INTERACTION_EVENTS = ["pointerdown", "keydown", "touchstart", "scroll"] as const;

interface RicWindow extends Window {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
}

/**
 * Run `cb` once, at the first of: browser idle (bounded by `idleTimeout` ms) or
 * a user interaction. Interaction listeners are removed after firing.
 */
export function onIdleOrInteraction(cb: Cb, idleTimeout = 2500): void {
  let fired = false;
  const run = () => {
    if (fired) return;
    fired = true;
    INTERACTION_EVENTS.forEach((e) => window.removeEventListener(e, run));
    cb();
  };

  INTERACTION_EVENTS.forEach((e) =>
    window.addEventListener(e, run, { once: true, passive: true }),
  );

  const ric = (window as RicWindow).requestIdleCallback;
  if (ric) ric(run, { timeout: idleTimeout });
  else window.setTimeout(run, idleTimeout);
}

/** Inject a `<script>` with the given src + attributes; returns the element. */
export function loadScript(
  src: string,
  attrs: Record<string, string | boolean> = {},
): HTMLScriptElement {
  const s = document.createElement("script");
  s.src = src;
  for (const [k, v] of Object.entries(attrs)) {
    if (v === false) continue;
    s.setAttribute(k, v === true ? "" : v);
  }
  document.body.appendChild(s);
  return s;
}
