"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useRouter } from "@/lib/router";
import { useLang } from "@/lib/language";

const sharp = { borderRadius: 0 } as const;

// Four signature destinations — NOT Namibia.
// Country names and taglines are translated via t() in the component below.
const signatureDestinationKeys = [
  {
    src: "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
    countryKey: "scrollstack.uganda",
    taglineKey: "scrollstack.ugandaTagline",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/1b293846f02b.jpg",
    countryKey: "scrollstack.kenya",
    taglineKey: "scrollstack.kenyaTagline",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
    countryKey: "scrollstack.tanzania",
    taglineKey: "scrollstack.tanzaniaTagline",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg",
    countryKey: "scrollstack.rwanda",
    taglineKey: "scrollstack.rwandaTagline",
  },
];

export function SafariScrollStack() {
  const { navigateToDestination } = useRouter();
  const { t } = useLang();

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
      dragFree: false,
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  const [selected, setSelected] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  const scrollTo = useCallback(
    (i: number) => emblaApi?.scrollTo(i),
    [emblaApi]
  );

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  return (
    <section className="bg-canvas pt-12 md:pt-20 pb-12 md:pb-16 overflow-hidden">
      {/* Section heading + controls */}
      <div className="px-6 md:px-10 max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8 md:mb-12">
          <div className="max-w-3xl text-center md:text-left mx-auto md:mx-0">
            <h2
              className="font-display text-3xl md:text-6xl text-charcoal tracking-tight leading-[1.05] mb-4 md:mb-6"
              style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
            >
              {t("scrollstack.exploreOur")} <span className="italic text-forest">{t("scrollstack.signatureDestinations")}</span>
            </h2>
            <p className="text-sm md:text-lg text-charcoal/70 leading-relaxed">
              {t("scrollstack.introBody")}
            </p>
            <p className="font-display text-base md:text-xl italic text-forest mt-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>
              {t("scrollstack.tagline")}
            </p>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 mx-auto md:mx-0">
            <button
              onClick={scrollPrev}
              aria-label="Previous destination"
              className="w-11 h-11 border border-charcoal/30 text-charcoal hover:bg-forest hover:text-cream hover:border-forest transition-colors flex items-center justify-center"
              style={sharp}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={scrollNext}
              aria-label="Next destination"
              className="w-11 h-11 border border-charcoal/30 text-charcoal hover:bg-forest hover:text-cream hover:border-forest transition-colors flex items-center justify-center"
              style={sharp}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Embla viewport — single-row horizontal carousel */}
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex -ml-4 md:-ml-6">
          {signatureDestinationKeys.map((dest, idx) => (
            <div
              key={dest.countryKey}
              className="flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_25%] min-w-0 pl-4 md:pl-6"
            >
              <button
                onClick={() => navigateToDestination(t(dest.countryKey))}
                data-cursor="view"
                className="group relative w-full aspect-[3/4] sm:aspect-[4/5] lg:aspect-[3/4] overflow-hidden bg-charcoal block"
                style={sharp}
              >
                <img
                  src={dest.src}
                  alt={`${t(dest.countryKey)} — ${t(dest.taglineKey)}`}
                  className="absolute inset-0 w-full h-full object-cover img-luxury"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent" />

                {/* Number */}
                <div className="absolute top-4 left-4 font-display text-cream/60 text-xl italic" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  0{idx + 1}
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                  <p className="font-eyebrow text-gold-soft mb-2">0{idx + 1}</p>
                  <h3
                    className="font-display text-3xl md:text-4xl lg:text-5xl text-cream tracking-tight mb-1 md:mb-2 leading-[0.95]"
                    style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
                  >
                    {t(dest.countryKey)}
                  </h3>
                  <p
                    className="text-sm md:text-base text-cream/80 italic"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {t(dest.taglineKey)}
                  </p>
                </div>

                {/* Frame border */}
                <div className="absolute inset-3 md:inset-5 border border-cream/15 group-hover:border-cream/35 transition-all duration-700 pointer-events-none" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Dot pagination */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {scrollSnaps.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to destination ${i + 1}`}
              className={`transition-all duration-300 ${i === selected ? "w-8 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-charcoal/30 hover:bg-charcoal/50"}`}
              style={sharp}
            />
          ))}
        </div>
      )}
    </section>
  );
}
