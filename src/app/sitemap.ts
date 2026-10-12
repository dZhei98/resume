import { CATEGORIES } from "@/constants/categories";
import { PROFILES } from "@/constants/profiles";
import { SITE_URL } from "@/lib/site";
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    ...PROFILES.map((profile) => profile.href),
    ...CATEGORIES.map((category) => `/recruiter/genre/${category.id}`),
    "/terminal",
  ];
  return paths.map((path) => ({ url: `${SITE_URL}${path === "/" ? "" : path}` }));
}
