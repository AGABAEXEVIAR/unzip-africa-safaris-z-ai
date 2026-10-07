"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";
import { useLang } from "@/lib/language";
import { useTours } from "@/lib/store";
import type { TourPackage } from "@/lib/content";

const sharp = { borderRadius: 0 } as const;

export function FeaturedTrips() {
  const tours = useTours();
  const featured = tours.filter((t) => t.featured);
  const { navigateToTour, navigate } = useRouter();
  const { t } = useLang();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: featured.length > 3,
      align: "start",
      containScroll: "trimSnaps",
      dragFree: false,
    },
    featured.length > 1 ? [Autoplay({ delay: 5500, stopOnInteraction: false, stopOnMouseEnter: true })] : []
  );

  const [selected, setSelected] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback((i: number) => emblaApi?.scrollTo(i), [emblaApi]);
  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (featured.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
      <div className="mx-auto max-w-[1600px]">
        {/* Heading + controls */}
        <div className="mb-10 md:mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 max-w-4xl mx-auto text-center md:text-left md:max-w-none md:mx-0">
            <div>
              <Reveal variant="up">
                <p className="font-eyebrow text-gold mb-4">{t("featured.eyebrow")}</p>
              </Reveal>
              <ScrollReveal
                as="h2"
                containerClassName="font-display text-4xl md:text-6xl lg:text-7xl text-charcoal tracking-tight leading-[0.95] block"
                textClassName="block"
                baseOpacity={0.1}
                blurStrength={6}
              >
                {t("featured.featuredLine1")} <span className="italic text-forest">{t("featured.featuredLine2")}</span>
              </ScrollReveal>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0 mx-auto md:mx-0">
              <button
                onClick={scrollPrev}
                aria-label="Previous featured trip"
                className="w-11 h-11 border border-charcoal/30 text-charcoal hover:bg-forest hover:text-cream hover:border-forest transition-colors flex items-center justify-center"
                style={sharp}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <button
                onClick={scrollNext}
                aria-label="Next featured trip"
                className="w-11 h-11 border border-charcoal/30 text-charcoal hover:bg-forest hover:text-cream hover:border-forest transition-colors flex items-center justify-center"
                style={sharp}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
          <Reveal variant="up" delay={0.2}>
            <p className="text-charcoal/70 leading-relaxed mt-6 max-w-2xl mx-auto text-center md:text-left md:mx-0">
              {t("featured.subtitle")}
            </p>
          </Reveal>
        </div>

        {/* Embla viewport — single-row horizontal carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 md:-ml-6">
            {featured.map((tour) => (
              <div
                key={tour.id}
                className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 md:pl-6"
              >
                <FeaturedCard tour={tour} onExplore={() => navigateToTour(tour.id)} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot pagination */}
        {scrollSnaps.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            {scrollSnaps.map((_, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                aria-label={`Go to featured trip ${i + 1}`}
                className={`transition-all duration-300 ${i === selected ? "w-8 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-charcoal/30 hover:bg-charcoal/50"}`}
                style={sharp}
              />
            ))}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-12 md:mt-16">
          <button
            onClick={() => navigate("tours")}
            className="btn-luxury"
          >
            {t("featured.viewAll")}
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
  const { t } = useLang();
  return (
    <article
      className="bg-alabaster border border-border/60 overflow-hidden flex flex-col group card-luxury cursor-pointer h-full"
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
            {t("common.featured")}
          </div>
        )}
        {tour.priceOriginal && (
          <div
            className="absolute top-3 right-3 bg-forest text-cream px-3 py-1 text-[0.6rem] font-medium tracking-[0.15em] uppercase"
            style={sharp}
          >
            {Math.round((1 - tour.priceFrom / tour.priceOriginal) * 100)}% {t("common.off")}
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
              <p className="text-[0.65rem] text-charcoal/50 tracking-wide">{t("common.perPerson")}</p>
            </div>
            <div className="text-right">
              <p className="font-eyebrow text-charcoal/40">{t("common.durationLabel")}</p>
              <p className="text-sm text-charcoal/75">{tour.durationDays} {t("common.daysLower")}</p>
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
            {t("common.explore")}
          </button>
        </div>
      </div>
    </article>
  );
}
