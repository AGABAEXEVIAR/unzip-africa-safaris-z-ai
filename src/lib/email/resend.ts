// =====================================================================
// Resend email client — server-only singleton.
// ---------------------------------------------------------------------
// This module is imported ONLY by server-side route handlers. It must
// never end up in a client bundle — the RESEND_API_KEY secret would
// leak.
//
// Public API:
//   sendBusinessNotificationTour(booking)
//   sendCustomerConfirmationTour(booking)
//   sendBusinessNotificationScheduledTrip(booking)
//   sendCustomerConfirmationScheduledTrip(booking)
//   sendBusinessNotificationInquiry(inquiry)
//   sendCustomerAcknowledgmentInquiry(inquiry)
//
// Each function:
//   - Reads its own env vars (RESEND_API_KEY, RESEND_FROM_EMAIL, etc.)
//   - Wraps the Resend API call in try/catch
//   - Returns { ok: boolean, id?: string, error?: string }
//   - NEVER throws — failures are returned so callers can log without
//     affecting the DB save path.
// =====================================================================

import { Resend } from "resend";
import {
  businessNotificationTourHtml,
  businessNotificationTourText,
  customerConfirmationTourHtml,
  customerConfirmationTourText,
  businessNotificationScheduledTripHtml,
  businessNotificationScheduledTripText,
  customerConfirmationScheduledTripHtml,
  customerConfirmationScheduledTripText,
  businessNotificationInquiryHtml,
  businessNotificationInquiryText,
  customerAcknowledgmentInquiryHtml,
  customerAcknowledgmentInquiryText,
} from "./templates";

// Force Node.js runtime (Resend SDK uses fetch + needs Node 18+).
// This is also enforced by Next.js route config in each public route.
// export const runtime = "nodejs"; // (set in the route files themselves)

let client: Resend | null = null;
let lastInitError: string | null = null;

function getClient(): Resend | null {
  if (client) return client;
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.startsWith("re_xxxx")) {
    lastInitError = "RESEND_API_KEY is not configured";
    return null;
  }
  try {
    client = new Resend(apiKey);
    return client;
  } catch (err) {
    lastInitError = `Failed to init Resend: ${(err as Error).message}`;
    return null;
  }
}

function fromEmail(): string {
  return (
    process.env.RESEND_FROM_EMAIL ||
    "Unzip Africa Safaris <notifications@unzipafrica.com>"
  );
}

function notificationEmail(): string {
  return process.env.BOOKING_NOTIFICATION_EMAIL || "info@unzipafrica.com";
}

function replyToEmail(): string {
  return process.env.RESEND_REPLY_TO_EMAIL || "info@unzipafrica.com";
}

export type EmailResult = {
  ok: boolean;
  id?: string;
  error?: string;
};

// Internal helper — performs the actual Resend send.
async function send(
  to: string,
  subject: string,
  html: string,
  text: string,
  replyTo?: string,
): Promise<EmailResult> {
  const c = getClient();
  if (!c) {
    return { ok: false, error: lastInitError || "Resend not configured" };
  }
  try {
    const { data, error } = await c.emails.send({
      from: fromEmail(),
      to,
      subject,
      html,
      text,
      replyTo: replyTo,
    });
    if (error) {
      // Resend returns error objects with .message and .name
      return { ok: false, error: error.message || String(error) };
    }
    if (!data || !data.id) {
      return { ok: false, error: "Resend returned no message id" };
    }
    return { ok: true, id: data.id };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return { ok: false, error: msg };
  }
}

// =====================================================================
// Tour booking emails
// =====================================================================

export type TourBookingData = {
  id: string;
  tourId?: string | null;
  tripName: string;
  destination?: string | null;
  duration?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  pricePerPerson?: number | null;
  numTravellers: number;
  totalPrice?: number | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string | null;
  status: string;
  createdAt?: string;
};

