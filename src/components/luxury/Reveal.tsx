"use client";

import { useEffect, useRef, useState, ReactNode, ElementType } from "react";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  className?: string;
  variant?: "up" | "fade" | "stagger" | "scale" | "left" | "right";
  delay?: number;
  threshold?: number;
  once?: boolean;
  style?: React.CSSProperties;
};

export function Reveal({
  children,
  as: Tag = "div",
  className = "",
  variant = "up",
  delay = 0,
  threshold = 0.15,
  once = true,
  style,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setVisible(false);
          }
        });
      },
      { threshold, rootMargin: "0px 0px -10% 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const variantClass =
    variant === "up" ? "reveal-up"
    : variant === "fade" ? "reveal-fade"
    : variant === "stagger" ? "reveal-stagger"
    : variant === "scale" ? "reveal-scale"
    : variant === "left" ? "reveal-left"
    : variant === "right" ? "reveal-right"
    : "reveal-up";

  return (
    <Tag
      ref={ref as React.Ref<HTMLElement>}
      className={`${variantClass} ${visible ? "is-visible" : ""} ${className}`}
      style={{ transitionDelay: `${delay}s`, ...style }}
    >
      {children}
    </Tag>
  );
}
