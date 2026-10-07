"use client";

import { useEffect } from "react";
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

  // Pure autoplay carousel — no manual controls (no dots, no arrows).
  // Slow, intentional pace: a new slide every 6 seconds.
  // stopOnMouseEnter: true pauses the autoplay whenever the user hovers
  // any card (or anywhere inside the carousel viewport), so they can read
  // the caption without it sliding away.
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
      dragFree: false,
    },
    [Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  // No need to track selected/scrollSnaps since there's no dot pagination.
  // Just ensure embla is initialised.
  useEffect(() => {
    if (!emblaApi) return;
    // Force a re-init once mounted so the first autoplay tick starts cleanly.
    emblaApi.reInit({
      loop: true,
      align: "start",
      containScroll: "trimSnaps",
      dragFree: false,
    });
  }, [emblaApi]);

  return (
    <section className="bg-canvas pt-12 md:pt-20 pb-12 md:pb-16 overflow-hidden">
      {/* Section heading — no arrow controls (pure autoplay) */}
      <div className="px-6 md:px-10 max-w-[1600px] mx-auto">
        <div className="max-w-3xl text-center md:text-left mx-auto md:mx-0 mb-8 md:mb-12">
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
      </div>

      {/* Embla viewport — single-row horizontal carousel, autoplay, no manual controls */}
      <div className="overflow-hidden signature-destinations-carousel" ref={emblaRef}>
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
    </section>
  );
}
