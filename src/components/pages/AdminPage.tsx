"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useRouter } from "@/lib/router";
import {
  useAccommodations,
  useBookings,
  useDestinations,
  useQuotes,
  useScheduledTrips,
  useTestimonials,
  useTours,
  store,
  generateId,
  type Booking,
  type BookingStatus,
  type QuoteRequest,
} from "@/lib/store";
import type {
  Accommodation,
  Destination,
  ScheduledTrip,
  Testimonial,
  TourPackage,
} from "@/lib/content";
import { toast } from "sonner";
import {
  ArrowLeft,
  Building2,
  Calendar,
  CalendarCheck,
  Check,
  ChevronDown,
  ChevronUp,
  Compass,
  Eye,
  LayoutDashboard,
  LogOut,
  Mail,
  MapPin,
  Pencil,
  Plus,
  Quote,
  Save,
  Search,
  Settings as SettingsIcon,
  Trash2,
} from "lucide-react";

/* ============================================================
 * Constants & helpers
 * ============================================================ */
const sharp = { borderRadius: 0 } as const;
const modalScrollStyle = { overflowY: "auto", flex: "1 1 0%", minHeight: 0 } as const;
const tabsWrapperStyle = {
  display: "flex",
  flexDirection: "column",
  flex: "1 1 0%",
  minHeight: 0,
  overflow: "hidden",
} as const;
const tabsWrapperClass = "flex-1 min-h-0 overflow-hidden flex flex-col";

const SESSION_KEY = "unzip_africa_admin_session";
const SETTINGS_KEY = "unzip_africa_settings";

const ACCOMMODATION_LEVELS = [
  "Luxury Lodges",
  "Luxury Tented Camp",
  "Forest Lodge",
  "Desert Lodge",
  "Wilderness Lodge",
  "Mobile Bush Camp",
];
const ACCOMMODATION_TYPES = [
  "Lodge",
  "Tented Camp",
  "Forest Lodge",
  "Desert Lodge",
  "Wilderness Lodge",
  "Mobile Bush Camp",
];
const TRIP_TYPES = [
  "Luxury Safaris",
  "Gorilla Trekking",
  "Cultural Tours",
  "Walking Safaris",
  "Honeymoon",
  "Family",
];

type AdminSection =
  | "dashboard"
  | "tours"
  | "accommodations"
  | "scheduled-trips"
  | "destinations"
  | "quotes"
  | "bookings"
  | "scheduled-trip-bookings"
  | "testimonials"
  | "settings";

type DayItem = { day: string; title: string; description: string; image: string };

// Admin-only augmentation of TourPackage — extra fields persisted when edited via admin
type TourPackageAdmin = TourPackage & {
  inclusions?: string[];
  exclusions?: string[];
  mapEmbed?: string;
};

type TourFormState = {
  name: string;
  subtitle: string;
  destination: string;
  nationalPark: string;
  duration: string;
  durationDays: number | "";
  durationNights: number | "";
  price: string;
  priceFrom: number | "";
  priceOriginal: number | "";
  highlights: string;
  activities: string;
  image: string;
  galleryImages: string;
  days: DayItem[];
  tripType: string;
  accommodationLevel: string;
  featured: boolean;
  minAge: number | "";
  accommodationIds: string[];
  inclusions: string;
  exclusions: string;
  mapEmbed: string;
};

type AccommodationFormState = {
  name: string;
  location: string;
  type: string;
  description: string;
  image: string;
  galleryImages: string;
  features: string;
  pricePerNight: string;
};

type ScheduledTripFormState = {
  name: string;
  destination: string;
  description: string;
  highlights: string;
  groupSize: string;
  spotsLeft: number | "";
  accommodationLevel: string;
  startDate: string;
  endDate: string;
  durationDays: number | "";
  priceFrom: number | "";
  priceOriginal: number | "";
  image: string;
  galleryImages: string;
  inclusions: string;
  exclusions: string;
  stops: DayItem[];
};

type DestinationFormState = {
  name: string;
  country: string;
  tagline: string;
  description: string;
  image: string;
  imagePortrait: string;
  days: string;
  price: string;
};

type TestimonialFormState = {
  name: string;
  role: string;
  avatar: string;
  content: string;
  published: boolean;
  date: string;
};

type SettingsState = {
  companyName: string;
  tagline: string;
  email: string;
  phone: string;
  logoUrl: string;
  facebook: string;
  instagram: string;
  twitter: string;
  youtube: string;
  primaryColor: string;
  accentColor: string;
  whatsappNumber: string;
  whatsappMessage: string;
  copyright: string;
  developedBy: string;
};

const DEFAULT_SETTINGS: SettingsState = {
  companyName: "Unzip Africa Safaris",
  tagline: "Curated African journeys",
  email: "hello@unzipafrica.com",
  phone: "+255 754 000 000",
  logoUrl: "",
  facebook: "",
  instagram: "",
  twitter: "",
  youtube: "",
  primaryColor: "#2C3A2E",
  accentColor: "#A88B5C",
  whatsappNumber: "+255754000000",
  whatsappMessage: "Hello! I'd like to plan a safari.",
  copyright: "© Unzip Africa Safaris. All rights reserved.",
  developedBy: "Crafted with care",
};

function splitLines(text: string): string[] {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function joinLines(arr?: string[] | null): string {
  return (arr ?? []).join("\n");
}

function numOrEmpty(v: number | undefined | null): number | "" {
  if (v === undefined || v === null) return "";
  return v;
}

function readSettings(): SettingsState {
  if (typeof window === "undefined") return DEFAULT_SETTINGS;
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...(JSON.parse(raw) as Partial<SettingsState>) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

/* ============================================================
 * Tiny shared UI primitives
 * ============================================================ */
function Img({
  src,
  alt,
  className,
}: {
  src?: string;
  alt?: string;
  className?: string;
}) {
  if (!src) return null;
  return <img src={src} alt={alt ?? ""} className={className} />;
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/70">
        {label}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  const { className, ...rest } = props;
  return (
    <input
      {...rest}
      className={`w-full h-9 px-3 bg-cream border border-charcoal/15 text-sm text-charcoal placeholder:text-muted-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold disabled:opacity-60 ${
        className ?? ""
      }`}
      style={sharp}
    />
  );
}

function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const { className, ...rest } = props;
  return (
    <textarea
      {...rest}
      className={`w-full px-3 py-2 bg-cream border border-charcoal/15 text-sm text-charcoal placeholder:text-muted-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold resize-y min-h-[80px] ${
        className ?? ""
      }`}
      style={sharp}
    />
  );
}

function Select(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  const { className, children, ...rest } = props;
  return (
    <select
      {...rest}
      className={`w-full h-9 px-3 bg-cream border border-charcoal/15 text-sm text-charcoal focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold ${
        className ?? ""
      }`}
      style={sharp}
    >
      {children}
    </select>
  );
}

function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
}) {
  return (
    <label className="flex items-center gap-3 cursor-pointer select-none">
      <Switch checked={checked} onCheckedChange={onChange} />
      <span className="text-sm text-charcoal">{label}</span>
    </label>
  );
}

function IconBtn({
  onClick,
  icon: Icon,
  label,
  variant = "default",
}: {
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  variant?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`p-1.5 inline-flex items-center justify-center transition-colors ${
        variant === "danger"
          ? "text-red-700 hover:bg-red-50"
          : "text-charcoal hover:bg-charcoal/10"
      }`}
      style={sharp}
    >
      <Icon className="w-4 h-4" />
    </button>
  );
}

function CancelButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 px-5 text-sm font-medium uppercase tracking-wider text-charcoal border border-charcoal/20 hover:bg-charcoal/5 transition-colors"
      style={sharp}
    >
      Cancel
    </button>
  );
}

function SaveButton({
  onClick,
  label = "Save",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 px-5 text-sm font-medium uppercase tracking-wider bg-forest text-cream hover:bg-forest-deep transition-colors inline-flex items-center gap-2"
      style={sharp}
    >
      <Save className="w-4 h-4" />
      {label}
    </button>
  );
}

function PrimaryButton({
  onClick,
  label,
  icon: Icon,
}: {
  onClick: () => void;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="h-10 px-5 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-wider bg-forest text-cream hover:bg-forest-deep transition-colors"
      style={sharp}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {label}
    </button>
  );
}

function SectionHeader({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between flex-wrap gap-4">
      <div>
        <p className="font-eyebrow text-gold mb-2">{eyebrow}</p>
        <h1
          className="text-3xl md:text-4xl"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          {title}
        </h1>
      </div>
      {action}
    </div>
  );
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`bg-alabaster border border-charcoal/10 ${className ?? ""}`}
      style={sharp}
    >
      {children}
    </div>
  );
}

function StatusBadge({ status }: { status: BookingStatus }) {
  const map: Record<BookingStatus, string> = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    confirmed: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border ${map[status]}`}
      style={sharp}
    >
      {status}
    </span>
  );
}

function QuoteStatusBadge({ status }: { status: QuoteRequest["status"] }) {
  const map: Record<QuoteRequest["status"], string> = {
    new: "bg-blue-100 text-blue-800 border-blue-200",
    "in-review": "bg-amber-100 text-amber-800 border-amber-200",
    quoted: "bg-emerald-100 text-emerald-800 border-emerald-200",
    closed: "bg-zinc-200 text-zinc-700 border-zinc-300",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border ${map[status]}`}
      style={sharp}
    >
      {status}
    </span>
  );
}

function ImagePreview({ url, alt }: { url: string; alt?: string }) {
  if (!url) return null;
  return (
    <div className="mt-2 overflow-hidden border border-charcoal/10" style={sharp}>
      <Img src={url} alt={alt ?? "preview"} className="w-full h-32 object-cover" />
    </div>
  );
}

function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="py-16 text-center">
      <p
        className="text-2xl mb-2"
        style={{ fontFamily: "var(--font-cormorant), serif" }}
      >
        {title}
      </p>
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}

/* ============================================================
 * Login gate
 * ============================================================ */
