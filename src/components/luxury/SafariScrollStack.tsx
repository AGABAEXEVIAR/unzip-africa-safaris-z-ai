"use client";

import ScrollStack, { ScrollStackItem } from "@/components/luxury/ScrollStack";

// Safari destination cards — one per country with a tagline
const safariStackImages = [
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
    src: "https://sfile.chatglm.cn/images-ppt/97c40e4746f3.jpg",
    country: "Namibia",
    tagline: "Endless Horizon",
  },
];

export function SafariScrollStack() {
  return (
    <section className="bg-canvas pt-12 md:pt-20 pb-0 overflow-hidden">
      {/* Section heading */}
      <div className="px-6 md:px-10 mb-8 md:mb-12 text-center max-w-3xl mx-auto">
        <h2
          className="font-display text-3xl md:text-6xl text-charcoal tracking-tight leading-[1.05] mb-4 md:mb-6"
          style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
        >
          Explore our most <span className="italic text-forest">popular destinations</span>
        </h2>
        <p className="text-sm md:text-lg text-charcoal/70 leading-relaxed">
          Our expert travel designers are on hand to create the perfect trip for you. Take a look
          at some of the amazing destinations we offer below, or get hold of us and let us
          tailor-make your trip through East Africa.
        </p>
      </div>

      {/* ScrollStack — works on all devices (mobile + desktop) */}
      <ScrollStack
        itemDistance={80}
        itemScale={0.04}
        itemStackDistance={40}
        stackPosition="15%"
        scaleEndPosition="8%"
        baseScale={0.85}
        blurAmount={2}
      >
        {safariStackImages.map((img, idx) => (
          <ScrollStackItem key={idx} itemClassName="!p-0 !h-[60vh] md:!h-[70vh]">
            <div className="relative w-full h-full overflow-hidden bg-charcoal">
              <img
                src={img.src}
                alt={`${img.country} — ${img.tagline}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient overlay for caption legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/85 via-charcoal/25 to-transparent" />

              {/* Caption — country name + tagline, lower-left */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
                <p className="font-eyebrow text-gold-soft mb-2 md:mb-3">0{idx + 1}</p>
                <h3
                  className="font-display text-4xl md:text-7xl lg:text-8xl text-cream tracking-tight mb-2 md:mb-3 leading-[0.95]"
                  style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
                >
                  {img.country}
                </h3>
                <p
                  className="text-base md:text-xl text-cream/80 italic"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  {img.tagline}
                </p>
              </div>

              {/* Frame border */}
              <div className="absolute inset-3 md:inset-6 border border-cream/15 pointer-events-none" />
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}
