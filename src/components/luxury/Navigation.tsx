"use client";

import { useEffect, useState } from "react";
import { useRouter, PageId } from "@/lib/router";
import { cn } from "@/lib/utils";

const navItems: { id: PageId; label: string }[] = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "tours", label: "Tours" },
  { id: "accommodation", label: "Accommodation" },
  { id: "contact", label: "Contact" },
];

export function Navigation() {
  const { page, navigate, openQuote } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // On home page, hide nav until user scrolls past the cinematic hero (~80vh)
    // On other pages, show after a small scroll
    const threshold = page === "home" ? window.innerHeight * 0.75 : 40;
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [page]);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen]);

  const handleNav = (id: PageId) => {
    navigate(id);
    setMenuOpen(false);
  };

  // On home page, the nav is invisible until scrolled (SafariHero has its own pill nav)
  // On other pages, always show but with the scrolled style applied based on scroll position
  const isHidden = page === "home" && !scrolled;

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          isHidden
            ? "opacity-0 -translate-y-full pointer-events-none"
            : scrolled
              ? "bg-canvas/90 backdrop-blur-md py-4 border-b border-border/40 opacity-100 translate-y-0"
              : "bg-transparent py-7 opacity-100 translate-y-0"
        )}
      >
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNav("home")}
            className="group flex items-center gap-3"
            aria-label="Unzip Africa Safaris — Home"
          >
            <span className="font-display text-2xl md:text-[1.7rem] text-charcoal leading-none tracking-tight">
              Unzip
            </span>
            <span className="hidden sm:inline font-label text-gold mt-1">Africa</span>
            <span className="font-display text-2xl md:text-[1.7rem] italic text-charcoal/60 leading-none tracking-tight">
              Safaris
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={cn(
                  "font-label transition-colors duration-500 relative py-1",
                  page === item.id ? "text-charcoal" : "text-charcoal/60 hover:text-charcoal"
                )}
              >
                {item.label}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 right-0 h-px bg-gold transition-transform duration-500 origin-left",
                    page === item.id ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>
            ))}
          </nav>

          {/* Right side: quote button */}
          <div className="flex items-center gap-5">
            <button
              onClick={openQuote}
              className="hidden md:inline-flex font-label text-charcoal/80 hover:text-charcoal transition-colors duration-500"
            >
              Request a Quote
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col gap-[5px] w-6 h-5 items-center justify-center"
              aria-label="Toggle menu"
            >
              <span
                className={cn(
                  "block h-px w-6 bg-charcoal transition-all duration-500",
                  menuOpen && "rotate-45 translate-y-[6px]"
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 bg-charcoal transition-all duration-300",
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 bg-charcoal transition-all duration-500",
                  menuOpen && "-rotate-45 -translate-y-[6px]"
                )}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-canvas transition-all duration-700 lg:hidden",
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="h-full flex flex-col justify-center px-8">
          <nav className="flex flex-col gap-2">
            {navItems.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={cn(
                  "font-display text-5xl sm:text-6xl text-left py-3 transition-all duration-700",
                  page === item.id ? "text-charcoal" : "text-charcoal/40",
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                )}
                style={{ transitionDelay: menuOpen ? `${100 + idx * 80}ms` : "0ms" }}
              >
                <span className="font-label text-gold text-xs align-top mr-3 -translate-y-2 inline-block">
                  0{idx + 1}
                </span>
                {item.label}
              </button>
            ))}
          </nav>

          <div
            className={cn(
              "mt-16 pt-8 border-t border-border transition-all duration-700",
              menuOpen ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: menuOpen ? "500ms" : "0ms" }}
          >
            <button
              onClick={() => {
                openQuote();
                setMenuOpen(false);
              }}
              className="btn-luxury btn-luxury-gold w-full"
            >
              Request a Quote
            </button>
            <p className="font-label text-charcoal/50 mt-8 text-center">
              Arusha · Maun · Kigali · Windhoek
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
