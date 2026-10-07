"use client";

import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";
import { useTours } from "@/lib/store";
import type { TourPackage } from "@/lib/content";

const sharp = { borderRadius: 0 } as const;

export function FeaturedTrips() {
  const tours = useTours();
  const featured = tours.filter((t) => t.featured).slice(0, 3);
  const { navigateToTour, navigate } = useRouter();

  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
      <div className="mx-auto max-w-[1600px]">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6">Hand-picked Journeys</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-5xl md:text-7xl lg:text-8xl text-charcoal tracking-tight leading-[0.95] block max-w-4xl mx-auto"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={6}
          >
            Featured <span className="italic text-forest">journeys.</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-charcoal/70 leading-relaxed mt-6 max-w-2xl mx-auto">
              A small selection of our most-loved private safaris, designed to be adapted around
              you. Each one is a starting point — never a fixed package.
            </p>
          </Reveal>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {featured.map((tour, idx) => (
            <Reveal key={tour.id} variant="up" delay={(idx % 3) * 0.1}>
              <FeaturedCard tour={tour} onExplore={() => navigateToTour(tour.id)} />
            </Reveal>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-12 md:mt-16">
          <button
            onClick={() => navigate("tours")}
            className="btn-luxury"
          >
            View Featured Trips
            <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function FeaturedCard({ tour, onExplore }: { tour: TourPackage; onExplore: () => void }) {
  return (
    <article
      className="bg-alabaster border border-border/60 overflow-hidden flex flex-col group card-luxury cursor-pointer"
      style={sharp}
      onClick={onExplore}
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-bone card-zoom">
        <img
          src={tour.image}
          alt={tour.name}
          className="absolute inset-0 w-full h-full object-cover img-luxury"
        />
        {tour.featured && (
          <div
            className="absolute top-3 left-3 bg-gold text-charcoal px-3 py-1 text-[0.6rem] font-medium tracking-[0.15em] uppercase"
            style={sharp}
          >
            Featured
          </div>
        )}
        {tour.priceOriginal && (
          <div
            className="absolute top-3 right-3 bg-forest text-cream px-3 py-1 text-[0.6rem] font-medium tracking-[0.15em] uppercase"
            style={sharp}
          >
            {Math.round((1 - tour.priceFrom / tour.priceOriginal) * 100)}% Off
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 md:p-6 flex flex-col flex-1">
        <p className="font-eyebrow text-gold mb-2">{tour.subtitle}</p>
        <h3
          className="font-display text-2xl md:text-3xl text-charcoal tracking-tight mb-3 leading-[1.1] group-hover:text-forest transition-colors duration-500"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          {tour.name}
        </h3>

        {/* Highlights */}
        <ul className="space-y-1.5 mb-5">
          {tour.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-charcoal/75">
              <span className="text-gold mt-1 leading-none">—</span>
              <span>{h}</span>
            </li>
          ))}
        </ul>

        {/* Price + CTA */}
        <div className="mt-auto pt-4 border-t border-border">
          <div className="flex items-end justify-between mb-3">
            <div>
              {tour.priceOriginal && (
                <p className="text-xs text-charcoal/40 line-through">
                  ${tour.priceOriginal.toLocaleString()}
                </p>
              )}
              <p
                className="font-display text-2xl md:text-3xl text-forest tracking-tight"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                ${tour.priceFrom.toLocaleString()}
              </p>
              <p className="text-[0.65rem] text-charcoal/50 tracking-wide">per person</p>
            </div>
            <div className="text-right">
              <p className="font-eyebrow text-charcoal/40">Duration</p>
              <p className="text-sm text-charcoal/75">{tour.durationDays} days</p>
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExplore();
            }}
            className="w-full bg-forest text-cream py-2.5 text-[0.65rem] font-medium tracking-[0.2em] uppercase hover:bg-forest-deep transition-colors"
            style={sharp}
          >
            Explore
          </button>
        </div>
      </div>
    </article>
  );
}
