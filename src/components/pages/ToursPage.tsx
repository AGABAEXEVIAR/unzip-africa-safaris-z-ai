"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import { useRouter } from "@/lib/router";
import { tourPackages, TourPackage } from "@/lib/content";
import { toast } from "sonner";

// Build filter option lists from the tour data
const destinationsList = Array.from(new Set(tourPackages.map((t) => t.destination)));
const activitiesList = Array.from(new Set(tourPackages.flatMap((t) => t.activities)));
const tripTypesList = Array.from(new Set(tourPackages.map((t) => t.tripType)));
const accommodationLevelsList = Array.from(new Set(tourPackages.map((t) => t.accommodationLevel)));
const nationalParksList = Array.from(new Set(tourPackages.map((t) => t.nationalPark)));

const PRICE_MIN = Math.min(...tourPackages.map((t) => t.priceFrom));
const PRICE_MAX = Math.max(...tourPackages.map((t) => t.priceFrom));
const DURATION_MIN = Math.min(...tourPackages.map((t) => t.durationDays));
const DURATION_MAX = Math.max(...tourPackages.map((t) => t.durationDays));

type FilterState = {
  destinations: string[];
  activities: string[];
  tripTypes: string[];
  accommodationLevels: string[];
  nationalParks: string[];
  priceMax: number;
  durationMax: number;
};

const initialFilters: FilterState = {
  destinations: [],
  activities: [],
  tripTypes: [],
  accommodationLevels: [],
  nationalParks: [],
  priceMax: PRICE_MAX,
  durationMax: DURATION_MAX,
};

