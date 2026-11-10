// =====================================================================
// One-time migration: clear price/tripType/accommodationLevel from all
// existing tours. These fields are no longer shown in the admin form or
// on the public site — the accommodation level is now chosen by the
// customer in the booking form, and prices are quoted manually.
//
// GET  /api/admin/migrate-clear-tour-fields   (admin cookie auth)
// POST /api/admin/migrate-clear-tour-fields   (admin cookie auth)
//
// Safe to call multiple times — sets fields to defaults each time.
// =====================================================================
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { execute } from "@/lib/db-sql";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

async function runMigration() {
  // price, priceFrom, tripType and accommodationLevel are NOT NULL in the
  // schema, so we set them to empty string / 0 rather than NULL. priceOriginal
  // is nullable, so we set it to NULL.
  const result = await execute(
    "UPDATE `TourPackage` SET `price` = '', `priceFrom` = 0, `priceOriginal` = NULL, `tripType` = '', `accommodationLevel` = ''",
    []
  );
  return result;
}

export async function GET(request: NextRequest) {
  const authed = await verifyAuth(request);
  if (!authed) {
    return NextResponse.json(
      { error: "Unauthorized — log in to the admin dashboard first" },
      { status: 401 }
    );
  }

  try {
    const result = await runMigration();
    return NextResponse.json({
      success: true,
      message:
        "Cleared price (→''), priceFrom (→0), priceOriginal (→NULL), tripType (→''), accommodationLevel (→'') from all tours.",
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("[migrate-clear-tour-fields]", error);
    return NextResponse.json(
      { error: "Migration failed", message: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
