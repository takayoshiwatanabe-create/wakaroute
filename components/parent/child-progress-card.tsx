"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { isRTL } from '@/i18n/utils';
import { useLocale } from "next-intl";

interface ChildProgressCardProps {
  childName: string;
  aiDecompositionsUsed: number;
  aiDecompositionsLimit: number | typeof Infinity; // Allow Infinity for unlimited
  lastActivity: "activity_today" | "activity_yesterday" | "activity_two_days_ago"; // Specific keys for translation
  recentDiscoveries: number;
  className?: string;
}

export function ChildProgressCard({
  childName,
  aiDecompositionsUsed,
  aiDecompositionsLimit,
  lastActivity,
  recentDiscoveries,
  className,
}: ChildProgressCardProps) {
  const t = useTranslations("parent_dashboard");
  const locale = useLocale();
  const rtl = isRTL(locale);

  // Handle Infinity for aiDecompositionsLimit for Premium/Family/School plans
  const displayLimit = aiDecompositionsLimit === Infinity ? t("unlimited") : aiDecompositionsLimit;
  const progressPercentage = aiDecompositionsLimit === Infinity ? 0 : (aiDecompositionsUsed / aiDecompositionsLimit) * 100;
  const progressColor = progressPercentage > 80 ? "bg-red-500" : progressPercentage > 50 ? "bg-yellow-500" : "bg-green-500";

  return (
    <div className={`w-full max-w-sm p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md ${className}`}>
      <div className={`flex items-center mb-4 ${rtl ? 'flex-row-reverse' : ''}`}>
        <div className={`text-2xl ${rtl ? 'ml-4' : 'mr-4'}`}>👦</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex-grow" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
          {childName}
        </h3>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-1" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
          {t("ai_decomposition_usage")}
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
          <div
            className={`h-2.5 rounded-full ${progressColor}`}
            style={{ width: `${progressPercentage}%`, direction: rtl ? 'rtl' : 'ltr' }}
            role="progressbar"
            aria-valuenow={aiDecompositionsUsed}
            aria-valuemin={0}
            aria-valuemax={aiDecompositionsLimit === Infinity ? 100 : aiDecompositionsLimit} // Max for aria-valuemax should be a number
            aria-label={`${childName}'s AI decomposition usage`}
          ></div>
        </div>
        <p className="text-right text-gray-600 dark:text-gray-400 text-xs mt-1" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
          {t("usage_count", { used: aiDecompositionsUsed, limit: displayLimit })}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-1" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
          {t("last_activity")}
        </p>
        <p className="text-gray-900 dark:text-white text-base font-medium" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
          {t(lastActivity)} {/* Translate the activity key */}
        </p>
      </div>

      <div className="mb-4">
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-1" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
          {t("recent_discoveries")}
        </p>
        <p className="text-gray-900 dark:text-white text-base font-medium" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
          {t("discoveries_count", { count: recentDiscoveries })}
        </p>
      </div>

      <button
        className={`w-full p-2 mt-4 rounded-md bg-blue-500 text-white font-bold text-sm hover:bg-blue-600 transition-colors`}
        style={{ direction: rtl ? 'rtl' : 'ltr' }}
      >
        {t("view_details_button")}
      </button>
    </div>
  );
}
