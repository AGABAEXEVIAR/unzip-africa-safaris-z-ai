"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import SafariHero from "@/components/luxury/SafariHero";
import { WelcomeSection } from "@/components/luxury/WelcomeSection";
import { SafariScrollStack } from "@/components/luxury/SafariScrollStack";
import { LuxuryTestimonials } from "@/components/luxury/LuxuryTestimonials";
import {
  FAQSection,
  WhyChooseUsSection,
  FounderMessageSection,
  SafariCarsSection,
  ScheduledTripsSection,
} from "@/components/luxury/FAQAndWhyChooseUs";
import { FeaturedTrips } from "@/components/luxury/FeaturedTrips";
import { useRouter } from "@/lib/router";
import { useLang } from "@/lib/language";
import { destinations } from "@/lib/content";

export function HomePage() {
  const { navigate } = useRouter();
  const { t } = useLang();

  return (
    <div className="page-enter">
      {/* ====================== HERO — Cinematic Safari Video ====================== */}
      <SafariHero />

      {/* ====================== WELCOME SECTION ====================== */}
      <WelcomeSection />

      {/* ====================== SCHEDULED TRIPS ====================== */}
      <ScheduledTripsSection />

      {/* ====================== DESTINATIONS (Signature Destinations grid) ====================== */}
      <SafariScrollStack />

      {/* ====================== FEATURED TRIPS ====================== */}
      <FeaturedTrips />

      {/* ====================== WHY CHOOSE US ====================== */}
      <WhyChooseUsSection />

      {/* ====================== REVIEWS / TESTIMONIALS ====================== */}
      <LuxuryTestimonials />

      {/* ====================== FOUNDER MESSAGE ====================== */}
      <FounderMessageSection />

      {/* ====================== SAFARI CARS ====================== */}
      <SafariCarsSection />

      {/* ====================== FAQ ====================== */}
      <FAQSection />

      {/* ====================== OUR TOP SAFARI PARKS (Horizontal Filmstrip) ====================== */}
      <HorizontalDestinations />

      {/* ====================== FINAL CTA — The wild is waiting ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-bone/50">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">
            {/* Left — Text content */}
            <div>
              <Reveal variant="up">
                <p className="font-eyebrow text-gold mb-6">{t("cta.eyebrow")}</p>
              </Reveal>
              <ScrollReveal
                as="h2"
                containerClassName="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] text-charcoal tracking-tight block mb-8"
                textClassName="block"
                baseOpacity={0.1}
                blurStrength={6}
              >
                {t("cta.heading1")} <span className="italic text-forest">{t("cta.heading2")}</span>
              </ScrollReveal>
              <Reveal variant="up" delay={0.2}>
                <p className="text-base md:text-lg text-charcoal/70 max-w-xl leading-relaxed mb-10">
                  {t("cta.subtitle")}
                </p>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <button onClick={() => navigate("contact")} className="btn-luxury btn-luxury-gold">
                    {t("cta.contact")}
                  </button>
                  <button
                    onClick={() => navigate("contact")}
                    className="link-underline text-charcoal/70"
                  >
                    {t("cta.speakSpecialist")}
                  </button>
                </div>
              </Reveal>
            </div>

            {/* Right — YouTube Video */}
            <Reveal variant="right" delay={0.2}>
              <div className="relative w-full overflow-hidden bg-charcoal shadow-2xl card-luxury" style={{ borderRadius: 0 }}>
                <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src="https://www.youtube.com/embed/SJrIPSPuASU?si=dxm70rdjVhjIhjVT"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
                {/* Decorative frame border */}
                <div className="absolute inset-3 md:inset-4 border border-cream/15 pointer-events-none" />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ===================== Horizontal Destinations Filmstrip ===================== */
function HorizontalDestinations() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [trackWidth, setTrackWidth] = useState(0);
  const [viewportH, setViewportH] = useState(800);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        setTrackWidth(Math.max(0, trackRef.current.scrollWidth - window.innerWidth));
      }
      setViewportH(window.innerHeight);
    };
    measure();
    const t = setTimeout(measure, 600);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -trackWidth]);
  const { navigate } = useRouter();
  const { t } = useLang();

  return (
    <>
      {/* Section heading */}
      <div className="px-6 md:px-10 pt-8 md:pt-12 pb-6 md:pb-10">
        <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="max-w-3xl">
            <p className="font-eyebrow text-gold mb-3 md:mb-4">{t("destinations.eyebrow")}</p>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-3xl md:text-6xl text-charcoal tracking-tight leading-[1.05] block"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              {t("destinations.heading1")} <span className="italic text-forest">{t("destinations.heading2")}</span>
            </ScrollReveal>
            <p className="text-sm md:text-lg text-charcoal/70 leading-relaxed mt-4 md:mt-6 max-w-2xl">
              {t("destinations.subtitle")}
            </p>
          </div>
          <p className="font-label text-charcoal/50 hidden md:block flex-shrink-0">
            {t("destinations.scrollHint")}
          </p>
        </div>
      </div>

      {/* Sticky filmstrip section — pans horizontally as user scrolls (all devices) */}
      <section
        ref={sectionRef}
        className="relative"
        style={{ height: `${trackWidth + viewportH}px` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden flex flex-col justify-center">
          {/* Filmstrip track */}
          <motion.div
            ref={trackRef}
            style={{ x }}
            className="flex gap-6 md:gap-10 px-6 md:px-10 will-change-transform"
          >
          {destinations.map((dest, idx) => (
            <article
              key={dest.id}
              data-cursor="view"
              onClick={() => navigate("tours")}
              className="group relative flex-shrink-0 w-[80vw] sm:w-[55vw] md:w-[42vw] lg:w-[34vw] aspect-[3/4] overflow-hidden cursor-pointer"
            >
              <img
                src={dest.imagePortrait}
                alt={dest.name}
                className="absolute inset-0 w-full h-full object-cover img-luxury"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />

              {/* Number */}
              <div className="absolute top-6 left-6 font-display text-cream/60 text-2xl italic">
                0{idx + 1}
              </div>

              {/* Country tag */}
              <div className="absolute top-6 right-6">
                <span className="font-eyebrow text-cream/80 bg-charcoal/30 backdrop-blur-sm px-3 py-2">
                  {dest.country}
                </span>
              </div>

              {/* Bottom content */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-10">
                <p className="font-eyebrow text-gold-soft mb-3">{dest.tagline}</p>
                <h3 className="font-display text-4xl md:text-5xl text-cream tracking-tight mb-3">
                  {dest.name}
                </h3>
                <p className="text-cream/70 text-sm leading-relaxed max-w-md mb-5 line-clamp-3 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  {dest.description}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-cream/20">
                  <span className="font-label text-cream/70">{dest.days}</span>
                </div>
              </div>

              {/* Hover border */}
              <div className="absolute inset-4 border border-cream/0 group-hover:border-cream/30 transition-all duration-700 pointer-events-none" />
            </article>
          ))}

          {/* End card */}
          <div
            data-cursor="view"
            onClick={() => navigate("tours")}
            className="group flex-shrink-0 w-[60vw] md:w-[28vw] aspect-[3/4] flex flex-col items-center justify-center text-center px-6 bg-forest cursor-pointer"
          >
            <p className="font-eyebrow text-gold-soft mb-4">View All</p>
            <p className="font-display text-cream text-3xl md:text-4xl leading-tight">
              Explore every <span className="italic">journey</span>
            </p>
            <span className="mt-8 text-cream/70 group-hover:translate-x-2 transition-transform duration-500">
              →
            </span>
          </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
