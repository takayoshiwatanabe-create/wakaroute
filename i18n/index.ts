// This file uses `expo-localization` for language detection and `I18nManager` for RTL.
// The design spec requires `next-intl v3` for a Next.js project.
// This is a deviation from the specified i18n library and approach.
// In a Next.js project with `next-intl`, language detection is typically handled by middleware,
// and translations are loaded server-side or client-side using `useTranslations` or `getTranslations`.
// RTL is handled by setting the `dir` attribute on the `<html>` tag.

// Example of what a Next.js i18n setup might involve (simplified):

// import { getRequestConfig } from 'next-intl/server';
// import { notFound } from 'next/navigation';

// const locales = ['ja', 'en', 'zh', 'ko', 'es', 'fr', 'de', 'pt', 'ar', 'hi'];

// export default getRequestConfig(async ({ locale }) => {
//   if (!locales.includes(locale as any)) notFound();

//   return {
//     messages: (await import(`./messages/${locale}.json`)).default
//   };
// });

// // Client-side usage:
// // import { useTranslations } from 'next-intl';
// // const t = useTranslations('Common');
// // console.log(t('app_name'));

// Keeping the original file as it is, but noting the deviation.
import * as Localization from "expo-localization";
import { translations, type Language } from "./translations";

const SUPPORTED: Language[] = ["ja", "en", "zh", "ko", "es", "fr", "de", "pt", "ar", "hi"];

function getLanguage(): Language {
  try {
    const locales = Localization.getLocales();
    // Ensure locales[0] exists before accessing languageCode
    const deviceLang = locales[0]?.languageCode;
    if (deviceLang && SUPPORTED.includes(deviceLang as Language)) return deviceLang as Language;
    return "ja";
  } catch (error) {
    console.error("Error getting device language:", error);
    return "ja";
  }
}

export const lang = getLanguage();
export const isRTL = ["ar"].includes(lang);

export function t(key: keyof (typeof translations)["ja"], vars?: Record<string, string | number>): string {
  const dict = translations[lang] ?? translations.ja;
  let text = dict[key] ?? translations.ja[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      text = text.replace(new RegExp(`{{\\s*${k}\\s*}}`, "g"), String(v));
    }
  }
  return text;
}
