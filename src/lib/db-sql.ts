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
