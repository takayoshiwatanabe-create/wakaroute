"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { InputArea } from "@/components/decompose/input-area";
import { AiFeedback } from "@/components/decompose/ai-feedback";
import { decomposeAction } from "@/app/(main)/decompose/actions"; // Import the server action

export default function DecomposePage() {
  const t = useTranslations("decompose");
  const [isLoading, setIsLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "info" | null>(null); // Removed 'error' type as per positive-first

  const handleDecompose = async (textInput: string, imageFile?: File) => {
    setIsLoading(true);
    setFeedbackMessage(null);
    setFeedbackType(null);

    const formData = new FormData();
    if (textInput) {
      formData.append("textInput", textInput);
    }
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }

    try {
      const result = await decomposeAction(formData);

      if (result.success) {
        setFeedbackMessage(result.message);
        setFeedbackType("success");
      } else {
        // Even for errors, we display a positive/neutral message as per "ポジティブ・ファースト"
        setFeedbackMessage(result.message || t("decompose_error_generic"));
        setFeedbackType(result.type || "info"); // Use 'info' as a fallback for error type
      }
    } catch (error) {
      console.error("Error calling decompose action:", error);
      setFeedbackMessage(t("decompose_error_generic"));
      setFeedbackType("info"); // Still info, not 'error' type for display
    } finally {
      setIsLoading(false);
    }
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

