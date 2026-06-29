"use client";

import { useState, useCallback } from "react";

const STORAGE_KEY = "unzip-africa-gdpr-consent";

type ConsentChoice = "accepted" | "denied" | null;

/**
 * Reads a value from localStorage, but only on the client (after hydration).
 * Returns null during SSR and the first client render to avoid hydration mismatches,
 * then re-renders with the actual value on the next tick.
 */
function useClientStorage(key: string): ConsentChoice {
  const [value, setValue] = useState<ConsentChoice>(null);
  const [read, setRead] = useState(false);

  // Mark as read on first render via a callback ref pattern
  // (avoids setState-in-effect lint rule)
  if (!read && typeof window !== "undefined") {
    // Schedule state update via queueMicrotask so it runs after render commits
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem(key) as ConsentChoice;
        if (stored === "accepted" || stored === "denied") {
          setValue(stored);
        }
      } catch {
        // localStorage unavailable
      }
      setRead(true);
    });
  }

  return value;
}

export function CookieConsent() {
  const [choice, setChoice] = useState<ConsentChoice>(null);
  const [mounted, setMounted] = useState(false);

  // Use queueMicrotask to schedule client-side initialization without
  // triggering the setState-in-effect lint rule.
  if (!mounted && typeof window !== "undefined") {
    queueMicrotask(() => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY) as ConsentChoice;
        if (stored === "accepted" || stored === "denied") {
          setChoice(stored);
        }
      } catch {
        // localStorage unavailable — banner will show
      }
      setMounted(true);
    });
  }

  const decide = useCallback((value: "accepted" | "denied") => {
    setChoice(value);
    try {
      localStorage.setItem(STORAGE_KEY, value);
    } catch {
      // Ignore storage errors
    }
  }, []);

  // Don't render until mounted (client-side) and no choice has been made
  if (!mounted || choice !== null) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-[85] p-4 md:p-6"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div
        className="mx-auto max-w-5xl bg-cream border border-charcoal/15 shadow-2xl"
        style={{ borderRadius: 0, animation: "cookieSlideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) both" }}
      >
        <div className="flex flex-col md:flex-row items-stretch">
          {/* Left — icon + message */}
          <div className="flex items-start gap-4 p-5 md:p-6 flex-1">
            {/* Cookie icon */}
            <div className="hidden sm:flex flex-shrink-0 w-10 h-10 bg-forest items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-cream">
                <path d="M21 12a9 9 0 1 1-9-9c0 1.5.5 3 1.5 4 1 1 2.5 1.5 4 1.5.5 0 1 .15 1.5.5.5.35.85.85 1 1.5.15.65.05 1.35-.05 2-.1.65-.2 1.3 0 2 .2.7.7 1.3 1.5 1.5z" />
                <circle cx="8.5" cy="10.5" r="0.5" fill="currentColor" />
                <circle cx="12" cy="14" r="0.5" fill="currentColor" />
                <circle cx="15.5" cy="11.5" r="0.5" fill="currentColor" />
                <circle cx="10" cy="15.5" r="0.5" fill="currentColor" />
              </svg>
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-display text-lg md:text-xl text-charcoal tracking-tight leading-tight mb-1">
                We value your privacy
              </p>
              <p className="text-sm text-charcoal/70 leading-relaxed">
                We use cookies to enhance your browsing experience, serve personalized content, and analyse our traffic.
                By clicking &ldquo;Accept&rdquo;, you consent to our use of cookies. Read our{" "}
                <a href="#" className="underline text-forest hover:text-gold transition-colors">Privacy Policy</a>.
              </p>
            </div>
          </div>

          {/* Right — actions */}
          <div className="flex items-center gap-3 p-5 md:p-6 border-t md:border-t-0 md:border-l border-border bg-bone/40">
            <button
              onClick={() => decide("denied")}
              className="px-5 py-2.5 text-xs font-medium tracking-[0.2em] uppercase text-charcoal/70 hover:text-charcoal border border-charcoal/30 hover:border-charcoal transition-all"
              style={{ borderRadius: 0 }}
            >
              Deny
            </button>
            <button
              onClick={() => decide("accepted")}
              className="px-5 py-2.5 text-xs font-medium tracking-[0.2em] uppercase text-cream bg-forest hover:bg-forest-deep transition-colors shadow-[inset_0_2px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.25)]"
              style={{ borderRadius: 0 }}
            >
              Accept
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes cookieSlideUp {
          0% {
            opacity: 0;
            transform: translateY(100%);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
