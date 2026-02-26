// This file is used to augment existing types or declare global types.

// Extend the NodeJS.ProcessEnv interface to include custom environment variables
declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_GEMINI_API_KEY: string;
    UPSTASH_REDIS_REST_URL: string;
    UPSTASH_REDIS_REST_TOKEN: string;
    // Add other environment variables here as needed
  }
}

// Extend the NextAuth session and user types to include custom fields
// This is already done in lib/auth.ts, but it's good practice to have global declarations here
// if they are used widely across the application and not just within auth-related files.
// For now, we'll keep the primary declaration in lib/auth.ts as it's directly related to NextAuth.
// If you encounter global type issues with NextAuth, consider moving or duplicating the declare module "next-auth" block here.

// Prisma Client type augmentation (if needed, though Prisma usually handles this)
// This ensures that `db` in `lib/db.ts` has the correct type globally.
import { PrismaClient } from '@prisma/client';

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export {}; // This ensures the file is treated as a module
