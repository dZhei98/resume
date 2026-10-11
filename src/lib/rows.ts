import extracurricularsData from "@/data/personal/extracurriculars.json";
import interestsData from "@/data/personal/interests.json";
import volunteeringData from "@/data/personal/volunteering.json";
import { getCategory } from "@/constants/categories";
import {
  ABOUT_SLUG,
  CATALOG,
  getTitle,
  getTitlesByCategory,
  getTitlesByKind,
  getTopHackathons,
} from "@/lib/catalog";
import { recencyKey } from "@/lib/dates";
import type { CategoryId, ProfileId, RowSpec, RowVariant, Title } from "@/types";

const row = (
  id: string,
  title: string,
  titles: readonly Title[],
  variant: RowVariant = "standard"
): RowSpec => ({ id, title, variant, slugs: titles.map((item) => item.slug) });

const work = getTitlesByKind("work");
const education = getTitlesByKind("education");
const projects = getTitlesByKind("project");
const hackathons = getTitlesByKind("hackathon");
const toolkit = getTitlesByKind("toolkit");
const activities = getTitlesByKind("activity");
const volunteering = getTitlesByKind("volunteering");
const interests = getTitlesByKind("interest");
const interactive = getTitlesByKind("interactive");
const topHackathons = getTopHackathons();

const PROFILE_ROWS: Record<ProfileId, readonly RowSpec[]> = {
  recruiter: [
    row("experience", "Experience Spotlight", work),
    row("education", "Academic Journey", education),
    row("top-hackathons", "Top 5 Hackathon Wins", topHackathons, "ranked"),
    row("projects", "Flagship Projects", projects),
    row("skills", "Technical Skills", toolkit),
  ],
  developer: [
    row("top-hackathons", "Top 5 Hackathon Wins", topHackathons, "ranked"),
    row("hackathons", "Hackathon Highlights", hackathons),
    row("projects", "Featured Projects", projects),
    row("experience", "Experience Spotlight", work),
    row("skills", "Technical Skills", toolkit),
  ],
  stalker: [
    row("activities", extracurricularsData.title, activities),
    row("volunteering", volunteeringData.title, volunteering),
    row("interests", interestsData.title, interests),
    row("interactive", "Interactive Experiences", interactive),
  ],
};

export const getProfileRows = (profileId: ProfileId): readonly RowSpec[] =>
  PROFILE_ROWS[profileId];

export const getCategoryRows = (
  category: CategoryId
): { heroSlug: string; rows: readonly RowSpec[] } => {
  const titles = getTitlesByCategory(category);
  const label = getCategory(category).label;

  if (category === "projects") {
    return {
      heroSlug: topHackathons[0]?.slug ?? ABOUT_SLUG,
      rows: [
        row("top-hackathons", `Top ${topHackathons.length} Hackathon Wins`, topHackathons, "ranked"),
        row("hackathons", "All Hackathons", hackathons),
        row("projects", "All Projects", projects),
      ],
    };
  }

  if (category === "personal") {
    return {
      heroSlug: titles[0]?.slug ?? ABOUT_SLUG,
      rows: [
        row("activities", extracurricularsData.title, activities),
        row("volunteering", volunteeringData.title, volunteering),
        row("interests", interestsData.title, interests),
      ],
    };
  }

  return {
    heroSlug: titles[0]?.slug ?? ABOUT_SLUG,
    rows: [row(`${category}-all`, `All ${label}`, titles)],
  };
};

export const getSimilarSlugs = (slug: string, limit = 6): string[] => {
  const source = getTitle(slug);
  if (!source || source.kind === "about") {
    return [];
  }

  return CATALOG.filter((title) => title.kind === source.kind)
    .sort((a, b) => recencyKey(b.start, b.end) - recencyKey(a.start, a.end))
    .filter((title) => title.slug !== slug)
    .slice(0, limit)
    .map((title) => title.slug);
};
