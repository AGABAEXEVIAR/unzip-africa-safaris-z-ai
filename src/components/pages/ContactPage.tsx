"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";
import { toast } from "sonner";

export function ContactPage() {
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
    travelers: "2",
    dates: "",
    destinations: [] as string[],
    budget: "$25,000 – $50,000",
    message: "",
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
    await new Promise((r) => setTimeout(r, 1200));
    setSubmitting(false);
    toast.success("Your inquiry has reached us. A specialist will reply within 24 hours.");
    setForm({
      name: "",
      email: "",
      travelers: "2",
      dates: "",
      destinations: [],
      budget: "$25,000 – $50,000",
      message: "",
    });
  };

  const toggleDestination = (d: string) => {
    setForm((f) => ({
      ...f,
      destinations: f.destinations.includes(d)
        ? f.destinations.filter((x) => x !== d)
        : [...f.destinations, d],
    }));
  };

  return (
    <div className="page-enter">
      {/* ====================== HERO ====================== */}
      <section ref={heroRef} className="relative h-[75vh] min-h-[550px] overflow-hidden bg-charcoal grain">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 will-change-transform">
          <img
            src="https://images.unsplash.com/photo-1568084680786-a84f91d1153c?auto=format&fit=crop&w=2400&q=85"
            alt="Volcanic peaks shrouded in mist"
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
            Begin the Conversation
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-cream text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] leading-[0.95] tracking-tight max-w-[90%]"
          >
            Speak to a <span className="italic text-gold-soft">specialist.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.1 }}
            className="text-cream/75 text-lg max-w-2xl mt-10 leading-relaxed"
          >
            No call centers. No bots. One specialist — chosen for your destination — will reply
            within 24 hours.
          </motion.p>
        </div>
      </section>

      {/* ====================== CONTACT FORM + INFO ====================== */}
      <section className="py-24 md:py-32 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-20">
          {/* Left — Info */}
          <div className="md:col-span-4">
            <Reveal variant="up">
              <p className="font-eyebrow text-gold mb-6">Direct Lines</p>
            </Reveal>
            <ScrollReveal
              as="h2"
              containerClassName="font-display text-4xl md:text-5xl text-charcoal leading-[1.05] tracking-tight mb-10 block"
              textClassName="block"
              baseOpacity={0.1}
              blurStrength={5}
            >
              Reach us, <span className="italic text-forest">anywhere.</span>
            </ScrollReveal>

            <Reveal variant="up" delay={0.1}>
              <div className="space-y-6">
                {/* Numbers */}
                <div className="border-t border-border pt-5">
                  <p className="font-eyebrow text-charcoal/40 mb-3">Numbers</p>
                  <div className="space-y-2">
                    <p className="font-display text-xl text-charcoal">Germany <span className="text-charcoal/70">+49 179 9372309</span></p>
                    <p className="font-display text-xl text-charcoal">Uganda <span className="text-charcoal/70">+256 706 761092</span></p>
                  </div>
                </div>
                {/* Email */}
                <div className="border-t border-border pt-5">
                  <p className="font-eyebrow text-charcoal/40 mb-3">Email</p>
                  <div className="space-y-2">
                    <p className="text-lg text-charcoal">
                      <a href="mailto:info@unzipafrica.com" className="hover:text-gold transition-colors">info@unzipafrica.com</a>
                    </p>
                    <p className="text-lg text-charcoal">
                      <a href="mailto:booking@unzipafrica.com" className="hover:text-gold transition-colors">booking@unzipafrica.com</a>
                    </p>
                  </div>
                </div>
                {/* Business Hours */}
                <div className="border-t border-border pt-5">
                  <p className="font-eyebrow text-charcoal/40 mb-3">Business Hours</p>
                  <div className="space-y-1 text-sm text-charcoal/70">
                    <p>Monday — Friday <span className="text-charcoal">8:30am – 5pm</span></p>
                    <p>Saturday <span className="text-charcoal">10am – 3pm</span></p>
                    <p>Sunday <span className="text-charcoal">Closed</span></p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

          {/* Right — Form */}
          <div className="md:col-span-8">
            <Reveal variant="up">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Full Names */}
                <div>
                  <label className="font-eyebrow text-charcoal/40 block mb-2">Full Names *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                    className="w-full bg-transparent border-b border-border py-2 text-charcoal focus:outline-none focus:border-forest transition-colors"
                  />
                </div>

                {/* Email */}
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

                {/* Phone Number */}
                <div>
                  <label className="font-eyebrow text-charcoal/40 block mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="e.g., +256 706 761092"
                    className="w-full bg-transparent border-b border-border py-2 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-forest transition-colors"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="font-eyebrow text-charcoal/40 block mb-2">Description</label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    placeholder="Tell us about your dream safari..."
                    className="w-full bg-transparent border-b border-border py-2 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-forest transition-colors duration-500 resize-none"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full inline-flex items-center justify-center gap-3 px-6 py-3.5 text-xs font-medium tracking-[0.25em] uppercase transition-all duration-500 hover:opacity-85 active:scale-[0.97]"
                    style={{
                      borderRadius: 0,
                      border: "1px solid var(--gold)",
                      background: "var(--gold)",
                      color: "var(--charcoal)",
                      fontFamily: "var(--font-inter), sans-serif",
                    }}
                  >
                    {submitting ? "Sending..." : "Send Inquiry"}
                  </button>
                </div>
              </form>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ====================== OFFICES ====================== */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-alabaster">
        <div className="mx-auto max-w-[1600px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6 text-center">Our Offices</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-4xl md:text-6xl text-charcoal tracking-tight text-center mb-16 leading-[1.05] block"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            Boots on the ground, <span className="italic text-forest">in four nations.</span>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { city: "Arusha", country: "Tanzania", role: "Headquarters", address: "196 Njiro Road, Arusha" },
              { city: "Kampala", country: "Uganda", role: "Uganda Operations", address: "Kampala Road, Kampala" },
              { city: "Nairobi", country: "Kenya", role: "Kenya Operations", address: "Westlands, Nairobi" },
              { city: "Windhoek", country: "Namibia", role: "Desert & Coast", address: "8 Avocadia Street, Windhoek" },
            ].map((office, idx) => (
              <Reveal key={office.city} variant="up" delay={idx * 0.1}>
                <div className="border-t border-border pt-6">
                  <p className="font-eyebrow text-gold mb-2">{office.role}</p>
                  <h3 className="font-display text-3xl text-charcoal mb-1">{office.city}</h3>
                  <p className="font-label text-charcoal/60 mb-3">{office.country}</p>
                  <p className="text-sm text-charcoal/60 leading-relaxed">{office.address}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================== GOOGLE MAP ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-[1400px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-4 text-center">Find Us</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-3xl md:text-5xl text-charcoal tracking-tight text-center mb-10 leading-[1.05] block"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            Our <span className="italic text-forest">Kampala Office</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <div className="relative w-full overflow-hidden border border-border shadow-lg" style={{ paddingBottom: "40%", minHeight: "300px" }}>
              <iframe
                className="absolute inset-0 w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31909.396!2d32.5589!3d0.3476!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x177dbb6f3d2bf747%3A0x6d2f3c3f3f3f3f3f!2sKampala%2C%20Uganda!5e0!3m2!1sen!2sug!4v1700000000000"
                title="Unzip Africa Safaris — Kampala, Uganda Office Location"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ====================== CTA ====================== */}
      <section className="py-32 md:py-40 px-6 md:px-10 bg-forest text-cream">
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
            <div className="mt-12 space-y-2">
              <a
                href="tel:+491799372309"
                className="font-display text-3xl md:text-5xl text-cream hover:text-gold-soft transition-colors duration-500 tracking-tight block"
              >
                Germany: +49 179 9372309
              </a>
              <a
                href="tel:+256706761092"
                className="font-display text-3xl md:text-5xl text-cream hover:text-gold-soft transition-colors duration-500 tracking-tight block"
              >
                Uganda: +256 706 761092
              </a>
            </div>
            <button
              onClick={() => navigate("tours")}
              className="link-underline text-cream/70 mt-12"
            >
              Or Explore Tours
            </button>
          </Reveal>
        </div>
      </section>
    </div>
  );
}

/* ===================== Luxury Input ===================== */
function LuxuryInput({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="font-eyebrow text-charcoal/40 block mb-3">
        {label} {required && <span className="text-gold">*</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        className="w-full bg-transparent border-b border-border py-3 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-forest transition-colors duration-500"
      />
    </div>
  );
}