export function ToursPage() {
  const { openQuote, navigate } = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [selectedTour, setSelectedTour] = useState<TourPackage | null>(null);
  const [sortBy, setSortBy] = useState<"recommended" | "price-low" | "price-high" | "duration">("recommended");

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
  }, [filters, sortBy]);

  const toggleArrayFilter = (key: keyof Pick<FilterState, "destinations" | "activities" | "tripTypes" | "accommodationLevels" | "nationalParks">, value: string) => {
    setFilters((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((x) => x !== value) : [...f[key], value],
    }));
  };

  const clearFilters = () => setFilters(initialFilters);

  const activeFilterCount =
    filters.destinations.length +
    filters.activities.length +
    filters.tripTypes.length +
    filters.accommodationLevels.length +
    filters.nationalParks.length +
    (filters.priceMax !== PRICE_MAX ? 1 : 0) +
    (filters.durationMax !== DURATION_MAX ? 1 : 0);

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
            Curated Journeys
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-cream text-[2.8rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.95] tracking-tight max-w-[90%]"
            style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
          >
            All Tours
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.1 }}
            className="text-cream/75 text-lg max-w-2xl mt-8 leading-relaxed"
          >
            Explore our complete collection of bespoke safari journeys across East and Southern Africa.
            Filter by destination, duration, activities, and more.
          </motion.p>
        </div>
      </section>

      {/* ====================== FILTERS + TOURS GRID ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          {/* Mobile filter toggle */}
          <MobileFilterToggle filters={filters} setFilters={setFilters} activeCount={activeFilterCount} clearFilters={clearFilters} toggleArrayFilter={toggleArrayFilter} />

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
                />
              </div>
            </aside>

            {/* Tour cards grid */}
            <div className="lg:col-span-9">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-border">
                <div>
                  <p className="font-display text-2xl md:text-3xl text-charcoal tracking-tight">
                    {filteredTours.length} {filteredTours.length === 1 ? "journey" : "journeys"} found
                  </p>
                  <p className="text-sm text-charcoal/55 mt-1">Curated private safaris across Africa</p>
                </div>
                <div className="flex items-center gap-3">
                  <label className="font-eyebrow text-charcoal/50">Sort by</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                    className="bg-transparent border border-border px-4 py-2 text-sm text-charcoal focus:outline-none focus:border-forest transition-colors"
                    style={{ borderRadius: 0 }}
                  >
                    <option value="recommended">Recommended</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="duration">Duration: Longest First</option>
                  </select>
                </div>
              </div>

              {/* Grid */}
              {filteredTours.length === 0 ? (
                <div className="text-center py-24">
                  <p className="font-display text-3xl text-charcoal/60 mb-4">No journeys match your filters.</p>
                  <button onClick={clearFilters} className="btn-luxury btn-luxury-gold mt-4">
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-8">
                  {filteredTours.map((tour, idx) => (
                    <TourCard
                      key={tour.id}
                      tour={tour}
                      onViewDetails={() => setSelectedTour(tour)}
                      onBookNow={() => openQuote()}
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
                <p className="font-eyebrow text-gold-soft mb-6">What's Included</p>
                <h2 className="font-display text-4xl md:text-5xl leading-[1.05] tracking-tight">
                  Every detail, <span className="italic text-gold-soft">composed in advance.</span>
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7 flex items-end">
              <Reveal variant="up" delay={0.2}>
                <p className="text-cream/75 text-lg leading-relaxed">
                  The price of every Unzip Africa journey includes everything below — and countless
                  details we manage silently, so you can simply arrive.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12 border-t border-cream/15 pt-12">
            {[
              { title: "Private Guiding", body: "Your own dedicated guide, vehicle, and tracker from arrival to departure. Never shared." },
              { title: "Charter Flights", body: "All inter-camp flights by private Cessna Caravan, piloted by our own aviation team." },
              { title: "All Lodging & Meals", body: "Every night in luxury lodges or private mobile camps. Every meal, every drink, every sundowner." },
              { title: "Conservation Fees", body: "All park fees, conservation contributions, and community levies — 7% of every journey." },
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
            <p className="font-eyebrow text-gold mb-8">Inspired?</p>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-charcoal tracking-tight">
              Let us compose
              <br />
              <span className="italic text-forest">your journey.</span>
            </h2>
            <p className="text-lg text-charcoal/70 max-w-xl mx-auto mt-10 leading-relaxed">
              Tell us which journey speaks to you — or describe one we have not yet imagined.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <button onClick={openQuote} className="btn-luxury btn-luxury-gold">
                Request a Quote
              </button>
              <button
                onClick={() => navigate("accommodation")}
                className="link-underline text-charcoal/70"
              >
                View Accommodation
              </button>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Tour detail modal */}
      {selectedTour && (
        <TourDetailModal
          tour={selectedTour}
          onClose={() => setSelectedTour(null)}
          onBookNow={() => {
            setSelectedTour(null);
            openQuote();
          }}
        />
      )}
    </div>
  );
}

/* ===================== Filter Sidebar ===================== */
function FilterSidebar({
  filters,
  setFilters,
  toggleArrayFilter,
  clearFilters,
  activeCount,
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  toggleArrayFilter: (key: keyof Pick<FilterState, "destinations" | "activities" | "tripTypes" | "accommodationLevels" | "nationalParks">, value: string) => void;
  clearFilters: () => void;
  activeCount: number;
}) {
  return (
    <div className="bg-alabaster border border-border p-6" style={{ borderRadius: 0 }}>
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
        <p className="font-display text-xl text-charcoal tracking-tight">Filter By</p>
        {activeCount > 0 && (
          <button
            onClick={clearFilters}
            className="text-xs text-charcoal/50 hover:text-gold transition-colors underline"
          >
            Clear ({activeCount})
          </button>
        )}
      </div>

      <div className="space-y-6">
        {/* Destination */}
        <FilterSection title="Destination">
          {destinationsList.map((d) => (
            <FilterCheckbox
              key={d}
              label={d}
              checked={filters.destinations.includes(d)}
              onChange={() => toggleArrayFilter("destinations", d)}
            />
          ))}
        </FilterSection>

        {/* Price */}
        <FilterSection title="Price (per person)">
          <div className="px-1">
            <input
              type="range"
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={1000}
              value={filters.priceMax}
              onChange={(e) => setFilters({ ...filters, priceMax: Number(e.target.value) })}
              className="w-full accent-forest"
            />
            <div className="flex justify-between text-xs text-charcoal/60 mt-2">
              <span>${PRICE_MIN.toLocaleString()}</span>
              <span className="font-medium text-charcoal">${filters.priceMax.toLocaleString()}</span>
            </div>
          </div>
        </FilterSection>

        {/* Duration */}
        <FilterSection title="Duration">
          <div className="px-1">
            <input
              type="range"
              min={DURATION_MIN}
              max={DURATION_MAX}
              step={1}
              value={filters.durationMax}
              onChange={(e) => setFilters({ ...filters, durationMax: Number(e.target.value) })}
              className="w-full accent-forest"
            />
            <div className="flex justify-between text-xs text-charcoal/60 mt-2">
              <span>{DURATION_MIN} days</span>
              <span className="font-medium text-charcoal">up to {filters.durationMax} days</span>
            </div>
          </div>
        </FilterSection>

        {/* Activities */}
        <FilterSection title="Activities">
          {activitiesList.map((a) => (
            <FilterCheckbox
              key={a}
              label={a}
              checked={filters.activities.includes(a)}
              onChange={() => toggleArrayFilter("activities", a)}
            />
          ))}
        </FilterSection>

        {/* Trip Types */}
        <FilterSection title="Trip Types">
          {tripTypesList.map((t) => (
            <FilterCheckbox
              key={t}
              label={t}
              checked={filters.tripTypes.includes(t)}
              onChange={() => toggleArrayFilter("tripTypes", t)}
            />
          ))}
        </FilterSection>

        {/* Accommodation Level */}
        <FilterSection title="Accommodation Level">
          {accommodationLevelsList.map((l) => (
            <FilterCheckbox
              key={l}
              label={l}
              checked={filters.accommodationLevels.includes(l)}
              onChange={() => toggleArrayFilter("accommodationLevels", l)}
            />
          ))}
        </FilterSection>

        {/* National Parks */}
        <FilterSection title="National Parks">
          {nationalParksList.map((p) => (
            <FilterCheckbox
              key={p}
              label={p}
              checked={filters.nationalParks.includes(p)}
              onChange={() => toggleArrayFilter("nationalParks", p)}
            />
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
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between mb-3 text-left"
      >
        <span className="font-label text-charcoal">{title}</span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className={`text-charcoal/50 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {open && <div className="space-y-2">{children}</div>}
    </div>
  );
}

function FilterCheckbox({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group">
      <span
        className={`w-4 h-4 border flex items-center justify-center transition-all flex-shrink-0 ${
          checked ? "bg-forest border-forest" : "border-charcoal/30 group-hover:border-charcoal"
        }`}
        style={{ borderRadius: 0 }}
      >
        {checked && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={`text-sm transition-colors ${checked ? "text-charcoal" : "text-charcoal/65 group-hover:text-charcoal"}`}>
        {label}
      </span>
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
}: {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  activeCount: number;
  clearFilters: () => void;
  toggleArrayFilter: (key: keyof Pick<FilterState, "destinations" | "activities" | "tripTypes" | "accommodationLevels" | "nationalParks">, value: string) => void;
}) {
  const [open, setOpen] = useState(false);

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
        <button
          onClick={() => setOpen(true)}
          className="btn-luxury flex-1 sm:flex-none"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
            <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" />
          </svg>
          Filters {activeCount > 0 && `(${activeCount})`}
        </button>
        {activeCount > 0 && (
          <button onClick={clearFilters} className="text-xs text-charcoal/60 hover:text-gold underline">
            Clear all
          </button>
        )}
      </div>

      {open && (
        <div className="fixed inset-0 z-[60] bg-charcoal/70 backdrop-blur-sm flex">
          <div className="bg-canvas w-full max-w-md h-full overflow-y-auto p-6 ml-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
              <p className="font-display text-2xl text-charcoal">Filters</p>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close filters"
                className="text-charcoal/50 hover:text-charcoal"
              >
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
            />
            <button
              onClick={() => setOpen(false)}
              className="btn-luxury btn-luxury-gold w-full mt-6"
            >
              Show Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===================== Tour Card ===================== */
function TourCard({
  tour,
  onViewDetails,
  onBookNow,
}: {
  tour: TourPackage;
  onViewDetails: () => void;
  onBookNow: () => void;
}) {
  return (
    <article className="bg-alabaster border border-border/60 overflow-hidden flex flex-col group hover:shadow-xl transition-shadow duration-500" style={{ borderRadius: 0 }}>
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bone cursor-pointer" onClick={onViewDetails}>
        <img
          src={tour.image}
          alt={tour.name}
          className="w-full h-full object-cover img-luxury"
        />
        {tour.featured && (
          <div className="absolute top-3 left-3 bg-gold text-charcoal px-3 py-1 text-[0.6rem] font-medium tracking-[0.15em] uppercase" style={{ borderRadius: 0 }}>
            Featured
          </div>
        )}
        {tour.priceOriginal && (
          <div className="absolute top-3 right-3 bg-forest text-cream px-3 py-1 text-[0.6rem] font-medium tracking-[0.15em] uppercase" style={{ borderRadius: 0 }}>
            {Math.round((1 - tour.priceFrom / tour.priceOriginal) * 100)}% Off
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
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span>{tour.durationDays} Days · {tour.durationNights} Nights</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span>Min age {tour.minAge}+</span>
          </div>
          <div className="flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>{tour.destination}</span>
          </div>
        </div>

        {/* Activities tags */}
        <div className="flex flex-wrap gap-1.5 mb-5">
          {tour.activities.slice(0, 3).map((a) => (
            <span key={a} className="text-[0.65rem] text-charcoal/60 border border-border px-2 py-0.5" style={{ borderRadius: 0 }}>
              {a}
            </span>
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
              <p className="text-[0.65rem] text-charcoal/50 tracking-wide">per person</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onViewDetails}
              className="flex-1 border border-charcoal text-charcoal py-2.5 text-[0.65rem] font-medium tracking-[0.2em] uppercase hover:bg-charcoal hover:text-cream transition-all"
              style={{ borderRadius: 0 }}
            >
              Details
            </button>
            <button
              onClick={onBookNow}
              className="flex-1 bg-forest text-cream py-2.5 text-[0.65rem] font-medium tracking-[0.2em] uppercase hover:bg-forest-deep transition-colors shadow-[inset_0_2px_0_rgba(255,255,255,0.15),inset_0_-2px_0_rgba(0,0,0,0.25)]"
              style={{ borderRadius: 0 }}
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ===================== Tour Detail Modal ===================== */
function TourDetailModal({
  tour,
  onClose,
  onBookNow,
}: {
  tour: TourPackage;
  onClose: () => void;
  onBookNow: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[70] bg-charcoal/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: 50, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="bg-canvas w-full max-w-[1100px] my-auto max-h-[92vh] overflow-y-auto no-scrollbar grid grid-cols-1 md:grid-cols-2"
        style={{ borderRadius: 0 }}
      >
        {/* Image */}
        <div className="relative aspect-square md:aspect-auto md:min-h-[600px] overflow-hidden bg-bone">
          <img src={tour.image} alt={tour.name} className="absolute inset-0 w-full h-full object-cover" />
          {tour.featured && (
            <div className="absolute top-4 left-4 bg-gold text-charcoal px-3 py-1.5 text-[0.65rem] font-medium tracking-[0.15em] uppercase" style={{ borderRadius: 0 }}>
              Featured
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 md:p-12 flex flex-col">
          <button
            onClick={onClose}
            className="self-end mb-4 text-charcoal/50 hover:text-charcoal transition-colors"
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <p className="font-eyebrow text-gold mb-3">{tour.subtitle}</p>
          <h2 className="font-display text-3xl md:text-4xl text-charcoal tracking-tight mb-4 leading-[1.05]" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            {tour.name}
          </h2>

          <div className="flex flex-wrap gap-4 mb-6 text-sm text-charcoal/70">
            <span>📅 {tour.durationDays} days · {tour.durationNights} nights</span>
            <span>👤 Min age {tour.minAge}+</span>
            <span>📍 {tour.destination}</span>
          </div>

          <div className="border-t border-border pt-4 mb-6">
            <p className="font-eyebrow text-charcoal/40 mb-3">Highlights</p>
            <ul className="space-y-2">
              {tour.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2 text-sm text-charcoal/75">
                  <span className="text-gold mt-1 leading-none">—</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border pt-4 mb-6">
            <p className="font-eyebrow text-charcoal/40 mb-3">Activities</p>
            <div className="flex flex-wrap gap-2">
              {tour.activities.map((a) => (
                <span key={a} className="text-xs text-charcoal/70 border border-border px-3 py-1" style={{ borderRadius: 0 }}>
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-border">
            <div className="flex items-end justify-between mb-4">
              <div>
                {tour.priceOriginal && (
                  <p className="text-sm text-charcoal/40 line-through">${tour.priceOriginal.toLocaleString()}</p>
                )}
                <p className="font-display text-3xl md:text-4xl text-forest italic" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  ${tour.priceFrom.toLocaleString()}
                </p>
                <p className="text-xs text-charcoal/50">per person</p>
              </div>
              <div className="text-right">
                <p className="font-eyebrow text-charcoal/40">Trip Type</p>
                <p className="text-sm text-charcoal/75">{tour.tripType}</p>
              </div>
            </div>
            <button onClick={onBookNow} className="btn-luxury btn-luxury-gold w-full">
              Book This Journey
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
