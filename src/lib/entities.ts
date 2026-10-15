// =====================================================================
// Entity Registry — maps API ?type= values to MySQL tables, columns,
// JSON columns, and optional nested-child fields (stored inline as JSON).
// ---------------------------------------------------------------------
// This is the single source of truth for the CRUD API. Add a new entity
// type by appending an entry here — no code changes needed in the
// route handlers.
// =====================================================================

export type EntityDef = {
  table: string;
  // Columns the API is allowed to read/write.
  // `id` is always included implicitly.
  columns: string[];
  // Columns stored as JSON in MySQL — stringified on write, parsed on read.
  jsonColumns: string[];
  // Fields in the request body that aren't real columns but should be
  // stored as JSON inside a single inline column. e.g. { field: "days", column: "days" }
  // means: take the `days` field from the request body and store it as JSON
  // in the `days` column.
  inlineChildren?: { field: string; column: string }[];
  // Columns that should auto-default on INSERT (so we don't write them).
  // e.g. ["createdAt"] — MySQL defaults these via DEFAULT CURRENT_TIMESTAMP.
  autoOnInsert?: string[];
  // Columns that should auto-update on every write (updatedAt = CURRENT_TIMESTAMP).
  autoOnUpdate?: string[];
  // Column to ORDER BY in GET /api/crud?type=... — defaults to "createdAt".
  // Some tables (e.g. Testimonial) don't have createdAt — they use "date" instead.
  orderColumn?: string;
};

// Master registry. Keyed by the ?type= query param value.
export const ENTITIES: Record<string, EntityDef> = {
  tours: {
    table: "TourPackage",
    columns: [
      "name", "subtitle", "duration", "durationDays", "durationNights",
      "price", "priceFrom", "priceOriginal", "highlights", "image",
      "galleryImages", "destination", "activities", "tripType",
      "accommodationLevel", "nationalPark", "featured", "minAge",
      "accommodationIds",
    ],
    jsonColumns: ["highlights", "galleryImages", "activities", "accommodationIds"],
    // `days`, `inclusions`, `exclusions`, `mapEmbed` are extra fields on the
    // TourPackage type that don't map to columns in the original migration.
    // We ALTER the table to add them and store them inline.
    inlineChildren: [
      { field: "days", column: "days" },
      { field: "inclusions", column: "inclusions" },
      { field: "exclusions", column: "exclusions" },
      { field: "mapEmbed", column: "mapEmbed" },
    ],
    autoOnInsert: ["createdAt", "updatedAt"],
    autoOnUpdate: ["updatedAt"],
  },

  accommodations: {
    table: "Accommodation",
    columns: ["name", "location", "type", "description", "image", "galleryImages", "features", "pricePerNight"],
    jsonColumns: ["galleryImages", "features"],
    inlineChildren: [],
    autoOnInsert: ["createdAt", "updatedAt"],
    autoOnUpdate: ["updatedAt"],
  },

  "scheduled-trips": {
    table: "ScheduledTrip",
    columns: [
      "name", "destination", "startDate", "endDate", "durationDays",
      "priceFrom", "priceOriginal", "image", "galleryImages", "description",
      "highlights", "inclusions", "exclusions", "groupSize",
      "spotsLeft", "accommodationLevel",
    ],
    jsonColumns: ["galleryImages", "highlights", "inclusions", "exclusions"],
    inlineChildren: [
      { field: "stops", column: "stops" },
      { field: "mapEmbed", column: "mapEmbed" },
    ],
    autoOnInsert: ["createdAt", "updatedAt"],
    autoOnUpdate: ["updatedAt"],
  },

  destinations: {
    table: "Destination",
    columns: ["name", "country", "tagline", "description", "image", "imagePortrait", "days", "price"],
    jsonColumns: [],
    inlineChildren: [],
    autoOnInsert: ["createdAt", "updatedAt"],
    autoOnUpdate: ["updatedAt"],
  },

  countries: {
    table: "Country",
    columns: ["name", "tagline", "description", "image", "imagePortrait"],
    jsonColumns: [],
    inlineChildren: [],
    autoOnInsert: ["createdAt", "updatedAt"],
    autoOnUpdate: ["updatedAt"],
  },

  parks: {
    table: "Park",
    columns: ["name", "country", "tagline", "description", "image", "imagePortrait", "days", "price"],
    jsonColumns: [],
    inlineChildren: [],
    autoOnInsert: ["createdAt", "updatedAt"],
    autoOnUpdate: ["updatedAt"],
  },

  testimonials: {
    table: "Testimonial",
    columns: ["name", "role", "avatar", "content", "published", "date"],
    jsonColumns: [],
    autoOnInsert: [],
    autoOnUpdate: [],
    orderColumn: "date",
  },

  "blog-posts": {
    table: "BlogPost",
    columns: [
      "title", "excerpt", "body", "coverImage", "author", "authorRole",
      "authorAvatar", "publishedDate", "tags", "category", "readTimeMins",
      "published", "featured",
    ],
    jsonColumns: ["tags"],
    autoOnInsert: ["createdAt", "updatedAt"],
    autoOnUpdate: ["updatedAt"],
  },

  bookings: {
    table: "Booking",
    columns: [
      "type", "tourId", "scheduledTripId", "tripName", "destination",
      "startDate", "endDate", "duration", "pricePerPerson", "numTravellers",
      "totalPrice", "customerName", "customerEmail", "customerPhone",
      "notes", "status",
    ],
    jsonColumns: [],
    autoOnInsert: ["createdAt", "updatedAt"],
    autoOnUpdate: ["updatedAt"],
  },

  quotes: {
    table: "QuoteRequest",
    columns: ["name", "email", "phone", "travelers", "dates", "destinations", "budget", "message", "status"],
    jsonColumns: ["destinations"],
    autoOnInsert: ["createdAt", "updatedAt"],
    autoOnUpdate: ["updatedAt"],
  },
};

