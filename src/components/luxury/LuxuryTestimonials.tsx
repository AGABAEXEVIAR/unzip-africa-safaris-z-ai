"use client";

import { useEffect, useRef } from "react";
import { Reveal } from "@/components/luxury/Reveal";
import { useLang } from "@/lib/language";

export function LuxuryTestimonials() {
  const { t } = useLang();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Elfsight platform script
    const existingScript = document.querySelector('script[src="https://elfsightcdn.com/platform.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://elfsightcdn.com/platform.js";
      script.async = true;
      document.body.appendChild(script);
    }
    // Re-trigger widget rendering after script loads
    setTimeout(() => {
      if (containerRef.current && (window as any).ElfsightApp) {
        (window as any).ElfsightApp.init();
      }
    }, 1000);
  }, []);

  return (
    <section className="bg-canvas py-16 md:py-24 overflow-hidden">
      <div className="px-6 md:px-10 max-w-[1600px] mx-auto mb-8 md:mb-12">
        <div className="max-w-3xl text-center mx-auto">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-3 md:mb-4">{t("testimonials.eyebrow")}</p>
          </Reveal>
          <h2 className="font-display text-3xl md:text-6xl text-charcoal tracking-tight leading-[1.05]">
            {t("testimonials.heading1")} <span className="italic text-forest">{t("testimonials.heading2")}</span>
          </h2>
          <p className="text-sm md:text-lg text-charcoal/70 leading-relaxed mt-4 md:mt-6 max-w-2xl">
            {t("testimonials.subtitle")}
          </p>
        </div>
      </div>

      {/* Elfsight TripAdvisor Reviews Widget */}
      <div ref={containerRef} className="elfsight-wrapper px-6 md:px-10 max-w-[1600px] mx-auto">
        <div
          className="elfsight-app-c77fc6ee-2c5f-484b-a2d5-0d7bf5c2b94b"
          data-elfsight-app-lazy
        ></div>
      </div>
    </section>
  );
}
