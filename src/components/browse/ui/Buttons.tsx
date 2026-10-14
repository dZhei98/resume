"use client";

import Link from "next/link";
import React from "react";

type ButtonVariant = "primary" | "secondary";
type ButtonSize = "sm" | "md" | "lg";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-white text-black hover:bg-white/75",
  secondary: "bg-netflix-button text-white hover:bg-netflix-button-hover",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 gap-1.5 px-3 text-sm",
  md: "h-10 gap-2 px-5 text-base",
  lg: "h-10 gap-2 px-5 text-base md:h-12 md:px-7 md:text-lg",
};

const isExternal = (href: string) => /^https?:\/\//.test(href);
const isStaticFile = (href: string) => href.startsWith("/assets/");

type NfButtonProps = {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
  ariaLabel?: string;
};

export const NfButton: React.FC<NfButtonProps> = ({
  variant = "primary",
  size = "md",
  icon,
  href,
  onClick,
  className = "",
  children,
  ariaLabel,
}) => {
  const classes = `inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-sm font-semibold transition-colors focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`;
  const content = (
    <>
      {icon}
      <span>{children}</span>
    </>
  );

  if (href && (isExternal(href) || isStaticFile(href))) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
        aria-label={ariaLabel}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link href={href} className={classes} aria-label={ariaLabel}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={classes} aria-label={ariaLabel}>
      {content}
    </button>
  );
};

type CircleButtonProps = {
  label: string;
  onClick: () => void;
  solid?: boolean;
  active?: boolean;
  size?: "sm" | "md";
  className?: string;
  children: React.ReactNode;
};

export const CircleButton: React.FC<CircleButtonProps> = ({
  label,
  onClick,
  solid = false,
  active = false,
  size = "md",
  className = "",
  children,
}) => (
  <button
    type="button"
    aria-label={label}
    aria-pressed={active}
    title={label}
    onClick={(event) => {
      event.stopPropagation();
      onClick();
    }}
    className={`inline-flex shrink-0 items-center justify-center rounded-full border-2 transition-colors focus-visible:outline-solid focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
      size === "sm" ? "h-8 w-8 text-base" : "h-10 w-10 text-lg"
    } ${
      solid
        ? "border-white bg-white text-black hover:bg-white/80"
        : "border-white/50 bg-[#2a2a2a]/60 text-white hover:border-white"
    } ${className}`}
  >
    {children}
  </button>
);
