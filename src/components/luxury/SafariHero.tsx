"use client";

import { motion, type Variants } from "motion/react";
import React, { useEffect, useRef } from "react";
import { useRouter, PageId } from "@/lib/router";
import { useLang } from "@/lib/language";

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
    "/videos/pexels-safari.mp4",
    "/videos/elephant-rumbling.webm",
  ],
  posterImage =
    "https://sfile.chatglm.cn/images-ppt/741df1b5a3da.jpg",
}: SafariHeroProps) {
  const { navigate } = useRouter();
  const { t } = useLang();
  const videoRef = useRef<HTMLVideoElement>(null);

  // Ensure the video plays smoothly — handle autoplay edge cases
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;

    // Force play if browser blocks autoplay
    const tryPlay = () => {
      if (v.paused) {
        v.play().catch(() => {});
      }
    };

    // Try to play immediately
    tryPlay();

    // Also try on any pause event (some browsers pause when tab loses focus)
    v.addEventListener("pause", tryPlay);
    v.addEventListener("canplay", tryPlay);

    return () => {
      v.removeEventListener("pause", tryPlay);
      v.removeEventListener("canplay", tryPlay);
    };
  }, []);

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
      {/* ===== Background: Safari video — plays immediately, no poster ===== */}
      <div className="pointer-events-none absolute inset-0 z-0 select-none">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          disablePictureInPicture
        >
          <source src="/videos/pexels-safari.mp4" type="video/mp4" />
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
            {/* Eyebrow — bordered label with vigorous wavy pulse rings */}
            <motion.div
              variants={eyebrowVariants}
              initial="hidden"
              animate="visible"
              className="mb-8"
            >
              <span
                className="hero-eyebrow-label inline-flex items-center px-5 py-2 text-[0.65rem] font-medium tracking-[0.35em] uppercase text-gold-soft md:text-xs"
                style={{ fontFamily: "var(--font-inter), sans-serif" }}
              >
                {/* Three concentric pulse rings — vigorous wavy effect */}
                <span className="hero-eyebrow-ring" />
                <span className="hero-eyebrow-ring hero-eyebrow-ring-2" />
                <span className="hero-eyebrow-ring hero-eyebrow-ring-3" />
                {t("hero.eyebrow")}
              </span>
            </motion.div>

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
              {t("hero.title1")} <br />
              <span className="italic text-gold-soft">{t("hero.title2")}</span>
            </motion.h1>

            {/* Subtitle: lighter, quicker */}
            <motion.p
              variants={subtitleVariants}
              initial="hidden"
              animate="visible"
              className="mt-8 max-w-2xl text-base leading-relaxed font-normal text-cream/85 md:text-lg"
              style={{ textWrap: "pretty", fontFamily: "var(--font-inter), sans-serif" }}
            >
              {t("hero.subtitle")}
            </motion.p>

            {/* CTA: scales into place — single centered button, NO border radius */}
            <motion.div
              variants={ctaVariants}
              initial="hidden"
              animate="visible"
              className="mt-10 flex items-center justify-center"
            >
              {/* Primary action button — sharp corners, glass effect */}
              <button
                onClick={() => navigate("contact")}
                className="flex min-h-12 items-center bg-cream/15 backdrop-blur-sm px-10 text-sm font-medium tracking-[0.2em] uppercase text-cream shadow-[inset_2px_2px_0_-0.5px_rgba(255,255,255,0.15),inset_-2px_-2px_0_-0.5px_rgba(255,255,255,0.15)] transition-transform hover:bg-cream/25 active:scale-[0.96] md:text-base"
                style={{ fontFamily: "var(--font-inter), sans-serif", borderRadius: 0 }}
              >
                {t("nav.beginJourney")}
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
