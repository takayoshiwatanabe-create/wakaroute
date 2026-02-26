import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

// Define the schema for login credentials using Zod
const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const validatedFields = loginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const user = await db.user.findUnique({
            where: { email },
          });

          if (!user || !user.passwordHash) {
            return null; // User not found or no password set (e.g., OAuth user)
          }

          const passwordsMatch = await bcrypt.compare(password, user.passwordHash);

          if (passwordsMatch) {
            return {
              id: user.id,
              email: user.email,
              name: user.name, // Include name if available
              // Do NOT return passwordHash here
            };
          }
        }
        return null; // Invalid credentials
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 15 * 60, // Access token 15 minutes
  },
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // Refresh token 7 days
  },
  pages: {
    signIn: "/(auth)/login/page",
    // Add other custom pages as needed
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        // Add custom fields from your User model to the token
        // e.g., token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        // Add custom fields to session.user
        // e.g., (session.user as any).role = token.role;
      }
      return session;
    },
  },
  // Other NextAuth.js configurations
  // secret: process.env.AUTH_SECRET, // Should be set in .env.local
  // debug: process.env.NODE_ENV === "development",
});

// Extend the NextAuth types to include custom fields in session and JWT
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string | null;
      // Add other custom fields here
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    // Add other custom fields here
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    email: string;
    name?: string | null;
    // Add other custom fields here
  }
}
