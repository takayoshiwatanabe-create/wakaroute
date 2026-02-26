"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { isRTL } from '@/i18n/utils';
import { useLocale } from "next-intl";

export interface PlanCardProps {
  planName: string;
  price: string;
  features: string[];
  isCurrentPlan: boolean;
  onSelectPlan: (planName: string) => void;
  buttonText: string;
  isRecommended?: boolean;
  disabled?: boolean;
}

export function PlanCard({
  planName,
  price,
  features,
  isCurrentPlan,
  onSelectPlan,
  buttonText,
  isRecommended = false,
  disabled = false,
}: PlanCardProps) {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const rtl = isRTL(locale);

  const cardClasses = `
    relative flex flex-col p-6 rounded-lg shadow-lg border-2
    ${isCurrentPlan ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"}
    ${isRecommended ? "ring-4 ring-yellow-400 dark:ring-yellow-600" : ""}
    ${disabled ? "opacity-60 cursor-not-allowed" : ""}
  `;

  const buttonClasses = `
    w-full py-3 mt-6 rounded-md font-bold text-lg transition-colors
    ${isCurrentPlan
      ? "bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 cursor-not-allowed"
      : "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-600"}
    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
  `;

  return (
    <div className={cardClasses} style={{ direction: rtl ? 'rtl' : 'ltr' }}>
      {isRecommended && (
        <div className={`absolute ${rtl ? 'left-4' : 'right-4'} -top-3 bg-yellow-400 dark:bg-yellow-600 text-gray-900 dark:text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md`}>
          {t("recommended_badge")}
        </div>
      )}
      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 text-center">
        {planName}
      </h3>
      <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 mb-4 text-center">
        {price}
      </p>
      <ul className={`flex-grow space-y-2 mb-6 ${rtl ? 'text-right' : 'text-left'}`}>
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-gray-700 dark:text-gray-300">
            <span className={`text-green-500 dark:text-green-400 ${rtl ? 'ml-2' : 'mr-2'}`}>✔</span>
            {feature}
          </li>
        ))}
      </ul>
      <button
        onClick={() => onSelectPlan(planName)}
        className={buttonClasses}
        disabled={isCurrentPlan || disabled}
      >
        {isCurrentPlan ? t("current_plan_button") : buttonText}
      </button>
    </div>
  );
}

