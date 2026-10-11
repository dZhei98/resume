import type { ProfileConfig } from "@/types";
import Image from "next/image";
import React from "react";

const LETTERS = "JOSHUA NEE".split("");
const CENTER = (LETTERS.length - 1) / 2;

export const Wordmark: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span
    role="img"
    aria-label="Joshua Nee"
    className={`inline-flex items-center font-display leading-none text-netflix-red ${className}`}
  >
    {LETTERS.map((letter, index) =>
      letter === " " ? (
        <span key={index} aria-hidden className="w-[0.22em]" />
      ) : (
        <span
          key={index}
          aria-hidden
          className="inline-block"
          style={{ transform: `scaleY(${(1 + 0.017 * (index - CENTER) ** 2).toFixed(3)})` }}
        >
          {letter}
        </span>
      )
    )}
  </span>
);

export const Monogram: React.FC<{ className?: string }> = ({ className = "" }) => (
  <span
    role="img"
    aria-label="Joshua Nee"
    className={`inline-block font-display leading-none text-netflix-red drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)] ${className}`}
  >
    J
  </span>
);

type ProfileAvatarProps = {
  profile: ProfileConfig;
  size?: number;
  alt?: string;
  className?: string;
};

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  profile,
  size = 32,
  alt = "",
  className = "",
}) => (
  <Image
    src={profile.avatar}
    alt={alt}
    width={size}
    height={size}
    className={`rounded ${className}`}
  />
);
