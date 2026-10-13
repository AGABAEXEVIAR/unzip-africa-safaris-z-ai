"use client";

import { useState, useEffect } from "react";

// Admin-managed content overrides fetched from /api/content.
// Falls back to undefined for any key not yet set by the admin
// (components should use their translation-key defaults in that case).

export type FounderOverride = {
  image?: string;
  message?: string;
  name?: string;
};

export type FAQItem = {
  question: string;
  answer: string;
};

export type SafariCarsOverride = {
  body?: string;
  images?: string[];
};

export type ContentOverrides = {
  founder?: FounderOverride;
  faq?: FAQItem[];
  safariCars?: SafariCarsOverride;
};

let cachedOverrides: ContentOverrides | null = null;
let fetchPromise: Promise<ContentOverrides | null> | null = null;

// Fetch once and cache — avoids redundant API calls on every component mount
async function fetchOverrides(): Promise<ContentOverrides | null> {
  if (cachedOverrides) return cachedOverrides;
  if (fetchPromise) return fetchPromise;

  fetchPromise = fetch("/api/content", { cache: "no-store" })
    .then((r) => r.ok ? r.json() : {})
    .then((data) => {
      cachedOverrides = data as ContentOverrides;
      return cachedOverrides;
    })
    .catch(() => null);

  return fetchPromise;
}

// Kick off the fetch immediately on the client
if (typeof window !== "undefined") {
  fetchOverrides();
}

export function useContentOverrides(): ContentOverrides | null {
  const [overrides, setOverrides] = useState<ContentOverrides | null>(cachedOverrides);

  useEffect(() => {
    if (cachedOverrides) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOverrides(cachedOverrides);
      return;
    }
    fetchOverrides().then((data) => {
      if (data) // eslint-disable-next-line react-hooks/set-state-in-effect
      setOverrides(data);
    });
  }, []);

  return overrides;
}

// Helper to force a re-fetch after admin updates content
export function refreshContentOverrides() {
  cachedOverrides = null;
  fetchPromise = null;
  if (typeof window !== "undefined") {
    fetchOverrides();
  }
}
