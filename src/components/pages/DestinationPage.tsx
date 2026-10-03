"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { LuxuryButton } from "@/components/luxury/LuxuryButton";
import { useRouter } from "@/lib/router";
import { destinations, destinationCountries, type Destination } from "@/lib/destinations";
import { cn } from "@/lib/utils";

export function DestinationPage() {
  const { destinationCountry, navigateToDestination, openQuote } = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const countryId = destinationCountry && destinations[destinationCountry]
    ? destinationCountry
    : "uganda";
  const data: Destination = destinations[countryId];

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);
  const heroOverlay = useTransform(scrollYProgress, [0, 1], [0.55, 0.78]);

  return (
    <div className="page-enter">
      {/* ====================== HERO ====================== */}
      <section ref={heroRef} className="relative h-[80vh] min-h-[560px] overflow-hidden bg-charcoal grain">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 will-change-transform">
          <img
            src={data.heroImage}
            alt={`${data.country} — ${data.tagline}`}
            className="w-full h-full object-cover"
          />
          <motion.div
            style={{ opacity: heroOverlay }}
            className="absolute inset-0 bg-charcoal"
          />
          {/* Subtle gold radial accent at the bottom */}
          <div
            className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
            style={{
              background:
                "linear-gradient(to top, rgba(28,32,29,0.85) 0%, rgba(28,32,29,0) 100%)",
            }}
          />
        </motion.div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="font-eyebrow text-gold-soft mb-6 tracking-[0.4em]"
          >
            {data.intro.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-cream text-[2.8rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.95] tracking-tight max-w-[90%]"
            style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
          >
            {data.country}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 1.0 }}
            className="font-display text-gold-soft text-xl md:text-2xl italic mt-4"
          >
            {data.tagline}
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.2 }}
            className="text-cream/75 text-lg max-w-2xl mt-6 leading-relaxed"
          >
            {data.subtitle}
          </motion.p>
        </div>

        {/* Country switcher pills — bottom of hero */}
        <div className="absolute bottom-6 left-0 right-0 z-10">
          <div className="mx-auto max-w-[1600px] px-6 md:px-10">
            <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3">
              {destinationCountries.map((c) => {
                const active = c.id === countryId;
                return (
                  <button
                    key={c.id}
                    onClick={() => navigateToDestination(c.id)}
                    className={cn(
                      "font-label text-xs tracking-[0.18em] px-4 py-2 border transition-all duration-500",
                      active
                        ? "bg-gold border-gold text-charcoal"
                        : "border-cream/40 text-cream/85 hover:bg-cream/10 hover:border-cream/70"
                    )}
                    style={{ borderRadius: 0 }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ====================== INTRO ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
        <div className="mx-auto max-w-[1300px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
            <div className="lg:col-span-5">
              <Reveal variant="up">
                <p className="font-eyebrow text-gold mb-6">{data.intro.eyebrow}</p>
              </Reveal>
              <ScrollReveal
                as="h2"
                containerClassName="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.02] block"
                textClassName="block"
                baseOpacity={0.1}
                blurStrength={5}
              >
                {data.intro.title}
              </ScrollReveal>
            </div>
            <div className="lg:col-span-7">
              <Reveal variant="up" delay={0.15}>
                <div className="space-y-5">
                  {data.intro.body.map((para, i) => (
                    <p key={i} className="text-charcoal/75 text-lg leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </Reveal>
              <Reveal variant="up" delay={0.3}>
                <div className="mt-8">
                  <LuxuryButton variant="gold" onClick={openQuote}>
                    {data.intro.cta}
                  </LuxuryButton>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== UNZIPPED ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-alabaster">
        <div className="mx-auto max-w-[1100px] text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6">A Deeper Perspective</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.05] block mb-10"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {data.unzipped.heading}
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <div className="space-y-5 max-w-[820px] mx-auto">
              {data.unzipped.body.map((para, i) => (
                <p key={i} className="text-charcoal/75 text-lg leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== EXPERIENCES ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
        <div className="mx-auto max-w-[1600px]">
          <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">{data.experiences.subheading}</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.05] block"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              {data.experiences.heading}
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {data.experiences.items.map((exp, idx) => (
              <Reveal key={idx} variant="up" delay={(idx % 3) * 0.1}>
                <article
                  className="group h-full p-6 md:p-8 border border-border bg-canvas transition-all duration-500 hover:border-gold/60 hover:bg-alabaster"
                  style={{ borderRadius: 0 }}
                >
                  <span className="font-display text-gold/40 italic text-4xl leading-none block mb-4 group-hover:text-gold transition-colors duration-500">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-charcoal tracking-tight leading-[1.1] mb-3 group-hover:text-forest transition-colors duration-500">
                    {exp.name}
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed text-sm md:text-base mb-5">
                    {exp.description}
                  </p>
                  <div
                    className="pt-4 border-t border-border group-hover:border-gold/40 transition-colors duration-500"
                  >
                    <p className="font-eyebrow text-charcoal/55 text-[0.62rem] tracking-[0.18em] leading-relaxed">
                      {exp.experience}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== WHY CHOOSE ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-alabaster">
        <div className="mx-auto max-w-[1600px]">
          <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">Why {data.country}</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.05] block"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              {data.whyChoose.heading}
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-10 md:gap-y-14">
            {data.whyChoose.items.map((item, idx) => (
              <Reveal key={idx} variant="up" delay={(idx % 3) * 0.08}>
                <div className="group h-full card-hover-rich p-6 md:p-8">
                  <span className="font-display text-5xl md:text-6xl text-gold/40 italic leading-none block mb-5 group-hover:text-gold transition-colors duration-700">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-2xl md:text-3xl text-charcoal tracking-tight mb-4 leading-[1.1] group-hover:text-forest transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== LUXURY ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-forest-deep text-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 50%, rgba(201,177,135,0.5) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />
        </div>
        <div className="mx-auto max-w-[1100px] relative text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold-soft mb-6">The Luxury of Detail</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-4xl md:text-5xl lg:text-6xl text-cream tracking-tight leading-[1.05] block mb-8"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {data.luxury.heading}
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <div className="space-y-5 max-w-[820px] mx-auto mb-10">
              {data.luxury.body.map((para, i) => (
                <p key={i} className="text-cream/75 text-lg leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal variant="up" delay={0.3}>
            <LuxuryButton variant="gold" onClick={openQuote}>
              {data.luxury.cta}
            </LuxuryButton>
          </Reveal>
        </div>
      </section>

      {/* ====================== BEST PLACES ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16">
            <div className="lg:col-span-4">
              <Reveal variant="up">
                <p className="font-eyebrow text-gold mb-6">Where to Go</p>
              </Reveal>
              <ScrollReveal
                as="h2"
                containerClassName="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.02] block mb-6"
                textClassName="block"
                baseOpacity={0.1}
                blurStrength={5}
              >
                {data.bestPlaces.heading}
              </ScrollReveal>
              <Reveal variant="up" delay={0.2}>
                <p className="text-charcoal/65 leading-relaxed">
                  A curated selection of the places we love to design journeys around in {data.country}.
                </p>
              </Reveal>
            </div>

            <div className="lg:col-span-8">
              <div className="border-t border-border">
                {data.bestPlaces.items.map((place, idx) => (
                  <Reveal key={idx} variant="up" delay={Math.min(idx * 0.04, 0.4)}>
                    <div
                      className="group grid grid-cols-12 gap-6 py-5 border-b border-border items-start transition-colors duration-500 hover:bg-alabaster/60 px-2"
                      style={{ borderRadius: 0 }}
                    >
                      <span className="col-span-2 sm:col-span-1 font-display text-gold/50 italic text-2xl md:text-3xl leading-none">
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                      <div className="col-span-10 sm:col-span-11">
                        <h3 className="font-display text-xl md:text-2xl text-charcoal tracking-tight mb-1.5 group-hover:text-forest transition-colors duration-500">
                          {place.name}
                        </h3>
                        <p className="text-charcoal/65 leading-relaxed text-sm md:text-base">
                          {place.description}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== WHEN TO GO ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-alabaster">
        <div className="mx-auto max-w-[1100px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-14">
            <div className="md:col-span-5">
              <Reveal variant="up">
                <p className="font-eyebrow text-gold mb-6">When to Travel</p>
              </Reveal>
              <ScrollReveal
                as="h2"
                containerClassName="font-display text-3xl md:text-4xl lg:text-5xl text-charcoal tracking-tight leading-[1.05] block"
                textClassName="block"
                baseOpacity={0.1}
                blurStrength={5}
              >
                {data.whenToGo.heading}
              </ScrollReveal>
            </div>
            <div className="md:col-span-7">
              <Reveal variant="up" delay={0.2}>
                <div className="space-y-5">
                  {data.whenToGo.body.map((para, i) => (
                    <p key={i} className="text-charcoal/75 text-lg leading-relaxed">
                      {para}
                    </p>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== ITINERARIES (if present) ====================== */}
      {data.itineraries && data.itineraries.items.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
          <div className="mx-auto max-w-[1600px]">
            <div className="text-center mb-12 md:mb-16 max-w-3xl mx-auto">
              <Reveal variant="up">
                <p className="font-eyebrow text-gold mb-6">Sample Itineraries</p>
              </Reveal>
              <ScrollReveal
                as="h2"
                containerClassName="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal tracking-tight leading-[1.05] block"
                textClassName="block"
                baseOpacity={0.1}
                blurStrength={5}
              >
                {data.itineraries.heading}
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {data.itineraries.items.map((it, idx) => (
                <Reveal key={idx} variant="up" delay={(idx % 3) * 0.1}>
                  <article
                    className="group h-full p-6 md:p-8 border border-border bg-canvas transition-all duration-500 hover:border-gold/60 hover:bg-alabaster"
                    style={{ borderRadius: 0 }}
                  >
                    <span className="font-eyebrow text-gold text-[0.65rem] tracking-[0.25em] block mb-4">
                      JOURNEY {String(idx + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-2xl md:text-3xl text-charcoal tracking-tight leading-[1.1] mb-3 group-hover:text-forest transition-colors duration-500">
                      {it.name}
                    </h3>
                    <p className="text-charcoal/70 leading-relaxed text-sm md:text-base">
                      {it.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====================== BEYOND BIG FIVE ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-forest text-cream relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 70% 30%, rgba(201,177,135,0.5) 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>
        <div className="mx-auto max-w-[1100px] relative text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold-soft mb-6">Beyond the Big Five</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-4xl md:text-5xl lg:text-6xl text-cream tracking-tight leading-[1.05] block mb-8"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {data.beyondBigFive.heading}
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <div className="space-y-5 max-w-[820px] mx-auto mb-8">
              {data.beyondBigFive.body.map((para, i) => (
                <p key={i} className="text-cream/75 text-lg leading-relaxed">
                  {para}
                </p>
              ))}
            </div>
          </Reveal>
          <Reveal variant="up" delay={0.3}>
            <p className="font-display italic text-gold-soft text-xl md:text-2xl">
              {data.beyondBigFive.tagline}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================== CONSERVATION (if present) ====================== */}
      {data.conservation && (
        <section className="py-16 md:py-24 px-6 md:px-10 bg-charcoal text-cream relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 70%, rgba(201,177,135,0.5) 1px, transparent 1px)",
                backgroundSize: "50px 50px",
              }}
            />
          </div>
          <div className="mx-auto max-w-[1100px] relative text-center">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold-soft mb-6">Travel With Purpose</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-5xl lg:text-6xl text-cream tracking-tight leading-[1.05] block mb-8"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              {data.conservation.heading}
            </ScrollReveal>
            <Reveal variant="up" delay={0.2}>
              <div className="space-y-5 max-w-[820px] mx-auto mb-8">
                {data.conservation.body.map((para, i) => (
                  <p key={i} className="text-cream/75 text-lg leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
            </Reveal>
            <Reveal variant="up" delay={0.3}>
              <p className="font-display italic text-gold-soft text-xl md:text-2xl">
                {data.conservation.tagline}
              </p>
            </Reveal>
          </div>
        </section>
      )}

      {/* ====================== FAQ ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-alabaster">
        <div className="mx-auto max-w-[1300px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
            {/* Left — heading */}
            <div className="md:col-span-5">
              <Reveal variant="up">
                <p className="font-eyebrow text-gold mb-6">Questions, Answered</p>
              </Reveal>
              <ScrollReveal
                as="h2"
                containerClassName="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05] block mb-8"
                textClassName="block"
                baseOpacity={0.1}
                blurStrength={5}
              >
                Your {data.country} <span className="italic text-forest">questions.</span>
              </ScrollReveal>
              <Reveal variant="up" delay={0.2}>
                <p className="text-charcoal/70 leading-relaxed mb-8">
                  A few of the things travellers often ask us about journeys through {data.country}.
                  If your question is not here, a specialist will reply within 24 hours.
                </p>
                <button
                  onClick={openQuote}
                  className="link-underline text-charcoal/70"
                >
                  Ask a Specialist
                </button>
              </Reveal>
            </div>

            {/* Right — accordion */}
            <div className="md:col-span-7">
              <div className="border-t border-border">
                {data.faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="border-b border-border">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                        aria-expanded={isOpen}
                      >
                        <span
                          className={cn(
                            "font-display text-xl md:text-2xl tracking-tight transition-colors duration-500 text-left",
                            isOpen
                              ? "text-forest"
                              : "text-charcoal group-hover:text-forest"
                          )}
                        >
                          {faq.q}
                        </span>
                        <span
                          className={cn(
                            "flex-shrink-0 w-8 h-8 flex items-center justify-center transition-all duration-500",
                            isOpen
                              ? "rotate-45 bg-gold text-charcoal"
                              : "border border-charcoal/30 text-charcoal/60 group-hover:border-charcoal"
                          )}
                          style={{ borderRadius: 0 }}
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 5v14M5 12h14" />
                          </svg>
                        </span>
                      </button>
                      <div
                        className="overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                        style={{
                          maxHeight: isOpen ? "500px" : "0px",
                          opacity: isOpen ? 1 : 0,
                        }}
                      >
                        <p className="text-charcoal/75 leading-relaxed pb-6 pr-12">
                          {faq.a}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== CTA ====================== */}
      <section className="py-20 md:py-32 px-6 md:px-10 bg-canvas">
        <div className="mx-auto max-w-[1100px] text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6">{data.intro.eyebrow}</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-4xl md:text-6xl lg:text-7xl text-charcoal tracking-tight leading-[1.0] block mb-8"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={6}
          >
            {data.cta.heading}
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-charcoal/75 text-lg leading-relaxed max-w-[760px] mx-auto mb-10">
              {data.cta.body}
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.3}>
            <div className="flex justify-center mb-10">
              <LuxuryButton variant="gold" onClick={openQuote}>
                {data.cta.cta}
              </LuxuryButton>
            </div>
          </Reveal>
          <Reveal variant="up" delay={0.4}>
            <p className="font-display italic text-forest text-xl md:text-2xl">
              {data.cta.tagline}
            </p>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
