"use client";

import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";
import { useLang } from "@/lib/language";

export function WelcomeSection() {
  const { navigate } = useRouter();
  const { t } = useLang();

  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-center">
          {/* Left — Image (on desktop, image on the left; on mobile, image on top) */}
          <div className="lg:col-span-5 order-1 lg:order-1">
            <Reveal variant="left">
              <div className="relative aspect-[4/5] overflow-hidden bg-bone group card-zoom">
                <img
                  src="https://sfile.chatglm.cn/images-ppt/e9781ad7f905.jpg"
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
            <Reveal variant="right">
              <p className="font-eyebrow text-gold mb-6">{t("welcome.eyebrow")}</p>
            </Reveal>

            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-5xl lg:text-[3.5rem] text-charcoal tracking-tight leading-[1.1] block mb-8"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              {t("welcome.heading1")} <span className="italic text-forest">{t("welcome.heading2")}</span>
            </ScrollReveal>

            <Reveal variant="up" delay={0.2}>
              <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-6">
                {t("welcome.para1")}
              </p>
              <p className="text-base md:text-lg text-charcoal/75 leading-relaxed mb-6">
                {t("welcome.para2")}
              </p>
              <p className="font-display text-xl md:text-2xl italic text-forest mb-10" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                {t("welcome.para3")}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <button onClick={() => navigate("contact")} className="btn-luxury btn-luxury-dark">
                  {t("welcome.cta1")}
                </button>
                <button
                  onClick={() => navigate("about")}
                  className="link-underline text-charcoal/70"
                >
                  {t("welcome.cta2")}
                </button>
              </div>
            </Reveal>

            {/* Avatar group — social proof */}
            <Reveal variant="up" delay={0.4}>
              <div className="mt-12 pt-10 border-t border-border">
                <div className="flex items-center gap-3">
                  {/* Circular avatars — overlapping */}
                  <div className="flex -space-x-2">
                    {[
                      { src: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80", name: "Mark" },
                      { src: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&q=80", name: "Olivia" },
                      { src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80", name: "Josh" },
                      { src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&q=80", name: "Emma" },
                    ].map((avatar) => (
                      <div
                        key={avatar.name}
                        className="w-9 h-9 md:w-10 md:h-10 rounded-full overflow-hidden bg-bone ring-2 ring-canvas flex-shrink-0"
                        style={{ borderRadius: "50%" }}
                      >
                        <img
                          src={avatar.src}
                          alt={avatar.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Text — standalone, no pill/oval */}
                  <p className="text-charcoal/60 text-xs md:text-sm">
                    {t("welcome.trustedBy")} <strong className="text-charcoal font-medium">{t("welcome.trustedCount")}</strong> {t("welcome.discerningTravellers")}
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
