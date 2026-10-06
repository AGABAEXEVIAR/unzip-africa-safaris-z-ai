"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RouterProvider, useRouter } from "@/lib/router";
import { LanguageProvider } from "@/lib/language";
import { SmoothScroll } from "@/components/luxury/SmoothScroll";
import { CustomCursor } from "@/components/luxury/CustomCursor";
import { ScrollProgress } from "@/components/luxury/ScrollProgress";
import { Navigation } from "@/components/luxury/Navigation";
import { Footer } from "@/components/luxury/Footer";
import { QuoteModal } from "@/components/luxury/QuoteModal";
import { WhatsAppChatbot } from "@/components/luxury/WhatsAppChatbot";
import { CookieConsent } from "@/components/luxury/CookieConsent";
import { HomePage } from "@/components/pages/HomePage";
import { AboutPage } from "@/components/pages/AboutPage";
import { ToursPage } from "@/components/pages/ToursPage";
import { AccommodationPage } from "@/components/pages/AccommodationPage";
import { ContactPage } from "@/components/pages/ContactPage";
import { QuotePage } from "@/components/pages/QuotePage";
import { DestinationPage } from "@/components/pages/DestinationPage";
import { TourDetailPage } from "@/components/pages/TourDetailPage";
import { ScheduledTripDetailPage } from "@/components/pages/ScheduledTripDetailPage";
import { AccommodationDetailPage } from "@/components/pages/AccommodationDetailPage";
import { AdminPage } from "@/components/pages/AdminPage";

function PageContent() {
  const { page, openQuote } = useRouter();

  // Listen for global "open-quote" custom events (e.g., from accommodation modal)
  useEffect(() => {
    const handler = () => openQuote();
    window.addEventListener("open-quote", handler);
    return () => window.removeEventListener("open-quote", handler);
  }, [openQuote]);

  const isAdmin = page === "admin";

  const pages: Record<typeof page, React.ReactNode> = {
    home: <HomePage />,
    about: <AboutPage />,
    tours: <ToursPage />,
    accommodation: <AccommodationPage />,
    contact: <ContactPage />,
    destinations: <DestinationPage />,
    quote: <QuotePage />,
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
            {pages[page]}
          </motion.div>
        </AnimatePresence>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <QuoteModal />}
      {!isAdmin && <WhatsAppChatbot />}
      {!isAdmin && <CookieConsent />}
    </div>
  );
}

export default function Home() {
  return (
    <RouterProvider>
      <LanguageProvider>
        <SmoothScroll>
          <CustomCursor />
          <PageContent />
        </SmoothScroll>
      </LanguageProvider>
    </RouterProvider>
  );
}
