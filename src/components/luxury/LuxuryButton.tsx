"use client";

import { ReactNode, MouseEventHandler } from "react";

type LuxuryButtonProps = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: "default" | "gold" | "light";
  className?: string;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export function LuxuryButton({
  children,
  onClick,
  variant = "default",
  className = "",
  type = "button",
  disabled = false,
}: LuxuryButtonProps) {
  const variantClass =
    variant === "gold" ? "btn-luxury-gold" : variant === "light" ? "btn-luxury-light" : "";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`btn-luxury ${variantClass} ${disabled ? "opacity-50 pointer-events-none" : ""} ${className}`}
    >
      {children}
    </button>
  );
}
