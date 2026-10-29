"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  tourPackages as seedTours,
  accommodations as seedAccommodations,
  scheduledTrips as seedScheduledTrips,
  testimonials as seedTestimonials,
  destinations as seedDestinations,
  parks as seedParks,
  blogPosts as seedBlogPosts,
  type TourPackage,
  type Accommodation,
  type ScheduledTrip,
  type Testimonial,
  type Destination,
  type BlogPost,
} from "@/lib/content";

/* ============================================================
 * Booking — a customer reservation on a tour or scheduled trip
 * ============================================================ */
export type BookingStatus = "pending" | "confirmed" | "cancelled";

export type Booking = {
  id: string;
  type: "tour" | "scheduled-trip";
  tripId: string;
  tripName: string;
  destination: string;
  startDate?: string;
  endDate?: string;
  duration: string;
  pricePerPerson: number;
  numTravellers: number;
  totalPrice: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  status: BookingStatus;
  createdAt: string;
  notes?: string;
};

/* ============================================================
 * QuoteRequest — submitted via the Quote page
 * ============================================================ */
export type QuoteRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  destination: string;
  duration: string;
  interests: string[];
  budget: string;
  travellers: string;
  startDate?: string;
  notes?: string;
  status: "new" | "in-review" | "quoted" | "closed";
  createdAt: string;
};

/* ============================================================
 * Module-level state
 * ============================================================ */
type State = {
  tours: TourPackage[];
  accommodations: Accommodation[];
  scheduledTrips: ScheduledTrip[];
  testimonials: Testimonial[];
  destinations: Destination[];
  countries: Destination[];
  parks: Destination[];
  blogPosts: BlogPost[];
  bookings: Booking[];
  tourBookings: Booking[];
  scheduledTripBookings: Booking[];
  quotes: QuoteRequest[];
  formInquiries: QuoteRequest[];
};

let state: State = {
  tours: [...seedTours],
  accommodations: [...seedAccommodations],
  scheduledTrips: [...seedScheduledTrips],
  testimonials: [...seedTestimonials],
  destinations: [...seedDestinations],
  countries: [...seedDestinations],
  parks: [...seedParks],
  blogPosts: [...seedBlogPosts],
  bookings: [],
  tourBookings: [],
  scheduledTripBookings: [],
  quotes: [],
  formInquiries: [],
};

// On page refresh, the JS module re-initializes and `state` resets to seed
// data. To preserve the admin's changes across refreshes, we persist the
// full state to localStorage on every emit() and restore it on module load.
const STORAGE_KEY = "unzip_africa_store";

function loadFromStorage(): Partial<State> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch {
    return null;
  }
}

function saveToStorage() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage might be full or unavailable — ignore
  }
}

// Restore from localStorage on module load (overrides seed data)
const stored = loadFromStorage();
if (stored) {
  state = {
    tours: stored.tours ?? [...seedTours],
    accommodations: stored.accommodations ?? [...seedAccommodations],
    scheduledTrips: stored.scheduledTrips ?? [...seedScheduledTrips],
    testimonials: stored.testimonials ?? [...seedTestimonials],
    destinations: stored.destinations ?? [...seedDestinations],
    countries: stored.countries ?? [...seedDestinations],
    parks: stored.parks ?? [...seedParks],
    blogPosts: stored.blogPosts ?? [...seedBlogPosts],
    bookings: stored.bookings ?? [],
    tourBookings: stored.tourBookings ?? [],
    scheduledTripBookings: stored.scheduledTripBookings ?? [],
    quotes: stored.quotes ?? [],
    formInquiries: stored.formInquiries ?? [],
  };
}

const SERVER_SNAPSHOT: State = {
  tours: [...seedTours],
  accommodations: [...seedAccommodations],
  scheduledTrips: [...seedScheduledTrips],
  testimonials: [...seedTestimonials],
  destinations: [...seedDestinations],
  countries: [...seedDestinations],
  parks: [...seedParks],
  blogPosts: [...seedBlogPosts],
  bookings: [],
  tourBookings: [],
  scheduledTripBookings: [],
  quotes: [],
  formInquiries: [],
};

/* ============================================================
 * API helper — persists records to the Hostinger MySQL database
 * via the generic CRUD API at /api/crud
 * ============================================================ */

