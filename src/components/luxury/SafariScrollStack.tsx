"use client";

import { useRouter } from "@/lib/router";
import { Reveal } from "@/components/luxury/Reveal";
import { useLang } from "@/lib/language";

const sharp = { borderRadius: 0 } as const;

// Four signature destinations in a 2x2 grid — NOT Namibia
// Country names and taglines are translated via t() in the component below
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

  return (
    <section className="bg-canvas pt-12 md:pt-20 pb-12 md:pb-16 overflow-hidden">
      {/* Section heading */}
      <div className="px-6 md:px-10 mb-8 md:mb-12 text-center max-w-3xl mx-auto">
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

      {/* 2x2 grid */}
      <div className="px-6 md:px-10 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
          {signatureDestinationKeys.map((dest, idx) => (
            <Reveal key={dest.countryKey} variant="up" delay={idx * 0.08}>
              <button
                onClick={() => navigateToDestination(t(dest.countryKey))}
                data-cursor="view"
                className="group relative w-full aspect-[3/2] overflow-hidden bg-charcoal block"
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
                    className="font-display text-3xl md:text-5xl lg:text-6xl text-cream tracking-tight mb-1 md:mb-2 leading-[0.95]"
                    style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
                  >
                    {t(dest.countryKey)}
                  </h3>
                  <p
                    className="text-sm md:text-lg text-cream/80 italic"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {t(dest.taglineKey)}
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
