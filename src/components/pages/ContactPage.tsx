"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
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
              <h2 className="font-display text-4xl md:text-5xl text-charcoal leading-[1.05] tracking-tight mb-10">
                Reach us,
                <br />
                <span className="italic text-forest">anywhere.</span>
              </h2>
            </Reveal>

            <Reveal variant="up" delay={0.1}>
              <div className="space-y-8">
                {[
                  { label: "Private Inquiries", value: "private@unzipafrica.com", sub: "Replied within 24 hours" },
                  { label: "Call a Specialist", value: "+255 784 920 113", sub: "Mon–Fri · 6 AM – 9 PM EAT" },
                  { label: "WhatsApp", value: "+255 784 920 114", sub: "For existing guests only" },
                ].map((item) => (
                  <div key={item.label} className="border-t border-border pt-5">
                    <p className="font-eyebrow text-charcoal/40 mb-2">{item.label}</p>
                    <p className="font-display text-2xl text-charcoal mb-1">{item.value}</p>
                    <p className="text-sm text-charcoal/55">{item.sub}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          {/* Right — Form */}
          <div className="md:col-span-8">
            <Reveal variant="up">
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <LuxuryInput
                    label="Full Name"
                    value={form.name}
                    onChange={(v) => setForm({ ...form, name: v })}
                    required
                  />
                  <LuxuryInput
                    label="Email Address"
                    type="email"
                    value={form.email}
                    onChange={(v) => setForm({ ...form, email: v })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <LuxuryInput
                    label="Number of Travelers"
                    value={form.travelers}
                    onChange={(v) => setForm({ ...form, travelers: v })}
                  />
                  <LuxuryInput
                    label="Approximate Dates"
                    value={form.dates}
                    onChange={(v) => setForm({ ...form, dates: v })}
                    placeholder="e.g., September 2025"
                  />
                </div>

                {/* Destinations */}
                <div>
                  <p className="font-eyebrow text-charcoal/40 mb-4">Destinations of Interest</p>
                  <div className="flex flex-wrap gap-2">
                    {["Serengeti", "Bwindi", "Okavango", "Maasai Mara", "Sossusvlei", "Virunga"].map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => toggleDestination(d)}
                        className={`px-4 py-2 border text-sm transition-all duration-300 ${
                          form.destinations.includes(d)
                            ? "border-forest bg-forest text-cream"
                            : "border-border text-charcoal/70 hover:border-charcoal"
                        }`}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget */}
                <div>
                  <p className="font-eyebrow text-charcoal/40 mb-4">Investment Range (per person)</p>
                  <div className="flex flex-wrap gap-2">
                    {["$25,000 – $50,000", "$50,000 – $100,000", "$100,000 +", "Prefer to discuss"].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setForm({ ...form, budget: b })}
                        className={`px-4 py-2 border text-sm transition-all duration-300 ${
                          form.budget === b
                            ? "border-gold bg-gold text-charcoal"
                            : "border-border text-charcoal/70 hover:border-charcoal"
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="font-eyebrow text-charcoal/40 block mb-3">
                    Your Vision
                  </label>
                  <textarea
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    placeholder="Tell us what draws you to Africa — a memory, a dream, a question..."
                    className="w-full bg-transparent border-b border-border py-3 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-forest transition-colors duration-500 resize-none"
                  />
                </div>

                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center gap-6">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-luxury btn-luxury-gold"
                  >
                    {submitting ? "Sending..." : "Send Inquiry"}
                  </button>
                  <p className="text-sm text-charcoal/55 leading-relaxed max-w-xs">
                    By sending, you agree to our privacy policy. We never share your details.
                  </p>
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
            <h2 className="font-display text-4xl md:text-6xl text-charcoal tracking-tight text-center mb-16 leading-[1.05]">
              Boots on the ground, <span className="italic text-forest">in four nations.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { city: "Arusha", country: "Tanzania", role: "Headquarters", address: "196 Njiro Road, Arusha" },
              { city: "Maun", country: "Botswana", role: "Delta Operations", address: "Plot 4733, Maun" },
              { city: "Kigali", country: "Rwanda", role: "Primate Journeys", address: "KN 4 Avenue, Kigali" },
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

      {/* ====================== CTA ====================== */}
      <section className="py-32 md:py-40 px-6 md:px-10 bg-forest text-cream">
        <div className="mx-auto max-w-[1100px] text-center">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold-soft mb-8">Prefer to Talk?</p>
            <h2 className="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight">
              Call us directly.
              <br />
              <span className="italic text-gold-soft">A human answers.</span>
            </h2>
            <p className="text-lg text-cream/70 max-w-xl mx-auto mt-10 leading-relaxed">
              No menus, no queues, no hold music. One of our specialists picks up before the third
              ring.
            </p>
            <div className="mt-12">
              <a
                href="tel:+255784920113"
                className="font-display text-4xl md:text-6xl text-cream hover:text-gold-soft transition-colors duration-500 tracking-tight inline-block"
              >
                +255 784 920 113
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
