export const dynamic = 'force-dynamic';

"use client";

import { SignupForm } from "@/components/auth/signup-form";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import { isRTL } from '@/i18n/utils';

export default function SignupPage() {
  const t = useTranslations("signup");
  const locale = useLocale();
  const rtl = isRTL(locale);
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
        {t("signup_welcome")}
      </h1>
      <SignupForm />
    </div>
  );
}
