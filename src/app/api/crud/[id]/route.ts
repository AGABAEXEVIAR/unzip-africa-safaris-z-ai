import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

// =====================================================================
// Generic CRUD [id] API — update + delete by ID
// =====================================================================
// PUT    /api/crud/[id]?type=tours   → update a tour (auth required)
// DELETE /api/crud/[id]?type=tours   → delete a tour (auth required)
// =====================================================================

const COOKIE_NAME = "admin_session";

function getModel(type: string) {
  const models: Record<string, ReturnType<typeof getAccessor>> = {
    tours: db.tourPackage,
    accommodations: db.accommodation,
    "scheduled-trips": db.scheduledTrip,
    destinations: db.destination,
    testimonials: db.testimonial,
    "blog-posts": db.blogPost,
    bookings: db.booking,
    quotes: db.quoteRequest,
  };
  return models[type];
}
type getAccessor = typeof db.tourPackage;

function serialize(record: unknown): unknown {
  if (record === null || record === undefined) return record;
  if (Array.isArray(record)) return record.map(serialize);
  if (typeof record === "object") {
    const obj = record as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (key.startsWith("_")) continue;
      if (value && typeof value === "object" && "toNumber" in (value as any)) {
        result[key] = Number(value);
      } else if (value instanceof Date) {
        result[key] = value.toISOString();
      } else if (value && typeof value === "object") {
        result[key] = serialize(value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  return record;
}

function deserialize(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string" && ["startDate", "endDate", "publishedDate", "date"].includes(key)) {
      result[key] = new Date(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}

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

// PUT — update a record by ID (auth required)
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
  const model = getModel(type);
  if (!model) {
    return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
  }

  try {
    const body = await request.json();
    const data = deserialize(body);
    const record = await model.update({ where: { id }, data });
    return NextResponse.json(serialize(record));
  } catch (error) {
    console.error(`[crud PUT] type=${type} id=${id}:`, error);
    return NextResponse.json({ error: "Failed to update record" }, { status: 500 });
  }
}

// DELETE — delete a record by ID (auth required)
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
  const model = getModel(type);
  if (!model) {
    return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
  }

  try {
    await model.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`[crud DELETE] type=${type} id=${id}:`, error);
    return NextResponse.json({ error: "Failed to delete record" }, { status: 500 });
  }
}
