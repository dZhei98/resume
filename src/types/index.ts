/**
 * Core type definitions for the portfolio application
 */

export type ProfileId = "recruiter" | "developer" | "stalker";

export type CategoryId =
  | "experience"
  | "projects"
  | "education"
  | "skills"
  | "personal";

export type TitleKind =
  | "about"
  | "work"
  | "project"
  | "hackathon"
  | "education"
  | "toolkit"
  | "activity"
  | "volunteering"
  | "interest"
  | "interactive";

export interface TitleImage {
  readonly src: string;
  readonly alt: string;
  readonly fit: "contain" | "cover";
}

export interface TitleLink {
  readonly label: string;
  readonly url: string;
}

export interface Episode {
  readonly title: string;
  readonly text?: string;
  readonly items?: readonly string[];
}

export interface Skill {
  readonly name: string;
  readonly level: string;
}

export interface Award {
  readonly label: string;
  readonly placement: number;
  readonly field?: number;
}

export interface Title {
  readonly slug: string;
  readonly kind: TitleKind;
  readonly category: CategoryId | null;
  readonly name: string;
  readonly subtitle?: string;
  readonly domain?: string;
  readonly dateRange?: string;
  readonly start?: string;
  readonly end?: string | null;
  readonly yearLabel?: string;
  readonly synopsis: string;
  readonly episodes: readonly Episode[];
  readonly image?: TitleImage;
  readonly emoji?: string;
  readonly art?: string;
  readonly tint: string;
  readonly links: readonly TitleLink[];
  readonly skills?: readonly Skill[];
  readonly href?: string;
  readonly award?: Award;
  readonly rank?: number;
}

export type RowVariant = "standard" | "ranked";

export interface RowSpec {
  readonly id: string;
  readonly title: string;
  readonly variant: RowVariant;
  readonly slugs: readonly string[];
}

interface HeroAction {
  readonly label: string;
  readonly href: string;
}

export interface ProfileConfig {
  readonly id: ProfileId;
  readonly name: string;
  readonly href: string;
  readonly avatar: string;
  readonly tagline: string;
  readonly heroAction: HeroAction;
}

export interface CategoryConfig {
  readonly id: CategoryId;
  readonly label: string;
}
