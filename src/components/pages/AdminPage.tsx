"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "@/lib/router";
import { useTours, useAccommodations, useScheduledTrips, useTestimonials, useDestinations, useBookings, useQuotes, store, generateId, type Booking, type QuoteRequest } from "@/lib/store";
import type { TourPackage, Accommodation, ScheduledTrip, Testimonial, Destination } from "@/lib/content";
import {
  LayoutDashboard,
  Mountain,
  Home,
  Calendar,
  Map as MapIcon,
  Mail,
  BookMarked,
  Image as ImageIcon,
  Quote,
  Settings as SettingsIcon,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
} from "lucide-react";

const sharp = { borderRadius: 0 } as const;

const modalScrollStyle = { overflowY: "auto", flex: "1 1 0%", minHeight: 0 } as const;
const tabsWrapperStyle = { display: "flex", flexDirection: "column", flex: "1 1 0%", minHeight: 0, overflow: "hidden" } as const;
const tabsWrapperClass = "flex-1 min-h-0 overflow-hidden flex flex-col";

const STORAGE_KEY = "unzip_africa_admin_session";

type AdminSection =
  | "dashboard"
  | "tours"
  | "accommodations"
  | "scheduled-trips"
  | "destinations"
  | "quotes"
  | "bookings"
  | "gallery"
  | "testimonials"
  | "settings";

