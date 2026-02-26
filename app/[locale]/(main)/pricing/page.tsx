"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { PlanCard, PlanCardProps } from "@/components/pricing/plan-card";
import { useLocale } from "next-intl";
import { isRTL } from '@/i18n/utils';
import { auth } from "@/lib/auth"; // Import auth to get session data
import { getSession } from "next-auth/react"; // Client-side session retrieval

export default function PricingPage() {
  const t = useTranslations("pricing");
  const locale = useLocale();
  const rtl = isRTL(locale);

  const [currentPlan, setCurrentPlan] = useState<string>("Free"); // Default to Free
  const [loadingSession, setLoadingSession] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      setLoadingSession(true);
      const session = await getSession();
      if (session?.user?.plan) {
        setCurrentPlan(session.user.plan);
      }
      setLoadingSession(false);
    };
    fetchSession();
  }, []);

  const handleSelectPlan = (planName: string) => {
    // In a real application, this would trigger a payment flow or plan upgrade action
    console.log(`Selected plan: ${planName}`);
    // For demonstration, we'll just update the current plan
    setCurrentPlan(planName);
    alert(t("plan_selected_message", { planName }));
  };

  const plans: PlanCardProps[] = [
    {
      planName: t("free_plan_name"),
      price: t("free_price"),
      features: [
        t("free_feature_1"),
        t("free_feature_2"),
        t("free_feature_3"),
        t("free_feature_4"),
      ],
      isCurrentPlan: currentPlan === "Free",
      onSelectPlan: handleSelectPlan,
      buttonText: t("select_button"),
    },
    {
      planName: t("premium_plan_name"),
      price: t("premium_price"),
      features: [
        t("premium_feature_1"),
        t("premium_feature_2"),
        t("premium_feature_3"),
        t("premium_feature_4"),
      ],
      isCurrentPlan: currentPlan === "Premium",
      onSelectPlan: handleSelectPlan,
      buttonText: t("select_button"),
      isRecommended: true,
    },
    {
      planName: t("family_plan_name"),
      price: t("family_price"),
      features: [
        t("family_feature_1"),
        t("family_feature_2"),
      ],
      isCurrentPlan: currentPlan === "Family",
      onSelectPlan: handleSelectPlan,
      buttonText: t("select_button"),
    },
    {
      planName: t("school_plan_name"),
      price: t("school_price"),
      features: [
        t("school_feature_1"),
        t("school_feature_2"),
        t("school_feature_3"),
      ],
      isCurrentPlan: currentPlan === "School",
      onSelectPlan: handleSelectPlan,
      buttonText: t("contact_us_button"),
      disabled: true, // School plan typically requires custom setup
    },
  ];

  if (loadingSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
        <p className="text-xl text-gray-700 dark:text-gray-300">{t("loading_plans")}</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center p-6 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
        {t("pricing_title")}
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 text-center max-w-prose" style={{ direction: rtl ? 'rtl' : 'ltr' }}>
        {t("pricing_subtitle")}
      </p>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 w-full max-w-7xl ${rtl ? 'rtl' : ''}`}>
        {plans.map((plan) => (
          <PlanCard key={plan.planName} {...plan} />
        ))}
      </div>
    </div>
  );
}
