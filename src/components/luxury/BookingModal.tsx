"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Users,
  Mail,
  Phone,
  User,
  CheckCircle2,
  Receipt,
} from "lucide-react";
import { store, generateId, type Booking } from "@/lib/store";
import type { TourPackage, ScheduledTrip } from "@/lib/content";

const sharp = { borderRadius: 0 } as const;

type BookingModalProps =
  | { tripType: "tour"; trip: TourPackage; open: boolean; onClose: () => void }
  | { tripType: "scheduled-trip"; trip: ScheduledTrip; open: boolean; onClose: () => void };

const modalScrollStyle = { overflowY: "auto", flex: "1 1 0%", minHeight: 0 } as const;

export function BookingModal(props: BookingModalProps) {
  const { open, onClose, tripType, trip } = props;
  const overlayRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    travellers: 2,
    notes: "",
  });
  const [confirmed, setConfirmed] = useState<Booking | null>(null);

  // Reset on close
  useEffect(() => {
    if (!open) {
      const t = setTimeout(() => {
        setForm({ name: "", email: "", phone: "", travellers: 2, notes: "" });
        setConfirmed(null);
      }, 250);
      return () => clearTimeout(t);
    }
  }, [open]);

  // When modal opens: immediately scroll to top so it's visible
  useEffect(() => {
    if (open) {
      // Stop Lenis smooth scroll and jump to top instantly
      const lenis = (window as unknown as { __lenis?: { scrollTo: (target: number, opts?: unknown) => void; stop?: () => void } }).__lenis;
      if (lenis) {
        lenis.scrollTo(0, { immediate: true });
      }
      // Also use native scroll as backup
      window.scrollTo(0, 0);
      // Scroll the overlay itself to top
      requestAnimationFrame(() => {
        overlayRef.current?.scrollTo(0, 0);
      });
    }
  }, [open]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const pricePerPerson = trip.priceFrom;
  const totalPrice = useMemo(
    () => pricePerPerson * form.travellers,
    [pricePerPerson, form.travellers]
  );

  // Trip info derived for the dark card
  const tripInfo = (() => {
    if (tripType === "tour") {
      const t = trip as TourPackage;
      return {
        name: t.name,
        destination: t.destination,
        duration: `${t.durationDays} Days · ${t.durationNights} Nights`,
        price: `$${t.priceFrom.toLocaleString()}`,
        dates: t.subtitle,
        image: t.image,
        startDate: undefined,
        endDate: undefined,
        spotsLeft: undefined,
        level: t.accommodationLevel,
      };
    }
    const t = trip as ScheduledTrip;
    return {
      name: t.name,
      destination: t.destination,
      duration: `${t.durationDays} Days`,
      price: `$${t.priceFrom.toLocaleString()}`,
      dates: `${formatDate(t.startDate)} — ${formatDate(t.endDate)}`,
      image: t.image,
      startDate: t.startDate,
      endDate: t.endDate,
      spotsLeft: t.spotsLeft,
      level: t.accommodationLevel,
    };
  })();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || form.travellers < 1) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const booking: Booking = {
      id: generateId("booking"),
      type: tripType,
      tripId: trip.id,
      tripName: tripInfo.name,
      destination: tripInfo.destination,
      startDate: tripInfo.startDate,
      endDate: tripInfo.endDate,
      duration: tripInfo.duration,
      pricePerPerson,
      numTravellers: form.travellers,
      totalPrice,
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      status: "pending",
      createdAt: new Date().toISOString(),
      notes: form.notes || undefined,
    };
    store.addBooking(booking);
    setConfirmed(booking);
    toast.success("Booking request received! We'll confirm within 24 hours.");
  };

  // Render via portal to document.body — bypasses any parent transforms
  // (framer-motion page transitions use transform which breaks position:fixed)
  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] bg-charcoal/85 backdrop-blur-md flex items-start md:items-center justify-center p-4 md:p-8 overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="bg-canvas w-full max-w-[1100px] my-auto max-h-[92vh] overflow-y-auto md:overflow-hidden flex flex-col grid grid-cols-1 md:grid-cols-2"
            style={sharp}
          >
            {/* Left — dark trip info card (read-only) */}
            <div
              className="relative p-6 md:p-8 text-cream flex flex-col"
              style={{ background: "#1f3a2f" }}
            >
              <img
                src={tripInfo.image}
                alt={tripInfo.name}
                className="absolute inset-0 w-full h-full object-cover opacity-20"
              />
              <div className="relative z-10 flex flex-col h-full">
                <p className="font-eyebrow text-gold-soft mb-3">
                  {tripType === "tour" ? "Tour Reservation" : "Scheduled Trip Reservation"}
                </p>
                <h2
                  className="font-display text-3xl md:text-4xl tracking-tight leading-[1.05] mb-6"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  {tripInfo.name}
                </h2>

                <div className="space-y-3 text-sm mb-6">
                  <Row icon={<MapPin className="w-4 h-4" />} label="Destination" value={tripInfo.destination} />
                  <Row icon={<Clock className="w-4 h-4" />} label="Duration" value={tripInfo.duration} />
                  <Row icon={<Calendar className="w-4 h-4" />} label="Dates" value={tripInfo.dates} />
                  <Row icon={<Users className="w-4 h-4" />} label="Group Size" value={tripType === "scheduled-trip" ? (trip as ScheduledTrip).groupSize : "Private party"} />
                  {tripInfo.spotsLeft !== undefined && (
                    <Row
                      icon={<Users className="w-4 h-4" />}
                      label="Spots Left"
                      value={`${tripInfo.spotsLeft}`}
                    />
                  )}
                  <Row icon={<Receipt className="w-4 h-4" />} label="Accommodation" value={tripInfo.level} />
                </div>

                <div className="mt-auto pt-6 border-t border-cream/15">
                  <p className="font-eyebrow text-cream/50 mb-2">Price Per Person</p>
                  <p
                    className="font-display text-4xl text-gold-soft mb-1"
                    style={{ fontFamily: "var(--font-cormorant), serif" }}
                  >
                    {tripInfo.price}
                  </p>
                  <p className="text-xs text-cream/55">Excludes international airfare</p>
                </div>
              </div>
            </div>

            {/* Right — form or success */}
            <div
              className="modal-scroll p-6 md:p-8 flex flex-col"
              style={modalScrollStyle}
            >
              <div className="flex items-center justify-between mb-6">
                <h3
                  className="font-display text-2xl text-charcoal tracking-tight"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  {confirmed ? "Booking Confirmed" : "Reserve Your Spot"}
                </h3>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="text-charcoal/50 hover:text-charcoal transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {confirmed ? (
                <SuccessReceipt booking={confirmed} onClose={onClose} />
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-5 flex-1">
                  <Field label="Full Name" icon={<User className="w-4 h-4" />}>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                      placeholder="Your full name"
                      className="w-full bg-transparent border-b border-border py-2 text-sm text-charcoal focus:outline-none focus:border-forest transition-colors"
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Email" icon={<Mail className="w-4 h-4" />}>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                        placeholder="you@example.com"
                        className="w-full bg-transparent border-b border-border py-2 text-sm text-charcoal focus:outline-none focus:border-forest transition-colors"
                      />
                    </Field>
                    <Field label="Phone" icon={<Phone className="w-4 h-4" />}>
                      <input
                        type="tel"
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        required
                        placeholder="+1 555 000 0000"
                        className="w-full bg-transparent border-b border-border py-2 text-sm text-charcoal focus:outline-none focus:border-forest transition-colors"
                      />
                    </Field>
                  </div>

                  <Field label="Number of Travellers" icon={<Users className="w-4 h-4" />}>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, travellers: Math.max(1, form.travellers - 1) })}
                        className="w-9 h-9 border border-border text-charcoal hover:bg-charcoal hover:text-cream transition-colors flex items-center justify-center"
                        style={sharp}
                      >
                        −
                      </button>
                      <span className="font-display text-2xl text-charcoal w-8 text-center" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                        {form.travellers}
                      </span>
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, travellers: form.travellers + 1 })}
                        className="w-9 h-9 border border-border text-charcoal hover:bg-charcoal hover:text-cream transition-colors flex items-center justify-center"
                        style={sharp}
                      >
                        +
                      </button>
                    </div>
                  </Field>

                  <Field label="Notes (optional)">
                    <textarea
                      value={form.notes}
                      onChange={(e) => setForm({ ...form, notes: e.target.value })}
                      rows={3}
                      placeholder="Tell us about any special requests, dietary needs, accessibility, etc."
                      className="w-full bg-transparent border border-border p-3 text-sm text-charcoal focus:outline-none focus:border-forest transition-colors"
                      style={sharp}
                    />
                  </Field>

                  {/* Live price calculation */}
                  <div className="border-t border-border pt-4 mt-2">
                    <div className="flex justify-between text-sm text-charcoal/70 mb-2">
                      <span>${pricePerPerson.toLocaleString()} × {form.travellers} travellers</span>
                      <span>${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end">
                      <span className="font-eyebrow text-charcoal/50">Total</span>
                      <span
                        className="font-display text-3xl text-forest"
                        style={{ fontFamily: "var(--font-cormorant), serif" }}
                      >
                        ${totalPrice.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="btn-luxury btn-luxury-gold w-full mt-2"
                  >
                    Confirm Booking Request
                  </button>
                  <p className="text-xs text-charcoal/50 text-center">
                    This is a request — your card is not charged. A specialist will confirm within 24 hours.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}

function Field({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="flex items-center gap-2 font-eyebrow text-charcoal/50 mb-2">
        {icon && <span className="text-gold">{icon}</span>}
        {label}
      </label>
      {children}
    </div>
  );
}

function Row({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-gold-soft">{icon}</span>
      <span className="text-cream/60 text-xs tracking-[0.2em] uppercase w-28">{label}</span>
      <span className="text-cream text-sm flex-1">{value}</span>
    </div>
  );
}

function SuccessReceipt({ booking, onClose }: { booking: Booking; onClose: () => void }) {
  return (
    <div className="flex flex-col items-center text-center py-6 flex-1">
      <CheckCircle2 className="w-14 h-14 text-forest mb-4" />
      <h4
        className="font-display text-3xl text-charcoal tracking-tight mb-3"
        style={{ fontFamily: "var(--font-cormorant), serif" }}
      >
        Thank you, {booking.customerName.split(" ")[0]}.
      </h4>
      <p className="text-sm text-charcoal/70 leading-relaxed mb-6 max-w-md">
        Your booking request for <strong>{booking.tripName}</strong> has been received. A
        specialist will reach out to <strong>{booking.customerEmail}</strong> within 24 hours
        to confirm the details.
      </p>

      <div className="w-full bg-alabaster border border-border p-5 text-left text-sm" style={sharp}>
        <div className="flex justify-between mb-3 pb-3 border-b border-border">
          <span className="text-charcoal/60">Booking Ref</span>
          <span className="font-medium text-charcoal">{booking.id.slice(0, 12).toUpperCase()}</span>
        </div>
        <div className="flex justify-between mb-3 pb-3 border-b border-border">
          <span className="text-charcoal/60">Trip</span>
          <span className="text-charcoal text-right max-w-[60%]">{booking.tripName}</span>
        </div>
        <div className="flex justify-between mb-3 pb-3 border-b border-border">
          <span className="text-charcoal/60">Travellers</span>
          <span className="text-charcoal">{booking.numTravellers}</span>
        </div>
        <div className="flex justify-between mb-3 pb-3 border-b border-border">
          <span className="text-charcoal/60">Status</span>
          <span className="text-gold capitalize">{booking.status}</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-charcoal/60">Total</span>
          <span
            className="font-display text-2xl text-forest"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            ${booking.totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <button onClick={onClose} className="btn-luxury btn-luxury-gold w-full mt-6">
        Close
      </button>
    </div>
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}
