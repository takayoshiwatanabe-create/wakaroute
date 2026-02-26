import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import { getMessages } from 'next-intl/server';
import { isRTL } from '@/i18n/utils'; // Import isRTL from the new utility file
import { SessionProvider } from 'next-auth/react'; // Import SessionProvider

// Import global CSS (Tailwind)
import '../../global.css';

const inter = Inter({ subsets: ['latin'] });

// CLAUDE.md Section 4.4: Supported languages: ja, en, zh, ko, es, fr, de, pt, ar, hi
const locales = ['ja', 'en', 'zh', 'ko', 'es', 'fr', 'de', 'pt', 'ar', 'hi'];

interface RootLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default async function LocaleLayout({ children, params: { locale } }: RootLayoutProps) {
  // Validate that the incoming `locale` parameter is a valid locale
  if (!locales.includes(locale)) notFound();

  // Get messages for the current locale
  const messages = await getMessages({ locale }); // Pass locale to getMessages

  // Determine if the current locale requires RTL layout using the utility function
  // CLAUDE.md Section 4.4: RTL（右から左）レイアウト: アラビア語で全画面テスト必須
  const rtl = isRTL(locale);

  return (
    <html lang={locale} dir={rtl ? 'rtl' : 'ltr'}>
      <body className={inter.className}>
        {/* SessionProvider should wrap the entire application to make session available to all components */}
        <SessionProvider>
          <NextIntlClientProvider messages={messages}> {/* messages prop is enough, locale is implicitly available */}
            {children}
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
