import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { I18nProvider } from "@/components/i18n-provider";
import { t, isRTL } from "@/i18n";
import { View } from "react-native";

import "../global.css"; // Import Tailwind CSS

export default function RootLayout() {
  return (
    <I18nProvider>
      <SafeAreaProvider>
        <View style={{ flex: 1, flexDirection: isRTL ? "row-reverse" : "row" }}>
          <Stack>
            <Stack.Screen name="index" options={{ title: t("app_name") }} />
            <Stack.Screen name="(auth)/login/page" options={{ headerShown: false }} />
            <Stack.Screen name="(auth)/signup/page" options={{ headerShown: false }} />
            {/* Add other screens here */}
          </Stack>
        </View>
        <StatusBar style="auto" />
      </SafeAreaProvider>
    </I18nProvider>
  );
}
