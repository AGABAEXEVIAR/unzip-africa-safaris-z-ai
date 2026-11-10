// =====================================================================
// One-time migration: populate the `overview` column for all tours with
// the heading text shown after the hero on the tour page and beneath the
// title on tour cards.
//
// GET  /api/admin/migrate-tour-overviews   (admin cookie auth)
// POST /api/admin/migrate-tour-overviews   (admin cookie auth)
//
// Safe to call multiple times — overwrites the overview each time.
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

const OVERVIEWS: Array<{ id: string; overview: string }> = [
  { id: "migration", overview: "A private journey through Tanzania, composed entirely around you." },
  { id: "apes", overview: "A private journey through Uganda, composed entirely around you." },
  { id: "delta", overview: "A private journey through Botswana, composed entirely around you." },
  { id: "gorilla-classic", overview: "A private journey through Rwanda, composed entirely around you." },
  { id: "maasai-mara-classic", overview: "A private journey through Kenya, composed entirely around you." },
  { id: "namib-duchesert", overview: "A private journey through Namibia, composed entirely around you." },
  { id: "family-tanzania", overview: "A private journey through Tanzania, composed entirely around you." },
  { id: "chimp-uganda", overview: "A private journey through Uganda, composed entirely around you." },
  { id: "botswana-fly-in", overview: "A private journey through Botswana, composed entirely around you." },
  { id: "rwanda-cultural", overview: "A private journey through Rwanda, composed entirely around you." },
  { id: "kenya-birding", overview: "A private journey through Kenya, composed entirely around you." },
  { id: "uganda-gorilla-murchison", overview: "A private journey through Uganda, composed entirely around you." },
  { id: "tanzania-zanzibar", overview: "A private journey through Tanzania, composed entirely around you." },
];

async function runMigration() {
  const results: Array<{ id: string; affectedRows: number }> = [];
  for (const { id, overview } of OVERVIEWS) {
    const r = await execute(
      "UPDATE `TourPackage` SET `overview` = ? WHERE `id` = ?",
      [overview, id]
    );
    results.push({ id, affectedRows: r.affectedRows });
  }
  return results;
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
    const results = await runMigration();
    return NextResponse.json({
      success: true,
      message: "Populated overview for all 13 tours.",
      results,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
