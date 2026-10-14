import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { query as dbQuery, execute } from "@/lib/db-sql";
import { ENTITIES, getEntityDef, tick, toSqlValue, fromSqlRow } from "@/lib/entities";

// =====================================================================
// Generic CRUD [id] API — update + delete by ID
// ---------------------------------------------------------------------
// PUT    /api/crud/[id]?type=tours   → update a tour (admin auth)
// DELETE /api/crud/[id]?type=tours   → delete a tour (admin auth)
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
// PUT — update a record by ID (admin auth)
// =====================================================================
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await verifyAuth(request);
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
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

    // Build dynamic UPDATE statement. Only update fields that are present
    // in the body — PATCH-style partial update.
    const setClauses: string[] = [];
    const vals: unknown[] = [];

    for (const col of def.columns) {
      if (body[col] === undefined) continue;
      const isJson = def.jsonColumns.includes(col);
      setClauses.push(`${tick(col)} = ?`);
      vals.push(toSqlValue(body[col], isJson));
    }

    // Inline children — stringify objects/arrays on write.
    if (def.inlineChildren) {
      for (const child of def.inlineChildren) {
        if (body[child.field] === undefined) continue;
        const v = body[child.field];
        setClauses.push(`${tick(child.column)} = ?`);
        if (v === null) {
          vals.push(null);
        } else if (typeof v === "string") {
          vals.push(v);
        } else {
          vals.push(JSON.stringify(v));
        }
      }
    }

    if (setClauses.length === 0) {
      // Nothing to update — return existing row.
      const rows = await dbQuery(
        `SELECT * FROM ${tick(def.table)} WHERE ${tick("id")} = ? LIMIT 1`,
        [id]
      );
      if (rows.length === 0) {
        return NextResponse.json({ error: "Record not found" }, { status: 404 });
      }
      return NextResponse.json(fromSqlRow(rows[0], def));
    }

    // updatedAt = NOW() (auto-update column)
    setClauses.push(`${tick("updatedAt")} = NOW()`);

    vals.push(id);
    const sql = `UPDATE ${tick(def.table)} SET ${setClauses.join(", ")} WHERE ${tick("id")} = ?`;
    await execute(sql, vals);

    const rows = await dbQuery(
      `SELECT * FROM ${tick(def.table)} WHERE ${tick("id")} = ? LIMIT 1`,
      [id]
    );
    if (rows.length === 0) {
      return NextResponse.json({ error: "Record not found after update" }, { status: 404 });
    }
    return NextResponse.json(fromSqlRow(rows[0], def));
  } catch (error) {
    const e = error as Error;
    console.error(`[crud PUT] type=${type} id=${id}:`, e);
    return NextResponse.json(
      { error: "Failed to update record", message: e.message },
      { status: 500 }
    );
  }
}

// =====================================================================
// DELETE — delete a record by ID (admin auth)
// =====================================================================
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const authed = await verifyAuth(request);
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const type = request.nextUrl.searchParams.get("type");
  if (!type) {
    return NextResponse.json({ error: "Missing ?type= parameter" }, { status: 400 });
  }
  if (!ENTITIES[type]) {
    return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
  }
  const def = getEntityDef(type);

  try {
    await execute(
      `DELETE FROM ${tick(def.table)} WHERE ${tick("id")} = ?`,
      [id]
    );
    return NextResponse.json({ success: true, id });
  } catch (error) {
    const e = error as Error;
    console.error(`[crud DELETE] type=${type} id=${id}:`, e);
    return NextResponse.json(
      { error: "Failed to delete record", message: e.message },
      { status: 500 }
    );
  }
}
