"use client";

import { useSyncExternalStore } from "react";
import {
  tourPackages as seedTours,
  accommodations as seedAccommodations,
  scheduledTrips as seedScheduledTrips,
  testimonials as seedTestimonials,
  destinations as seedDestinations,
  type TourPackage,
  type Accommodation,
  type ScheduledTrip,
  type Testimonial,
  type Destination,
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
const BOOKINGS_KEY = "unzip_africa_bookings";
const QUOTES_KEY = "unzip_africa_quotes";

type State = {
  tours: TourPackage[];
  accommodations: Accommodation[];
  scheduledTrips: ScheduledTrip[];
  testimonials: Testimonial[];
  destinations: Destination[];
  bookings: Booking[];
  quotes: QuoteRequest[];
};

let state: State = {
  tours: [...seedTours],
  accommodations: [...seedAccommodations],
  scheduledTrips: [...seedScheduledTrips],
  testimonials: [...seedTestimonials],
  destinations: [...seedDestinations],
  bookings: [],
  quotes: [],
};

// Hydrate bookings + quotes from localStorage (client only)
if (typeof window !== "undefined") {
  try {
    const rawB = window.localStorage.getItem(BOOKINGS_KEY);
    if (rawB) {
      const parsed: Booking[] = JSON.parse(rawB);
      if (Array.isArray(parsed)) state.bookings = parsed;
    }
  } catch {
    // ignore
  }
  try {
    const rawQ = window.localStorage.getItem(QUOTES_KEY);
    if (rawQ) {
      const parsed: QuoteRequest[] = JSON.parse(rawQ);
      if (Array.isArray(parsed)) state.quotes = parsed;
    }
  } catch {
    // ignore
  }
}

/* ============================================================
 * Listener subscriptions
 * ============================================================ */
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

function getSnapshot(): State {
  return state;
}

// For SSR — return the same default state with empty bookings
function getServerSnapshot(): State {
  return {
    tours: [...seedTours],
    accommodations: [...seedAccommodations],
    scheduledTrips: [...seedScheduledTrips],
    testimonials: [...seedTestimonials],
    destinations: [...seedDestinations],
    bookings: [],
    quotes: [],
  };
}

/* ============================================================
 * Helper to persist + emit
 * ============================================================ */
function persistBookings() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(BOOKINGS_KEY, JSON.stringify(state.bookings));
  } catch {
    // ignore
  }
}

function persistQuotes() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(QUOTES_KEY, JSON.stringify(state.quotes));
  } catch {
    // ignore
  }
}

/* ============================================================
 * Public store API
 * ============================================================ */
export const store = {
  subscribe,
  getSnapshot,
  getServerSnapshot,

  /* Bookings */
  setBookings(bookings: Booking[]) {
    state = { ...state, bookings };
    persistBookings();
    emit();
  },
  addBooking(booking: Booking) {
    state = { ...state, bookings: [booking, ...state.bookings] };
    persistBookings();
    emit();
  },
  updateBooking(id: string, patch: Partial<Booking>) {
    state = {
      ...state,
      bookings: state.bookings.map((b) => (b.id === id ? { ...b, ...patch } : b)),
    };
    persistBookings();
    emit();
  },
  deleteBooking(id: string) {
    state = { ...state, bookings: state.bookings.filter((b) => b.id !== id) };
    persistBookings();
    emit();
  },
  clearBookings() {
    state = { ...state, bookings: [] };
    persistBookings();
    emit();
  },

  /* Quotes */
  setQuotes(quotes: QuoteRequest[]) {
    state = { ...state, quotes };
    persistQuotes();
    emit();
  },
  addQuote(quote: QuoteRequest) {
    state = { ...state, quotes: [quote, ...state.quotes] };
    persistQuotes();
    emit();
  },
  updateQuote(id: string, patch: Partial<QuoteRequest>) {
    state = {
      ...state,
      quotes: state.quotes.map((q) => (q.id === id ? { ...q, ...patch } : q)),
    };
    persistQuotes();
    emit();
  },
  deleteQuote(id: string) {
    state = { ...state, quotes: state.quotes.filter((q) => q.id !== id) };
    persistQuotes();
    emit();
  },

  /* Tours */
  setTours(tours: TourPackage[]) {
    state = { ...state, tours };
    emit();
  },
  addTour(tour: TourPackage) {
    state = { ...state, tours: [tour, ...state.tours] };
    emit();
  },
  updateTour(id: string, patch: Partial<TourPackage>) {
    state = {
      ...state,
      tours: state.tours.map((t) => (t.id === id ? { ...t, ...patch } : t)),
    };
    emit();
  },
  deleteTour(id: string) {
    state = { ...state, tours: state.tours.filter((t) => t.id !== id) };
    emit();
  },

  /* Scheduled Trips */
  setScheduledTrips(trips: ScheduledTrip[]) {
    state = { ...state, scheduledTrips: trips };
    emit();
  },
  addScheduledTrip(trip: ScheduledTrip) {
    state = { ...state, scheduledTrips: [trip, ...state.scheduledTrips] };
    emit();
  },
  updateScheduledTrip(id: string, patch: Partial<ScheduledTrip>) {
    state = {
      ...state,
      scheduledTrips: state.scheduledTrips.map((t) =>
        t.id === id ? { ...t, ...patch } : t
      ),
    };
    emit();
  },
  deleteScheduledTrip(id: string) {
    state = { ...state, scheduledTrips: state.scheduledTrips.filter((t) => t.id !== id) };
    emit();
  },

  /* Accommodations */
  setAccommodations(accs: Accommodation[]) {
    state = { ...state, accommodations: accs };
    emit();
  },
  addAccommodation(acc: Accommodation) {
    state = { ...state, accommodations: [acc, ...state.accommodations] };
    emit();
  },
  updateAccommodation(id: string, patch: Partial<Accommodation>) {
    state = {
      ...state,
      accommodations: state.accommodations.map((a) =>
        a.id === id ? { ...a, ...patch } : a
      ),
    };
    emit();
  },
  deleteAccommodation(id: string) {
    state = { ...state, accommodations: state.accommodations.filter((a) => a.id !== id) };
    emit();
  },

  /* Testimonials */
  setTestimonials(ts: Testimonial[]) {
    state = { ...state, testimonials: ts };
    emit();
  },
  addTestimonial(t: Testimonial) {
    state = { ...state, testimonials: [t, ...state.testimonials] };
    emit();
  },
  updateTestimonial(id: string, patch: Partial<Testimonial>) {
    state = {
      ...state,
      testimonials: state.testimonials.map((t) =>
        t.id === id ? { ...t, ...patch } : t
      ),
    };
    emit();
  },
  deleteTestimonial(id: string) {
    state = { ...state, testimonials: state.testimonials.filter((t) => t.id !== id) };
    emit();
  },

  /* Destinations */
  setDestinations(ds: Destination[]) {
    state = { ...state, destinations: ds };
    emit();
  },
  addDestination(d: Destination) {
    state = { ...state, destinations: [d, ...state.destinations] };
    emit();
  },
  updateDestination(id: string, patch: Partial<Destination>) {
    state = {
      ...state,
      destinations: state.destinations.map((d) =>
        d.id === id ? { ...d, ...patch } : d
      ),
    };
    emit();
  },
  deleteDestination(id: string) {
    state = { ...state, destinations: state.destinations.filter((d) => d.id !== id) };
    emit();
  },
};

/* ============================================================
 * Hooks
 * ============================================================ */
function useStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(subscribe, () => selector(getSnapshot()), () => selector(getServerSnapshot()));
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
export function useBookings(): Booking[] {
  return useStore((s) => s.bookings);
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
