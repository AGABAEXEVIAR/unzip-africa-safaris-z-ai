"use client";

import { motion, type Variants } from "motion/react";
import { Play } from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, PageId } from "@/lib/router";

export interface SafariHeroProps {
  logoText?: string;
  navItems?: { id: PageId; label: string }[];
  loginText?: string;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  primaryActionText?: string;
  videoSources?: string[];
  posterImage?: string;
}

export default function SafariHero({
  logoText = "Unzip Africa Safaris",
  navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "tours", label: "Tours" },
    { id: "accommodation", label: "Accommodation" },
    { id: "contact", label: "Contact" },
  ],
  loginText = "Request a Quote",
  title = (
    <>
      Luxury Safaris Across <br />
      <span className="italic text-gold-soft">Uganda, Kenya &amp; Tanzania</span>
    </>
  ),
  subtitle = (
    <>
      Entirely private. Impossibly rare. <br className="hidden md:block" />
      Journeys crafted around a single traveller — you.
    </>
  ),
  primaryActionText = "Begin Your Journey",
  videoSources = [
    "/videos/wildebeest-drinking.webm",
    "/videos/elephant-rumbling.webm",
  ],
  posterImage =
    "https://images.unsplash.com/photo-1547621869-cd5e2ef82e1d?auto=format&fit=crop&w=2400&q=85",
}: SafariHeroProps) {
  const { navigate, openQuote } = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  // Try to load the active video; on failure, fall back to next source
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout>;

    const handleLoadedData = () => {
      if (!cancelled) setVideoLoaded(true);
    };
    const handleError = () => {
      if (cancelled) return;
      // Try next source if available
      if (activeVideoIdx < videoSources.length - 1) {
        setActiveVideoIdx((i) => i + 1);
      } else {
        // All sources failed — keep poster image as fallback
        setVideoLoaded(false);
      }
    };

    v.addEventListener("loadeddata", handleLoadedData);
    v.addEventListener("canplay", handleLoadedData);
    v.addEventListener("error", handleError);

    // If the video hasn't started loading data within 8 seconds, try the next source
    timeoutId = setTimeout(() => {
      if (!cancelled && v.readyState < 2 && activeVideoIdx < videoSources.length - 1) {
        setActiveVideoIdx((i) => i + 1);
      }
    }, 8000);

    // Force reload when source changes
    v.load();

    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
      v.removeEventListener("loadeddata", handleLoadedData);
      v.removeEventListener("canplay", handleLoadedData);
      v.removeEventListener("error", handleError);
    };
  }, [activeVideoIdx, videoSources.length]);

  // Title: rises up with a heavier mass — slow, majestic settling
  const titleVariants: Variants = {
    hidden: { opacity: 0, y: 36, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 28, stiffness: 80, mass: 1.4, delay: 0.35 },
    },
  };

  // Subtitle: lighter, quicker
  const subtitleVariants: Variants = {
    hidden: { opacity: 0, y: 18, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 22, stiffness: 110, delay: 0.65 },
    },
  };

  // CTA group: scale up from slightly small + fade
  const ctaVariants: Variants = {
    hidden: { opacity: 0, scale: 0.92, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", damping: 20, stiffness: 140, delay: 0.85 },
    },
  };

  // Eyebrow above title
  const eyebrowVariants: Variants = {
    hidden: { opacity: 0, y: 14, filter: "blur(4px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { type: "spring", damping: 22, stiffness: 110, delay: 0.2 },
    },
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-charcoal font-sans antialiased selection:bg-gold/30">
      {/* ===== Background: Safari video with poster fallback ===== */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
        {/* Poster image (always present, visible until video loads) */}
        <img
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          src={posterImage}
          alt="African savanna at golden hour"
          style={{ opacity: videoLoaded ? 0 : 1 }}
        />
        {/* Video element */}
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-1000"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterImage}
          style={{ opacity: videoLoaded ? 1 : 0 }}
        >
          <source src={videoSources[activeVideoIdx]} type="video/webm" />
        </video>

        {/* Cinematic gradient overlays for legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal/55 via-charcoal/30 to-charcoal/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal/40 via-transparent to-charcoal/40" />

        {/* Subtle grain for cinematic feel */}
        <div
          className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E\")",
          }}
        />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col pt-6">
        {/* ===== Hero Main Content — each element independently animated ===== */}
        <div className="flex flex-1 items-center justify-center px-6 pt-32 md:pt-40">
          <div className="flex max-w-4xl flex-col items-center text-center 2xl:max-w-6xl">
            {/* Eyebrow */}
            <motion.p
              variants={eyebrowVariants}
              initial="hidden"
              animate="visible"
              className="mb-8 text-[0.65rem] font-medium tracking-[0.4em] uppercase text-gold-soft md:text-xs"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              East &amp; Southern Africa · Est. 2009
            </motion.p>

            {/* Title: majestic slow rise — static (no flip animation) */}
            <motion.h1
              variants={titleVariants}
              initial="hidden"
              animate="visible"
              className="text-cream text-5xl font-normal tracking-tight md:text-7xl lg:text-[5.5rem] lg:leading-[1.1] 2xl:text-[7rem]"
              style={{
                textWrap: "balance",
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 300,
                letterSpacing: "-0.02em",
              }}
            >
              {title}
            </motion.h1>

            {/* Subtitle: lighter, quicker */}
            <motion.p
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 max-w-2xl text-base leading-relaxed font-normal text-cream/85 md:text-lg"
              style={{ textWrap: "pretty", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {subtitle}
            </motion.p>

            {/* CTA: scales into place — buttons with NO border radius */}
            <motion.div
              variants={ctaVariants}
              initial="hidden"
              animate="visible"
              className="mt-10 flex items-center justify-center gap-4"
            >
              {/* Primary action button — sharp corners, glass effect */}
              <button
                onClick={openQuote}
                className="flex min-h-12 items-center bg-cream/15 backdrop-blur-sm px-8 text-sm font-medium tracking-[0.2em] uppercase text-cream shadow-[inset_2px_2px_0_-0.5px_rgba(255,255,255,0.15),inset_-2px_-2px_0_-0.5px_rgba(255,255,255,0.15)] transition-transform hover:bg-cream/25 active:scale-[0.96] md:text-base"
                style={{ fontFamily: "var(--font-inter), sans-serif", borderRadius: 0 }}
              >
                {primaryActionText}
              </button>
              {/* Play button — sharp corners */}
              <button
                onClick={() => navigate("tours")}
                aria-label="Explore tours"
                className="flex h-12 w-12 items-center justify-center bg-gold text-charcoal shadow-lg transition-transform hover:scale-105 hover:bg-gold-soft active:scale-[0.96]"
                style={{ borderRadius: 0 }}
              >
                <Play className="h-5 w-5 fill-current" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 1.2 }}
          className="pb-10 flex flex-col items-center gap-3"
        >
          <span
            className="text-[0.6rem] tracking-[0.3em] uppercase text-cream/60"
            style={{ fontFamily: "var(--font-inter), sans-serif" }}
          >
            Scroll
          </span>
          <div className="w-px h-12 bg-cream/30 overflow-hidden relative">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-x-0 top-0 h-1/2 bg-gold"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
