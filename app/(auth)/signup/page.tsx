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
