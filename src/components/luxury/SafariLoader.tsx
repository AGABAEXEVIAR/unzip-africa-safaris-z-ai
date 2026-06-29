"use client";

import { useEffect, useState } from "react";

export function SafariLoader() {
  const [hidden, setHidden] = useState(false);
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    // Start fade-out after 0.6s — very fast, minimal disruption
    const fadeTimer = setTimeout(() => setFadingOut(true), 600);
    // Fully remove from DOM after fade completes (1.0s)
    const hideTimer = setTimeout(() => setHidden(true), 1000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-charcoal"
      style={{
        opacity: fadingOut ? 0 : 1,
        pointerEvents: "none",
        willChange: "opacity",
        transition: "opacity 0.4s ease-out",
      }}
    >
      <style>{`
        /* ===== Safari Loader — Fast & Performant ===== */
        /* All animations use only transform + opacity (GPU-accelerated) */

        @keyframes slSunRise {
          0% { transform: translateY(60px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes slTreeGrow {
          0% { transform: scaleY(0); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }

        @keyframes slWordIn {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        @keyframes slBarFill {
          0% { transform: scaleX(0); }
          100% { transform: scaleX(1); }
        }

        @keyframes slDotPulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }

        .sl-sun {
          animation: slSunRise 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .sl-tree {
          transform-origin: bottom center;
          animation: slTreeGrow 0.35s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
          opacity: 0;
        }

        .sl-word {
          animation: slWordIn 0.3s ease-out 0.15s forwards;
          opacity: 0;
        }

        .sl-bar {
          transform-origin: left center;
          animation: slBarFill 0.55s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
        }

        .sl-dot {
          animation: slDotPulse 0.5s ease-in-out infinite;
        }
      `}</style>

      {/* Scene */}
      <div className="relative w-full max-w-sm px-8 flex flex-col items-center">
        {/* Savanna SVG — minimal, lightweight */}
        <div className="relative w-full h-24 mb-5 overflow-hidden">
          <svg viewBox="0 0 400 100" className="w-full h-full" preserveAspectRatio="xMidYMax meet">
            <defs>
              <radialGradient id="slSun" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#C9B187" />
                <stop offset="100%" stopColor="#A88B5C" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* Sun */}
            <circle className="sl-sun" cx="200" cy="55" r="24" fill="url(#slSun)" />
            <circle className="sl-sun" cx="200" cy="55" r="14" fill="#C9B187" opacity="0.9" />

            {/* Acacia tree */}
            <g className="sl-tree" transform="translate(200, 85)">
              <path d="M -1 0 L 0 -14 L 1 0 Z" fill="#1C1A17" />
              <ellipse cx="0" cy="-15" rx="22" ry="3.5" fill="#1C1A17" />
            </g>

            {/* Horizon line */}
            <line x1="0" y1="85" x2="400" y2="85" stroke="#1C1A17" strokeWidth="0.5" opacity="0.4" />
          </svg>
        </div>

        {/* Wordmark */}
        <h1
          className="sl-word font-display text-2xl md:text-3xl tracking-wider text-cream"
          style={{
            fontFamily: "var(--font-cormorant), serif",
            fontWeight: 300,
            letterSpacing: "0.1em",
          }}
        >
          UNZIP AFRICA
        </h1>

        {/* Progress bar — uses transform: scaleX (GPU) instead of width (layout) */}
        <div className="w-full max-w-[160px] h-px bg-cream/10 overflow-hidden mt-5">
          <div
            className="sl-bar h-full w-full"
            style={{ background: "linear-gradient(90deg, var(--gold), var(--gold-soft))" }}
          />
        </div>

        {/* Loading dots */}
        <div className="flex gap-1.5 mt-3">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="sl-dot w-1 h-1 rounded-full bg-gold"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
