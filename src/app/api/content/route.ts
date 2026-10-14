import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { query as dbQuery, execute } from "@/lib/db-sql";
import { tick } from "@/lib/entities";

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
// GET /api/content — returns the contentOverrides JSON (public)
// =====================================================================
// Returns the admin-managed content (founder, faq, safariCars) stored
// in the Settings row's contentOverrides JSON column. If the row or
// column is missing, returns {} so consumers fall back to defaults.
// =====================================================================
export async function GET() {
  try {
    const rows = await dbQuery(
      `SELECT ${tick("contentOverrides")} AS overrides FROM Settings WHERE id = 1 LIMIT 1`
    );
    if (rows.length === 0) {
      return NextResponse.json({});
    }
    let overrides = rows[0].overrides;
    if (overrides === null || overrides === undefined) {
      return NextResponse.json({});
    }
    // mysql2 may return JSON columns as already-parsed objects, or as
    // strings. Normalise to an object.
    if (typeof overrides === "string") {
      try { overrides = JSON.parse(overrides); }
      catch { return NextResponse.json({}); }
    }
    if (typeof overrides !== "object" || overrides === null) {
      return NextResponse.json({});
    }
    return NextResponse.json(overrides);
  } catch (error) {
    // Database not configured yet, or column missing — return empty so
    // components use defaults. Log for debugging.
    console.error("[content GET]:", error);
    return NextResponse.json({});
  }
}

// =====================================================================
// PUT /api/content — updates the contentOverrides JSON (admin only)
// =====================================================================
// Body: any JSON object — merged with existing overrides.
// =====================================================================
export async function PUT(request: NextRequest) {
  const authed = await verifyAuth(request);
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();

    // Read existing overrides (if any)
    const existingRows = await dbQuery(
      `SELECT ${tick("contentOverrides")} AS overrides FROM Settings WHERE id = 1 LIMIT 1`
    );
    let existing: Record<string, unknown> = {};
    if (existingRows.length > 0) {
      let v = existingRows[0].overrides;
      if (typeof v === "string") {
        try { v = JSON.parse(v); } catch { v = {}; }
      }
      if (v && typeof v === "object") existing = v as Record<string, unknown>;
    }

    const merged = { ...existing, ...body };
    const mergedJson = JSON.stringify(merged);

    // Upsert — INSERT ... ON DUPLICATE KEY UPDATE handles both cases.
    await execute(
      `INSERT INTO Settings (id, ${tick("contentOverrides")}, ${tick("updatedAt")})
       VALUES (1, ?, NOW())
       ON DUPLICATE KEY UPDATE ${tick("contentOverrides")} = VALUES(${tick("contentOverrides")}), ${tick("updatedAt")} = NOW()`,
      [mergedJson]
    );

    return NextResponse.json({ success: true, contentOverrides: merged });
  } catch (error) {
    const e = error as Error;
    console.error("[content PUT]:", e);
    return NextResponse.json(
      { error: "Failed to update content", message: e.message },
      { status: 500 }
    );
  }
}
