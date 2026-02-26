import { PrismaClient } from "@prisma/client";

// This approach prevents multiple instances of PrismaClient in development
// which can lead to issues like too many database connections.
const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
