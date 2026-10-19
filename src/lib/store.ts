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
};

// Fetch all records of a type from the database — MERGES with local state
// so admin's optimistic updates (that might not be in the DB yet) are kept.
async function syncFromDatabase(key: keyof State, type: string) {
  try {
    const res = await fetch(`/api/crud?type=${type}`, { cache: "no-store" });
    if (!res.ok) return;
    const data = await res.json();
    if (Array.isArray(data) && data.length > 0) {
      // MERGE: DB items take precedence (updated versions), but local-only
      // items (from optimistic updates that haven't persisted to DB yet)
      // are preserved so the admin's changes aren't lost on page navigation.
      const localItems = state[key] as Array<{ id: string }>;
      const dbIds = new Set(data.map((d: { id: string }) => d.id));
      const localOnlyItems = localItems.filter((item: { id: string }) => !dbIds.has(item.id));
      const merged = [...data, ...localOnlyItems];
      state = { ...state, [key]: merged };
      emit();
    }
  } catch {
    // API unavailable (e.g. during SSR or first deploy before migration)
    // Keep using seed data — graceful degradation
  }
}

// Persist a create to the database (fire-and-forget — keeps optimistic update on failure)
function apiCreate(type: string, record: unknown, revertKey: keyof State, recordId: string) {
  fetch(`/api/crud?type=${type}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(record),
  })
    .then((r) => r.ok ? r.json() : null)
    .then((saved) => {
      if (saved && saved.id && saved.id !== recordId) {
        // Replace optimistic ID with DB-generated ID
        const arr = state[revertKey] as unknown[];
        const updated = arr.map((item: any) =>
          item.id === recordId ? { ...item, id: saved.id } : item
        );
        state = { ...state, [revertKey]: updated };
        emit();
      }
      // If saved is null (API returned error), keep the optimistic record
      // in local state — it'll be visible in the current session even if
      // the database isn't reachable. The resyncStore MERGE logic preserves
      // local-only items (items whose IDs aren't in the DB) on page navigation.
    })
    .catch(() => {
      // API failed — DO NOT revert the optimistic update.
      // Keep the record in local state so the user can still see it.
      // The record will be visible in the current session and survives
      // page navigation via the syncFromDatabase MERGE logic.
    });
}

// Persist an update to the database
function apiUpdate(type: string, id: string, patch: unknown) {
  fetch(`/api/crud/${id}?type=${type}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  }).catch(() => { /* silent — optimistic update stays in UI */ });
}

// Persist a delete to the database
function apiDelete(type: string, id: string) {
  fetch(`/api/crud/${id}?type=${type}`, {
    method: "DELETE",
  }).catch(() => { /* silent — optimistic delete stays in UI */ });
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
];

// Re-sync all entity types from the database.
// MERGES with local state — admin's optimistic updates are preserved.
// Call this on route changes so the homepage shows the latest DB data
// after the admin creates/edits/deletes content.
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

/* ============================================================
 * Utility — generate unique IDs
 * ============================================================ */
export function generateId(prefix = "id"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
