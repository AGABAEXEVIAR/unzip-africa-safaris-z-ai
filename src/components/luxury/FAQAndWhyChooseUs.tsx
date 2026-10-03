"use client";

import { useState } from "react";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";

const faqs = [
  {
    q: "What makes Unzip Africa Safaris different from other safari operators?",
    a: "We don't just plan safaris — we curate extraordinary African journeys. Unzip Africa combines bespoke luxury, deep local expertise and exceptional personal service to create seamless journeys across Uganda, Kenya and Tanzania. From exclusive wildlife encounters to handpicked luxury lodges and private experiences, every detail is thoughtfully tailored to you. Because luxury is not just where you stay — it's how you experience Africa.",
  },
  {
    q: "How do you ensure the safety of your clients?",
    a: "Adventure should feel exhilarating — never uncertain. At Unzip Africa, safety is woven into every journey. We partner with trusted safari professionals, carefully vetted camps and lodges, experienced guides and well-maintained vehicles. Our local team stays connected throughout your journey, ready to support you whenever needed. All our clients are also covered by AMREF Flying Doctors medical evacuation, giving you access to emergency medical assistance and evacuation support across East Africa.",
  },
  {
    q: "What is your approach to conservation and communities?",
    a: "We believe protecting Africa starts with those who protect it. At Unzip Africa, every safari is an opportunity to create a positive impact. We support wildlife conservation, local communities and the rangers who work on the frontline of protecting Africa's wilderness. As part of our commitment, Unzip Africa contributes 5% of the net safari revenue from every booking towards ranger welfare. This contribution is made by us and is not added as a separate fee to your safari price. Through this commitment, every journey helps support the people who dedicate their lives to safeguarding East Africa's wildlife and protected areas. Travel with purpose. Protect the wild. Support its guardians.",
  },
  {
    q: "Can you accommodate dietary restrictions and accessibility needs?",
    a: "Absolutely. Your comfort is part of the journey. From vegetarian, vegan, halal and allergy-sensitive dining to mobility and accessibility requirements, we plan ahead with our trusted lodges, camps and local partners to ensure your needs are understood and accommodated wherever possible. Tell us what you need — we'll tailor the journey around you.",
  },
];

const whyChooseUs = [
  {
    num: "01",
    title: "Bespoke by Design",
    body: "Every safari is tailor-made around your interests, pace and travel style.",
    icon: "silence",
  },
  {
    num: "02",
    title: "Local Expertise",
    body: "Deep East African knowledge brings you closer to authentic places and experiences.",
    icon: "guide",
  },
  {
    num: "03",
    title: "Exceptional Wildlife",
    body: "From gorilla trekking to the Great Migration, experience Africa's most remarkable wildlife encounters.",
    icon: "leaf",
  },
  {
    num: "04",
    title: "Handpicked Stays",
    body: "We select distinctive lodges and camps that complement your journey.",
    icon: "globe",
  },
  {
    num: "05",
    title: "Seamless Service",
    body: "From planning to your return home, every detail is thoughtfully coordinated.",
    icon: "key",
  },
  {
    num: "06",
    title: "Africa, Personally Experienced",
    body: "We don't simply sell safaris — we create meaningful journeys designed to be remembered.",
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

/* ===================== Founder Message Section ===================== */
export function FounderMessageSection() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-forest-deep text-cream relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 50%, rgba(201,177,135,0.5) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>
      <div className="mx-auto max-w-[1000px] relative text-center">
        <Reveal variant="up">
          <p className="font-eyebrow text-gold-soft mb-6">A Message from Our Founder</p>
        </Reveal>
        <ScrollReveal
          as="blockquote"
          containerClassName="font-display text-2xl md:text-4xl lg:text-5xl leading-[1.3] text-cream tracking-tight block mb-8"
          textClassName="block"
          baseOpacity={0.1}
          blurStrength={5}
        >
          &ldquo;Africa is not simply a place to visit; it is a story to experience. At Unzip Africa, we are passionate about creating thoughtful, authentic and unforgettable journeys that bring you closer to the heart of East Africa.&rdquo;
        </ScrollReveal>
        <Reveal variant="up" delay={0.3}>
          <p className="font-label text-gold-soft">&mdash; Ssebuuma Ivan, Founder</p>
        </Reveal>
      </div>
    </section>
  );
}

/* ===================== Safari Cars Section ===================== */
export function SafariCarsSection() {
  return (
    <section className="py-16 md:py-24 px-6 md:px-10 bg-canvas">
      <div className="mx-auto max-w-[1200px]">
        <div className="text-center mb-12">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-4">Travel in Comfort</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-3xl md:text-6xl text-charcoal tracking-tight leading-[1.05] block mb-6"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            Our <span className="italic text-forest">Safari Cars</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-base md:text-lg text-charcoal/70 leading-relaxed max-w-3xl mx-auto">
              At Unzip Africa, every safari is designed for comfort, safety, and unforgettable
              wildlife experiences. Our safari vehicles are specially equipped for African
              adventures, offering comfortable seating, large viewing windows, pop-up roofs,
              charging facilities, and ample space for photography equipment. Whether exploring
              Uganda, Kenya, or Tanzania, our vehicles provide the perfect vantage point to
              experience wildlife and landscapes while travelling in comfort.
            </p>
          </Reveal>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {[
            { title: "Comfortable Seating", icon: "seat" },
            { title: "Large Viewing Windows", icon: "window" },
            { title: "Pop-Up Roofs", icon: "roof" },
            { title: "Charging Facilities", icon: "charge" },
          ].map((feature, idx) => (
            <Reveal key={feature.title} variant="up" delay={idx * 0.1}>
              <div className="card-hover-rich p-6 text-center h-full">
                <div className="flex-shrink-0 w-12 h-12 mx-auto mb-4 border border-charcoal/20 group-hover:border-gold flex items-center justify-center transition-all duration-500">
                  <CarFeatureIcon name={feature.icon} />
                </div>
                <h3 className="font-display text-lg md:text-xl text-charcoal tracking-tight">
                  {feature.title}
                </h3>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function CarFeatureIcon({ name }: { name: string }) {
  const iconClass = "w-6 h-6 text-charcoal/70";
  switch (name) {
    case "seat":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M5 18v-6a3 3 0 0 1 3-3h8a3 3 0 0 1 3 3v6M5 18H3M5 18h14M19 18h2M7 9V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "window":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="4" y="4" width="16" height="16" rx="1" />
          <path d="M12 4v16M4 12h16" strokeLinecap="round" />
        </svg>
      );
    case "roof":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M3 16h18M5 16V9l7-5 7 5v7M9 16v-4h6v4" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    case "charge":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
    default:
      return null;
  }
}
