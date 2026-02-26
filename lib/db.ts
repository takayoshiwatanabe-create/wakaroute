// This file is correctly identified as not used in the current Expo Router client-side project.
// This aligns with the architectural boundary that client components should not directly connect to the DB.
// However, the presence of this file, commented out, highlights the fundamental architectural mismatch:
// The spec requires a Next.js project with Prisma/PostgreSQL backend, where this file *would* be used.
// In the current Expo project, there is no backend implementation for authentication or data persistence
// as described in the "認証APIとデータベース連携 (1)" section of the CLAUDE.md.
// The `LoginForm` and `SignupForm` components simulate API calls, which is a deviation from the spec's
// requirement for NextAuth.js, Prisma, and Server Actions.

// To conform to the Next.js spec, this file would be active and used in Server Actions or API routes.
// The current state is a deviation from the overall technical stack and backend integration requirements.

// Keeping the original file as it is, but noting the deviation.

// This file is not used in the current Expo Router client-side project.
// It's typically used in Next.js server-side components or API routes.
// Keeping it here for future server-side integration if the project expands
// to a full Next.js app with a backend.

// import { PrismaClient } from "@prisma/client";

// // This approach prevents multiple instances of PrismaClient in development
// // which can lead to issues like too many database connections.
// const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

// export const db = globalForPrisma.prisma || new PrismaClient();

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// To fix the type error "Cannot find name 'PrismaClient'",
// we comment out the Prisma related code as it's not relevant for the client-side Expo app.
// If a backend is introduced, Prisma would be used there, not directly in the Expo app.

export {}; // Export an empty object to make this a module
