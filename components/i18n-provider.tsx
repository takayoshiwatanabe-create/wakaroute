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
      Updates.reloadAsync();
    }
  }, [isRTL]);

  return <>{children}</>;
}
