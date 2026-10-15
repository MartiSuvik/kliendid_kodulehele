/**
 * Single source of truth for the public contact details.
 *
 * These appear in the site header and footer, and are also used
 * as Meta Pixel `Contact` conversion sources — keep the href/display pair in
 * sync here rather than hardcoding the number anywhere else.
 */

/** E.164, no spaces — required for `tel:` to dial correctly. */
export const CONTACT_PHONE_HREF = "tel:+37256728448";

/** Grouped for readability; Estonian mobile numbers read as +372 XXXX XXXX. */
export const CONTACT_PHONE_DISPLAY = "+372 5672 8448";

export const CONTACT_EMAIL = "info@kliendidkodulehele.ee";
export const CONTACT_EMAIL_HREF = `mailto:${CONTACT_EMAIL}`;

/**
 * NAP (name / address / phone) — the single source for the footer block, the
 * LocalBusiness JSON-LD and the map embed.
 *
 * This string must match the Google Business Profile character for character.
 * Inconsistent NAP across a site, GBP and directories is the most common reason
 * a local business fails to consolidate into one entity.
 */
export const BUSINESS_NAME = "Kliendid Kodulehele";
export const BUSINESS_LEGAL_NAME = "EFFI AI SOLUTIONS OÜ";
export const BUSINESS_REG_NR = "17306855";

export const ADDRESS_STREET = "Tornimäe tn 5";
export const ADDRESS_POSTAL_CODE = "10145";
export const ADDRESS_LOCALITY = "Tallinn";
export const ADDRESS_REGION = "Harju maakond";
export const ADDRESS_COUNTRY = "EE";
export const ADDRESS_COUNTRY_NAME = "Eesti";

/** From the Google Business Profile listing, not an approximation. */
export const GEO_LAT = 59.4332335;
export const GEO_LNG = 24.7609721;

/** Google Business Profile CID → canonical Maps URL for hasMap / sameAs. */
export const GBP_CID = "15239875479106362545";
export const GBP_MAPS_URL = `https://www.google.com/maps/place/?cid=${GBP_CID}`;

/** Keyless Maps embed — no API key, no billing, and it survives prerendering. */
export const MAPS_EMBED_SRC =
  "https://maps.google.com/maps?q=" +
  encodeURIComponent(`${ADDRESS_STREET}, ${ADDRESS_POSTAL_CODE} ${ADDRESS_LOCALITY}`) +
  "&output=embed";

export const INFOREGISTER_URL =
  "https://www.inforegister.ee/en/17306855-EFFI-AI-SOLUTIONS-OU/";
