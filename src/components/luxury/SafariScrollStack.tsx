"use client";

import ScrollStack, { ScrollStackItem } from "@/components/luxury/ScrollStack";

// Safari images for the scroll stack — each card is purely an image with a subtle gradient + caption overlay
const safariStackImages = [
  {
    src: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=1600&q=85",
    caption: "Big Cat Country",
    location: "Maasai Mara, Kenya",
  },
  {
    src: "https://images.unsplash.com/photo-1549366021-9f761d450615?auto=format&fit=crop&w=1600&q=85",
    caption: "Gorilla Encounters",
    location: "Bwindi, Uganda",
  },
  {
    src: "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?auto=format&fit=crop&w=1600&q=85",
    caption: "The Great Migration",
    location: "Serengeti, Tanzania",
  },
  {
    src: "https://images.unsplash.com/photo-1505761671935-60b3a7427bad?auto=format&fit=crop&w=1600&q=85",
    caption: "The Inland Oasis",
    location: "Okavango Delta, Botswana",
  },
  {
    src: "https://images.unsplash.com/photo-1500289466305-babaa6e8b1b3?auto=format&fit=crop&w=1600&q=85",
    caption: "The Living Desert",
    location: "Sossusvlei, Namibia",
  },
];

export function SafariScrollStack() {
  return (
    <section className="bg-canvas py-16 md:py-24 overflow-hidden">
      {/* Section heading */}
      <div className="px-6 md:px-10 mb-8 md:mb-16 text-center">
        <p className="font-eyebrow text-gold mb-4">A Visual Journey</p>
        <h2 className="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05]">
          Scroll through <span className="italic text-forest">the wild.</span>
        </h2>
      </div>

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
                alt={`${img.caption} — ${img.location}`}
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Gradient overlay for caption legibility */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent" />

              {/* Caption — minimal, lower-left */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
                <p className="font-eyebrow text-gold-soft mb-2">0{idx + 1}</p>
                <h3
                  className="font-display text-4xl md:text-6xl text-cream tracking-tight mb-2 leading-[1.05]"
                  style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
                >
                  {img.caption}
                </h3>
                <p className="font-label text-cream/70">{img.location}</p>
              </div>

              {/* Frame border */}
              <div className="absolute inset-4 md:inset-6 border border-cream/15 pointer-events-none" />
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </section>
  );
}
