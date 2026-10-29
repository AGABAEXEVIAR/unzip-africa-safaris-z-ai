// =====================================================================
// PUBLIC Scheduled Trip Booking submission endpoint — no admin auth.
// ---------------------------------------------------------------------
// POST /api/public/scheduled-trip-booking
//
// Body (JSON):
//   {
//     "scheduledTripId": "st-xxx",
//     "tripName": "Great Migration 2026",
//     "destination": "Tanzania",
//     "startDate": "2026-07-15T00:00:00.000Z",
//     "endDate":   "2026-07-22T00:00:00.000Z",
//     "duration": "8 days",
//     "pricePerPerson": 4500,
//     "numTravellers": 2,
//     "totalPrice": 9000,
//     "customerName": "Jane Doe",
//     "customerEmail": "jane@example.com",
//     "customerPhone": "+1 555 000 1234",
//     "notes": "Optional notes"
//   }
//
// Server-side authoritative logic:
//   - Re-reads the ScheduledTrip from DB to confirm pricing, dates,
//     name, destination, and capacity.
//   - Checks `spotsLeft >= numTravellers` — if not enough spots,
//     returns 409 Conflict and does NOT save the booking.
//   - Computes totalPrice server-side = pricePerPerson * numTravellers.
//   - Does NOT decrement spotsLeft (admin reviews each booking manually
//     before confirming — matches existing workflow).
//
// Email flow (same as tour booking): 2 independent sends, never roll
// back DB save, never throw to the caller.
//
// Runtime: Node.js (required by Resend SDK).
// =====================================================================
import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/lib/db-sql";
import {
  sendBusinessNotificationScheduledTrip,
  sendCustomerConfirmationScheduledTrip,
  isValidEmail,
  type ScheduledTripBookingData,
} from "@/lib/email/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Rate limiter (per-Node-process) --------------------------------
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const ipHits = new Map<string, { count: number; firstAt: number }>();

function rateLimitOk(ip: string): boolean {
  const now = Date.now();
  const hit = ipHits.get(ip);
  if (!hit || now - hit.firstAt > RATE_LIMIT_WINDOW_MS) {
    ipHits.set(ip, { count: 1, firstAt: now });
    return true;
  }
  if (hit.count >= RATE_LIMIT_MAX) return false;
  hit.count += 1;
  return true;
}

setInterval(() => {
  const now = Date.now();
  for (const [ip, hit] of ipHits.entries()) {
    if (now - hit.firstAt > RATE_LIMIT_WINDOW_MS) ipHits.delete(ip);
  }
}, 5 * 60 * 1000);

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "0.0.0.0";
}

function generateBookingId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `BK-S-${ts}${rand}`.toUpperCase();
}

