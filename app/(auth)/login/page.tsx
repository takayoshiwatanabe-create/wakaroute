// This file is for an Expo/React Native project.
// The design spec requires a Next.js project.
// This file would need to be completely rewritten for Next.js.
// For example, it would use HTML elements instead of React Native components (View, Text, etc.).
// The LoginForm would interact with Next.js Server Actions for authentication.
// The i18n would use next-intl.

// Example of what a Next.js page might look like:

// import { LoginForm } from "@/components/auth/login-form";
// import { getTranslations } from "next-intl/server";

// export async function generateMetadata() {
//   const t = await getTranslations("login");
//   return {
//     title: t("title"),
//   };
// }

// export default async function LoginPage() {
//   const t = await getTranslations("login");
//   return (
//     <div className="flex min-h-screen items-center justify-center p-6 bg-white dark:bg-gray-900">
//       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
//         {t("welcome")}
//       </h1>
//       <LoginForm />
//     </div>
//   );
// }

// Keeping the original file as it is, but noting the deviation.
import { Text, View } from "react-native";
import { Stack } from "expo-router";
import { LoginForm } from "@/components/auth/login-form";
import { t } from "@/i18n";

export default function LoginPage() {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-white dark:bg-gray-900">
      <Stack.Screen options={{ title: t("login_title") }} />
      <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t("login_welcome")}
      </Text>
      <LoginForm />
    </View>
  );
}
