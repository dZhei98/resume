"use client";

import ProfileLayout from "@/components/layout/ProfileLayout";
import { generateExtracurricularAccents } from "@/constants/accentColors";
import extracurriculars from "@/data/personal/extracurriculars.json";
import interests from "@/data/personal/interests.json";
import volunteering from "@/data/personal/volunteering.json";
import {
  mapBulletItems,
  mapCategoryItems,
} from "@/lib/contentMappers";
import { emojiDataUri } from "@/lib/emojiDataUri";
import { createHero } from "@/lib/hero";
import { getGitHubUrl, getLinkedInUrl, getTwitterUrl } from "@/lib/links";
import type { ContentRow } from "@/types";
import React from "react";

const hero = createHero({
  primaryCta: [
    { label: "Terminal", href: "/terminal", icon: "terminal.png" },
    { label: "QR Code", href: "/qr", icon: "qr_code.png" },
  ],
  secondaryCta: [
    { label: "LinkedIn", href: getLinkedInUrl() },
    { label: "Twitter", href: getTwitterUrl() },
    { label: "GitHub", href: getGitHubUrl() },
  ],
  background:
    "radial-gradient(circle at 15% 18%, rgba(248,113,113,0.45), transparent 55%), radial-gradient(circle at 80% 18%, rgba(220,38,38,0.38), transparent 50%), linear-gradient(135deg, rgba(32,6,10,0.95), rgba(45,8,12,0.92))",
});

const extracurricularItems = mapBulletItems(
  extracurriculars.items,
  (entry) => entry.organization ?? ""
);

const volunteeringItems = mapBulletItems(
  volunteering.items,
  (entry) => `${entry.role ?? ""}${entry.role ? " · " : ""}${entry.organization ?? ""}`
);

const extracurricularAccents = generateExtracurricularAccents(
  interests.categories.length
);

const interestCategories = interests.categories.map((category, index) => ({
  label: category.label,
  items: category.items,
  accent: extracurricularAccents[index],
  imageSrc: emojiDataUri(category.emoji ?? "✨"),
  imageAlt: `${category.emoji ?? ""} ${category.label}`.trim(),
}));

const interestItems = mapCategoryItems(interestCategories);

const rows: ContentRow[] = [
  {
    title: extracurriculars.title,
    items: extracurricularItems,
    withDialog: true,
  },
  {
    title: volunteering.title,
    items: volunteeringItems,
    withDialog: true,
  },
  {
    title: interests.title,
    items: interestItems,
    withDialog: true,
  },
];

const StalkerPage: React.FC = () => {
  return (
    <ProfileLayout
      heading=""
      subheading=""
      navLabel="Stalker"
      hero={hero}
      rows={rows}
    />
  );
};

export default StalkerPage;
