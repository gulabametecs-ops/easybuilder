// Create + apply a MySQL migration from schema changes:  npm run db:new-migration -- <name>
//
// Why not `prisma migrate dev`: it diffs against the live DB, and MySQL reports our TEXT
// defaults as expressions (`DEFAULT ('x')`) and — on Windows — lowercases table names, so
// Prisma sees phantom changes on every table and may even offer to reset the database.
// Instead we diff the previous schema snapshot against the current schema (pure file→file),
// write that SQL as a new migration, fix TEXT defaults, then `migrate deploy`.
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const schema = path.join(root, "prisma", "schema.prisma");
const snapshot = path.join(root, "prisma", "migrations", "schema.snapshot.prisma");
const name = (process.argv[2] || "").toLowerCase().replace(/[^a-z0-9_]+/g, "_").replace(/^_|_$/g, "");
if (!name) {
  console.error("Usage: npm run db:new-migration -- <migration_name>");
  process.exit(1);
}
if (!fs.existsSync(snapshot)) {
  console.error(`Missing ${path.relative(root, snapshot)} (the schema the existing migrations produce).`);
  process.exit(1);
}

const prisma = (args, opts = {}) =>
  execFileSync("npx", ["prisma", ...args], { cwd: root, shell: process.platform === "win32", encoding: "utf8", ...opts });

// Relative paths: with shell:true (needed for npx on Windows) a space in the folder name splits the arg.
const rel = (p) => path.relative(root, p).split(path.sep).join("/");
const sql = prisma(["migrate", "diff", "--from-schema", rel(snapshot), "--to-schema", rel(schema), "--script"], {
  stdio: ["ignore", "pipe", "inherit"],
})
  .split("\n")
  .filter((l) => !l.startsWith("Loaded Prisma config"))
  .join("\n")
  .trim();

if (!sql || /^-- This is an empty migration\.?$/m.test(sql)) {
  console.log("No schema changes — nothing to migrate.");
  process.exit(0);
}

const stamp = new Date().toISOString().replace(/\D/g, "").slice(0, 14);
const dir = path.join(root, "prisma", "migrations", `${stamp}_${name}`);
fs.mkdirSync(dir);
fs.writeFileSync(path.join(dir, "migration.sql"), sql + "\n");
console.log(`Created ${path.relative(root, dir)}/migration.sql`);

execFileSync("node", [path.join(root, "scripts", "fix-mysql-defaults.mjs")], { stdio: "inherit" });
prisma(["migrate", "deploy"], { stdio: "inherit" });
prisma(["generate"], { stdio: "inherit" });
fs.copyFileSync(schema, snapshot);
console.log("Done. Snapshot updated.");
