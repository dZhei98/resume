"use client";

import ProfileLayout from "@/components/layout/ProfileLayout";
import {
  ACADEMICS_ACCENTS,
  getProjectAccents,
  getWorkAccents,
  TOOLKIT_ACCENTS,
} from "@/constants/accentColors";
import academicsData from "@/data/professional/academics.json";
import projectsData from "@/data/professional/projects.json";
import workData from "@/data/professional/work.json";
import backend from "@/data/skills/backend.json";
import communications from "@/data/skills/communications.json";
import database from "@/data/skills/database.json";
import devops from "@/data/skills/devops.json";
import devtools from "@/data/skills/devtools.json";
import frontend from "@/data/skills/frontend.json";
import toolkitIndex from "@/data/skills/index.json";
import ml from "@/data/skills/ml.json";
import programming from "@/data/skills/programming.json";
import {
  mapBulletItems,
  mapProjectItems,
  mapWorkItems,
} from "@/lib/contentMappers";
import { createHero } from "@/lib/hero";
import { getLinkedInUrl } from "@/lib/links";
import type { ContentRow } from "@/types";
import React from "react";

const hero = createHero({
  primaryCta: [{ label: "Download résumé", href: "/assets/Resume_Joshua Nee.pdf" }],
  secondaryCta: [{ label: "View LinkedIn", href: getLinkedInUrl() }],
  background:
    "radial-gradient(circle at 20% 18%, rgba(96,165,250,0.55), transparent 60%), radial-gradient(circle at 76% 16%, rgba(37,99,235,0.4), transparent 55%), linear-gradient(135deg, rgba(6,18,46,0.96), rgba(10,25,60,0.98))",
});

const workItems = mapWorkItems(workData.content, getWorkAccents("recruiter"));

const projectItems = mapProjectItems(
  projectsData.content.slice(0, 4),
  getProjectAccents("recruiter"),
  () => true
);

const academicsEntries = academicsData.content.map((entry, index) => ({
  organization: entry.institution,
  dateRange: entry.dateRange,
  bullets: entry.description.flatMap((item) => {
    if (typeof item === "string") {
      return [item];
    }
    if (
      item &&
      typeof item === "object" &&
      "title" in item &&
      Array.isArray(item.description)
    ) {
      return [`${item.title} ${item.description.join(", ")}`];
    }
    return [];
  }),
  accent: ACADEMICS_ACCENTS[index % ACADEMICS_ACCENTS.length],
  image: entry.image,
}));

const academicsItems = mapBulletItems(academicsEntries, (entry) => entry.organization ?? "");

const toolkitDataMap: Record<string, { skills: { name: string; level: string }[] } & {
  description?: string;
}> = {
  "skills/programming.json": programming,
  "skills/frontend.json": frontend,
  "skills/backend.json": backend,
  "skills/devops.json": devops,
  "skills/database.json": database,
  "skills/communications.json": communications,
  "skills/ml.json": ml,
  "skills/devtools.json": devtools,
};

const toolkitItems = toolkitIndex.sections
  .map((section, index) => {
    const data = toolkitDataMap[section.dataFile];
    if (!data) {
      return null;
    }

    const summary = section.tagline ?? data.description ?? "";

    return {
      title: section.name,
      meta: `${data.skills.length} tools`,
      accent: TOOLKIT_ACCENTS[index % TOOLKIT_ACCENTS.length],
      details: summary ? [summary] : [],
      skillBars: data.skills,
      imageSrc: section.image?.src,
      imageAlt: section.image?.alt,
    };
  })
  .filter(Boolean) as ContentRow["items"];

const rows: ContentRow[] = [
  {
    title: "Experience Spotlight",
    items: workItems,
    withDialog: true,
  },
  {
    title: "Academic Journey",
    items: academicsItems,
    withDialog: true,
  },
  {
    title: "Flagship Projects",
    items: projectItems,
    withDialog: true,
  },
  {
    title: "Toolkit Snapshot",
    items: toolkitItems,
    withDialog: true,
  },
];

const RecruiterPage: React.FC = () => {
  return (
    <ProfileLayout
      heading=""
      subheading=""
      navLabel="Recruiter"
      hero={hero}
      rows={rows}
    />
  );
};

export default RecruiterPage;
