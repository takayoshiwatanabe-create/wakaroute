// This file is for an Expo/React Native project.
// The design spec requires a Next.js project with server-side authentication using NextAuth.js and Server Actions.
// This component currently simulates API calls client-side with `setTimeout` and `Alert.alert`.
// It needs to be rewritten to:
// 1. Use HTML form elements (input, button) instead of React Native components.
// 2. Submit data to a Next.js Server Action.
// 3. Use Zod for client-side validation (and server-side in the action).
// 4. Handle authentication via NextAuth.js `signIn` function within the Server Action.
// 5. Display error messages and loading states appropriate for a web application.
// 6. Use `next-intl` for translations.

// Example of what a Next.js LoginForm might look like (simplified):

// "use client";
// import React, { useState } from "react";
// import { useTranslations } from "next-intl";
// import { signIn } from "next-auth/react";
// import { useRouter } from "next/navigation";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button"; // Assuming shadcn/ui
// import { Input } from "@/components/ui/input"; // Assuming shadcn/ui
// import Link from "next/link";

// const formSchema = z.object({
//   email: z.string().email({ message: "Invalid email address." }),
//   password: z.string().min(6, { message: "Password must be at least 6 characters." }),
// });

// export function LoginForm() {
//   const t = useTranslations("login");
//   const router = useRouter();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await signIn("credentials", {
//         redirect: false,
//         email: values.email,
//         password: values.password,
//       });

//       if (result?.error) {
//         setError(t("login_error_message"));
//       } else {
//         router.push("/"); // Redirect to home on success
//       }
//     } catch (e) {
//       setError(t("login_error_message"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
//       {error && <p className="text-red-500 text-center mb-4">{error}</p>}
//       <Input
//         {...form.register("email")}
//         type="email"
//         placeholder={t("email_placeholder")}
//         className="w-full p-3 mb-4 border rounded-md"
//         disabled={loading}
//       />
//       {form.formState.errors.email && <p className="text-red-500 text-sm mb-2">{form.formState.errors.email.message}</p>}
//       <Input
//         {...form.register("password")}
//         type="password"
//         placeholder={t("password_placeholder")}
//         className="w-full p-3 mb-6 border rounded-md"
//         disabled={loading}
//       />
//       {form.formState.errors.password && <p className="text-red-500 text-sm mb-2">{form.formState.errors.password.message}</p>}
//       <Button type="submit" className="w-full p-3 rounded-md bg-blue-500 text-white font-bold text-lg" disabled={loading}>
//         {loading ? t("loading_button") : t("login_button")}
//       </Button>
//       <Link href="/forgot-password" className="mt-4 block text-blue-500 dark:text-blue-400 text-center">
//         {t("forgot_password")}
//       </Link>
//       <Link href="/signup" className="mt-2 block text-gray-600 dark:text-gray-400 text-center">
//         {t("no_account_yet")} <span className="text-blue-500 dark:text-blue-400">{t("signup_link")}</span>
//       </Link>
//     </form>
//   );
// }

// Keeping the original file as it is, but noting the deviation.
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