export function AdminPage() {
  const { navigate } = useRouter();
  // Lazy initialiser reads from localStorage on mount, avoiding setState-in-effect
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [section, setSection] = useState<AdminSection>("dashboard");

  if (!authed) {
    return <LoginGate onSuccess={() => setAuthed(true)} onBack={() => navigate("home")} />;
  }

  const navItems: { id: AdminSection; label: string; icon: React.ReactNode }[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: "tours", label: "Tours", icon: <Mountain className="w-4 h-4" /> },
    { id: "accommodations", label: "Accommodations", icon: <Home className="w-4 h-4" /> },
    { id: "scheduled-trips", label: "Scheduled Trips", icon: <Calendar className="w-4 h-4" /> },
    { id: "destinations", label: "Destinations", icon: <MapIcon className="w-4 h-4" /> },
    { id: "quotes", label: "Quote Requests", icon: <Mail className="w-4 h-4" /> },
    { id: "bookings", label: "Bookings", icon: <BookMarked className="w-4 h-4" /> },
    { id: "gallery", label: "Gallery", icon: <ImageIcon className="w-4 h-4" /> },
    { id: "testimonials", label: "Testimonials", icon: <Quote className="w-4 h-4" /> },
    { id: "settings", label: "Settings", icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Sidebar */}
      <aside className="w-64 bg-forest-deep text-cream flex-shrink-0 flex flex-col" style={sharp}>
        <div className="p-6 border-b border-cream/10">
          <p className="font-display text-2xl tracking-tight" style={{ fontFamily: "var(--font-cormorant), serif" }}>
            Unzip Africa
          </p>
          <p className="font-eyebrow text-gold-soft mt-1">Admin Panel</p>
        </div>
        <nav className="flex-1 py-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setSection(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                section === item.id
                  ? "bg-cream/10 text-gold-soft border-l-2 border-gold-soft"
                  : "text-cream/70 hover:bg-cream/5 hover:text-cream border-l-2 border-transparent"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-cream/10">
          <button
            onClick={() => {
              try { window.localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
              setAuthed(false);
              navigate("home");
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-cream/60 hover:text-cream transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
          {section === "dashboard" && <DashboardSection onNav={setSection} />}
          {section === "tours" && <ToursSection />}
          {section === "accommodations" && <AccommodationsSection />}
          {section === "scheduled-trips" && <ScheduledTripsSection />}
          {section === "destinations" && <DestinationsSection />}
          {section === "quotes" && <QuotesSection />}
          {section === "bookings" && <BookingsSection />}
          {section === "gallery" && <GallerySection />}
          {section === "testimonials" && <TestimonialsSection />}
          {section === "settings" && <SettingsSection />}
        </div>
      </main>
    </div>
  );
}

/* ============================================================
 * Login gate
 * ============================================================ */
function LoginGate({ onSuccess, onBack }: { onSuccess: () => void; onBack: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === "admin" && pass === "unzip2025") {
      try { window.localStorage.setItem(STORAGE_KEY, "1"); } catch { /* ignore */ }
      onSuccess();
    } else {
      setError("Invalid credentials. Try admin / unzip2025");
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <button onClick={onBack} className="text-charcoal/60 hover:text-charcoal transition-colors mb-8 text-sm">
          ← Back to site
        </button>
        <div className="bg-alabaster border border-border p-8" style={sharp}>
          <p className="font-eyebrow text-gold mb-2">Admin Panel</p>
          <h1
            className="font-display text-4xl text-charcoal tracking-tight mb-2"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Sign in
          </h1>
          <p className="text-sm text-charcoal/60 mb-8">Use admin / unzip2025 to access the dashboard.</p>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
              className="w-full border border-border p-3 text-sm text-charcoal focus:outline-none focus:border-forest"
              style={sharp}
            />
            <input
              type="password"
              placeholder="Password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              className="w-full border border-border p-3 text-sm text-charcoal focus:outline-none focus:border-forest"
              style={sharp}
            />
            {error && <p className="text-xs text-red-700">{error}</p>}
            <button type="submit" className="btn-luxury btn-luxury-gold w-full">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Dashboard
 * ============================================================ */
function DashboardSection({ onNav }: { onNav: (s: AdminSection) => void }) {
  const tours = useTours();
  const accs = useAccommodations();
  const trips = useScheduledTrips();
  const bookings = useBookings();
  const quotes = useQuotes();
  const testimonials = useTestimonials();
  const destinations = useDestinations();

  const stats = [
    { label: "Tours", value: tours.length, section: "tours" as const, color: "text-gold" },
    { label: "Scheduled Trips", value: trips.length, section: "scheduled-trips" as const, color: "text-forest" },
    { label: "Accommodations", value: accs.length, section: "accommodations" as const, color: "text-gold" },
    { label: "Destinations", value: destinations.length, section: "destinations" as const, color: "text-forest" },
    { label: "Bookings", value: bookings.length, section: "bookings" as const, color: "text-gold" },
    { label: "Quote Requests", value: quotes.length, section: "quotes" as const, color: "text-forest" },
    { label: "Testimonials", value: testimonials.length, section: "testimonials" as const, color: "text-gold" },
    { label: "Published Testimonials", value: testimonials.filter((t) => t.published).length, section: "testimonials" as const, color: "text-forest" },
  ];

  return (
    <div>
      <h1
        className="font-display text-4xl text-charcoal tracking-tight mb-2"
        style={{ fontFamily: "var(--font-cormorant), serif" }}
      >
        Dashboard
      </h1>
      <p className="text-sm text-charcoal/60 mb-8">Welcome back. Here's the overview of your content.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => onNav(s.section)}
            className="bg-alabaster border border-border p-5 text-left hover:border-gold transition-colors"
            style={sharp}
          >
            <p className={`font-display text-4xl ${s.color}`} style={{ fontFamily: "var(--font-cormorant), serif" }}>
              {s.value}
            </p>
            <p className="font-eyebrow text-charcoal/50 mt-2">{s.label}</p>
          </button>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="bg-alabaster border border-border p-6" style={sharp}>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="font-display text-2xl text-charcoal tracking-tight"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Recent Bookings
          </h2>
          <button onClick={() => onNav("bookings")} className="text-xs text-gold hover:underline">
            View All →
          </button>
        </div>
        {bookings.length === 0 ? (
          <p className="text-sm text-charcoal/50 py-8 text-center">No bookings yet.</p>
        ) : (
          <ul className="divide-y divide-border">
            {bookings.slice(0, 5).map((b) => (
              <li key={b.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm text-charcoal font-medium">{b.tripName}</p>
                  <p className="text-xs text-charcoal/60">{b.customerName} · {b.numTravellers} travellers</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-forest">${b.totalPrice.toLocaleString()}</p>
                  <p className="text-xs text-charcoal/50 capitalize">{b.status}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

/* ============================================================
 * Generic helpers
 * ============================================================ */
function PageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between mb-8">
      <div>
        <h1
          className="font-display text-4xl text-charcoal tracking-tight mb-1"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          {title}
        </h1>
        {subtitle && <p className="text-sm text-charcoal/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function IconButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="w-8 h-8 flex items-center justify-center text-charcoal/60 hover:text-charcoal hover:bg-canvas transition-colors"
      style={sharp}
    >
      {icon}
    </button>
  );
}

function Modal({ open, onClose, title, children, wide = false }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode; wide?: boolean }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-[80] bg-charcoal/85 backdrop-blur-md flex items-center justify-center p-4 md:p-8 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-canvas w-full my-auto max-h-[92vh] flex flex-col overflow-hidden"
        style={{ ...sharp, maxWidth: wide ? "1100px" : "640px" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-border flex-shrink-0">
          <h3
            className="font-display text-2xl text-charcoal tracking-tight"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            {title}
          </h3>
          <button onClick={onClose} aria-label="Close" className="text-charcoal/50 hover:text-charcoal">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="modal-scroll p-5" style={modalScrollStyle}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-eyebrow text-charcoal/50">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-border px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
        style={sharp}
      />
    </label>
  );
}

function Textarea({ label, value, onChange, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; rows?: number }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="font-eyebrow text-charcoal/50">{label}</span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="w-full border border-border px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
        style={sharp}
      />
    </label>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`w-10 h-6 relative transition-colors ${checked ? "bg-forest" : "bg-charcoal/20"}`}
        style={sharp}
        aria-label={label}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-cream transition-transform ${checked ? "translate-x-4" : ""}`}
          style={sharp}
        />
      </button>
      <span className="text-sm text-charcoal">{label}</span>
    </label>
  );
}

function StringListEditor({ label, items, onChange, placeholder = "Add item..." }: { label: string; items: string[]; onChange: (items: string[]) => void; placeholder?: string }) {
  const [draft, setDraft] = useState("");
  return (
    <div className="flex flex-col gap-2">
      <span className="font-eyebrow text-charcoal/50">{label}</span>
      <div className="flex gap-2">
        <input
          type="text"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={placeholder}
          onKeyDown={(e) => {
            if (e.key === "Enter" && draft.trim()) {
              e.preventDefault();
              onChange([...items, draft.trim()]);
              setDraft("");
            }
          }}
          className="flex-1 border border-border px-3 py-2 text-sm text-charcoal focus:outline-none focus:border-forest"
          style={sharp}
        />
        <button
          type="button"
          onClick={() => {
            if (draft.trim()) {
              onChange([...items, draft.trim()]);
              setDraft("");
            }
          }}
          className="px-3 py-2 bg-forest text-cream text-xs"
          style={sharp}
        >
          Add
        </button>
      </div>
      <ul className="flex flex-col gap-1">
        {items.map((item, idx) => (
          <li key={idx} className="flex items-center justify-between gap-2 px-3 py-2 bg-canvas border border-border text-sm">
            <span className="flex-1 text-charcoal">{item}</span>
            <button
              type="button"
              onClick={() => onChange(items.filter((_, i) => i !== idx))}
              className="text-charcoal/50 hover:text-red-700"
              aria-label="Remove item"
            >
              <X className="w-4 h-4" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckboxGrid({ label, options, selected, onChange }: { label: string; options: { id: string; label: string }[]; selected: string[]; onChange: (ids: string[]) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-eyebrow text-charcoal/50">{label}</span>
      <div className="grid grid-cols-2 gap-2">
        {options.map((o) => {
          const checked = selected.includes(o.id);
          return (
            <button
              type="button"
              key={o.id}
              onClick={() => onChange(checked ? selected.filter((x) => x !== o.id) : [...selected, o.id])}
              className={`flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors border ${checked ? "bg-forest text-cream border-forest" : "bg-canvas text-charcoal border-border hover:border-charcoal"}`}
              style={sharp}
            >
              <span className={`w-4 h-4 flex items-center justify-center flex-shrink-0 ${checked ? "bg-gold" : "border border-border"}`} style={sharp}>
                {checked && <Check className="w-3 h-3 text-charcoal" />}
              </span>
              <span className="flex-1 truncate">{o.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
 * Tours section
 * ============================================================ */
function ToursSection() {
  const tours = useTours();
  const accommodations = useAccommodations();
  const [editing, setEditing] = useState<TourPackage | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <PageHeader
        title="Tours"
        subtitle={`${tours.length} tours published`}
        action={
          <button onClick={() => setCreating(true)} className="btn-luxury btn-luxury-gold flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Tour
          </button>
        }
      />
      <ul className="bg-alabaster border border-border divide-y divide-border" style={sharp}>
        {tours.map((t) => (
          <li key={t.id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img src={t.image} alt={t.name} className="w-14 h-14 object-cover bg-bone flex-shrink-0" style={sharp} />
              <div className="min-w-0">
                <p className="font-display text-lg text-charcoal truncate" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  {t.name} {t.featured && <span className="ml-2 text-xs text-gold">★ Featured</span>}
                </p>
                <p className="text-xs text-charcoal/60">{t.destination} · {t.durationDays} days · ${t.priceFrom.toLocaleString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <IconButton icon={<Edit2 className="w-4 h-4" />} label="Edit" onClick={() => setEditing(t)} />
              <IconButton
                icon={<Trash2 className="w-4 h-4" />}
                label="Delete"
                onClick={() => {
                  if (confirm(`Delete "${t.name}"?`)) store.deleteTour(t.id);
                }}
              />
            </div>
          </li>
        ))}
      </ul>

      {(editing || creating) && (
        <TourEditor
          tour={editing}
          accommodations={accommodations}
          onClose={() => {
            setEditing(null);
            setCreating(false);
          }}
          onSave={(t) => {
            if (editing) {
              store.updateTour(editing.id, t);
            } else {
              store.addTour({ ...t, id: generateId("tour") });
            }
            setEditing(null);
            setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function TourEditor({ tour, accommodations, onClose, onSave }: { tour: TourPackage | null; accommodations: Accommodation[]; onClose: () => void; onSave: (t: TourPackage) => void }) {
  const [form, setForm] = useState<TourPackage>(
    tour ?? {
      id: "",
      name: "",
      subtitle: "",
      duration: "0 Days",
      durationDays: 0,
      durationNights: 0,
      price: "From $0",
      priceFrom: 0,
      highlights: [],
      image: "",
      galleryImages: [],
      days: [],
      destination: "",
      activities: [],
      tripType: "Luxury Safaris",
      accommodationLevel: "Luxury Lodges",
      nationalPark: "",
      featured: false,
      minAge: 8,
      accommodationIds: [],
    }
  );

  const set = (patch: Partial<TourPackage>) => setForm({ ...form, ...patch });

  return (
    <Modal open onClose={onClose} title={tour ? `Edit · ${tour.name}` : "New Tour"} wide>
      <Tabs defaultValue="general" className={tabsWrapperClass} style={tabsWrapperStyle}>
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="highlights">Highlights</TabsTrigger>
          <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
          <TabsTrigger value="stays">Stays</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="modal-scroll p-4" style={modalScrollStyle}>
          <div className="flex flex-col gap-4">
            <Input label="Name" value={form.name} onChange={(v) => set({ name: v })} />
            <Input label="Subtitle" value={form.subtitle} onChange={(v) => set({ subtitle: v })} />
            <Input label="Destination" value={form.destination} onChange={(v) => set({ destination: v })} />
            <Input label="National Park" value={form.nationalPark} onChange={(v) => set({ nationalPark: v })} />
            <Input label="Trip Type" value={form.tripType} onChange={(v) => set({ tripType: v })} />
            <Input label="Accommodation Level" value={form.accommodationLevel} onChange={(v) => set({ accommodationLevel: v })} />
            <div className="grid grid-cols-3 gap-3">
              <Input label="Duration Days" type="number" value={form.durationDays} onChange={(v) => set({ durationDays: Number(v), duration: `${v} Days` })} />
              <Input label="Duration Nights" type="number" value={form.durationNights} onChange={(v) => set({ durationNights: Number(v) })} />
              <Input label="Min Age" type="number" value={form.minAge} onChange={(v) => set({ minAge: Number(v) })} />
            </div>
            <Input label="Image URL" value={form.image} onChange={(v) => set({ image: v })} placeholder="https://..." />
            <Toggle label="Featured" checked={!!form.featured} onChange={(v) => set({ featured: v })} />
          </div>
        </TabsContent>

        <TabsContent value="pricing" className="modal-scroll p-4" style={modalScrollStyle}>
          <div className="flex flex-col gap-4">
            <Input label="Price From (number)" type="number" value={form.priceFrom} onChange={(v) => set({ priceFrom: Number(v), price: `From $${v}` })} />
            <Input label="Price Original (optional, number)" type="number" value={form.priceOriginal ?? ""} onChange={(v) => set({ priceOriginal: v ? Number(v) : undefined })} />
            <p className="text-xs text-charcoal/60">The price label is auto-generated from the Price From value.</p>
          </div>
        </TabsContent>

        <TabsContent value="highlights" className="modal-scroll p-4" style={modalScrollStyle}>
          <StringListEditor label="Highlights" items={form.highlights} onChange={(items) => set({ highlights: items })} placeholder="Add a highlight..." />
          <div className="mt-6">
            <StringListEditor label="Activities" items={form.activities} onChange={(items) => set({ activities: items })} placeholder="Add an activity..." />
          </div>
        </TabsContent>

        <TabsContent value="itinerary" className="modal-scroll p-4" style={modalScrollStyle}>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-charcoal/70">Per-day itinerary editor</p>
            {form.days.map((d, idx) => (
              <div key={idx} className="p-4 border border-border" style={sharp}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Day" value={d.day} onChange={(v) => { const next = [...form.days]; next[idx] = { ...d, day: v }; set({ days: next }); }} />
                  <Input label="Title" value={d.title} onChange={(v) => { const next = [...form.days]; next[idx] = { ...d, title: v }; set({ days: next }); }} />
                </div>
                <div className="mt-3">
                  <Textarea label="Description" value={d.description} onChange={(v) => { const next = [...form.days]; next[idx] = { ...d, description: v }; set({ days: next }); }} rows={3} />
                </div>
                <div className="mt-3">
                  <Input label="Image URL" value={d.image} onChange={(v) => { const next = [...form.days]; next[idx] = { ...d, image: v }; set({ days: next }); }} />
                </div>
                <div className="mt-3 flex justify-end">
                  <button type="button" onClick={() => set({ days: form.days.filter((_, i) => i !== idx) })} className="text-xs text-red-700 hover:underline">Remove day</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => set({ days: [...form.days, { day: `Day ${form.days.length + 1}`, title: "", description: "", image: "" }] })} className="btn-luxury btn-luxury-gold flex items-center gap-2 self-start">
              <Plus className="w-4 h-4" /> Add Day
            </button>
          </div>
        </TabsContent>

        <TabsContent value="gallery" className="modal-scroll p-4" style={modalScrollStyle}>
          <StringListEditor label="Gallery Images" items={form.galleryImages ?? []} onChange={(items) => set({ galleryImages: items })} placeholder="Add an image URL..." />
          {form.galleryImages && form.galleryImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {form.galleryImages.map((g, idx) => (
                <div key={idx} className="aspect-[4/3] overflow-hidden bg-bone" style={sharp}>
                  <img src={g} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="stays" className="modal-scroll p-4" style={modalScrollStyle}>
          <CheckboxGrid
            label="Accommodations linked to this tour"
            options={accommodations.map((a) => ({ id: a.id, label: `${a.name} (${a.location})` }))}
            selected={form.accommodationIds}
            onChange={(ids) => set({ accommodationIds: ids })}
          />
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
        <button onClick={onClose} className="btn-luxury">Cancel</button>
        <button onClick={() => onSave(form)} className="btn-luxury btn-luxury-gold">Save</button>
      </div>
    </Modal>
  );
}

/* ============================================================
 * Accommodations section
 * ============================================================ */
function AccommodationsSection() {
  const accs = useAccommodations();
  const [editing, setEditing] = useState<Accommodation | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <PageHeader
        title="Accommodations"
        subtitle={`${accs.length} properties`}
        action={
          <button onClick={() => setCreating(true)} className="btn-luxury btn-luxury-gold flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Property
          </button>
        }
      />
      <ul className="bg-alabaster border border-border divide-y divide-border" style={sharp}>
        {accs.map((a) => (
          <li key={a.id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img src={a.image} alt={a.name} className="w-14 h-14 object-cover bg-bone flex-shrink-0" style={sharp} />
              <div className="min-w-0">
                <p className="font-display text-lg text-charcoal truncate" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  {a.name}
                </p>
                <p className="text-xs text-charcoal/60">{a.location} · {a.type} · {a.pricePerNight}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <IconButton icon={<Edit2 className="w-4 h-4" />} label="Edit" onClick={() => setEditing(a)} />
              <IconButton
                icon={<Trash2 className="w-4 h-4" />}
                label="Delete"
                onClick={() => { if (confirm(`Delete "${a.name}"?`)) store.deleteAccommodation(a.id); }}
              />
            </div>
          </li>
        ))}
      </ul>

      {(editing || creating) && (
        <AccommodationEditor
          acc={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={(a) => {
            if (editing) store.updateAccommodation(editing.id, a);
            else store.addAccommodation({ ...a, id: generateId("acc") });
            setEditing(null); setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function AccommodationEditor({ acc, onClose, onSave }: { acc: Accommodation | null; onClose: () => void; onSave: (a: Accommodation) => void }) {
  const [form, setForm] = useState<Accommodation>(
    acc ?? {
      id: "",
      name: "",
      location: "",
      type: "Lodge",
      description: "",
      image: "",
      galleryImages: [],
      features: [],
      pricePerNight: "From $0",
    }
  );
  const set = (patch: Partial<Accommodation>) => setForm({ ...form, ...patch });

  return (
    <Modal open onClose={onClose} title={acc ? `Edit · ${acc.name}` : "New Property"} wide>
      <Tabs defaultValue="general" className={tabsWrapperClass} style={tabsWrapperStyle}>
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="gallery">Gallery</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="modal-scroll p-4" style={modalScrollStyle}>
          <div className="flex flex-col gap-4">
            <Input label="Name" value={form.name} onChange={(v) => set({ name: v })} />
            <Input label="Location" value={form.location} onChange={(v) => set({ location: v })} />
            <Input label="Type" value={form.type} onChange={(v) => set({ type: v })} />
            <Input label="Price Per Night (label)" value={form.pricePerNight} onChange={(v) => set({ pricePerNight: v })} />
            <Input label="Main Image URL" value={form.image} onChange={(v) => set({ image: v })} placeholder="https://..." />
            <Textarea label="Description" value={form.description} onChange={(v) => set({ description: v })} rows={5} />
          </div>
        </TabsContent>
        <TabsContent value="features" className="modal-scroll p-4" style={modalScrollStyle}>
          <StringListEditor label="Features" items={form.features} onChange={(items) => set({ features: items })} placeholder="Add a feature..." />
        </TabsContent>
        <TabsContent value="gallery" className="modal-scroll p-4" style={modalScrollStyle}>
          <StringListEditor label="Gallery Images" items={form.galleryImages ?? []} onChange={(items) => set({ galleryImages: items })} placeholder="Add an image URL..." />
          {form.galleryImages && form.galleryImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {form.galleryImages.map((g, idx) => (
                <div key={idx} className="aspect-[4/3] overflow-hidden bg-bone" style={sharp}>
                  <img src={g} alt={`Gallery ${idx + 1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
        <button onClick={onClose} className="btn-luxury">Cancel</button>
        <button onClick={() => onSave(form)} className="btn-luxury btn-luxury-gold">Save</button>
      </div>
    </Modal>
  );
}

/* ============================================================
 * Scheduled Trips section
 * ============================================================ */
function ScheduledTripsSection() {
  const trips = useScheduledTrips();
  const [editing, setEditing] = useState<ScheduledTrip | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <PageHeader
        title="Scheduled Trips"
        subtitle={`${trips.length} departures`}
        action={
          <button onClick={() => setCreating(true)} className="btn-luxury btn-luxury-gold flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Departure
          </button>
        }
      />
      <ul className="bg-alabaster border border-border divide-y divide-border" style={sharp}>
        {trips.map((t) => (
          <li key={t.id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img src={t.image} alt={t.name} className="w-14 h-14 object-cover bg-bone flex-shrink-0" style={sharp} />
              <div className="min-w-0">
                <p className="font-display text-lg text-charcoal truncate" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  {t.name}
                </p>
                <p className="text-xs text-charcoal/60">{t.destination} · {t.startDate} → {t.endDate} · ${t.priceFrom.toLocaleString()} · {t.spotsLeft} spots</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <IconButton icon={<Edit2 className="w-4 h-4" />} label="Edit" onClick={() => setEditing(t)} />
              <IconButton icon={<Trash2 className="w-4 h-4" />} label="Delete" onClick={() => { if (confirm(`Delete "${t.name}"?`)) store.deleteScheduledTrip(t.id); }} />
            </div>
          </li>
        ))}
      </ul>

      {(editing || creating) && (
        <ScheduledTripEditor
          trip={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={(t) => {
            if (editing) store.updateScheduledTrip(editing.id, t);
            else store.addScheduledTrip({ ...t, id: generateId("st") });
            setEditing(null); setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function ScheduledTripEditor({ trip, onClose, onSave }: { trip: ScheduledTrip | null; onClose: () => void; onSave: (t: ScheduledTrip) => void }) {
  const [form, setForm] = useState<ScheduledTrip>(
    trip ?? {
      id: "",
      name: "",
      destination: "",
      startDate: new Date().toISOString().slice(0, 10),
      endDate: new Date().toISOString().slice(0, 10),
      durationDays: 0,
      priceFrom: 0,
      image: "",
      galleryImages: [],
      description: "",
      highlights: [],
      inclusions: [],
      exclusions: [],
      groupSize: "Max 8 guests",
      spotsLeft: 0,
      accommodationLevel: "Lodge",
      stops: [],
    }
  );
  const set = (patch: Partial<ScheduledTrip>) => setForm({ ...form, ...patch });

  return (
    <Modal open onClose={onClose} title={trip ? `Edit · ${trip.name}` : "New Scheduled Trip"} wide>
      <Tabs defaultValue="general" className={tabsWrapperClass} style={tabsWrapperStyle}>
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="inclusions">Inclusions</TabsTrigger>
          <TabsTrigger value="exclusions">Exclusions</TabsTrigger>
          <TabsTrigger value="stops">Stops</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="modal-scroll p-4" style={modalScrollStyle}>
          <div className="flex flex-col gap-4">
            <Input label="Name" value={form.name} onChange={(v) => set({ name: v })} />
            <Input label="Destination" value={form.destination} onChange={(v) => set({ destination: v })} />
            <div className="grid grid-cols-2 gap-3">
              <Input label="Start Date" type="date" value={form.startDate} onChange={(v) => set({ startDate: v })} />
              <Input label="End Date" type="date" value={form.endDate} onChange={(v) => set({ endDate: v })} />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <Input label="Duration (days)" type="number" value={form.durationDays} onChange={(v) => set({ durationDays: Number(v) })} />
              <Input label="Spots Left" type="number" value={form.spotsLeft} onChange={(v) => set({ spotsLeft: Number(v) })} />
              <Input label="Group Size" value={form.groupSize} onChange={(v) => set({ groupSize: v })} />
            </div>
            <Input label="Accommodation Level" value={form.accommodationLevel} onChange={(v) => set({ accommodationLevel: v })} />
            <Input label="Main Image URL" value={form.image} onChange={(v) => set({ image: v })} placeholder="https://..." />
            <Textarea label="Description" value={form.description} onChange={(v) => set({ description: v })} rows={4} />
          </div>
        </TabsContent>
        <TabsContent value="pricing" className="modal-scroll p-4" style={modalScrollStyle}>
          <div className="flex flex-col gap-4">
            <Input label="Price From (number)" type="number" value={form.priceFrom} onChange={(v) => set({ priceFrom: Number(v) })} />
            <Input label="Price Original (optional, number)" type="number" value={form.priceOriginal ?? ""} onChange={(v) => set({ priceOriginal: v ? Number(v) : undefined })} />
          </div>
        </TabsContent>
        <TabsContent value="inclusions" className="modal-scroll p-4" style={modalScrollStyle}>
          <div className="flex flex-col gap-4">
            <StringListEditor label="Highlights" items={form.highlights} onChange={(items) => set({ highlights: items })} placeholder="Add a highlight..." />
            <StringListEditor label="Inclusions" items={form.inclusions} onChange={(items) => set({ inclusions: items })} placeholder="Add an inclusion..." />
          </div>
        </TabsContent>
        <TabsContent value="exclusions" className="modal-scroll p-4" style={modalScrollStyle}>
          <StringListEditor label="Exclusions" items={form.exclusions} onChange={(items) => set({ exclusions: items })} placeholder="Add an exclusion..." />
        </TabsContent>
        <TabsContent value="stops" className="modal-scroll p-4" style={modalScrollStyle}>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-charcoal/70">Per-stop editor</p>
            {(form.stops ?? []).map((s, idx) => (
              <div key={idx} className="p-4 border border-border" style={sharp}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Input label="Day" value={s.day} onChange={(v) => { const next = [...(form.stops ?? [])]; next[idx] = { ...s, day: v }; set({ stops: next }); }} />
                  <Input label="Title" value={s.title} onChange={(v) => { const next = [...(form.stops ?? [])]; next[idx] = { ...s, title: v }; set({ stops: next }); }} />
                </div>
                <div className="mt-3">
                  <Textarea label="Description" value={s.description} onChange={(v) => { const next = [...(form.stops ?? [])]; next[idx] = { ...s, description: v }; set({ stops: next }); }} rows={3} />
                </div>
                <div className="mt-3">
                  <Input label="Image URL" value={s.image} onChange={(v) => { const next = [...(form.stops ?? [])]; next[idx] = { ...s, image: v }; set({ stops: next }); }} />
                </div>
                <div className="mt-3 flex justify-end">
                  <button type="button" onClick={() => set({ stops: (form.stops ?? []).filter((_, i) => i !== idx) })} className="text-xs text-red-700 hover:underline">Remove stop</button>
                </div>
              </div>
            ))}
            <button type="button" onClick={() => set({ stops: [...(form.stops ?? []), { day: `Day ${(form.stops?.length ?? 0) + 1}`, title: "", description: "", image: "" }] })} className="btn-luxury btn-luxury-gold flex items-center gap-2 self-start">
              <Plus className="w-4 h-4" /> Add Stop
            </button>
          </div>
        </TabsContent>
      </Tabs>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
        <button onClick={onClose} className="btn-luxury">Cancel</button>
        <button onClick={() => onSave(form)} className="btn-luxury btn-luxury-gold">Save</button>
      </div>
    </Modal>
  );
}

/* ============================================================
 * Destinations section
 * ============================================================ */
function DestinationsSection() {
  const destinations = useDestinations();
  const [editing, setEditing] = useState<Destination | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <PageHeader
        title="Destinations"
        subtitle={`${destinations.length} destinations`}
        action={
          <button onClick={() => setCreating(true)} className="btn-luxury btn-luxury-gold flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Destination
          </button>
        }
      />
      <ul className="bg-alabaster border border-border divide-y divide-border" style={sharp}>
        {destinations.map((d) => (
          <li key={d.id} className="p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <img src={d.imagePortrait} alt={d.name} className="w-14 h-14 object-cover bg-bone flex-shrink-0" style={sharp} />
              <div className="min-w-0">
                <p className="font-display text-lg text-charcoal truncate" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  {d.name}
                </p>
                <p className="text-xs text-charcoal/60">{d.country} · {d.tagline}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <IconButton icon={<Edit2 className="w-4 h-4" />} label="Edit" onClick={() => setEditing(d)} />
              <IconButton icon={<Trash2 className="w-4 h-4" />} label="Delete" onClick={() => { if (confirm(`Delete "${d.name}"?`)) store.deleteDestination(d.id); }} />
            </div>
          </li>
        ))}
      </ul>

      {(editing || creating) && (
        <DestinationEditor
          dest={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={(d) => {
            if (editing) store.updateDestination(editing.id, d);
            else store.addDestination({ ...d, id: generateId("dest") });
            setEditing(null); setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function DestinationEditor({ dest, onClose, onSave }: { dest: Destination | null; onClose: () => void; onSave: (d: Destination) => void }) {
  const [form, setForm] = useState<Destination>(
    dest ?? { id: "", name: "", country: "", tagline: "", description: "", image: "", imagePortrait: "", days: "", price: "" }
  );
  const set = (patch: Partial<Destination>) => setForm({ ...form, ...patch });
  return (
    <Modal open onClose={onClose} title={dest ? `Edit · ${dest.name}` : "New Destination"}>
      <div className="flex flex-col gap-4">
        <Input label="Name" value={form.name} onChange={(v) => set({ name: v })} />
        <Input label="Country" value={form.country} onChange={(v) => set({ country: v })} />
        <Input label="Tagline" value={form.tagline} onChange={(v) => set({ tagline: v })} />
        <Input label="Days (label)" value={form.days} onChange={(v) => set({ days: v })} />
        <Input label="Price (label)" value={form.price} onChange={(v) => set({ price: v })} />
        <Input label="Image URL" value={form.image} onChange={(v) => set({ image: v })} />
        <Input label="Portrait Image URL" value={form.imagePortrait} onChange={(v) => set({ imagePortrait: v })} />
        <Textarea label="Description" value={form.description} onChange={(v) => set({ description: v })} rows={4} />
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
        <button onClick={onClose} className="btn-luxury">Cancel</button>
        <button onClick={() => onSave(form)} className="btn-luxury btn-luxury-gold">Save</button>
      </div>
    </Modal>
  );
}

/* ============================================================
 * Quotes section
 * ============================================================ */
function QuotesSection() {
  const quotes = useQuotes();
  return (
    <div>
      <PageHeader title="Quote Requests" subtitle={`${quotes.length} requests`} />
      {quotes.length === 0 ? (
        <div className="bg-alabaster border border-border p-12 text-center" style={sharp}>
          <p className="font-display text-2xl text-charcoal/60" style={{ fontFamily: "var(--font-cormorant), serif" }}>No quote requests yet.</p>
          <p className="text-sm text-charcoal/50 mt-2">Quote requests submitted through the site will appear here.</p>
        </div>
      ) : (
        <ul className="bg-alabaster border border-border divide-y divide-border" style={sharp}>
          {quotes.map((q) => (
            <li key={q.id} className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg text-charcoal" style={{ fontFamily: "var(--font-cormorant), serif" }}>{q.name}</p>
                <p className="text-xs text-charcoal/60">{q.email} · {q.phone}</p>
                <p className="text-xs text-charcoal/70 mt-2">
                  {q.destination} · {q.duration} · {q.travellers} travellers · {q.budget} budget
                </p>
                {q.notes && <p className="text-xs text-charcoal/60 mt-2 italic">{q.notes}</p>}
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <select
                  value={q.status}
                  onChange={(e) => store.updateQuote(q.id, { status: e.target.value as QuoteRequest["status"] })}
                  className="border border-border px-2 py-1 text-xs text-charcoal"
                  style={sharp}
                >
                  <option value="new">New</option>
                  <option value="in-review">In Review</option>
                  <option value="quoted">Quoted</option>
                  <option value="closed">Closed</option>
                </select>
                <button onClick={() => store.deleteQuote(q.id)} className="text-xs text-red-700 hover:underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ============================================================
 * Bookings section
 * ============================================================ */
function BookingsSection() {
  const bookings = useBookings();
  return (
    <div>
      <PageHeader title="Bookings" subtitle={`${bookings.length} reservations`} />
      {bookings.length === 0 ? (
        <div className="bg-alabaster border border-border p-12 text-center" style={sharp}>
          <p className="font-display text-2xl text-charcoal/60" style={{ fontFamily: "var(--font-cormorant), serif" }}>No bookings yet.</p>
          <p className="text-sm text-charcoal/50 mt-2">Bookings submitted via the BookingModal will appear here, persisted in localStorage.</p>
        </div>
      ) : (
        <ul className="bg-alabaster border border-border divide-y divide-border" style={sharp}>
          {bookings.map((b) => (
            <li key={b.id} className="p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-display text-lg text-charcoal" style={{ fontFamily: "var(--font-cormorant), serif" }}>
                  {b.tripName}
                </p>
                <p className="text-xs text-charcoal/60">{b.customerName} · {b.customerEmail} · {b.customerPhone}</p>
                <p className="text-xs text-charcoal/70 mt-2">
                  {b.numTravellers} travellers · ${b.totalPrice.toLocaleString()} total · {b.duration}
                  {b.startDate && ` · ${b.startDate}${b.endDate ? ` → ${b.endDate}` : ""}`}
                </p>
                {b.notes && <p className="text-xs text-charcoal/60 mt-2 italic">{b.notes}</p>}
                <p className="text-[0.65rem] text-charcoal/40 mt-2">Submitted {new Date(b.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <select
                  value={b.status}
                  onChange={(e) => store.updateBooking(b.id, { status: e.target.value as Booking["status"] })}
                  className="border border-border px-2 py-1 text-xs text-charcoal"
                  style={sharp}
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button onClick={() => store.deleteBooking(b.id)} className="text-xs text-red-700 hover:underline">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ============================================================
 * Gallery section (read-only placeholder)
 * ============================================================ */
function GallerySection() {
  const tours = useTours();
  const accs = useAccommodations();
  const trips = useScheduledTrips();

  const images: { src: string; caption: string }[] = [
    ...tours.map((t) => ({ src: t.image, caption: t.name })),
    ...tours.flatMap((t) => (t.galleryImages ?? []).map((g) => ({ src: g, caption: `${t.name} gallery` }))),
    ...accs.map((a) => ({ src: a.image, caption: a.name })),
    ...trips.map((t) => ({ src: t.image, caption: t.name })),
  ];

  return (
    <div>
      <PageHeader title="Gallery" subtitle={`${images.length} images across all content`} />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <div key={idx} className="aspect-square overflow-hidden bg-bone relative group" style={sharp}>
            <img src={img.src} alt={img.caption} className="w-full h-full object-cover img-luxury" />
            <div className="absolute bottom-0 left-0 right-0 p-2 bg-charcoal/60 text-cream text-[0.65rem] opacity-0 group-hover:opacity-100 transition-opacity">
              {img.caption}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
 * Testimonials section
 * ============================================================ */
function TestimonialsSection() {
  const testimonials = useTestimonials();
  const [editing, setEditing] = useState<Testimonial | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <div>
      <PageHeader
        title="Testimonials"
        subtitle={`${testimonials.length} entries (${testimonials.filter((t) => t.published).length} published)`}
        action={
          <button onClick={() => setCreating(true)} className="btn-luxury btn-luxury-gold flex items-center gap-2">
            <Plus className="w-4 h-4" /> New Testimonial
          </button>
        }
      />
      <ul className="bg-alabaster border border-border divide-y divide-border" style={sharp}>
        {testimonials.map((t) => (
          <li key={t.id} className="p-4 flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 flex-1 min-w-0">
              <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover bg-bone flex-shrink-0" />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display text-lg text-charcoal" style={{ fontFamily: "var(--font-cormorant), serif" }}>{t.name}</p>
                  {t.published ? (
                    <span className="text-[0.6rem] text-forest border border-forest px-2 py-0.5" style={sharp}>PUBLISHED</span>
                  ) : (
                    <span className="text-[0.6rem] text-charcoal/50 border border-border px-2 py-0.5" style={sharp}>DRAFT</span>
                  )}
                </div>
                <p className="text-xs text-charcoal/60">{t.role}</p>
                <p className="text-sm text-charcoal/80 italic mt-2 line-clamp-2">"{t.content}"</p>
                <p className="text-[0.65rem] text-charcoal/40 mt-2">Dated {t.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button
                onClick={() => store.updateTestimonial(t.id, { published: !t.published })}
                className="px-2 py-1 text-xs text-charcoal/60 hover:text-forest border border-border"
                style={sharp}
                aria-label="Toggle published"
              >
                {t.published ? "Unpublish" : "Publish"}
              </button>
              <IconButton icon={<Edit2 className="w-4 h-4" />} label="Edit" onClick={() => setEditing(t)} />
              <IconButton icon={<Trash2 className="w-4 h-4" />} label="Delete" onClick={() => { if (confirm(`Delete testimonial from "${t.name}"?`)) store.deleteTestimonial(t.id); }} />
            </div>
          </li>
        ))}
      </ul>

      {(editing || creating) && (
        <TestimonialEditor
          t={editing}
          onClose={() => { setEditing(null); setCreating(false); }}
          onSave={(t) => {
            if (editing) store.updateTestimonial(editing.id, t);
            else store.addTestimonial({ ...t, id: generateId("t") });
            setEditing(null); setCreating(false);
          }}
        />
      )}
    </div>
  );
}

function TestimonialEditor({ t, onClose, onSave }: { t: Testimonial | null; onClose: () => void; onSave: (t: Testimonial) => void }) {
  const [form, setForm] = useState<Testimonial>(
    t ?? { id: "", name: "", role: "", avatar: "", content: "", published: true, date: new Date().toISOString().slice(0, 10) }
  );
  const set = (patch: Partial<Testimonial>) => setForm({ ...form, ...patch });
  return (
    <Modal open onClose={onClose} title={t ? `Edit · ${t.name}` : "New Testimonial"}>
      <div className="flex flex-col gap-4">
        <Input label="Name" value={form.name} onChange={(v) => set({ name: v })} />
        <Input label="Role" value={form.role} onChange={(v) => set({ role: v })} />
        <Input label="Avatar URL" value={form.avatar} onChange={(v) => set({ avatar: v })} placeholder="https://..." />
        <Input label="Date" type="date" value={form.date} onChange={(v) => set({ date: v })} />
        <Textarea label="Content" value={form.content} onChange={(v) => set({ content: v })} rows={5} />
        <Toggle label="Published" checked={form.published} onChange={(v) => set({ published: v })} />
      </div>
      <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
        <button onClick={onClose} className="btn-luxury">Cancel</button>
        <button onClick={() => onSave(form)} className="btn-luxury btn-luxury-gold">Save</button>
      </div>
    </Modal>
  );
}

/* ============================================================
 * Settings section
 * ============================================================ */
function SettingsSection() {
  return (
    <div>
      <PageHeader title="Settings" subtitle="Site configuration (read-only in this build)" />
      <Tabs defaultValue="general" className={tabsWrapperClass} style={tabsWrapperStyle}>
        <TabsList className="flex-shrink-0">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="backup">Backup</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="modal-scroll p-4" style={modalScrollStyle}>
          <SettingsCard title="Site Identity">
            <ReadonlyRow label="Brand Name" value="Unzip Africa Safaris" />
            <ReadonlyRow label="Tagline" value="Bespoke Safaris · East & Southern Africa" />
            <ReadonlyRow label="Founded" value="Arusha, 2009" />
            <ReadonlyRow label="Memberships" value="ATTA · PACK · The Long Run" />
          </SettingsCard>
        </TabsContent>

        <TabsContent value="branding" className="modal-scroll p-4" style={modalScrollStyle}>
          <SettingsCard title="Brand Palette">
            <ReadonlyRow label="Charcoal" value="#1C1A17" />
            <ReadonlyRow label="Forest" value="#2C3A2E" />
            <ReadonlyRow label="Forest Deep" value="#1A241C" />
            <ReadonlyRow label="Cream" value="#FBF8F1" />
            <ReadonlyRow label="Gold" value="#A88B5C" />
            <ReadonlyRow label="Gold Soft" value="#C9B187" />
          </SettingsCard>
        </TabsContent>

        <TabsContent value="integrations" className="modal-scroll p-4" style={modalScrollStyle}>
          <SettingsCard title="External Services">
            <ReadonlyRow label="WhatsApp" value="+256 706 761092" />
            <ReadonlyRow label="Booking Email" value="booking@unzipafrica.com" />
            <ReadonlyRow label="Info Email" value="info@unzipafrica.com" />
            <ReadonlyRow label="AMREF Cover" value="Flying Doctors medical evacuation" />
          </SettingsCard>
        </TabsContent>

        <TabsContent value="notifications" className="modal-scroll p-4" style={modalScrollStyle}>
          <SettingsCard title="Notification Preferences">
            <Toggle label="Email on new booking" checked onChange={() => {}} />
            <Toggle label="Email on new quote request" checked onChange={() => {}} />
            <Toggle label="Daily summary digest" checked={false} onChange={() => {}} />
          </SettingsCard>
        </TabsContent>

        <TabsContent value="backup" className="modal-scroll p-4" style={modalScrollStyle}>
          <SettingsCard title="Data Backup">
            <ReadonlyRow label="Bookings Storage" value="localStorage (key: unzip_africa_bookings)" />
            <ReadonlyRow label="Quotes Storage" value="localStorage (key: unzip_africa_quotes)" />
            <p className="text-xs text-charcoal/60 mt-3">Bookings and quotes persist to your browser's localStorage so they survive HMR and reloads. To clear everything, sign out (which clears the admin session).</p>
            <button
              onClick={() => {
                if (confirm("Clear all bookings and quotes?")) {
                  store.clearBookings();
                  store.setQuotes([]);
                }
              }}
              className="btn-luxury mt-4"
            >
              Clear All Bookings + Quotes
            </button>
          </SettingsCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function SettingsCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-alabaster border border-border p-5" style={sharp}>
      <h3
        className="font-display text-xl text-charcoal tracking-tight mb-4"
        style={{ fontFamily: "var(--font-cormorant), serif" }}
      >
        {title}
      </h3>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

function ReadonlyRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-sm border-b border-border pb-2 last:border-0">
      <span className="font-eyebrow text-charcoal/50">{label}</span>
      <span className="text-charcoal">{value}</span>
    </div>
  );
}
