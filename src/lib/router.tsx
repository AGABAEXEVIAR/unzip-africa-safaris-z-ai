"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type PageId =
  | "home"
  | "about"
  | "company"
  | "tours"
  | "scheduled-trips"
  | "destinations"
  | "accommodation"
  | "contact"
  | "blog"
  | "blog-detail"
  | "tour-detail"
  | "accommodation-detail"
  | "scheduled-trip-detail"
  | "admin";

type RouterContextValue = {
  page: PageId;
  destinationCountry: string | null;
  selectedTourId: string | null;
  selectedAccommodationId: string | null;
  selectedScheduledTripId: string | null;
  selectedBlogPostId: string | null;
  navigate: (page: PageId) => void;
  navigateToDestination: (country: string) => void;
  navigateToTour: (id: string) => void;
  navigateToAccommodation: (id: string) => void;
  navigateToScheduledTrip: (id: string) => void;
  navigateToBlogPost: (id: string) => void;
};

const RouterContext = createContext<RouterContextValue | null>(null);

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error("useRouter must be used within RouterProvider");
  return ctx;
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [page, setPage] = useState<PageId>("home");
  const [destinationCountry, setDestinationCountry] = useState<string | null>(null);
  const [selectedTourId, setSelectedTourId] = useState<string | null>(null);
  const [selectedAccommodationId, setSelectedAccommodationId] = useState<string | null>(null);
  const [selectedScheduledTripId, setSelectedScheduledTripId] = useState<string | null>(null);
  const [selectedBlogPostId, setSelectedBlogPostId] = useState<string | null>(null);

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

  const navigateToBlogPost = useCallback((id: string) => {
    setSelectedBlogPostId(id);
    setPage("blog-detail");
    scrollToTop();
  }, [scrollToTop]);

  return (
    <RouterContext.Provider
      value={{
        page,
        destinationCountry,
        selectedTourId,
        selectedAccommodationId,
        selectedScheduledTripId,
        selectedBlogPostId,
        navigate,
        navigateToDestination,
        navigateToTour,
        navigateToAccommodation,
        navigateToScheduledTrip,
        navigateToBlogPost,
      }}
    >
      {children}
    </RouterContext.Provider>
  );
}
