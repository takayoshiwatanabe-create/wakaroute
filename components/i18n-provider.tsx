// This file is specific to Expo/React Native for handling i18n and RTL.
// The design spec requires `next-intl` for a Next.js project.
// This component would not exist in a Next.js project; `next-intl` handles
// provider setup and RTL via the `dir` attribute on the `<html>` tag.
// The `I18nManager.forceRTL` and `Updates.reloadAsync` are React Native specific.

// Example of how next-intl is typically used in Next.js:
// The `NextIntlClientProvider` is used in the root layout, and `getMessages`
// fetches translations server-side.

// Keeping the original file as it is, but noting the deviation.
import React, { ReactNode, useEffect } from "react";
import { I18nManager } from "react-native";
import { isRTL } from "@/i18n";
import * as Updates from "expo-updates";

interface I18nProviderProps {
  children: ReactNode;
}

export function I18nProvider({ children }: I18nProviderProps) {
  useEffect(() => {
    const currentRTL = I18nManager.isRTL;
    if (isRTL !== currentRTL) {
      I18nManager.forceRTL(isRTL);
      I18nManager.allowRTL(true); // Always allow RTL to prevent issues if language changes later
      // Reload the app to apply RTL changes
      // In a production app, you might want to prompt the user before reloading
      // or handle this more gracefully. For development, a reload is fine.
      // Check if Updates.reloadAsync is available and not null/undefined
      if (Updates.reloadAsync) {
        Updates.reloadAsync();
      } else {
        // Fallback for web or environments where Updates.reloadAsync is not available
        console.warn("Expo Updates.reloadAsync not available, manual app restart may be needed for RTL changes.");
      }
    }
  }, [isRTL]);

  return <>{children}</>;
}
