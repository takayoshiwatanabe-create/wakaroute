import { getRequestConfig } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { isRTL } from './utils'; // Import isRTL from the new utility file

const locales = ['ja', 'en', 'zh', 'ko', 'es', 'fr', 'de', 'pt', 'ar', 'hi'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (await import(`./messages/${locale}.json`)).default,
    // Pass the isRTL flag to the client-side provider if needed,
    // though `dir` attribute on <html> is often sufficient.
    // For specific component-level RTL logic, `useLocale` and `isRTL` can be used directly.
    timeZone: 'Asia/Tokyo', // Example: Set a default timezone
    // Other configurations can go here
  };
});


