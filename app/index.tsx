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
