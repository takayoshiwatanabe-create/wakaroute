// This is a client component, but it's nested under the locale segment

import { useTranslations } from "next-intl";
import Link from "next/link"; // Import Link from next/link

export default function HomeScreen() {
  const t = useTranslations("common"); // Assuming 'common' namespace for app_name, app_subtitle
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-white dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
        {t("app_name")}
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 text-center">
        {t("app_subtitle")}
      </p>
      <div className="mt-8 flex space-x-4">
        <Link href="/login" className="px-6 py-3 bg-blue-500 text-white rounded-md text-lg font-semibold hover:bg-blue-600 transition-colors">
          {t("login_button")}
        </Link>
        <Link href="/signup" className="px-6 py-3 border border-blue-500 text-blue-500 rounded-md text-lg font-semibold hover:bg-blue-50 transition-colors dark:hover:bg-gray-800">
          {t("signup_link")}
        </Link>
      </div>
    </div>
  );
}
