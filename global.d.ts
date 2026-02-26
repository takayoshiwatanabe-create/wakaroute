// Use this file to add type definitions for global variables or modules
// that are not automatically inferred by TypeScript.

// Extend the `global` object to include `prisma` for development environment.
declare global {
  var prisma: PrismaClient | undefined;
}

// Ensure this is a module to avoid global scope pollution if not intended.
// If you want to declare global types, remove the `export {}` line.
export {};

