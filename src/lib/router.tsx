"use client";

import { createContext, useContext, useCallback, useEffect, ReactNode } from "react";
import { useRouter as useNextRouter, usePathname, useSearchParams } from "next/navigation";

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
  | "admin"
  | "privacy"
  | "terms";

// Map PageId → URL path
const PAGE_TO_PATH: Partial<Record<PageId, string>> = {
  home: "/",
  about: "/company",
  company: "/company",
  tours: "/tours",
  "scheduled-trips": "/scheduled-trips",
  destinations: "/destinations",
  accommodation: "/accommodation",
  contact: "/contact",
  blog: "/blog",
  "blog-detail": "/blog-detail",
  "tour-detail": "/tour-detail",
  "accommodation-detail": "/accommodation-detail",
  "scheduled-trip-detail": "/scheduled-trip-detail",
  admin: "/admin",
  privacy: "/privacy",
  terms: "/terms",
};

// Map URL path → PageId
const PATH_TO_PAGE: Record<string, PageId> = {
  "/": "home",
  "/company": "company",
  "/tours": "tours",
  "/scheduled-trips": "scheduled-trips",
  "/destinations": "destinations",
  "/accommodation": "accommodation",
  "/contact": "contact",
  "/blog": "blog",
  "/blog-detail": "blog-detail",
  "/tour-detail": "tour-detail",
  "/accommodation-detail": "accommodation-detail",
  "/scheduled-trip-detail": "scheduled-trip-detail",
  "/admin": "admin",
  "/privacy": "privacy",
  "/terms": "terms",
};

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
  const router = useNextRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Derive page from URL pathname
  const page: PageId = (pathname && PATH_TO_PAGE[pathname]) || "home";

  // Derive IDs from URL search params
  const destinationCountry = searchParams.get("country");
  const selectedTourId = searchParams.get("id");
  const selectedAccommodationId = searchParams.get("id");
  const selectedScheduledTripId = searchParams.get("id");
  const selectedBlogPostId = searchParams.get("id");

  // Scroll to top on pathname change
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: unknown) => void } }).__lenis;
      lenis?.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  const navigate = useCallback((next: PageId) => {
    const path = PAGE_TO_PATH[next] || "/";
    router.push(path);
  }, [router]);

  const navigateToDestination = useCallback((country: string) => {
    router.push(`/destinations?country=${encodeURIComponent(country)}`);
  }, [router]);

  const navigateToTour = useCallback((id: string) => {
    router.push(`/tour-detail?id=${encodeURIComponent(id)}`);
  }, [router]);

  const navigateToAccommodation = useCallback((id: string) => {
    router.push(`/accommodation-detail?id=${encodeURIComponent(id)}`);
  }, [router]);

  const navigateToScheduledTrip = useCallback((id: string) => {
    router.push(`/scheduled-trip-detail?id=${encodeURIComponent(id)}`);
  }, [router]);

  const navigateToBlogPost = useCallback((id: string) => {
    router.push(`/blog-detail?id=${encodeURIComponent(id)}`);
  }, [router]);

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