export async function sendBusinessNotificationTour(
  b: TourBookingData,
): Promise<EmailResult> {
  const html = businessNotificationTourHtml(b);
  const text = businessNotificationTourText(b);
  const subject = `New Tour Booking — ${b.tripName} — ${b.id}`;
  // Reply-To = customer's email so you can hit Reply in your inbox.
  return send(notificationEmail(), subject, html, text, b.customerEmail);
}

export async function sendCustomerConfirmationTour(
  b: TourBookingData,
): Promise<EmailResult> {
  const html = customerConfirmationTourHtml(b);
  const text = customerConfirmationTourText(b);
  const subject = `We Have Received Your Tour Booking — Unzip Africa`;
  // Only send if the customer email is plausible.
  if (!isValidEmail(b.customerEmail)) {
    return { ok: false, error: "Invalid customer email — skipped" };
  }
  return send(b.customerEmail, subject, html, text, replyToEmail());
}

// =====================================================================
// Scheduled trip booking emails
// =====================================================================

export type ScheduledTripBookingData = {
  id: string;
  scheduledTripId?: string | null;
  tripName: string;
  destination?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  duration?: string | null;
  pricePerPerson?: number | null;
  numTravellers: number;
  totalPrice?: number | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  notes?: string | null;
  status: string;
  createdAt?: string;
};

export async function sendBusinessNotificationScheduledTrip(
  b: ScheduledTripBookingData,
): Promise<EmailResult> {
  const html = businessNotificationScheduledTripHtml(b);
  const text = businessNotificationScheduledTripText(b);
  const subject = `New Scheduled Trip Booking — ${b.tripName} — ${b.id}`;
  return send(notificationEmail(), subject, html, text, b.customerEmail);
}

export async function sendCustomerConfirmationScheduledTrip(
  b: ScheduledTripBookingData,
): Promise<EmailResult> {
  const html = customerConfirmationScheduledTripHtml(b);
  const text = customerConfirmationScheduledTripText(b);
  const subject = `Your Scheduled Trip Booking Request — Unzip Africa`;
  if (!isValidEmail(b.customerEmail)) {
    return { ok: false, error: "Invalid customer email — skipped" };
  }
  return send(b.customerEmail, subject, html, text, replyToEmail());
}

// =====================================================================
// General inquiry emails
// =====================================================================

export type InquiryData = {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  travelers?: string | null;
  dates?: string | null;
  destinations?: string[] | string | null;
  interests?: string[] | string | null;
  budget?: string | null;
  duration?: string | null;
  message: string;
  status: string;
  createdAt?: string;
};

export async function sendBusinessNotificationInquiry(
  i: InquiryData,
): Promise<EmailResult> {
  const html = businessNotificationInquiryHtml(i);
  const text = businessNotificationInquiryText(i);
  const subject = `New Website Inquiry — ${truncate(i.message, 50) || i.name}`;
  // Reply-To = customer's email (if valid) so you can hit Reply directly.
  const replyTo = isValidEmail(i.email) ? i.email : undefined;
  return send(notificationEmail(), subject, html, text, replyTo);
}

export async function sendCustomerAcknowledgmentInquiry(
  i: InquiryData,
): Promise<EmailResult> {
  if (!isValidEmail(i.email)) {
    // Inquiry form allows submissions without a valid email — preserve that
    // behavior. The business notification still goes out (see above).
    return { ok: false, error: "No valid customer email — acknowledgment skipped" };
  }
  const html = customerAcknowledgmentInquiryHtml(i);
  const text = customerAcknowledgmentInquiryText(i);
  const subject = `Thank You for Contacting Unzip Africa`;
  return send(i.email, subject, html, text, replyToEmail());
}

// =====================================================================
// Helpers
// =====================================================================

// RFC 5322 simplified — adequate for filtering obvious junk.
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const e = String(email).trim().toLowerCase();
  if (e.length === 0 || e.length > 254) return false;
  // Local-part max 64 chars, domain max 253, no spaces, simple structure.
  return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[a-z0-9-]{1,253}(\.[a-z0-9-]{1,253})+$/.test(e);
}

function truncate(s: string | null | undefined, n: number): string {
  if (!s) return "";
  return s.length > n ? s.slice(0, n) + "…" : s;
}
