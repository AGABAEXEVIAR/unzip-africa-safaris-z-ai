"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "@/lib/router";
import { toast } from "sonner";

export function QuoteModal() {
  const { quoteOpen, closeQuote } = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
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

  // Listen for global "open-quote" events (e.g., from accommodation modal)
  useEffect(() => {
    const handler = () => {
      // Use a custom event bus: open via window dispatch
      // We trigger the router's openQuote via the same context
    };
    return () => handler();
  }, []);

  // Reset to step 1 when modal closes
  useEffect(() => {
    if (!quoteOpen) {
      const t = setTimeout(() => setStep(1), 400);
      return () => clearTimeout(t);
    }
  }, [quoteOpen]);

  const totalSteps = 3;

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      toast.error("Please share your name and email so we may reply.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSubmitting(false);
    toast.success("Your request is with us. A specialist will reply within 24 hours.");
    closeQuote();
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
  };

  const toggle = (key: "destinations" | "interests", value: string) => {
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(value)
        ? f[key].filter((x) => x !== value)
        : [...f[key], value],
    }));
  };

  return (
    <AnimatePresence>
      {quoteOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-[70] bg-charcoal/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto"
          onClick={closeQuote}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.96 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-canvas w-full max-w-[1000px] my-auto grid grid-cols-1 md:grid-cols-12 max-h-[92vh] overflow-hidden"
          >
            {/* Left — image / brand panel */}
            <div className="hidden md:block md:col-span-5 relative bg-forest-deep overflow-hidden">
              <img
                src="https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg"
                alt="African savanna at sunset"
                className="absolute inset-0 w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-forest-deep/40 to-forest-deep/95" />

              <div className="relative h-full flex flex-col justify-between p-10 text-cream">
                <div>
                  <p className="font-display text-2xl mb-1">
                    Unzip <span className="italic text-gold-soft">Africa</span>
                  </p>
                  <p className="font-eyebrow text-cream/40">Safaris · Est. 2009</p>
                </div>

                <div>
                  <p className="font-eyebrow text-gold-soft mb-4">Request a Quote</p>
                  <p className="font-display text-3xl md:text-4xl leading-[1.1] tracking-tight mb-6">
                    Three quiet minutes.
                    <br />
                    A lifetime's
                    <br />
                    <span className="italic text-gold-soft">return.</span>
                  </p>
                  <p className="text-cream/65 text-sm leading-relaxed max-w-xs">
                    A specialist will compose a private proposal within 24 hours. No templates.
                  </p>
                </div>

                <div className="text-cream/40 text-xs">
                  Step {step} of {totalSteps}
                </div>
              </div>
            </div>

            {/* Right — form */}
            <div className="md:col-span-7 p-8 md:p-12 overflow-y-auto no-scrollbar max-h-[92vh]">
              {/* Close */}
              <div className="flex justify-between items-center mb-8">
                <p className="font-eyebrow text-gold md:hidden">Request a Quote</p>
                <button
                  onClick={closeQuote}
                  className="ml-auto text-charcoal/40 hover:text-charcoal transition-colors"
                  aria-label="Close"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M18 6 6 18M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Progress */}
              <div className="flex gap-2 mb-10">
                {[1, 2, 3].map((s) => (
                  <div
                    key={s}
                    className={`h-px flex-1 transition-colors duration-500 ${
                      s <= step ? "bg-gold" : "bg-border"
                    }`}
                  />
                ))}
              </div>

              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="font-display text-3xl md:text-4xl text-charcoal tracking-tight mb-3 leading-[1.05]">
                      Where shall we go?
                    </h3>
                    <p className="text-charcoal/60 text-sm mb-8">
                      Select all destinations that call to you.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-10">
                      {["Serengeti", "Bwindi", "Okavango", "Maasai Mara", "Sossusvlei", "Virunga"].map((d) => (
                        <button
                          key={d}
                          type="button"
                          onClick={() => toggle("destinations", d)}
                          className={`px-4 py-3 border text-sm text-left transition-all duration-300 ${
                            form.destinations.includes(d)
                              ? "border-forest bg-forest text-cream"
                              : "border-border text-charcoal/70 hover:border-charcoal"
                          }`}
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
                        >
                          {d}
                        </button>
                      ))}
                    </div>

                    <button onClick={() => setStep(2)} className="btn-luxury btn-luxury-gold">
                      Continue
                    </button>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="font-display text-3xl md:text-4xl text-charcoal tracking-tight mb-3 leading-[1.05]">
                      What moves you?
                    </h3>
                    <p className="text-charcoal/60 text-sm mb-8">
                      The experiences that draw you to Africa.
                    </p>

                    <div className="grid grid-cols-2 gap-3 mb-10">
                      {[
                        "Gorilla Trekking",
                        "Great Migration",
                        "Big Cats",
                        "Walking Safaris",
                        "Photography",
                        "Stargazing",
                        "Cultural Immersion",
                        "Conservation Work",
                      ].map((interest) => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => toggle("interests", interest)}
                          className={`px-4 py-3 border text-sm text-left transition-all duration-300 ${
                            form.interests.includes(interest)
                              ? "border-forest bg-forest text-cream"
                              : "border-border text-charcoal/70 hover:border-charcoal"
                          }`}
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
                        >
                          {b}
                        </button>
                      ))}
                    </div>

                    <div className="flex gap-4">
                      <button onClick={() => setStep(1)} className="btn-luxury">
                        Back
                      </button>
                      <button onClick={() => setStep(3)} className="btn-luxury btn-luxury-gold">
                        Continue
                      </button>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <h3 className="font-display text-3xl md:text-4xl text-charcoal tracking-tight mb-3 leading-[1.05]">
                      Where do we send the reply?
                    </h3>
                    <p className="text-charcoal/60 text-sm mb-8">
                      A specialist will reply within 24 hours.
                    </p>

                    <div className="space-y-6 mb-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div>
                          <label className="font-eyebrow text-charcoal/40 block mb-2">Full Name *</label>
                          <input
                            type="text"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            className="w-full bg-transparent border-b border-border py-2 text-charcoal focus:outline-none focus:border-forest transition-colors"
                          />
                        </div>
                        <div>
                          <label className="font-eyebrow text-charcoal/40 block mb-2">Email *</label>
                          <input
                            type="email"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                          <label className="font-eyebrow text-charcoal/40 block mb-2">Travelers</label>
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
                          rows={3}
                          placeholder="Dietary needs, mobility, anniversaries, dreams..."
                          className="w-full bg-transparent border-b border-border py-2 text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-forest transition-colors resize-none"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button onClick={() => setStep(2)} className="btn-luxury" disabled={submitting}>
                        Back
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="btn-luxury btn-luxury-gold"
                      >
                        {submitting ? "Sending..." : "Submit Request"}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
