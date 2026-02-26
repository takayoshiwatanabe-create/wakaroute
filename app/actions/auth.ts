"use server";

import { z } from "zod";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db"; // Assuming db is correctly configured
import { UserRole } from "@/lib/auth"; // Assuming UserRole is defined in lib/auth

const signupSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  confirmPassword: z.string(), // This is refined in the client-side form, but good to have here for server-side validation if needed
  isParent: z.boolean().default(false),
  childEmail: z.string().email({ message: "Invalid email address." }).optional().or(z.literal('')), // Allow empty string for optional
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match.",
  path: ["confirmPassword"],
}).refine((data) => !data.isParent || (data.isParent && data.childEmail && z.string().email().safeParse(data.childEmail).success), {
  message: "Parent email is required for child registration and must be a valid email.",
  path: ["childEmail"],
});

export async function signupAction(values: z.infer<typeof signupSchema>) {
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
  const hashedPassword = await bcrypt.hash(password, 12); // Cost factor 12 as per spec

  let parentId: string | null = null;
  let role: UserRole = isParent ? "PARENT" : "CHILD";

  if (!isParent) { // If the user signing up is a child
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
        parentId, // Will be null for parents, or the parent's ID for children
        // Initialize monthlyAiDecompositions for new users
        monthlyAiDecompositions: 0,
        // Set default plan
        plan: 'Free',
      },
    });
    return { success: "User registered successfully!" };
  } catch (e) {
    console.error("Signup error:", e);
    return { error: "Failed to register user." };
  }
}

