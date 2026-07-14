import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

// Production/prod-like: PostgreSQL via the pg driver adapter (Prisma 7 requires
// a driver adapter). DATABASE_URL is provided in every environment (Neon, etc.).
// A harmless placeholder keeps the client constructable during build/prerender
// even before the env var is available — real queries need the real URL. The
// connection is lazy, so no DB call happens just by creating the client.
const connectionString = process.env.DATABASE_URL || "postgresql://placeholder:placeholder@localhost:5432/placeholder";

function makeClient() {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter });
}

// Reuse a single client across hot-reloads in dev to avoid exhausting connections.
const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof makeClient> };

export const db = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
