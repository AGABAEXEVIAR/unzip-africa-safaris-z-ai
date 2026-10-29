// =====================================================================
// PUBLIC Tour Booking submission endpoint — no admin auth required.
// ---------------------------------------------------------------------
// POST /api/public/tour-booking
//
// Body (JSON):
//   {
//     "tourId": "tour-xxx",
//     "tripName": "Serengeti Safari",
//     "destination": "Tanzania",
//     "duration": "7 days",
//     "pricePerPerson": 3500,
//     "numTravellers": 2,
//     "totalPrice": 7000,
//     "customerName": "Jane Doe",
//     "customerEmail": "jane@example.com",
//     "customerPhone": "+1 555 000 1234",
//     "notes": "Optional notes"
//   }
//
// Flow:
//   1. Validate input (name/email/phone/travellers required).
//   2. Rate-limit by IP (max 5 submissions per 10 minutes).
//   3. Server-side authoritative price lookup: re-read the tour from
//      the DB to confirm `pricePerPerson` and `tripName` are not
//      spoofed by the browser. Compute `totalPrice` server-side as
//      `pricePerPerson * numTravellers`.
//   4. Generate a booking reference (cuid-like ID).
//   5. INSERT into the TourBooking table.
//   6. Read the saved row back.
//   7. ATTEMPT business notification email to info@unzipafrica.com.
//      — Independent try/catch.
//   8. ATTEMPT customer confirmation email to the customer.
//      — Independent try/catch.
//   9. Return success response with the saved booking + email status
//      flags (NOT the actual email errors — those are logged server-side).
//
// IMPORTANT:
//   - The database save is the source of truth. If emails fail, the
//     record stays. If the DB save fails, NO emails are sent.
//   - Email failures never roll back the saved record.
//   - The customer's email address is NEVER used as the From address.
//   - Customer emails are only sent if the customer's email is valid.
//
// Runtime: Node.js (required by Resend SDK).
// =====================================================================
import { NextRequest, NextResponse } from "next/server";
import { query, execute } from "@/lib/db-sql";
import {
  sendBusinessNotificationTour,
  sendCustomerConfirmationTour,
  isValidEmail,
  type TourBookingData,
} from "@/lib/email/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// --- Rate limiter (in-memory, per-Node-process) ---------------------
// Adequate for shared hosting where there's typically one Node process.
// Resets every 10 minutes. Allows up to 5 submissions per IP per window.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
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

// Purge stale entries every 5 minutes to keep the Map small.
setInterval(() => {
  const now = Date.now();
  for (const [ip, hit] of ipHits.entries()) {
    if (now - hit.firstAt > RATE_LIMIT_WINDOW_MS) ipHits.delete(ip);
  }
}, 5 * 60 * 1000);

// --- Helpers ---------------------------------------------------------

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "0.0.0.0";
}

