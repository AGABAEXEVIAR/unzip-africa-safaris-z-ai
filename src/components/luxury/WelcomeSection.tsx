"use client";

import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";

export function WelcomeSection() {
  const { navigate, openQuote } = useRouter();

  return (
    <section className="py-24 md:py-40 px-6 md:px-10 bg-canvas">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
          {/* Left — Image (on desktop, image on the left; on mobile, image on top) */}
          <div className="lg:col-span-5 order-1 lg:order-1">
            <Reveal variant="up">
              <div className="relative aspect-[4/5] overflow-hidden bg-bone group">
                <img
                  src="https://sfile.chatglm.cn/images-ppt/06dd6b0e65bb.jpg"
                  alt="Safari landscape with acacia trees at golden hour"
                  className="absolute inset-0 w-full h-full object-cover img-luxury"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/30 to-transparent" />
                <div className="absolute inset-4 md:inset-6 border border-cream/15 pointer-events-none" />
              </div>
            </Reveal>
          </div>

          {/* Right — Text content */}
          <div className="lg:col-span-7 lg:col-start-7 order-2 lg:order-2">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">Welcome to Unzip Africa</p>
            </Reveal>

            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-5xl lg:text-[3.5rem] text-charcoal tracking-tight leading-[1.1] block mb-8"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              A luxury safari company specialising in <span className="italic text-forest">tailor-made wildlife adventures</span>
            </ScrollReveal>

            <Reveal variant="up" delay={0.2}>
              <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-6">
                Welcome to Unzip Africa, a luxury safari company specialising in tailor-made
                wildlife adventures, gorilla trekking experiences, Great Migration safaris, and
                exclusive journeys across Uganda, Kenya, and Tanzania.
              </p>
              <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-10">
                We create extraordinary safari experiences for travellers seeking authenticity,
                luxury, adventure, and meaningful connections with Africa&rsquo;s wildlife and
                cultures.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <button onClick={openQuote} className="btn-luxury btn-luxury-gold">
                  Plan Your Safari
                </button>
                <button
                  onClick={() => navigate("about")}
                  className="link-underline text-charcoal/70"
                >
                  Discover Our Story
                </button>
              </div>
            </Reveal>

            {/* Stats row */}
            <Reveal variant="up" delay={0.4}>
              <div className="grid grid-cols-3 gap-6 md:gap-10 mt-14 pt-10 border-t border-border">
                <div>
                  <p className="font-display text-3xl md:text-4xl text-forest">3</p>
                  <p className="font-label text-charcoal/60 mt-2">Countries</p>
                </div>
                <div>
                  <p className="font-display text-3xl md:text-4xl text-forest">15+</p>
                  <p className="font-label text-charcoal/60 mt-2">Years Experience</p>
                </div>
                <div>
                  <p className="font-display text-3xl md:text-4xl text-forest">1,200+</p>
                  <p className="font-label text-charcoal/60 mt-2">Private Journeys</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
