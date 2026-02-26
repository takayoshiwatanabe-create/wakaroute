import React, { ReactNode } from "react";
import { I18nManager } from "react-native";
import { isRTL } from "@/i18n";

interface I18nProviderProps {
  children: ReactNode;
}

// Set RTL layout globally based on detected language
if (isRTL) {
  I18nManager.forceRTL(true);
  I18nManager.allowRTL(true);
} else {
  I18nManager.forceRTL(false);
  I18nManager.allowRTL(false);
}

export function I18nProvider({ children }: I18nProviderProps) {
  // The actual i18n logic is handled by the `t` function and `isRTL` flag.
  // This component primarily serves as a wrapper to ensure the global I18nManager
  // settings are applied early in the component tree.
  return <>{children}</>;
}
