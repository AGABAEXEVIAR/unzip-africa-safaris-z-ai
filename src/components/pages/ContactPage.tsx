"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal } from "@/components/luxury/Reveal";
import ScrollReveal from "@/components/luxury/ScrollReveal";
import { useRouter } from "@/lib/router";
import { useLang } from "@/lib/language";
import { toast } from "sonner";
import { store, generateId } from "@/lib/store";

const sharp = { borderRadius: 0 } as const;

const DESTINATIONS = ["Uganda", "Kenya", "Tanzania", "Rwanda"];
const DURATIONS = ["3–5 days", "7–10 days", "12–14 days", "14+ days"];
const INTERESTS = ["Gorilla Trekking", "Chimpanzee", "The Great Migration", "Photography", "Birding", "Mountaineering", "Culture", "Charity", "Internship", "Honeymoon", "Family Getaway", "I can't decide, Help!"];
const BUDGETS = ["$2,000 – $3,500", "$3,500 – $5,000", "$5,000 – $7,000", "$7,000 – $10,000", "$10,000+"];

export function ContactPage() {
  const { navigate } = useRouter();
  const { t } = useLang();
  const heroRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    destinations: [] as string[],
    duration: "",
    interests: [] as string[],
    budget: "",
    name: "",
    email: "",
    phone: "",
    travelers: "2",
    dates: "",
    message: "",
  });

  const toggleDestination = (d: string) => {
    setForm((f) => ({ ...f, destinations: f.destinations.includes(d) ? f.destinations.filter((x) => x !== d) : [...f.destinations, d] }));
  };
  const toggleInterest = (i: string) => {
    setForm((f) => ({ ...f, interests: f.interests.includes(i) ? f.interests.filter((x) => x !== i) : [...f.interests, i] }));
  };

  const canProceedStep1 = form.destinations.length > 0 && form.duration;
  const canProceedStep2 = form.interests.length > 0 && form.budget;
  const canSubmit = form.name.trim() && form.email.trim();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) {
      toast.error("Please fill in your name and email");
      return;
    }
    setSubmitting(true);
    const inquiry = {
      id: generateId("inquiry"),
      name: form.name,
      email: form.email,
      phone: form.phone,
      travelers: form.travelers,
      dates: form.dates,
      destinations: form.destinations,
      budget: form.budget,
      message: form.message,
      status: "new" as const,
      createdAt: new Date().toISOString(),
    };
    store.addFormInquiry(inquiry as any);
    // Also POST directly to the API for reliability
    fetch("/api/crud?type=form-inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...inquiry, interests: form.interests, duration: form.duration }),
    }).catch(() => {});
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    toast.success("Your request has been sent. A specialist will reply within 24 hours.");
    setForm({ destinations: [], duration: "", interests: [], budget: "", name: "", email: "", phone: "", travelers: "2", dates: "", message: "" });
    setStep(1);
  };

  return (
    <div className="page-enter">
      {/* ====================== HERO ====================== */}
      <section ref={heroRef} className="relative h-[75vh] min-h-[550px] overflow-hidden bg-charcoal grain">
        <motion.div style={{ y: heroY, scale: heroScale }} className="absolute inset-0 will-change-transform">
          <img
            src="https://res.cloudinary.com/emz7hwx1/image/upload/v1792005671/Uganda.jpg"
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
            {t("contact.eyebrow")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-cream text-[3rem] sm:text-[4.5rem] md:text-[6rem] lg:text-[7rem] leading-[0.95] tracking-tight max-w-[90%]"
          >
            {t("contact.speakTo")} <span className="italic text-gold-soft">{t("contact.specialist")}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, delay: 1.1 }}
            className="text-cream/75 text-lg max-w-2xl mt-10 leading-relaxed"
          >
            {t("contact.subtitle")}
          </motion.p>
        </div>
      </section>

      {/* ====================== MULTI-STEP FORM ====================== */}
      <section className="py-16 md:py-24 px-6 md:px-10">
        <div className="mx-auto max-w-3xl">
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-2 mb-12">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 flex items-center justify-center font-display text-sm transition-all duration-500 ${step >= s ? "bg-gold text-charcoal" : "bg-cream text-charcoal/40"}`}
                  style={sharp}
                >
                  0{s}
                </div>
                {s < 3 && <div className={`w-12 h-px transition-all duration-500 ${step > s ? "bg-gold" : "bg-charcoal/15"}`} />}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* STEP 1: Destinations + Duration */}
            {step === 1 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="text-center mb-8">
                  <p className="font-eyebrow text-gold mb-2">Step 01</p>
                  <h2 className="font-display text-3xl md:text-4xl text-charcoal" style={{ fontFamily: "var(--font-cormorant), serif" }}>Where shall we go?</h2>
                  <p className="text-sm text-charcoal/60 mt-2">Select all destinations that call to you.</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {DESTINATIONS.map((d) => (
                    <button key={d} type="button" onClick={() => toggleDestination(d)}
                      className={`p-4 border transition-all duration-300 ${form.destinations.includes(d) ? "border-gold bg-gold/5" : "border-charcoal/15 hover:border-charcoal/30"}`}
                      style={sharp}>
                      <span className={`font-display text-lg ${form.destinations.includes(d) ? "text-gold" : "text-charcoal"}`} style={{ fontFamily: "var(--font-cormorant), serif" }}>{d}</span>
                    </button>
                  ))}
                </div>
                <div>
                  <p className="font-eyebrow text-charcoal/40 mb-3">Duration</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {DURATIONS.map((d) => (
                      <button key={d} type="button" onClick={() => setForm((f) => ({ ...f, duration: f.duration === d ? "" : d }))}
                        className={`p-3 border text-sm transition-all ${form.duration === d ? "border-gold bg-gold/5 text-gold" : "border-charcoal/15 text-charcoal/70 hover:border-charcoal/30"}`}
                        style={sharp}>{d}</button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end pt-4">
                  <button type="button" disabled={!canProceedStep1} onClick={() => setStep(2)}
                    className="px-8 py-3 text-xs font-medium tracking-[0.25em] uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-85"
                    style={{ ...sharp, background: "var(--gold)", color: "var(--charcoal)" }}>
                    Next Step →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Interests + Budget */}
            {step === 2 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                <div className="text-center mb-8">
                  <p className="font-eyebrow text-gold mb-2">Step 02</p>
                  <h2 className="font-display text-3xl md:text-4xl text-charcoal" style={{ fontFamily: "var(--font-cormorant), serif" }}>What moves you?</h2>
                  <p className="text-sm text-charcoal/60 mt-2">The experiences that draw you to Africa.</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {INTERESTS.map((i) => (
                    <button key={i} type="button" onClick={() => toggleInterest(i)}
                      className={`px-4 py-2 border text-sm transition-all ${form.interests.includes(i) ? "border-gold bg-gold/5 text-gold" : "border-charcoal/15 text-charcoal/70 hover:border-charcoal/30"}`}
                      style={sharp}>{i}</button>
                  ))}
                </div>
                <div>
                  <p className="font-eyebrow text-charcoal/40 mb-3 text-center">Estimated budget</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {BUDGETS.map((b) => (
                      <button key={b} type="button" onClick={() => setForm((f) => ({ ...f, budget: f.budget === b ? "" : b }))}
                        className={`p-3 border text-sm transition-all ${form.budget === b ? "border-gold bg-gold/5 text-gold" : "border-charcoal/15 text-charcoal/70 hover:border-charcoal/30"}`}
                        style={sharp}>{b}</button>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button type="button" onClick={() => setStep(1)} className="px-6 py-3 text-xs font-medium tracking-[0.25em] uppercase text-charcoal/60 hover:text-charcoal transition-colors">← Back</button>
                  <button type="button" disabled={!canProceedStep2} onClick={() => setStep(3)}
                    className="px-8 py-3 text-xs font-medium tracking-[0.25em] uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-85"
                    style={{ ...sharp, background: "var(--gold)", color: "var(--charcoal)" }}>
                    Next Step →
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Personal Info */}
            {step === 3 && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                <div className="text-center mb-8">
                  <p className="font-eyebrow text-gold mb-2">Step 03</p>
                  <h2 className="font-display text-3xl md:text-4xl text-charcoal" style={{ fontFamily: "var(--font-cormorant), serif" }}>Where do we send the reply?</h2>
                  <p className="text-sm text-charcoal/60 mt-2">A specialist will reply within 24 hours.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-eyebrow text-charcoal/40 block mb-2">Full Name *</label>
                    <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full bg-transparent border-b border-border py-2 text-charcoal focus:outline-none focus:border-forest transition-colors" />
                  </div>
                  <div>
                    <label className="font-eyebrow text-charcoal/40 block mb-2">Email *</label>
                    <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required className="w-full bg-transparent border-b border-border py-2 text-charcoal focus:outline-none focus:border-forest transition-colors" />
                  </div>
                  <div>
                    <label className="font-eyebrow text-charcoal/40 block mb-2">Phone</label>
                    <input type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-transparent border-b border-border py-2 text-charcoal focus:outline-none focus:border-forest transition-colors" />
                  </div>
                  <div>
                    <label className="font-eyebrow text-charcoal/40 block mb-2">Number of Travelers</label>
                    <input type="number" value={form.travelers} onChange={(e) => setForm({ ...form, travelers: e.target.value })} min="1" className="w-full bg-transparent border-b border-border py-2 text-charcoal focus:outline-none focus:border-forest transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-eyebrow text-charcoal/40 block mb-2">Approximate Dates</label>
                    <input type="text" value={form.dates} onChange={(e) => setForm({ ...form, dates: e.target.value })} placeholder="e.g., September 2025" className="w-full bg-transparent border-b border-border py-2 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-forest transition-colors" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="font-eyebrow text-charcoal/40 block mb-2">Anything else?</label>
                    <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Dietary needs, mobility, anniversaries, dreams..." className="w-full bg-transparent border-b border-border py-2 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-forest transition-colors resize-none" />
                  </div>
                </div>
                <div className="flex justify-between pt-4">
                  <button type="button" onClick={() => setStep(2)} className="px-6 py-3 text-xs font-medium tracking-[0.25em] uppercase text-charcoal/60 hover:text-charcoal transition-colors">← Back</button>
                  <button type="submit" disabled={!canSubmit || submitting}
                    className="px-8 py-3 text-xs font-medium tracking-[0.25em] uppercase transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-85"
                    style={{ ...sharp, background: "var(--gold)", color: "var(--charcoal)" }}>
                    {submitting ? "Sending..." : "Submit Request"}
                  </button>
                </div>
                <p className="text-center text-xs text-charcoal/40 mt-4">By sending, you agree to our privacy policy. We never share your details.</p>
              </motion.div>
            )}
          </form>
        </div>
      </section>

      {/* ====================== OFFICES ====================== */}
      <section className="py-24 md:py-32 px-6 md:px-10 bg-alabaster">
        <div className="mx-auto max-w-[1600px]">
          <Reveal variant="up">
            <p className="font-eyebrow text-gold mb-6 text-center">{t("contact.ourOffices")}</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-4xl md:text-6xl text-charcoal tracking-tight text-center mb-16 leading-[1.05] block"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {t("contact.bootsLine1")} <span className="italic text-forest">{t("contact.bootsLine2")}</span>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { city: "Arusha", country: "Tanzania", role: t("contact.hq"), address: "196 Njiro Road, Arusha" },
              { city: "Kampala", country: "Uganda", role: t("contact.ugandaOps"), address: "Kampala Road, Kampala" },
              { city: "Nairobi", country: "Kenya", role: t("contact.kenyaOps"), address: "Westlands, Nairobi" },
              { city: "Windhoek", country: "Namibia", role: t("contact.desertCoast"), address: "8 Avocadia Street, Windhoek" },
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
            <p className="font-eyebrow text-gold mb-4 text-center">{t("contact.findUs")}</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-3xl md:text-5xl text-charcoal tracking-tight text-center mb-10 leading-[1.05] block"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={5}
          >
            {t("contact.our")} <span className="italic text-forest">{t("contact.kampalaOffice")}</span>
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
            <p className="font-eyebrow text-gold-soft mb-8">{t("contact.preferToTalk")}</p>
          </Reveal>
          <ScrollReveal
            as="h2"
            containerClassName="font-display text-5xl md:text-7xl leading-[0.95] tracking-tight text-cream block mb-10"
            textClassName="block"
            baseOpacity={0.1}
            blurStrength={6}
          >
            {t("contact.callDirectly")} <span className="italic text-gold-soft">{t("contact.humanAnswers")}</span>
          </ScrollReveal>
          <Reveal variant="up" delay={0.2}>
            <p className="text-lg text-cream/70 max-w-xl mx-auto mt-10 leading-relaxed">
              {t("contact.noMenus")}
            </p>
            <div className="mt-12 space-y-2">
              <a
                href="tel:+491799372309"
                className="font-display text-3xl md:text-5xl text-cream hover:text-gold-soft transition-colors duration-500 tracking-tight block"
              >
                {t("contact.germany")}: +49 179 9372309
              </a>
              <a
                href="tel:+256706761092"
                className="font-display text-3xl md:text-5xl text-cream hover:text-gold-soft transition-colors duration-500 tracking-tight block"
              >
                {t("contact.uganda")}: +256 706 761092
              </a>
            </div>
            <button
              onClick={() => navigate("tours")}
              className="link-underline text-cream/70 mt-12"
            >
              {t("contact.orExploreTours")}
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
