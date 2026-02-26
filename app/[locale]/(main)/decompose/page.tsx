"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { InputArea } from "@/components/decompose/input-area";
import { AiFeedback } from "@/components/decompose/ai-feedback";

export default function DecomposePage() {
  const t = useTranslations("decompose");
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info" | null>(null);

  const handleDecompose = async (input: string, image?: File) => {
    setIsLoading(true);
    setFeedbackMessage(null);
    setFeedbackType(null);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // In a real scenario, you'd send `input` and `image` to a server action/API route
    // and handle the AI response.
    // For now, simulate a success or error based on input.
    if (input.toLowerCase().includes("error")) {
      setFeedbackMessage(t("decompose_error_generic"));
      setFeedbackType("error");
    } else {
      setFeedbackMessage(t("decompose_success_message"));
      setFeedbackType("success");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        {t("decompose_title")}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center max-w-prose">
        {t("decompose_subtitle")}
      </p>

      <InputArea
        onDecompose={handleDecompose}
        isLoading={isLoading}
      />

      {feedbackMessage && feedbackType && (
        <AiFeedback message={feedbackMessage} type={feedbackType} className="mt-8" />
      )}
    </div>
  );
}
