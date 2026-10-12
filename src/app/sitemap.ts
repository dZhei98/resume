import { CATEGORIES } from "@/constants/categories";
import { PROFILES } from "@/constants/profiles";
import { INDEXED_TITLES, SITE_URL, titlePath } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...PROFILES.map((profile) => profile.href),
    ...CATEGORIES.map((category) => `/recruiter/genre/${category.id}`),
    ...INDEXED_TITLES.map((title) => titlePath(title.slug)),
    "/terminal",
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path === "/" ? "" : path}` }));
}
