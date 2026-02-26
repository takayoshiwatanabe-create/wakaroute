"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { isRTL } from '@/i18n/utils';
import { useLocale } from "next-intl";

interface StepDisplayProps {
  steps: string[];
  className?: string;
}

export function StepDisplay({ steps, className }: StepDisplayProps) {
  const t = useTranslations("reverse_diagnose");
  const locale = useLocale();
  const rtl = isRTL(locale);

  if (!steps || steps.length === 0) {
    return (
      <div className={`p-4 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 ${className}`}>
        <p className="text-base font-medium">{t("no_steps_message")}</p>
      </div>
    );
  }

  return (
    <div className={`w-full max-w-xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 text-center">
        {t("steps_title")}
      </h2>
      <ul className="space-y-4">
        {steps.map((step, index) => (
          <li
            key={index}
            className={`flex items-start p-4 bg-gray-50 dark:bg-gray-700 rounded-md shadow-sm ${rtl ? 'flex-row-reverse text-right' : 'text-left'}`}
            style={{ direction: rtl ? 'rtl' : 'ltr' }}
          >
            <span className={`text-blue-500 dark:text-blue-400 font-bold text-lg ${rtl ? 'ml-3' : 'mr-3'}`}>
              {index + 1}.
            </span>
            <p className="text-gray-800 dark:text-gray-200 text-base flex-grow">{step}</p>
          </li>
        ))}
      </ul>
      <p className="mt-6 text-sm text-gray-600 dark:text-gray-400 text-center">
        {t("ai_suggestion_disclaimer")}
      </p>
    </div>
  );
}
