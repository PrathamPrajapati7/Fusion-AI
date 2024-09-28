import { PrismaClient } from "@prisma/client";

// Avoid multiple instances of Prisma Client in development
declare global {
  // Allow global `prisma` variable only in development
  var prisma: PrismaClient | undefined;
}

// Use existing global instance or create a new one
const prismadb = global.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],  // Optional: logs queries and errors in development
});

// Assign Prisma Client to global in development to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  global.prisma = prismadb;
}

export default prismadb;
