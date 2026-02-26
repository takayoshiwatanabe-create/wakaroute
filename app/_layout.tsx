import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ title: "学習ステップ分解アプリ：『ワカル・ルート（Wakaroute）』" }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}
