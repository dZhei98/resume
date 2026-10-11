import { getGitHubUrl, getLinkedInUrl } from "@/lib/links";
import type { ProfileConfig, ProfileId } from "@/types";

export const RESUME_HREF = "/assets/Resume_Joshua Nee.pdf";

export const PROFILES: readonly ProfileConfig[] = [
  {
    id: "recruiter",
    name: "Recruiter",
    href: "/recruiter",
    avatar: "/assets/avatars/recruiter.svg",
    tagline: "Hiring-focused impact snapshots & role-fit summaries",
    heroAction: { label: "Résumé", href: RESUME_HREF },
  },
  {
    id: "developer",
    name: "Developer",
    href: "/developer",
    avatar: "/assets/avatars/developer.svg",
    tagline: "Deep technical notes, architecture & repos",
    heroAction: { label: "GitHub", href: getGitHubUrl() },
  },
  {
    id: "stalker",
    name: "Stalker",
    href: "/stalker",
    avatar: "/assets/avatars/stalker.svg",
    tagline: "Personal backstory, socials & curiosities",
    heroAction: { label: "LinkedIn", href: getLinkedInUrl() },
  },
] as const;

export const isProfileId = (value: string): value is ProfileId =>
  PROFILES.some((profile) => profile.id === value);

export const getProfile = (id: ProfileId): ProfileConfig =>
  PROFILES.find((profile) => profile.id === id) ?? PROFILES[0];
