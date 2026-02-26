"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { DiagnosisInput } from "@/components/reverse-diagnose/diagnosis-input";
import { StepDisplay } from "@/components/reverse-diagnose/step-display";
import { AiFeedback } from "@/components/decompose/ai-feedback"; // Reusing AiFeedback for consistency

export default function ReverseDiagnosePage() {
  const t = useTranslations("reverse_diagnose");
  const [isLoading, setIsLoading] = useState(false);
  const [diagnosisSteps, setDiagnosisSteps] = useState<string[] | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<"success" | "error" | "info" | null>(null);

  const handleDiagnose = async (currentUnderstanding: string) => {
    setIsLoading(true);
    setDiagnosisSteps(null);
    setFeedbackMessage(null);
    setFeedbackType(null);

    // Placeholder for actual server action call
    // In a real scenario, you would call a server action here:
    // const result = await reverseDiagnoseAction(currentUnderstanding);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      const mockResult = {
        success: true,
        message: [
          "まず、足し算の基本的なルールを復習しましょう。",
          "次に、1桁の引き算の練習問題をたくさん解いてみましょう。",
          "繰り下がりのある引き算の仕組みを、具体例を使って理解しましょう。",
          "最後に、足し算と引き算が混ざった問題を解いて、どちらの計算を使うべきか判断する練習をしましょう。"
        ],
        type: "success"
      };

      if (mockResult.success) {
        setDiagnosisSteps(mockResult.message);
        setFeedbackType("success");
      } else {
        // Adhering to "ポジティブ・ファースト"
        setFeedbackMessage(t("reverse_diagnose_error_generic"));
        setFeedbackType("info");
      }
    } catch (error) {
      console.error("Error during reverse diagnosis:", error);
      setFeedbackMessage(t("reverse_diagnose_error_generic"));
      setFeedbackType("info");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        {t("reverse_diagnose_title")}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 text-center max-w-prose">
        {t("reverse_diagnose_subtitle")}
      </p>

      <DiagnosisInput
        onDiagnose={handleDiagnose}
        isLoading={isLoading}
      />

      {feedbackMessage && feedbackType && (
        <AiFeedback message={feedbackMessage} type={feedbackType} className="mt-8" />
      )}

      {diagnosisSteps && diagnosisSteps.length > 0 && (
        <StepDisplay steps={diagnosisSteps} className="mt-8" />
      )}
    </div>
  );
}
