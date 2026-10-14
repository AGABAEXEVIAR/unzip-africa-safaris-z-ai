"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "@/lib/router";
import { resyncStore } from "@/lib/store";
import { ScrollProgress } from "@/components/luxury/ScrollProgress";
import { Navigation } from "@/components/luxury/Navigation";
import { Footer } from "@/components/luxury/Footer";
import { WhatsAppChatbot } from "@/components/luxury/WhatsAppChatbot";
import { CookieConsent } from "@/components/luxury/CookieConsent";
import { HomePage } from "@/components/pages/HomePage";
import { AboutPage } from "@/components/pages/AboutPage";
import { ToursPage } from "@/components/pages/ToursPage";
import { AccommodationPage } from "@/components/pages/AccommodationPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { DestinationPage } from "@/components/pages/DestinationPage";
import { TourDetailPage } from "@/components/pages/TourDetailPage";
import { ScheduledTripDetailPage } from "@/components/pages/ScheduledTripDetailPage";
import { ScheduledTripsPage } from "@/components/pages/ScheduledTripsPage";
import { AccommodationDetailPage } from "@/components/pages/AccommodationDetailPage";
import { BlogPage } from "@/components/pages/BlogPage";
import { BlogDetailPage } from "@/components/pages/BlogDetailPage";
import { AdminPage } from "@/components/pages/AdminPage";

export function PageContent() {
  const { page } = useRouter();

  const isAdmin = page === "admin";

  // Re-sync store from database on every route change.
  // This ensures the homepage shows the latest data after the admin
  // creates/edits/deletes content (testimonials, tours, blog posts, etc.).
  // The sync MERGES with local state — optimistic updates are preserved.
  useEffect(() => {
    resyncStore();
  }, [page]);

  const pages: Record<string, React.ReactNode> = {
    home: <HomePage />,
    about: <AboutPage />,
    company: <AboutPage />,
    tours: <ToursPage />,
    "scheduled-trips": <ScheduledTripsPage />,
    accommodation: <AccommodationPage />,
    contact: <ContactPage />,
    destinations: <DestinationPage />,
    blog: <BlogPage />,
    "blog-detail": <BlogDetailPage />,
    "tour-detail": <TourDetailPage />,
    "accommodation-detail": <AccommodationDetailPage />,
    "scheduled-trip-detail": <ScheduledTripDetailPage />,
    admin: <AdminPage />,
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      {!isAdmin && <ScrollProgress />}
      {!isAdmin && <Navigation />}
      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            {pages[page] ?? <HomePage />}
          </motion.div>
        </AnimatePresence>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <WhatsAppChatbot />}
      {!isAdmin && <CookieConsent />}
    </div>
  );
}
