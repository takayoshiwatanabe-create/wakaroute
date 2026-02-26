import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { getMessages } from 'next-intl/server';
import { isRTL } from '@/i18n/utils'; // Import isRTL from the new utility file

// Import global CSS (Tailwind)
import '../../global.css';

const inter = Inter({ subsets: ['latin'] });

const locales = ['ja', 'en', 'zh', 'ko', 'es', 'fr', 'de', 'pt', 'ar', 'hi'];

interface RootLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children, params: { locale } }: RootLayoutProps) {
  // Validate that the incoming `locale` parameter is a valid locale
  if (!locales.includes(locale as any)) notFound();

  // Get messages for the current locale
  const messages = await getMessages({ locale }); // Pass locale to getMessages

  // Determine if the current locale requires RTL layout using the utility function
  const rtl = isRTL(locale);

  return (
    <html lang={locale} dir={rtl ? 'rtl' : 'ltr'}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
