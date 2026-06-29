"use client";

import { useEffect, useRef, useMemo, ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: ReactNode;
  as?: keyof JSX.IntrinsicElements;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

/**
 * ScrollReveal — word-by-word scroll-triggered reveal with optional blur + rotation.
 * Children may be a string (split into words) or a ReactNode containing only
 * string children (we extract text). For mixed content use the `text` prop pattern.
 *
 * Adapts the original magicui-style ScrollReveal for Next.js + GSAP.
 */
const ScrollReveal = ({
  children,
  as = "h2",
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = "",
  textClassName = "",
  rotationEnd = "bottom bottom",
  wordAnimationEnd = "bottom bottom",
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLElement>(null);

  // Extract text from children — supports plain strings, arrays of strings,
  // and React elements whose children are strings (e.g. <span>italic</span>)
  const flatText = useMemo(() => {
    const extract = (node: ReactNode): string => {
      if (node === null || node === undefined || typeof node === "boolean") return "";
      if (typeof node === "string" || typeof node === "number") return String(node);
      if (Array.isArray(node)) return node.map(extract).join("");
      if (typeof node === "object" && "props" in node) {
        const el = node as React.ReactElement;
        // Preserve spaces around inline elements by joining their children
        const inner = extract((el.props as { children?: ReactNode }).children);
        // Detect italic span — we'll tag it via a marker the renderer can pick up
        const isItalic =
          typeof el.type === "string" &&
          el.type === "span" &&
          typeof (el.props as { className?: string }).className === "string" &&
          (el.props as { className: string }).className.includes("italic");
        return isItalic ? `\u0001${inner}\u0001` : inner;
      }
      return "";
    };
    return extract(children);
  }, [children]);

  // Build the word array. We split on whitespace but keep italic markers
  // so we can render italic spans correctly.
  const splitText = useMemo(() => {
    if (!flatText) return [];
    // Split on whitespace, preserving whitespace tokens
    return flatText.split(/(\s+)/).map((token, index) => {
      if (token.match(/^\s+$/)) return token;
      // Italic marker? \u0001 ... \u0001
      if (token.includes("\u0001")) {
        const inner = token.replace(/\u0001/g, "");
        return (
          <span className="inline-block word italic" key={index}>
            {inner}
          </span>
        );
      }
      return (
        <span className="inline-block word" key={index}>
          {token}
        </span>
      );
    });
  }, [flatText]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current ? scrollContainerRef.current : window;

    const ctx = gsap.context(() => {
      // Rotation: container rotates from baseRotation -> 0 across the scroll
      gsap.fromTo(
        el,
        { transformOrigin: "0% 50%", rotate: baseRotation },
        {
          ease: "none",
          rotate: 0,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom",
            end: rotationEnd,
            scrub: true,
          },
        }
      );

      const wordElements = el.querySelectorAll(".word");

      // Word opacity stagger
      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: "opacity" },
        {
          ease: "none",
          opacity: 1,
          stagger: 0.05,
          scrollTrigger: {
            trigger: el,
            scroller,
            start: "top bottom-=20%",
            end: wordAnimationEnd,
            scrub: true,
          },
        }
      );

      // Word blur stagger
      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          {
            ease: "none",
            filter: "blur(0px)",
            stagger: 0.05,
            scrollTrigger: {
              trigger: el,
              scroller,
              start: "top bottom-=20%",
              end: wordAnimationEnd,
              scrub: true,
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength,
  ]);

  const Tag = as as keyof JSX.IntrinsicElements;

  return (
    <Tag ref={containerRef as React.Ref<HTMLElement>} className={containerClassName}>
      <span className={textClassName}>{splitText}</span>
    </Tag>
  );
};

export default ScrollReveal;
