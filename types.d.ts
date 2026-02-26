import type { PrismaClient } from "@prisma/client";
import type { JWT } from "@auth/core/jwt";
import type { Session, User } from "next-auth";

// Extend the global object with a prisma property
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

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

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    email?: string;
    role?: UserRole;
    parentId?: string | null;
    plan?: UserPlan;
  }
}

