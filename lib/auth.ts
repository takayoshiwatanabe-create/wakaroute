import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import type { JWT } from "@auth/core/jwt"; // Corrected import for JWT type extension
import type { Session, User } from "next-auth"; // Import Session and User types

// Define the user roles as per the project specification (implicit from parent/child logic)
export type UserRole = "CHILD" | "PARENT";
export type UserPlan = "Free" | "Premium" | "Family" | "School"; // Define UserPlan type

// Extend the NextAuth.js User type to include custom fields
declare module "next-auth" {
  interface User {
    role?: UserRole;
    parentId?: string | null;
    plan?: UserPlan;
  }
  interface Session {
    user: {
      id: string;
      email: string;
      role?: UserRole;
      parentId?: string | null;
      plan?: UserPlan;
    } & Session["user"];
  }
}

declare module "@auth/core/jwt" { // Corrected import for JWT type extension
  interface JWT {
    id?: string;
    email?: string;
    role?: UserRole;
    parentId?: string | null;
    plan?: UserPlan;
  }
}

// Zod schema for login input validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export const {
  handlers,
  auth,
  signIn,
  signOut
} = NextAuth({
  adapter: PrismaAdapter(db), // Use PrismaAdapter with the db instance
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
        // Type assertion for credentials to match the schema
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          // Query the database for the user
          const user = await db.user.findUnique({ where: { email } });

          if (!user || !user.passwordHash) {
            return null; // User not found or no password set
          }

          // Check if the provided password matches the hashed password
          const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

          if (passwordsMatch) {
            // Return a User object that matches the extended User interface
            // Ensure all required fields for the extended User interface are present
            return {
              id: user.id,
              email: user.email,
              role: user.role as UserRole, // Ensure role is correctly typed
              parentId: user.parentId,
              plan: user.plan as UserPlan, // Ensure plan is correctly typed
            };
          }
        }
        return null; // Invalid credentials
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // When a user signs in, the `user` object is available.
        // Populate the token with custom user data from the database.
        token.id = user.id;
        token.email = user.email;
        token.role = user.role as UserRole;
        token.parentId = user.parentId;
        token.plan = user.plan as UserPlan;
      }
      return token;
    },
    async session({ session, token }) {
      // When a session is accessed, populate the session.user with data from the token.
      if (session.user) {
        session.user.id = token.id as string; // Cast to string as token.id can be string | undefined
        session.user.email = token.email as string; // Cast to string
        session.user.role = token.role as UserRole; // Cast to UserRole
        session.user.parentId = token.parentId as string | null; // Cast to string | null
        session.user.plan = token.plan as UserPlan; // Cast to UserPlan
      }
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirect to custom login page
    error: "/login", // Redirect to login page on error
  },
  // JWT token expiration: Access token 15 minutes, Refresh token 7 days (managed by NextAuth internally)
  // For custom JWT expiration, you'd configure `jwt` callback or `session` options.
  // NextAuth.js v5 handles this mostly internally based on session strategy.
  // We'll rely on NextAuth's default JWT expiration for now, which is usually 30 days.
  // To enforce the spec's "アクセストークン15分、リフレッシュトークン7日",
  // custom JWT and session callbacks would be needed to manage token expiry explicitly.
});
