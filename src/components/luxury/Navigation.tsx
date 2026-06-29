"use client";

import { useEffect, useState } from "react";
import { useRouter, PageId } from "@/lib/router";
import { useLang } from "@/lib/language";
import { LanguageSwitcher } from "@/components/luxury/LanguageSwitcher";
import { cn } from "@/lib/utils";

const navItems: { id: PageId; labelKey: string }[] = [
  { id: "home", labelKey: "nav.home" },
  { id: "about", labelKey: "nav.about" },
  { id: "tours", labelKey: "nav.tours" },
  { id: "accommodation", labelKey: "nav.accommodation" },
  { id: "contact", labelKey: "nav.contact" },
];

export function Navigation() {
  const { page, navigate, openQuote } = useRouter();
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Same behavior on every page: show condensed nav after small scroll
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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

  // When transparent (not scrolled), use light text over dark hero/imagery
  // When scrolled (cream bg), use dark text
  const textColor = scrolled ? "text-charcoal" : "text-cream";
  const subTextHover = scrolled ? "hover:text-charcoal" : "hover:text-cream";
  const subText = scrolled ? "text-charcoal/60" : "text-cream/70";
  const hamburgerBg = scrolled ? "bg-charcoal" : "bg-cream";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          scrolled
            ? "bg-canvas/90 backdrop-blur-md py-4 border-b border-border/40"
            : "bg-transparent py-7"
        )}
      >
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => handleNav("home")}
            className="group flex items-center transition-opacity duration-300 hover:opacity-80"
            aria-label="Unzip Africa Safaris — Home"
          >
            <img
              src="/logo.png"
              alt="Unzip Africa Safaris"
              className="h-9 md:h-11 w-auto"
              style={{
                filter: scrolled ? "none" : "brightness(0) invert(1)",
                transition: "filter 0.5s ease",
              }}
            />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-10">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={cn(
                  "font-label transition-colors duration-500 relative py-1",
                  page === item.id ? textColor : cn(subText, subTextHover)
                )}
              >
                {t(item.labelKey)}
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 right-0 h-px bg-gold transition-transform duration-500 origin-left",
                    page === item.id ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>
            ))}
          </nav>

          {/* Right side: language switcher + quote button */}
          <div className="flex items-center gap-3 md:gap-4">
            <div className="hidden md:block">
              <LanguageSwitcher scrolled={scrolled} />
            </div>
            <button
              onClick={openQuote}
              className={cn(
                "hidden md:inline-flex font-label px-6 py-2.5 border transition-all duration-500",
                scrolled
                  ? "border-charcoal text-charcoal hover:bg-charcoal hover:text-cream"
                  : "border-cream/70 text-cream hover:bg-cream hover:text-charcoal"
              )}
              style={{ borderRadius: 0 }}
            >
              {t("nav.requestQuote")}
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col gap-[5px] w-6 h-5 items-center justify-center"
              aria-label="Toggle menu"
            >
              <span
                className={cn(
                  "block h-px w-6 transition-all duration-500",
                  hamburgerBg,
                  menuOpen && "rotate-45 translate-y-[6px]"
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 transition-all duration-300",
                  hamburgerBg,
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 transition-all duration-500",
                  hamburgerBg,
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
                {t(item.labelKey)}
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
