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
