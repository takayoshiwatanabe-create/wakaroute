"use client";

import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';

interface I18nProviderProps {
  messages: Record<string, string>;
  locale: string;
  children: ReactNode;
}

export function I18nProvider({ messages, locale, children }: I18nProviderProps) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}


