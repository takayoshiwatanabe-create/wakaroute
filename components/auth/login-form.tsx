"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react"; // Import signIn from next-auth/react
import Link from "next/link";
import { useLocale } from "next-intl"; // Import useLocale

// Assuming shadcn/ui components will be used, but for now, using basic HTML elements with Tailwind classes.
// Replace with actual shadcn/ui components when available.
const Input = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    className={`w-full p-3 mb-4 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-700 ${className}`}
    {...props}
  />
);

const Button = ({ className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    className={`w-full p-3 rounded-md bg-blue-500 text-white font-bold text-lg ${className}`}
    {...props}
  />
);

const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export function LoginForm() {
  const t = useTranslations("login");
  const router = useRouter();
  const locale = useLocale(); // Get the current locale
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signIn("credentials", {
        redirect: false,
        email: values.email,
        password: values.password,
      });

      if (result?.error) {
        setError(t("login_error_message"));
      } else {
        router.push(`/${locale}/decompose`); // Redirect to decompose page on success
      }
    } catch (e) {
      setError(t("login_error_message"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <Input
        {...form.register("email")}
        type="email"
        placeholder={t("email_placeholder")}
        disabled={loading}
      />
      {form.formState.errors.email && <p className="text-red-500 text-sm mb-2">{form.formState.errors.email.message}</p>}
      <Input
        {...form.register("password")}
        type="password"
        placeholder={t("password_placeholder")}
        className="mb-6" // Adjusted margin for consistency
        disabled={loading}
      />
      {form.formState.errors.password && <p className="text-red-500 text-sm mb-2">{form.formState.errors.password.message}</p>}
      <Button type="submit" disabled={loading}>
        {loading ? t("loading_button") : t("login_button")}
      </Button>
      <Link href={`/${locale}/forgot-password`} className="mt-4 block text-blue-500 dark:text-blue-400 text-center">
        {t("forgot_password")}
      </Link>
      <Link href={`/${locale}/signup`} className="mt-2 block text-gray-600 dark:text-gray-400 text-center">
        {t("no_account_yet")} <span className="text-blue-500 dark:text-blue-400">{t("signup_link")}</span>
      </Link>
    </form>
  );
}


