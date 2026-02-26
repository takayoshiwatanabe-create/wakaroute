import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, Switch } from "react-native";
import { t } from "@/i18n";
import { Link } from "expo-router";

export function SignupForm() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isParent, setIsParent] = useState<boolean>(false);
  const [childEmail, setChildEmail] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert(t("signup_error_title"), t("signup_password_mismatch"));
      return;
    }

    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Basic validation for demonstration
    if (email && password && (!isParent || (isParent && childEmail))) {
      Alert.alert(t("signup_success_title"), t("signup_success_message"));
      // In a real app, navigate to home or dashboard here
    } else {
      Alert.alert(t("signup_error_title"), t("signup_error_message"));
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
        className="w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
        placeholder={t("password_placeholder")}
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />
      <TextInput
        className="w-full p-3 mb-6 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
        placeholder={t("confirm_password_placeholder")}
        placeholderTextColor="#9ca3af"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        editable={!loading}
      />

      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-gray-900 dark:text-white text-base">
          {t("signup_is_parent")}
        </Text>
        <Switch
          value={isParent}
          onValueChange={setIsParent}
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isParent ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          disabled={loading}
        />
      </View>

      {isParent && (
        <TextInput
          className="w-full p-3 mb-6 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700"
          placeholder={t("signup_child_email_placeholder")}
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          value={childEmail}
          onChangeText={setChildEmail}
          editable={!loading}
        />
      )}

      <TouchableOpacity
        className={`w-full p-3 rounded-md ${
          loading ? "bg-blue-300 dark:bg-blue-600" : "bg-blue-500 dark:bg-blue-700"
        }`}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text className="text-white text-center font-bold text-lg">
          {loading ? t("loading_button") : t("signup_button")}
        </Text>
      </TouchableOpacity>

      <Link href="/(auth)/login/page" asChild>
        <TouchableOpacity className="mt-4">
          <Text className="text-gray-600 dark:text-gray-400 text-center">
            {t("already_have_account")} <Text className="text-blue-500 dark:text-blue-400">{t("login_link")}</Text>
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
