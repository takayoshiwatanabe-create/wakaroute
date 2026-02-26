// This is a client component, but it's nested under the locale segment

import { SignupForm } from "@/components/auth/signup-form";
import { useTranslations } from "next-intl";

export default function SignupPage() {
  const t = useTranslations("signup");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t("signup_welcome")}
      </h1>
      <SignupForm />
    </div>
  );
}
