import { PrismaClient } from "../generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

// Prisma 7 requires a driver adapter. The database is MySQL 8; the MariaDB
// driver speaks the MySQL protocol, so it is the adapter Prisma recommends for MySQL.
//   DATABASE_URL=mysql://USER:PASSWORD@HOST:3306/DBNAME
// Schema changes: edit prisma/schema.prisma, then `npm run db:migrate` (see DEPLOYMENT.md).
function makeClient() {
  const raw = process.env.DATABASE_URL;
  if (!raw || !/^mysql:\/\//i.test(raw)) {
    throw new Error("DATABASE_URL must be a MySQL URL, e.g. mysql://user:pass@127.0.0.1:3306/standardsaas");
  }
  const u = new URL(raw);
  const adapter = new PrismaMariaDb({
    host: u.hostname,
    port: Number(u.port || 3306),
    user: decodeURIComponent(u.username),
    password: decodeURIComponent(u.password),
    database: u.pathname.slice(1),
    connectionLimit: Number(u.searchParams.get("connection_limit") ?? 10),
    // Don't hold the whole pool open: the driver's default keeps connectionLimit idle
    // connections forever, so every dev reload's pool piled up until MySQL hit
    // "Too many connections" (max 151) and pages hung ~50s waiting for one.
    minimumIdle: 1,
    idleTimeout: 30, // seconds before an idle connection is closed
    acquireTimeout: 15_000,
    // MySQL 8's default auth (caching_sha2_password) needs this without TLS.
    allowPublicKeyRetrieval: true,
  });
  return new PrismaClient({ adapter });
}

// Reuse a single client across hot-reloads in dev to avoid exhausting connections.
// After `prisma generate` the client class changes; drop the cached instance so the
// running dev server picks up new models/fields without a restart.
const globalForPrisma = globalThis as unknown as { prisma?: ReturnType<typeof makeClient>; prismaCtor?: unknown };
if (globalForPrisma.prisma && globalForPrisma.prismaCtor !== PrismaClient) {
  // Close the old pool later: requests already running on it must finish first
  // (closing it immediately caused "pool is closed" errors mid-request).
  const old = globalForPrisma.prisma;
  // dev only: give requests still running on the old pool (slow first compiles) time to finish
  setTimeout(() => void old.$disconnect().catch(() => {}), 120_000);
  globalForPrisma.prisma = undefined;
}

export const db = globalForPrisma.prisma ?? makeClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
  globalForPrisma.prismaCtor = PrismaClient;
}
