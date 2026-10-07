"use client";

import { useState, useRef } from "react";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";
import { useLang } from "@/lib/language";
import { useScheduledTrips } from "@/lib/store";

const sharp = { borderRadius: 0 } as const;

// FAQ questions and answers use translation keys (faq.q1..q4, faq.a1..a4).
// The list is just for ordering.
const faqKeys = [
  { qKey: "faq.q1", aKey: "faq.a1" },
  { qKey: "faq.q2", aKey: "faq.a2" },
  { qKey: "faq.q3", aKey: "faq.a3" },
  { qKey: "faq.q4", aKey: "faq.a4" },
];

// Why-choose-us items use translation keys (why.item1Title..item6Title, item1Body..item6Body).
const whyChooseUsKeys = [
  { num: "01", titleKey: "why.item1Title", bodyKey: "why.item1Body", icon: "silence" },
  { num: "02", titleKey: "why.item2Title", bodyKey: "why.item2Body", icon: "guide" },
  { num: "03", titleKey: "why.item3Title", bodyKey: "why.item3Body", icon: "leaf" },
  { num: "04", titleKey: "why.item4Title", bodyKey: "why.item4Body", icon: "globe" },
  { num: "05", titleKey: "why.item5Title", bodyKey: "why.item5Body", icon: "key" },
  { num: "06", titleKey: "why.item6Title", bodyKey: "why.item6Body", icon: "phone" },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);
  const { t } = useLang();

  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-alabaster">
      <div className="mx-auto max-w-[1300px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Left — heading */}
          <div className="md:col-span-5">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">{t("faq.eyebrow")}</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05] block mb-8"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              {t("faq.heading1")} <span className="italic text-forest">{t("faq.heading2")}</span>
            </ScrollReveal>
            <Reveal variant="up" delay={0.2}>
              <p className="text-charcoal/70 leading-relaxed mb-8">
                {t("faq.subtitle")}
              </p>
              <a
                href="mailto:private@unzipafrica.com"
                className="link-underline text-charcoal/70"
              >
                {t("faq.askSpecialist")}
              </a>
            </Reveal>
          </div>

          {/* Right — accordion */}
          <div className="md:col-span-7">
            <div className="border-t border-border">
              {faqKeys.map((faq, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div key={idx} className="border-b border-border">
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                      aria-expanded={isOpen}
                    >
                      <span className={`font-display text-xl md:text-2xl tracking-tight transition-colors duration-500 ${isOpen ? "text-forest" : "text-charcoal group-hover:text-forest"}`}>
                        {t(faq.qKey)}
                      </span>
                      <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center transition-all duration-500 ${isOpen ? "rotate-45 bg-gold text-charcoal" : "border border-charcoal/30 text-charcoal/60 group-hover:border-charcoal"}`}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14M5 12h14" />
                        </svg>
                      </span>
                    </button>
                    <div
                      className="overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
                      style={{
                        maxHeight: isOpen ? "400px" : "0px",
                        opacity: isOpen ? 1 : 0,
                      }}
                    >
                      <p className="text-charcoal/75 leading-relaxed pb-6 pr-12">
                        {t(faq.aKey)}
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
  );
}

export function WhyChooseUsSection() {
  const { t } = useLang();
  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
      <div className="mx-auto max-w-[1600px]">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6">{t("why.eyebrow")}</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-5xl md:text-7xl lg:text-8xl text-charcoal tracking-tight leading-[0.95] block max-w-4xl mx-auto"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={6}
          >
            {t("why.heading1")} <span className="italic text-forest">{t("why.heading2")}</span>
          </ScrollReveal>
        </div>

        {/* Grid of reasons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 md:gap-y-20">
          {whyChooseUsKeys.map((item, idx) => (
            <Reveal key={item.num} variant="up" delay={(idx % 3) * 0.1}>
              <div className="group h-full card-hover-rich p-6 md:p-8">
                <div className="flex items-start gap-5 mb-5">
                  <span className="font-display text-5xl md:text-6xl text-gold/40 italic leading-none group-hover:text-gold transition-colors duration-700">
                    {item.num}
                  </span>
                  <div className="flex-shrink-0 w-10 h-10 mt-1 border border-charcoal/20 group-hover:border-gold group-hover:bg-gold/10 flex items-center justify-center transition-all duration-500">
                    <ReasonIcon name={item.icon} />
                  </div>
                </div>
                <h3 className="font-display text-2xl md:text-3xl text-charcoal tracking-tight mb-4 leading-[1.1] group-hover:text-forest transition-colors duration-500">
                  {t(item.titleKey)}
                </h3>
                <p className="text-charcoal/70 leading-relaxed">{t(item.bodyKey)}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ReasonIcon({ name }: { name: string }) {
  const iconClass = "w-5 h-5 text-charcoal/70 group-hover:text-gold transition-colors duration-500";
  switch (name) {
    case "silence":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 12h2l2-8 4 16 4-12 2 4h4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "guide":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="8" r="4" />
          <path d="M5 21c0-4.5 3.5-7 7-7s7 2.5 7 7" strokeLinecap="round" />
        </svg>
      );
    case "leaf":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M11 20A7 7 0 0 1 4 13c0-6 8-9 16-9 0 8-3 16-9 16Z" strokeLinejoin="round" />
          <path d="M4 21c4-4 8-8 12-12" strokeLinecap="round" />
        </svg>
      );
    case "globe":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" strokeLinecap="round" />
        </svg>
      );
    case "key":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="8" cy="8" r="4" />
          <path d="M11 11l8 8M16 16l2-2M14 14l2-2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "phone":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}

/* ===================== Founder Message Section (two columns) ===================== */
export function FounderMessageSection() {
  const { t } = useLang();
  return (
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
      <div className="mx-auto max-w-[1300px] relative grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center">
        {/* Left — founder portrait */}
        <div className="md:col-span-5">
          <Reveal variant="left">
            <div className="relative aspect-[4/5] overflow-hidden bg-charcoal" style={sharp}>
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=1200&q=80"
                alt={t("founder.name")}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute inset-3 border border-cream/15 pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-charcoal/90 to-transparent">
                <p className="font-eyebrow text-gold-soft mb-1">{t("founder.label")}</p>
                <p className="font-display text-2xl text-cream tracking-tight" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  {t("founder.name")}
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* Right — message */}
        <div className="md:col-span-7">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold-soft mb-6">{t("founder.eyebrow")}</p>
          </Reveal>
          <ScrollReveal
            as="blockquote"
            containerClassName="font-display text-2xl md:text-4xl lg:text-5xl leading-[1.3] text-cream tracking-tight block mb-8"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {t("founder.quote")}
          </ScrollReveal>
          <Reveal variant="up" delay={0.3}>
            <p className="font-label text-gold-soft">{t("founder.attribution")}</p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ===================== Scheduled Trips Section ===================== */
export function ScheduledTripsSection() {
  const trips = useScheduledTrips();
  const { navigateToScheduledTrip, navigate } = useRouter();
  const { t } = useLang();

  // Show the 3 most recently created trips (admin prepends new ones to the array)
  const upcoming = trips.slice(0, 3);

  if (upcoming.length === 0) return null;

  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
      <div className="mx-auto max-w-[1600px]">
        {/* Heading */}
        <div className="mb-12 md:mb-16 text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6">{t("scheduledSection.eyebrow")}</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-5xl md:text-7xl lg:text-8xl text-charcoal tracking-tight leading-[0.95] block max-w-3xl mx-auto"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={6}
          >
            {t("scheduledSection.title1")} <span className="italic text-forest">{t("scheduledSection.title2")}</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-charcoal/70 leading-relaxed mt-6 max-w-2xl mx-auto">
              {t("scheduledSection.subtitle")}
            </p>
          </Reveal>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {upcoming.map((trip, idx) => (
            <Reveal key={trip.id} variant="up" delay={idx * 0.1}>
              <article
                onClick={() => navigateToScheduledTrip(trip.id)}
                className="bg-alabaster border border-border/60 overflow-hidden cursor-pointer group card-luxury flex flex-col"
                style={sharp}
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-bone card-zoom">
                  <img src={trip.image} alt={trip.name} className="w-full h-full object-cover img-luxury" />
                  <div className="absolute top-3 left-3 bg-charcoal/70 text-cream text-[0.65rem] tracking-[0.2em] uppercase px-3 py-1.5" style={sharp}>
                    {formatDate(trip.startDate)}
                  </div>
                  {trip.spotsLeft <= 5 && (
                    <div className="absolute top-3 right-3 bg-gold text-charcoal text-[0.6rem] tracking-[0.15em] uppercase px-3 py-1.5" style={sharp}>
                      {trip.spotsLeft} {t("scheduledSection.spotsLeft")}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 md:p-6 flex flex-col flex-1">
                  <p className="font-eyebrow text-gold mb-2">{trip.destination}</p>
                  <h3
                    className="font-display text-2xl md:text-3xl text-charcoal tracking-tight mb-3 leading-[1.1] group-hover:text-forest transition-colors duration-500"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {trip.name}
                  </h3>
                  <p className="text-sm text-charcoal/70 leading-relaxed line-clamp-2 mb-5">{trip.description}</p>

                  <div className="mt-auto pt-4 border-t border-border flex items-end justify-between">
                    <div>
                      <p className="font-display text-2xl text-forest" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                        ${trip.priceFrom.toLocaleString()}
                      </p>
                      <p className="text-[0.65rem] text-charcoal/50">{t("common.perPerson")} · {trip.durationDays} {t("common.daysLower")}</p>
                    </div>
                    <span className="font-eyebrow text-gold">{t("scheduledSection.exploreArrow")}</span>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        {/* View All Scheduled Trips button */}
        <div className="text-center mt-12 md:mt-16">
          <button
            onClick={() => navigate("scheduled-trips")}
            className="btn-luxury"
          >
            {t("scheduledSection.viewAll")}
            <svg className="ml-2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </section>
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

/* ===================== Safari Cars Section — Two Column with Image Stack ===================== */

const safariCarImages = [
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/29d296b5dde8.jpg",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8a1330843fc4.jpg",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/47d9868387d3.jpg",
  "https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/8821fb17b3de.jpg",
];

export function SafariCarsSection() {
  const { t } = useLang();
  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 md:gap-16 items-center">

          {/* Left — Text + Features */}
          <div>
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-4">{t("safariCars.eyebrow")}</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-3xl md:text-6xl text-charcoal tracking-tight leading-[1.05] block mb-6"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              {t("safariCars.ourLine")} <span className="italic text-forest">{t("safariCars.cars")}</span>
            </ScrollReveal>
            <Reveal variant="up" delay={0.2}>
              <p className="text-base md:text-lg text-charcoal/70 leading-relaxed mb-8">
                {t("safariCars.body")}
              </p>
            </Reveal>

            {/* Features list */}
            <Reveal variant="up" delay={0.3}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { titleKey: "safariCars.feature1", icon: "seat" },
                  { titleKey: "safariCars.feature2", icon: "window" },
                  { titleKey: "safariCars.feature3", icon: "roof" },
                  { titleKey: "safariCars.feature4", icon: "charge" },
                ].map((feature) => (
                  <div key={feature.titleKey} className="flex items-center gap-3 p-4 border border-border card-hover-rich">
                    <div className="flex-shrink-0 w-10 h-10 border border-charcoal/20 flex items-center justify-center">
                      <CarFeatureIcon name={feature.icon} />
                    </div>
                    <span className="font-label text-charcoal text-xs">{t(feature.titleKey)}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — Image Stack Swipe Effect */}
          <Reveal variant="right" delay={0.2}>
            <SafariCarImageStack images={safariCarImages} />
          </Reveal>

        </div>
      </div>
    </section>
  );
}

/* ===================== Image Stack Swipe Component ===================== */
function SafariCarImageStack({ images }: { images: string[] }) {
  const { t } = useLang();
  const [stack, setStack] = useState<string[]>(images);
  const [swipeDir, setSwipeDir] = useState<"left" | "right" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  // Swipe the top image to the back — it goes behind, next image shows
  const swipeNext = (dir: "left" | "right") => {
    if (isAnimating || stack.length <= 1) return;
    setIsAnimating(true);
    setSwipeDir(dir);
    // After the animation completes, move the top image to the back
    setTimeout(() => {
      setStack((prev) => {
        const next = [...prev];
        const top = next.shift(); // Remove top
        if (top) next.push(top); // Put it at the back
        return next;
      });
      setSwipeDir(null);
      setIsAnimating(false);
    }, 500);
  };

  // Touch / mouse swipe handling
  const touchStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 40) {
      swipeNext(deltaX > 0 ? "right" : "left");
    }
  };

  // Click to advance
  const handleClick = () => {
    swipeNext("left");
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-[4/5] max-w-[500px] mx-auto select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
      data-cursor="view"
    >
      <style>{`
        @keyframes stackSwipeLeft {
          0% { transform: translateX(0) rotate(0deg) scale(1); opacity: 1; z-index: 10; }
          100% { transform: translateX(-120%) rotate(-15deg) scale(0.9); opacity: 0; z-index: 0; }
        }
        @keyframes stackSwipeRight {
          0% { transform: translateX(0) rotate(0deg) scale(1); opacity: 1; z-index: 10; }
          100% { transform: translateX(120%) rotate(15deg) scale(0.9); opacity: 0; z-index: 0; }
        }
        .stack-img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          will-change: transform, opacity;
        }
        .stack-img.swiping-left {
          animation: stackSwipeLeft 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .stack-img.swiping-right {
          animation: stackSwipeRight 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Hint text */}
      <div className="absolute -top-8 left-0 right-0 text-center">
        <p className="font-eyebrow text-charcoal/40">{t("safariCars.swipeHint")}</p>
      </div>

      {/* Stack of images — last in array is on top */}
      {stack.map((src, idx) => {
        const isTop = idx === 0;
        const isSecond = idx === 1;
        const isThird = idx === 2;

        // Stack offset — cards behind the top one are slightly offset
        const offset = isTop ? 0 : isSecond ? 12 : isThird ? 24 : 36;
        const scale = isTop ? 1 : isSecond ? 0.95 : isThird ? 0.9 : 0.85;
        const opacity = isTop ? 1 : isSecond ? 0.8 : isThird ? 0.6 : 0.4;

        return (
          <div
            key={src}
            className="absolute overflow-hidden bg-bone border border-border/30 shadow-lg"
            style={{
              top: `${offset}px`,
              left: `${offset}px`,
              right: `${-offset}px`,
              bottom: `${-offset}px`,
              zIndex: stack.length - idx,
              transform: `scale(${scale})`,
              opacity: opacity,
              borderRadius: 0,
            }}
          >
            <img
              src={src}
              alt={`Safari vehicle ${idx + 1}`}
              className={`stack-img ${isTop && isAnimating ? (swipeDir === "right" ? "swiping-right" : "swiping-left") : ""}`}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent" />
            {/* Frame border */}
            <div className="absolute inset-3 border border-cream/15 pointer-events-none" />
          </div>
        );
      })}

      {/* Counter */}
      <div className="absolute -bottom-8 left-0 right-0 text-center">
        <p className="font-label text-charcoal/40 text-xs">
          {stack.length} {t("safariCars.photosCount")}
        </p>
      </div>
    </div>
  );
}

function CarFeatureIcon({ name }: { name: string }) {
  const iconClass = "w-6 h-6 text-charcoal/70";
  switch (name) {
    case "seat":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 18v-6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6M5 18H3M5 18h14M19 18h2M7 9V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "window":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M12 4v16M4 12h16" strokeLinecap="round" />
        </svg>
      );
    case "roof":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 16h18M5 16V9l7-5 7 5v7M9 16v-4h6v4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "charge":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}
