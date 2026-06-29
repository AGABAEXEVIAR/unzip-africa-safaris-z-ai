"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";
import { toast } from "sonner";

export function QuotePage() {
  const { navigate } = useRouter();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travelers: "2",
    dates: "",
    destinations: [] as string[],
    budget: "$50,000 – $100,000",
    duration: "7–10 days",
    interests: [] as string[],
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email) {
      toast.error("Please share your name and email so we may reply.");
      return;
    }
    setSubmitting(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    toast.success("Your request has reached us. A specialist will reply within 24 hours.");
    setForm({
      name: "",
      email: "",
      phone: "",
      travelers: "2",
      dates: "",
      destinations: [],
      budget: "$50,000 – $100,000",
      duration: "7–10 days",
      interests: [],
      notes: "",
    });
    setTimeout(() => navigate("home"), 2000);
  };

  const toggleArray = (key: "destinations" | "interests", value: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value) ? f[key].filter((x) => x !== value) : [...f[key], value],
    }));
  };

  return (
    <div className="page-enter">
      {/* ====================== HERO ====================== */}
      <section ref={heroRef} className="relative h-[65vh] min-h-[500px] overflow-hidden bg-charcoal grain">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 will-change-transform">
          <img
            src="https://images.unsplash.com/photo-1547621869-cd5e2ef82e1d?auto=format&fit=crop&w=2400&q=85"
            alt="African savanna at golden hour"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-charcoal/60" />
        </motion.div>

        <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="font-eyebrow text-gold-soft mb-8 tracking-[0.4em]"
          >
            Begin Your Journey
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-cream text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] leading-[0.95] tracking-tight max-w-[90%]"
            style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 300 }}
          >
            Request a <span className="italic text-gold-soft">Quote</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.1 }}
            className="text-cream/75 text-lg max-w-2xl mt-8 leading-relaxed"
          >
            Three quiet minutes. A lifetime&rsquo;s return. A specialist will compose a private
            proposal within 24 hours — no templates.
          </motion.p>
        </div>
      </section>

      {/* ====================== QUOTE FORM ====================== */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="mx-auto max-w-[1100px]">
          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Step 1 — Destinations + Duration */}
            <div>
              <Reveal variant="up">
                <p className="font-eyebrow text-gold mb-3">Step 01</p>
                <h2 className="font-display text-3xl md:text-4xl text-charcoal tracking-tight mb-3 leading-[1.05]">
                  Where shall we go?
                </h2>
                <p className="text-charcoal/60 text-sm mb-8">
                  Select all destinations that call to you.
                </p>
              </Reveal>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                {["Uganda", "Kenya", "Tanzania", "Namibia"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleArray("destinations", d)}
                    className={`px-4 py-3 border text-sm text-left transition-all duration-300 ${
                      form.destinations.includes(d)
                        ? "border-forest bg-forest text-cream"
                        : "border-border text-charcoal/70 hover:border-charcoal"
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    {d}
                  </button>
                ))}
              </div>

              <p className="font-eyebrow text-charcoal/40 mb-3">Duration</p>
              <div className="flex flex-wrap gap-2 mb-10">
                {["3–5 days", "7–10 days", "12–14 days", "14+ days"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setForm({ ...form, duration: d })}
                    className={`px-4 py-2 border text-sm transition-all duration-300 ${
                      form.duration === d
                        ? "border-gold bg-gold text-charcoal"
                        : "border-border text-charcoal/70 hover:border-charcoal"
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Interests + Budget */}
            <div className="pt-8 border-t border-border">
              <Reveal variant="up">
                <p className="font-eyebrow text-gold mb-3">Step 02</p>
                <h2 className="font-display text-3xl md:text-4xl text-charcoal tracking-tight mb-3 leading-[1.05]">
                  What moves you?
                </h2>
                <p className="text-charcoal/60 text-sm mb-8">
                  The experiences that draw you to Africa.
                </p>
              </Reveal>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                {[
                  "Gorilla Trekking",
                  "Great Migration",
                  "Big Cats",
                  "Walking Safaris",
                  "Photography",
                  "Stargazing",
                  "Cultural Immersion",
                  "Birding",
                ].map((interest) => (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleArray("interests", interest)}
                    className={`px-4 py-3 border text-sm text-left transition-all duration-300 ${
                      form.interests.includes(interest)
                        ? "border-forest bg-forest text-cream"
                        : "border-border text-charcoal/70 hover:border-charcoal"
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    {interest}
                  </button>
                ))}
              </div>

              <p className="font-eyebrow text-charcoal/40 mb-3">Investment (per person)</p>
              <div className="flex flex-wrap gap-2 mb-10">
                {["$25k – $50k", "$50k – $100k", "$100k – $250k", "$250k +"].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setForm({ ...form, budget: b })}
                    className={`px-4 py-2 border text-sm transition-all duration-300 ${
                      form.budget === b
                        ? "border-gold bg-gold text-charcoal"
                        : "border-border text-charcoal/70 hover:border-charcoal"
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3 — Contact details */}
            <div className="pt-8 border-t border-border">
              <Reveal variant="up">
                <p className="font-eyebrow text-gold mb-3">Step 03</p>
                <h2 className="font-display text-3xl md:text-4xl text-charcoal tracking-tight mb-3 leading-[1.05]">
                  Where do we send the reply?
                </h2>
                <p className="text-charcoal/60 text-sm mb-8">
                  A specialist will reply within 24 hours.
                </p>
              </Reveal>

              <div className="space-y-6 mb-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="font-eyebrow text-charcoal/40 block mb-2">Full Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      className="w-full bg-transparent border-b border-border py-2 text-charcoal focus:outline-none focus:border-forest transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-eyebrow text-charcoal/40 block mb-2">Email *</label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="w-full bg-transparent border-b border-border py-2 text-charcoal focus:outline-none focus:border-forest transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="font-eyebrow text-charcoal/40 block mb-2">Phone</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-transparent border-b border-border py-2 text-charcoal focus:outline-none focus:border-forest transition-colors"
                    />
                  </div>
                  <div>
                    <label className="font-eyebrow text-charcoal/40 block mb-2">Number of Travelers</label>
                    <input
                      type="text"
                      value={form.travelers}
                      onChange={(e) => setForm({ ...form, travelers: e.target.value })}
                      className="w-full bg-transparent border-b border-border py-2 text-charcoal focus:outline-none focus:border-forest transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-eyebrow text-charcoal/40 block mb-2">Approximate Dates</label>
                  <input
                    type="text"
                    value={form.dates}
                    onChange={(e) => setForm({ ...form, dates: e.target.value })}
                    placeholder="e.g., September 2025"
                    className="w-full bg-transparent border-b border-border py-2 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-forest transition-colors"
                  />
                </div>

                <div>
                  <label className="font-eyebrow text-charcoal/40 block mb-2">Anything else?</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={4}
                    placeholder="Dietary needs, mobility, anniversaries, dreams..."
                    className="w-full bg-transparent border-b border-border py-2 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-forest transition-colors resize-none"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4">
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-luxury btn-luxury-gold"
                >
                  {submitting ? "Sending..." : "Submit Request"}
                </button>
                <p className="text-sm text-charcoal/55 leading-relaxed max-w-xs">
                  By sending, you agree to our privacy policy. We never share your details.
                </p>
              </div>
            </div>
          </form>
        </div>
      </section>

      {/* ====================== CTA ====================== */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-forest text-cream">
        <div className="mx-auto max-w-[1100px] text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold-soft mb-8">Prefer to Talk?</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-cream block mb-10"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={6}
          >
            Call us directly. <span className="italic text-gold-soft">A human answers.</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-lg text-cream/70 max-w-xl mx-auto mt-10 leading-relaxed">
              No menus, no queues, no hold music. One of our specialists picks up before the third
              ring.
            </p>
            <div className="mt-12">
              <a
                href="tel:+255784920113"
                className="font-display text-4xl md:text-6xl text-cream hover:text-gold-soft transition-colors duration-500 tracking-tight inline-block"
                style={{ fontFamily: "var(--font-cormorant), serif" }}
              >
                +255 784 920 113
              </a>
            </div>
            <button
              onClick={() => navigate("contact")}
              className="link-underline text-cream/70 mt-12"
            >
              Or Visit Contact Page
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
