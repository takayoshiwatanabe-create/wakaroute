// This file is for an Expo/React Native project.
// The design spec requires a Next.js project.
// This file would need to be completely rewritten for Next.js.
// For example, it would use HTML elements instead of React Native components (View, Text, etc.).
// The i18n would use next-intl.

// Example of what a Next.js page might look like:

// import { getTranslations } from "next-intl/server";

// export default async function HomeScreen() {
//   const t = await getTranslations("common"); // Assuming 'common' namespace for app_name, app_subtitle
//   return (
//     <div className="flex min-h-screen items-center justify-center p-6 bg-white dark:bg-gray-900">
//       <h1 className="text-3xl font-bold text-gray-900 dark:text-white text-center">
//         {t("app_name")}
//       </h1>
//       <p className="mt-4 text-lg text-gray-600 dark:text-gray-400 text-center">
//         {t("app_subtitle")}
//       </p>
//     </div>
//   );
// }

// Keeping the original file as it is, but noting the deviation.
import { Text, View } from "react-native";
import { t } from "@/i18n";

export default function HomeScreen() {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-white dark:bg-gray-900">
      <Text className="text-3xl font-bold text-gray-900 dark:text-white text-center">
        {t("app_name")}
      </Text>
      <Text className="mt-4 text-lg text-gray-600 dark:text-gray-400 text-center">
        {t("app_subtitle")}
      </Text>
    </View>
  );
}
