"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";
import { useAccommodations } from "@/lib/store";

const sharp = { borderRadius: 0 } as const;

export function AccommodationPage() {
  const accommodations = useAccommodations();
  const { navigate, navigateToAccommodation } = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  // Asymmetric layout patterns — index-based
  const layouts = [
    "md:col-span-7 md:row-span-2",
    "md:col-span-5",
    "md:col-span-5",
    "md:col-span-5",
    "md:col-span-7",
    "md:col-span-12 md:row-span-1",
  ];

  return (
    <div className="page-enter">
      {/* ====================== HERO ====================== */}
      <section ref={heroRef} className="relative h-[85vh] min-h-[600px] overflow-hidden bg-charcoal grain">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 will-change-transform">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=2400&q=85"
            alt="Luxury safari lodge overlooking the wilderness"
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
            Where You'll Sleep
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-cream text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] leading-[0.95] tracking-tight max-w-[90%]"
            style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
          >
            Tented suites,
            <br />
            <span className="italic text-gold-soft">granite kopjes,</span>
            <br />
            star beds.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.1 }}
            className="text-cream/75 text-lg max-w-2xl mt-10 leading-relaxed"
          >
            A curated collection of camps and lodges — from palatial cliff-top retreats to intimate
            mobile tents that move with the migration. Each one chosen for its silence.
          </motion.p>
        </div>
      </section>

      {/* ====================== INTRO TEXT ====================== */}
      <section className="py-32 md:py-40 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">The Collection</p>
              <p className="font-label text-charcoal/60">
                Six properties, <br /> each a destination of its own
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <ScrollReveal
              as="p"
              containerClassName="font-display text-2xl md:text-3xl lg:text-4xl leading-[1.35] text-charcoal tracking-tight block"
              textClassName="block"
              baseOpacity={0.15}
              blurStrength={5}
            >
              We do not own these lodges. We partner with them — choosing only those that share our obsession with solitude, our refusal to crowd a horizon, and our commitment to the land on which they stand. Each property below is one we have stayed in, <span className="italic text-forest"> slept under, listened to.</span>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ====================== ASYMMETRIC GALLERY (click to open detail page) ====================== */}
      <section className="px-6 md:px-10 pb-32 md:pb-48">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 auto-rows-[280px] md:auto-rows-[320px]">
            {accommodations.map((acc, idx) => (
              <Reveal
                key={acc.id}
                variant="up"
                delay={idx * 0.08}
                className={`${layouts[idx % layouts.length]} ${idx === 0 ? "md:row-span-2" : ""}`}
              >
                <button
                  onClick={() => navigateToAccommodation(acc.id)}
                  className="group relative w-full h-full overflow-hidden text-left"
                  data-cursor="view"
                >
                  <img
                    src={acc.image}
                    alt={acc.name}
                    className="absolute inset-0 w-full h-full object-cover img-luxury"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/15 to-transparent" />
                  <div className="absolute inset-4 border border-cream/0 group-hover:border-cream/25 transition-all duration-700 pointer-events-none" />

                  <div className="absolute top-5 left-5">
                    <span className="font-eyebrow text-cream/80 bg-charcoal/30 backdrop-blur-sm px-3 py-1.5">
                      {acc.type}
                    </span>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <p className="font-eyebrow text-gold-soft mb-2">{acc.location}</p>
                    <h3 className={`font-display text-cream tracking-tight mb-2 ${idx === 0 ? "text-3xl md:text-5xl" : "text-2xl md:text-3xl"}`} style={{ fontFamily: "var(--font-cormorant), serif" }}>
                      {acc.name}
                    </h3>
                    {idx === 0 && (
                      <p className="text-cream/75 text-sm leading-relaxed max-w-md mb-3 line-clamp-2">
                        {acc.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-3 border-t border-cream/20">
                      <span className="font-label text-cream/60">{acc.pricePerNight}</span>
                      <span className="font-eyebrow text-cream/60 group-hover:text-gold-soft transition-colors">
                        View
                      </span>
                    </div>
                  </div>
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== PHILOSOPHY BAND ====================== */}
      <section className="relative py-32 md:py-48 px-6 md:px-10 bg-forest text-cream overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, rgba(201,177,135,0.5) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="mx-auto max-w-[1300px] relative">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold-soft mb-8">Our Standards</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight max-w-4xl mb-16 text-cream block"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            What every property <span className="italic text-gold-soft">must deliver.</span>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 border-t border-cream/15 pt-12">
            {[
              { title: "Solitude by Design", body: "Fewer than 12 suites. No property we partner with has more — and several have only four." },
              { title: "Architectural Restraint", body: "Materials drawn from the site itself — volcanic stone, reclaimed leadwood, woven bamboo. Nothing imported for show." },
              { title: "Light Footprint", body: "Solar power, composting systems, water recycling. Every property is independently audited annually." },
              { title: "Community Equity", body: "Each lodge is at least 30% owned by its local community. Your stay directly funds schools and clinics." },
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
            <p className="font-eyebrow text-gold mb-8">Where Will You Sleep?</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-charcoal tracking-tight block mb-12"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={6}
          >
            The choice is yours. <span className="italic text-forest">The silence is ours to compose.</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <button onClick={() => navigate("contact")} className="btn-luxury btn-luxury-gold">
                Request a Quote
              </button>
              <button
                onClick={() => navigate("tours")}
                className="link-underline text-charcoal/70"
              >
                Explore Tours
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
