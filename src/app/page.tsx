"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RouterProvider, useRouter } from "@/lib/router";
import { SmoothScroll } from "@/components/luxury/SmoothScroll";
import { CustomCursor } from "@/components/luxury/CustomCursor";
import { Navigation } from "@/components/luxury/Navigation";
import { Footer } from "@/components/luxury/Footer";
import { QuoteModal } from "@/components/luxury/QuoteModal";
import { HomePage } from "@/components/pages/HomePage";
import { AboutPage } from "@/components/pages/AboutPage";
import { ToursPage } from "@/components/pages/ToursPage";
import { AccommodationPage } from "@/components/pages/AccommodationPage";
import { ContactPage } from "@/components/pages/ContactPage";

function PageContent() {
  const { page, openQuote } = useRouter();

  // Listen for global "open-quote" custom events (e.g., from accommodation modal)
  useEffect(() => {
    const handler = () => openQuote();
    window.addEventListener("open-quote", handler);
    return () => window.removeEventListener("open-quote", handler);
  }, [openQuote]);

  const pages = {
    home: <HomePage />,
    about: <AboutPage />,
    tours: <ToursPage />,
    accommodation: <AccommodationPage />,
    contact: <ContactPage />,
  };

  return (
    <div className="min-h-screen flex flex-col bg-canvas">
      <Navigation />
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
      <Footer />
      <QuoteModal />
    </div>
  );
}

export default function Home() {
  return (
    <RouterProvider>
      <SmoothScroll>
        <CustomCursor />
        <PageContent />
      </SmoothScroll>
    </RouterProvider>
  );
}
