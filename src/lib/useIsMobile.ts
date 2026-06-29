"use client";

import { useState, useEffect } from "react";

/**
 * Detects whether the viewport is below a given breakpoint.
 * Defaults to detecting mobile (below 768px / md breakpoint).
 * Updates on resize.
 */
export function useIsMobile(breakpoint = 768): boolean {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);

  return isMobile;
}
