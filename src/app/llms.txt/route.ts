import { CATALOG } from "@/lib/catalog";
import { SITE_DESCRIPTION, SITE_URL, titlePath } from "@/lib/site";
import type { Title, TitleKind } from "@/types";

export const dynamic = "force-static";

const SECTIONS: { kind: TitleKind; heading: string }[] = [
  { kind: "work", heading: "Experience" },
  { kind: "education", heading: "Education" },
  { kind: "hackathon", heading: "Hackathons" },
  { kind: "project", heading: "Projects" },
  { kind: "toolkit", heading: "Technical Skills" },
  { kind: "activity", heading: "Leadership & Activities" },
  { kind: "volunteering", heading: "Volunteering" },
  { kind: "interest", heading: "Interests" },
];

const absolute = (url: string) => (url.startsWith("/") ? `${SITE_URL}${encodeURI(url)}` : url);

const renderTitle = (title: Title): string => {
  const meta = [title.subtitle, title.domain, title.award?.label, title.dateRange]
    .filter((part) => part && part !== title.emoji)
    .join(" · ");
  const lines = [`### [${title.name}](${SITE_URL}${titlePath(title.slug)})`];
  if (meta) {
    lines.push(meta);
  }
  title.episodes.forEach((episode) => {
    if (episode.items) {
      lines.push(`- ${episode.title}:`, ...episode.items.map((item) => `  - ${item}`));
    } else if (episode.text) {
      lines.push(`- ${episode.text}`);
    }
  });
  if (title.skills?.length) {
    lines.push(`- ${title.skills.map((skill) => `${skill.name} (${skill.level})`).join(", ")}`);
  }
  title.links.forEach((link) => lines.push(`- ${link.label}: ${absolute(link.url)}`));
  return lines.join("\n");
};

export function GET() {
  const about = CATALOG.find((title) => title.kind === "about");
  const body = [
    "# Joshua Nee",
    `> ${SITE_DESCRIPTION}`,
    about?.episodes.map((episode) => episode.text).join("\n\n") ?? "",
    "## Links",
    [
      `- Website: ${SITE_URL}`,
      ...(about?.links ?? []).map((link) => `- ${link.label}: ${absolute(link.url)}`),
    ].join("\n"),
    ...SECTIONS.flatMap(({ kind, heading }) => {
      const titles = CATALOG.filter((title) => title.kind === kind);
      return titles.length ? [`## ${heading}`, ...titles.map(renderTitle)] : [];
    }),
  ].join("\n\n");

  return new Response(`${body}\n`, {
    headers: { "Content-Type": "text/markdown; charset=utf-8" },
  });
}
