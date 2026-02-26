import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { t } from "@/i18n";
import { Link } from "expo-router";

export function LoginForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleLogin = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    if (email === "test@example.com" && password === "password") {
      Alert.alert(t("login_success_title"), t("login_success_message"));
      // In a real app, navigate to home or dashboard here
    } else {
      Alert.alert(t("login_error_title"), t("login_error_message"));
    }
    setLoading(false);
  };

  return (
    <View className="w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <TextInput
        className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
        placeholder={t("email_placeholder")}
        placeholderTextColor="#9ca3af"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        editable={!loading}
      />
      <TextInput
        className="w-full p-3 mb-6 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
        placeholder={t("password_placeholder")}
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />
      <TouchableOpacity
        className={`w-full p-3 rounded-md ${
          loading ? "bg-blue-300 dark:bg-blue-600" : "bg-blue-500 dark:bg-blue-700"
        }`}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text className="text-white text-center font-bold text-lg">
          {loading ? t("loading_button") : t("login_button")}
        </Text>
      </TouchableOpacity>
      <Link href="/(auth)/forgot-password" asChild>
        <TouchableOpacity className="mt-4">
          <Text className="text-blue-500 dark:text-blue-400 text-center">
            {t("forgot_password")}
          </Text>
        </TouchableOpacity>
      </Link>
      <Link href="/(auth)/signup/page" asChild>
        <TouchableOpacity className="mt-2">
          <Text className="text-gray-600 dark:text-gray-400 text-center">
            {t("no_account_yet")} <Text className="text-blue-500 dark:text-blue-400">{t("signup_link")}</Text>
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
