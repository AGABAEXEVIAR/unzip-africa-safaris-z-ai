"use client";

import { useState } from "react";
import { ArrowLeft, Clock, MapPin, Calendar, Users, CheckCircle2, XCircle, Compass } from "lucide-react";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { HeroCarousel } from "@/components/luxury/HeroCarousel";
import { BookingModal } from "@/components/luxury/BookingModal";
import { useRouter } from "@/lib/router";
import { useScheduledTrips, useTours, useAccommodations } from "@/lib/store";
import type { ScheduledTrip } from "@/lib/content";

const sharp = { borderRadius: 0 } as const;

export function ScheduledTripDetailPage() {
  const trips = useScheduledTrips();
  const tours = useTours();
  const accommodations = useAccommodations();
  const { selectedScheduledTripId, navigate, navigateToScheduledTrip, navigateToAccommodation } = useRouter();

  const [bookingOpen, setBookingOpen] = useState(false);

  const trip = trips.find((t) => t.id === selectedScheduledTripId);

  if (!trip) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-canvas">
        <div className="text-center px-6">
          <p className="font-display text-3xl text-charcoal mb-4" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Scheduled trip not found.
          </p>
          <button onClick={() => navigate("tours")} className="btn-luxury btn-luxury-gold">
            View All Tours
          </button>
        </div>
      </div>
    );
  }

  // Try to find a tour with the same destination to surface related accommodation stays
  const relatedTour = tours.find((t) => t.destination === trip.destination);
  const stays = relatedTour
    ? (relatedTour.accommodationIds || [])
        .map((id) => accommodations.find((a) => a.id === id))
        .filter((a): a is NonNullable<typeof a> => Boolean(a))
    : [];

  const gallery = trip.galleryImages && trip.galleryImages.length > 0 ? trip.galleryImages : [trip.image];
  const others = trips.filter((t) => t.id !== trip.id).slice(0, 3);

  return (
    <div className="page-enter bg-canvas">
      {/* ====================== SPLIT-SCREEN HERO ====================== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        {/* Left — copy */}
        <div className="flex items-center px-6 md:px-12 py-12 lg:py-0 bg-canvas">
          <div className="max-w-xl">
            <button
              onClick={() => navigate("tours")}
              className="flex items-center gap-2 text-charcoal/60 hover:text-charcoal transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="font-eyebrow">All Journeys</span>
            </button>
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-4">Scheduled Departure</p>
            </Reveal>
            <Reveal variant="up" delay={0.1}>
              <h1
                className="font-display text-5xl md:text-7xl lg:text-8xl text-charcoal tracking-tight leading-[0.95] mb-8"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                {trip.name}
              </h1>
            </Reveal>
            <Reveal variant="up" delay={0.2}>
              <p className="text-charcoal/70 leading-relaxed mb-8 text-lg">
                {trip.description}
              </p>
            </Reveal>

            {/* Meta */}
            <Reveal variant="up" delay={0.3}>
              <div className="flex flex-wrap gap-5 text-sm text-charcoal/70 mb-8">
                <Meta icon={<Calendar className="w-4 h-4" />} text={formatDate(trip.startDate)} />
                <Meta icon={<Clock className="w-4 h-4" />} text={`${trip.durationDays} Days`} />
                <Meta icon={<MapPin className="w-4 h-4" />} text={trip.destination} />
                <Meta icon={<Users className="w-4 h-4" />} text={trip.groupSize} />
              </div>
            </Reveal>

            {/* Trip Details card */}
            <Reveal variant="up" delay={0.4}>
              <div className="p-6 text-cream" style={{ background: "#1f3a2f", ...sharp }}>
                <p className="font-eyebrow text-gold-soft mb-5">Trip Details</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="font-eyebrow text-cream/50 mb-1">From</p>
                    <p className="font-display text-3xl text-gold-soft" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                      ${trip.priceFrom.toLocaleString()}
                    </p>
                    <p className="text-xs text-cream/60">per person</p>
                  </div>
                  <div>
                    <p className="font-eyebrow text-cream/50 mb-1">Dates</p>
                    <p className="font-display text-xl text-cream" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                      {formatDate(trip.startDate)}
                    </p>
                    <p className="text-xs text-cream/60">to {formatDate(trip.endDate)}</p>
                  </div>
                  <div>
                    <p className="font-eyebrow text-cream/50 mb-1">Group Size</p>
                    <p className="text-sm text-cream">{trip.groupSize}</p>
                  </div>
                  <div>
                    <p className="font-eyebrow text-cream/50 mb-1">Spots Left</p>
                    <p className="text-sm text-cream">{trip.spotsLeft}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="font-eyebrow text-cream/50 mb-1">Accommodation</p>
                    <p className="text-sm text-cream">{trip.accommodationLevel}</p>
                  </div>
                </div>
              </div>
            </Reveal>

            <Reveal variant="up" delay={0.5}>
              <button
                onClick={() => setBookingOpen(true)}
                className="btn-luxury btn-luxury-gold mt-8 w-full"
              >
                Reserve a Spot
              </button>
            </Reveal>
          </div>
        </div>

        {/* Right — HeroCarousel */}
        <div className="relative bg-charcoal min-h-[60vh] lg:min-h-[80vh]">
          <HeroCarousel images={gallery} alt={trip.name} aspectClass="h-full" className="h-full" />
        </div>
      </section>

      {/* ====================== OVERVIEW ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-12">
          <div className="md:col-span-7">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">Overview</p>
            </Reveal>
            <ScrollReveal
              as="p"
              containerClassName="font-display text-2xl md:text-3xl lg:text-4xl leading-[1.3] text-charcoal tracking-tight block"
              textClassName="block"
              baseOpacity={0.15}
              blurStrength={5}
            >
              A small-group scheduled departure through {trip.destination}. Limited to {trip.groupSize.toLowerCase()}. <span className="italic text-forest">Join a circle of like-minded travellers.</span>
            </ScrollReveal>
            <Reveal variant="up" delay={0.2}>
              <p className="text-charcoal/70 leading-relaxed mt-8">
                Departing {formatDate(trip.startDate)} and concluding {formatDate(trip.endDate)}, this
                {trip.durationDays}-day journey is the perfect way to experience {trip.destination} with
                a private guide and a small party of fellow travellers.
              </p>
            </Reveal>
          </div>

          <div className="md:col-span-5">
            <Reveal variant="up" delay={0.3}>
              <div className="p-6 md:p-8 text-cream" style={{ background: "#1f3a2f", ...sharp }}>
                <p className="font-eyebrow text-gold-soft mb-5">Quick Facts</p>
                <div className="space-y-3 text-sm">
                  <FactRow label="Destination" value={trip.destination} />
                  <FactRow label="Start Date" value={formatDate(trip.startDate)} />
                  <FactRow label="End Date" value={formatDate(trip.endDate)} />
                  <FactRow label="Duration" value={`${trip.durationDays} Days`} />
                  <FactRow label="Group Size" value={trip.groupSize} />
                  <FactRow label="Accommodation" value={trip.accommodationLevel} />
                  <FactRow label="Spots Left" value={`${trip.spotsLeft}`} />
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====================== JOURNEY HIGHLIGHTS ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-alabaster">
        <div className="mx-auto max-w-[1400px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6">Journey Highlights</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05] block mb-12"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            What you'll <span className="italic text-forest">experience.</span>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {trip.highlights.map((h, idx) => (
              <Reveal key={idx} variant="up" delay={(idx % 2) * 0.1}>
                <div className="flex items-start gap-4 p-5 border border-border/60 bg-canvas" style={sharp}>
                  <span className="font-display text-3xl text-gold/50 italic" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-charcoal/80 leading-relaxed flex-1 pt-1">{h}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== JOURNEY OUTLINE — stops timeline ====================== */}
      {trip.stops && trip.stops.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
          <div className="mx-auto max-w-[1200px]">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">Journey Outline</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05] block mb-16"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              Your <span className="italic text-forest">itinerary.</span>
            </ScrollReveal>

            <div className="relative">
              <div className="absolute left-6 top-2 bottom-2 w-px bg-border hidden md:block" />
              {trip.stops.map((stop, idx) => (
                <Reveal key={idx} variant="up" delay={idx * 0.05}>
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 mb-12 last:mb-0">
                    <div className="md:col-span-3 flex md:justify-end">
                      <div className="flex items-center gap-3 md:flex-col md:items-end md:text-right">
                        <div className="w-12 h-12 bg-forest text-cream flex items-center justify-center font-display text-sm" style={{ ...sharp, fontFamily: "var(--font-cormorant), serif" }}>
                          {String(idx + 1).padStart(2, "0")}
                        </div>
                        <p className="font-eyebrow text-gold">{stop.day}</p>
                      </div>
                    </div>

                    <div className="md:col-span-9">
                      <div className="bg-alabaster border border-border/60 overflow-hidden" style={sharp}>
                        <div className="aspect-[16/9] overflow-hidden bg-bone">
                          <img src={stop.image} alt={stop.title} className="w-full h-full object-cover img-luxury" />
                        </div>
                        <div className="p-5 md:p-6">
                          <h3
                            className="font-display text-2xl md:text-3xl text-charcoal tracking-tight mb-3"
                            style={{ fontFamily: "var(--font-cormorant), serif" }}
                          >
                            {stop.title}
                          </h3>
                          <p className="text-charcoal/70 leading-relaxed">{stop.description}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====================== INCLUSIONS / EXCLUSIONS ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-forest-deep text-cream">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          <div>
            <Reveal variant="up">
              <p className="font-eyebrow text-gold-soft mb-6">What's Included</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-5xl text-cream tracking-tight leading-[1.05] block mb-10"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              <CheckCircle2 className="inline w-8 h-8 mr-3 text-gold-soft" />
              Part of your journey.
            </ScrollReveal>
            <ul className="space-y-3">
              {trip.inclusions.map((item, idx) => (
                <Reveal key={idx} variant="up" delay={idx * 0.05}>
                  <li className="flex items-start gap-3 text-cream/85">
                    <CheckCircle2 className="w-5 h-5 text-gold-soft flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>

          <div>
            <Reveal variant="up">
              <p className="font-eyebrow text-cream/50 mb-6">Not Included</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-5xl text-cream tracking-tight leading-[1.05] block mb-10"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              <XCircle className="inline w-8 h-8 mr-3 text-cream/40" />
              For you to arrange.
            </ScrollReveal>
            <ul className="space-y-3">
              {trip.exclusions.map((item, idx) => (
                <Reveal key={idx} variant="up" delay={idx * 0.05}>
                  <li className="flex items-start gap-3 text-cream/65">
                    <XCircle className="w-5 h-5 text-cream/40 flex-shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{item}</span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ====================== WHERE YOU'LL STAY (related accommodations) ====================== */}
      {stays.length > 0 && (
        <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
          <div className="mx-auto max-w-[1400px]">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">Where You'll Stay</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05] block mb-12"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              Your <span className="italic text-forest">lodges & camps.</span>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {stays.map((acc, idx) => (
                <Reveal key={acc.id} variant="up" delay={idx * 0.1}>
                  <article
                    onClick={() => navigateToAccommodation(acc.id)}
                    className="bg-alabaster border border-border/60 overflow-hidden cursor-pointer group card-luxury"
                    style={sharp}
                  >
                    <div className="aspect-[16/9] overflow-hidden bg-bone card-zoom">
                      <img src={acc.image} alt={acc.name} className="w-full h-full object-cover img-luxury" />
                    </div>
                    <div className="p-5 md:p-6">
                      <p className="font-eyebrow text-gold mb-2">{acc.location}</p>
                      <h3
                        className="font-display text-2xl text-charcoal tracking-tight mb-3 group-hover:text-forest transition-colors"
                        style={{ fontFamily: "var(--font-cormorant), serif" }}
                      >
                        {acc.name}
                      </h3>
                      <p className="text-sm text-charcoal/70 leading-relaxed line-clamp-2 mb-4">{acc.description}</p>
                      <div className="flex items-center justify-between pt-3 border-t border-border">
                        <span className="font-label text-charcoal/60">{acc.pricePerNight}</span>
                        <span className="font-eyebrow text-gold">Explore →</span>
                      </div>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ====================== MAP PLACEHOLDER ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-alabaster">
        <div className="mx-auto max-w-[1400px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6">The Map</p>
            <h2
              className="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05] mb-12"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              Where you'll <span className="italic text-forest">travel.</span>
            </h2>
          </Reveal>
          <Reveal variant="up" delay={0.2}>
            <div className="relative aspect-[16/7] bg-forest border border-border overflow-hidden" style={sharp}>
              <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: "radial-gradient(circle at 20% 30%, rgba(201,177,135,1) 2px, transparent 2px), radial-gradient(circle at 70% 60%, rgba(201,177,135,1) 2px, transparent 2px)",
                backgroundSize: "60px 60px, 80px 80px",
              }} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-cream">
                  <Compass className="w-12 h-12 mx-auto mb-3 text-gold-soft" />
                  <p
                    className="font-display text-3xl md:text-4xl mb-2"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {trip.destination}
                  </p>
                  <p className="text-cream/70 text-sm">{formatDate(trip.startDate)} — {formatDate(trip.endDate)}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== CONTINUE EXPLORING ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
        <div className="mx-auto max-w-[1400px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6">Continue Exploring</p>
            <h2
              className="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05] mb-12"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              Other departures to <span className="italic text-forest">consider.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {others.map((t, idx) => (
              <Reveal key={t.id} variant="up" delay={idx * 0.1}>
                <article
                  onClick={() => navigateToScheduledTrip(t.id)}
                  className="bg-alabaster border border-border/60 overflow-hidden cursor-pointer group card-luxury"
                  style={sharp}
                >
                  <div className="aspect-[4/3] overflow-hidden bg-bone card-zoom">
                    <img src={t.image} alt={t.name} className="w-full h-full object-cover img-luxury" />
                  </div>
                  <div className="p-5">
                    <p className="font-eyebrow text-gold mb-2">{formatDate(t.startDate)}</p>
                    <h3
                      className="font-display text-xl md:text-2xl text-charcoal tracking-tight group-hover:text-forest transition-colors mb-2"
                      style={{ fontFamily: "var(--font-cormorant), serif" }}
                    >
                      {t.name}
                    </h3>
                    <div className="flex items-center justify-between pt-3 border-t border-border">
                      <span className="text-xs text-charcoal/60">{t.durationDays} days</span>
                      <span className="font-display text-lg text-forest" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                        ${t.priceFrom.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== BOOKING MODAL ====================== */}
      <BookingModal tripType="scheduled-trip" trip={trip as ScheduledTrip} open={bookingOpen} onClose={() => setBookingOpen(false)} />
    </div>
  );
}

function Meta({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <span className="flex items-center gap-2">
      <span className="text-gold">{icon}</span>
      <span>{text}</span>
    </span>
  );
}

function FactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-cream/10 pb-2 last:border-0 last:pb-0">
      <span className="font-eyebrow text-cream/50 text-xs tracking-[0.2em] uppercase flex-shrink-0">{label}</span>
      <span className="text-cream text-sm text-right">{value}</span>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
