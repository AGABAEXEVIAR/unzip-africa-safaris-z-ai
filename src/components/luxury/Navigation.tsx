"use client";

import { useEffect, useState } from "react";
import { useRouter, PageId } from "@/lib/router";
import { useLang } from "@/lib/language";
import { LanguageSwitcher, CompactLanguageSwitcher } from "@/components/luxury/LanguageSwitcher";
import { destinationCountries } from "@/lib/destinations";
import { cn } from "@/lib/utils";

const navItems: { id: PageId; labelKey: string }[] = [
  { id: "home", labelKey: "nav.home" },
  { id: "tours", labelKey: "nav.tours" },
  { id: "scheduled-trips", labelKey: "nav.scheduledTrips" },
  { id: "contact", labelKey: "nav.contact" },
];

// About dropdown sub-items (Company + Accommodation)
const aboutItems: { id: PageId; labelKey: string }[] = [
  { id: "company", labelKey: "nav.company" },
  { id: "accommodation", labelKey: "nav.accommodation" },
];

export function Navigation() {
  const { page, navigate, navigateToDestination, openQuote, destinationCountry } = useRouter();
  const { t } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [destOpen, setDestOpen] = useState(false);
  const [destCloseTimer, setDestCloseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [aboutCloseTimer, setAboutCloseTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

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

  const handleDestClick = (countryId: string) => {
    navigateToDestination(countryId);
    setMenuOpen(false);
    setDestOpen(false);
  };

  const handleAboutClick = (id: PageId) => {
    navigate(id);
    setMenuOpen(false);
    setAboutOpen(false);
  };

  const openDest = () => {
    if (destCloseTimer) {
      clearTimeout(destCloseTimer);
      setDestCloseTimer(null);
    }
    setDestOpen(true);
  };

  const scheduleDestClose = () => {
    if (destCloseTimer) clearTimeout(destCloseTimer);
    const timer = setTimeout(() => setDestOpen(false), 120);
    setDestCloseTimer(timer);
  };

  const openAbout = () => {
    if (aboutCloseTimer) {
      clearTimeout(aboutCloseTimer);
      setAboutCloseTimer(null);
    }
    setAboutOpen(true);
  };

  const scheduleAboutClose = () => {
    if (aboutCloseTimer) clearTimeout(aboutCloseTimer);
    const timer = setTimeout(() => setAboutOpen(false), 120);
    setAboutCloseTimer(timer);
  };

  // When transparent (not scrolled), use light text over dark hero/imagery
  // When scrolled (cream bg), use dark text
  const textColor = scrolled ? "text-charcoal" : "text-cream";
  const subTextHover = scrolled ? "hover:text-charcoal" : "hover:text-cream";
  const subText = scrolled ? "text-charcoal/60" : "text-cream/70";
  const hamburgerBg = scrolled ? "bg-charcoal" : "bg-cream";

  // Destinations is active when on destinations page
  const destActive = page === "destinations";
  // About dropdown is active when on company/about/accommodation
  const aboutActive = page === "company" || page === "about" || page === "accommodation";

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-700",
          scrolled
            ? "bg-canvas/90 backdrop-blur-md py-4 border-b border-border/40"
            : "bg-transparent py-7"
        )}
        onMouseLeave={() => {
          scheduleDestClose();
          scheduleAboutClose();
        }}
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
            {/* Home */}
            {navItems.slice(0, 1).map((item) => (
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

            {/* About dropdown */}
            <div
              className="relative"
              onMouseEnter={openAbout}
              onMouseLeave={scheduleAboutClose}
            >
              <button
                onClick={() => handleNav("company")}
                className={cn(
                  "font-label transition-colors duration-500 relative py-1 inline-flex items-center gap-1.5",
                  aboutActive ? textColor : cn(subText, subTextHover)
                )}
                aria-expanded={aboutOpen}
                aria-haspopup="true"
              >
                {t("nav.about")}
                <svg
                  className={cn(
                    "w-3 h-3 transition-transform duration-500",
                    aboutOpen ? "rotate-180" : "rotate-0"
                  )}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 right-0 h-px bg-gold transition-transform duration-500 origin-left",
                    aboutActive ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>

              {/* About dropdown panel */}
              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-300 origin-top",
                  aboutOpen
                    ? "opacity-100 pointer-events-auto translate-y-0"
                    : "opacity-0 pointer-events-none -translate-y-1"
                )}
                style={{ zIndex: 60 }}
              >
                <div
                  className={cn(
                    "min-w-[260px] border",
                    scrolled
                      ? "bg-canvas border-border shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]"
                      : "bg-canvas/95 backdrop-blur-md border-cream/15 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)]"
                  )}
                  style={{ borderRadius: 0 }}
                >
                  <div className="px-5 pt-4 pb-2 border-b border-border">
                    <p className="font-eyebrow text-gold text-[0.65rem] tracking-[0.3em]">
                      {t("nav.about")}
                    </p>
                  </div>
                  <ul className="py-2">
                    {aboutItems.map((sub) => {
                      const isActive = page === sub.id;
                      return (
                        <li key={sub.id}>
                          <button
                            onClick={() => handleAboutClick(sub.id)}
                            className={cn(
                              "group w-full flex items-center justify-between gap-3 px-5 py-3 text-left transition-colors duration-300",
                              isActive
                                ? "bg-forest/5 text-forest"
                                : "text-charcoal/80 hover:bg-alabaster hover:text-forest"
                            )}
                            style={{ borderRadius: 0 }}
                          >
                            <span className="font-display text-lg tracking-tight leading-tight" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                              {t(sub.labelKey)}
                            </span>
                            <span
                              className={cn(
                                "font-eyebrow text-[0.6rem] tracking-[0.25em] transition-all duration-300",
                                isActive
                                  ? "text-gold opacity-100 translate-x-0"
                                  : "text-charcoal/40 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                              )}
                            >
                              EXPLORE →
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* Destinations dropdown */}
            <div
              className="relative"
              onMouseEnter={openDest}
              onMouseLeave={scheduleDestClose}
            >
              <button
                onClick={() => {
                  if (destinationCountry) {
                    navigateToDestination(destinationCountry);
                  } else {
                    navigateToDestination(destinationCountries[0].id);
                  }
                }}
                className={cn(
                  "font-label transition-colors duration-500 relative py-1 inline-flex items-center gap-1.5",
                  destActive ? textColor : cn(subText, subTextHover)
                )}
                aria-expanded={destOpen}
                aria-haspopup="true"
              >
                {t("nav.destinations")}
                <svg
                  className={cn(
                    "w-3 h-3 transition-transform duration-500",
                    destOpen ? "rotate-180" : "rotate-0"
                  )}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span
                  className={cn(
                    "absolute -bottom-0.5 left-0 right-0 h-px bg-gold transition-transform duration-500 origin-left",
                    destActive ? "scale-x-100" : "scale-x-0"
                  )}
                />
              </button>

              {/* Dropdown panel */}
              <div
                className={cn(
                  "absolute left-1/2 -translate-x-1/2 top-full pt-4 transition-all duration-300 origin-top",
                  destOpen
                    ? "opacity-100 pointer-events-auto translate-y-0"
                    : "opacity-0 pointer-events-none -translate-y-1"
                )}
                style={{ zIndex: 60 }}
              >
                <div
                  className={cn(
                    "min-w-[260px] border",
                    scrolled
                      ? "bg-canvas border-border shadow-[0_24px_60px_-24px_rgba(0,0,0,0.35)]"
                      : "bg-canvas/95 backdrop-blur-md border-cream/15 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.55)]"
                  )}
                  style={{ borderRadius: 0 }}
                >
                  <div className="px-5 pt-4 pb-2 border-b border-border">
                    <p className="font-eyebrow text-gold text-[0.65rem] tracking-[0.3em]">
                      {t("nav.destinations")}
                    </p>
                  </div>
                  <ul className="py-2">
                    {destinationCountries.map((country) => {
                      const isActive = destActive && destinationCountry === country.id;
                      return (
                        <li key={country.id}>
                          <button
                            onClick={() => handleDestClick(country.id)}
                            className={cn(
                              "group w-full flex items-center justify-between gap-3 px-5 py-3 text-left transition-colors duration-300",
                              isActive
                                ? "bg-forest/5 text-forest"
                                : scrolled
                                ? "text-charcoal/80 hover:bg-alabaster hover:text-forest"
                                : "text-charcoal/80 hover:bg-alabaster hover:text-forest"
                            )}
                            style={{ borderRadius: 0 }}
                          >
                            <span className="font-display text-lg tracking-tight leading-tight" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                              {country.label}
                            </span>
                            <span
                              className={cn(
                                "font-eyebrow text-[0.6rem] tracking-[0.25em] transition-all duration-300",
                                isActive
                                  ? "text-gold opacity-100 translate-x-0"
                                  : "text-charcoal/40 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0"
                              )}
                            >
                              EXPLORE →
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            </div>

            {/* Tours, Scheduled Trips, Contact */}
            {navItems.slice(1).map((item) => (
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

          {/* Right side: language switcher + quote button + mobile menu */}
          <div className="flex items-center gap-3 md:gap-4">
            {/* Desktop language switcher (lg and up — where there's room for the full version) */}
            <div className="hidden lg:block">
              <LanguageSwitcher scrolled={scrolled} />
            </div>
            {/* Compact language switcher for phone/tablet (below lg) — sits next to hamburger */}
            <div className="lg:hidden">
              <CompactLanguageSwitcher scrolled={scrolled} />
            </div>

            <button
              onClick={openQuote}
              className={cn(
                "hidden lg:inline-flex font-label px-6 py-2.5 border transition-all duration-500",
                scrolled
                  ? "border-charcoal text-charcoal hover:bg-charcoal hover:text-cream"
                  : "border-cream/70 text-cream hover:bg-cream hover:text-charcoal"
              )}
              style={{ borderRadius: 0 }}
            >
              {t("nav.requestQuote")}
            </button>

            {/* Mobile/tablet menu toggle */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden flex flex-col gap-[5px] w-6 h-5 items-center justify-center"
              aria-label="Toggle menu"
            >
              <span
                className={cn(
                  "block h-px w-6 transition-all duration-500",
                  menuOpen ? "bg-charcoal" : hamburgerBg,
                  menuOpen && "rotate-45 translate-y-[6px]"
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 transition-all duration-300",
                  menuOpen ? "bg-charcoal" : hamburgerBg,
                  menuOpen && "opacity-0"
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 transition-all duration-500",
                  menuOpen ? "bg-charcoal" : hamburgerBg,
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
          <nav className="flex flex-col gap-1">
            {/* Home */}
            {navItems.slice(0, 1).map((item, idx) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={cn(
                  "font-display text-3xl sm:text-4xl text-left py-2 transition-all duration-700",
                  page === item.id ? "text-charcoal" : "text-charcoal/40",
                  menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                )}
                style={{ transitionDelay: menuOpen ? `${100 + idx * 80}ms` : "0ms" }}
              >
                <span className="font-label text-gold text-[0.65rem] align-top mr-3 -translate-y-1 inline-block">
                  0{idx + 1}
                </span>
                {t(item.labelKey)}
              </button>
            ))}

            {/* About header (mobile) + sub-items */}
            <p
              className={cn(
                "font-label text-gold text-[0.65rem] tracking-[0.3em] uppercase mt-4 mb-1 transition-all duration-700",
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}
              style={{ transitionDelay: menuOpen ? "180ms" : "0ms" }}
            >
              02 · {t("nav.about")}
            </p>
            {aboutItems.map((sub, i) => {
              const idx = 1 + i;
              const isActive = page === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleAboutClick(sub.id)}
                  className={cn(
                    "font-display text-2xl sm:text-3xl text-left py-1.5 pl-8 transition-all duration-700",
                    isActive ? "text-charcoal" : "text-charcoal/40",
                    menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  )}
                  style={{ transitionDelay: menuOpen ? `${100 + idx * 80}ms` : "0ms" }}
                >
                  {t(sub.labelKey)}
                </button>
              );
            })}

            {/* Destinations header (mobile) */}
            <p
              className={cn(
                "font-label text-gold text-[0.65rem] tracking-[0.3em] uppercase mt-4 mb-1 transition-all duration-700",
                menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
              )}
              style={{ transitionDelay: menuOpen ? "420ms" : "0ms" }}
            >
              03 · {t("nav.destinations")}
            </p>
            {destinationCountries.map((country, i) => {
              const idx = 3 + i;
              const isActive = page === "destinations" && destinationCountry === country.id;
              return (
                <button
                  key={country.id}
                  onClick={() => handleDestClick(country.id)}
                  className={cn(
                    "font-display text-2xl sm:text-3xl text-left py-1.5 pl-8 transition-all duration-700",
                    isActive ? "text-charcoal" : "text-charcoal/40",
                    menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  )}
                  style={{ transitionDelay: menuOpen ? `${100 + idx * 80}ms` : "0ms" }}
                >
                  {country.label}
                </button>
              );
            })}

            {/* Remaining nav items: Tours, Scheduled Trips, Contact */}
            {navItems.slice(1).map((item, i) => {
              const idx = 3 + destinationCountries.length + i;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={cn(
                    "font-display text-3xl sm:text-4xl text-left py-2 mt-2 transition-all duration-700",
                    page === item.id ? "text-charcoal" : "text-charcoal/40",
                    menuOpen ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                  )}
                  style={{ transitionDelay: menuOpen ? `${100 + idx * 80}ms` : "0ms" }}
                >
                  <span className="font-label text-gold text-[0.65rem] align-top mr-3 -translate-y-1 inline-block">
                    0{idx + 1}
                  </span>
                  {t(item.labelKey)}
                </button>
              );
            })}
          </nav>

          <div
            className={cn(
              "mt-10 pt-6 border-t border-border transition-all duration-700",
              menuOpen ? "opacity-100" : "opacity-0"
            )}
            style={{ transitionDelay: menuOpen ? "500ms" : "0ms" }}
          >
            <button
              onClick={() => {
                openQuote();
                setMenuOpen(false);
              }}
              className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 text-xs font-medium tracking-[0.25em] uppercase transition-all duration-500 hover:opacity-85 active:scale-[0.97]"
              style={{
                borderRadius: 0,
                border: "1px solid var(--gold)",
                background: "var(--gold)",
                color: "var(--charcoal)",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              {t("nav.requestQuote")}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
