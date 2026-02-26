"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { signupAction } from "@/app/actions/auth"; // A Next.js Server Action
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

const Checkbox = ({ id, checked, onCheckedChange, disabled }: { id: string; checked: boolean; onCheckedChange: (checked: boolean) => void; disabled?: boolean }) => (
  <input
    type="checkbox"
    id={id}
    checked={checked}
    onChange={(e) => onCheckedChange(e.target.checked)}
    className="h-4 w-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
    disabled={disabled}
  />
);

const Label = ({ htmlFor, className, children }: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label htmlFor={htmlFor} className={`text-gray-900 dark:text-white text-base ${className}`}>
    {children}
  </label>
);


const formSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
  isParent: z.boolean().default(false),
  childEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')), // Allow empty string for optional
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
}).refine((data) => !data.isParent || (data.isParent && data.childEmail && z.string().email().safeParse(data.childEmail).success), {
  message: "Parent email is required for child registration and must be a valid email.",
  path: ["childEmail"],
});

export function SignupForm() {
  const t = useTranslations("signup");
  const router = useRouter();
  const locale = useLocale(); // Get the current locale
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      isParent: false,
      childEmail: "",
    },
  });

  const isParent = form.watch("isParent");

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    setError(null);
    try {
      // Filter out empty childEmail if not a parent
      const submissionValues = {
        ...values,
        childEmail: values.isParent ? values.childEmail : undefined,
      };

      const result = await signupAction(submissionValues); // Call the Server Action
      // Note: signupAction should hash the password with bcrypt (cost factor 12 or more)
      if (result?.error) {
        setError(result.error);
      } else {
        router.push(`/${locale}/login`); // Redirect to login on success
      }
    } catch (e) {
      setError(t("signup_error_message"));
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
        disabled={loading}
      />
      {form.formState.errors.password && <p className="text-red-500 text-sm mb-2">{form.formState.errors.password.message}</p>}
      <Input
        {...form.register("confirmPassword")}
        type="password"
        placeholder={t("confirm_password_placeholder")}
        className="mb-6" // Adjusted margin for consistency
        disabled={loading}
      />
      {form.formState.errors.confirmPassword && <p className="text-red-500 text-sm mb-2">{form.formState.errors.confirmPassword.message}</p>}

      <div className="flex items-center space-x-2 mb-6">
        <Checkbox
          id="isParent"
          checked={isParent}
          onCheckedChange={(checked) => form.setValue("isParent", checked)}
          disabled={loading}
        />
        <Label htmlFor="isParent">
          {t("signup_is_parent")}
        </Label>
      </div>

      {isParent && (
        <>
          <Input
            {...form.register("childEmail")}
            type="email"
            placeholder={t("signup_child_email_placeholder")}
            className="mb-6" // Adjusted margin for consistency
            disabled={loading}
          />
          {form.formState.errors.childEmail && <p className="text-red-500 text-sm mb-2">{form.formState.errors.childEmail.message}</p>}
        </>
      )}

      <Button type="submit" disabled={loading}>
        {loading ? t("loading_button") : t("signup_button")}
      </Button>

      <Link href={`/${locale}/login`} className="mt-4 block text-gray-600 dark:text-gray-400 text-center">
        {t("already_have_account")} <span className="text-blue-500 dark:text-blue-400">{t("login_link")}</span>
      </Link>
    </form>
  );
}
