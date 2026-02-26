"use client";

import { useTranslations } from "next-intl";
import { ChildProgressCard } from "@/components/parent/child-progress-card";
import { useLocale } from "next-intl";
import { isRTL } from '@/i18n/utils';

export default function ParentDashboardPage() {
  const t = useTranslations("parent_dashboard");
  const locale = useLocale();
  const rtl = isRTL(locale);

  // Mock data for children's progress
  // In a real application, this data would be fetched from a server action
  const childrenProgress = [
    {
      id: "child1",
      name: "太郎",
      aiDecompositionsUsed: 3,
      aiDecompositionsLimit: 5, // Free plan limit
      lastActivity: t("activity_today"), // Use translation for dynamic strings
      recentDiscoveries: 3,
    },
    {
      id: "child2",
      name: "花子",
      aiDecompositionsUsed: 15,
      aiDecompositionsLimit: 999, // Premium plan limit (or effectively unlimited)
      lastActivity: t("activity_yesterday"), // Use translation for dynamic strings
      recentDiscoveries: 7,
    },
    {
      id: "child3",
      name: "ジョン",
      aiDecompositionsUsed: 7,
      aiDecompositionsLimit: 5, // Exceeded free plan limit
      lastActivity: t("activity_two_days_ago"), // Use translation for dynamic strings
      recentDiscoveries: 2,
    },
  ];

  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
        {t("dashboard_title")}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 text-center max-w-prose" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
        {t("dashboard_subtitle")}
      </p>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl ${rtl ? 'rtl' : ''}`}>
        {childrenProgress.map((child) => (
          <ChildProgressCard
            key={child.id}
            childName={child.name}
            aiDecompositionsUsed={child.aiDecompositionsUsed}
            aiDecompositionsLimit={child.aiDecompositionsLimit}
            lastActivity={child.lastActivity}
            recentDiscoveries={child.recentDiscoveries}
            className="w-full"
          />
        ))}
      </div>

      <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-950 rounded-lg shadow-inner text-center max-w-2xl" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
        <h2 className="text-xl font-semibold text-blue-800 dark:text-blue-200 mb-3">
          {t("privacy_note_title")}
        </h2>
        <p className="text-blue-700 dark:text-blue-300 text-sm">
          {t("privacy_note_content")}
        </p>
      </div>
    </div>
  );
}

