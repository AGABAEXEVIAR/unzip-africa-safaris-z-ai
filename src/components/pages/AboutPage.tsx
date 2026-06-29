"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import { useRouter } from "@/lib/router";
import { experts } from "@/lib/content";

export function AboutPage() {
  const { navigate, openQuote } = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  return (
    <div className="page-enter">
      {/* ====================== HERO ====================== */}
      <section
        ref={heroRef}
        className="relative h-[85vh] min-h-[600px] w-full overflow-hidden bg-charcoal grain"
      >
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 will-change-transform">
          <img
            src="https://images.unsplash.com/photo-1547621869-cd5e2ef82e1d?auto=format&fit=crop&w=2400&q=85"
            alt="African savanna at dusk"
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
            Our Story
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-cream text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] leading-[0.95] tracking-tight max-w-[90%]"
          >
            Founded on
            <br />
            <span className="italic text-gold-soft">a single silence.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.1 }}
            className="font-label text-cream/70 mt-10 max-w-md"
            style={{ letterSpacing: "0.2em" }}
          >
            ARUSHA, TANZANIA — 2009
          </motion.p>
        </div>
      </section>

      {/* ====================== HERITAGE STORY ====================== */}
      <section className="py-32 md:py-48 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
          <div className="md:col-span-4">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">The Beginning</p>
              <p className="font-label text-charcoal/60">
                How a single gorilla trek
                <br />
                became a lifetime's work
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-8">
            <Reveal variant="up">
              <p className="font-display text-2xl md:text-3xl lg:text-4xl leading-[1.35] text-charcoal tracking-tight">
                In 2006, our founder Amara Okello — then a Kisoro schoolteacher — knelt in the
                volcanic mud of Bwindi Impenetrable Forest, seven meters from a silverback named
                Rushegura. She did not move for an hour. When she returned to her village, she
                <span className="italic text-forest"> could not speak of what she had seen</span>.
              </p>
            </Reveal>

            <Reveal variant="up" delay={0.15}>
              <p className="text-lg text-charcoal/75 leading-relaxed mt-10 max-w-2xl">
                Three years of conservation biology, six years of guiding apprenticeship under the
                legendary Dian Fossey Foundation trackers, and one quiet decision: that the silence
                she had experienced was not a luxury for the few, but a necessity for any soul that
                had forgotten the sound of its own breathing. Unzip Africa Safaris was founded in
                Arusha in 2009, with a single Land Cruiser and a single rule — every journey
                composed for one party, and one party alone.
              </p>
            </Reveal>

            <Reveal variant="up" delay={0.25}>
              <p className="text-lg text-charcoal/75 leading-relaxed mt-6 max-w-2xl">
                Fifteen years later, we operate private safaris across eight African nations with a
                team of thirty-two guides, four conservation partnerships, and a fleet of nine
                custom-built Land Cruisers. We have never sold a group departure. We never will.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====================== FULL-BLEED QUOTE ====================== */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden grain">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1500916434205-0c964904b3e1?auto=format&fit=crop&w=2400&q=85"
            alt="Savanna landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-forest-deep/75" />
        </div>

        <div className="relative h-full flex items-center justify-center px-6">
          <Reveal variant="fade">
            <div className="text-center max-w-5xl">
              <p className="font-eyebrow text-gold-soft mb-10">Our Promise</p>
              <p className="font-display text-cream text-3xl md:text-5xl lg:text-6xl leading-[1.15] tracking-tight">
                We will compose you hours
                <br />
                that no itinerary can describe,
                <br />
                <span className="italic text-gold-soft">no photograph can hold.</span>
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== VALUES — 3 PILLARS ====================== */}
      <section className="py-32 md:py-48 px-6 md:px-10 bg-alabaster">
        <div className="mx-auto max-w-[1600px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6 text-center">Three Commitments</p>
            <h2 className="font-display text-4xl md:text-6xl text-charcoal tracking-tight text-center mb-20 max-w-4xl mx-auto leading-[1.05]">
              The principles that <span className="italic text-forest">govern every journey</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
            {[
              {
                num: "01",
                title: "Solitude",
                body: "We will never put you in a vehicle with strangers. We will never drive within sight of another jeep. We will position your camp where no other camp can be seen. Solitude is not a feature of our safaris — it is the foundation.",
              },
              {
                num: "02",
                title: "Silence",
                body: "Our guides speak less than you might expect. They will point, they will whisper, they will let the wind and the wild do the rest. The most common feedback we receive is that travelers heard — for the first time in years — the sound of their own thinking.",
              },
              {
                num: "03",
                title: "Stewardship",
                body: "Seven percent of every journey funds the conservation area you visit. Your presence protects the land that protects the wildlife that composes your hours. We do not view this as charity. We view it as the rent for what we have been lent.",
              },
            ].map((pillar, idx) => (
              <Reveal key={pillar.num} variant="up" delay={idx * 0.15}>
                <div className="border-t border-border pt-8">
                  <p className="font-display text-6xl text-gold/40 italic mb-6">{pillar.num}</p>
                  <h3 className="font-display text-3xl md:text-4xl text-charcoal mb-6 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-charcoal/75 leading-relaxed">{pillar.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== EXPERTS — HOVER POP CARDS ====================== */}
      <section className="py-32 md:py-48 px-6 md:px-10">
        <div className="mx-auto max-w-[1600px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
            <div className="md:col-span-5">
              <Reveal variant="up">
                <p className="font-eyebrow text-gold mb-6">Our Experts</p>
                <h2 className="font-display text-4xl md:text-6xl text-charcoal leading-[1.05] tracking-tight">
                  Inheritors of
                  <br />
                  <span className="italic text-forest">these landscapes</span>
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-6 md:col-start-7 flex items-end">
              <Reveal variant="up" delay={0.2}>
                <p className="text-charcoal/70 text-lg leading-relaxed">
                  Hover over each expert to read their story. These are the people who will be in
                  your vehicle at dawn, walking beside you in the forest, sharing meals around your
                  campfire at night.
                </p>
              </Reveal>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {experts.map((expert, idx) => (
              <Reveal key={expert.id} variant="up" delay={idx * 0.1}>
                <article className="group cursor-pointer" data-cursor="view">
                  <div className="relative aspect-[3/4] overflow-hidden bg-bone mb-5">
                    <img
                      src={expert.image}
                      alt={expert.name}
                      className="absolute inset-0 w-full h-full object-cover img-luxury transition-transform duration-[1.2s] group-hover:scale-[1.08]"
                    />
                    <div className="absolute inset-0 bg-charcoal/15 group-hover:bg-charcoal/0 transition-colors duration-700" />
                    {/* Bio that "pops" on hover */}
                    <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-charcoal/95 via-charcoal/60 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-[0.8s] ease-[cubic-bezier(0.16,1,0.3,1)]">
                      <p className="text-cream/85 text-xs leading-relaxed font-light line-clamp-6">
                        {expert.bio}
                      </p>
                    </div>
                    {/* Years badge */}
                    <div className="absolute top-4 left-4">
                      <span className="font-eyebrow text-cream/90 bg-charcoal/40 backdrop-blur-sm px-3 py-1.5">
                        {expert.yearsExperience}
                      </span>
                    </div>
                  </div>
                  <p className="font-eyebrow text-gold mb-2">{expert.role}</p>
                  <h3 className="font-display text-2xl md:text-3xl text-charcoal tracking-tight mb-2 group-hover:text-forest transition-colors duration-500">
                    {expert.name}
                  </h3>
                  <p className="font-label text-charcoal/60">{expert.specialty}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== TIMELINE OF MILESTONES ====================== */}
      <section className="py-32 md:py-48 px-6 md:px-10 bg-bone/40">
        <div className="mx-auto max-w-[1400px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6">Milestones</p>
            <h2 className="font-display text-4xl md:text-6xl text-charcoal tracking-tight mb-20 max-w-3xl leading-[1.05]">
              Fifteen years of <span className="italic text-forest">measured growth</span>
            </h2>
          </Reveal>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-border md:-translate-x-1/2" />

            <div className="space-y-16 md:space-y-24">
              {[
                {
                  year: "2009",
                  title: "A single Land Cruiser",
                  body: "Amara founds Unzip Africa Safaris in Arusha with one vehicle, one tent, and her childhood friend Daniel as the company's first tracker.",
                },
                {
                  year: "2013",
                  title: "The Bwindi Partnership",
                  body: "We establish our first conservation partnership with the Bwindi Community Hospital, funding a mobile clinic that serves 12,000 Batwa people annually.",
                },
                {
                  year: "2017",
                  title: "Expansion into Botswana",
                  body: "Nala Mwangi joins as Director of Conservation Partnerships, opening our Okavango Delta operations and pioneering the use of electric mokoro boats.",
                },
                {
                  year: "2021",
                  title: "The Carbon-Neutral Charter Fleet",
                  body: "We replace our entire charter aircraft fleet with Cessna 208s converted to run on sustainable aviation fuel — the first safari operator in Africa to do so.",
                },
                {
                  year: "2024",
                  title: "The Long Run Membership",
                  body: "We are admitted as the 38th member of The Long Run — the global association of conservation-focused luxury travel companies founded by Zeitz Foundation.",
                },
              ].map((m, idx) => (
                <Reveal key={m.year} variant="up">
                  <div className={`relative grid md:grid-cols-2 gap-8 md:gap-16 items-start ${idx % 2 === 1 ? "md:[direction:rtl]" : ""}`}>
                    {/* Dot */}
                    <div className="absolute left-4 md:left-1/2 top-2 w-3 h-3 rounded-full bg-gold -translate-x-1/2 ring-4 ring-canvas z-10" />

                    <div className={`pl-12 md:pl-0 [direction:ltr] ${idx % 2 === 0 ? "md:text-right md:pr-16" : "md:col-start-2 md:pl-16"}`}>
                      <p className="font-display text-5xl md:text-7xl text-gold/50 italic mb-3 tracking-tight">
                        {m.year}
                      </p>
                      <h3 className="font-display text-2xl md:text-3xl text-charcoal mb-3 tracking-tight">
                        {m.title}
                      </h3>
                      <p className="text-charcoal/70 leading-relaxed max-w-md md:inline-block">
                        {m.body}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================== CTA ====================== */}
      <section className="py-32 md:py-48 px-6 md:px-10">
        <div className="mx-auto max-w-[1200px] text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-8">Meet the Team</p>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-charcoal tracking-tight">
              Come walk with us.
            </h2>
            <p className="text-lg text-charcoal/70 max-w-xl mx-auto mt-10 leading-relaxed">
              Every journey begins with a conversation — about you, your dreams, and the silence you
              are seeking.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <button onClick={openQuote} className="btn-luxury btn-luxury-gold">
                Request a Quote
              </button>
              <button
                onClick={() => navigate("contact")}
                className="link-underline text-charcoal/70"
              >
                Contact a Specialist
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
