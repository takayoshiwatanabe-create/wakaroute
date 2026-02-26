import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { getMessages } from 'next-intl/server';

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
  const messages = await getMessages();

  // Determine if the current locale requires RTL layout
  const isRTL = locale === 'ar';

  return (
    <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
