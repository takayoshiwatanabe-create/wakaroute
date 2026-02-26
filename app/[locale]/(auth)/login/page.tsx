// This is a client component, but it's nested under the locale segment

import { LoginForm } from "@/components/auth/login-form";
import { useTranslations } from "next-intl";

export default function LoginPage() {
  const t = useTranslations("login");
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t("login_welcome")}
      </h1>
      <LoginForm />
    </div>
  );
}
