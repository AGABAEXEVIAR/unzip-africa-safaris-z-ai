"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import { useRouter } from "@/lib/router";
import { tourPackages, TourPackage } from "@/lib/content";

export function ToursPage() {
  const { openQuote, navigate } = useRouter();
  const [selectedTour, setSelectedTour] = useState<TourPackage>(tourPackages[0]);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <div className="page-enter">
      {/* ====================== HERO ====================== */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[600px] overflow-hidden bg-charcoal grain">
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
            className="font-display text-cream text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] leading-[0.95] tracking-tight max-w-[90%]"
          >
            Composed itineraries,
            <br />
            <span className="italic text-gold-soft">never replicated.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.1 }}
            className="text-cream/75 text-lg max-w-2xl mt-10 leading-relaxed"
          >
            Three sample journeys to inspire your imagination. Each is a starting point — every
            safari we plan is bespoke, composed for a single party.
          </motion.p>
        </div>
      </section>

      {/* ====================== TOUR SELECTOR ====================== */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6 text-center">Select a Journey</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-20">
            {tourPackages.map((tour, idx) => (
              <Reveal key={tour.id} variant="up" delay={idx * 0.1}>
                <button
                  onClick={() => setSelectedTour(tour)}
                  className={`group relative w-full text-left overflow-hidden aspect-[4/5] ${
                    selectedTour.id === tour.id ? "ring-2 ring-gold" : ""
                  }`}
                  data-cursor="view"
                >
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="absolute inset-0 w-full h-full object-cover img-luxury"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent" />
                  <div className="absolute inset-0 border border-cream/0 group-hover:border-cream/20 transition-all duration-700" />

                  <div className="absolute top-5 left-5">
                    <span className="font-eyebrow text-cream/80 bg-charcoal/30 backdrop-blur-sm px-3 py-1.5">
                      0{idx + 1}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8">
                    <p className="font-eyebrow text-gold-soft mb-3">{tour.duration}</p>
                    <h3 className="font-display text-2xl md:text-3xl text-cream tracking-tight mb-2">
                      {tour.name}
                    </h3>
                    <p className="text-cream/70 text-sm leading-relaxed">{tour.subtitle}</p>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== SELECTED TOUR DETAIL ====================== */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedTour.id}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <TourDetail tour={selectedTour} onRequestQuote={openQuote} />
        </motion.div>
      </AnimatePresence>

      {/* ====================== COMPARISON BAND ====================== */}
      <section className="py-32 md:py-40 px-6 md:px-10 bg-forest text-cream">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
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
    </div>
  );
}

/* ===================== Tour Detail with Interactive Itinerary ===================== */
function TourDetail({ tour, onRequestQuote }: { tour: TourPackage; onRequestQuote: () => void }) {
  const [activeDay, setActiveDay] = useState(0);
  const dayRefs = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    dayRefs.current.forEach((el, idx) => {
      if (!el) return;
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveDay(idx);
            }
          });
        },
        { threshold: 0.5, rootMargin: "-20% 0px -30% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [tour.id]);

  return (
    <>
      {/* Tour summary band */}
      <section className="py-20 md:py-28 px-6 md:px-10 bg-alabaster">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-7">
              <p className="font-eyebrow text-gold mb-4">{tour.subtitle}</p>
              <h2 className="font-display text-5xl md:text-7xl text-charcoal tracking-tight leading-[1.02] mb-6">
                {tour.name}
              </h2>
              <div className="flex flex-wrap gap-6 mt-6">
                <div>
                  <p className="font-eyebrow text-charcoal/40 mb-1">Duration</p>
                  <p className="font-display text-2xl text-charcoal">{tour.duration}</p>
                </div>
                <div className="w-px bg-border self-stretch" />
                <div>
                  <p className="font-eyebrow text-charcoal/40 mb-1">Investment</p>
                  <p className="font-display text-2xl text-forest italic">{tour.price}</p>
                </div>
              </div>
            </div>

            <div className="md:col-span-5 flex flex-col justify-end">
              <ul className="space-y-3 mb-8">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-3 text-charcoal/80">
                    <span className="font-display text-gold italic mt-1 leading-none">—</span>
                    <span className="text-sm leading-relaxed">{h}</span>
                  </li>
                ))}
              </ul>
              <button onClick={onRequestQuote} className="btn-luxury btn-luxury-gold self-start">
                Request This Journey
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive itinerary timeline */}
      <section className="relative py-20 md:py-32 px-6 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-4 text-center">The Itinerary</p>
            <h2 className="font-display text-4xl md:text-6xl text-charcoal tracking-tight text-center mb-4 leading-[1.05]">
              Day by day, <span className="italic text-forest">composed in advance.</span>
            </h2>
            <p className="text-charcoal/60 text-center max-w-md mx-auto mb-20">
              Scroll through the journey. Each day reveals itself as you move.
            </p>
          </Reveal>

          {/* Day progress rail (sticky) */}
          <div className="hidden md:block sticky top-24 z-30 mb-16 bg-canvas/80 backdrop-blur-md py-6">
            <div className="mx-auto max-w-[1400px] relative px-10">
              <div className="relative h-px bg-border">
                <div
                  ref={progressRef}
                  className="absolute left-0 top-0 h-px bg-gold transition-all duration-700"
                  style={{ width: `${((activeDay + 1) / tour.days.length) * 100}%` }}
                />
                <div className="absolute inset-0 flex justify-between -translate-y-1/2 top-1/2">
                  {tour.days.map((day, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        dayRefs.current[idx]?.scrollIntoView({
                          behavior: "smooth",
                          block: "center",
                        });
                      }}
                      className="group flex flex-col items-center gap-3"
                      aria-label={`Jump to ${day.day}`}
                    >
                      <span
                        className={`block w-3 h-3 rounded-full ring-4 transition-all duration-500 ${
                          idx <= activeDay
                            ? "bg-gold ring-cream scale-110"
                            : "bg-charcoal/20 ring-cream group-hover:bg-charcoal/40"
                        }`}
                      />
                      <span
                        className={`font-eyebrow transition-colors duration-500 ${
                          idx === activeDay ? "text-charcoal" : "text-charcoal/40"
                        }`}
                      >
                        {day.day}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Day-by-day timeline */}
          <div className="max-w-[1100px] mx-auto space-y-32 md:space-y-48">
            {tour.days.map((day, idx) => (
              <div
                key={idx}
                ref={(el) => { dayRefs.current[idx] = el; }}
                className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start"
              >
                {/* Left: Day number */}
                <div className="md:col-span-3">
                  <div className="sticky top-32">
                    <p className={`font-display text-7xl md:text-8xl italic transition-colors duration-700 ${idx === activeDay ? "text-gold" : "text-charcoal/15"}`}>
                      {idx + 1}
                    </p>
                    <p className="font-eyebrow text-charcoal/50 mt-2">{day.day}</p>
                  </div>
                </div>

                {/* Middle: Image */}
                <div className="md:col-span-5">
                  <div className="relative aspect-[4/3] overflow-hidden bg-bone">
                    <img
                      src={day.image}
                      alt={`${day.day} — ${day.title}`}
                      className="absolute inset-0 w-full h-full object-cover img-luxury"
                    />
                  </div>
                </div>

                {/* Right: Content */}
                <div className="md:col-span-4 md:pt-8">
                  <h3 className="font-display text-3xl md:text-4xl text-charcoal tracking-tight mb-5 leading-[1.05]">
                    {day.title}
                  </h3>
                  <p className="text-charcoal/75 leading-relaxed">{day.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
