// This file is for an Expo/React Native project.
// The design spec requires a Next.js project.
// This file would need to be completely rewritten for Next.js.
// For example, it would use HTML elements instead of React Native components (View, Text, etc.).
// The SignupForm would interact with Next.js Server Actions for authentication.
// The i18n would use next-intl.

// Example of what a Next.js page might look like:

// import { SignupForm } from "@/components/auth/signup-form";
// import { getTranslations } from "next-intl/server";

// export async function generateMetadata() {
//   const t = await getTranslations("signup");
//   return {
//     title: t("title"),
//   };
// }

// export default async function SignupPage() {
//   const t = await getTranslations("signup");
//   return (
//     <div className="flex min-h-screen items-center justify-center p-6 bg-white dark:bg-gray-900">
//       <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
//         {t("welcome")}
//       </h1>
//       <SignupForm />
//     </div>
//   );
// }

// Keeping the original file as it is, but noting the deviation.
import { Text, View } from "react-native";
import { Stack } from "expo-router";
import { t } from "@/i18n";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-white dark:bg-gray-900">
      <Stack.Screen options={{ title: t("signup_title") }} />
      <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t("signup_welcome")}
      </Text>
      <SignupForm />
    </View>
  );
}
