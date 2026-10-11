import type { CategoryConfig, CategoryId, TitleKind } from "@/types";

export const CATEGORIES: readonly CategoryConfig[] = [
  { id: "experience", label: "Experience" },
  { id: "projects", label: "Hackathons & Projects" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Technical Skills" },
  { id: "personal", label: "Personal" },
] as const;

export const isCategoryId = (value: string): value is CategoryId =>
  CATEGORIES.some((category) => category.id === value);

export const getCategory = (id: CategoryId): CategoryConfig =>
  CATEGORIES.find((category) => category.id === id) ?? CATEGORIES[0];

export const KIND_LABEL: Record<TitleKind, string> = {
  about: "Profile",
  work: "Experience",
  project: "Project",
  hackathon: "Hackathon",
  education: "Education",
  toolkit: "Technical Skills",
  activity: "Leadership",
  volunteering: "Volunteering",
  interest: "Personal",
  interactive: "Interactive",
};
