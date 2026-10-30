// =====================================================================
// Email templates — HTML + plain-text alternatives for all 6 email paths.
// ---------------------------------------------------------------------
// All user-submitted values are HTML-escaped via `esc()` before being
// interpolated into the HTML body. The plain-text alternative is built
// from the same values (no HTML in the text version).
//
// Shared layout: `emailLayout()` wraps every HTML body with the Unzip
// Africa brand header (gold accent bar + Cormorant serif title), the
// main content card, and a professional footer with contact info.
// =====================================================================

import type {
  TourBookingData,
  ScheduledTripBookingData,
  InquiryData,
} from "./resend";

// --- Helpers ----------------------------------------------------------

function esc(s: unknown): string {
  if (s === null || s === undefined) return "";
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(s: string | null | undefined): string {
  if (!s) return "—";
  try {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return String(s);
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return String(s);
  }
}

function formatDateTime(s: string | null | undefined): string {
  if (!s) return "—";
  try {
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return String(s);
    return d.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(s);
  }
}

function formatMoney(n: number | null | undefined): string {
  if (n === null || n === undefined) return "—";
  const num = Number(n);
  if (!Number.isFinite(num)) return "—";
  return num.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://unzipafrica.com"
  ).replace(/\/$/, "");
}

// Format a list value that can be either a string[] or a comma-separated
// string (the DB stores both shapes depending on the JSON column).
function formatList(v: string[] | string | null | undefined): string {
  if (!v) return "—";
  if (Array.isArray(v)) {
    return v.length > 0 ? v.map((x) => esc(x)).join(", ") : "—";
  }
  if (typeof v === "string") {
    // If it's JSON-array-shaped, try to parse it.
    const trimmed = v.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const arr = JSON.parse(trimmed);
        if (Array.isArray(arr)) {
          return arr.length > 0 ? arr.map((x) => esc(String(x))).join(", ") : "—";
        }
      } catch {
        // fall through to treat as plain string
      }
    }
    return esc(trimmed) || "—";
  }
  return "—";
}

// Shared row component for labelled field values in the email body.
function row(label: string, value: string): string {
  return `
    <tr>
      <td style="padding:6px 0;color:#5a5a55;font-size:13px;font-weight:500;width:42%;vertical-align:top;">
        ${esc(label)}
      </td>
      <td style="padding:6px 0;color:#1a1a1a;font-size:14px;font-weight:600;vertical-align:top;">
        ${value}
      </td>
    </tr>`;
}

// --- Shared layout ----------------------------------------------------

