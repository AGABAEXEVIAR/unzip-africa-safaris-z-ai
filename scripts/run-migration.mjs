// =====================================================================
// Migration runner — adds missing columns to the production MySQL DB.
// ---------------------------------------------------------------------
// Usage:
//   DATABASE_URL='mysql://user:pass@host:port/db' node scripts/run-migration.mjs
//
// Idempotent — uses IF NOT EXISTS on every ALTER so it can be re-run.
// =====================================================================

import mysql from "mysql2/promise";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(__dirname, "migrate-add-columns.sql");
const sqlRaw = readFileSync(sqlPath, "utf8");

// Parse DATABASE_URL — required.
const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL environment variable is required.");
  process.exit(1);
}

const m = url.match(/^mysql:\/\/([^:]+):([^@]*)@([^:/?#]+)(?::(\d+))?\/([^?#]+)/);
if (!m) {
  console.error("DATABASE_URL is not a valid mysql:// URL.");
  process.exit(1);
}

const [, userRaw, passRaw, host, port, db] = m;
const user = decodeURIComponent(userRaw);
const password = decodeURIComponent(passRaw);

console.log(`Connecting to ${user}@${host}:${port || 3306}/${db} ...`);

const conn = await mysql.createConnection({
  host,
  port: port ? Number(port) : 3306,
  user,
  password,
  database: db,
  multipleStatements: true,
});

// Split on semicolons followed by newline (the end of each statement)
// — naive but the SQL file is hand-written and well-formed.
const statements = sqlRaw
  .split(/;\s*\n/)
  .map((s) => s.trim())
  .filter((s) => s.length > 0 && !s.startsWith("--"));

console.log(`Running ${statements.length} migration statements...`);

let ok = 0;
let failed = 0;
for (const stmt of statements) {
  try {
    await conn.query(stmt);
    const preview = stmt.replace(/\s+/g, " ").slice(0, 80);
    console.log(`  OK  ${preview}`);
    ok++;
  } catch (err) {
    const e = err;
    const msg = (e && e.message) ? e.message : String(e);
    // "Duplicate column" is expected when re-running — ignore.
    if (msg.includes("Duplicate column") || msg.includes("column already exists")) {
      const preview = stmt.replace(/\s+/g, " ").slice(0, 80);
      console.log(`  skip (already exists): ${preview}`);
      ok++;
    } else {
      console.error(`  FAIL ${msg}`);
      console.error(`     SQL: ${stmt.slice(0, 200)}`);
      failed++;
    }
  }
}

await conn.end();
console.log(`\nDone. ${ok} ok, ${failed} failed.`);

if (failed > 0) process.exit(1);
