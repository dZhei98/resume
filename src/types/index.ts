/**
 * Core type definitions for the portfolio application
 */

export interface ContentRowItem {
  readonly title: string;
  readonly meta?: string;
  readonly badge?: string;
  readonly accent: string;
  readonly imageSrc?: string;
  readonly imageAlt?: string;
  readonly details?: readonly string[];
  readonly links?: readonly { label: string; url: string }[];
  readonly skillBars?: readonly { name: string; level: string }[];
}

export interface ContentRow {
  readonly title: string;
  readonly items: readonly ContentRowItem[];
  readonly withDialog?: boolean;
}

export interface HeroAction {
  readonly label: string;
  readonly href: string;
  readonly icon?: string;
}

export interface ProfileHero {
  readonly eyebrow: string;
  readonly title: string;
  readonly description: string;
  readonly primaryCta?: readonly HeroAction[];
  readonly secondaryCta?: readonly HeroAction[];
  readonly imageSrc?: string;
  readonly imageAlt?: string;
  readonly imageShadow?: boolean;
  readonly typewriterSequence?: readonly (string | number)[];
  readonly badge?: string;
  readonly background: string;
}

export interface WorkEntry {
  readonly company: string;
  readonly position: string;
  readonly location: string;
  readonly dateRange: string;
  readonly description: readonly string[];
  readonly image?: { src: string; alt: string };
}

export interface ProjectEntry {
  readonly title: string;
  readonly type?: string;
  readonly description: readonly string[];
  readonly image?: { src: string; alt: string };
  readonly links?: readonly { label: string; url: string }[];
}

export interface ProfileConfig {
  readonly id: string;
  readonly name: string;
  readonly accent: string;
  readonly symbol: string;
  readonly href: string;
  readonly tagline: string;
}

export type AccentPalette = readonly string[];

export type ProfileType = "developer" | "recruiter" | "stalker";
