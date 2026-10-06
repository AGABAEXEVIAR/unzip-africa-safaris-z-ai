"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";
import { useLang } from "@/lib/language";

export function AboutPage() {
  const { navigate, openQuote } = useRouter();
  const { t } = useLang();
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
        className="relative h-[70vh] min-h-[500px] w-full overflow-hidden bg-charcoal grain"
      >
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 will-change-transform">
          <img
            src="https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg"
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
            About Unzip Africa
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-cream text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.95] tracking-tight max-w-[90%]"
            style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
          >
            Africa is not simply a <span className="italic text-gold-soft">destination.</span>
          </motion.h1>
        </div>
      </section>

      {/* ====================== MAIN STORY ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[900px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-4">Our Story</p>
          </Reveal>
          <ScrollReveal
            as="p"
            containerClassName="font-display text-2xl md:text-4xl leading-[1.3] text-charcoal tracking-tight block mb-10"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            Africa is not simply a destination. It is a feeling, a story, and a journey waiting to be lived.
          </ScrollReveal>

          <Reveal variant="up" delay={0.1}>
            <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-6">
              At Unzip Africa, we create exceptional journeys across Uganda, Kenya, Rwanda and
              Tanzania, designed for travelers who want more than a holiday. We believe the most
              memorable journeys are personal — shaped by extraordinary landscapes, remarkable
              wildlife, meaningful cultural encounters, and moments that stay with you long after
              you return home.
            </p>
            <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-6">
              From the misty forests of Uganda, where mountain gorillas move quietly through the
              ancient rainforest, to the endless plains of the Serengeti and the dramatic
              landscapes of Kenya's Maasai Mara, we take you closer to the wild while making every
              part of your journey feel effortless.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================== PHILOSOPHY ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
          <div className="md:col-span-3">
            <Reveal variant="up">
              <h2 className="font-display text-3xl md:text-4xl text-charcoal tracking-tight mb-3 leading-[1.05]" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                {t("philosophy.heading")}
              </h2>
              <p className="font-label text-charcoal/55 italic">&ldquo;{t("philosophy.quote")}&rdquo;</p>
            </Reveal>
          </div>

          <div className="md:col-span-9">
            <ScrollReveal
              as="p"
              containerClassName="font-display text-3xl md:text-5xl lg:text-[3.6rem] leading-[1.15] text-charcoal tracking-tight block"
              textClassName="block"
              enableBlur={true}
              baseOpacity={0.15}
              blurStrength={6}
            >
              At Unzip Africa, we believe the best African safari experiences are personal, authentic and thoughtfully designed. We create bespoke luxury safaris in Uganda, Kenya and Tanzania, connecting discerning travellers with extraordinary wildlife, landscapes, cultures and unforgettable moments. <span className="italic text-forest">Local knowledge. Personal journeys. Meaningful travel.</span>
            </ScrollReveal>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
              {[
                { stat: "15", label: "Years of craft", sub: "Founded in Arusha, 2009" },
                { stat: "1,200+", label: "Private journeys", sub: "Each composed for one party" },
                { stat: "8", label: "African nations", sub: "From the Sahel to the Cape" },
              ].map((item, idx) => (
                <Reveal key={item.label} variant="up" delay={idx * 0.12}>
                  <div className="border-t border-border pt-5">
                    <p className="font-display text-5xl text-forest" style={{ fontFamily: "var(--font-cormorant), serif" }}>{item.stat}</p>
                    <p className="font-label text-charcoal mt-3">{item.label}</p>
                    <p className="text-sm text-charcoal/55 mt-1">{item.sub}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================== TRAVEL CURATED AROUND YOU ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-alabaster">
        <div className="mx-auto max-w-[900px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-4">Travel, Curated Around You</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-3xl md:text-5xl text-charcoal tracking-tight leading-[1.1] block mb-8"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            No two travelers are the same, and neither should their <span className="italic text-forest">safari be.</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-6">
              We specialize in tailor-made and private safari experiences, carefully designed
              around your interests, pace, style, and expectations. Whether you dream of a luxury
              safari, gorilla trekking, the Great Migration, intimate wildlife encounters,
              cultural experiences, or simply escaping into nature, our team brings together the
              right destinations, accommodation, guides, and experiences to create a journey that
              feels uniquely yours.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================== WHERE LUXURY MEETS AUTHENTICITY ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[900px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-4">Where Luxury Meets Authenticity</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-3xl md:text-5xl text-charcoal tracking-tight leading-[1.1] block mb-8"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            For us, luxury is not simply about beautiful lodges or <span className="italic text-forest">exceptional service.</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-6">
              It is about having the freedom to slow down, the comfort to truly relax, and the
              opportunity to experience Africa in a meaningful way. We combine carefully selected
              accommodation, experienced local guides, seamless logistics, and thoughtful attention
              to detail to create journeys where comfort and adventure exist naturally together.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================== BEYOND THE SAFARI ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-alabaster">
        <div className="mx-auto max-w-[900px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-4">Beyond the Safari</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-3xl md:text-5xl text-charcoal tracking-tight leading-[1.1] block mb-8"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            Africa's greatest treasures extend <span className="italic text-forest">beyond its wildlife.</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-6">
              We believe in connecting travelers with the people, cultures, communities,
              landscapes, and stories that make East Africa extraordinary. Our experiences are
              designed to create genuine connections while supporting responsible tourism and the
              communities that make these destinations their home.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================== OUR PROMISE ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-forest-deep text-cream">
        <div className="mx-auto max-w-[900px] text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold-soft mb-6">Our Promise</p>
          </Reveal>
          <ScrollReveal
            as="p"
            containerClassName="font-display text-2xl md:text-4xl leading-[1.3] text-cream tracking-tight block mb-8"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            From your first conversation with us to the moment you return home, we are committed to
            making your journey <span className="italic text-gold-soft">seamless, personal, and unforgettable.</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-base md:text-lg text-cream/70 leading-relaxed mb-10">
              Unzip Africa is your gateway to discovering East Africa differently — more
              intimately, more intentionally, and with a touch of luxury.
            </p>
            <p className="font-display text-xl md:text-3xl italic text-gold-soft mb-2" style={{ fontFamily: "var(--font-cormorant), serif" }}>
              Uganda. Kenya. Tanzania. Rwanda.
            </p>
            <p className="text-cream/60 text-sm md:text-base leading-relaxed mb-2">
              One extraordinary region. Countless stories waiting to be discovered.
            </p>
            <p className="font-display text-lg md:text-2xl text-cream mt-4" style={{ fontFamily: "var(--font-cormorant), serif" }}>
              Unzip Africa — <span className="italic text-gold-soft">Unzip the extraordinary.</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================== THREE COMMITMENTS ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
        <div className="mx-auto max-w-[1600px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-4 text-center">Three Commitments</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-3xl md:text-5xl text-charcoal tracking-tight text-center mb-6 max-w-3xl mx-auto leading-[1.05] block"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            The principles that <span className="italic text-forest">govern every journey</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-base text-charcoal/65 leading-relaxed text-center max-w-2xl mx-auto mb-12">
              At Unzip Africa, we believe a truly exceptional journey should leave a lasting
              impression — not only on the traveler, but also on the places, people, and wildlife
              that make it possible. Our three commitments guide how we design, deliver, and
              continuously improve every experience.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                num: "01",
                title: "Exceptional Experiences",
                body: "We go beyond simply taking you from one destination to another. Every journey is thoughtfully curated around your interests, pace, and expectations, with carefully selected stays, experiences, and local expertise.",
                tagline: "Every detail matters. Every moment counts.",
              },
              {
                num: "02",
                title: "Authentic Connections",
                body: "We believe the heart of Africa is found beyond the iconic landscapes. It lives in its people, cultures, communities, and stories. We create opportunities for meaningful encounters that allow you to experience East Africa with greater depth, respect, and authenticity.",
                tagline: "Travel deeper. Connect genuinely.",
              },
              {
                num: "03",
                title: "Responsible Exploration",
                body: "The privilege of experiencing Africa comes with a responsibility to protect it. We are committed to encouraging responsible travel that respects wildlife, supports local communities, values conservation, and helps preserve the destinations we are fortunate to share with our guests.",
                tagline: "Explore beautifully. Leave a positive footprint.",
              },
            ].map((pillar, idx) => (
              <Reveal key={pillar.num} variant="up" delay={idx * 0.15}>
                <div className="card-hover-rich p-6 md:p-8 h-full">
                  <p className="font-display text-5xl md:text-6xl text-gold/40 italic mb-4 leading-none">{pillar.num}</p>
                  <h3 className="font-display text-2xl md:text-3xl text-charcoal mb-4 tracking-tight">
                    {pillar.title}
                  </h3>
                  <p className="text-charcoal/70 leading-relaxed mb-4">{pillar.body}</p>
                  <p className="font-display text-base italic text-forest" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                    {pillar.tagline}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== COMMITMENT PROMISE ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-forest-deep text-cream">
        <div className="mx-auto max-w-[800px] text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold-soft mb-6">Our Promise</p>
          </Reveal>
          <ScrollReveal
            as="p"
            containerClassName="font-display text-xl md:text-3xl leading-[1.4] text-cream tracking-tight block"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            These commitments are more than words. They are the principles behind every safari,
            every recommendation, and every experience we create. Because the finest journeys are
            not simply remembered — <span className="italic text-gold-soft">they make a difference.</span>
          </ScrollReveal>
        </div>
      </section>

      {/* ====================== CTA ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1000px] text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-8">Begin Your Journey</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] text-charcoal tracking-tight block mb-10"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={6}
          >
            Unzip the <span className="italic text-forest">extraordinary.</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-lg text-charcoal/70 max-w-xl mx-auto mt-10 leading-relaxed">
              Every journey begins with a conversation. Tell us where your imagination wanders —
              we will compose the rest.
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
