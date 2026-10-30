"use client";

import { createContext, useContext, useCallback, useEffect, ReactNode } from "react";
import { useRouter as useNextRouter, usePathname, useSearchParams } from "next/navigation";
import { blogPostSlug } from "@/lib/slug";
import { getState } from "@/lib/store";

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
  /** New slug-based blog URL — e.g. "rwenzori-marathon-2027-uganda-safari-abc123" */
  blogSlug: string | null;
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

  // --- Derive page + IDs from URL --------------------------------
  //
  // Two URL formats are supported for blog detail pages:
  //
  //   1. OLD (kept for backward compat + old external links):
  //      /blog-detail?id=blog-xxx
  //
  //   2. NEW (SEO-friendly, used everywhere internally now):
  //      /blog/{slug-from-title}
  //      e.g. /blog/rwenzori-marathon-2027-uganda-safari-mvulwn
  //
  // Both formats set page='blog-detail'. The new format exposes the
  // slug via `blogSlug`; the old format exposes the id via
  // `selectedBlogPostId`. BlogDetailPage checks both.

  const isBlogSlugPath =
    !!pathname && pathname.startsWith("/blog/") && pathname !== "/blog";

  // Extract the slug from /blog/{slug}
  const blogSlug: string | null = isBlogSlugPath
    ? decodeURIComponent(pathname!.slice("/blog/".length))
    : null;

  // For the OLD format: read id from ?id= query param.
  const blogPostIdFromQuery = searchParams.get("id");

  // Determine the page from the path. /blog/{anything} → blog-detail.
  let page: PageId;
  if (isBlogSlugPath) {
    page = "blog-detail";
  } else if (pathname && PATH_TO_PAGE[pathname]) {
    page = PATH_TO_PAGE[pathname]!;
  } else {
    page = "home";
  }

  const destinationCountry = searchParams.get("country");
  const selectedTourId = page === "tour-detail" ? blogPostIdFromQuery : null;
  const selectedAccommodationId = page === "accommodation-detail" ? blogPostIdFromQuery : null;
  const selectedScheduledTripId = page === "scheduled-trip-detail" ? blogPostIdFromQuery : null;
  // Only honour the legacy ?id= format for blog-detail when we're NOT
  // on a /blog/{slug} path. (When on /blog/{slug}, the slug takes
  // precedence and we look up the post by slug in BlogDetailPage.)
  const selectedBlogPostId =
    page === "blog-detail" && !isBlogSlugPath ? blogPostIdFromQuery : null;

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

  // Navigate to a blog post using the SEO-friendly /blog/{slug} URL.
  // Looks up the post in the store to compute its slug from the title.
  // Falls back to the legacy /blog-detail?id= URL if the post can't be
  // found in the store (rare — only happens if the post was just
  // deleted between render and click).
  const navigateToBlogPost = useCallback((id: string) => {
    const post = getState().blogPosts.find((p) => p.id === id);
    if (post) {
      const slug = blogPostSlug(post);
      router.push(`/blog/${encodeURIComponent(slug)}`);
    } else {
      // Fallback to legacy URL format
      router.push(`/blog-detail?id=${encodeURIComponent(id)}`);
    }
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
        blogSlug,
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
