import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";

// =====================================================================
// Generic CRUD API — handles all entity types via ?type= query param
// =====================================================================
// GET  /api/crud?type=tours         → fetch all tours (public, no auth)
// POST /api/crud?type=tours         → create a tour (auth required)
//
// PUT   /api/crud?type=tours&id=x   → update a tour (auth required)
// DELETE /api/crud?type=tours&id=x → delete a tour (auth required)
//
// Supported types: tours, accommodations, scheduled-trips, destinations,
//                  testimonials, blog-posts, bookings, quotes
// =====================================================================

const COOKIE_NAME = "admin_session";

// Map query type → Prisma model accessor
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

// Serialize Prisma records → plain JSON (convert Decimal, DateTime, etc.)
function serialize(record: unknown): unknown {
  if (record === null || record === undefined) return record;
  if (Array.isArray(record)) return record.map(serialize);
  if (typeof record === "object") {
    const obj = record as Record<string, unknown>;
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      // Skip Prisma internal keys
      if (key.startsWith("_")) continue;
      // Decimal → number
      if (value && typeof value === "object" && "toNumber" in (value as any)) {
        result[key] = Number(value);
      }
      // Date → ISO string
      else if (value instanceof Date) {
        result[key] = value.toISOString();
      }
      // Nested objects/arrays → recurse
      else if (value && typeof value === "object") {
        result[key] = serialize(value);
      }
      else {
        result[key] = value;
      }
    }
    return result;
  }
  return record;
}

// Deserialize input JSON → Prisma-compatible values (convert ISO strings → Date)
function deserialize(data: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    // Convert ISO date strings to Date objects for DateTime fields
    if (typeof value === "string" && (key === "startDate" || key === "endDate" || key === "publishedDate" || key === "date")) {
      result[key] = new Date(value);
    }
    else {
      result[key] = value;
    }
  }
  return result;
}

// Verify the admin JWT cookie (for write operations)
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

// GET — fetch all records of a given type (public)
export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  if (!type) {
    return NextResponse.json({ error: "Missing ?type= parameter" }, { status: 400 });
  }
  const model = getModel(type);
  if (!model) {
    return NextResponse.json({ error: `Unknown type: ${type}` }, { status: 400 });
  }
  try {
    const records = await model.findMany();
    return NextResponse.json(serialize(records));
  } catch (error) {
    console.error(`[crud GET] type=${type}:`, error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

// POST — create a new record (auth required)
export async function POST(request: NextRequest) {
  const authed = await verifyAuth(request);
  if (!authed) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

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
    const record = await model.create({ data });
    return NextResponse.json(serialize(record));
  } catch (error) {
    console.error(`[crud POST] type=${type}:`, error);
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
  }
}
