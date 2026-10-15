"use client";

import { useState, useEffect } from "react";
import { useRouter } from "@/lib/router";
import { useLang } from "@/lib/language";
import { destinations as seedDestinations } from "@/lib/content";
import { useDestinations } from "@/lib/store";

const sharp = { borderRadius: 0 } as const;

export function CountryScrollStack() {
  const { navigateToDestination } = useRouter();
  const { t } = useLang();

  // mounted flag: false during SSR + first client render (uses seed data
  // → matches server HTML → no hydration crash). After mount, switches
  // to store data (which has DB data from the Countries admin tab).
  const [mounted, setMounted] = useState(false);
  const dbDestinations = useDestinations();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use DB data after mount (has admin's changes). Before mount, use
  // seed data (matches SSR → no hydration error).
  const destinations = mounted && dbDestinations.length > 0
    ? dbDestinations
    : seedDestinations;

  // Duplicate the list so the marquee can loop seamlessly — when the track
  // has scrolled exactly -50% (one full set of originals), the duplicate
  // set is in the original's place and the animation can reset to 0 with
  // no visible jump.
  const doubled = [...destinations, ...destinations];

  return (
    <section className="bg-canvas pt-12 md:pt-20 pb-12 md:pb-16 overflow-hidden">
      {/* Section heading */}
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

      {/* Continuous marquee track — pauses on hover via CSS in globals.css
          (.signature-destinations-marquee:hover { animation-play-state: paused }) */}
      <div className="signature-destinations-marquee">
        <div className="signature-destinations-marquee-track">
          {doubled.map((dest, idx) => {
            // Stable key per country + position-in-doubled-array so React
            // doesn't try to reuse nodes across the boundary in a way that
            // breaks the seamless loop.
            const key = `${dest.id}-${idx}`;
            return (
              <div
                key={key}
                className="signature-destinations-marquee-item"
              >
                <button
                  onClick={() => navigateToDestination(dest.country || dest.name)}
                  data-cursor="view"
                  className="group relative w-full aspect-[4/5] sm:aspect-[3/2] lg:aspect-[4/5] overflow-hidden bg-charcoal block"
                  style={sharp}
                >
                  <img
                    src={dest.imagePortrait}
                    alt={`${dest.name} — ${dest.tagline}`}
                    className="absolute inset-0 w-full h-full object-cover img-luxury"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent" />

                  {/* Number — original index (idx % length) so duplicates
                      show 01/02/03/04 instead of 05/06/07/08 */}
                  <div className="absolute top-4 left-4 font-display text-cream/60 text-xl italic" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                    0{(idx % destinations.length) + 1}
                  </div>

                  {/* Caption */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 md:p-8">
                    <p className="font-eyebrow text-gold-soft mb-2">
                      0{(idx % destinations.length) + 1}
                    </p>
                    <h3
                      className="font-display text-3xl md:text-4xl lg:text-5xl text-cream tracking-tight mb-1 md:mb-2 leading-[0.95]"
                      style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
                    >
                      {dest.name}
                    </h3>
                    <p
                      className="text-sm md:text-base text-cream/80 italic"
                      style={{ fontFamily: "var(--font-cormorant), serif" }}
                    >
                      {dest.tagline}
                    </p>
                  </div>

                  {/* Frame border */}
                  <div className="absolute inset-3 md:inset-5 border border-cream/15 group-hover:border-cream/35 transition-all duration-700 pointer-events-none" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
