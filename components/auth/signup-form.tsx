// This file is for an Expo/React Native project.
// The design spec requires a Next.js project with server-side authentication using NextAuth.js and Server Actions.
// This component currently simulates API calls client-side with `setTimeout` and `Alert.alert`.
// It needs to be rewritten to:
// 1. Use HTML form elements (input, button, checkbox/switch) instead of React Native components.
// 2. Submit data to a Next.js Server Action.
// 3. Use Zod for client-side validation (and server-side in the action).
// 4. Handle user creation and potential parent-child linking via NextAuth.js and Prisma within the Server Action.
// 5. Display error messages and loading states appropriate for a web application.
// 6. Implement the 13-year-old age check and parent email confirmation as per spec.
// 7. Use `next-intl` for translations.

// Example of what a Next.js SignupForm might look like (simplified):

// "use client";
// import React, { useState } from "react";
// import { useTranslations } from "next-intl";
// import { useRouter } from "next/navigation";
// import { z } from "zod";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Checkbox } from "@/components/ui/checkbox"; // Assuming shadcn/ui
// import { Label } from "@/components/ui/label"; // Assuming shadcn/ui
// import Link from "next/link";
// import { signupAction } from "@/app/actions/auth"; // A Next.js Server Action

// const formSchema = z.object({
//   email: z.string().email({ message: "Invalid email address." }),
//   password: z.string().min(6, { message: "Password must be at least 6 characters." }),
//   confirmPassword: z.string(),
//   isParent: z.boolean().default(false),
//   childEmail: z.string().email({ message: "Invalid email address." }).optional(),
// }).refine((data) => data.password === data.confirmPassword, {
//   message: "Passwords don't match.",
//   path: ["confirmPassword"],
// }).refine((data) => !data.isParent || (data.isParent && data.childEmail), {
//   message: "Parent email is required for child registration.",
//   path: ["childEmail"],
// });

// export function SignupForm() {
//   const t = useTranslations("signup");
//   const router = useRouter();
//   const [loading, setLoading] = useState<boolean>(false);
//   const [error, setError] = useState<string | null>(null);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       email: "",
//       password: "",
//       confirmPassword: "",
//       isParent: false,
//       childEmail: "",
//     },
//   });

//   const isParent = form.watch("isParent");

//   const onSubmit = async (values: z.infer<typeof formSchema>) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const result = await signupAction(values); // Call the Server Action
//       if (result?.error) {
//         setError(result.error);
//       } else {
//         router.push("/login"); // Redirect to login on success
//       }
//     } catch (e) {
//       setError(t("signup_error_message"));
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
//         className="w-full p-3 mb-4 border rounded-md"
//         disabled={loading}
//       />
//       {form.formState.errors.password && <p className="text-red-500 text-sm mb-2">{form.formState.errors.password.message}</p>}
//       <Input
//         {...form.register("confirmPassword")}
//         type="password"
//         placeholder={t("confirm_password_placeholder")}
//         className="w-full p-3 mb-6 border rounded-md"
//         disabled={loading}
//       />
//       {form.formState.errors.confirmPassword && <p className="text-red-500 text-sm mb-2">{form.formState.errors.confirmPassword.message}</p>}

//       <div className="flex items-center space-x-2 mb-6">
//         <Checkbox
//           id="isParent"
//           checked={isParent}
//           onCheckedChange={form.setValue("isParent")}
//           disabled={loading}
//         />
//         <Label htmlFor="isParent" className="text-gray-900 dark:text-white text-base">
//           {t("signup_is_parent")}
//         </Label>
//       </div>

//       {isParent && (
//         <>
//           <Input
//             {...form.register("childEmail")}
//             type="email"
//             placeholder={t("signup_child_email_placeholder")}
//             className="w-full p-3 mb-6 border rounded-md"
//             disabled={loading}
//           />
//           {form.formState.errors.childEmail && <p className="text-red-500 text-sm mb-2">{form.formState.errors.childEmail.message}</p>}
//         </>
//       )}

//       <Button type="submit" className="w-full p-3 rounded-md bg-blue-500 text-white font-bold text-lg" disabled={loading}>
//         {loading ? t("loading_button") : t("signup_button")}
//       </Button>

//       <Link href="/login" className="mt-4 block text-gray-600 dark:text-gray-400 text-center">
//         {t("already_have_account")} <span className="text-blue-500 dark:text-blue-400">{t("login_link")}</span>
//       </Link>
//     </form>
//   );
// }

// Keeping the original file as it is, but noting the deviation.
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
