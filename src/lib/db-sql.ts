// =====================================================================
// Raw MySQL driver (mysql2/promise) — replacement for Prisma Client
// ---------------------------------------------------------------------
// Why: Prisma's Rust query engine has reliability issues on Hostinger
// shared hosting (timer panics during `prisma db seed`, and silent
// failures during `model.create()` because the API client sends fields
// the Prisma schema doesn't know about). mysql2 is pure JavaScript,
// has no native engine, and works reliably on shared hosting.
// =====================================================================

import mysql, { type Pool } from "mysql2/promise";

// Singleton pool — created on first use, reused across all requests.
let pool: Pool | null = null;

export function getPool(): Pool {
  if (pool) return pool;

  // Default config — can be overridden by individual env vars.
  const opts = {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "",
    connectionLimit: 8,
    waitForConnections: true,
    queueLimit: 32,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0,
    namedPlaceholders: false,
    timezone: "Z",
  };

  // Parse DATABASE_URL if present (mysql://user:pass@host:port/dbname).
  // Hostinger ships DATABASE_URL only — so this is the canonical source.
  const url = process.env.DATABASE_URL;
  if (url) {
    try {
      const m = url.match(/^mysql:\/\/([^:]+):([^@]*)@([^:/?#]+)(?::(\d+))?\/([^?#]+)/);
      if (m) {
        opts.user = decodeURIComponent(m[1]);
        opts.password = decodeURIComponent(m[2]);
        opts.host = m[3];
        opts.port = m[4] ? Number(m[4]) : 3306;
        opts.database = m[5];
      }
    } catch {
      // fall through — opts already has individual env vars
    }
  }

  pool = mysql.createPool(opts);
  return pool;
}

// Helper — execute a SELECT query, returns the rows.
// Uses `?` positional placeholders (mysql2 default).
export async function query(
  sql: string,
  params: unknown[] = []
): Promise<Record<string, unknown>[]> {
  const conn = getPool();
  const [rows] = await conn.query(sql, params as never[]);
  return rows as Record<string, unknown>[];
}

// Helper — execute an INSERT/UPDATE/DELETE, returns the affected metadata.
export async function execute(
  sql: string,
  params: unknown[] = []
): Promise<{ affectedRows: number; insertId: number | string }> {
  const conn = getPool();
  const [result] = await conn.query(sql, params as never[]);
  const r = result as { affectedRows: number; insertId: number | string };
  return { affectedRows: r.affectedRows ?? 0, insertId: r.insertId ?? 0 };
}

// =====================================================================
// Self-healing schema — mirrors scripts/migrate-add-columns.sql
// ---------------------------------------------------------------------
// The sandbox cannot SSH to Hostinger to run migrations, and the auto-
// rebuild does not run them either. So the app ensures its own schema:
// on the first CRUD request after a new build starts, it checks whether
// each "extra" column exists and adds it (IF NOT EXISTS) if missing.
//
// This is idempotent and guarded by a module-level flag so it runs at
// most once per server process. If it fails (e.g. a column genuinely
// cannot be added), the flag is reset so the next request retries.
//
// Each entry mirrors one ALTER TABLE ... ADD COLUMN IF NOT EXISTS in
// migrate-add-columns.sql. Keep them in sync when adding new columns.
// =====================================================================
const SCHEMA_COLUMNS: Array<{ table: string; column: string; def: string }> = [
  { table: "TourPackage", column: "days", def: "JSON NULL" },
  { table: "TourPackage", column: "inclusions", def: "JSON NULL" },
  { table: "TourPackage", column: "exclusions", def: "JSON NULL" },
  { table: "TourPackage", column: "mapEmbed", def: "TEXT NULL" },
  { table: "ScheduledTrip", column: "stops", def: "JSON NULL" },
  { table: "ScheduledTrip", column: "mapEmbed", def: "TEXT NULL" },
  { table: "ScheduledTrip", column: "accommodationIds", def: "JSON NULL" },
  { table: "Destination", column: "gameParks", def: "JSON NULL" },
  { table: "Accommodation", column: "pricePerNight", def: "VARCHAR(191) NULL" },
  { table: "Settings", column: "contentOverrides", def: "JSON NULL" },
];

let schemaEnsured = false;

export async function ensureSchema(): Promise<void> {
  if (schemaEnsured) return;
  // Set the flag BEFORE running so concurrent requests don't all try.
  // If anything fails, we reset it so the next request retries.
  schemaEnsured = true;
  const conn = getPool();
  for (const { table, column, def } of SCHEMA_COLUMNS) {
    try {
      const [rows] = await conn.query(
        `SHOW COLUMNS FROM \`${table}\` LIKE ?`,
        [column]
      );
      const found = Array.isArray(rows) && rows.length > 0;
      if (!found) {
        await conn.query(
          `ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${def}`
        );
        console.log(`[ensure-schema] Added ${table}.${column} (${def})`);
      }
    } catch (err) {
      // "Duplicate column" / "already exists" is expected under races.
      const msg = err instanceof Error ? err.message : String(err);
      if (
        msg.includes("Duplicate column") ||
        msg.toLowerCase().includes("already exists")
      ) {
        // fine — column exists
      } else {
        console.error(`[ensure-schema] ${table}.${column} failed:`, msg);
        schemaEnsured = false;
      }
    }
  }
}

