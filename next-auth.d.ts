import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { UserRole, UserPlan } from "@/lib/auth"; // Import your custom types

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      email: string;
      role: UserRole;
      parentId: string | null;
      plan: UserPlan;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    role: UserRole;
    parentId: string | null;
    plan: UserPlan;
  }
}

declare module "next-auth/jwt" {
  /**
   * Returned by the `jwt` callback and `getToken`, when using JWT sessions
   */
  interface JWT {
    id: string;
    email: string;
    role: UserRole;
    parentId: string | null;
    plan: UserPlan;
  }
}

