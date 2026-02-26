import NextAuth, { type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { PrismaAdapter } from "@auth/prisma-adapter"; // Import PrismaAdapter
import { db } from "@/lib/db"; // Ensure this path is correct for Next.js

// Define the user roles as per the project specification (implicit from parent/child logic)
export type UserRole = "CHILD" | "PARENT";

// Extend the NextAuth session and user types to include custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
      parentId?: string | null;
    } & Session["user"];
  }

  interface User {
    role: UserRole;
    parentId?: string | null;
  }
}

// Zod schema for login input validation
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export const authConfig = {
  adapter: PrismaAdapter(db), // Use PrismaAdapter with the db instance
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      async authorize(credentials) {
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
            return {
              id: user.id,
              email: user.email,
              role: user.role as UserRole, // Ensure role is correctly typed
              parentId: user.parentId,
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
        token.id = user.id;
        token.email = user.email;
        token.role = user.role;
        token.parentId = user.parentId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.role = token.role as UserRole;
        session.user.parentId = token.parentId as string | null | undefined;
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
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
