import academicsData from "@/data/professional/academics.json";
import { CATALOG } from "@/lib/catalog";
import { getAllLinks } from "@/lib/links";

export const SITE_URL = "https://joshuanee.vercel.app";

export const SITE_NAME = "Joshua Nee | Software Engineer";

export const SITE_DESCRIPTION =
  "Joshua Nee is a software engineer pursuing a Master's in Software Engineering at Carnegie Mellon University, with backend experience at DoorDash and Shopee and 8 hackathon wins.";

export const personJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${SITE_URL}/#person`,
  name: "Joshua Nee",
  url: SITE_URL,
  image: `${SITE_URL}/assets/profile_photo.png`,
  jobTitle: "Software Engineer",
  description: SITE_DESCRIPTION,
  alumniOf: academicsData.content.map((entry) => ({
    "@type": "EducationalOrganization",
    name: entry.institution,
  })),
  knowsAbout: [
    ...new Set(CATALOG.flatMap((title) => title.skills?.map((skill) => skill.name) ?? [])),
  ],
  sameAs: getAllLinks().map((link) => link.url),
});
