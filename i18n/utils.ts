// This file provides utility functions for i18n, including RTL detection.

/**
 * Checks if a given locale should be rendered in Right-to-Left (RTL) direction.
 * @param locale The locale string (e.g., 'en', 'ar').
 * @returns True if the locale is RTL, false otherwise.
 */
export function isRTL(locale: string): boolean {
  // List of known RTL languages
  const rtlLocales = ['ar', 'fa', 'he', 'ur']; // Arabic, Persian, Hebrew, Urdu
  return rtlLocales.includes(locale.split('-')[0]); // Check base language code
}

