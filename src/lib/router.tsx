"use client";

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";

export type PageId = "home" | "about" | "tours" | "accommodation" | "contact";

type RouterContextValue = {
  page: PageId;
  quoteOpen: boolean;
  navigate: (page: PageId) => void;
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

  const navigate = useCallback((next: PageId) => {
    setPage(next);
    // Scroll to top on page change
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "auto" });
      // Also reset any smooth-scroll library
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: unknown) => void } }).__lenis;
      lenis?.scrollTo(0, { immediate: true });
    }
  }, []);

  const openQuote = useCallback(() => setQuoteOpen(true), []);
  const closeQuote = useCallback(() => setQuoteOpen(false), []);

  // Lock body scroll when quote modal is open
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
    <RouterContext.Provider value={{ page, quoteOpen, navigate, openQuote, closeQuote }}>
      {children}
    </RouterContext.Provider>
  );
}