// Helper — get a def or throw.
export function getEntityDef(type: string): EntityDef {
  const def = ENTITIES[type];
  if (!def) throw new Error(`Unknown entity type: ${type}`);
  return def;
}

// Helper — backtick an identifier for MySQL (prevents keyword collisions).
export function tick(name: string): string {
  return "`" + name.replace(/`/g, "``") + "`";
}

// Map a JavaScript value to a MySQL-compatible value for INSERT/UPDATE.
// - undefined → null (so MySQL uses DEFAULT)
// - arrays / objects → JSON.stringify (for JSON columns)
// - everything else passes through
export function toSqlValue(value: unknown, isJsonColumn: boolean): unknown {
  if (value === undefined) return null;
  if (value === null) return null;
  if (isJsonColumn) {
    // JSON columns accept either a string or an object — mysql2 handles both,
    // but stringifying explicitly avoids edge cases with Dates inside arrays.
    if (typeof value === "string") return value;
    return JSON.stringify(value);
  }
  // Booleans → 0/1 (MySQL BOOLEAN is TINYINT(1))
  if (typeof value === "boolean") return value ? 1 : 0;
  // Numbers/strings pass through.
  return value;
}

// Helper — safely convert a Date to ISO string, returning null if invalid.
function safeToISOString(v: unknown): string | null {
  if (v instanceof Date) {
    try {
      const iso = v.toISOString();
      return iso;
    } catch {
      // Date is invalid (e.g., "0000-00-00 00:00:00" from MySQL)
      return null;
    }
  }
  if (typeof v === "string") return v;
  return null;
}

// Map a row returned by mysql2 → a JSON-safe object the API can return.
// - JSON columns are parsed (or returned as-is if mysql2 already parsed)
// - Dates are converted to ISO strings (with invalid Date protection)
// - Buffer/Decimal are converted to numbers
export function fromSqlRow(row: Record<string, unknown>, def: EntityDef): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  out.id = row.id;

  for (const col of def.columns) {
    let v = row[col];
    if (v === undefined) continue;
    if (def.jsonColumns.includes(col)) {
      // mysql2 with `json` flag returns JSON columns as already-parsed objects.
      // If it's a string, parse it. If null, leave null.
      if (v === null) {
        out[col] = null;
      } else if (typeof v === "string") {
        try { out[col] = JSON.parse(v); } catch { out[col] = v; }
      } else {
        // Already an object/array (mysql2 parsed it)
        out[col] = v;
      }
    } else if (v instanceof Date) {
      out[col] = safeToISOString(v);
    } else if (Buffer.isBuffer(v)) {
      // DECIMAL sometimes comes back as a Buffer/string; coerce to number.
      const n = Number(v.toString("utf8"));
      out[col] = Number.isFinite(n) ? n : v.toString("utf8");
    } else if (typeof v === "object" && v !== null && "toString" in v) {
      // Prisma Decimal-like — coerce to number
      const s = String(v);
      const n = Number(s);
      out[col] = Number.isFinite(n) ? n : s;
    } else {
      out[col] = v;
    }
  }

  // Inline children (days, stops, gameParks, etc.)
  if (def.inlineChildren) {
    for (const child of def.inlineChildren) {
      let v = row[child.column];
      if (v === undefined) {
        // Field absent in DB row — leave undefined so caller uses defaults
        continue;
      }
      if (v === null) {
        out[child.field] = null;
      } else if (typeof v === "string") {
        try { out[child.field] = JSON.parse(v); } catch { out[child.field] = v; }
      } else if (v instanceof Date) {
        out[child.field] = safeToISOString(v);
      } else {
        out[child.field] = v;
      }
    }
  }

  // createdAt / updatedAt → ISO strings (with invalid Date protection)
  for (const ts of ["createdAt", "updatedAt"]) {
    const v = row[ts];
    if (v !== undefined && v !== null) {
      out[ts] = safeToISOString(v);
    }
  }

  return out;
}
