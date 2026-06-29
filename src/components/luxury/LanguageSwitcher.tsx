"use client";

import { useState, useRef, useEffect } from "react";
import { useLang, languageOptions, Lang } from "@/lib/language";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ scrolled }: { scrolled: boolean }) {
  const { lang, setLang } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const current = languageOptions.find((o) => o.id === lang) || languageOptions[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "flex items-center gap-1.5 font-label px-3 py-2 border transition-all duration-500",
          scrolled
            ? "border-charcoal/30 text-charcoal hover:border-charcoal hover:bg-charcoal hover:text-cream"
            : "border-cream/40 text-cream hover:border-cream hover:bg-cream hover:text-charcoal"
        )}
        style={{ borderRadius: 0 }}
        aria-label="Change language"
      >
        <span className="text-sm">{current.flag}</span>
        <span className="text-xs">{current.short}</span>
        <svg
          width="8"
          height="8"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          className={cn("transition-transform duration-300", open && "rotate-180")}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 min-w-[160px] bg-cream border border-border shadow-2xl z-50"
          style={{ borderRadius: 0, animation: "langDropdownIn 0.25s cubic-bezier(0.16, 1, 0.3, 1) both" }}
        >
          {languageOptions.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                setLang(option.id as Lang);
                setOpen(false);
              }}
              className={cn(
                "flex items-center gap-3 w-full px-4 py-3 text-left text-sm transition-colors duration-300 border-b border-border last:border-b-0",
                lang === option.id
                  ? "bg-forest text-cream"
                  : "text-charcoal hover:bg-bone"
              )}
            >
              <span className="text-base">{option.flag}</span>
              <span className="flex-1">{option.label}</span>
              {lang === option.id && (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      <style>{`
        @keyframes langDropdownIn {
          0% {
            opacity: 0;
            transform: translateY(-8px);
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
