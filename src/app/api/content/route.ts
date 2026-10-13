import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

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

// GET — returns the contentOverrides JSON (public, no auth needed)
export async function GET() {
  try {
    const settings = await db.settings.findUnique({ where: { id: 1 } });
    const overrides = (settings?.contentOverrides as Record<string, unknown> | null) ?? {};
    return NextResponse.json(overrides);
  } catch (error) {
    // Database not configured yet — return empty object so components use defaults
    return NextResponse.json({});
  }
}

// PUT — updates the contentOverrides JSON (admin only)
export async function PUT(request: NextRequest) {
  const authed = await verifyAuth(request);
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const settings = await db.settings.findUnique({ where: { id: 1 } });

    // Merge new overrides with existing ones
    const existing = (settings?.contentOverrides as Record<string, unknown> | null) ?? {};
    const merged = { ...existing, ...body };

    // Upsert the Settings row (create if doesn't exist, update if it does)
    await db.settings.upsert({
      where: { id: 1 },
      update: { contentOverrides: merged },
      create: {
        id: 1,
        contentOverrides: merged,
      },
    });

    return NextResponse.json({ success: true, contentOverrides: merged });
  } catch (error) {
    console.error("[content PUT]:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}
