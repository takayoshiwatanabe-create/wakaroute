import React from "react";
import { useTranslations } from "next-intl";

interface AiFeedbackProps {
  message: string;
  type: "success" | "error" | "info";
  className?: string;
}

export function AiFeedback({ message, type, className }: AiFeedbackProps) {
  const t = useTranslations("decompose");

  let bgColorClass = "";
  let textColorClass = "";
  let icon = "";
  let iconColorClass = "";

  switch (type) {
    case "success":
      bgColorClass = "bg-green-100 dark:bg-green-900";
      textColorClass = "text-green-800 dark:text-green-200";
      icon = "✅"; // Positive icon
      iconColorClass = "text-green-500";
      break;
    case "error":
      // Adhering to "ポジティブ・ファースト" - no negative expressions
      bgColorClass = "bg-yellow-100 dark:bg-yellow-900";
      textColorClass = "text-yellow-800 dark:text-yellow-200";
      icon = "💡"; // Suggestion/Hint icon instead of error
      iconColorClass = "text-yellow-500";
      break;
    case "info":
    default:
      bgColorClass = "bg-blue-100 dark:bg-blue-900";
      textColorClass = "text-blue-800 dark:text-blue-200";
      icon = "ℹ️";
      iconColorClass = "text-blue-500";
      break;
  }

  return (
    <div
      className={`flex items-center p-4 rounded-lg ${bgColorClass} ${textColorClass} ${className}`}
      role="alert"
    >
      <span className={`text-2xl mr-3 ${iconColorClass}`} aria-hidden="true">{icon}</span>
      <p className="text-base font-medium">{message}</p>
    </div>
  );
}
