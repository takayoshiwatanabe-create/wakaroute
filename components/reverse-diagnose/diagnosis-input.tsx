"use client";

import React, { useState, ChangeEvent } from "react";
import { useTranslations } from "next-intl";
import { isRTL } from '@/i18n/utils';
import { useLocale } from "next-intl";

interface DiagnosisInputProps {
  onDiagnose: (currentUnderstanding: string) => void;
  isLoading: boolean;
}

// Basic components for now, replace with shadcn/ui later
const Textarea = ({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    className={`w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 resize-none ${className}`}
    rows={5}
    {...props}
  />
);

const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`w-full p-3 rounded-md bg-blue-500 text-white font-bold text-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    {...props}
  />
);

export function DiagnosisInput({ onDiagnose, isLoading }: DiagnosisInputProps) {
  const t = useTranslations("reverse_diagnose");
  const locale = useLocale();
  const rtl = isRTL(locale);
  const [currentUnderstanding, setCurrentUnderstanding] = useState<string>("");

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentUnderstanding(e.target.value);
  };

  const handleSubmit = () => {
    if (currentUnderstanding.trim()) {
      onDiagnose(currentUnderstanding.trim());
    }
  };

  const isSubmitDisabled = isLoading || !currentUnderstanding.trim();

  return (
    <div className="w-full max-w-xl p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <Textarea
        placeholder={t("input_placeholder")}
        value={currentUnderstanding}
        onChange={handleTextChange}
        disabled={isLoading}
        style={{ direction: rtl ? 'rtl' : 'ltr' }}
        aria-label={t("input_aria_label")}
      />

      <Button onClick={handleSubmit} disabled={isSubmitDisabled}>
        {isLoading ? t("diagnosing_button") : t("diagnose_button")}
      </Button>
    </div>
  );
}


