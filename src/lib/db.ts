import { PrismaClient } from "../../prisma/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
  pgPool?: Pool;
};

function shouldUseSsl() {
  if (process.env.NODE_ENV !== "production") return false;
  const url = process.env.DATABASE_URL ?? "";
  if (!url) return false;
  if (url.includes("localhost") || url.includes("127.0.0.1")) return false;
  // Most managed Postgres providers require TLS in production.
  return true;
}

const pgPool =
  globalForPrisma.pgPool ??
  new Pool({
    connectionString: process.env.DATABASE_URL,
    connectionTimeoutMillis: 1500,
    ssl: shouldUseSsl() ? { rejectUnauthorized: true } : undefined,
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.pgPool = pgPool;

const adapter = new PrismaPg(pgPool);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
