import { Phone, Mail } from "lucide-react";
import { trackContact } from "../../lib/analytics";
import {
  CONTACT_EMAIL,
  CONTACT_EMAIL_HREF,
  CONTACT_PHONE_DISPLAY,
  CONTACT_PHONE_HREF,
} from "../data/contact";

interface ContactLinksProps {
  /** Identifies the placement in the Meta `Contact` event (e.g. "header", "footer"). */
  source: string;
  className?: string;
}

/**
 * Compact single-row phone + email, for light-background headers.
 *
 * Hidden below `lg` by callers where the nav is already crowded; the mobile
 * menu renders the stacked variant instead so the links are never unreachable.
 */
export function ContactLinksInline({ source, className = "" }: ContactLinksProps) {
  const base =
    "font-['Poppins'] inline-flex items-center gap-1.5 text-[#4a5568] no-underline transition-colors duration-200 hover:text-[#1977f2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1977f2]/40 focus-visible:ring-offset-2 rounded-sm";

  return (
    <div className={`flex items-center gap-4 ${className}`} style={{ fontSize: "13px" }}>
      <a
        href={CONTACT_PHONE_HREF}
        className={base}
        onClick={() => trackContact("phone", source)}
      >
        <Phone size={14} aria-hidden="true" />
        <span>{CONTACT_PHONE_DISPLAY}</span>
      </a>
      <a
        href={CONTACT_EMAIL_HREF}
        className={base}
        onClick={() => trackContact("email", source)}
      >
        <Mail size={14} aria-hidden="true" />
        <span>{CONTACT_EMAIL}</span>
      </a>
    </div>
  );
}

interface StackedProps extends ContactLinksProps {
  /** `dark` for the black footer, `light` for the white mobile menu. */
  tone?: "dark" | "light";
}

/**
 * Stacked variant for the site footer and the mobile menu. The phone is
 * weighted as the primary action — it is the highest-intent contact route.
 */
export function ContactLinksStacked({ source, tone = "dark", className = "" }: StackedProps) {
  const isDark = tone === "dark";

  const phoneTone = isDark
    ? "text-white hover:text-[#7fb3ff] focus-visible:ring-white/50 focus-visible:ring-offset-black"
    : "text-[#0b1220] hover:text-[#1977f2] focus-visible:ring-[#1977f2]/40 focus-visible:ring-offset-white";

  const emailTone = isDark
    ? "text-white/60 hover:text-white focus-visible:ring-white/50 focus-visible:ring-offset-black"
    : "text-[#4a5568] hover:text-[#1977f2] focus-visible:ring-[#1977f2]/40 focus-visible:ring-offset-white";

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <a
        href={CONTACT_PHONE_HREF}
        onClick={() => trackContact("phone", source)}
        className={`font-['Poppins'] font-semibold no-underline inline-flex items-center gap-2.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm ${phoneTone}`}
        style={{ fontSize: isDark ? "20px" : "15px", lineHeight: "1.2" }}
      >
        <Phone size={isDark ? 17 : 15} aria-hidden="true" />
        <span>{CONTACT_PHONE_DISPLAY}</span>
      </a>
      <a
        href={CONTACT_EMAIL_HREF}
        onClick={() => trackContact("email", source)}
        className={`font-['Poppins'] no-underline inline-flex items-center gap-2.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 rounded-sm ${emailTone}`}
        style={{ fontSize: isDark ? "14px" : "13px", lineHeight: "1.3" }}
      >
        <Mail size={isDark ? 15 : 14} aria-hidden="true" />
        <span>{CONTACT_EMAIL}</span>
      </a>
    </div>
  );
}
