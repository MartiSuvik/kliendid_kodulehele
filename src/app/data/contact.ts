/**
 * Single source of truth for the public contact details.
 *
 * These appear in the header, footer and consultation page, and are also used
 * as Meta Pixel `Contact` conversion sources — keep the href/display pair in
 * sync here rather than hardcoding the number anywhere else.
 */

/** E.164, no spaces — required for `tel:` to dial correctly. */
export const CONTACT_PHONE_HREF = "tel:+37256728448";

/** Grouped for readability; Estonian mobile numbers read as +372 XXXX XXXX. */
export const CONTACT_PHONE_DISPLAY = "+372 5672 8448";

export const CONTACT_EMAIL = "info@kliendidkodulehele.ee";
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;
