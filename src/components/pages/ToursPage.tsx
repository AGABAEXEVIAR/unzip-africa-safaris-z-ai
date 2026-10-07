"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";
import { useLang } from "@/lib/language";
import { useTours } from "@/lib/store";
import { BookingModal } from "@/components/luxury/BookingModal";
import type { TourPackage } from "@/lib/content";
import { Calendar, Clock, MapPin, Users } from "lucide-react";

const sharp = { borderRadius: 0 } as const;

export function ToursPage() {
  const tourPackages = useTours();
  const { navigate, navigateToTour } = useRouter();
  const { t } = useLang();

  const heroRef = useRef<HTMLDivElement>(null);
  const [bookingTour, setBookingTour] = useState<TourPackage | null>(null);

  // Build filter option lists from current data
  const destinationsList = useMemo(() => Array.from(new Set(tourPackages.map((t) => t.destination))), [tourPackages]);
  const activitiesList = useMemo(() => Array.from(new Set(tourPackages.flatMap((t) => t.activities))), [tourPackages]);
  const tripTypesList = useMemo(() => Array.from(new Set(tourPackages.map((t) => t.tripType))), [tourPackages]);
  const accommodationLevelsList = useMemo(() => Array.from(new Set(tourPackages.map((t) => t.accommodationLevel))), [tourPackages]);
  const nationalParksList = useMemo(() => Array.from(new Set(tourPackages.map((t) => t.nationalPark))), [tourPackages]);

  const priceBounds = useMemo(() => {
    if (tourPackages.length === 0) return { min: 0, max: 100000 };
    return {
      min: Math.min(...tourPackages.map((t) => t.priceFrom)),
      max: Math.max(...tourPackages.map((t) => t.priceFrom)),
    };
  }, [tourPackages]);

  const durationBounds = useMemo(() => {
    if (tourPackages.length === 0) return { min: 0, max: 30 };
    return {
      min: Math.min(...tourPackages.map((t) => t.durationDays)),
      max: Math.max(...tourPackages.map((t) => t.durationDays)),
    };
  }, [tourPackages]);

  const PRICE_MIN = priceBounds.min;
  const PRICE_MAX = priceBounds.max;
  const DURATION_MIN = durationBounds.min;
  const DURATION_MAX = durationBounds.max;

  // Lazy initialiser so the filters reflect the seeded data on first render
  const [filters, setFilters] = useState<FilterState>(() => ({
    destinations: [],
    activities: [],
    tripTypes: [],
    accommodationLevels: [],
    nationalParks: [],
    priceMax: PRICE_MAX,
    durationMax: DURATION_MAX,
  }));
  const [sortBy, setSortBy] = useState<"recommended" | "price-low" | "price-high" | "duration">("recommended");

  const localInitial: FilterState = useMemo(
    () => ({
      destinations: [],
      activities: [],
      tripTypes: [],
      accommodationLevels: [],
      nationalParks: [],
      priceMax: PRICE_MAX,
      durationMax: DURATION_MAX,
    }),
    [PRICE_MAX, DURATION_MAX]
  );

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Filter + sort tours
  const filteredTours = useMemo(() => {
    let result = tourPackages.filter((t) => {
      if (filters.destinations.length > 0 && !filters.destinations.includes(t.destination)) return false;
      if (filters.activities.length > 0 && !filters.activities.some((a) => t.activities.includes(a))) return false;
      if (filters.tripTypes.length > 0 && !filters.tripTypes.includes(t.tripType)) return false;
      if (filters.accommodationLevels.length > 0 && !filters.accommodationLevels.includes(t.accommodationLevel)) return false;
      if (filters.nationalParks.length > 0 && !filters.nationalParks.includes(t.nationalPark)) return false;
      if (t.priceFrom > filters.priceMax) return false;
      if (t.durationDays > filters.durationMax) return false;
      return true;
    });

    if (sortBy === "price-low") result = [...result].sort((a, b) => a.priceFrom - b.priceFrom);
    if (sortBy === "price-high") result = [...result].sort((a, b) => b.priceFrom - a.priceFrom);
    if (sortBy === "duration") result = [...result].sort((a, b) => b.durationDays - a.durationDays);
    if (sortBy === "recommended") result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));

    return result;
  }, [tourPackages, filters, sortBy]);

  const toggleArrayFilter = (key: keyof Pick<FilterState, "destinations" | "activities" | "tripTypes" | "accommodationLevels" | "nationalParks">, value: string) => {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((x) => x !== value) : [...f[key], value],
    }));
  };

  const clearFilters = () => setFilters(localInitial);

  const activeFilterCount =
    filters.destinations.length +
    filters.activities.length +
    filters.tripTypes.length +
    filters.accommodationLevels.length +
    filters.nationalParks.length +
    (filters.priceMax !== PRICE_MAX ? 1 : 0) +
    (filters.durationMax !== DURATION_MAX ? 1 : 0);

  // Upcoming scheduled trips (sorted by start date)
  return (
    <div className="page-enter">
      {/* ====================== HERO ====================== */}
      <section ref={heroRef} className="relative h-[60vh] min-h-[500px] overflow-hidden bg-charcoal grain">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 will-change-transform">
          <img
            src="https://images.unsplash.com/photo-1542202229-7d93c33f5d07?auto=format&fit=crop&w=2400&q=85"
            alt="Wildebeest migration crossing a river"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/55" />
        </motion.div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="font-eyebrow text-gold-soft mb-8 tracking-[0.4em]"
          >
            {t("tours.eyebrow")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-cream text-[2.8rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.95] tracking-tight max-w-[90%]"
            style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
          >
            {t("tours.title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.1 }}
            className="text-cream/75 text-lg max-w-2xl mt-8 leading-relaxed"
          >
            {t("tours.subtitle1")} {t("tours.subtitle2")}
          </motion.p>
        </div>
      </section>

      {/* ====================== FILTERS + TOURS GRID ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          {/* Mobile filter toggle */}
          <MobileFilterToggle
            filters={filters}
            setFilters={setFilters}
            activeCount={activeFilterCount}
            clearFilters={clearFilters}
            toggleArrayFilter={toggleArrayFilter}
            destinationsList={destinationsList}
            activitiesList={activitiesList}
            tripTypesList={tripTypesList}
            accommodationLevelsList={accommodationLevelsList}
            nationalParksList={nationalParksList}
            priceMin={PRICE_MIN}
            priceMax={PRICE_MAX}
            durationMin={DURATION_MIN}
            durationMax={DURATION_MAX}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Filter Sidebar — desktop */}
            <aside className="hidden lg:block lg:col-span-3">
              <div className="sticky top-28">
                <FilterSidebar
                  filters={filters}
                  setFilters={setFilters}
                  toggleArrayFilter={toggleArrayFilter}
                  clearFilters={clearFilters}
                  activeCount={activeFilterCount}
                  destinationsList={destinationsList}
                  activitiesList={activitiesList}
                  tripTypesList={tripTypesList}
                  accommodationLevelsList={accommodationLevelsList}
                  nationalParksList={nationalParksList}
                  priceMin={PRICE_MIN}
                  priceMax={PRICE_MAX}
                  durationMin={DURATION_MIN}
                  durationMax={DURATION_MAX}
                />
              </div>
            </aside>

            {/* Tour cards grid */}
            <div className="lg:col-span-9">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
                <div>
                  <p className="font-display text-2xl md:text-3xl text-charcoal tracking-tight">
                    {filteredTours.length} {filteredTours.length === 1 ? t("common.journeyFound") : t("common.journeysFound")}
                  </p>
                  <p className="text-sm text-charcoal/55 mt-1">{t("tours.curatedPrivate")}</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="font-eyebrow text-charcoal/50">{t("common.sortBy")}</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="bg-transparent border border-border px-4 py-2 text-sm text-charcoal focus:outline-none focus:border-forest transition-colors"
                    style={{ borderRadius: 0 }}
                  >
                    <option value="recommended">{t("common.recommended")}</option>
                    <option value="price-low">{t("common.priceLow")}</option>
                    <option value="price-high">{t("common.priceHigh")}</option>
                    <option value="duration">{t("common.duration")}</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {filteredTours.length === 0 ? (
                <div className="text-center py-24">
                  <p className="font-display text-3xl text-charcoal/60 mb-4" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                    {t("common.noResults")}
                  </p>
                  <button onClick={clearFilters} className="btn-luxury btn-luxury-gold mt-4">
                    {t("common.clearAllFilters")}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {filteredTours.map((tour) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      onViewDetails={() => navigateToTour(tour.id)}
                      onBookNow={() => setBookingTour(tour)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================== WHAT'S INCLUDED BAND ====================== */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-forest text-cream">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            <div className="md:col-span-5">
              <Reveal variant="up">
                <p className="font-eyebrow text-gold-soft mb-6">{t("tours.included")}</p>
                <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
                  {t("tours.everyDetail1")} <span className="italic text-gold-soft">{t("tours.everyDetail2")}</span>
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7 flex items-end">
              <Reveal variant="up" delay={0.2}>
                <p className="text-cream/75 text-lg leading-relaxed">
                  {t("tours.includesBody")}
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 border-t border-cream/15 pt-12">
            {[
              { title: t("tours.includedTitle1"), body: t("tours.includedBody1") },
              { title: t("tours.includedTitle2"), body: t("tours.includedBody2") },
              { title: t("tours.includedTitle3"), body: t("tours.includedBody3") },
              { title: t("tours.includedTitle4"), body: t("tours.includedBody4") },
            ].map((item, idx) => (
              <Reveal key={item.title} variant="up" delay={idx * 0.1}>
                <h3 className="font-display text-2xl text-gold-soft mb-3">{item.title}</h3>
                <p className="text-cream/70 text-sm leading-relaxed">{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== CTA ====================== */}
      <section className="py-32 md:py-48 px-6 md:px-10">
        <div className="mx-auto max-w-[1100px] text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-8">{t("tours.inspired")}</p>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-charcoal tracking-tight" style={{ fontFamily: "var(--font-cormorant), serif" }}>
              {t("tours.composeLine1")}
              <br />
              <span className="italic text-forest">{t("tours.composeLine2")}</span>
            </h2>
            <p className="text-lg text-charcoal/70 max-w-xl mx-auto mt-10 leading-relaxed">
              {t("tours.composeBody")}
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <button onClick={() => navigate("contact")} className="btn-luxury btn-luxury-gold">
                {t("cta.contact")}
              </button>
              <button
                onClick={() => navigate("accommodation")}
                className="link-underline text-charcoal/70"
              >
                {t("tours.viewAccommodation")}
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Booking modal */}
      {bookingTour && (
        <BookingModal
          tripType="tour"
          trip={bookingTour}
          open
          onClose={() => setBookingTour(null)}
        />
      )}
    </div>
  );
}

type FilterState = {
  destinations: string[];
  activities: string[];
  tripTypes: string[];
  accommodationLevels: string[];
  nationalParks: string[];
  priceMax: number;
  durationMax: number;
};

/* ===================== Filter Sidebar ===================== */
function FilterSidebar({
  filters,
  setFilters,
  toggleArrayFilter,
  clearFilters,
  activeCount,
  destinationsList,
  activitiesList,
  tripTypesList,
  accommodationLevelsList,
  nationalParksList,
  priceMin,
  priceMax,
  durationMin,
  durationMax,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  toggleArrayFilter: (key: keyof Pick<FilterState, "destinations" | "activities" | "tripTypes" | "accommodationLevels" | "nationalParks">, value: string) => void;
  clearFilters: () => void;
  activeCount: number;
  destinationsList: string[];
  activitiesList: string[];
  tripTypesList: string[];
  accommodationLevelsList: string[];
  nationalParksList: string[];
  priceMin: number;
  priceMax: number;
  durationMin: number;
  durationMax: number;
}) {
  const { t } = useLang();
  return (
    <div className="bg-alabaster border border-border p-6" style={sharp}>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <p className="font-display text-xl text-charcoal tracking-tight" style={{ fontFamily: "var(--font-cormorant), serif" }}>{t("common.filterBy")}</p>
        {activeCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-charcoal/50 hover:text-gold transition-colors underline">
            {t("common.clearCount", { count: activeCount })}
          </button>
        )}
      </div>

      <div className="space-y-6">
        <FilterSection title={t("common.destination")}>
          {destinationsList.map((d) => (
            <FilterCheckbox key={d} label={d} checked={filters.destinations.includes(d)} onChange={() => toggleArrayFilter("destinations", d)} />
          ))}
        </FilterSection>

        <FilterSection title={t("common.pricePerPerson")}>
          <div className="px-1">
            <input
              type="range"
              min={priceMin}
              max={priceMax}
              step={1000}
              value={filters.priceMax}
              onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
              className="w-full accent-forest"
            />
            <div className="flex justify-between text-xs text-charcoal/60 mt-2">
              <span>${priceMin.toLocaleString()}</span>
              <span className="font-medium text-charcoal">${filters.priceMax.toLocaleString()}</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title={t("common.durationLabel")}>
          <div className="px-1">
            <input
              type="range"
              min={durationMin}
              max={durationMax}
              step={1}
              value={filters.durationMax}
              onChange={(e) => setFilters({ ...filters, durationMax: Number(e.target.value) })}
              className="w-full accent-forest"
            />
            <div className="flex justify-between text-xs text-charcoal/60 mt-2">
              <span>{durationMin} {t("common.daysLower")}</span>
              <span className="font-medium text-charcoal">{t("common.upToDays", { count: filters.durationMax })}</span>
            </div>
          </div>
        </FilterSection>

        <FilterSection title={t("common.activities")}>
          {activitiesList.map((a) => (
            <FilterCheckbox key={a} label={a} checked={filters.activities.includes(a)} onChange={() => toggleArrayFilter("activities", a)} />
          ))}
        </FilterSection>

        <FilterSection title={t("common.tripTypes")}>
          {tripTypesList.map((tp) => (
            <FilterCheckbox key={tp} label={tp} checked={filters.tripTypes.includes(tp)} onChange={() => toggleArrayFilter("tripTypes", tp)} />
          ))}
        </FilterSection>

        <FilterSection title={t("common.accommodationLevel")}>
          {accommodationLevelsList.map((l) => (
            <FilterCheckbox key={l} label={l} checked={filters.accommodationLevels.includes(l)} onChange={() => toggleArrayFilter("accommodationLevels", l)} />
          ))}
        </FilterSection>

        <FilterSection title={t("common.nationalParks")}>
          {nationalParksList.map((p) => (
            <FilterCheckbox key={p} label={p} checked={filters.nationalParks.includes(p)} onChange={() => toggleArrayFilter("nationalParks", p)} />
          ))}
        </FilterSection>
      </div>
    </div>
  );
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-border pb-4">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between mb-3 text-left">
        <span className="font-label text-charcoal">{title}</span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`text-charcoal/50 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
}

function FilterCheckbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <span
        className={`w-4 h-4 border flex items-center justify-center transition-all flex-shrink-0 ${checked ? "bg-forest border-forest" : "border-charcoal/30 group-hover:border-charcoal"}`}
        style={{ borderRadius: 0 }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={`text-sm transition-colors ${checked ? "text-charcoal" : "text-charcoal/65 group-hover:text-charcoal"}`}>{label}</span>
    </label>
  );
}

/* ===================== Mobile Filter Toggle ===================== */
function MobileFilterToggle({
  filters,
  setFilters,
  activeCount,
  clearFilters,
  toggleArrayFilter,
  destinationsList,
  activitiesList,
  tripTypesList,
  accommodationLevelsList,
  nationalParksList,
  priceMin,
  priceMax,
  durationMin,
  durationMax,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  activeCount: number;
  clearFilters: () => void;
  toggleArrayFilter: (key: keyof Pick<FilterState, "destinations" | "activities" | "tripTypes" | "accommodationLevels" | "nationalParks">, value: string) => void;
  destinationsList: string[];
  activitiesList: string[];
  tripTypesList: string[];
  accommodationLevelsList: string[];
  nationalParksList: string[];
  priceMin: number;
  priceMax: number;
  durationMin: number;
  durationMax: number;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useLang();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <div className="lg:hidden mb-8">
      <div className="flex items-center justify-between gap-4">
        <button onClick={() => setOpen(true)} className="btn-luxury flex-1 sm:flex-none">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
          {activeCount > 0 ? t("common.filtersCount", { count: activeCount }) : t("common.filters")}
        </button>
        {activeCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-charcoal/60 hover:text-gold underline">{t("common.clearAll")}</button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-charcoal/70 backdrop-blur-sm flex">
          <div className="bg-canvas w-full max-w-md h-full overflow-y-auto p-6 ml-auto modal-scroll" style={{ overflowY: "auto", flex: "1 1 0%", minHeight: 0 }}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <p className="font-display text-2xl text-charcoal" style={{ fontFamily: "var(--font-cormorant), serif" }}>{t("common.filters")}</p>
              <button onClick={() => setOpen(false)} aria-label={t("common.close")} className="text-charcoal/50 hover:text-charcoal">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              toggleArrayFilter={toggleArrayFilter}
              clearFilters={clearFilters}
              activeCount={activeCount}
              destinationsList={destinationsList}
              activitiesList={activitiesList}
              tripTypesList={tripTypesList}
              accommodationLevelsList={accommodationLevelsList}
              nationalParksList={nationalParksList}
              priceMin={priceMin}
              priceMax={priceMax}
              durationMin={durationMin}
              durationMax={durationMax}
            />
            <button onClick={() => setOpen(false)} className="btn-luxury btn-luxury-gold w-full mt-6">{t("common.showResults")}</button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== Tour Card ===================== */
function TourCard({ tour, onViewDetails, onBookNow }: { tour: TourPackage; onViewDetails: () => void; onBookNow: () => void }) {
  const { t } = useLang();
  return (
    <article className="bg-alabaster border border-border/60 overflow-hidden flex flex-col group card-luxury" style={sharp}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bone cursor-pointer card-zoom" onClick={onViewDetails}>
        <img src={tour.image} alt={tour.name} className="w-full h-full object-cover img-luxury" />
        {tour.featured && (
          <div className="absolute top-3 left-3 bg-gold text-charcoal px-3 py-1 text-[0.6rem] font-medium tracking-[0.15em] uppercase" style={sharp}>
            {t("common.featured")}
          </div>
        )}
        {tour.priceOriginal && (
          <div className="absolute top-3 right-3 bg-forest text-cream px-3 py-1 text-[0.6rem] font-medium tracking-[0.15em] uppercase" style={sharp}>
            {Math.round((1 - tour.priceFrom / tour.priceOriginal) * 100)}% {t("common.off")}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <h3
          className="font-display text-xl md:text-2xl text-forest tracking-tight mb-3 leading-[1.15] cursor-pointer hover:text-gold transition-colors"
          onClick={onViewDetails}
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          {tour.name}
        </h3>

        {/* Metadata */}
        <div className="space-y-1.5 mb-4 text-xs text-charcoal/60">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>{tour.durationDays} {t("common.days")} · {tour.durationNights} {t("common.nights")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-3 h-3" />
            <span>{t("common.minAge")} {tour.minAge}+</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3 h-3" />
            <span>{tour.destination}</span>
          </div>
        </div>

        {/* Activities tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tour.activities.slice(0, 3).map((a) => (
            <span key={a} className="text-[0.65rem] text-charcoal/60 border border-border px-2 py-0.5" style={sharp}>{a}</span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-end justify-between mb-3">
            <div>
              {tour.priceOriginal && (
                <p className="text-xs text-charcoal/40 line-through">${tour.priceOriginal.toLocaleString()}</p>
              )}
              <p className="font-display text-2xl md:text-3xl text-forest tracking-tight" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                ${tour.priceFrom.toLocaleString()}
              </p>
              <p className="text-[0.65rem] text-charcoal/50 tracking-wide">{t("common.perPerson")}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onViewDetails}
              className="flex-1 border border-charcoal text-charcoal py-2.5 text-[0.65rem] font-medium tracking-[0.2em] uppercase hover:bg-charcoal hover:text-cream transition-all"
              style={sharp}
            >
              {t("common.details")}
            </button>
            <button
              onClick={onBookNow}
              className="flex-1 bg-forest text-cream py-2.5 text-[0.65rem] font-medium tracking-[0.2em] uppercase hover:bg-forest-deep transition-colors"
              style={sharp}
            >
              {t("common.bookNow")}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
