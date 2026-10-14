import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { query as dbQuery, execute } from "@/lib/db-sql";
import { ENTITIES, getEntityDef, tick, toSqlValue, fromSqlRow } from "@/lib/entities";

// =====================================================================
// Generic CRUD API — handles all entity types via ?type= query param
// ---------------------------------------------------------------------
// Backed by raw SQL via mysql2 (pure-JS, no Rust engine).
//
// GET  /api/crud?type=tours         → fetch all tours (public)
// POST /api/crud?type=tours         → create a tour (admin auth)
// =====================================================================

const COOKIE_NAME = "admin_session";

async function verifyAuth(request: NextRequest): Promise<boolean> {
  const secret = process.env.NEXTAUTH_SECRET;
  if (!secret) return false;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
    return payload.role === "admin";
  } catch {
    return false;
  }
}

// =====================================================================
// GET — fetch all records of a given type (public, no auth)
// =====================================================================
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  if (!type) {
    return NextResponse.json({ error: "Missing ?type= parameter" }, { status: 400 });
  }
  if (!ENTITIES[type]) {
    return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
  }
  const def = getEntityDef(type);

  try {
    const rows = await dbQuery(`SELECT * FROM ${tick(def.table)} ORDER BY ${tick("createdAt")} DESC`);
    const out = rows.map((row) => fromSqlRow(row, def));
    return NextResponse.json(out);
  } catch (error) {
    console.error(`[crud GET] type=${type}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch data", message: (error as Error).message },
      { status: 500 }
    );
  }
}

// =====================================================================
// POST — create a new record (admin auth required)
// =====================================================================
export async function POST(request: NextRequest) {
  const authed = await verifyAuth(request);
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const type = request.nextUrl.searchParams.get("type");
  if (!type) {
    return NextResponse.json({ error: "Missing ?type= parameter" }, { status: 400 });
  }
  if (!ENTITIES[type]) {
    return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
  }
  const def = getEntityDef(type);

  try {
    const body = (await request.json()) as Record<string, unknown>;
    // Caller's id (if any) — otherwise generate a cuid-like id.
    // mysql2 doesn't have a cuid generator, so use a 24-char random string
    // prefixed to mimic Prisma's default.
    const id = typeof body.id === "string" && body.id.length > 0
      ? body.id
      : `c${Date.now().toString(36)}${Math.random().toString(36).slice(2, 12).padEnd(8, "0")}`;

    // Build column-list and value-list for INSERT.
    // Always include `id`. Skip undefined body fields (let DB apply defaults).
    const cols: string[] = ["id"];
    const vals: unknown[] = [id];

    for (const col of def.columns) {
      if (body[col] === undefined) continue;
      const isJson = def.jsonColumns.includes(col);
      cols.push(col);
      vals.push(toSqlValue(body[col], isJson));
    }

    // Inline children (days, stops, gameParks, inclusions, exclusions, mapEmbed, etc.)
    if (def.inlineChildren) {
      for (const child of def.inlineChildren) {
        if (body[child.field] === undefined) continue;
        cols.push(child.column);
        // For JSON-stored children, always stringify objects/arrays.
        const v = body[child.field];
        if (v === null) {
          vals.push(null);
        } else if (typeof v === "string") {
          vals.push(v);
        } else {
          vals.push(JSON.stringify(v));
        }
      }
    }

    const placeholders = cols.map(() => "?").join(", ");
    const colList = cols.map(tick).join(", ");
    const sql = `INSERT INTO ${tick(def.table)} (${colList}) VALUES (${placeholders})`;

    try {
      await execute(sql, vals);
    } catch (insertErr) {
      // If the error is "Unknown column X" it means the migration hasn't
      // been run yet. Log it clearly and return a helpful error.
      const e = insertErr as Error;
      console.error(`[crud POST INSERT] type=${type}:`, e.message);
      throw e;
    }

    // Read back the row to return what was stored.
    const rows = await dbQuery(
      `SELECT * FROM ${tick(def.table)} WHERE ${tick("id")} = ? LIMIT 1`,
      [id]
    );
    const out = rows.length > 0 ? fromSqlRow(rows[0], def) : { ...body, id };
    return NextResponse.json(out);
  } catch (error) {
    const e = error as Error;
    console.error(`[crud POST] type=${type}:`, e);
    return NextResponse.json(
      { error: "Failed to create record", message: e.message },
      { status: 500 }
    );
  }
}
