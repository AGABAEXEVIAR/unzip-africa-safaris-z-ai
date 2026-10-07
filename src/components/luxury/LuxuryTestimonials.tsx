"use client";

import { Reveal } from "@/components/luxury/Reveal";
import { useTestimonials } from "@/lib/store";
import { useLang } from "@/lib/language";

export function LuxuryTestimonials() {
  const all = useTestimonials();
  const { t } = useLang();
  const testimonials = all.filter((tt) => tt.published);

  // Duplicate the list so the marquee can loop seamlessly
  const doubled = [...testimonials, ...testimonials];

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

      <div className="mx-auto max-w-6xl relative">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — heading */}
          <div className="flex flex-col items-start space-y-6 text-left">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold-soft mb-2">{t("testimonials.eyebrow")}</p>
              <h2 className="font-display text-4xl md:text-5xl lg:text-6xl leading-[1.05] tracking-tight text-cream">
                {t("testimonials.heading1")}
                <br />
                {t("testimonials.heading2")}
              </h2>
              <p className="text-cream/65 text-base md:text-lg max-w-md mt-6 leading-relaxed">
                {t("testimonials.subtitle")}
              </p>
            </Reveal>
          </div>

          {/* Right — vertical infinite marquee scroll */}
          <div className="relative h-[420px] w-full lg:h-[520px] overflow-hidden">
            {/* Top fade */}
            <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-20 bg-gradient-to-b from-forest-deep to-transparent" />
            {/* Bottom fade */}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-20 bg-gradient-to-t from-forest-deep to-transparent" />

            {/* Marquee track — animates upward infinitely */}
            <div className="testimonials-marquee">
              {doubled.map((testimonial, index) => (
                <div key={index} className="testimonials-marquee-item">
                  <div className="bg-cream/[0.06] backdrop-blur-sm border border-cream/10 transition-all duration-300 hover:bg-cream/[0.1] p-5 md:p-6 mb-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden ring-1 ring-gold/30 flex-shrink-0">
                          <img
                            src={testimonial.avatar}
                            alt={testimonial.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-cream text-sm font-medium font-display tracking-tight">
                            {testimonial.name}
                          </span>
                          <span className="text-cream/55 text-xs">
                            {testimonial.role}
                          </span>
                        </div>
                      </div>
                      <svg
                        className="h-5 w-5 flex-shrink-0"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        style={{ color: "var(--gold)" }}
                      >
                        <path d="M9.983 3v7.391c0 5.704-3.731 9.57-8.983 10.609l-.995-2.151c2.432-.917 3.995-3.638 3.995-5.849h-4v-10h9.983zm14.017 0v7.391c0 5.704-3.748 9.571-9 10.609l-.996-2.151c2.433-.917 3.996-3.638 3.996-5.849h-3.983v-10h9.983z" />
                      </svg>
                    </div>
                    <p className="text-cream/85 text-sm leading-relaxed italic font-display">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