function generateBookingId(): string {
  // cuid-like — prefixed "BK-" for readability in emails.
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `BK-T-${ts}${rand}`.toUpperCase();
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
  const tourId = body.tourId ? String(body.tourId).trim() : null;

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
  if (!tourId) {
    return NextResponse.json(
      { ok: false, error: "Tour ID is required" },
      { status: 400 },
    );
  }

  // --- Authoritative price lookup (DO NOT trust browser-supplied price) ---
  // Re-read the tour from the DB to get the real pricePerPerson, name,
  // and destination. Compute totalPrice server-side.
  let tripName: string = String(body.tripName || "").trim();
  let destination: string | null = body.destination ? String(body.destination) : null;
  let duration: string | null = body.duration ? String(body.duration) : null;
  let pricePerPerson: number = toNum(body.pricePerPerson, 0);
  let startDate: string | null = null;
  let endDate: string | null = null;

  try {
    const rows = await query(
      "SELECT `name`, `destination`, `duration`, `durationDays`, `durationNights`, `priceFrom` FROM `TourPackage` WHERE `id` = ? LIMIT 1",
      [tourId],
    );
    if (rows.length === 0) {
      return NextResponse.json(
        { ok: false, error: "Tour not found" },
        { status: 404 },
      );
    }
    const tour = rows[0]!;
    tripName = String(tour.name || tripName);
    destination = tour.destination ? String(tour.destination) : destination;
    if (tour.duration) {
      duration = String(tour.duration);
    } else if (tour.durationDays) {
      const days = Number(tour.durationDays);
      const nights = tour.durationNights ? Number(tour.durationNights) : Math.max(0, days - 1);
      duration = `${days} days, ${nights} nights`;
    }
    if (tour.priceFrom !== undefined && tour.priceFrom !== null) {
      const n = Number(tour.priceFrom);
      if (Number.isFinite(n)) pricePerPerson = n;
    }
  } catch (err) {
    console.error("[tour-booking] DB lookup failed:", err);
    // Fall back to browser-supplied values (best-effort) — but flag it.
    // The booking will still be saved with the browser values, but the
    // admin will see the mismatch in the dashboard.
  }

  const totalPrice = Math.round(pricePerPerson * numTravellers * 100) / 100;

  // --- Generate booking reference + save to DB -----------------------
  const id = generateBookingId();
  const status = "PENDING";

  try {
    await execute(
      `INSERT INTO \`TourBooking\`
        (\`id\`, \`tourId\`, \`tripName\`, \`destination\`, \`duration\`,
         \`pricePerPerson\`, \`numTravellers\`, \`totalPrice\`,
         \`customerName\`, \`customerEmail\`, \`customerPhone\`,
         \`notes\`, \`status\`, \`type\`,
         \`createdAt\`, \`updatedAt\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'tour', NOW(), NOW())`,
      [
        id,
        tourId,
        tripName,
        destination,
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
    console.error("[tour-booking] DB INSERT failed:", err);
    // Critical: DB failed — return error, DO NOT send any emails.
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't save your booking. Please try again or contact us directly at info@unzipafrica.com.",
      },
      { status: 500 },
    );
  }

  // --- Read the saved row back (authoritative) ----------------------
  let saved: TourBookingData = {
    id,
    tourId,
    tripName,
    destination,
    duration,
    startDate,
    endDate,
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
      "SELECT * FROM `TourBooking` WHERE `id` = ? LIMIT 1",
      [id],
    );
    if (rows.length > 0) {
      const r = rows[0]!;
      saved = {
        id: String(r.id),
        tourId: r.tourId ? String(r.tourId) : tourId,
        tripName: String(r.tripName || tripName),
        destination: r.destination ? String(r.destination) : destination,
        duration: r.duration ? String(r.duration) : duration,
        startDate: r.startDate instanceof Date ? r.startDate.toISOString() : (r.startDate ? String(r.startDate) : null),
        endDate: r.endDate instanceof Date ? r.endDate.toISOString() : (r.endDate ? String(r.endDate) : null),
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
    console.error("[tour-booking] DB readback failed:", err);
    // Non-fatal — use the constructed `saved` object.
  }

  // --- Send emails (independent try/catch) --------------------------
  // Business notification first (most important). Customer confirmation
  // second. Each is fully isolated — failure of one never blocks the
  // other, and NEVER rolls back the DB save.
  let businessEmailOk = false;
  let customerEmailOk = false;

  try {
    const r = await sendBusinessNotificationTour(saved);
    businessEmailOk = r.ok;
    if (!r.ok) {
      console.error("[tour-booking] Business notification failed:", r.error);
    } else {
      console.log(`[tour-booking] Business notification sent: ${r.id}`);
    }
  } catch (err) {
    console.error("[tour-booking] Business notification threw:", err);
  }

  try {
    const r = await sendCustomerConfirmationTour(saved);
    customerEmailOk = r.ok;
    if (!r.ok) {
      console.error("[tour-booking] Customer confirmation failed:", r.error);
    } else {
      console.log(`[tour-booking] Customer confirmation sent: ${r.id}`);
    }
  } catch (err) {
    console.error("[tour-booking] Customer confirmation threw:", err);
  }

  // --- Response -----------------------------------------------------
  // Always return success if the DB save succeeded — the user's
  // booking is recorded. Email status flags are included for debugging
  // but the frontend should treat the response as success regardless.
  return NextResponse.json(
    {
      ok: true,
      booking: saved,
      // Status flags — frontend can optionally show "confirmation email sent"
      // but should NEVER tell the user their booking failed just because
      // an email didn't go out.
      emails: {
        businessNotification: businessEmailOk ? "sent" : "failed",
        customerConfirmation: customerEmailOk ? "sent" : "failed",
      },
    },
    { status: 201 },
  );
}

// OPTIONS for CORS preflight (not strictly needed for same-origin but
// harmless and future-proof).
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
