"use client";

import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [labelVisible, setLabelVisible] = useState(false);

  useEffect(() => {
    // Disable on touch devices
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = 0;

    const handleMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
      }
      if (labelRef.current) {
        labelRef.current.style.transform = `translate(${mouseX}px, ${mouseY + 60}px) translate(-50%, -50%)`;
      }
    };

    // Smooth follow for ring (inertia)
    const updateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
      }
      rafId = requestAnimationFrame(updateRing);
    };
    rafId = requestAnimationFrame(updateRing);

    // Hover detection
    const handleOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement)?.closest<HTMLElement>(
        "a, button, [role='button'], input, textarea, select, [data-cursor]"
      );
      if (target) {
        const cursorType = target.getAttribute("data-cursor");
        if (cursorType === "drag") {
          setIsDragging(true);
          setIsHovering(false);
          setLabel("Drag");
          setLabelVisible(true);
        } else if (cursorType === "view") {
          setIsHovering(true);
          setIsDragging(false);
          setLabel("View");
          setLabelVisible(true);
        } else {
          setIsHovering(true);
          setIsDragging(false);
          setLabel("");
          setLabelVisible(false);
        }
      } else {
        setIsHovering(false);
        setIsDragging(false);
        setLabel("");
        setLabelVisible(false);
      }
    };

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      cancelAnimationFrame(rafId);
    };
  }, []);

  // Hide cursor when leaving window
  useEffect(() => {
    const handleLeave = () => {
      if (dotRef.current) dotRef.current.style.opacity = "0";
      if (ringRef.current) ringRef.current.style.opacity = "0";
      if (labelRef.current) labelRef.current.style.opacity = "0";
    };
    const handleEnter = () => {
      if (dotRef.current) dotRef.current.style.opacity = "1";
      if (ringRef.current) ringRef.current.style.opacity = "1";
    };
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);
    return () => {
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden />
      <div
        ref={ringRef}
        className={`cursor-ring ${isHovering ? "is-hovering" : ""} ${isDragging ? "is-dragging" : ""}`}
        aria-hidden
      />
      <div
        ref={labelRef}
        className={`cursor-label ${labelVisible ? "is-visible" : ""}`}
        aria-hidden
      >
        {label}
      </div>
    </>
  );
}
