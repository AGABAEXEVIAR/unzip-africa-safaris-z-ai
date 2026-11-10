// =====================================================================
// One-time migration: populate the `overview` column for the three
// featured tours. The overview is a short paragraph shown beneath the
// tour title on the homepage featured-cards carousel.
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
  {
    id: "migration",
    overview:
      "Witness two million wildebeest thundering across the endless golden plains of the Serengeti and Maasai Mara — nature's greatest spectacle, unfolding across two countries in a primal tide of life.",
  },
  {
    id: "apes",
    overview:
      "Trek through mist-shrouded primaeval forest to sit among mountain gorillas and chimpanzees — a quiet, profound encounter with our closest living relatives in the ancient forests of Uganda and Rwanda.",
  },
  {
    id: "maasai-mara-classic",
    overview:
      "Track the Mara's legendary prides of lion, leopard, and cheetah across short-grass plains teeming with wildlife — the definitive big-cat safari in Kenya's most iconic reserve.",
  },
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
      message: "Populated overview for the three featured tours.",
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
