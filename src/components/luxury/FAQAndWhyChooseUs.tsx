"use client";

import { useState } from "react";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";

const faqs = [
  {
    q: "What makes Unzip Africa Safaris different from other safari operators?",
    a: "Every journey we compose is built for a single party — never shared, never replicated. Our guides are fourth-generation inheritors of these landscapes, not employees. We refuse to crowd a horizon, and seven percent of every journey funds the conservation area you visit. The difference is silence: we orchestrate hours that no itinerary can describe.",
  },
  {
    q: "What is the minimum investment for a private safari?",
    a: "Our journeys begin at $25,000 per person for a five-day gorilla trek in Uganda, and extend to $250,000+ for two-week, multi-country expeditions. The investment reflects the level of access, the quality of the lodges, the exclusivity of the guiding, and the conservation contributions we make on your behalf.",
  },
  {
    q: "How far in advance should I book?",
    a: "We recommend booking six to twelve months in advance for peak season (June–October, December–February). Gorilla trekking permits in Rwanda and Uganda are particularly scarce — we secure these the moment you confirm. For last-minute travel, we maintain a small allocation of permits and camp slots for our returning guests.",
  },
  {
    q: "Are your safaris suitable for families with children?",
    a: "Yes, with consideration. We design family journeys for children aged eight and older, with age-appropriate activities, shorter drives, and dedicated family suites. Our guides are skilled at reading children's interest levels and adjusting the pace. For younger children, we recommend our private conservancy journeys rather than gorilla trekking.",
  },
  {
    q: "What is your cancellation and refund policy?",
    a: "We offer a tiered cancellation policy: full refund less deposit up to 120 days before departure, 50% refund up to 60 days before, and no refund within 60 days. We strongly recommend travel insurance, which we can arrange through our partner AIG Travel Guard. Gorilla permit fees are non-refundable but can sometimes be transferred to alternative dates.",
  },
  {
    q: "How do you ensure the safety of your guests?",
    a: "Every journey is accompanied by a certified first-aid guide, a satellite phone, and a medical evacuation plan with AMREF Flying Doctors. Our vehicles are equipped with trauma kits and water purification. We monitor political and health advisories daily and will reroute any journey at no cost if we believe a destination has become unsafe.",
  },
  {
    q: "What is your approach to conservation and community?",
    a: "Seven percent of every journey funds the conservation area you visit — directly, with no intermediary. Each lodge we partner with is at least 30% locally owned. We employ 32 African guides and 140 camp staff across eight nations. We are members of The Long Run, ATTA, and PACK, and we publish an annual conservation impact report.",
  },
  {
    q: "Can you accommodate dietary restrictions and accessibility needs?",
    a: "Absolutely. Our private chefs accommodate vegan, kosher, halal, gluten-free, and allergy-specific diets without compromise. For mobility needs, we have adaptive vehicles and have arranged journeys for guests using wheelchairs across the Serengeti, Okavango, and Kruger. Please discuss your needs with your specialist during the planning phase.",
  },
];

const whyChooseUs = [
  {
    num: "01",
    title: "Solitude, Guaranteed",
    body: "We will never put you in a vehicle with strangers. We will never drive within sight of another jeep. We will position your camp where no other camp can be seen. Solitude is not a feature — it is the foundation.",
    icon: "silence",
  },
  {
    num: "02",
    title: "Fourth-Generation Guides",
    body: "Our trackers are the inheritors of these landscapes. They speak seven tribal languages, know every waterhole by name, and can read a predator's intent from the angle of a vulture's wing. This is not a job for them. It is a heritage.",
    icon: "guide",
  },
  {
    num: "03",
    title: "Conservation Through Presence",
    body: "Seven percent of every journey funds the conservation area you visit. Your presence protects the land that protects the wildlife. We do not view this as charity — we view it as the rent for what we have been lent.",
    icon: "leaf",
  },
  {
    num: "04",
    title: "Carbon-Neutral Operations",
    body: "Our entire charter aircraft fleet runs on sustainable aviation fuel — the first safari operator in Africa to achieve this. Every journey is offset through the Wildlife Works Carbon Project in Kenya's Kasigau Corridor.",
    icon: "globe",
  },
  {
    num: "05",
    title: "Access Beyond the Reserve",
    body: "We hold private concessions in eight African nations, granting you off-road access, night drives, and walking safaris impossible inside the main parks. Our guests have met Hadzabe bushmen, walked with San trackers, and dined with Maasai elders.",
    icon: "key",
  },
  {
    num: "06",
    title: "A Single Point of Contact",
    body: "From your first conversation to your final departure, you have one specialist — chosen for your destination — who knows every detail of your journey. No call centers. No handoffs. No surprises. A human answers before the third ring.",
    icon: "phone",
  },
];

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-alabaster">
      <div className="mx-auto max-w-[1300px]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Left — heading */}
          <div className="md:col-span-5">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">Questions, Answered</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-6xl text-charcoal tracking-tight leading-[1.05] block mb-8"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              Frequently asked <span className="italic text-forest">questions.</span>
            </ScrollReveal>
            <Reveal variant="up" delay={0.2}>
              <p className="text-charcoal/70 leading-relaxed mb-8">
                Everything you need to know about composing a journey with us. If your question
                is not here, a specialist will reply within 24 hours.
              </p>
              <a
                href="mailto:private@unzipafrica.com"
                className="link-underline text-charcoal/70"
              >
                Ask a Specialist
              </a>
            </Reveal>
          </div>

          {/* Right — accordion */}
          <div className="md:col-span-7">
            <div className="border-t border-border">
              {faqs.map((faq, idx) => {
                const isOpen = openIdx === idx;
                return (
                  <div key={idx} className="border-b border-border">
                    <button
                      onClick={() => setOpenIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between gap-6 py-6 text-left group"
                      aria-expanded={isOpen}
                    >
                      <span className={`font-display text-xl md:text-2xl tracking-tight transition-colors duration-500 ${isOpen ? "text-forest" : "text-charcoal group-hover:text-forest"}`}>
                        {faq.q}
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
                        {faq.a}
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
  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
      <div className="mx-auto max-w-[1600px]">
        {/* Heading */}
        <div className="text-center mb-12 md:mb-16">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6">The Unzip Africa Difference</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-5xl md:text-7xl lg:text-8xl text-charcoal tracking-tight leading-[0.95] block max-w-4xl mx-auto"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={6}
          >
            Why discerning travellers <span className="italic text-forest">choose us.</span>
          </ScrollReveal>
        </div>

        {/* Grid of reasons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16 md:gap-y-20">
          {whyChooseUs.map((item, idx) => (
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
                  {item.title}
                </h3>
                <p className="text-charcoal/70 leading-relaxed">{item.body}</p>
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
