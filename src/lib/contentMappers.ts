import type {
  AccentPalette,
  ContentRowItem,
  ProjectEntry,
  WorkEntry,
} from "@/types";

/**
 * Maps work experience entries to content row items
 */
export const mapWorkItems = (
  entries: readonly WorkEntry[],
  accents: AccentPalette
): ContentRowItem[] =>
  entries.map((experience, index) => ({
    title: experience.company,
    meta: `${experience.position} · ${experience.location} · ${experience.dateRange}`,
    accent: accents[index % accents.length],
    imageSrc: experience.image?.src,
    imageAlt: experience.image?.alt,
    details: [...experience.description],
  }));

/**
 * Maps project entries to content row items with optional filtering
 */
export const mapProjectItems = (
  entries: readonly ProjectEntry[],
  accents: AccentPalette,
  filter: (item: ProjectEntry) => boolean
): ContentRowItem[] =>
  entries.filter(filter).map((project, index) => ({
    title: project.title,
    meta: project.type ?? "Project",
    accent: accents[index % accents.length],
    imageSrc: project.image?.src,
    imageAlt: project.image?.alt,
    details: [...project.description],
    links: project.links ? [...project.links] : undefined,
  }));

/**
 * Generic entry type for bullet-based items
 */
interface BulletEntry {
  readonly title?: string;
  readonly organization?: string;
  readonly role?: string;
  readonly dateRange: string;
  readonly bullets: readonly string[];
  readonly accent: string;
  readonly image?: { readonly src: string; readonly alt: string };
}

/**
 * Maps bullet-based entries to content row items
 */
export const mapBulletItems = <T extends BulletEntry>(
  entries: readonly T[],
  titleBuilder: (entry: T) => string
): ContentRowItem[] =>
  entries.map((entry) => ({
    title: titleBuilder(entry),
    meta: entry.dateRange,
    accent: entry.accent,
    details: [...entry.bullets],
    imageSrc: entry.image?.src,
    imageAlt: entry.image?.alt,
  }));

/**
 * Category type for interest-based items
 */
interface Category {
  readonly label: string;
  readonly items: readonly string[];
  readonly accent: string;
  readonly imageSrc?: string;
  readonly imageAlt?: string;
}

/**
 * Maps category items to content row items
 */
export const mapCategoryItems = (
  categories: readonly Category[]
): ContentRowItem[] =>
  categories.map((category) => ({
    title: category.label,
    accent: category.accent,
    details: [category.items.join(", ")],
    imageSrc: category.imageSrc,
    imageAlt: category.imageAlt,
  }));
