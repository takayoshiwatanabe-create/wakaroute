import React from "react";
import { useTranslations } from "next-intl";

export interface ChildProgressCardProps {
  childName: string;
  aiDecompositionsUsed: number;
  aiDecompositionsLimit: number | typeof Infinity;
  lastActivity: "activity_today" | "activity_yesterday" | "activity_two_days_ago";
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

  const aiLimitDisplay = aiDecompositionsLimit === Infinity ? t("unlimited") : aiDecompositionsLimit;

  return (
    <div
      data-testid="child-progress-card" // Added for testing
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 ${className}`}
    >
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        {childName}
      </h3>
      <div className="space-y-3 text-gray-700 dark:text-gray-300">
        <p>
          <span className="font-medium">{t("ai_decompositions_used")}:</span>{" "}
          {aiDecompositionsUsed}/{aiLimitDisplay}
        </p>
        <p>
          <span className="font-medium">{t("last_activity")}:</span>{" "}
          {t(lastActivity)}
        </p>
        <p>
          <span className="font-medium">{t("recent_discoveries")}:</span>{" "}
          {recentDiscoveries}
        </p>
      </div>
    </div>
  );
}