// Map store keys to API ?type= query params
const API_TYPE_MAP: Record<string, string> = {
  tours: "tours",
  accommodations: "accommodations",
  scheduledTrips: "scheduled-trips",
  destinations: "destinations",
  countries: "countries",
  parks: "parks",
  testimonials: "testimonials",
  blogPosts: "blog-posts",
  bookings: "bookings",
  tourBookings: "tour-bookings",
  scheduledTripBookings: "scheduled-trip-bookings",
  quotes: "quotes",
  formInquiries: "form-inquiries",
};

// Track IDs of items being POSTed to the DB (optimistic creates).
// These are preserved during syncFromDatabase so they don't get wiped
// before the POST completes.
const pendingCreates = new Set<string>();

// Fetch all records of a type from the database.
// The DB is the source of truth — REPLACES local state with DB data.
// EXCEPTION: items in `pendingCreates` (just POSTed, response not yet
// received) are preserved so the user doesn't see their new tour
// disappear during the 30-second auto-refresh.
async function syncFromDatabase(key: keyof State, type: string) {
  try {
    const res = await fetch(`/api/crud?type=${type}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data)) {
      // Keep optimistic items (just created, POST in flight)
      const localItems = state[key] as Array<{ id: string }>;
      const optimisticItems = localItems.filter((item: { id: string }) =>
        pendingCreates.has(item.id)
      );
      // DB data is the source of truth + optimistic items preserved
      state = { ...state, [key]: [...data, ...optimisticItems] };
      emit();
    }
  } catch {
    // API unavailable — keep using existing local data (graceful fallback)
  }
}

// Normalize date fields before sending to the API.
// MySQL TIMESTAMP columns expect either an ISO datetime string or a JS Date
// object — bare "2026-09-12" can cause silent failures depending on the
// driver/timezone settings. Convert to a full ISO datetime string.
function normalizeDatesForApi(record: unknown): unknown {
  if (!record || typeof record !== "object") return record;
  const out: Record<string, unknown> = { ...(record as Record<string, unknown>) };
  // BlogPost.publishedDate — store as ISO datetime
  if (typeof out.publishedDate === "string") {
    const d = new Date(out.publishedDate);
    if (!Number.isNaN(d.getTime())) {
      out.publishedDate = d.toISOString();
    }
  }
  // Booking date columns (startDate, endDate) — also ISO datetime
  if (typeof out.startDate === "string" && out.startDate.length > 0) {
    const d = new Date(out.startDate);
    if (!Number.isNaN(d.getTime())) {
      out.startDate = d.toISOString();
    }
  }
  if (typeof out.endDate === "string" && out.endDate.length > 0) {
    const d = new Date(out.endDate);
    if (!Number.isNaN(d.getTime())) {
      out.endDate = d.toISOString();
    }
  }
  return out;
}

// Persist a create to the database.
// On failure, surfaces an error toast so the admin knows the save didn't go
// through — instead of silently swallowing the failure (which previously
// caused the "Save Changes button doesn't publish anything" bug).
function apiCreate(type: string, record: unknown, revertKey: keyof State, recordId: string) {
  // Track this ID as a pending create so syncFromDatabase doesn't remove it
  pendingCreates.add(recordId);
  const payload = normalizeDatesForApi(record);
  fetch(`/api/crud?type=${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (r) => {
      if (!r.ok) {
        // Surface server error to the user — no more silent failures.
        let msg = `HTTP ${r.status}`;
        try {
          const errBody = await r.json();
          if (errBody?.message) msg = errBody.message;
          else if (errBody?.error) msg = errBody.error;
        } catch { /* not JSON */ }
        throw new Error(msg);
      }
      return r.json();
    })
    .then((saved) => {
      // POST completed — remove from pending so future syncs can manage it
      pendingCreates.delete(recordId);
      if (saved && saved.id && saved.id !== recordId) {
        // Replace optimistic ID with DB-generated ID
        pendingCreates.delete(recordId);
        pendingCreates.add(saved.id);
        const arr = state[revertKey] as unknown[];
        const updated = arr.map((item: any) =>
          item.id === recordId ? { ...item, id: saved.id } : item
        );
        state = { ...state, [revertKey]: updated };
        emit();
        // Give the ID change a moment to settle before removing from pending
        setTimeout(() => pendingCreates.delete(saved.id), 5000);
      }
    })
    .catch((err: unknown) => {
      // API failed — surface a clear error to the admin instead of the
      // previous silent swallow. The optimistic update is reverted so the
      // dashboard doesn't lie about the state of the database.
      const msg = err instanceof Error ? err.message : String(err);
      // Avoid hard-crashing if the toast lib isn't loaded yet (SSR).
      try {
        // Lazy import to keep this module SSR-safe.
        import("sonner").then(({ toast }) => {
          toast.error(`Failed to save ${type}: ${msg}`);
        }).catch(() => {});
      } catch { /* ignore */ }
      // Revert the optimistic item so the user sees the save truly failed.
      const arr = state[revertKey] as Array<{ id: string }> | undefined;
      if (Array.isArray(arr)) {
        const reverted = arr.filter((item) => item.id !== recordId);
        state = { ...state, [revertKey]: reverted };
        emit();
      }
      // API failed — remove from pending after 60 seconds so it gets
      // cleaned up by the next sync (the item won't be in the DB)
      setTimeout(() => pendingCreates.delete(recordId), 60000);
    });
}

// Persist an update to the database.
// Surfaces errors via toast so the admin knows the PUT failed.
function apiUpdate(type: string, id: string, patch: unknown) {
  const payload = normalizeDatesForApi(patch);
  fetch(`/api/crud/${id}?type=${type}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  })
    .then(async (r) => {
      if (!r.ok) {
        let msg = `HTTP ${r.status}`;
        try {
          const errBody = await r.json();
          if (errBody?.message) msg = errBody.message;
          else if (errBody?.error) msg = errBody.error;
        } catch { /* not JSON */ }
        throw new Error(msg);
      }
      return r.json();
    })
    .then(() => { /* update persisted — local state already has the new values */ })
    .catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      try {
        import("sonner").then(({ toast }) => {
          toast.error(`Failed to update ${type}: ${msg}`);
        }).catch(() => {});
      } catch { /* ignore */ }
    });
}

// Persist a delete to the database
function apiDelete(type: string, id: string) {
  fetch(`/api/crud/${id}?type=${type}`, {
    method: "DELETE",
  })
    .then(async (r) => {
      if (!r.ok) {
        let msg = `HTTP ${r.status}`;
        try {
          const errBody = await r.json();
          if (errBody?.message) msg = errBody.message;
          else if (errBody?.error) msg = errBody.error;
        } catch { /* not JSON */ }
        throw new Error(msg);
      }
      return r.json();
    })
    .then(() => { /* delete persisted */ })
    .catch((err: unknown) => {
      const msg = err instanceof Error ? err.message : String(err);
      try {
        import("sonner").then(({ toast }) => {
          toast.error(`Failed to delete ${type}: ${msg}`);
        }).catch(() => {});
      } catch { /* ignore */ }
    });
}

/* ============================================================
 * Listener subscriptions
 * ============================================================ */
const listeners = new Set<() => void>();

function emit() {
  saveToStorage();
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): State {
  return state;
}

function getServerSnapshot(): State {
  return SERVER_SNAPSHOT;
}

/* ============================================================
 * Client-side initialization — sync with database on mount
 * ============================================================ */
const SYNC_ENTRIES: Array<{ key: keyof State; type: string }> = [
  { key: "tours", type: "tours" },
  { key: "accommodations", type: "accommodations" },
  { key: "scheduledTrips", type: "scheduled-trips" },
  { key: "destinations", type: "destinations" },
  { key: "countries", type: "countries" },
  { key: "parks", type: "parks" },
  { key: "testimonials", type: "testimonials" },
  { key: "blogPosts", type: "blog-posts" },
  { key: "bookings", type: "bookings" },
  { key: "tourBookings", type: "tour-bookings" },
  { key: "scheduledTripBookings", type: "scheduled-trip-bookings" },
  { key: "quotes", type: "quotes" },
  { key: "formInquiries", type: "form-inquiries" },
];

// Re-sync all entity types from the database.
// REPLACES local state with DB data — the DB is the source of truth.
// Call this on route changes AND periodically so multiple admin sessions
// stay in sync (if Admin A deletes a tour, Admin B sees the deletion too).
export function resyncStore() {
  if (typeof window === "undefined") return;
  for (const { key, type } of SYNC_ENTRIES) {
    syncFromDatabase(key, type);
  }
}

if (typeof window !== "undefined") {
  // Initial sync on module load
  for (const { key, type } of SYNC_ENTRIES) {
    syncFromDatabase(key, type);
  }
  // Auto-refresh every 30 seconds — picks up changes made by other admins
  // (creates, edits, deletes) in real-time without manual page refresh.
  setInterval(() => {
    for (const { key, type } of SYNC_ENTRIES) {
      syncFromDatabase(key, type);
    }
  }, 30000);
}

/* ============================================================
 * Public store API — each CRUD method updates local state
 * (optimistic) AND persists to the database via the API
 * ============================================================ */
export const store = {
  subscribe,
  getSnapshot,
  getServerSnapshot,

  /* Tours */
  setTours(tours: TourPackage[]) {
    state = { ...state, tours };
    emit();
  },
  addTour(tour: TourPackage) {
    state = { ...state, tours: [tour, ...state.tours] };
    emit();
    apiCreate("tours", tour, "tours", tour.id);
  },
  updateTour(id: string, patch: Partial<TourPackage>) {
    state = { ...state, tours: state.tours.map((t) => (t.id === id ? { ...t, ...patch } : t)) };
    emit();
    apiUpdate("tours", id, patch);
  },
  deleteTour(id: string) {
    state = { ...state, tours: state.tours.filter((t) => t.id !== id) };
    emit();
    apiDelete("tours", id);
  },

  /* Scheduled Trips */
  setScheduledTrips(trips: ScheduledTrip[]) {
    state = { ...state, scheduledTrips: trips };
    emit();
  },
  addScheduledTrip(trip: ScheduledTrip) {
    state = { ...state, scheduledTrips: [trip, ...state.scheduledTrips] };
    emit();
    apiCreate("scheduled-trips", trip, "scheduledTrips", trip.id);
  },
  updateScheduledTrip(id: string, patch: Partial<ScheduledTrip>) {
    state = { ...state, scheduledTrips: state.scheduledTrips.map((t) => (t.id === id ? { ...t, ...patch } : t)) };
    emit();
    apiUpdate("scheduled-trips", id, patch);
  },
  deleteScheduledTrip(id: string) {
    state = { ...state, scheduledTrips: state.scheduledTrips.filter((t) => t.id !== id) };
    emit();
    apiDelete("scheduled-trips", id);
  },

  /* Accommodations */
  setAccommodations(accs: Accommodation[]) {
    state = { ...state, accommodations: accs };
    emit();
  },
  addAccommodation(acc: Accommodation) {
    state = { ...state, accommodations: [acc, ...state.accommodations] };
    emit();
    apiCreate("accommodations", acc, "accommodations", acc.id);
  },
  updateAccommodation(id: string, patch: Partial<Accommodation>) {
    state = { ...state, accommodations: state.accommodations.map((a) => (a.id === id ? { ...a, ...patch } : a)) };
    emit();
    apiUpdate("accommodations", id, patch);
  },
  deleteAccommodation(id: string) {
    state = { ...state, accommodations: state.accommodations.filter((a) => a.id !== id) };
    emit();
    apiDelete("accommodations", id);
  },

  /* Testimonials */
  setTestimonials(ts: Testimonial[]) {
    state = { ...state, testimonials: ts };
    emit();
  },
  addTestimonial(t: Testimonial) {
    state = { ...state, testimonials: [t, ...state.testimonials] };
    emit();
    apiCreate("testimonials", t, "testimonials", t.id);
  },
  updateTestimonial(id: string, patch: Partial<Testimonial>) {
    state = { ...state, testimonials: state.testimonials.map((t) => (t.id === id ? { ...t, ...patch } : t)) };
    emit();
    apiUpdate("testimonials", id, patch);
  },
  deleteTestimonial(id: string) {
    state = { ...state, testimonials: state.testimonials.filter((t) => t.id !== id) };
    emit();
    apiDelete("testimonials", id);
  },

  /* Destinations */
  setDestinations(ds: Destination[]) {
    state = { ...state, destinations: ds };
    emit();
  },
  addDestination(d: Destination) {
    state = { ...state, destinations: [d, ...state.destinations] };
    emit();
    apiCreate("destinations", d, "destinations", d.id);
  },
  updateDestination(id: string, patch: Partial<Destination>) {
    state = { ...state, destinations: state.destinations.map((d) => (d.id === id ? { ...d, ...patch } : d)) };
    emit();
    apiUpdate("destinations", id, patch);
  },
  deleteDestination(id: string) {
    state = { ...state, destinations: state.destinations.filter((d) => d.id !== id) };
    emit();
    apiDelete("destinations", id);
  },

  /* Countries */
  setCountries(countries: Destination[]) { state = { ...state, countries }; emit(); },
  addCountry(country: Destination) { state = { ...state, countries: [country, ...state.countries] }; emit(); apiCreate("countries", country, "countries", country.id); },
  updateCountry(id: string, patch: Partial<Destination>) { state = { ...state, countries: state.countries.map((c) => (c.id === id ? { ...c, ...patch } : c)) }; emit(); apiUpdate("countries", id, patch); },
  deleteCountry(id: string) { state = { ...state, countries: state.countries.filter((c) => c.id !== id) }; emit(); apiDelete("countries", id); },

  /* Parks */
  setParks(parks: Destination[]) { state = { ...state, parks }; emit(); },
  addPark(park: Destination) { state = { ...state, parks: [park, ...state.parks] }; emit(); apiCreate("parks", park, "parks", park.id); },
  updatePark(id: string, patch: Partial<Destination>) { state = { ...state, parks: state.parks.map((p) => (p.id === id ? { ...p, ...patch } : p)) }; emit(); apiUpdate("parks", id, patch); },
  deletePark(id: string) { state = { ...state, parks: state.parks.filter((p) => p.id !== id) }; emit(); apiDelete("parks", id); },

  /* Blog Posts */
  setBlogPosts(posts: BlogPost[]) {
    state = { ...state, blogPosts: posts };
    emit();
  },
  addBlogPost(post: BlogPost) {
    state = { ...state, blogPosts: [post, ...state.blogPosts] };
    emit();
    apiCreate("blog-posts", post, "blogPosts", post.id);
  },
  updateBlogPost(id: string, patch: Partial<BlogPost>) {
    state = { ...state, blogPosts: state.blogPosts.map((p) => (p.id === id ? { ...p, ...patch } : p)) };
    emit();
    apiUpdate("blog-posts", id, patch);
  },
  deleteBlogPost(id: string) {
    state = { ...state, blogPosts: state.blogPosts.filter((p) => p.id !== id) };
    emit();
    apiDelete("blog-posts", id);
  },

  /* Bookings */
  setBookings(bookings: Booking[]) {
    state = { ...state, bookings };
    emit();
  },
  addBooking(booking: Booking) {
    state = { ...state, bookings: [booking, ...state.bookings] };
    emit();
    apiCreate("bookings", booking, "bookings", booking.id);
  },
  updateBooking(id: string, patch: Partial<Booking>) {
    state = { ...state, bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) };
    emit();
    apiUpdate("bookings", id, patch);
  },
  deleteBooking(id: string) {
    state = { ...state, bookings: state.bookings.filter((b) => b.id !== id) };
    emit();
    apiDelete("bookings", id);
  },
  clearBookings() {
    state = { ...state, bookings: [] };
    emit();
  },

  /* Tour Bookings */
  addTourBooking(booking: Booking) {
    state = { ...state, tourBookings: [booking, ...state.tourBookings] };
    emit();
    apiCreate("tour-bookings", { ...booking, tourId: booking.tripId, type: "tour" }, "tourBookings", booking.id);
  },
  updateTourBooking(id: string, patch: Partial<Booking>) {
    state = { ...state, tourBookings: state.tourBookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) };
    emit();
    apiUpdate("tour-bookings", id, patch);
  },
  deleteTourBooking(id: string) {
    state = { ...state, tourBookings: state.tourBookings.filter((b) => b.id !== id) };
    emit();
    apiDelete("tour-bookings", id);
  },

  /* Scheduled Trip Bookings */
  addScheduledTripBooking(booking: Booking) {
    state = { ...state, scheduledTripBookings: [booking, ...state.scheduledTripBookings] };
    emit();
    apiCreate("scheduled-trip-bookings", { ...booking, scheduledTripId: booking.tripId, type: "scheduled-trip" }, "scheduledTripBookings", booking.id);
  },
  updateScheduledTripBooking(id: string, patch: Partial<Booking>) {
    state = { ...state, scheduledTripBookings: state.scheduledTripBookings.map((b) => (b.id === id ? { ...b, ...patch } : b)) };
    emit();
    apiUpdate("scheduled-trip-bookings", id, patch);
  },
  deleteScheduledTripBooking(id: string) {
    state = { ...state, scheduledTripBookings: state.scheduledTripBookings.filter((b) => b.id !== id) };
    emit();
    apiDelete("scheduled-trip-bookings", id);
  },

  /* Quotes */
  setQuotes(quotes: QuoteRequest[]) {
    state = { ...state, quotes };
    emit();
  },
  addQuote(quote: QuoteRequest) {
    state = { ...state, quotes: [quote, ...state.quotes] };
    emit();
    apiCreate("quotes", quote, "quotes", quote.id);
  },
  updateQuote(id: string, patch: Partial<QuoteRequest>) {
    state = { ...state, quotes: state.quotes.map((q) => (q.id === id ? { ...q, ...patch } : q)) };
    emit();
    apiUpdate("quotes", id, patch);
  },
  deleteQuote(id: string) {
    state = { ...state, quotes: state.quotes.filter((q) => q.id !== id) };
    emit();
    apiDelete("quotes", id);
  },

  /* Form Inquiries */
  setFormInquiries(formInquiries: QuoteRequest[]) { state = { ...state, formInquiries }; emit(); },
  addFormInquiry(inquiry: QuoteRequest) { state = { ...state, formInquiries: [inquiry, ...state.formInquiries] }; emit(); apiCreate("form-inquiries", inquiry, "formInquiries", inquiry.id); },
  updateFormInquiry(id: string, patch: Partial<QuoteRequest>) { state = { ...state, formInquiries: state.formInquiries.map((q) => (q.id === id ? { ...q, ...patch } : q)) }; emit(); apiUpdate("form-inquiries", id, patch); },
  deleteFormInquiry(id: string) { state = { ...state, formInquiries: state.formInquiries.filter((q) => q.id !== id) }; emit(); apiDelete("form-inquiries", id); },
};

/* ============================================================
 * Hooks — unchanged from original (useSyncExternalStore pattern)
 * ============================================================ */
function useStore<T>(selector: (s: State) => T): T {
  const getClientSnapshot = useCallback(() => selector(getSnapshot()), [selector]);
  const getServerSnap = useCallback(() => selector(getServerSnapshot()), [selector]);
  return useSyncExternalStore(subscribe, getClientSnapshot, getServerSnap);
}

export function useTours(): TourPackage[] {
  return useStore((s) => s.tours);
}
export function useScheduledTrips(): ScheduledTrip[] {
  return useStore((s) => s.scheduledTrips);
}
export function useAccommodations(): Accommodation[] {
  return useStore((s) => s.accommodations);
}
export function useTestimonials(): Testimonial[] {
  return useStore((s) => s.testimonials);
}
export function useDestinations(): Destination[] {
  return useStore((s) => s.destinations);
}
export function useCountries(): Destination[] {
  return useStore((s) => s.countries);
}
export function useParks(): Destination[] {
  return useStore((s) => s.parks);
}
export function useBlogPosts(): BlogPost[] {
  return useStore((s) => s.blogPosts);
}
export function useBookings(): Booking[] {
  return useStore((s) => s.bookings);
}
export function useTourBookings(): Booking[] {
  return useStore((s) => s.tourBookings);
}
export function useScheduledTripBookings(): Booking[] {
  return useStore((s) => s.scheduledTripBookings);
}
export function useQuotes(): QuoteRequest[] {
  return useStore((s) => s.quotes);
}
export function useFormInquiries(): QuoteRequest[] {
  return useStore((s) => s.formInquiries);
}

/* ============================================================
 * Utility — generate unique IDs
 * ============================================================ */
export function generateId(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
