/**
 * Prisma Client Configuration
 * Singleton pattern for database connection management
 */

import { PrismaClient } from "../../../prisma/generated/client";

// Global variable to prevent multiple instances in development
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Prisma client configuration
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    errorFormat: "pretty",
  });

// Prevent multiple instances in development
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// Database health check
export async function checkDatabaseHealth(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error("Database health check failed:", error);
    return false;
  }
}

/**
 * Retrieves database connection information such as version, database name, user, host, and port.
 *
 * @returns A promise that resolves to an object containing database metadata or `null` if the query fails.
 */
export async function getDatabaseInfo(): Promise<{
  version: string;
  database: string;
  user: string;
  host: string;
  port: number;
} | null> {
  try {
    const result = (await prisma.$queryRaw`
      SELECT
        version() as version,
        current_database() as database,
        current_user as user,
        inet_server_addr() as host,
        inet_server_port() as port
    `) as Array<{
      version: string;
      database: string;
      user: string;
      host: string;
      port: number;
    }>;

    return result[0];
  } catch (error) {
    console.error("Failed to get database info:", error);
    return null;
  }
}

// Graceful shutdown
export async function disconnectDatabase() {
  await prisma.$disconnect();
}

// Export types for convenience
export type {
  Account,
  AuditLog,
  Session,
  User,
  UserRole,
  UserStatus,
  UserUtility,
  Utility,
} from "../../../prisma/generated/client";
