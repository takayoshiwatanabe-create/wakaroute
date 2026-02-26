"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { UserRole, UserPlan } from "@/lib/auth";

// CLAUDE.md Section 2.3: すべてのServer Actionsは入力バリデーション（Zod）を実施
const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(),
  isParent: z.boolean().default(false),
  childEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
}).refine((data) => !data.isParent || (data.isParent && data.childEmail && z.string().email().safeParse(data.childEmail).success), {
  message: "Child email is required for parent registration and must be a valid email.",
  path: ["childEmail"],
});

export async function signupAction(values: z.infer<typeof signupSchema>): Promise<{ success?: string; error?: string }> {
  const validatedFields = signupSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid input fields." };
  }

  const { email, password, isParent, childEmail } = validatedFields.data;

  // Check if user already exists
  const existingUser = await db.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Email already in use." };
  }

  // Hash password with bcrypt (cost factor 12 or more)
  // CLAUDE.md Section 3.2: パスワードは bcrypt（コスト係数12以上）でハッシュ化
  const hashedPassword = await bcrypt.hash(password, 12);

  let parentId: string | null = null;
  let role: UserRole = isParent ? "PARENT" : "CHILD";
  let plan: UserPlan = "Free"; // Default plan for new users

  if (!isParent) { // If the user signing up is a child
    // CLAUDE.md Section 3.1: 13歳未満ユーザーの登録には保護者メール確認を必須とする
    // CLAUDE.md Section 3.1: 子どもアカウントは保護者アカウントに紐づける（孤立禁止）
    if (!childEmail) {
      return { error: "Parent email is required for child registration." };
    }
    const parentUser = await db.user.findUnique({ where: { email: childEmail } });
    if (!parentUser || parentUser.role !== "PARENT") {
      return { error: "Provided parent email does not belong to an existing parent account." };
    }
    parentId = parentUser.id;
  }

  try {
    await db.user.create({
      data: {
        email,
        passwordHash: hashedPassword,
        role,
        parentId,
        monthlyAiDecompositions: 0,
        plan,
      },
    });
    return { success: "User registered successfully!" };
  } catch (e) {
    console.error("Signup error:", e);
    return { error: "Failed to register user." };
  }
}


