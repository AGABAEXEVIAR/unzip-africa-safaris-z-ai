"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowLeft, Check, MapPin } from "lucide-react";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";
import { useLang } from "@/lib/language";
import { useAccommodations } from "@/lib/store";

const sharp = { borderRadius: 0 } as const;

export function AccommodationDetailPage() {
  const accommodations = useAccommodations();
  const { selectedAccommodationId, navigate } = useRouter();
  const { t } = useLang();

  const acc = accommodations.find((a) => a.id === selectedAccommodationId);
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  if (!acc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center px-6">
          <p className="font-display text-3xl text-charcoal mb-4" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            {t("accommodationDetail.notFound")}
          </p>
          <button onClick={() => navigate("accommodation")} className="btn-luxury btn-luxury-gold">
            {t("accommodationDetail.viewAll")}
          </button>
        </div>
      </div>
    );
  }

  // Gallery — use the property's galleryImages or fallback to its main image plus 2 generic safari shots
  const gallery: string[] =
    acc.galleryImages && acc.galleryImages.length > 0
      ? acc.galleryImages
      : [
          acc.image,
          "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
          "https://sfile.chatglm.cn/images-ppt/8c0c59305dbc.jpg",
        ];

  return (
    <div className="page-enter bg-canvas">
      {/* ====================== HERO (parallax) ====================== */}
      <section ref={heroRef} className="relative h-[85vh] min-h-[600px] overflow-hidden bg-charcoal grain">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 will-change-transform">
          <img
            src={acc.image}
            alt={acc.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/55" />
        </motion.div>

        <div className="relative h-full flex flex-col justify-between px-6 md:px-10 py-10 md:py-12">
          <button
            onClick={() => navigate("accommodation")}
            className="flex items-center gap-2 text-cream/80 hover:text-cream transition-colors self-start"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="font-eyebrow text-cream/80">{t("accommodationDetail.allProperties")}</span>
          </button>

          <div className="max-w-3xl">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 0.4 }}
              className="font-eyebrow text-gold-soft mb-5 tracking-[0.4em]"
            >
              {acc.type}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-cream text-[2.6rem] sm:text-[4rem] md:text-[5.5rem] lg:text-[6.5rem] leading-[0.95] tracking-tight mb-6"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              {acc.name}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, delay: 1 }}
              className="flex items-center gap-2 text-cream/80 text-sm"
            >
              <MapPin className="w-4 h-4 text-gold-soft" />
              <span>{acc.location}</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ====================== OVERVIEW ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-4">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">{t("accommodationDetail.overview")}</p>
              <p className="font-label text-charcoal/60">{acc.pricePerNight}</p>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <ScrollReveal
              as="p"
              containerClassName="font-display text-2xl md:text-3xl lg:text-4xl leading-[1.3] text-charcoal tracking-tight block"
              textClassName="block"
              baseOpacity={0.15}
              blurStrength={5}
            >
              {acc.description} <span className="italic text-forest">{t("accommodationDetail.baseToListen")}</span>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ====================== IMAGE GALLERY ====================== */}
      <section className="px-6 md:px-10 pb-16 md:pb-24">
        <div className="mx-auto max-w-[1400px]">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Reveal variant="up" className="md:col-span-2 md:row-span-2">
              <div className="aspect-[4/3] md:aspect-[16/12] overflow-hidden bg-bone" style={sharp}>
                <img src={gallery[0]} alt={`${acc.name} — main`} className="w-full h-full object-cover img-luxury" />
              </div>
            </Reveal>
            {gallery.slice(1, 5).map((g, idx) => (
              <Reveal key={idx} variant="up" delay={idx * 0.1}>
                <div className="aspect-[4/3] overflow-hidden bg-bone" style={sharp}>
                  <img src={g} alt={`${acc.name} — ${idx + 2}`} className="w-full h-full object-cover img-luxury" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== FEATURES (forest green with checkmarks) ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-forest text-cream relative overflow-hidden">
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
            <p className="font-eyebrow text-gold-soft mb-6">{t("accommodationDetail.features")}</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-4xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight max-w-3xl mb-12 text-cream block"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {t("accommodationDetail.whatThis")} <span className="italic text-gold-soft">{t("accommodationDetail.offers")}</span>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 border-t border-cream/15 pt-12">
            {acc.features.map((f, idx) => (
              <Reveal key={idx} variant="up" delay={(idx % 3) * 0.1}>
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-8 h-8 bg-gold/20 border border-gold-soft/40 flex items-center justify-center" style={sharp}>
                    <Check className="w-4 h-4 text-gold-soft" />
                  </span>
                  <span className="text-cream/85 leading-relaxed pt-1">{f}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
