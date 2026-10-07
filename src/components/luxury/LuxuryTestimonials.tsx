"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { Reveal } from "@/components/luxury/Reveal";
import { useTestimonials } from "@/lib/store";
import { useLang } from "@/lib/language";

const sharp = { borderRadius: 0 } as const;

export function LuxuryTestimonials() {
  const all = useTestimonials();
  const { t } = useLang();
  const testimonials = all.filter((tt) => tt.published);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: testimonials.length > 3,
      align: "start",
      containScroll: "trimSnaps",
      dragFree: false,
    },
    [Autoplay({ delay: 4500, stopOnInteraction: false, stopOnMouseEnter: true })]
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

  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  if (testimonials.length === 0) return null;

  return (
    <section className="bg-forest-deep text-cream py-16 md:py-24 px-6 md:px-10 relative overflow-hidden">
      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 50%, rgba(201,177,135,0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1600px] relative">
        {/* Header row — heading on left, controls on right */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-2xl">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold-soft mb-3">{t("testimonials.eyebrow")}</p>
              <h2
                className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-cream"
                style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
              >
                {t("testimonials.heading1")}
                <br />
                <span className="italic text-gold-soft">{t("testimonials.heading2")}</span>
              </h2>
              <p className="text-cream/65 text-base md:text-lg max-w-md mt-5 leading-relaxed">
                {t("testimonials.subtitle")}
              </p>
            </Reveal>
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              onClick={scrollPrev}
              aria-label="Previous testimonials"
              className="w-12 h-12 border border-cream/30 text-cream hover:bg-cream hover:text-forest transition-colors flex items-center justify-center"
              style={sharp}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next testimonials"
              className="w-12 h-12 border border-cream/30 text-cream hover:bg-cream hover:text-forest transition-colors flex items-center justify-center"
              style={sharp}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Embla viewport — horizontal carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-4 md:-ml-6">
            {testimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] min-w-0 pl-4 md:pl-6"
              >
                <div className="bg-cream/[0.06] backdrop-blur-sm border border-cream/10 transition-all duration-300 hover:bg-cream/[0.1] p-6 md:p-8 h-full flex flex-col">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden ring-1 ring-gold/30 flex-shrink-0">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span
                          className="text-cream text-base font-medium tracking-tight"
                          style={{ fontFamily: "var(--font-cormorant), serif" }}
                        >
                          {testimonial.name}
                        </span>
                        <span className="text-cream/55 text-xs">
                          {testimonial.role}
                        </span>
                      </div>
                    </div>
                    <svg
                      className="h-7 w-7 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      style={{ color: "var(--gold)" }}
                    >
                      <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                    </svg>
                  </div>
                  <p
                    className="text-cream/85 text-base leading-relaxed italic flex-1"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    &ldquo;{testimonial.content}&rdquo;
                  </p>
                </div>
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
                aria-label={`Go to testimonial ${i + 1}`}
                className={`transition-all duration-300 ${i === selected ? "w-8 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-cream/40 hover:bg-cream/70"}`}
                style={sharp}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
