"use client";

import { useEffect, useState, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";

const sharp = { borderRadius: 0 } as const;

type HeroCarouselProps = {
  images: string[];
  alt?: string;
  autoMs?: number;
  className?: string;
  aspectClass?: string; // tailwind aspect class for the carousel container
};

export function HeroCarousel({
  images,
  alt = "Gallery image",
  autoMs = 5000,
  className = "",
  aspectClass = "aspect-[4/5]",
}: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  // Derived state during render pattern: if the index is out of bounds for the
  // current images list, reset it. We use a synchronous check + setState guard
  // to avoid setState-in-effect lint rule. The pattern works because React will
  // re-render with the corrected index before committing.
  const safeIndex = images.length > 0 ? Math.min(index, images.length - 1) : 0;
  if (safeIndex !== index) {
    setIndex(safeIndex);
  }

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (images.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, autoMs);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [images.length, autoMs]);

  const goNext = () => setIndex((i) => (i + 1) % Math.max(1, images.length));
  const goPrev = () =>
    setIndex((i) => (i - 1 + Math.max(1, images.length)) % Math.max(1, images.length));

  if (images.length === 0) {
    return <div className={`bg-charcoal ${className} ${aspectClass}`} style={sharp} />;
  }

  return (
    <div className={`relative overflow-hidden bg-charcoal ${className} ${aspectClass}`} style={sharp}>
      <AnimatePresence initial={false} mode="popLayout">
        <motion.img
          key={images[safeIndex]}
          src={images[safeIndex]}
          alt={`${alt} ${safeIndex + 1}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Prev / Next */}
      <button
        onClick={goPrev}
        aria-label="Previous image"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-charcoal/40 hover:bg-charcoal/70 text-cream flex items-center justify-center transition-colors"
        style={sharp}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={goNext}
        aria-label="Next image"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-charcoal/40 hover:bg-charcoal/70 text-cream flex items-center justify-center transition-colors"
        style={sharp}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

      {/* Image counter */}
      <div
        className="absolute top-3 right-3 px-3 py-1.5 bg-charcoal/60 text-cream text-[0.65rem] tracking-[0.2em] uppercase"
        style={sharp}
      >
        {safeIndex + 1} / {images.length}
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              aria-label={`Go to image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`transition-all duration-300 ${i === safeIndex ? "w-8 h-1.5 bg-gold" : "w-1.5 h-1.5 bg-cream/50 hover:bg-cream"}`}
              style={sharp}
            />
          ))}
        </div>
      )}
    </div>
  );
}
