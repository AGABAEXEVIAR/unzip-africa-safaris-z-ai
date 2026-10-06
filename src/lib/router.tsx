"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type PageId =
  | "home"
  | "about"
  | "tours"
  | "destinations"
  | "accommodation"
  | "contact"
  | "quote"
  | "tour-detail"
  | "accommodation-detail"
  | "scheduled-trip-detail"
  | "admin";

type RouterContextValue = {
  page: PageId;
  quoteOpen: boolean;
  destinationCountry: string | null;
  selectedTourId: string | null;
  selectedAccommodationId: string | null;
  selectedScheduledTripId: string | null;
  navigate: (page: PageId) => void;
  navigateToDestination: (country: string) => void;
  navigateToTour: (id: string) => void;
  navigateToAccommodation: (id: string) => void;
  navigateToScheduledTrip: (id: string) => void;
  openQuote: () => void;
  closeQuote: () => void;
};

const RouterContext = createContext<RouterContextValue | null>(null);

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>("home");
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [destinationCountry, setDestinationCountry] = useState<string | null>(null);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<string | null>(null);
  const [selectedScheduledTripId, setSelectedScheduledTripId] = useState<string | null>(null);

  const scrollToTop = useCallback(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: unknown) => void } }).__lenis;
      lenis?.scrollTo(0, { immediate: true });
    }
  }, []);

  const navigate = useCallback((next: PageId) => {
    setPage(next);
    scrollToTop();
  }, [scrollToTop]);

  const navigateToDestination = useCallback((country: string) => {
    setDestinationCountry(country);
    setPage("destinations");
    scrollToTop();
  }, [scrollToTop]);

  const navigateToTour = useCallback((id: string) => {
    setSelectedTourId(id);
    setPage("tour-detail");
    scrollToTop();
  }, [scrollToTop]);

  const navigateToAccommodation = useCallback((id: string) => {
    setSelectedAccommodationId(id);
    setPage("accommodation-detail");
    scrollToTop();
  }, [scrollToTop]);

  const navigateToScheduledTrip = useCallback((id: string) => {
    setSelectedScheduledTripId(id);
    setPage("scheduled-trip-detail");
    scrollToTop();
  }, [scrollToTop]);

  const openQuote = useCallback(() => {
    setPage("quote");
    scrollToTop();
  }, [scrollToTop]);
  const closeQuote = useCallback(() => setQuoteOpen(false), []);

  useEffect(() => {
    if (quoteOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [quoteOpen]);

  return (
    <RouterContext.Provider
      value={{
        page,
        quoteOpen,
        destinationCountry,
        selectedTourId,
        selectedAccommodationId,
        selectedScheduledTripId,
        navigate,
        navigateToDestination,
        navigateToTour,
        navigateToAccommodation,
        navigateToScheduledTrip,
        openQuote,
        closeQuote,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}
