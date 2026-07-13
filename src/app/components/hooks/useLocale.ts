import { getLocale, baseLocale } from "../../../paraglide/runtime.js";

/**
 * Returns the URL prefix for the current locale.
 * Base locale (et) → "", English → "/en"
 */
export function getLocalePrefix(): string {
  const locale = getLocale();
  return locale === baseLocale ? "" : `/${locale}`;
}

/**
 * Builds a localized href. Prepends the locale prefix to the given path.
 */
export function localizeHref(path: string): string {
  const prefix = getLocalePrefix();
  if (path.startsWith("#")) return path; // anchor links stay as-is
  return `${prefix}${path}`;
}
