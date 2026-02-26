import { PrismaClient } from "@prisma/client";

// This approach prevents multiple instances of PrismaClient in development
// which can lead to issues like too many database connections.
// Declare global.prisma to be of type PrismaClient or undefined
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const db = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = db;
