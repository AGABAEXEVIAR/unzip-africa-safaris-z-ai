// =====================================================================
// PUBLIC General Inquiry submission endpoint — no admin auth.
// ---------------------------------------------------------------------
// POST /api/public/inquiry
//
// Body (JSON) — any combination of these fields is accepted:
//   {
//     "name": "Jane Doe",            // required (min 2 chars)
//     "email": "jane@example.com",   // required IF you want an ack email
//     "phone": "+1 555 000 1234",    // optional
//     "travelers": "2 adults",       // optional
//     "dates": "July 2026",          // optional
//     "destinations": ["Tanzania","Kenya"],  // optional array OR comma string
//     "interests": ["Gorilla Trekking","Photography"],  // optional
//     "budget": "$5,000 - $7,000",   // optional
//     "duration": "7-10 days",       // optional
//     "message": "I'd love to plan a safari for..." // required (min 5 chars)
//   }
//
// Validation rules:
//   - name: required, ≥ 2 chars
//   - message: required, ≥ 5 chars
//   - email: optional, BUT if provided must be valid; otherwise no
//     customer acknowledgment is sent (business notification still goes
//     out, with reply-to = no-reply marker if email is missing).
//   - All other fields: optional, coerced to safe strings/arrays.
//
// Server-side behavior:
//   1. Validate input.
//   2. Rate-limit by IP (5 / 10 minutes).
//   3. Generate inquiry reference (cuid-like ID).
//   4. INSERT into the FormInquiry table.
//   5. ATTEMPT business notification email to info@unzipafrica.com
//      with Reply-To = customer email (if valid).
//   6. ATTEMPT customer acknowledgment email IF customer email is valid.
//   7. Return success with inquiry reference + email status flags.
//
// Email failures never roll back the DB save. DB failure prevents any
// emails from being sent.
//
// Runtime: Node.js (required by Resend SDK).
// =====================================================================
import { NextRequest, NextResponse } from "next/server";
import { execute, query } from "@/lib/db-sql";
import {
  sendBusinessNotificationInquiry,
  sendCustomerAcknowledgmentInquiry,
  isValidEmail,
  type InquiryData,
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

function generateInquiryId(): string {
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 10);
  return `INQ-${ts}${rand}`.toUpperCase();
}

// Coerce unknown value into a safe string[] for JSON columns.
function coerceStringArray(v: unknown): string[] | null {
  if (v === null || v === undefined || v === "") return null;
  if (Array.isArray(v)) {
    const arr = v.map((x) => String(x).trim()).filter(Boolean);
    return arr.length > 0 ? arr : null;
  }
  if (typeof v === "string") {
    // Accept comma-separated or JSON-array strings.
    const trimmed = v.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) {
          const arr = parsed.map((x) => String(x).trim()).filter(Boolean);
          return arr.length > 0 ? arr : null;
        }
      } catch {
        // fall through
      }
    }
    const arr = trimmed.split(",").map((s) => s.trim()).filter(Boolean);
    return arr.length > 0 ? arr : null;
  }
  return null;
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

  // --- Parse body --------------------------------------------------
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const name = String(body.name || "").trim();
  const emailRaw = String(body.email || "").trim();
  const email = isValidEmail(emailRaw) ? emailRaw : null;
  const phone = body.phone ? String(body.phone).trim() : null;
  const travelers = body.travelers ? String(body.travelers).trim() : null;
  const dates = body.dates ? String(body.dates).trim() : null;
  const budget = body.budget ? String(body.budget).trim() : null;
  const duration = body.duration ? String(body.duration).trim() : null;
  const message = body.message ? String(body.message).trim() : "";
  const destinations = coerceStringArray(body.destinations);
  const interests = coerceStringArray(body.interests);

  if (!name || name.length < 2) {
    return NextResponse.json(
      { ok: false, error: "Name is required" },
      { status: 400 },
    );
  }
  if (!message || message.length < 5) {
    return NextResponse.json(
      { ok: false, error: "Please include a short message so we can help you." },
      { status: 400 },
    );
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { ok: false, error: "Message is too long (max 5000 characters)." },
      { status: 400 },
    );
  }

  // --- Save to DB --------------------------------------------------
  const id = generateInquiryId();
  const status = "NEW";

  try {
    await execute(
      `INSERT INTO \`FormInquiry\`
        (\`id\`, \`name\`, \`email\`, \`phone\`, \`travelers\`, \`dates\`,
         \`destinations\`, \`interests\`, \`budget\`, \`duration\`,
         \`message\`, \`status\`,
         \`createdAt\`, \`updatedAt\`)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        id,
        name,
        email,            // null if invalid → MySQL stores NULL
        phone,
        travelers,
        dates,
        destinations ? JSON.stringify(destinations) : null,
        interests ? JSON.stringify(interests) : null,
        budget,
        duration,
        message,
        status,
      ],
    );
  } catch (err) {
    console.error("[inquiry] DB INSERT failed:", err);
    return NextResponse.json(
      {
        ok: false,
        error: "We couldn't save your inquiry. Please try again or email us directly at info@unzipafrica.com.",
      },
      { status: 500 },
    );
  }

  // --- Build the authoritative inquiry object for emails ----------
  const inquiry: InquiryData = {
    id,
    name,
    email: email || "",
    phone,
    travelers,
    dates,
    destinations,
    interests,
    budget,
    duration,
    message,
    status,
    createdAt: new Date().toISOString(),
  };

  // --- Send business notification (always, if email is configured) ---
  let businessEmailOk = false;
  let customerEmailOk = false;

  try {
    const r = await sendBusinessNotificationInquiry(inquiry);
    businessEmailOk = r.ok;
    if (!r.ok) {
      console.error("[inquiry] Business notification failed:", r.error);
    } else {
      console.log(`[inquiry] Business notification sent: ${r.id}`);
    }
  } catch (err) {
    console.error("[inquiry] Business notification threw:", err);
  }

  // --- Send customer acknowledgment (only if email is valid) -------
  if (email) {
    try {
      const r = await sendCustomerAcknowledgmentInquiry(inquiry);
      customerEmailOk = r.ok;
      if (!r.ok) {
        console.error("[inquiry] Customer acknowledgment failed:", r.error);
      } else {
        console.log(`[inquiry] Customer acknowledgment sent: ${r.id}`);
      }
    } catch (err) {
      console.error("[inquiry] Customer acknowledgment threw:", err);
    }
  }
  // If email is missing/invalid, customerEmailOk stays false. The
  // business notification still goes out — that's the whole point.

  return NextResponse.json(
    {
      ok: true,
      inquiry: { id, name, email, status },
      emails: {
        businessNotification: businessEmailOk ? "sent" : "failed",
        customerAcknowledgment: customerEmailOk ? "sent" : (email ? "failed" : "skipped"),
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