function LoginGate({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void;
  onBack: () => void;
}) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "unzip2025") {
      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        /* ignore */
      }
      onSuccess();
    } else {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest-deep px-4">
      <div className="w-full max-w-md bg-alabaster" style={sharp}>
        <div className="p-8 md:p-10">
          <p className="font-eyebrow text-gold mb-3">UNZIP AFRICA · ADMIN</p>
          <h1
            className="text-3xl mb-2"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Welcome back
          </h1>
          <p className="text-sm text-muted-foreground mb-6">
            Sign in to manage your travel platform.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/70 mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full h-11 px-3 bg-cream border border-charcoal/15 text-charcoal placeholder:text-muted-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                style={sharp}
                placeholder="admin"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium uppercase tracking-[0.18em] text-charcoal/70 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 px-3 bg-cream border border-charcoal/15 text-charcoal placeholder:text-muted-foreground focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold"
                style={sharp}
                placeholder="••••••••"
              />
            </div>
            {error && (
              <p
                className="text-sm text-red-700 bg-red-50 border border-red-200 px-3 py-2"
                style={sharp}
              >
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full h-11 bg-forest text-cream font-medium uppercase tracking-[0.2em] text-sm hover:bg-forest-deep transition-colors"
              style={sharp}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={onBack}
              className="w-full flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-charcoal transition-colors py-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to site
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
 * Sidebar
 * ============================================================ */
const NAV_ITEMS: { id: AdminSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "tours", label: "Tours", icon: Compass },
  { id: "accommodations", label: "Accommodations", icon: Building2 },
  { id: "scheduled-trips", label: "Scheduled Trips", icon: Calendar },
  { id: "destinations", label: "Destinations", icon: MapPin },
  { id: "quotes", label: "Quote Requests", icon: Mail },
  { id: "bookings", label: "Tour Bookings", icon: CalendarCheck },
  { id: "scheduled-trip-bookings", label: "Scheduled Trip Bookings", icon: Calendar },
  { id: "testimonials", label: "Testimonials", icon: Quote },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

function Sidebar({
  section,
  onNavigate,
  onSignOut,
}: {
  section: AdminSection;
  onNavigate: (s: AdminSection) => void;
  onSignOut: () => void;
}) {
  return (
    <aside
      className="w-60 bg-forest-deep text-cream flex-shrink-0 flex flex-col"
      style={sharp}
    >
      <div className="p-6 border-b border-cream/10">
        <p
          className="text-2xl tracking-tight"
          style={{ fontFamily: "var(--font-cormorant), serif" }}
        >
          Unzip Africa
        </p>
        <p className="font-eyebrow text-gold-soft mt-1">Admin Panel</p>
      </div>
      <nav className="flex-1 py-4">
        {NAV_ITEMS.map((item) => {
          const active = section === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm transition-colors border-l-2 ${
                active
                  ? "bg-cream/10 text-gold-soft border-gold-soft"
                  : "text-cream/70 hover:bg-cream/5 hover:text-cream border-transparent"
              }`}
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="p-4 border-t border-cream/10">
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-cream/60 hover:text-cream transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

/* ============================================================
 * Dashboard
 * ============================================================ */
function DashboardSection({
  onNavigate,
}: {
  onNavigate: (s: AdminSection) => void;
}) {
  const tours = useTours();
  const accommodations = useAccommodations();
  const scheduledTrips = useScheduledTrips();
  const destinations = useDestinations();
  const bookings = useBookings();
  const testimonials = useTestimonials();

  const stats: {
    label: string;
    value: number;
    section: AdminSection;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { label: "Tours", value: tours.length, section: "tours", icon: Compass },
    { label: "Accommodations", value: accommodations.length, section: "accommodations", icon: Building2 },
    { label: "Scheduled Trips", value: scheduledTrips.length, section: "scheduled-trips", icon: Calendar },
    { label: "Destinations", value: destinations.length, section: "destinations", icon: MapPin },
    { label: "Tour Bookings", value: bookings.filter(b => b.type === "tour").length, section: "bookings", icon: CalendarCheck },
    { label: "Scheduled Bookings", value: bookings.filter(b => b.type === "scheduled-trip").length, section: "scheduled-trip-bookings", icon: Calendar },
    { label: "Testimonials", value: testimonials.length, section: "testimonials", icon: Quote },
  ];

  const recentBookings = bookings.slice(0, 5);

  return (
    <div className="space-y-8">
      <SectionHeader eyebrow="OVERVIEW" title="Dashboard" />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {stats.map((s) => (
          <button
            key={s.label}
            onClick={() => onNavigate(s.section)}
            className="bg-alabaster border border-charcoal/10 p-5 text-left hover:border-gold/50 hover:shadow-md transition-all"
            style={sharp}
          >
            <s.icon className="w-5 h-5 text-gold mb-3" />
            <p
              className="text-3xl"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              {s.value}
            </p>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">
              {s.label}
            </p>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Panel className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl"
              style={{ fontFamily: "var(--font-cormorant), serif" }}
            >
              Recent Bookings
            </h2>
            <button
              onClick={() => onNavigate("bookings")}
              className="text-[10px] uppercase tracking-wider text-gold hover:underline"
            >
              View all
            </button>
          </div>
          {recentBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">
              No bookings yet.
            </p>
          ) : (
            <ul className="divide-y divide-charcoal/10">
              {recentBookings.map((b) => (
                <li
                  key={b.id}
                  className="py-3 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-charcoal truncate">
                      {b.customerName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {b.tripName} · {b.destination}
                    </p>
                  </div>
                  <StatusBadge status={b.status} />
                </li>
              ))}
            </ul>
          )}
        </Panel>

        <Panel className="p-6">
          <h2
            className="text-xl mb-4"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <QuickAction
              label="Add Tour"
              icon={Plus}
              onClick={() => onNavigate("tours")}
            />
            <QuickAction
              label="Add Accommodation"
              icon={Plus}
              onClick={() => onNavigate("accommodations")}
            />
            <QuickAction
              label="Add Scheduled Trip"
              icon={Plus}
              onClick={() => onNavigate("scheduled-trips")}
            />
            <QuickAction
              label="Add Destination"
              icon={Plus}
              onClick={() => onNavigate("destinations")}
            />
            <QuickAction
              label="Add Testimonial"
              icon={Plus}
              onClick={() => onNavigate("testimonials")}
            />
            <QuickAction
              label="View Quotes"
              icon={Mail}
              onClick={() => onNavigate("quotes")}
            />
          </div>
        </Panel>
      </div>
    </div>
  );
}

function QuickAction({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 p-3 border border-charcoal/10 hover:border-gold/50 hover:bg-cream transition-colors text-sm text-charcoal text-left"
      style={sharp}
    >
      <Icon className="w-4 h-4 text-gold" />
      <span>{label}</span>
    </button>
  );
}

/* ============================================================
 * Tours
 * ============================================================ */
function emptyTourForm(): TourFormState {
  return {
    name: "",
    subtitle: "",
    destination: "",
    nationalPark: "",
    duration: "",
    durationDays: "",
    durationNights: "",
    price: "",
    priceFrom: "",
    priceOriginal: "",
    highlights: "",
    activities: "",
    image: "",
    galleryImages: "",
    days: [],
    tripType: TRIP_TYPES[0],
    accommodationLevel: ACCOMMODATION_LEVELS[0],
    featured: false,
    minAge: "",
    accommodationIds: [],
    inclusions: "",
    exclusions: "",
    mapEmbed: "",
  };
}

function tourToForm(t: TourPackage): TourFormState {
  const a = t as TourPackageAdmin;
  return {
    name: t.name,
    subtitle: t.subtitle,
    destination: t.destination,
    nationalPark: t.nationalPark,
    duration: t.duration,
    durationDays: t.durationDays,
    durationNights: t.durationNights,
    price: t.price,
    priceFrom: t.priceFrom,
    priceOriginal: numOrEmpty(t.priceOriginal),
    highlights: joinLines(t.highlights),
    activities: joinLines(t.activities),
    image: t.image,
    galleryImages: joinLines(t.galleryImages),
    days: t.days.map((d) => ({ ...d })),
    tripType: t.tripType,
    accommodationLevel: t.accommodationLevel,
    featured: t.featured ?? false,
    minAge: t.minAge,
    accommodationIds: [...t.accommodationIds],
    inclusions: joinLines(a.inclusions),
    exclusions: joinLines(a.exclusions),
    mapEmbed: a.mapEmbed ?? "",
  };
}

function formToTour(form: TourFormState, id: string): TourPackage {
  return {
    id,
    name: form.name.trim(),
    subtitle: form.subtitle,
    destination: form.destination,
    nationalPark: form.nationalPark,
    duration: form.duration,
    durationDays:
      typeof form.durationDays === "number"
        ? form.durationDays
        : Number(form.durationDays) || 0,
    durationNights:
      typeof form.durationNights === "number"
        ? form.durationNights
        : Number(form.durationNights) || 0,
    price: form.price,
    priceFrom:
      typeof form.priceFrom === "number"
        ? form.priceFrom
        : Number(form.priceFrom) || 0,
    priceOriginal:
      form.priceOriginal === "" ? undefined : Number(form.priceOriginal),
    highlights: splitLines(form.highlights),
    image: form.image,
    galleryImages: splitLines(form.galleryImages),
    days: form.days,
    activities: splitLines(form.activities),
    tripType: form.tripType,
    accommodationLevel: form.accommodationLevel,
    featured: form.featured,
    minAge: typeof form.minAge === "number" ? form.minAge : Number(form.minAge) || 0,
    accommodationIds: form.accommodationIds,
    inclusions: splitLines(form.inclusions),
    exclusions: splitLines(form.exclusions),
    mapEmbed: form.mapEmbed,
  } as TourPackage;
}

function ToursSection() {
  const tours = useTours();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<TourPackage | "new" | null>(null);

  const filtered = tours.filter((t) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      t.name.toLowerCase().includes(q) ||
      t.destination.toLowerCase().includes(q) ||
      t.nationalPark.toLowerCase().includes(q)
    );
  });

  const handleSave = (data: TourPackage) => {
    if (editing === "new") {
      store.setTours([data, ...tours]);
      toast.success("Tour created");
    } else {
      store.setTours(tours.map((t) => (t.id === data.id ? data : t)));
      toast.success("Tour updated");
    }
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this tour? This cannot be undone.")) return;
    store.setTours(tours.filter((t) => t.id !== id));
    toast.success("Tour deleted");
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="MANAGE"
        title="Tours"
        action={
          <PrimaryButton
            label="Add Tour"
            icon={Plus}
            onClick={() => setEditing("new")}
          />
        }
      />

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search tours..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-10 pl-10 pr-3 bg-alabaster border border-charcoal/15 text-sm focus:outline-none focus:border-gold"
          style={sharp}
        />
      </div>

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream border-b border-charcoal/10">
                {["Tour", "Destination", "Duration", "Price", "Actions"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 font-medium uppercase tracking-wider text-[11px] text-muted-foreground ${
                        i === 4 ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-charcoal/5 hover:bg-cream/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 overflow-hidden bg-charcoal/5 flex-shrink-0"
                        style={sharp}
                      >
                        {t.image && (
                          <Img
                            src={t.image}
                            alt={t.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-charcoal">
                          {t.name}
                        </span>
                        {t.featured && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 bg-gold/20 text-gold border border-gold/30"
                            style={sharp}
                          >
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {t.destination}
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{t.duration}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-charcoal">
                        ${t.priceFrom.toLocaleString()}
                      </span>
                      {t.priceOriginal && (
                        <span
                          className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-800"
                          style={sharp}
                        >
                          -${(t.priceOriginal - t.priceFrom).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <IconBtn
                        icon={Pencil}
                        label="Edit"
                        onClick={() => setEditing(t)}
                      />
                      <IconBtn
                        icon={Trash2}
                        label="Delete"
                        variant="danger"
                        onClick={() => handleDelete(t.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No tours found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {editing !== null && (
        <TourFormModal
          tour={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function TourFormModal({
  tour,
  onClose,
  onSave,
}: {
  tour: TourPackage | null;
  onClose: () => void;
  onSave: (t: TourPackage) => void;
}) {
  const accommodations = useAccommodations();
  const allTours = useTours();
  const [form, setForm] = useState<TourFormState>(() =>
    tour ? tourToForm(tour) : emptyTourForm()
  );
  const [tab, setTab] = useState("basic");

  const update = <K extends keyof TourFormState>(
    key: K,
    value: TourFormState[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const addDay = () =>
    setForm((f) => ({
      ...f,
      days: [
        ...f.days,
        {
          day: `Day ${String(f.days.length + 1).padStart(2, "0")}`,
          title: "",
          description: "",
          image: "",
        },
      ],
    }));

  const updateDay = (i: number, patch: Partial<DayItem>) =>
    setForm((f) => ({
      ...f,
      days: f.days.map((d, idx) => (idx === i ? { ...d, ...patch } : d)),
    }));

  const removeDay = (i: number) =>
    setForm((f) => ({ ...f, days: f.days.filter((_, idx) => idx !== i) }));

  const moveDay = (i: number, dir: -1 | 1) =>
    setForm((f) => {
      const j = i + dir;
      if (j < 0 || j >= f.days.length) return f;
      const days = [...f.days];
      const tmp = days[i];
      days[i] = days[j];
      days[j] = tmp;
      return { ...f, days };
    });

  const toggleAccommodation = (id: string) =>
    setForm((f) => ({
      ...f,
      accommodationIds: f.accommodationIds.includes(id)
        ? f.accommodationIds.filter((x) => x !== id)
        : [...f.accommodationIds, id],
    }));

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Tour name is required");
      setTab("basic");
      return;
    }
    const id = tour?.id ?? generateId("tour");
    onSave(formToTour(form, id));
  };

  const galleryUrls = splitLines(form.galleryImages);

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="flex flex-col p-0 gap-0 max-h-[90vh] max-w-4xl"
        style={sharp}
      >
        <DialogHeader className="p-5 border-b border-charcoal/10 flex-shrink-0 text-left">
          <DialogTitle
            className="text-2xl"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            {tour ? "Edit Tour" : "New Tour"}
          </DialogTitle>
          <DialogDescription>
            Fill out the form below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={setTab}
          className={tabsWrapperClass}
          style={tabsWrapperStyle}
        >
          <TabsList className="bg-cream border-b border-charcoal/10 rounded-none h-auto p-0 flex-shrink-0 flex-wrap rounded-none">
            {[
              { id: "basic", label: "Basic Info" },
              { id: "images", label: "Images" },
              { id: "itinerary", label: "Itinerary" },
              { id: "inclusions", label: "Included/Excluded" },
              { id: "accommodations", label: "Accommodations" },
              { id: "map", label: "Map" },
            ].map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-[11px] uppercase tracking-wider"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="modal-scroll p-5" style={modalScrollStyle}>
            <TabsContent value="basic" className="mt-0">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Name *">
                  <TextInput
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="The Migration Symphony"
                  />
                </Field>
                <Field label="Subtitle">
                  <TextInput
                    value={form.subtitle}
                    onChange={(e) => update("subtitle", e.target.value)}
                    placeholder="Tanzania & Kenya · September–October"
                  />
                </Field>
                <Field label="Destination">
                  <TextInput
                    value={form.destination}
                    onChange={(e) => update("destination", e.target.value)}
                    placeholder="Tanzania"
                  />
                </Field>
                <Field label="National Park">
                  <TextInput
                    value={form.nationalPark}
                    onChange={(e) => update("nationalPark", e.target.value)}
                    placeholder="Serengeti National Park"
                  />
                </Field>
                <Field label="Duration (label)">
                  <TextInput
                    value={form.duration}
                    onChange={(e) => update("duration", e.target.value)}
                    placeholder="12 Days"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Duration Days">
                    <TextInput
                      type="number"
                      value={form.durationDays}
                      onChange={(e) =>
                        update(
                          "durationDays",
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </Field>
                  <Field label="Nights">
                    <TextInput
                      type="number"
                      value={form.durationNights}
                      onChange={(e) =>
                        update(
                          "durationNights",
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </Field>
                </div>
                <Field label="Price (label)">
                  <TextInput
                    value={form.price}
                    onChange={(e) => update("price", e.target.value)}
                    placeholder="From $78,500 per person"
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Price From ($)" hint="Per-person numeric">
                    <TextInput
                      type="number"
                      value={form.priceFrom}
                      onChange={(e) =>
                        update(
                          "priceFrom",
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </Field>
                  <Field label="Original Price" hint="For discount badge">
                    <TextInput
                      type="number"
                      value={form.priceOriginal}
                      onChange={(e) =>
                        update(
                          "priceOriginal",
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </Field>
                </div>
                <Field label="Trip Type">
                  <Select
                    value={form.tripType}
                    onChange={(e) => update("tripType", e.target.value)}
                  >
                    {TRIP_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Accommodation Level">
                  <Select
                    value={form.accommodationLevel}
                    onChange={(e) => update("accommodationLevel", e.target.value)}
                  >
                    {ACCOMMODATION_LEVELS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Minimum Age">
                  <TextInput
                    type="number"
                    value={form.minAge}
                    onChange={(e) =>
                      update(
                        "minAge",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Highlights" hint="One per line">
                    <TextArea
                      rows={5}
                      value={form.highlights}
                      onChange={(e) => update("highlights", e.target.value)}
                      placeholder={
                        "Hot air balloon flight over the Mara River\nWalking safari with a Hadzabe bushman"
                      }
                    />
                  </Field>
                </div>
                <div className="md:col-span-2">
                  <Field label="Activities" hint="One per line (optional)">
                    <TextArea
                      rows={3}
                      value={form.activities}
                      onChange={(e) => update("activities", e.target.value)}
                      placeholder={"Game Drives\nWalking Safaris"}
                    />
                  </Field>
                </div>
                <div className="md:col-span-2 pt-2">
                  <Toggle
                    checked={form.featured}
                    onChange={(v) => {
                      if (v && !form.featured) {
                        const currentFeatured = allTours.filter((t) => t.featured && t.id !== tour?.id);
                        if (currentFeatured.length >= 3) {
                          toast.warning("You already have 3 featured trips on the homepage. Unfeature one first before featuring another.");
                          return;
                        }
                      }
                      update("featured", v);
                    }}
                    label="Show as featured tour on homepage (max 3)"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images" className="mt-0 space-y-4">
              <Field
                label="Hero Image URL"
                hint="Used as the main cover image"
              >
                <TextInput
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                />
                <ImagePreview url={form.image} alt={form.name} />
              </Field>
              <Field label="Gallery Images" hint="One URL per line">
                <TextArea
                  rows={6}
                  value={form.galleryImages}
                  onChange={(e) => update("galleryImages", e.target.value)}
                  placeholder={"https://...\nhttps://..."}
                />
              </Field>
              {galleryUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {galleryUrls.map((url, i) => (
                    <div
                      key={i}
                      className="aspect-video overflow-hidden border border-charcoal/10"
                      style={sharp}
                    >
                      <Img
                        src={url}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="itinerary" className="mt-0 space-y-3">
              {form.days.map((day, i) => (
                <div
                  key={i}
                  className="border border-charcoal/10 p-4 bg-cream"
                  style={sharp}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Stop {i + 1}
                    </span>
                    <div className="flex gap-1">
                      <IconBtn
                        icon={ChevronUp}
                        label="Move up"
                        onClick={() => moveDay(i, -1)}
                      />
                      <IconBtn
                        icon={ChevronDown}
                        label="Move down"
                        onClick={() => moveDay(i, 1)}
                      />
                      <IconBtn
                        icon={Trash2}
                        label="Remove"
                        variant="danger"
                        onClick={() => removeDay(i)}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Field label="Day Label">
                      <TextInput
                        value={day.day}
                        onChange={(e) =>
                          updateDay(i, { day: e.target.value })
                        }
                        placeholder="Day 01"
                      />
                    </Field>
                    <Field label="Title">
                      <TextInput
                        value={day.title}
                        onChange={(e) =>
                          updateDay(i, { title: e.target.value })
                        }
                        placeholder="Arrival · Arusha Coffee Lodge"
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Description">
                      <TextArea
                        rows={3}
                        value={day.description}
                        onChange={(e) =>
                          updateDay(i, { description: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Image URL">
                      <TextInput
                        value={day.image}
                        onChange={(e) =>
                          updateDay(i, { image: e.target.value })
                        }
                        placeholder="https://..."
                      />
                      <ImagePreview url={day.image} alt={day.title} />
                    </Field>
                  </div>
                </div>
              ))}
              <button
                onClick={addDay}
                className="w-full py-3 border border-dashed border-charcoal/20 hover:border-gold hover:bg-cream transition-colors text-sm text-muted-foreground inline-flex items-center justify-center gap-2"
                style={sharp}
              >
                <Plus className="w-4 h-4" /> Add Day
              </button>
            </TabsContent>

            <TabsContent value="inclusions" className="mt-0 space-y-4">
              <Field label="What's Included" hint="One per line">
                <TextArea
                  rows={6}
                  value={form.inclusions}
                  onChange={(e) => update("inclusions", e.target.value)}
                  placeholder={
                    "All meals and drinks\nPrivate guide and 4x4 vehicle\nPark fees"
                  }
                />
              </Field>
              <Field label="What's Excluded" hint="One per line">
                <TextArea
                  rows={6}
                  value={form.exclusions}
                  onChange={(e) => update("exclusions", e.target.value)}
                  placeholder={
                    "International airfare\nVisa fees\nGratuities"
                  }
                />
              </Field>
            </TabsContent>

            <TabsContent value="accommodations" className="mt-0">
              <p className="text-sm text-muted-foreground mb-4">
                Select the accommodations featured on this tour.
              </p>
              {accommodations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No accommodations available. Add accommodations first.
                </p>
              ) : (
                <div className="grid md:grid-cols-2 gap-3">
                  {accommodations.map((a) => {
                    const checked = form.accommodationIds.includes(a.id);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => toggleAccommodation(a.id)}
                        className={`flex items-center gap-3 p-3 border text-left transition-colors ${
                          checked
                            ? "border-gold bg-gold/5"
                            : "border-charcoal/10 hover:bg-cream"
                        }`}
                        style={sharp}
                      >
                        <div
                          className="w-12 h-12 overflow-hidden bg-charcoal/5 flex-shrink-0"
                          style={sharp}
                        >
                          {a.image && (
                            <Img
                              src={a.image}
                              alt={a.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-charcoal truncate">
                            {a.name}
                          </p>
                          <p className="text-xs text-muted-foreground truncate">
                            {a.location}
                          </p>
                        </div>
                        <div
                          className={`w-5 h-5 border flex items-center justify-center flex-shrink-0 ${
                            checked
                              ? "bg-gold border-gold"
                              : "border-charcoal/30"
                          }`}
                          style={sharp}
                        >
                          {checked && <Check className="w-3 h-3 text-cream" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </TabsContent>

            <TabsContent value="map" className="mt-0">
              <Field
                label="Google Maps Embed URL"
                hint="The full iframe src URL from Google Maps → Share → Embed a map"
              >
                <TextInput
                  value={form.mapEmbed}
                  onChange={(e) => update("mapEmbed", e.target.value)}
                  placeholder="https://www.google.com/maps/embed?pb=..."
                />
              </Field>
              {form.mapEmbed && (
                <div
                  className="mt-4 overflow-hidden border border-charcoal/10"
                  style={sharp}
                >
                  <iframe
                    src={form.mapEmbed}
                    className="w-full h-64"
                    title="Map preview"
                    loading="lazy"
                  />
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="p-4 border-t border-charcoal/10 flex-shrink-0 justify-end gap-2">
          <CancelButton onClick={onClose} />
          <SaveButton
            onClick={handleSubmit}
            label={tour ? "Update Tour" : "Create Tour"}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
 * Accommodations
 * ============================================================ */
function emptyAccommodationForm(): AccommodationFormState {
  return {
    name: "",
    location: "",
    type: ACCOMMODATION_TYPES[0],
    description: "",
    image: "",
    galleryImages: "",
    features: "",
    pricePerNight: "",
  };
}

function accToForm(a: Accommodation): AccommodationFormState {
  return {
    name: a.name,
    location: a.location,
    type: a.type,
    description: a.description,
    image: a.image,
    galleryImages: joinLines(a.galleryImages),
    features: joinLines(a.features),
    pricePerNight: a.pricePerNight,
  };
}

function formToAcc(
  form: AccommodationFormState,
  id: string
): Accommodation {
  return {
    id,
    name: form.name.trim(),
    location: form.location,
    type: form.type,
    description: form.description,
    image: form.image,
    galleryImages: splitLines(form.galleryImages),
    features: splitLines(form.features),
    pricePerNight: form.pricePerNight,
  };
}

function AccommodationsSection() {
  const accommodations = useAccommodations();
  const [editing, setEditing] = useState<Accommodation | "new" | null>(null);

  const handleSave = (data: Accommodation) => {
    if (editing === "new") {
      store.setAccommodations([data, ...accommodations]);
      toast.success("Accommodation created");
    } else {
      store.setAccommodations(
        accommodations.map((a) => (a.id === data.id ? data : a))
      );
      toast.success("Accommodation updated");
    }
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this accommodation?")) return;
    store.setAccommodations(accommodations.filter((a) => a.id !== id));
    toast.success("Accommodation deleted");
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="MANAGE"
        title="Accommodations"
        action={
          <PrimaryButton
            label="Add Accommodation"
            icon={Plus}
            onClick={() => setEditing("new")}
          />
        }
      />

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream border-b border-charcoal/10">
                {["Property", "Location", "Type", "Price/Night", "Actions"].map(
                  (h, i) => (
                    <th
                      key={h}
                      className={`px-4 py-3 font-medium uppercase tracking-wider text-[11px] text-muted-foreground ${
                        i === 4 ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {accommodations.map((a) => (
                <tr
                  key={a.id}
                  className="border-b border-charcoal/5 hover:bg-cream/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 overflow-hidden bg-charcoal/5 flex-shrink-0"
                        style={sharp}
                      >
                        {a.image && (
                          <Img
                            src={a.image}
                            alt={a.name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <span className="font-medium text-charcoal">{a.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-charcoal/70">{a.location}</td>
                  <td className="px-4 py-3 text-charcoal/70">{a.type}</td>
                  <td className="px-4 py-3 text-charcoal/70">
                    {a.pricePerNight}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <IconBtn
                        icon={Pencil}
                        label="Edit"
                        onClick={() => setEditing(a)}
                      />
                      <IconBtn
                        icon={Trash2}
                        label="Delete"
                        variant="danger"
                        onClick={() => handleDelete(a.id)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
              {accommodations.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-12 text-center text-muted-foreground">
                    No accommodations yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {editing !== null && (
        <AccommodationFormModal
          acc={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function AccommodationFormModal({
  acc,
  onClose,
  onSave,
}: {
  acc: Accommodation | null;
  onClose: () => void;
  onSave: (a: Accommodation) => void;
}) {
  const [form, setForm] = useState<AccommodationFormState>(() =>
    acc ? accToForm(acc) : emptyAccommodationForm()
  );

  const update = <K extends keyof AccommodationFormState>(
    key: K,
    value: AccommodationFormState[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Property name is required");
      return;
    }
    const id = acc?.id ?? generateId("acc");
    onSave(formToAcc(form, id));
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="flex flex-col p-0 gap-0 max-h-[90vh] max-w-2xl"
        style={sharp}
      >
        <DialogHeader className="p-5 border-b border-charcoal/10 flex-shrink-0 text-left">
          <DialogTitle
            className="text-2xl"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            {acc ? "Edit Accommodation" : "New Accommodation"}
          </DialogTitle>
          <DialogDescription>
            Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="modal-scroll p-5" style={modalScrollStyle}>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Name *">
              <TextInput
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Singita Pamushana"
              />
            </Field>
            <Field label="Location">
              <TextInput
                value={form.location}
                onChange={(e) => update("location", e.target.value)}
                placeholder="Malilangwe, Zimbabwe"
              />
            </Field>
            <Field label="Type">
              <Select
                value={form.type}
                onChange={(e) => update("type", e.target.value)}
              >
                {ACCOMMODATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Price Per Night (label)">
              <TextInput
                value={form.pricePerNight}
                onChange={(e) => update("pricePerNight", e.target.value)}
                placeholder="From $4,800"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Description">
                <TextArea
                  rows={4}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Main Image URL">
                <TextInput
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                  placeholder="https://..."
                />
                <ImagePreview url={form.image} alt={form.name} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Gallery Images" hint="One URL per line">
                <TextArea
                  rows={4}
                  value={form.galleryImages}
                  onChange={(e) => update("galleryImages", e.target.value)}
                  placeholder={"https://...\nhttps://..."}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Features" hint="One per line">
                <TextArea
                  rows={4}
                  value={form.features}
                  onChange={(e) => update("features", e.target.value)}
                  placeholder={"Private plunge pool\nWine cellar"}
                />
              </Field>
            </div>
          </div>
        </div>
        <DialogFooter className="p-4 border-t border-charcoal/10 flex-shrink-0 justify-end gap-2">
          <CancelButton onClick={onClose} />
          <SaveButton
            onClick={handleSubmit}
            label={acc ? "Update" : "Create"}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
 * Scheduled Trips
 * ============================================================ */
function emptyTripForm(): ScheduledTripFormState {
  return {
    name: "",
    destination: "",
    description: "",
    highlights: "",
    groupSize: "",
    spotsLeft: "",
    accommodationLevel: ACCOMMODATION_LEVELS[0],
    startDate: "",
    endDate: "",
    durationDays: "",
    priceFrom: "",
    priceOriginal: "",
    image: "",
    galleryImages: "",
    inclusions: "",
    exclusions: "",
    stops: [],
  };
}

function tripToForm(t: ScheduledTrip): ScheduledTripFormState {
  return {
    name: t.name,
    destination: t.destination,
    description: t.description,
    highlights: joinLines(t.highlights),
    groupSize: t.groupSize,
    spotsLeft: t.spotsLeft,
    accommodationLevel: t.accommodationLevel,
    startDate: t.startDate,
    endDate: t.endDate,
    durationDays: t.durationDays,
    priceFrom: t.priceFrom,
    priceOriginal: numOrEmpty(t.priceOriginal),
    image: t.image,
    galleryImages: joinLines(t.galleryImages),
    inclusions: joinLines(t.inclusions),
    exclusions: joinLines(t.exclusions),
    stops: (t.stops ?? []).map((s) => ({ ...s })),
  };
}

function formToTrip(
  form: ScheduledTripFormState,
  id: string
): ScheduledTrip {
  return {
    id,
    name: form.name.trim(),
    destination: form.destination,
    description: form.description,
    highlights: splitLines(form.highlights),
    groupSize: form.groupSize,
    spotsLeft:
      typeof form.spotsLeft === "number"
        ? form.spotsLeft
        : Number(form.spotsLeft) || 0,
    accommodationLevel: form.accommodationLevel,
    startDate: form.startDate,
    endDate: form.endDate,
    durationDays:
      typeof form.durationDays === "number"
        ? form.durationDays
        : Number(form.durationDays) || 0,
    priceFrom:
      typeof form.priceFrom === "number"
        ? form.priceFrom
        : Number(form.priceFrom) || 0,
    priceOriginal:
      form.priceOriginal === "" ? undefined : Number(form.priceOriginal),
    image: form.image,
    galleryImages: splitLines(form.galleryImages),
    inclusions: splitLines(form.inclusions),
    exclusions: splitLines(form.exclusions),
    stops: form.stops,
  };
}

function ScheduledTripsSection() {
  const trips = useScheduledTrips();
  const [editing, setEditing] = useState<ScheduledTrip | "new" | null>(null);

  const handleSave = (data: ScheduledTrip) => {
    if (editing === "new") {
      store.setScheduledTrips([data, ...trips]);
      toast.success("Scheduled trip created");
    } else {
      store.setScheduledTrips(
        trips.map((t) => (t.id === data.id ? data : t))
      );
      toast.success("Scheduled trip updated");
    }
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this scheduled trip?")) return;
    store.setScheduledTrips(trips.filter((t) => t.id !== id));
    toast.success("Scheduled trip deleted");
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="MANAGE"
        title="Scheduled Trips"
        action={
          <PrimaryButton
            label="Add Trip"
            icon={Plus}
            onClick={() => setEditing("new")}
          />
        }
      />

      <Panel className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-cream border-b border-charcoal/10">
                {[
                  "Trip",
                  "Destination",
                  "Dates",
                  "Duration",
                  "Price",
                  "Spots",
                  "Actions",
                ].map((h, i, arr) => (
                  <th
                    key={h}
                    className={`px-4 py-3 font-medium uppercase tracking-wider text-[11px] text-muted-foreground ${
                      i === arr.length - 1 ? "text-right" : "text-left"
                    }`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {trips.map((t) => {
                const low = t.spotsLeft <= 2;
                const mid = t.spotsLeft > 2 && t.spotsLeft <= 5;
                return (
                  <tr
                    key={t.id}
                    className="border-b border-charcoal/5 hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-12 h-12 overflow-hidden bg-charcoal/5 flex-shrink-0"
                          style={sharp}
                        >
                          {t.image && (
                            <Img
                              src={t.image}
                              alt={t.name}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>
                        <span className="font-medium text-charcoal">
                          {t.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">
                      {t.destination}
                    </td>
                    <td className="px-4 py-3 text-charcoal/70 text-xs">
                      {t.startDate}
                      <br />
                      {t.endDate}
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">
                      {t.durationDays}d
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-charcoal">
                          ${t.priceFrom.toLocaleString()}
                        </span>
                        {t.priceOriginal && (
                          <span
                            className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-800"
                            style={sharp}
                          >
                            -${(t.priceOriginal - t.priceFrom).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border ${
                          low
                            ? "bg-red-100 text-red-800 border-red-200"
                            : mid
                            ? "bg-amber-100 text-amber-800 border-amber-200"
                            : "bg-emerald-100 text-emerald-800 border-emerald-200"
                        }`}
                        style={sharp}
                      >
                        {t.spotsLeft} left
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <IconBtn
                          icon={Pencil}
                          label="Edit"
                          onClick={() => setEditing(t)}
                        />
                        <IconBtn
                          icon={Trash2}
                          label="Delete"
                          variant="danger"
                          onClick={() => handleDelete(t.id)}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
              {trips.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    No scheduled trips yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Panel>

      {editing !== null && (
        <ScheduledTripFormModal
          trip={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ScheduledTripFormModal({
  trip,
  onClose,
  onSave,
}: {
  trip: ScheduledTrip | null;
  onClose: () => void;
  onSave: (t: ScheduledTrip) => void;
}) {
  const [form, setForm] = useState<ScheduledTripFormState>(() =>
    trip ? tripToForm(trip) : emptyTripForm()
  );
  const [tab, setTab] = useState("basic");

  const update = <K extends keyof ScheduledTripFormState>(
    key: K,
    value: ScheduledTripFormState[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const addStop = () =>
    setForm((f) => ({
      ...f,
      stops: [
        ...f.stops,
        {
          day: `Day ${String(f.stops.length + 1).padStart(2, "0")}`,
          title: "",
          description: "",
          image: "",
        },
      ],
    }));

  const updateStop = (i: number, patch: Partial<DayItem>) =>
    setForm((f) => ({
      ...f,
      stops: f.stops.map((s, idx) => (idx === i ? { ...s, ...patch } : s)),
    }));

  const removeStop = (i: number) =>
    setForm((f) => ({
      ...f,
      stops: f.stops.filter((_, idx) => idx !== i),
    }));

  const moveStop = (i: number, dir: -1 | 1) =>
    setForm((f) => {
      const j = i + dir;
      if (j < 0 || j >= f.stops.length) return f;
      const stops = [...f.stops];
      const tmp = stops[i];
      stops[i] = stops[j];
      stops[j] = tmp;
      return { ...f, stops };
    });

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Trip name is required");
      setTab("basic");
      return;
    }
    const id = trip?.id ?? generateId("st");
    onSave(formToTrip(form, id));
  };

  const galleryUrls = splitLines(form.galleryImages);

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="flex flex-col p-0 gap-0 max-h-[90vh] max-w-4xl"
        style={sharp}
      >
        <DialogHeader className="p-5 border-b border-charcoal/10 flex-shrink-0 text-left">
          <DialogTitle
            className="text-2xl"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            {trip ? "Edit Scheduled Trip" : "New Scheduled Trip"}
          </DialogTitle>
          <DialogDescription>
            Fill out the form below. Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={tab}
          onValueChange={setTab}
          className={tabsWrapperClass}
          style={tabsWrapperStyle}
        >
          <TabsList className="bg-cream border-b border-charcoal/10 rounded-none h-auto p-0 flex-shrink-0 flex-wrap rounded-none">
            {[
              { id: "basic", label: "Basic Info" },
              { id: "schedule", label: "Schedule" },
              { id: "itinerary", label: "Itinerary" },
              { id: "inclusions", label: "Included/Excluded" },
              { id: "images", label: "Images" },
            ].map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-[11px] uppercase tracking-wider"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="modal-scroll p-5" style={modalScrollStyle}>
            <TabsContent value="basic" className="mt-0">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Name *">
                  <TextInput
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Migration River Crossing"
                  />
                </Field>
                <Field label="Destination">
                  <TextInput
                    value={form.destination}
                    onChange={(e) => update("destination", e.target.value)}
                    placeholder="Tanzania"
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Description">
                    <TextArea
                      rows={4}
                      value={form.description}
                      onChange={(e) => update("description", e.target.value)}
                    />
                  </Field>
                </div>
                <Field label="Accommodation Level">
                  <Select
                    value={form.accommodationLevel}
                    onChange={(e) => update("accommodationLevel", e.target.value)}
                  >
                    {ACCOMMODATION_LEVELS.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </Select>
                </Field>
                <Field label="Group Size">
                  <TextInput
                    value={form.groupSize}
                    onChange={(e) => update("groupSize", e.target.value)}
                    placeholder="Max 12 guests"
                  />
                </Field>
                <Field label="Spots Left">
                  <TextInput
                    type="number"
                    value={form.spotsLeft}
                    onChange={(e) =>
                      update(
                        "spotsLeft",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </Field>
                <div className="md:col-span-2">
                  <Field label="Highlights" hint="One per line">
                    <TextArea
                      rows={4}
                      value={form.highlights}
                      onChange={(e) => update("highlights", e.target.value)}
                      placeholder={"Mara River crossing viewings\nWalking safari"}
                    />
                  </Field>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="schedule" className="mt-0">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Start Date">
                  <TextInput
                    type="date"
                    value={form.startDate}
                    onChange={(e) => update("startDate", e.target.value)}
                  />
                </Field>
                <Field label="End Date">
                  <TextInput
                    type="date"
                    value={form.endDate}
                    onChange={(e) => update("endDate", e.target.value)}
                  />
                </Field>
                <Field label="Duration Days">
                  <TextInput
                    type="number"
                    value={form.durationDays}
                    onChange={(e) =>
                      update(
                        "durationDays",
                        e.target.value === "" ? "" : Number(e.target.value)
                      )
                    }
                  />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Price From ($)">
                    <TextInput
                      type="number"
                      value={form.priceFrom}
                      onChange={(e) =>
                        update(
                          "priceFrom",
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </Field>
                  <Field label="Original Price" hint="For discount badge">
                    <TextInput
                      type="number"
                      value={form.priceOriginal}
                      onChange={(e) =>
                        update(
                          "priceOriginal",
                          e.target.value === "" ? "" : Number(e.target.value)
                        )
                      }
                    />
                  </Field>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="itinerary" className="mt-0 space-y-3">
              {form.stops.map((stop, i) => (
                <div
                  key={i}
                  className="border border-charcoal/10 p-4 bg-cream"
                  style={sharp}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      Stop {i + 1}
                    </span>
                    <div className="flex gap-1">
                      <IconBtn
                        icon={ChevronUp}
                        label="Move up"
                        onClick={() => moveStop(i, -1)}
                      />
                      <IconBtn
                        icon={ChevronDown}
                        label="Move down"
                        onClick={() => moveStop(i, 1)}
                      />
                      <IconBtn
                        icon={Trash2}
                        label="Remove"
                        variant="danger"
                        onClick={() => removeStop(i)}
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Field label="Day Label">
                      <TextInput
                        value={stop.day}
                        onChange={(e) =>
                          updateStop(i, { day: e.target.value })
                        }
                      />
                    </Field>
                    <Field label="Title">
                      <TextInput
                        value={stop.title}
                        onChange={(e) =>
                          updateStop(i, { title: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Description">
                      <TextArea
                        rows={3}
                        value={stop.description}
                        onChange={(e) =>
                          updateStop(i, { description: e.target.value })
                        }
                      />
                    </Field>
                  </div>
                  <div className="mt-3">
                    <Field label="Image URL">
                      <TextInput
                        value={stop.image}
                        onChange={(e) =>
                          updateStop(i, { image: e.target.value })
                        }
                        placeholder="https://..."
                      />
                      <ImagePreview url={stop.image} alt={stop.title} />
                    </Field>
                  </div>
                </div>
              ))}
              <button
                onClick={addStop}
                className="w-full py-3 border border-dashed border-charcoal/20 hover:border-gold hover:bg-cream transition-colors text-sm text-muted-foreground inline-flex items-center justify-center gap-2"
                style={sharp}
              >
                <Plus className="w-4 h-4" /> Add Stop
              </button>
            </TabsContent>

            <TabsContent value="inclusions" className="mt-0 space-y-4">
              <Field label="What's Included" hint="One per line">
                <TextArea
                  rows={6}
                  value={form.inclusions}
                  onChange={(e) => update("inclusions", e.target.value)}
                />
              </Field>
              <Field label="What's Excluded" hint="One per line">
                <TextArea
                  rows={6}
                  value={form.exclusions}
                  onChange={(e) => update("exclusions", e.target.value)}
                />
              </Field>
            </TabsContent>

            <TabsContent value="images" className="mt-0 space-y-4">
              <Field label="Hero Image URL">
                <TextInput
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                  placeholder="https://..."
                />
                <ImagePreview url={form.image} alt={form.name} />
              </Field>
              <Field label="Gallery Images" hint="One URL per line">
                <TextArea
                  rows={4}
                  value={form.galleryImages}
                  onChange={(e) => update("galleryImages", e.target.value)}
                />
              </Field>
              {galleryUrls.length > 0 && (
                <div className="grid grid-cols-3 gap-2">
                  {galleryUrls.map((url, i) => (
                    <div
                      key={i}
                      className="aspect-video overflow-hidden border border-charcoal/10"
                      style={sharp}
                    >
                      <Img
                        src={url}
                        alt={`Gallery ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>

        <DialogFooter className="p-4 border-t border-charcoal/10 flex-shrink-0 justify-end gap-2">
          <CancelButton onClick={onClose} />
          <SaveButton
            onClick={handleSubmit}
            label={trip ? "Update Trip" : "Create Trip"}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
 * Destinations
 * ============================================================ */
function emptyDestinationForm(): DestinationFormState {
  return {
    name: "",
    country: "",
    tagline: "",
    description: "",
    image: "",
    imagePortrait: "",
    days: "",
    price: "",
  };
}

function destToForm(d: Destination): DestinationFormState {
  return {
    name: d.name,
    country: d.country,
    tagline: d.tagline,
    description: d.description,
    image: d.image,
    imagePortrait: d.imagePortrait,
    days: d.days,
    price: d.price,
  };
}

function formToDest(
  form: DestinationFormState,
  id: string
): Destination {
  return {
    id,
    name: form.name.trim(),
    country: form.country,
    tagline: form.tagline,
    description: form.description,
    image: form.image,
    imagePortrait: form.imagePortrait,
    days: form.days,
    price: form.price,
  };
}

function DestinationsSection() {
  const destinations = useDestinations();
  const [editing, setEditing] = useState<Destination | "new" | null>(null);

  const handleSave = (data: Destination) => {
    if (editing === "new") {
      store.setDestinations([data, ...destinations]);
      toast.success("Destination created");
    } else {
      store.setDestinations(
        destinations.map((d) => (d.id === data.id ? data : d))
      );
      toast.success("Destination updated");
    }
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this destination?")) return;
    store.setDestinations(destinations.filter((d) => d.id !== id));
    toast.success("Destination deleted");
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="MANAGE"
        title="Destinations"
        action={
          <PrimaryButton
            label="Add Destination"
            icon={Plus}
            onClick={() => setEditing("new")}
          />
        }
      />

      {destinations.length === 0 ? (
        <Panel>
          <EmptyState
            title="No destinations yet"
            message="Add your first destination to showcase on the site."
          />
        </Panel>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {destinations.map((d) => (
            <div
              key={d.id}
              className="bg-alabaster border border-charcoal/10 overflow-hidden group"
              style={sharp}
            >
              <div className="aspect-[4/3] overflow-hidden bg-charcoal/5 relative">
                {d.image && (
                  <Img
                    src={d.image}
                    alt={d.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute top-3 right-3 flex gap-1">
                  <button
                    onClick={() => setEditing(d)}
                    aria-label="Edit"
                    title="Edit"
                    className="p-2 bg-cream/90 text-charcoal hover:bg-cream"
                    style={sharp}
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(d.id)}
                    aria-label="Delete"
                    title="Delete"
                    className="p-2 bg-cream/90 text-red-700 hover:bg-cream"
                    style={sharp}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="p-5">
                <p className="text-[10px] uppercase tracking-wider text-gold mb-1">
                  {d.country}
                </p>
                <h3
                  className="text-xl mb-1"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  {d.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3">{d.tagline}</p>
                <div className="flex items-center justify-between text-xs text-charcoal/70">
                  <span>{d.days}</span>
                  <span className="font-medium">{d.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <DestinationFormModal
          dest={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function DestinationFormModal({
  dest,
  onClose,
  onSave,
}: {
  dest: Destination | null;
  onClose: () => void;
  onSave: (d: Destination) => void;
}) {
  const [form, setForm] = useState<DestinationFormState>(() =>
    dest ? destToForm(dest) : emptyDestinationForm()
  );

  const update = <K extends keyof DestinationFormState>(
    key: K,
    value: DestinationFormState[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Destination name is required");
      return;
    }
    const id = dest?.id ?? generateId("dest");
    onSave(formToDest(form, id));
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="flex flex-col p-0 gap-0 max-h-[90vh] max-w-2xl"
        style={sharp}
      >
        <DialogHeader className="p-5 border-b border-charcoal/10 flex-shrink-0 text-left">
          <DialogTitle
            className="text-2xl"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            {dest ? "Edit Destination" : "New Destination"}
          </DialogTitle>
          <DialogDescription>
            Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="modal-scroll p-5" style={modalScrollStyle}>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Name *">
              <TextInput
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Serengeti"
              />
            </Field>
            <Field label="Country">
              <TextInput
                value={form.country}
                onChange={(e) => update("country", e.target.value)}
                placeholder="Tanzania"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Tagline">
                <TextInput
                  value={form.tagline}
                  onChange={(e) => update("tagline", e.target.value)}
                  placeholder="The Great Migration"
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Description">
                <TextArea
                  rows={5}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Image URL (landscape)">
                <TextInput
                  value={form.image}
                  onChange={(e) => update("image", e.target.value)}
                  placeholder="https://..."
                />
                <ImagePreview url={form.image} alt={form.name} />
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Portrait Image URL">
                <TextInput
                  value={form.imagePortrait}
                  onChange={(e) => update("imagePortrait", e.target.value)}
                  placeholder="https://..."
                />
                <ImagePreview url={form.imagePortrait} alt={`${form.name} portrait`} />
              </Field>
            </div>
            <Field label="Days (label)">
              <TextInput
                value={form.days}
                onChange={(e) => update("days", e.target.value)}
                placeholder="8 Days"
              />
            </Field>
            <Field label="Price (label)">
              <TextInput
                value={form.price}
                onChange={(e) => update("price", e.target.value)}
                placeholder="From $48,500"
              />
            </Field>
          </div>
        </div>
        <DialogFooter className="p-4 border-t border-charcoal/10 flex-shrink-0 justify-end gap-2">
          <CancelButton onClick={onClose} />
          <SaveButton
            onClick={handleSubmit}
            label={dest ? "Update" : "Create"}
          />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
 * Quote Requests
 * ============================================================ */
function QuotesSection() {
  const quotes = useQuotes();
  const [viewing, setViewing] = useState<QuoteRequest | null>(null);

  const handleStatusChange = (id: string, status: QuoteRequest["status"]) => {
    store.updateQuote(id, { status });
    toast.success(`Marked as ${status}`);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this quote request?")) return;
    store.deleteQuote(id);
    toast.success("Quote request deleted");
    setViewing(null);
  };

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="INBOX" title="Quote Requests" />

      {quotes.length === 0 ? (
        <Panel>
          <EmptyState
            title="No quote requests yet"
            message="When visitors submit the quote form, their requests will appear here."
          />
        </Panel>
      ) : (
        <Panel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream border-b border-charcoal/10">
                  {["Name", "Tour", "Travelers", "Dates", "Budget", "Status", "Actions"].map(
                    (h, i, arr) => (
                      <th
                        key={h}
                        className={`px-4 py-3 font-medium uppercase tracking-wider text-[11px] text-muted-foreground ${
                          i === arr.length - 1 ? "text-right" : "text-left"
                        }`}
                      >
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {quotes.map((q) => (
                  <tr
                    key={q.id}
                    className="border-b border-charcoal/5 hover:bg-cream/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">{q.name}</p>
                      <p className="text-xs text-muted-foreground">{q.email}</p>
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">
                      {q.destination}
                      <span className="block text-xs text-muted-foreground">
                        {q.duration}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">{q.travellers}</td>
                    <td className="px-4 py-3 text-charcoal/70 text-xs">
                      {q.startDate ? q.startDate : "—"}
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">{q.budget}</td>
                    <td className="px-4 py-3">
                      <Select
                        value={q.status}
                        onChange={(e) =>
                          handleStatusChange(
                            q.id,
                            e.target.value as QuoteRequest["status"]
                          )
                        }
                        className="h-8 text-xs"
                      >
                        <option value="new">New</option>
                        <option value="in-review">In Review</option>
                        <option value="quoted">Quoted</option>
                        <option value="closed">Closed</option>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <IconBtn
                          icon={Eye}
                          label="View"
                          onClick={() => setViewing(q)}
                        />
                        <IconBtn
                          icon={Trash2}
                          label="Delete"
                          variant="danger"
                          onClick={() => handleDelete(q.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Dialog open={viewing !== null} onOpenChange={(o) => { if (!o) setViewing(null); }}>
        <DialogContent
          className="flex flex-col p-0 gap-0 max-h-[90vh] max-w-2xl"
          style={sharp}
        >
          {viewing && (
            <>
              <DialogHeader className="p-5 border-b border-charcoal/10 flex-shrink-0 text-left">
                <DialogTitle
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  {viewing.name}
                </DialogTitle>
                <DialogDescription>
                  Submitted {new Date(viewing.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="modal-scroll p-5" style={modalScrollStyle}>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  <Detail label="Email" value={viewing.email} />
                  <Detail label="Phone" value={viewing.phone || "—"} />
                  <Detail label="Destination" value={viewing.destination} />
                  <Detail label="Duration" value={viewing.duration} />
                  <Detail label="Travelers" value={viewing.travellers} />
                  <Detail
                    label="Start Date"
                    value={viewing.startDate || "—"}
                  />
                  <Detail label="Budget" value={viewing.budget} />
                  <Detail
                    label="Status"
                    value={<QuoteStatusBadge status={viewing.status} />}
                  />
                  <div className="col-span-2">
                    <Detail
                      label="Interests"
                      value={viewing.interests.join(", ") || "—"}
                    />
                  </div>
                  {viewing.notes && (
                    <div className="col-span-2">
                      <Detail label="Notes" value={viewing.notes} />
                    </div>
                  )}
                </dl>
              </div>
              <DialogFooter className="p-4 border-t border-charcoal/10 flex-shrink-0 justify-end gap-2">
                <CancelButton onClick={() => setViewing(null)} />
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">
        {label}
      </dt>
      <dd className="text-sm text-charcoal">{value}</dd>
    </div>
  );
}

/* ============================================================
 * Bookings
 * ============================================================ */
function BookingsSection({ filterType, title }: { filterType: "tour" | "scheduled-trip"; title: string }) {
  const allBookings = useBookings();
  const bookings = allBookings.filter((b) => b.type === filterType);
  const [viewing, setViewing] = useState<Booking | null>(null);

  // Re-sync from localStorage on mount in case other tabs wrote data
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem("unzip_africa_bookings");
      if (raw) {
        const parsed = JSON.parse(raw) as Booking[];
        if (Array.isArray(parsed) && parsed.length !== allBookings.length) {
          store.setBookings(parsed);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  const handleStatusChange = (id: string, status: BookingStatus) => {
    store.updateBooking(id, { status });
    toast.success(`Marked as ${status}`);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this booking?")) return;
    store.deleteBooking(id);
    toast.success("Booking deleted");
    setViewing(null);
  };

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="RESERVATIONS" title={title} />

      {bookings.length === 0 ? (
        <Panel>
          <EmptyState
            title="No bookings yet"
            message="Customer bookings will appear here once customers reserve a tour or scheduled trip."
          />
        </Panel>
      ) : (
        <Panel className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-cream border-b border-charcoal/10">
                  {[
                    "Booking ID",
                    "Customer",
                    "Trip",
                    "Type",
                    "Dates",
                    "Travellers",
                    "Total",
                    "Status",
                    "Actions",
                  ].map((h, i, arr) => (
                    <th
                      key={h}
                      className={`px-4 py-3 font-medium uppercase tracking-wider text-[11px] text-muted-foreground ${
                        i === arr.length - 1 ? "text-right" : "text-left"
                      }`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr
                    key={b.id}
                    className="border-b border-charcoal/5 hover:bg-cream/50 transition-colors align-top"
                  >
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">
                      {b.id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-charcoal">
                        {b.customerName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.customerEmail}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.customerPhone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-charcoal">{b.tripName}</p>
                      <p className="text-xs text-muted-foreground">
                        {b.destination}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider border ${
                          b.type === "tour"
                            ? "bg-forest/10 text-forest border-forest/30"
                            : "bg-gold/10 text-gold border-gold/30"
                        }`}
                        style={sharp}
                      >
                        {b.type === "tour" ? "Tour" : "Scheduled"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal/70 text-xs">
                      {b.startDate ? b.startDate : "—"}
                      {b.endDate && (
                        <>
                          <br />
                          {b.endDate}
                        </>
                      )}
                      <span className="block text-[10px] text-muted-foreground">
                        {b.duration}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-charcoal/70">
                      {b.numTravellers}
                    </td>
                    <td className="px-4 py-3 text-charcoal font-medium">
                      ${b.totalPrice.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Select
                        value={b.status}
                        onChange={(e) =>
                          handleStatusChange(
                            b.id,
                            e.target.value as BookingStatus
                          )
                        }
                        className="h-8 text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                      </Select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <IconBtn
                          icon={Eye}
                          label="View"
                          onClick={() => setViewing(b)}
                        />
                        <IconBtn
                          icon={Trash2}
                          label="Delete"
                          variant="danger"
                          onClick={() => handleDelete(b.id)}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      )}

      <Dialog open={viewing !== null} onOpenChange={(o) => { if (!o) setViewing(null); }}>
        <DialogContent
          className="flex flex-col p-0 gap-0 max-h-[90vh] max-w-2xl"
          style={sharp}
        >
          {viewing && (
            <>
              <DialogHeader className="p-5 border-b border-charcoal/10 flex-shrink-0 text-left">
                <DialogTitle
                  className="text-2xl"
                  style={{ fontFamily: "var(--font-cormorant), serif" }}
                >
                  Booking {viewing.id.slice(0, 8)}
                </DialogTitle>
                <DialogDescription>
                  Placed {new Date(viewing.createdAt).toLocaleString()}
                </DialogDescription>
              </DialogHeader>
              <div className="modal-scroll p-5" style={modalScrollStyle}>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm">
                  <Detail label="Customer" value={viewing.customerName} />
                  <Detail label="Email" value={viewing.customerEmail} />
                  <Detail label="Phone" value={viewing.customerPhone} />
                  <Detail
                    label="Type"
                    value={viewing.type === "tour" ? "Tour" : "Scheduled Trip"}
                  />
                  <Detail label="Trip" value={viewing.tripName} />
                  <Detail label="Destination" value={viewing.destination} />
                  <Detail
                    label="Start Date"
                    value={viewing.startDate || "—"}
                  />
                  <Detail
                    label="End Date"
                    value={viewing.endDate || "—"}
                  />
                  <Detail label="Duration" value={viewing.duration} />
                  <Detail
                    label="Travellers"
                    value={String(viewing.numTravellers)}
                  />
                  <Detail
                    label="Price / Person"
                    value={`$${viewing.pricePerPerson.toLocaleString()}`}
                  />
                  <Detail
                    label="Total"
                    value={`$${viewing.totalPrice.toLocaleString()}`}
                  />
                  <Detail
                    label="Status"
                    value={<StatusBadge status={viewing.status} />}
                  />
                  {viewing.notes && (
                    <div className="col-span-2">
                      <Detail label="Notes" value={viewing.notes} />
                    </div>
                  )}
                </dl>
              </div>
              <DialogFooter className="p-4 border-t border-charcoal/10 flex-shrink-0 justify-end gap-2">
                <CancelButton onClick={() => setViewing(null)} />
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============================================================
 * Gallery (read-only)
 * ============================================================ */
const GALLERY_CATEGORIES = ["All", "Wildlife", "Landscape", "Lodge", "Culture"] as const;
type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

function GallerySection() {
  const tours = useTours();
  const accommodations = useAccommodations();
  const trips = useScheduledTrips();
  const destinations = useDestinations();
  const [category, setCategory] = useState<GalleryCategory>("All");

  const allImages = useMemo(() => {
    const list: { url: string; alt: string; category: GalleryCategory }[] = [];
    const cycle: GalleryCategory[] = ["Wildlife", "Landscape", "Lodge", "Culture"];
    let i = 0;
    tours.forEach((t) => {
      list.push({ url: t.image, alt: t.name, category: cycle[i++ % 4] });
    });
    accommodations.forEach((a) => {
      list.push({ url: a.image, alt: a.name, category: "Lodge" });
    });
    trips.forEach((t) => {
      list.push({ url: t.image, alt: t.name, category: cycle[i++ % 4] });
    });
    destinations.forEach((d) => {
      list.push({ url: d.image, alt: d.name, category: "Landscape" });
    });
    return list.filter((item) => item.url);
  }, [tours, accommodations, trips, destinations]);

  const filtered =
    category === "All"
      ? allImages
      : allImages.filter((item) => item.category === category);

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="MEDIA" title="Gallery" />

      <div className="flex flex-wrap gap-2">
        {GALLERY_CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`px-4 py-2 text-xs uppercase tracking-wider border transition-colors ${
              category === c
                ? "bg-forest text-cream border-forest"
                : "border-charcoal/20 text-charcoal hover:bg-cream"
            }`}
            style={sharp}
          >
            {c}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Panel>
          <EmptyState
            title="No images yet"
            message="Add tours, accommodations, or destinations to populate the gallery."
          />
        </Panel>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((item, i) => (
            <div
              key={`${item.url}-${i}`}
              className="aspect-square overflow-hidden border border-charcoal/10 group"
              style={sharp}
            >
              <div className="relative w-full h-full">
                <Img
                  src={item.url}
                  alt={item.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-forest-deep/80 text-cream px-3 py-2 text-xs">
                  <p className="truncate">{item.alt}</p>
                  <p className="text-[10px] text-gold-soft uppercase tracking-wider">
                    {item.category}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ============================================================
 * Testimonials
 * ============================================================ */
function emptyTestimonialForm(): TestimonialFormState {
  return {
    name: "",
    role: "",
    avatar: "",
    content: "",
    published: true,
    date: new Date().toISOString().slice(0, 10),
  };
}

function tToForm(t: Testimonial): TestimonialFormState {
  return {
    name: t.name,
    role: t.role,
    avatar: t.avatar,
    content: t.content,
    published: t.published,
    date: t.date,
  };
}

function formToT(form: TestimonialFormState, id: string): Testimonial {
  return {
    id,
    name: form.name.trim(),
    role: form.role,
    avatar: form.avatar,
    content: form.content,
    published: form.published,
    date: form.date,
  };
}

function TestimonialsSection() {
  const testimonials = useTestimonials();
  const [editing, setEditing] = useState<Testimonial | "new" | null>(null);

  const handleSave = (data: Testimonial) => {
    if (editing === "new") {
      store.setTestimonials([data, ...testimonials]);
      toast.success("Testimonial created");
    } else {
      store.setTestimonials(
        testimonials.map((t) => (t.id === data.id ? data : t))
      );
      toast.success("Testimonial updated");
    }
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!confirm("Delete this testimonial?")) return;
    store.setTestimonials(testimonials.filter((t) => t.id !== id));
    toast.success("Testimonial deleted");
  };

  const togglePublished = (t: Testimonial) => {
    store.updateTestimonial(t.id, { published: !t.published });
  };

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="VOICES"
        title="Testimonials"
        action={
          <PrimaryButton
            label="Add Testimonial"
            icon={Plus}
            onClick={() => setEditing("new")}
          />
        }
      />

      {testimonials.length === 0 ? (
        <Panel>
          <EmptyState
            title="No testimonials yet"
            message="Add a testimonial to display on the homepage."
          />
        </Panel>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="bg-alabaster border border-charcoal/10 p-5 flex flex-col"
              style={sharp}
            >
              <div className="flex items-start gap-3 mb-3">
                <div
                  className="w-12 h-12 overflow-hidden bg-charcoal/5 flex-shrink-0"
                  style={sharp}
                >
                  {t.avatar && (
                    <Img
                      src={t.avatar}
                      alt={t.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-charcoal truncate">{t.name}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {t.role}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center px-1.5 py-0.5 text-[9px] uppercase tracking-wider border ${
                    t.published
                      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                      : "bg-zinc-100 text-zinc-600 border-zinc-300"
                  }`}
                  style={sharp}
                >
                  {t.published ? "Live" : "Hidden"}
                </span>
              </div>
              <p className="text-sm text-charcoal/80 line-clamp-4 mb-3 flex-1">
                "{t.content}"
              </p>
              <p className="text-xs text-muted-foreground mb-3">{t.date}</p>
              <div className="flex items-center justify-between gap-2 pt-3 border-t border-charcoal/10">
                <Toggle
                  checked={t.published}
                  onChange={() => togglePublished(t)}
                  label="Published"
                />
                <div className="flex gap-1">
                  <IconBtn
                    icon={Pencil}
                    label="Edit"
                    onClick={() => setEditing(t)}
                  />
                  <IconBtn
                    icon={Trash2}
                    label="Delete"
                    variant="danger"
                    onClick={() => handleDelete(t.id)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editing !== null && (
        <TestimonialFormModal
          t={editing === "new" ? null : editing}
          onClose={() => setEditing(null)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function TestimonialFormModal({
  t,
  onClose,
  onSave,
}: {
  t: Testimonial | null;
  onClose: () => void;
  onSave: (t: Testimonial) => void;
}) {
  const [form, setForm] = useState<TestimonialFormState>(() =>
    t ? tToForm(t) : emptyTestimonialForm()
  );

  const update = <K extends keyof TestimonialFormState>(
    key: K,
    value: TestimonialFormState[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = () => {
    if (!form.name.trim()) {
      toast.error("Name is required");
      return;
    }
    if (!form.content.trim()) {
      toast.error("Testimonial content is required");
      return;
    }
    const id = t?.id ?? generateId("t");
    onSave(formToT(form, id));
  };

  return (
    <Dialog open onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent
        className="flex flex-col p-0 gap-0 max-h-[90vh] max-w-2xl"
        style={sharp}
      >
        <DialogHeader className="p-5 border-b border-charcoal/10 flex-shrink-0 text-left">
          <DialogTitle
            className="text-2xl"
            style={{ fontFamily: "var(--font-cormorant), serif" }}
          >
            {t ? "Edit Testimonial" : "New Testimonial"}
          </DialogTitle>
          <DialogDescription>
            Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>
        <div className="modal-scroll p-5" style={modalScrollStyle}>
          <div className="grid md:grid-cols-2 gap-4">
            <Field label="Name *">
              <TextInput
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Marcus Verhoeven"
              />
            </Field>
            <Field label="Role">
              <TextInput
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                placeholder="Founder, Private Equity Firm — London"
              />
            </Field>
            <div className="md:col-span-2">
              <Field label="Avatar URL">
                <TextInput
                  value={form.avatar}
                  onChange={(e) => update("avatar", e.target.value)}
                  placeholder="https://..."
                />
                {form.avatar && (
                  <div
                    className="mt-2 w-16 h-16 overflow-hidden border border-charcoal/10"
                    style={sharp}
                  >
                    <Img
                      src={form.avatar}
                      alt={form.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </Field>
            </div>
            <div className="md:col-span-2">
              <Field label="Content *">
                <TextArea
                  rows={6}
                  value={form.content}
                  onChange={(e) => update("content", e.target.value)}
                  placeholder="Unzip Africa did not plan a safari..."
                />
              </Field>
            </div>
            <Field label="Date">
              <TextInput
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
              />
            </Field>
            <div className="pt-6">
              <Toggle
                checked={form.published}
                onChange={(v) => update("published", v)}
                label="Published (visible on site)"
              />
            </div>
          </div>
        </div>
        <DialogFooter className="p-4 border-t border-charcoal/10 flex-shrink-0 justify-end gap-2">
          <CancelButton onClick={onClose} />
          <SaveButton onClick={handleSubmit} label={t ? "Update" : "Create"} />
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

/* ============================================================
 * Settings
 * ============================================================ */
function SettingsSection() {
  const [form, setForm] = useState<SettingsState>(() => readSettings());

  const update = <K extends keyof SettingsState>(
    key: K,
    value: SettingsState[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    try {
      window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(form));
      toast.success("Settings saved");
    } catch {
      toast.error("Failed to save settings");
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeader eyebrow="CONFIGURATION" title="Settings" />

      <Panel className="p-0 overflow-hidden">
        <Tabs
          defaultValue="general"
          className={tabsWrapperClass}
          style={tabsWrapperStyle}
        >
          <TabsList className="bg-cream border-b border-charcoal/10 rounded-none h-auto p-0 flex-shrink-0 flex flex-wrap rounded-none">
            {[
              { id: "general", label: "General" },
              { id: "social", label: "Social" },
              { id: "appearance", label: "Appearance" },
              { id: "whatsapp", label: "WhatsApp" },
              { id: "footer", label: "Footer" },
            ].map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="rounded-none border-0 border-b-2 border-transparent data-[state=active]:border-gold data-[state=active]:bg-transparent data-[state=active]:shadow-none px-4 py-2.5 text-[11px] uppercase tracking-wider"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="p-5">
            <TabsContent value="general" className="mt-0">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Company Name">
                  <TextInput
                    value={form.companyName}
                    onChange={(e) => update("companyName", e.target.value)}
                  />
                </Field>
                <Field label="Tagline">
                  <TextInput
                    value={form.tagline}
                    onChange={(e) => update("tagline", e.target.value)}
                  />
                </Field>
                <Field label="Email">
                  <TextInput
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                  />
                </Field>
                <Field label="Phone">
                  <TextInput
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                  />
                </Field>
              </div>
              {/* Logo upload */}
              <div className="mt-6 border-t border-charcoal/10 pt-6">
                <Field label="Dashboard Logo URL" hint="Paste a URL to your logo image. This will appear in the admin sidebar.">
                  <TextInput
                    value={form.logoUrl}
                    onChange={(e) => update("logoUrl", e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </Field>
                {form.logoUrl && (
                  <div className="mt-3 flex items-center gap-4">
                    <div className="w-12 h-12 overflow-hidden bg-cream border border-charcoal/10 flex items-center justify-center" style={sharp}>
                      <img src={form.logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                    </div>
                    <p className="text-xs text-charcoal/50">Logo preview</p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="social" className="mt-0">
              <div className="space-y-4">
                <Field label="Facebook URL">
                  <TextInput
                    value={form.facebook}
                    onChange={(e) => update("facebook", e.target.value)}
                    placeholder="https://facebook.com/..."
                  />
                </Field>
                <Field label="Instagram URL">
                  <TextInput
                    value={form.instagram}
                    onChange={(e) => update("instagram", e.target.value)}
                    placeholder="https://instagram.com/..."
                  />
                </Field>
                <Field label="Twitter URL">
                  <TextInput
                    value={form.twitter}
                    onChange={(e) => update("twitter", e.target.value)}
                    placeholder="https://twitter.com/..."
                  />
                </Field>
                <Field label="YouTube URL">
                  <TextInput
                    value={form.youtube}
                    onChange={(e) => update("youtube", e.target.value)}
                    placeholder="https://youtube.com/..."
                  />
                </Field>
              </div>
            </TabsContent>

            <TabsContent value="appearance" className="mt-0">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="Primary Color">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={form.primaryColor}
                      onChange={(e) => update("primaryColor", e.target.value)}
                      className="w-12 h-9 border border-charcoal/15"
                      style={sharp}
                    />
                    <TextInput
                      value={form.primaryColor}
                      onChange={(e) => update("primaryColor", e.target.value)}
                    />
                  </div>
                </Field>
                <Field label="Accent Color">
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={form.accentColor}
                      onChange={(e) => update("accentColor", e.target.value)}
                      className="w-12 h-9 border border-charcoal/15"
                      style={sharp}
                    />
                    <TextInput
                      value={form.accentColor}
                      onChange={(e) => update("accentColor", e.target.value)}
                    />
                  </div>
                </Field>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Note: color changes are saved for reference. A rebuild may be
                required to apply them to the live site.
              </p>
            </TabsContent>

            <TabsContent value="whatsapp" className="mt-0">
              <div className="grid md:grid-cols-2 gap-4">
                <Field label="WhatsApp Number" hint="Country code, no +">
                  <TextInput
                    value={form.whatsappNumber}
                    onChange={(e) => update("whatsappNumber", e.target.value)}
                    placeholder="255754000000"
                  />
                </Field>
                <Field label="Default Message">
                  <TextInput
                    value={form.whatsappMessage}
                    onChange={(e) => update("whatsappMessage", e.target.value)}
                  />
                </Field>
              </div>
            </TabsContent>

            <TabsContent value="footer" className="mt-0">
              <div className="space-y-4">
                <Field label="Copyright Text">
                  <TextInput
                    value={form.copyright}
                    onChange={(e) => update("copyright", e.target.value)}
                  />
                </Field>
                <Field label="Developed By">
                  <TextInput
                    value={form.developedBy}
                    onChange={(e) => update("developedBy", e.target.value)}
                  />
                </Field>
              </div>
            </TabsContent>
          </div>
        </Tabs>

        <div className="p-4 border-t border-charcoal/10 flex justify-end">
          <SaveButton onClick={handleSave} label="Save Settings" />
        </div>
      </Panel>
    </div>
  );
}

/* ============================================================
 * Root — AdminPage
 * ============================================================ */
export function AdminPage() {
  const { navigate } = useRouter();
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      return false;
    }
  });
  const [section, setSection] = useState<AdminSection>("dashboard");

  if (!authed) {
    return (
      <LoginGate
        onSuccess={() => setAuthed(true)}
        onBack={() => navigate("home")}
      />
    );
  }

  const handleSignOut = () => {
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
    setAuthed(false);
    navigate("home");
  };

  return (
    <div className="min-h-screen bg-canvas flex" style={sharp}>
      <Sidebar
        section={section}
        onNavigate={setSection}
        onSignOut={handleSignOut}
      />

      <main className="flex-1 overflow-y-auto" style={sharp}>
        <div className="p-6 md:p-10 max-w-[1400px] mx-auto">
          {section === "dashboard" && (
            <DashboardSection onNavigate={setSection} />
          )}
          {section === "tours" && <ToursSection />}
          {section === "accommodations" && <AccommodationsSection />}
          {section === "scheduled-trips" && <ScheduledTripsSection />}
          {section === "destinations" && <DestinationsSection />}
          {section === "quotes" && <QuotesSection />}
          {section === "bookings" && <BookingsSection filterType="tour" title="Tour Bookings" />}
          {section === "scheduled-trip-bookings" && <BookingsSection filterType="scheduled-trip" title="Scheduled Trip Bookings" />}
          {section === "testimonials" && <TestimonialsSection />}
          {section === "settings" && <SettingsSection />}
        </div>
      </main>
    </div>
  );
}
