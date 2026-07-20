/**
 * Meta Pixel conversion tracking.
 *
 * The pixel itself is loaded eagerly in index.html. Everything here degrades to
 * a no-op when `fbq` is missing (ad blocker, offline, pixel not yet parsed), so
 * callers never need to guard. Events are also mirrored into `dataLayer` so the
 * consent-gated GTM container can pick them up if tags are added there later.
 */

type Fbq = (...args: unknown[]) => void;
type Detail = Record<string, unknown>;

function getFbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { fbq?: Fbq };
  return typeof w.fbq === "function" ? w.fbq : null;
}

function pushDataLayer(event: string, detail?: Detail) {
  if (typeof window === "undefined") return;
  const w = window as unknown as { dataLayer?: Detail[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event, ...detail });
}

/**
 * A completed lead-form submission — the primary conversion.
 *
 * Fire this once, only after the submission actually succeeded. `source`
 * identifies which form it came from so Meta breakdowns stay readable.
 */
export function trackLead(source: string, detail?: Detail) {
  pushDataLayer("generate_lead", { source, ...detail });
  getFbq()?.("track", "Lead", { content_name: source, ...detail });
}

/**
 * A click on a phone or email link. Meta's standard `Contact` event, kept
 * distinct from `Lead` so form fills and click-to-call don't share a number.
 */
export function trackContact(method: "phone" | "email", source: string) {
  pushDataLayer("contact_click", { method, source });
  getFbq()?.("track", "Contact", { content_category: method, content_name: source });
}
