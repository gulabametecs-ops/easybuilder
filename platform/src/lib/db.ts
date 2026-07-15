import { PrismaClient } from "../generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaPg } from "@prisma/adapter-pg";

// Prisma 7 requires a driver adapter. We pick the adapter from DATABASE_URL:
//   - postgres://…  -> PrismaPg      (production: Neon / Supabase / any Postgres)
//   - file:./…      -> better-sqlite3 (local development)
//
// To go to production: set DATABASE_URL to a Postgres URL, change
// `provider = "postgresql"` in prisma/schema.prisma, run `prisma migrate deploy`,
// and regenerate the client. The code below already handles both. See DEPLOYMENT.md.
const databaseUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const isPostgres = /^postgres(ql)?:\/\//i.test(databaseUrl);

function makeClient() {
  const adapter = isPostgres
    ? new PrismaPg({ connectionString: databaseUrl })
    : new PrismaBetterSqlite3({ url: databaseUrl });
  return new PrismaClient({ adapter });
}

// Reuse a single client across hot-reloads in dev to avoid exhausting connections.
const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof makeClient> };

export const db = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;
