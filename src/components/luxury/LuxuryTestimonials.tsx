"use client";

import { Reveal } from "@/components/luxury/Reveal";
import { useTestimonials } from "@/lib/store";
import { useLang } from "@/lib/language";

// Continuous horizontal marquee — left-to-right infinite loop with edge
// fading on both sides, mirroring the old vertical marquee's top/bottom
// fade. Pauses on hover.

export function LuxuryTestimonials() {
  const all = useTestimonials();
  const { t } = useLang();
  const testimonials = all.filter((tt) => tt.published);

  if (testimonials.length === 0) return null;

  // Duplicate the list so the marquee can loop seamlessly — when the track
  // has scrolled exactly -50% (one full set of originals), the duplicate
  // set is in the original's place and the animation can reset to 0 with
  // no visible jump. This works for any card-count-per-breakpoint because
  // -50% is always one full set of originals regardless of how many fit
  // on screen at once.
  const doubled = [...testimonials, ...testimonials];

  return (
    <section className="bg-forest-deep text-cream py-16 md:py-24 relative overflow-hidden">
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

      {/* Heading — centered above the marquee */}
      <div className="mx-auto max-w-[1600px] relative px-6 md:px-10">
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
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
            <p className="text-cream/65 text-base md:text-lg max-w-md mt-5 leading-relaxed mx-auto">
              {t("testimonials.subtitle")}
            </p>
          </Reveal>
        </div>
      </div>

      {/* Full-bleed marquee with left + right edge fading.
          The fading mirrors the old vertical marquee's top/bottom fade
          but oriented horizontally — gradients from transparent → forest-deep
          on both the left and right edges of the container. */}
      <div className="testimonials-marquee relative">
        {/* Left edge fade */}
        <div className="pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 md:w-32 bg-gradient-to-r from-forest-deep via-forest-deep/80 to-transparent" />
        {/* Right edge fade */}
        <div className="pointer-events-none absolute top-0 bottom-0 right-0 z-10 w-16 md:w-32 bg-gradient-to-l from-forest-deep via-forest-deep/80 to-transparent" />

        {/* Marquee track — pauses on hover via CSS in globals.css */}
        <div className="testimonials-marquee-track">
          {doubled.map((testimonial, idx) => (
            <div
              key={`${testimonial.id}-${idx}`}
              className="testimonials-marquee-item"
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
    </section>
  );
}
