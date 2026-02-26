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
      if (Updates.isAvailable) {
        Updates.reloadAsync();
      } else {
        // Fallback for web or environments where Updates.isAvailable is false
        // This might not be ideal for all platforms, but covers web for now.
        // For native, a full app restart is usually required for I18nManager changes.
        console.warn("Expo Updates not available, manual app restart may be needed for RTL changes.");
      }
    }
  }, [isRTL]);

  return <>{children}</>;
}