function toNum(v: unknown, fallback = 0): number {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

// =====================================================================
// POST handler
// =====================================================================
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  if (!rateLimitOk(ip)) {
    return NextResponse.json(
      {
        ok: false,
        error: "Too many submissions. Please try again in a few minutes.",
      },
      { status: 429 },
    );
  }

  // --- Parse + validate body ---------------------------------------
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const customerName = String(body.customerName || "").trim();
  const customerEmail = String(body.customerEmail || "").trim();
  const customerPhone = String(body.customerPhone || "").trim();
  const numTravellers = Math.max(1, Math.floor(toNum(body.numTravellers, 0)));
  const notes = body.notes ? String(body.notes).trim() : null;
  const scheduledTripId = body.scheduledTripId
    ? String(body.scheduledTripId).trim()
    : null;

  if (!customerName || customerName.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Name is required" },
      { status: 400 },
    );
  }
  if (!isValidEmail(customerEmail)) {
    return NextResponse.json(
      { ok: false, error: "A valid email address is required" },
      { status: 400 },
    );
  }
  if (!customerPhone || customerPhone.length < 5) {
    return NextResponse.json(
      { ok: false, error: "Phone number is required" },
      { status: 400 },
    );
  }
  if (numTravellers < 1 || numTravellers > 50) {
    return NextResponse.json(
      { ok: false, error: "Traveller count must be between 1 and 50" },
      { status: 400 },
    );
  }
  if (!scheduledTripId) {
    return NextResponse.json(
      { ok: false, error: "Scheduled trip ID is required" },
      { status: 400 },
    );
  }

  // --- Authoritative lookup from ScheduledTrip table ---------------
  let tripName: string = String(body.tripName || "").trim();
  let destination: string | null = body.destination ? String(body.destination) : null;
  let duration: string | null = body.duration ? String(body.duration) : null;
  let pricePerPerson: number = toNum(body.pricePerPerson, 0);
  let startDate: string | null = body.startDate ? String(body.startDate) : null;
  let endDate: string | null = body.endDate ? String(body.endDate) : null;
  let spotsLeft: number | null = null;

  try {
    const rows = await query(
      `SELECT \`name\`, \`destination\`, \`startDate\`, \`endDate\`,
              \`durationDays\`, \`priceFrom\`, \`spotsLeft\`
       FROM \`ScheduledTrip\` WHERE \`id\` = ? LIMIT 1`,
      [scheduledTripId],
    );
    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Scheduled trip not found" },
        { status: 404 },
      );
    }
    const trip = rows[0]!;
    tripName = String(trip.name || tripName);
    destination = trip.destination ? String(trip.destination) : destination;
    if (trip.durationDays) {
      const days = Number(trip.durationDays);
      duration = `${days} days`;
    }
    if (trip.priceFrom !== undefined && trip.priceFrom !== null) {
      const n = Number(trip.priceFrom);
      if (Number.isFinite(n)) pricePerPerson = n;
    }
    if (trip.startDate instanceof Date) {
      startDate = trip.startDate.toISOString();
    } else if (trip.startDate) {
      startDate = String(trip.startDate);
    }
    if (trip.endDate instanceof Date) {
      endDate = trip.endDate.toISOString();
    } else if (trip.endDate) {
      endDate = String(trip.endDate);
    }
    if (trip.spotsLeft !== undefined && trip.spotsLeft !== null) {
      spotsLeft = Number(trip.spotsLeft);
    }
  } catch (err) {
    console.error("[scheduled-trip-booking] DB lookup failed:", err);
    // Continue with browser-supplied values — booking still saved.
  }

  // --- Capacity check ----------------------------------------------
  // If the trip has spotsLeft and the requested travellers exceed it,
  // reject the booking. This preserves the existing capacity display
  // semantics (which today is purely informational) by enforcing it
  // server-side at the booking step.
  if (spotsLeft !== null && numTravellers > spotsLeft) {
    return NextResponse.json(
      {
        ok: false,
        error: `This trip only has ${spotsLeft} spot${spotsLeft === 1 ? "" : "s"} left, but you requested ${numTravellers} traveller${numTravellers === 1 ? "" : "s"}. Please reduce your party size or contact us for a custom solution.`,
      },
      { status: 409 },
    );
  }

  const totalPrice = Math.round(pricePerPerson * numTravellers * 100) / 100;

  // --- Save to DB --------------------------------------------------
  const id = generateBookingId();
  const status = "PENDING";

  try {
    await execute(
      `INSERT INTO \`ScheduledTripBooking\`
        (\`id\`, \`scheduledTripId\`, \`tripName\`, \`destination\`,
         \`startDate\`, \`endDate\`, \`duration\`,
         \`pricePerPerson\`, \`numTravellers\`, \`totalPrice\`,
         \`customerName\`, \`customerEmail\`, \`customerPhone\`,
         \`notes\`, \`status\`, \`type\`,
         \`createdAt\`, \`updatedAt\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'scheduled-trip', NOW(), NOW())`,
      [
        id,
        scheduledTripId,
        tripName,
        destination,
        startDate,
        endDate,
        duration,
        pricePerPerson,
        numTravellers,
        totalPrice,
        customerName,
        customerEmail,
        customerPhone,
        notes,
        status,
      ],
    );
  } catch (err) {
    console.error("[scheduled-trip-booking] DB INSERT failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't save your booking. Please try again or contact us directly at info@unzipafrica.com.",
      },
      { status: 500 },
    );
  }

  // --- Read the saved row back (authoritative) --------------------
  let saved: ScheduledTripBookingData = {
    id,
    scheduledTripId,
    tripName,
    destination,
    startDate,
    endDate,
    duration,
    pricePerPerson,
    numTravellers,
    totalPrice,
    customerName,
    customerEmail,
    customerPhone,
    notes,
    status,
    createdAt: new Date().toISOString(),
  };

  try {
    const rows = await query(
      "SELECT * FROM `ScheduledTripBooking` WHERE `id` = ? LIMIT 1",
      [id],
    );
    if (rows.length > 0) {
      const r = rows[0]!;
      saved = {
        id: String(r.id),
        scheduledTripId: r.scheduledTripId ? String(r.scheduledTripId) : scheduledTripId,
        tripName: String(r.tripName || tripName),
        destination: r.destination ? String(r.destination) : destination,
        startDate: r.startDate instanceof Date ? r.startDate.toISOString() : (r.startDate ? String(r.startDate) : null),
        endDate: r.endDate instanceof Date ? r.endDate.toISOString() : (r.endDate ? String(r.endDate) : null),
        duration: r.duration ? String(r.duration) : duration,
        pricePerPerson: r.pricePerPerson !== undefined && r.pricePerPerson !== null ? Number(r.pricePerPerson) : pricePerPerson,
        numTravellers: Number(r.numTravellers) || numTravellers,
        totalPrice: r.totalPrice !== undefined && r.totalPrice !== null ? Number(r.totalPrice) : totalPrice,
        customerName: String(r.customerName || customerName),
        customerEmail: String(r.customerEmail || customerEmail),
        customerPhone: String(r.customerPhone || customerPhone),
        notes: r.notes ? String(r.notes) : notes,
        status: String(r.status || status),
        createdAt: r.createdAt instanceof Date ? r.createdAt.toISOString() : (r.createdAt ? String(r.createdAt) : saved.createdAt),
      };
    }
  } catch (err) {
    console.error("[scheduled-trip-booking] DB readback failed:", err);
  }

  // --- Send emails (independent try/catch) ------------------------
  let businessEmailOk = false;
  let customerEmailOk = false;

  try {
    const r = await sendBusinessNotificationScheduledTrip(saved);
    businessEmailOk = r.ok;
    if (!r.ok) {
      console.error("[scheduled-trip-booking] Business notification failed:", r.error);
    } else {
      console.log(`[scheduled-trip-booking] Business notification sent: ${r.id}`);
    }
  } catch (err) {
    console.error("[scheduled-trip-booking] Business notification threw:", err);
  }

  try {
    const r = await sendCustomerConfirmationScheduledTrip(saved);
    customerEmailOk = r.ok;
    if (!r.ok) {
      console.error("[scheduled-trip-booking] Customer confirmation failed:", r.error);
    } else {
      console.log(`[scheduled-trip-booking] Customer confirmation sent: ${r.id}`);
    }
  } catch (err) {
    console.error("[scheduled-trip-booking] Customer confirmation threw:", err);
  }

  return NextResponse.json(
    {
      ok: true,
      booking: saved,
      emails: {
        businessNotification: businessEmailOk ? "sent" : "failed",
        customerConfirmation: customerEmailOk ? "sent" : "failed",
      },
    },
    { status: 201 },
  );
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      Allow: "POST, OPTIONS",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}
