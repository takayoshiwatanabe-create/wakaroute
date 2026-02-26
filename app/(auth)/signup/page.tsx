import { Text, View } from "react-native";
import { Stack } from "expo-router";
import { t } from "@/i18n";

export default function SignupPage() {
  return (
    <View className="flex-1 items-center justify-center p-6 bg-white dark:bg-gray-900">
      <Stack.Screen options={{ title: t("signup_title") }} />
      <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        {t("signup_welcome")}
      </Text>
      {/* Signup form will go here */}
      <Text className="text-lg text-gray-600 dark:text-gray-400">
        {t("signup_form_placeholder")}
      </Text>
    </View>
  );
}