function emailLayout(title: string, subtitle: string, bodyHtml: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f4efe6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4efe6;min-width:100%;">
    <tr>
      <td align="center" style="padding:24px 12px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#fffdf7;border:1px solid #e6e0d4;">

          <!-- Gold accent bar -->
          <tr>
            <td style="background:#b08d57;height:4px;line-height:4px;font-size:4px;">&nbsp;</td>
          </tr>

          <!-- Brand header -->
          <tr>
            <td style="padding:24px 28px 8px 28px;border-bottom:1px solid #e6e0d4;">
              <p style="margin:0;font-size:11px;color:#b08d57;letter-spacing:0.25em;text-transform:uppercase;font-weight:600;">
                Unzip Africa Safaris
              </p>
              <h1 style="margin:8px 0 0 0;font-family:Georgia,'Times New Roman',serif;font-size:24px;font-weight:500;color:#1a1a1a;letter-spacing:-0.01em;">
                ${esc(title)}
              </h1>
              <p style="margin:6px 0 0 0;font-size:13px;color:#5a5a55;">
                ${esc(subtitle)}
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:24px 28px;">
              ${bodyHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 28px;background:#1a2b22;color:#f4efe6;border-top:1px solid #e6e0d4;">
              <p style="margin:0 0 8px 0;font-size:12px;color:#b08d57;letter-spacing:0.2em;text-transform:uppercase;font-weight:600;">
                Unzip Africa Safaris
              </p>
              <p style="margin:0 0 6px 0;font-size:13px;color:#f4efe6;line-height:1.5;">
                Bespoke safaris across East &amp; Southern Africa — designed in silence, delivered in wonder.
              </p>
              <p style="margin:8px 0 0 0;font-size:12px;color:#c8c4b8;line-height:1.5;">
                Reply to this email or write to
                <a href="mailto:info@unzipafrica.com" style="color:#b08d57;text-decoration:none;">info@unzipafrica.com</a><br>
                <a href="${esc(siteUrl())}" style="color:#b08d57;text-decoration:none;">${esc(siteUrl().replace(/^https?:\/\//, ""))}</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Section header inside the body
function sectionHeading(text: string): string {
  return `<h2 style="margin:24px 0 12px 0;font-family:Georgia,'Times New Roman',serif;font-size:16px;font-weight:600;color:#1a2b22;border-bottom:1px solid #e6e0d4;padding-bottom:6px;">
    ${esc(text)}
  </h2>`;
}

// Field table wrapper
function fieldTable(rows: string): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="width:100%;">
    ${rows}
  </table>`;
}

// =====================================================================
// 1. Tour booking — business notification (HTML)
// =====================================================================
export function businessNotificationTourHtml(b: TourBookingData): string {
  const body = `
    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      A new tour booking request was just submitted on the website.
      Full details are below — reply directly to this email to reach the customer.
    </p>

    ${sectionHeading("Booking Reference")}
    <p style="margin:0 0 16px 0;font-family:Georgia,serif;font-size:18px;font-weight:600;color:#b08d57;">
      ${esc(b.id)}
    </p>

    ${sectionHeading("Trip Details")}
    ${fieldTable(
      row("Tour", esc(b.tripName)) +
        row("Tour ID", esc(b.tourId || "—")) +
        row("Destination", esc(b.destination || "—")) +
        row("Duration", esc(b.duration || "—")) +
        row("Status", esc(b.status)),
    )}

    ${sectionHeading("Customer")}
    ${fieldTable(
      row("Name", esc(b.customerName)) +
        row("Email", `<a href="mailto:${esc(b.customerEmail)}" style="color:#b08d57;text-decoration:none;">${esc(b.customerEmail)}</a>`) +
        row("Phone", esc(b.customerPhone)),
    )}

    ${sectionHeading("Travellers &amp; Pricing")}
    ${fieldTable(
      row("Travellers", esc(b.numTravellers)) +
        row("Price per person", formatMoney(b.pricePerPerson)) +
        row("Total", formatMoney(b.totalPrice)),
    )}

    ${b.notes ? `
    ${sectionHeading("Special Requests / Notes")}
    <p style="margin:0;font-size:14px;line-height:1.6;color:#1a1a1a;background:#f4efe6;padding:12px 14px;border-left:3px solid #b08d57;">
      ${esc(b.notes).replace(/\n/g, "<br>")}
    </p>` : ""}

    ${sectionHeading("Submission")}
    ${fieldTable(row("Submitted at", formatDateTime(b.createdAt)))}
  `;
  return emailLayout(
    "New Tour Booking Request",
    `${b.tripName} • ${b.numTravellers} traveller${b.numTravellers === 1 ? "" : "s"}`,
    body,
  );
}

export function businessNotificationTourText(b: TourBookingData): string {
  return `NEW TOUR BOOKING REQUEST
========================

Booking Reference: ${b.id}
Status: ${b.status}
Submitted: ${formatDateTime(b.createdAt)}

TRIP DETAILS
------------
Tour: ${b.tripName}
Tour ID: ${b.tourId || "—"}
Destination: ${b.destination || "—"}
Duration: ${b.duration || "—"}

CUSTOMER
--------
Name: ${b.customerName}
Email: ${b.customerEmail}
Phone: ${b.customerPhone}

TRAVELLERS & PRICING
--------------------
Travellers: ${b.numTravellers}
Price per person: ${formatMoney(b.pricePerPerson)}
Total: ${formatMoney(b.totalPrice)}

${b.notes ? `NOTES\n-----\n${b.notes}\n\n` : ""}Reply directly to this email to reach the customer, or contact info@unzipafrica.com.

— Unzip Africa Safaris
${siteUrl()}
`;
}

// =====================================================================
// 2. Tour booking — customer confirmation (HTML)
// =====================================================================
export function customerConfirmationTourHtml(b: TourBookingData): string {
  const body = `
    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      Dear ${esc(b.customerName)},
    </p>
    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      Thank you for choosing Unzip Africa Safaris. We have received your
      booking request for <strong>${esc(b.tripName)}</strong> and our team
      is reviewing the details.
    </p>

    ${sectionHeading("Your Booking Reference")}
    <p style="margin:0 0 16px 0;font-family:Georgia,serif;font-size:18px;font-weight:600;color:#b08d57;">
      ${esc(b.id)}
    </p>
    <p style="margin:0 0 16px 0;font-size:13px;color:#5a5a55;">
      Please keep this reference handy — you'll need it if you write to us
      about this booking.
    </p>

    ${sectionHeading("Trip Summary")}
    ${fieldTable(
      row("Tour", esc(b.tripName)) +
        row("Destination", esc(b.destination || "—")) +
        row("Duration", esc(b.duration || "—")) +
        row("Travellers", esc(b.numTravellers)) +
        row("Estimated total", formatMoney(b.totalPrice)),
    )}

    ${sectionHeading("What Happens Next")}
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      Our safari specialists personally review every booking request.
      Within <strong>24 hours</strong> you will receive a personalised
      follow-up from our team confirming availability, finalising your
      itinerary, and walking you through the next steps.
    </p>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      This email confirms that <strong>your request has been received</strong> —
      it is not a final booking confirmation. Availability, pricing, and
      itinerary details are confirmed once our team has reviewed your
      request and you have received a written confirmation from us.
    </p>

    ${sectionHeading("Questions?")}
    <p style="margin:0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      Reply to this email or write to
      <a href="mailto:info@unzipafrica.com" style="color:#b08d57;text-decoration:none;">info@unzipafrica.com</a>
      and we'll be glad to help.
    </p>
  `;
  return emailLayout(
    "We've Received Your Tour Booking",
    `${b.tripName} • ${b.numTravellers} traveller${b.numTravellers === 1 ? "" : "s"}`,
    body,
  );
}

export function customerConfirmationTourText(b: TourBookingData): string {
  return `Dear ${b.customerName},

Thank you for choosing Unzip Africa Safaris. We have received your booking request for "${b.tripName}" and our team is reviewing the details.

YOUR BOOKING REFERENCE: ${b.id}

Please keep this reference handy — you'll need it if you write to us about this booking.

TRIP SUMMARY
------------
Tour: ${b.tripName}
Destination: ${b.destination || "—"}
Duration: ${b.duration || "—"}
Travellers: ${b.numTravellers}
Estimated total: ${formatMoney(b.totalPrice)}

WHAT HAPPENS NEXT
-----------------
Our safari specialists personally review every booking request. Within 24 hours you will receive a personalised follow-up from our team confirming availability, finalising your itinerary, and walking you through the next steps.

This email confirms that your request has been received — it is not a final booking confirmation. Availability, pricing, and itinerary details are confirmed once our team has reviewed your request and you have received a written confirmation from us.

Questions? Reply to this email or write to info@unzipafrica.com.

— Unzip Africa Safaris
${siteUrl()}
`;
}

// =====================================================================
// 3. Scheduled trip booking — business notification (HTML)
// =====================================================================
export function businessNotificationScheduledTripHtml(
  b: ScheduledTripBookingData,
): string {
  const body = `
    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      A new scheduled trip booking request was just submitted on the website.
      Reply directly to this email to reach the customer.
    </p>

    ${sectionHeading("Booking Reference")}
    <p style="margin:0 0 16px 0;font-family:Georgia,serif;font-size:18px;font-weight:600;color:#b08d57;">
      ${esc(b.id)}
    </p>

    ${sectionHeading("Trip Details")}
    ${fieldTable(
      row("Scheduled trip", esc(b.tripName)) +
        row("Trip ID", esc(b.scheduledTripId || "—")) +
        row("Destination", esc(b.destination || "—")) +
        row("Departure", formatDate(b.startDate)) +
        row("Return", formatDate(b.endDate)) +
        row("Duration", esc(b.duration || "—")) +
        row("Status", esc(b.status)),
    )}

    ${sectionHeading("Customer")}
    ${fieldTable(
      row("Name", esc(b.customerName)) +
        row("Email", `<a href="mailto:${esc(b.customerEmail)}" style="color:#b08d57;text-decoration:none;">${esc(b.customerEmail)}</a>`) +
        row("Phone", esc(b.customerPhone)),
    )}

    ${sectionHeading("Travellers &amp; Pricing")}
    ${fieldTable(
      row("Travellers", esc(b.numTravellers)) +
        row("Price per traveller", formatMoney(b.pricePerPerson)) +
        row("Total", formatMoney(b.totalPrice)),
    )}

    ${b.notes ? `
    ${sectionHeading("Special Requests / Notes")}
    <p style="margin:0;font-size:14px;line-height:1.6;color:#1a1a1a;background:#f4efe6;padding:12px 14px;border-left:3px solid #b08d57;">
      ${esc(b.notes).replace(/\n/g, "<br>")}
    </p>` : ""}

    ${sectionHeading("Submission")}
    ${fieldTable(row("Submitted at", formatDateTime(b.createdAt)))}
  `;
  return emailLayout(
    "New Scheduled Trip Booking Request",
    `${b.tripName} • departs ${formatDate(b.startDate)}`,
    body,
  );
}

export function businessNotificationScheduledTripText(
  b: ScheduledTripBookingData,
): string {
  return `NEW SCHEDULED TRIP BOOKING REQUEST
==================================

Booking Reference: ${b.id}
Status: ${b.status}
Submitted: ${formatDateTime(b.createdAt)}

TRIP DETAILS
------------
Scheduled trip: ${b.tripName}
Trip ID: ${b.scheduledTripId || "—"}
Destination: ${b.destination || "—"}
Departure: ${formatDate(b.startDate)}
Return: ${formatDate(b.endDate)}
Duration: ${b.duration || "—"}

CUSTOMER
--------
Name: ${b.customerName}
Email: ${b.customerEmail}
Phone: ${b.customerPhone}

TRAVELLERS & PRICING
--------------------
Travellers: ${b.numTravellers}
Price per traveller: ${formatMoney(b.pricePerPerson)}
Total: ${formatMoney(b.totalPrice)}

${b.notes ? `NOTES\n-----\n${b.notes}\n\n` : ""}Reply directly to this email to reach the customer, or contact info@unzipafrica.com.

— Unzip Africa Safaris
${siteUrl()}
`;
}

// =====================================================================
// 4. Scheduled trip booking — customer confirmation (HTML)
// =====================================================================
export function customerConfirmationScheduledTripHtml(
  b: ScheduledTripBookingData,
): string {
  const body = `
    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      Dear ${esc(b.customerName)},
    </p>
    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      Thank you for choosing Unzip Africa Safaris. We have received your
      booking request for the scheduled departure of
      <strong>${esc(b.tripName)}</strong> on
      <strong>${formatDate(b.startDate)}</strong>.
    </p>

    ${sectionHeading("Your Booking Reference")}
    <p style="margin:0 0 16px 0;font-family:Georgia,serif;font-size:18px;font-weight:600;color:#b08d57;">
      ${esc(b.id)}
    </p>
    <p style="margin:0 0 16px 0;font-size:13px;color:#5a5a55;">
      Please keep this reference handy — you'll need it if you write to us
      about this booking.
    </p>

    ${sectionHeading("Trip Summary")}
    ${fieldTable(
      row("Scheduled trip", esc(b.tripName)) +
        row("Destination", esc(b.destination || "—")) +
        row("Departure date", formatDate(b.startDate)) +
        row("Return date", formatDate(b.endDate)) +
        row("Duration", esc(b.duration || "—")) +
        row("Travellers", esc(b.numTravellers)) +
        row("Estimated total", formatMoney(b.totalPrice)),
    )}

    ${sectionHeading("What Happens Next")}
    <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      Our safari specialists personally review every scheduled-trip
      booking request. Within <strong>24 hours</strong> you will receive
      a personalised follow-up from us confirming availability, the
      departure status, and next steps including any deposit or payment
      instructions.
    </p>
    <p style="margin:0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      This email confirms that <strong>your request has been received</strong> —
      it is not a final booking confirmation and your place on the
      departure is not yet held. Availability is confirmed once our team
      has reviewed your request and you have received written confirmation
      from us.
    </p>

    ${sectionHeading("Questions?")}
    <p style="margin:0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      Reply to this email or write to
      <a href="mailto:info@unzipafrica.com" style="color:#b08d57;text-decoration:none;">info@unzipafrica.com</a>
      and we'll be glad to help.
    </p>
  `;
  return emailLayout(
    "Your Scheduled Trip Booking Request",
    `${b.tripName} • departs ${formatDate(b.startDate)}`,
    body,
  );
}

export function customerConfirmationScheduledTripText(
  b: ScheduledTripBookingData,
): string {
  return `Dear ${b.customerName},

Thank you for choosing Unzip Africa Safaris. We have received your booking request for the scheduled departure of "${b.tripName}" on ${formatDate(b.startDate)}.

YOUR BOOKING REFERENCE: ${b.id}

Please keep this reference handy — you'll need it if you write to us about this booking.

TRIP SUMMARY
------------
Scheduled trip: ${b.tripName}
Destination: ${b.destination || "—"}
Departure date: ${formatDate(b.startDate)}
Return date: ${formatDate(b.endDate)}
Duration: ${b.duration || "—"}
Travellers: ${b.numTravellers}
Estimated total: ${formatMoney(b.totalPrice)}

WHAT HAPPENS NEXT
-----------------
Our safari specialists personally review every scheduled-trip booking request. Within 24 hours you will receive a personalised follow-up from us confirming availability, the departure status, and next steps including any deposit or payment instructions.

This email confirms that your request has been received — it is not a final booking confirmation and your place on the departure is not yet held. Availability is confirmed once our team has reviewed your request and you have received written confirmation from us.

Questions? Reply to this email or write to info@unzipafrica.com.

— Unzip Africa Safaris
${siteUrl()}
`;
}

// =====================================================================
// 5. General inquiry — business notification (HTML)
// =====================================================================
export function businessNotificationInquiryHtml(i: InquiryData): string {
  const body = `
    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      A new inquiry was just submitted via the website contact form.
      ${isValidEmailStr(i.email) ? "Reply directly to this email to reach the customer." : ""}
    </p>

    ${sectionHeading("Inquiry Reference")}
    <p style="margin:0 0 16px 0;font-family:Georgia,serif;font-size:18px;font-weight:600;color:#b08d57;">
      ${esc(i.id)}
    </p>

    ${sectionHeading("Customer")}
    ${fieldTable(
      row("Name", esc(i.name)) +
        row("Email", i.email
          ? `<a href="mailto:${esc(i.email)}" style="color:#b08d57;text-decoration:none;">${esc(i.email)}</a>`
          : "—") +
        row("Phone", esc(i.phone || "—")),
    )}

    ${sectionHeading("Trip Preferences")}
    ${fieldTable(
      row("Destinations", formatList(i.destinations)) +
        row("Duration", esc(i.duration || "—")) +
        row("Travellers", esc(i.travelers || "—")) +
        row("Dates", esc(i.dates || "—")) +
        row("Budget", esc(i.budget || "—")) +
        row("Interests", formatList(i.interests)),
    )}

    ${sectionHeading("Message")}
    <p style="margin:0;font-size:14px;line-height:1.6;color:#1a1a1a;background:#f4efe6;padding:14px 16px;border-left:3px solid #b08d57;">
      ${esc(i.message || "—").replace(/\n/g, "<br>")}
    </p>

    ${sectionHeading("Submission")}
    ${fieldTable(row("Submitted at", formatDateTime(i.createdAt)))}
  `;
  return emailLayout(
    "New Website Inquiry",
    `From ${i.name}${i.email ? ` <${i.email}>` : ""}`,
    body,
  );
}

export function businessNotificationInquiryText(i: InquiryData): string {
  return `NEW WEBSITE INQUIRY
===================

Inquiry Reference: ${i.id}
Submitted: ${formatDateTime(i.createdAt)}

CUSTOMER
--------
Name: ${i.name}
Email: ${i.email || "—"}
Phone: ${i.phone || "—"}

TRIP PREFERENCES
----------------
Destinations: ${formatListPlain(i.destinations)}
Duration: ${i.duration || "—"}
Travellers: ${i.travelers || "—"}
Dates: ${i.dates || "—"}
Budget: ${i.budget || "—"}
Interests: ${formatListPlain(i.interests)}

MESSAGE
-------
${i.message || "—"}

${isValidEmailStr(i.email) ? "Reply directly to this email to reach the customer." : "No customer email was supplied — reply via the dashboard if needed."}

— Unzip Africa Safaris
${siteUrl()}
`;
}

// =====================================================================
// 6. General inquiry — customer acknowledgment (HTML)
// =====================================================================
export function customerAcknowledgmentInquiryHtml(i: InquiryData): string {
  const body = `
    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      Dear ${esc(i.name)},
    </p>
    <p style="margin:0 0 16px 0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      Thank you for contacting Unzip Africa Safaris. We have received your
      inquiry and our team will review your message and respond as
      appropriate within <strong>24 hours</strong>.
    </p>

    ${sectionHeading("Your Inquiry Reference")}
    <p style="margin:0 0 16px 0;font-family:Georgia,serif;font-size:18px;font-weight:600;color:#b08d57;">
      ${esc(i.id)}
    </p>

    ${sectionHeading("What You Asked About")}
    ${fieldTable(
      row("Destinations", formatList(i.destinations)) +
        row("Duration", esc(i.duration || "—")) +
        row("Travellers", esc(i.travelers || "—")) +
        row("Budget", esc(i.budget || "—")),
    )}

    ${sectionHeading("Questions?")}
    <p style="margin:0;font-size:14px;line-height:1.6;color:#1a1a1a;">
      Reply to this email or write to
      <a href="mailto:info@unzipafrica.com" style="color:#b08d57;text-decoration:none;">info@unzipafrica.com</a>
      and we'll be glad to help.
    </p>
  `;
  return emailLayout(
    "Thank You for Contacting Unzip Africa",
    `We've received your inquiry`,
    body,
  );
}

export function customerAcknowledgmentInquiryText(i: InquiryData): string {
  return `Dear ${i.name},

Thank you for contacting Unzip Africa Safaris. We have received your inquiry and our team will review your message and respond as appropriate within 24 hours.

YOUR INQUIRY REFERENCE: ${i.id}

WHAT YOU ASKED ABOUT
--------------------
Destinations: ${formatListPlain(i.destinations)}
Duration: ${i.duration || "—"}
Travellers: ${i.travelers || "—"}
Budget: ${i.budget || "—"}

Questions? Reply to this email or write to info@unzipafrica.com.

— Unzip Africa Safaris
${siteUrl()}
`;
}

// --- Small internal helpers used only by the inquiry templates ----

function isValidEmailStr(s: string | null | undefined): boolean {
  if (!s) return false;
  return /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@[a-z0-9-]{1,253}(\.[a-z0-9-]{1,253})+$/i.test(
    String(s).trim(),
  );
}

// Plain-text version of formatList (no HTML escaping).
function formatListPlain(v: string[] | string | null | undefined): string {
  if (!v) return "—";
  if (Array.isArray(v)) {
    return v.length > 0 ? v.join(", ") : "—";
  }
  if (typeof v === "string") {
    const trimmed = v.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const arr = JSON.parse(trimmed);
        if (Array.isArray(arr)) {
          return arr.length > 0 ? arr.join(", ") : "—";
        }
      } catch {
        // fall through
      }
    }
    return trimmed || "—";
  }
  return "—";
}
