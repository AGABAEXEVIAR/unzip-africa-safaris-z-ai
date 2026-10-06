"use client";

import { useState, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Users,
  Check,
  X,
} from "lucide-react";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { HeroCarousel } from "@/components/luxury/HeroCarousel";
import { BookingModal } from "@/components/luxury/BookingModal";
import { useRouter } from "@/lib/router";
import { useTours, useAccommodations } from "@/lib/store";
import type { TourPackage } from "@/lib/content";

const sharp = { borderRadius: 0 } as const;

export function TourDetailPage() {
  const tours = useTours();
  const accommodations = useAccommodations();
  const { selectedTourId, navigate, navigateToTour, navigateToAccommodation } =
    useRouter();

  const [bookingOpen, setBookingOpen] = useState(false);
  const itineraryRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: itineraryProgress } = useScroll({
    target: itineraryRef,
    offset: ["start center", "end end"],
  });
  const lineScaleY = useTransform(itineraryProgress, [0, 1], [0, 1]);

  const tour = tours.find((t) => t.id === selectedTourId);

  if (!tour) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#EFE9DF]">
        <div className="text-center px-6">
          <p
            className="font-display text-3xl text-charcoal mb-4"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Tour not found.
          </p>
          <button onClick={() => navigate("tours")} className="btn-luxury btn-luxury-gold">
            View All Tours
          </button>
        </div>
      </div>
    );
  }

  // Resolve accommodations referenced by the tour
  const stays = (tour.accommodationIds || [])
    .map((id) => accommodations.find((a) => a.id === id))
    .filter((a): a is NonNullable<typeof a> => Boolean(a));

  // Gallery: prefer galleryImages; otherwise fallback to [image, ...days images]
  const gallery =
    tour.galleryImages && tour.galleryImages.length > 0
      ? tour.galleryImages
      : [tour.image, ...tour.days.map((d) => d.image).filter(Boolean)];

  // Other tours for "Continue Exploring"
  const others = tours.filter((t) => t.id !== tour.id).slice(0, 3);

  const hasDiscount = !!tour.priceOriginal && tour.priceOriginal > tour.priceFrom;
  const discountPercent = hasDiscount
    ? Math.round(((tour.priceOriginal! - tour.priceFrom) / tour.priceOriginal!) * 100)
    : 0;

  return (
    <div className="page-enter">
      {/* ====================== 1. HERO ====================== */}
      <section className="relative bg-[#1A2520] text-cream overflow-hidden">
        {/* Atmospheric image at low opacity */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <img src={tour.image} alt="" className="w-full h-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-gradient-to-br from-[#1A2520] via-[#1A2520]/85 to-[#1A2520]/55" />
        </div>

        <div className="relative grid grid-cols-1 lg:grid-cols-2 min-h-[88vh]">
          {/* Left — copy */}
          <div className="flex items-center px-6 md:px-12 lg:px-16 py-16 lg:py-0">
            <div className="max-w-xl w-full">
              <button
                onClick={() => navigate("tours")}
                className="flex items-center gap-2 text-cream/60 hover:text-cream transition-colors mb-10"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="font-eyebrow">All Tours</span>
              </button>

              <Reveal variant="up">
                <p className="font-eyebrow text-gold-soft mb-4">{tour.subtitle}</p>
              </Reveal>

              <Reveal variant="up" delay={0.1}>
                <h1
                  className="font-display text-5xl md:text-6xl lg:text-7xl text-cream tracking-tight leading-[0.95] mb-8"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  {tour.name}
                </h1>
              </Reveal>

              {/* Metadata row */}
              <Reveal variant="up" delay={0.2}>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs text-cream/80 mb-8">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gold-soft" />
                    {tour.subtitle}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gold-soft" />
                    {tour.durationDays} Days · {tour.durationNights} Nights
                  </span>
                  <span className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gold-soft" />
                    Private party · {tour.minAge}+
                  </span>
                  {hasDiscount && (
                    <span
                      className="px-3 py-1 bg-gold text-charcoal font-eyebrow text-[0.55rem]"
                      style={sharp}
                    >
                      {discountPercent}% Off
                    </span>
                  )}
                </div>
              </Reveal>

              {/* Price display */}
              <Reveal variant="up" delay={0.3}>
                <div className="mb-10">
                  <p className="font-eyebrow text-cream/50 mb-2">Starting From</p>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-display text-4xl md:text-5xl text-gold-soft"
                      style={{ fontFamily: "var(--font-cormorant), serif" }}
                    >
                      ${tour.priceFrom.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-cream/40 line-through text-lg">
                        ${tour.priceOriginal!.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-cream/60 mt-1">per person</p>
                </div>
              </Reveal>

              <Reveal variant="up" delay={0.4}>
                <button onClick={() => setBookingOpen(true)} className="btn-luxury btn-luxury-gold">
                  Book Now
                </button>
              </Reveal>
            </div>
          </div>

          {/* Right — HeroCarousel */}
          <div className="relative bg-[#0F1712] min-h-[60vh] lg:min-h-[88vh]">
            <HeroCarousel
              images={gallery}
              alt={tour.name}
              aspectClass="h-full"
              className="h-full"
            />
          </div>
        </div>
      </section>

      {/* ====================== 2. OVERVIEW + QUICK FACTS ====================== */}
      <section className="bg-[#EFE9DF] py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Left — overview copy */}
          <div className="md:col-span-7">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">Tour Overview</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-3xl md:text-5xl lg:text-6xl leading-[1.1] text-charcoal tracking-tight block mb-8"
              textClassName="block"
              baseOpacity={0.15}
              blurStrength={5}
            >
              A private journey through {tour.destination}, composed entirely around you.
            </ScrollReveal>
            <Reveal variant="up" delay={0.2}>
              <p className="text-charcoal/75 leading-relaxed text-base md:text-lg max-w-2xl">
                {tour.highlights.join(" · ")}. A {tour.durationDays}-day curated passage through{" "}
                {tour.nationalPark}, staying in {tour.accommodationLevel.toLowerCase()} lodges and
                camps. Designed for travellers aged {tour.minAge}+ and limited to your private
                party, with a dedicated guide and 4x4 vehicle throughout.
              </p>
            </Reveal>
          </div>

          {/* Right — Quick Facts card */}
          <div className="md:col-span-5">
            <Reveal variant="up" delay={0.3}>
              <div className="p-6 md:p-8 text-cream" style={{ background: "#1f3a2f", ...sharp }}>
                <p className="font-eyebrow text-gold-soft mb-6">Quick Facts</p>
                <div className="space-y-3 text-sm">
                  <FactRow
                    label="Duration"
                    value={`${tour.durationDays} Days · ${tour.durationNights} Nights`}
                  />
                  <FactRow label="Destination" value={tour.destination} />
                  <FactRow label="National Park" value={tour.nationalPark} />
                  <FactRow label="Trip Type" value={tour.tripType} />
                  <FactRow label="Accommodation" value={tour.accommodationLevel} />
                  <FactRow label="Group Size" value={`Private party · Min age ${tour.minAge}+`} />
                </div>

                <div className="mt-6 pt-6 border-t border-cream/15">
                  <p className="font-eyebrow text-cream/50 mb-1">Starting From</p>
                  <div className="flex items-baseline gap-3">
                    <span
                      className="font-display text-3xl text-gold-soft"
                      style={{ fontFamily: "var(--font-cormorant), serif" }}
                    >
                      ${tour.priceFrom.toLocaleString()}
                    </span>
                    {hasDiscount && (
                      <span className="text-cream/40 line-through text-sm">
                        ${tour.priceOriginal!.toLocaleString()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-cream/60 mt-1">per person</p>

                  <button
                    onClick={() => setBookingOpen(true)}
                    className="btn-luxury btn-luxury-gold w-full mt-5"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====================== 3. JOURNEY HIGHLIGHTS ====================== */}
      <section className="bg-[#EFE9DF] py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-3xl mb-12">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">Journey Highlights</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05] block"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              What you'll <span className="italic">experience.</span>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {tour.highlights.map((h, idx) => (
              <Reveal key={idx} variant="up" delay={(idx % 2) * 0.1}>
                <div
                  className="flex items-start gap-5 p-6 md:p-8 bg-[#E8E0D2]/40 border border-charcoal/10"
                  style={sharp}
                >
                  <span
                    className="font-display text-4xl md:text-5xl text-gold/60 italic flex-shrink-0 leading-none"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-charcoal/80 leading-relaxed flex-1 pt-2 text-base md:text-lg">
                    {h}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== 4. DAY-BY-DAY ITINERARY ====================== */}
      <section ref={itineraryRef} className="bg-[#EFE9DF] py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1200px]">
          <div className="text-center mb-16 md:mb-20">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">Day-by-Day Itinerary</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05] block"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              Step by step.
            </ScrollReveal>
          </div>

          {/* Animated timeline with left progress rail */}
          <div className="relative flex gap-6 md:gap-10">
            {/* Left rail — progress line (sticky on desktop) */}
            <div className="hidden md:flex flex-col items-center w-12 flex-shrink-0">
              <p className="font-eyebrow text-charcoal/40 text-[0.55rem] tracking-[0.15em] uppercase mb-4 text-center leading-tight">
                Itinerary<br />Progress
              </p>
              {/* Track + fill */}
              <div className="flex-1 relative w-px bg-charcoal/15">
                <motion.div
                  style={{ scaleY: lineScaleY, transformOrigin: "top" }}
                  className="absolute inset-0 w-full bg-charcoal"
                />
              </div>
              {/* Bottom labels */}
              <p className="font-display text-sm text-charcoal mt-4" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                {tour.durationDays} days
              </p>
              <p className="font-eyebrow text-charcoal/40 text-[0.55rem] tracking-[0.15em] uppercase mt-1 text-center leading-tight">
                Scroll to<br />advance
              </p>
            </div>

            {/* Right — day entries */}
            <div className="flex-1 space-y-12 md:space-y-20">
              {tour.days.map((day, idx) => (
                <Reveal key={idx} variant="up" delay={idx * 0.05}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
                    {/* Number */}
                    <div className="md:col-span-2 flex md:justify-start">
                      <span
                        className="font-display text-6xl md:text-7xl text-charcoal/30 italic leading-none"
                        style={{ fontFamily: "var(--font-cormorant), serif" }}
                      >
                        {String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Image */}
                    <div className="md:col-span-5">
                      <div className="aspect-[4/3] overflow-hidden bg-bone" style={sharp}>
                        <img
                          src={day.image}
                          alt={day.title}
                          className="w-full h-full object-cover img-luxury"
                        />
                      </div>
                    </div>

                    {/* Text */}
                    <div className="md:col-span-5">
                      <p className="font-eyebrow text-gold mb-2">{day.day}</p>
                      <h3
                        className="font-display text-2xl md:text-3xl text-charcoal tracking-tight mb-3 leading-[1.05]"
                        style={{ fontFamily: "var(--font-cormorant), serif" }}
                      >
                        {day.title}
                      </h3>
                      <p className="text-charcoal/70 leading-relaxed text-sm">{day.description}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================== 5. WHAT'S INCLUDED / EXCLUDED ====================== */}
      <section className="bg-[#EFE9DF] py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {/* Included */}
          <div>
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">What's Included</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-5xl text-charcoal tracking-tight leading-[1.05] block mb-10"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              Part of your journey.
            </ScrollReveal>
            <ul className="space-y-4">
              {DEFAULT_INCLUSIONS.map((item, idx) => (
                <Reveal key={idx} variant="up" delay={idx * 0.05}>
                  <li className="flex items-start gap-3 text-charcoal/80">
                    <span
                      className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ ...sharp, background: "rgba(168, 139, 92, 0.15)" }}
                    >
                      <Check className="w-3.5 h-3.5 text-gold" />
                    </span>
                    <span className="leading-relaxed flex-1">{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          {/* Excluded */}
          <div>
            <Reveal variant="up">
              <p className="font-eyebrow text-charcoal/40 mb-6">What's Excluded</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-5xl text-charcoal tracking-tight leading-[1.05] block mb-10"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              For you to arrange.
            </ScrollReveal>
            <ul className="space-y-4">
              {DEFAULT_EXCLUSIONS.map((item, idx) => (
                <Reveal key={idx} variant="up" delay={idx * 0.05}>
                  <li className="flex items-start gap-3 text-charcoal/60">
                    <span
                      className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 border border-charcoal/20"
                      style={sharp}
                    >
                      <X className="w-3.5 h-3.5 text-charcoal/40" />
                    </span>
                    <span className="leading-relaxed flex-1">{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ====================== 6. WHERE YOU'LL STAY ====================== */}
      {stays.length > 0 && (
        <section className="bg-[#EFE9DF] py-16 md:py-24 px-6 md:px-10">
          <div className="mx-auto max-w-[1400px]">
            <div className="max-w-3xl mb-12">
              <Reveal variant="up">
                <p className="font-eyebrow text-gold mb-6">Where You'll Stay</p>
              </Reveal>
              <ScrollReveal
                as="h2"
                containerClassName="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05] block"
                textClassName="block"
                baseOpacity={0.1}
                blurStrength={5}
              >
                Lodges &amp; camps selected for this journey.
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {stays.map((acc, idx) => (
                <Reveal key={acc.id} variant="up" delay={idx * 0.1}>
                  <article
                    onClick={() => navigateToAccommodation(acc.id)}
                    className="bg-[#FAF6EE] overflow-hidden cursor-pointer group card-luxury flex flex-col h-full"
                    style={sharp}
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-bone card-zoom">
                      <img
                        src={acc.image}
                        alt={acc.name}
                        className="w-full h-full object-cover img-luxury"
                      />
                    </div>
                    <div className="p-5 md:p-6 flex flex-col flex-1">
                      <p className="font-eyebrow text-gold mb-2">{acc.location}</p>
                      <h3
                        className="font-display text-2xl text-charcoal tracking-tight mb-3 group-hover:text-forest transition-colors"
                        style={{ fontFamily: "var(--font-cormorant), serif" }}
                      >
                        {acc.name}
                      </h3>
                      <p className="text-sm text-charcoal/70 leading-relaxed line-clamp-2 mb-4 flex-1">
                        {acc.description}
                      </p>
                      <div className="flex items-center justify-between pt-3 border-t border-charcoal/10">
                        <span className="font-label text-charcoal/60">{acc.pricePerNight}</span>
                        <span className="font-eyebrow text-gold flex items-center gap-1.5">
                          View Lodge
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====================== 7. THE ROUTE / MAP ====================== */}
      <section className="bg-[#EFE9DF] py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-3xl mb-12">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">The Route</p>
              <h2
                className="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05]"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                Mapped across {tour.destination}.
              </h2>
            </Reveal>
          </div>
          <Reveal variant="up" delay={0.2}>
            <div
              className="relative aspect-[16/7] bg-[#1f3a2f] overflow-hidden border border-charcoal/10"
              style={sharp}
            >
              <iframe
                title={`Map of ${tour.destination}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(
                  `${tour.nationalPark}, ${tour.destination}`
                )}&output=embed`}
                className="absolute inset-0 w-full h-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== 8. CONTINUE EXPLORING ====================== */}
      <section className="bg-[#1A2520] text-cream py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <div className="max-w-3xl mb-12">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold-soft mb-6">Continue Exploring</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-6xl text-cream tracking-tight leading-[1.05] block"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              Related journeys in {tour.destination}.
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {others.map((t, idx) => (
              <Reveal key={t.id} variant="up" delay={idx * 0.1}>
                <article
                  onClick={() => navigateToTour(t.id)}
                  className="bg-[#0F1712] border border-cream/10 overflow-hidden cursor-pointer group card-luxury h-full"
                  style={sharp}
                >
                  <div className="aspect-[4/3] overflow-hidden card-zoom">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full h-full object-cover img-luxury"
                    />
                  </div>
                  <div className="p-5 md:p-6">
                    <p className="font-eyebrow text-gold-soft mb-2">{t.durationDays} days</p>
                    <h3
                      className="font-display text-xl md:text-2xl text-cream tracking-tight mb-4 group-hover:text-gold-soft transition-colors"
                      style={{ fontFamily: "var(--font-cormorant), serif" }}
                    >
                      {t.name}
                    </h3>
                    <div className="flex items-center justify-between pt-3 border-t border-cream/10">
                      <span className="text-xs text-cream/60">
                        From ${t.priceFrom.toLocaleString()} pp
                      </span>
                      <ArrowRight className="w-4 h-4 text-gold-soft group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== 9. CTA SECTION ====================== */}
      <section className="bg-[#1A2520] text-cream py-20 md:py-32 px-6 md:px-10 border-t border-cream/10">
        <div className="mx-auto max-w-4xl text-center">
          <Reveal variant="up">
            <h2
              className="font-display text-4xl md:text-6xl lg:text-7xl text-cream tracking-tight leading-[1.05] mb-8"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              Let us design a <span className="italic text-gold-soft">safari</span> composed
              entirely for you.
            </h2>
          </Reveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-cream/70 leading-relaxed mb-10 max-w-2xl mx-auto text-base md:text-lg">
              Every journey we craft begins with a conversation. Tell us about the safari you've
              been dreaming of — and we'll shape it, day by day, camp by camp, around you.
            </p>
          </Reveal>
          <Reveal variant="up" delay={0.3}>
            <button onClick={() => navigate("contact")} className="btn-luxury btn-luxury-light">
              Contact
            </button>
          </Reveal>
        </div>
      </section>

      {/* ====================== BOOKING MODAL ====================== */}
      <BookingModal
        tripType="tour"
        trip={tour as TourPackage}
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </div>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-cream/10 pb-2 last:border-0 last:pb-0">
      <span className="font-eyebrow text-cream/50 text-[0.65rem] tracking-[0.2em] uppercase flex-shrink-0 pt-0.5">
        {label}
      </span>
      <span className="text-cream text-sm text-right">{value}</span>
    </div>
  );
}

const DEFAULT_INCLUSIONS = [
  "All lodging in luxury lodges and camps as listed",
  "Private guide and 4x4 vehicle throughout",
  "All meals, drinks and sundowners",
  "Park entry and conservation fees",
  "Internal charter flights between camps",
  "AMREF Flying Doctors emergency evacuation cover",
  "5% contribution to ranger welfare",
];

const DEFAULT_EXCLUSIONS = [
  "International airfare to/from Africa",
  "Visa and passport fees",
  "Travel and medical insurance",
  "Personal items, laundry at certain camps",
  "Optional activities not listed in the itinerary",
  "Gratuities for guides and lodge staff",
];
