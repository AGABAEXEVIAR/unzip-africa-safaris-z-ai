"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";
import { useLang } from "@/lib/language";

export function AboutPage() {
  const { navigate } = useRouter();
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
            {t("about.eyebrow")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-cream text-[2.5rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.95] tracking-tight max-w-[90%]"
            style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
          >
            {t("about.heroLine1")} <span className="italic text-gold-soft">{t("about.heroLine2")}</span>
          </motion.h1>
        </div>
      </section>

      {/* ====================== MAIN STORY ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[900px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-4">{t("about.ourStory")}</p>
          </Reveal>
          <ScrollReveal
            as="p"
            containerClassName="font-display text-2xl md:text-4xl leading-[1.3] text-charcoal tracking-tight block mb-10"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {t("about.storyHeading")}
          </ScrollReveal>

          <Reveal variant="up" delay={0.1}>
            <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-6">
              {t("about.storyPara1")}
            </p>
            <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-6">
              {t("about.storyPara2")}
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
              {t("about.philosophyBody")} <span className="italic text-forest">{t("about.philosophyItalic")}</span>
            </ScrollReveal>

            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-12">
              {[
                { stat: t("about.stat1Value"), label: t("about.stat1Label"), sub: t("about.stat1Sub") },
                { stat: t("about.stat2Value"), label: t("about.stat2Label"), sub: t("about.stat2Sub") },
                { stat: t("about.stat3Value"), label: t("about.stat3Label"), sub: t("about.stat3Sub") },
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
            <p className="font-eyebrow text-gold mb-4">{t("about.curatedEyebrow")}</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-3xl md:text-5xl text-charcoal tracking-tight leading-[1.1] block mb-8"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {t("about.curatedLine1")} <span className="italic text-forest">{t("about.curatedLine2")}</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-6">
              {t("about.curatedBody")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================== WHERE LUXURY MEETS AUTHENTICITY ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[900px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-4">{t("about.luxuryEyebrow")}</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-3xl md:text-5xl text-charcoal tracking-tight leading-[1.1] block mb-8"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {t("about.luxuryLine1")} <span className="italic text-forest">{t("about.luxuryLine2")}</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-6">
              {t("about.luxuryBody")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================== BEYOND THE SAFARI ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-alabaster">
        <div className="mx-auto max-w-[900px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-4">{t("about.beyondEyebrow")}</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-3xl md:text-5xl text-charcoal tracking-tight leading-[1.1] block mb-8"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {t("about.beyondLine1")} <span className="italic text-forest">{t("about.beyondLine2")}</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-6">
              {t("about.beyondBody")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================== OUR PROMISE ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-forest-deep text-cream">
        <div className="mx-auto max-w-[900px] text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold-soft mb-6">{t("about.promiseEyebrow")}</p>
          </Reveal>
          <ScrollReveal
            as="p"
            containerClassName="font-display text-2xl md:text-4xl leading-[1.3] text-cream tracking-tight block mb-8"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {t("about.promiseLine1")} <span className="italic text-gold-soft">{t("about.promiseLine2")}</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-base md:text-lg text-cream/70 leading-relaxed mb-10">
              {t("about.gatewayBody")}
            </p>
            <p className="font-display text-xl md:text-3xl italic text-gold-soft mb-2" style={{ fontFamily: "var(--font-cormorant), serif" }}>
              {t("about.countries")}
            </p>
            <p className="text-cream/60 text-sm md:text-base leading-relaxed mb-2">
              {t("about.regionLine")}
            </p>
            <p className="font-display text-lg md:text-2xl text-cream mt-4" style={{ fontFamily: "var(--font-cormorant), serif" }}>
              {t("about.brandLine1")} <span className="italic text-gold-soft">{t("about.brandLine2")}</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* ====================== THREE COMMITMENTS ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
        <div className="mx-auto max-w-[1600px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-4 text-center">{t("about.commitmentsEyebrow")}</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-3xl md:text-5xl text-charcoal tracking-tight text-center mb-6 max-w-3xl mx-auto leading-[1.05] block"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {t("about.commitmentsLine1")} <span className="italic text-forest">{t("about.commitmentsLine2")}</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-base text-charcoal/65 leading-relaxed text-center max-w-2xl mx-auto mb-12">
              {t("about.commitmentsBody")}
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {[
              {
                num: t("about.commitment1Num"),
                title: t("about.commitment1Title"),
                body: t("about.commitment1Body"),
                tagline: t("about.commitment1Tagline"),
              },
              {
                num: t("about.commitment2Num"),
                title: t("about.commitment2Title"),
                body: t("about.commitment2Body"),
                tagline: t("about.commitment2Tagline"),
              },
              {
                num: t("about.commitment3Num"),
                title: t("about.commitment3Title"),
                body: t("about.commitment3Body"),
                tagline: t("about.commitment3Tagline"),
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
            <p className="font-eyebrow text-gold-soft mb-6">{t("about.promiseEyebrow")}</p>
          </Reveal>
          <ScrollReveal
            as="p"
            containerClassName="font-display text-xl md:text-3xl leading-[1.4] text-cream tracking-tight block"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {t("about.commitmentPromiseLine1")} <span className="italic text-gold-soft">{t("about.commitmentPromiseLine2")}</span>
          </ScrollReveal>
        </div>
      </section>

      {/* ====================== CTA ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1000px] text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-8">{t("about.beginEyebrow")}</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-4xl md:text-6xl lg:text-7xl leading-[0.95] text-charcoal tracking-tight block mb-10"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={6}
          >
            {t("about.beginPath1")} <span className="italic text-forest">{t("about.beginPath2")}</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-lg text-charcoal/70 max-w-xl mx-auto mt-10 leading-relaxed">
              {t("about.beginBody")}
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-5">
              <button onClick={() => navigate("contact")} className="btn-luxury btn-luxury-gold">
                {t("cta.requestQuote")}
              </button>
              <button
                onClick={() => navigate("contact")}
                className="link-underline text-charcoal/70"
              >
                {t("cta.contactSpecialist")}
              </button>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
