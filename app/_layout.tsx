// This file is for an Expo/React Native project using Expo Router.
// The design spec requires a Next.js project using App Router.
// This file would need to be completely rewritten for Next.js.
// For example, it would be a `layout.tsx` file in the Next.js App Router,
// using HTML elements and `next-intl` for i18n setup.
// The `I18nProvider` and `I18nManager.forceRTL` are specific to React Native.

// Example of what a Next.js root layout might look like:

// import { Inter } from 'next/font/google';
// import { NextIntlClientProvider } from 'next-intl';
// import { getMessages, getLocale } from 'next-intl/server';
// import { dir } from 'i18next';
// import '../global.css'; // Tailwind CSS

// const inter = Inter({ subsets: ['latin'] });

// export default async function RootLayout({ children }: { children: React.ReactNode }) {
//   const locale = await getLocale();
//   const messages = await getMessages();
//   const isRTL = locale === 'ar'; // Or use a more robust check from next-intl

//   return (
//     <html lang={locale} dir={isRTL ? 'rtl' : 'ltr'}>
//       <body className={inter.className}>
//         <NextIntlClientProvider messages={messages}>
//           {children}
//         </NextIntlClientProvider>
//       </body>
//     </html>
//   );
// }

// Keeping the original file as it is, but noting the deviation.
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
