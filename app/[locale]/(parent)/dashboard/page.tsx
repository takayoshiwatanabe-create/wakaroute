"use client";

import { useTranslations } from "next-intl";
import { ChildProgressCard } from "@/components/parent/child-progress-card";
import { useLocale } from "next-intl";
import { isRTL } from '@/i18n/utils';
import { useEffect, useState } from "react";
import { getChildrenProgressAction } from "./actions"; // Import the server action

// Define a type for child progress data
interface ChildProgress {
  id: string;
  name: string;
  aiDecompositionsUsed: number;
  aiDecompositionsLimit: number;
  lastActivity: string; // This would ideally be a Date and formatted on client
  recentDiscoveries: number;
}

export default function ParentDashboardPage() {
  const t = useTranslations("parent_dashboard");
  const locale = useLocale();
  const rtl = isRTL(locale);
  const [childrenProgress, setChildrenProgress] = useState<ChildProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChildren() {
      setLoading(true);
      setError(null);
      try {
        // Call the server action to fetch children's progress
        const result = await getChildrenProgressAction();

        if (result.error) {
          setError(result.error);
        } else if (result.children) {
          setChildrenProgress(result.children.map(child => ({
            id: child.id,
            name: child.email.split('@')[0], // Simple name extraction
            aiDecompositionsUsed: child.monthlyAiDecompositions,
            aiDecompositionsLimit: child.plan === 'Free' ? 5 : 999, // Based on plan from CLAUDE.md
            lastActivity: child.lastActivity,
            recentDiscoveries: child.recentDiscoveries,
          })));
        }
      } catch (err) {
        console.error("Failed to fetch children progress:", err);
        setError("Failed to load children's progress. Please try again.");
      } finally {
        setLoading(false);
      }
    }
    fetchChildren();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">{t("loading_children_progress")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
        {t("dashboard_title")}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 text-center max-w-prose" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
        {t("dashboard_subtitle")}
      </p>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl ${rtl ? 'rtl' : ''}`}>
        {childrenProgress.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400 col-span-full">
            {t("no_children_registered")}
          </p>
        ) : (
          childrenProgress.map((child) => (
            <ChildProgressCard
              key={child.id}
              childName={child.name}
              aiDecompositionsUsed={child.aiDecompositionsUsed}
              aiDecompositionsLimit={child.aiDecompositionsLimit}
              lastActivity={t(child.lastActivity as "activity_today" | "activity_yesterday" | "activity_two_days_ago")} // Translate activity string
              recentDiscoveries={child.recentDiscoveries}
              className="w-full"
            />
          ))
        )}
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

