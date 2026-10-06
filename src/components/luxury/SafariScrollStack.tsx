"use client";

import { useRouter } from "@/lib/router";
import { Reveal } from "@/components/luxury/Reveal";

const sharp = { borderRadius: 0 } as const;

// Four signature destinations in a 2x2 grid — NOT Namibia
const signatureDestinations = [
  {
    src: "https://sfile.chatglm.cn/images-ppt/f2522b36c1bf.jpg",
    country: "Uganda",
    tagline: "The Pearl of Africa",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/1b293846f02b.jpg",
    country: "Kenya",
    tagline: "Visit Magical Kenya",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
    country: "Tanzania",
    tagline: "Land of Kilimanjaro, Serengeti and Zanzibar",
  },
  {
    src: "https://sfile.chatglm.cn/images-ppt/25ee49aa2374.jpg",
    country: "Rwanda",
    tagline: "Land of a Thousand Hills",
  },
];

export function SafariScrollStack() {
  const { navigateToDestination } = useRouter();

  return (
    <section className="bg-canvas pt-12 md:pt-20 pb-12 md:pb-16 overflow-hidden">
      {/* Section heading */}
      <div className="px-6 md:px-10 mb-8 md:mb-12 text-center max-w-3xl mx-auto">
        <h2
          className="font-display text-3xl md:text-6xl text-charcoal tracking-tight leading-[1.05] mb-4 md:mb-6"
          style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
        >
          Explore Our <span className="italic text-forest">Signature Destinations</span>
        </h2>
        <p className="text-sm md:text-lg text-charcoal/70 leading-relaxed">
          Discover East Africa's most remarkable destinations, from Uganda's wild heart to Kenya
          and Tanzania's iconic safari landscapes. Our travel specialists create bespoke journeys
          tailored to your interests and style.
        </p>
        <p className="font-display text-base md:text-xl italic text-forest mt-3" style={{ fontFamily: "var(--font-cormorant), serif" }}>
          Explore. Experience. Unzip Africa.
        </p>
      </div>

      {/* 2x2 grid */}
      <div className="px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {signatureDestinations.map((dest, idx) => (
            <Reveal key={dest.country} variant="up" delay={idx * 0.08}>
              <button
                onClick={() => navigateToDestination(dest.country)}
                data-cursor="view"
                className="group relative w-full aspect-[3/2] overflow-hidden bg-charcoal block"
                style={sharp}
              >
                <img
                  src={dest.src}
                  alt={`${dest.country} — ${dest.tagline}`}
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
                    className="font-display text-3xl md:text-5xl lg:text-6xl text-cream tracking-tight mb-1 md:mb-2 leading-[0.95]"
                    style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
                  >
                    {dest.country}
                  </h3>
                  <p
                    className="text-sm md:text-lg text-cream/80 italic"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {dest.tagline}
                  </p>
                </div>

                {/* Frame border */}
                <div className="absolute inset-3 md:inset-5 border border-cream/15 group-hover:border-cream/35 transition-all duration-700 pointer-events-none" />
              </button>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
