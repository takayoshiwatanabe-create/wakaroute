import NextAuth, { DefaultSession } from "next-auth";
import { UserRole, UserPlan } from "./lib/auth"; // Adjust path as necessary

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      id: string;
      role?: UserRole;
      parentId?: string | null;
      plan?: UserPlan;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole;
    parentId?: string | null;
    plan?: UserPlan;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    parentId?: string | null;
    plan?: UserPlan;
  }
}
