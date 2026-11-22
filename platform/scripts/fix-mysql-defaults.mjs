// MySQL 8 rejects literal defaults on TEXT columns (`TEXT NOT NULL DEFAULT '{}'`), which is
// what Prisma generates. It does accept expression defaults: `DEFAULT ('{}')`.
// Rewrites every prisma/migrations/*/migration.sql in place. Idempotent.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "prisma", "migrations");
const re = /((?:TINY|MEDIUM|LONG)?TEXT(?: NOT NULL| NULL)?) DEFAULT '((?:[^'\\]|\\.|'')*)'/g;

let changed = 0;
for (const name of fs.readdirSync(dir)) {
  const file = path.join(dir, name, "migration.sql");
  if (!fs.existsSync(file)) continue;
  const sql = fs.readFileSync(file, "utf8");
  const next = sql.replace(re, (_, col, val) => `${col} DEFAULT ('${val}')`);
  if (next !== sql) {
    fs.writeFileSync(file, next);
    changed++;
  }
}
console.log(`fix-mysql-defaults: ${changed} migration file(s) updated`);
