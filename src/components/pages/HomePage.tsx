"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import SafariHero from "@/components/luxury/SafariHero";
import { useRouter } from "@/lib/router";
import { destinations, experts, testimonials } from "@/lib/content";

export function HomePage() {
  const { navigate, openQuote } = useRouter();

  return (
    <div className="page-enter">
      {/* ====================== HERO — Cinematic Safari Video ====================== */}
      <SafariHero />

      {/* ====================== NARRATIVE INTRO ====================== */}
      <section className="py-32 md:py-48 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
          <div className="md:col-span-3">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-4">Our Philosophy</p>
              <p className="font-label text-charcoal/60">No two journeys are alike</p>
            </Reveal>
          </div>

          <div className="md:col-span-9">
            <Reveal variant="up">
              <p className="font-display text-3xl md:text-5xl lg:text-[3.6rem] leading-[1.15] text-charcoal tracking-tight">
                We do not sell safaris.
                <br />
                We compose <span className="italic text-forest">silent, indelible hours</span> in the
                company of wild things — guided by trackers whose grandfathers walked these lands,
                and finished in lodges where the night sky is the only ceiling.
              </p>
            </Reveal>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
              {[
                { stat: "15", label: "Years of craft", sub: "Founded in Arusha, 2009" },
                { stat: "1,200+", label: "Private journeys", sub: "Each composed for one party" },
                { stat: "8", label: "African nations", sub: "From the Sahel to the Cape" },
              ].map((item, idx) => (
                <Reveal key={item.label} variant="up" delay={idx * 0.12}>
                  <div className="border-t border-border pt-5">
                    <p className="font-display text-5xl text-forest">{item.stat}</p>
                    <p className="font-label text-charcoal mt-3">{item.label}</p>
                    <p className="text-sm text-charcoal/55 mt-1">{item.sub}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================== HORIZONTAL FILMSTRIP — DESTINATIONS ====================== */}
      <HorizontalDestinations />

      {/* ====================== THE EXPERIENCE — PARALLAX BAND ====================== */}
      <ParallaxQuote />

      {/* ====================== EXPERT CAROUSEL ====================== */}
      <ExpertCarousel />

      {/* ====================== TESTIMONIALS ====================== */}
      <Testimonials />

      {/* ====================== FINAL CTA ====================== */}
      <section className="py-32 md:py-48 px-6 md:px-10 bg-bone/50">
        <div className="mx-auto max-w-[1200px] text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-8">A Private Invitation</p>
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] text-charcoal tracking-tight">
              The wild is waiting.
              <br />
              <span className="italic text-forest">Are you?</span>
            </h2>
            <p className="text-lg text-charcoal/70 max-w-xl mx-auto mt-10 leading-relaxed">
              Every journey begins with a single conversation. Tell us where your imagination wanders
              — we will compose the rest.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <button onClick={openQuote} className="btn-luxury btn-luxury-gold">
                Request a Quote
              </button>
              <button
                onClick={() => navigate("contact")}
                className="link-underline text-charcoal/70"
              >
                Speak to a Specialist
              </button>
            </div>
          </Reveal>
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
    // Re-measure after images potentially affect layout
    const t = setTimeout(measure, 600);
    window.addEventListener("resize", measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Start panning when the top of the section reaches the top of viewport (heading scrolls past)
    // End panning when the bottom of the section reaches the bottom of viewport
    offset: ["start start", "end end"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -trackWidth]);
  const { navigate } = useRouter();

  return (
    <>
      {/* Section heading — in normal flow, ABOVE the filmstrip section, NOT overlapping */}
      <div className="px-6 md:px-10 pt-32 md:pt-40 pb-16 md:pb-24">
        <div className="mx-auto max-w-[1600px] flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <p className="font-eyebrow text-gold mb-4">Our Destinations</p>
            <h2 className="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05]">
              Six Wildernesses, <span className="italic text-forest">One Continent</span>
            </h2>
          </div>
          <p className="font-label text-charcoal/50 hidden md:block">
            ↓ Scroll to pan the filmstrip
          </p>
        </div>
      </div>

      {/* Sticky filmstrip section — pans horizontally as user scrolls */}
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
                  <span className="font-label text-gold-soft">{dest.price}</span>
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

/* ===================== Expert Carousel ===================== */
function ExpertCarousel() {
  const [active, setActive] = useState(0);

  return (
    <section className="py-32 md:py-48 px-6 md:px-10 bg-alabaster">
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          <div className="md:col-span-5">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">Destination Experts</p>
              <h2 className="font-display text-4xl md:text-6xl text-charcoal leading-[1.05] tracking-tight">
                The people who will
                <br />
                <span className="italic text-forest">compose your hours</span>
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-7 flex items-end">
            <Reveal variant="up" delay={0.2}>
              <p className="text-charcoal/70 text-lg leading-relaxed">
                Our guides are not employees. They are the fourth-generation inheritors of these
                landscapes — trackers, conservationists, and storytellers whose families have lived
                these lands for centuries. They are the difference between a safari and an
                awakening.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Cards row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {experts.map((expert, idx) => (
            <Reveal key={expert.id} variant="up" delay={idx * 0.1}>
              <article
                onMouseEnter={() => setActive(idx)}
                className="group cursor-pointer"
                data-cursor="view"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-bone mb-5">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="absolute inset-0 w-full h-full object-cover img-luxury group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-charcoal/0 transition-colors duration-700" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="font-eyebrow text-cream/90 bg-charcoal/30 backdrop-blur-sm px-3 py-2 inline-block">
                      {expert.yearsExperience}
                    </span>
                  </div>
                </div>
                <p className="font-eyebrow text-gold mb-2 transition-colors">{expert.role}</p>
                <h3 className="font-display text-2xl md:text-3xl text-charcoal tracking-tight mb-2 group-hover:text-forest transition-colors duration-500">
                  {expert.name}
                </h3>
                <p className="font-label text-charcoal/60">{expert.specialty}</p>
              </article>
            </Reveal>
          ))}
        </div>

        {/* Active bio */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-12 gap-12 border-t border-border pt-12">
          <div className="md:col-span-3">
            <p className="font-eyebrow text-gold mb-2">In focus</p>
            <p className="font-display text-3xl text-charcoal">{experts[active].name}</p>
          </div>
          <div className="md:col-span-9">
            <p className="text-lg md:text-xl text-charcoal/75 leading-relaxed font-display italic">
              "{experts[active].bio}"
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ===================== Testimonials ===================== */
function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setActive((p) => (p + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(t);
  }, []);

  return (
    <section className="py-32 md:py-48 px-6 md:px-10 bg-forest text-cream relative overflow-hidden">
      {/* Subtle pattern */}
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

      <div className="mx-auto max-w-[1300px] relative">
        <div className="text-center mb-16">
          <p className="font-eyebrow text-gold-soft mb-6">Voices from the Field</p>
        </div>

        <div className="min-h-[280px] md:min-h-[240px] relative">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              initial={false}
              animate={{
                opacity: idx === active ? 1 : 0,
                y: idx === active ? 0 : 20,
              }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className={`${idx === active ? "relative" : "absolute inset-0"} text-center`}
            >
              <p className="font-display text-2xl md:text-4xl lg:text-5xl leading-[1.3] text-cream tracking-tight max-w-5xl mx-auto">
                "{t.quote}"
              </p>
              <div className="mt-10">
                <p className="font-label text-gold-soft">{t.author}</p>
                <p className="text-sm text-cream/50 mt-1">{t.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-3 mt-12">
          {testimonials.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActive(idx)}
              aria-label={`Testimonial ${idx + 1}`}
              className={`h-1 transition-all duration-500 ${
                idx === active ? "w-12 bg-gold" : "w-6 bg-cream/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ===================== Parallax Quote Band ===================== */
function ParallaxQuote() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);

  return (
    <section ref={ref} className="relative h-[80vh] min-h-[600px] overflow-hidden grain">
      <motion.div style={{ y }} className="absolute inset-0 will-change-transform scale-110">
        <img
          src="https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=2400&q=85"
          alt="Elephant herd at dusk"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-charcoal/55" />
      </motion.div>

      <div className="relative h-full flex items-center justify-center px-6">
        <div className="text-center max-w-4xl">
          <Reveal variant="fade">
            <p className="font-eyebrow text-gold-soft mb-8">The Experience</p>
            <p className="font-display text-cream text-3xl md:text-5xl lg:text-6xl leading-[1.1] tracking-tight">
              "The silence of the African bush at dawn
              <br />
              is not the absence of sound.
              <br />
              <span className="italic text-gold-soft">It is the presence of everything else."</span>
            </p>
            <p className="font-label text-cream/50 mt-10">— Amara Okello, Founder</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
