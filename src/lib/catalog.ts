import extracurricularsData from "@/data/personal/extracurriculars.json";
import interestsData from "@/data/personal/interests.json";
import volunteeringData from "@/data/personal/volunteering.json";
import academicsData from "@/data/professional/academics.json";
import projectsData from "@/data/professional/projects.json";
import workData from "@/data/professional/work.json";
import aboutData from "@/data/profile/about.json";
import backend from "@/data/skills/backend.json";
import communications from "@/data/skills/communications.json";
import database from "@/data/skills/database.json";
import devops from "@/data/skills/devops.json";
import devtools from "@/data/skills/devtools.json";
import frontend from "@/data/skills/frontend.json";
import toolkitIndex from "@/data/skills/index.json";
import ml from "@/data/skills/ml.json";
import programming from "@/data/skills/programming.json";
import { RESUME_HREF } from "@/constants/profiles";
import { formatYearLabel, parseDateRange, recencyKey } from "@/lib/dates";
import { getAllLinks } from "@/lib/links";
import type {
  Award,
  CategoryId,
  Episode,
  Skill,
  Title,
  TitleImage,
  TitleKind,
  TitleLink,
} from "@/types";

interface PresentationFields {
  readonly art?: string;
  readonly tint?: string;
}

interface RawImage {
  readonly src: string;
  readonly alt: string;
}

interface RawWork extends PresentationFields {
  readonly dateRange: string;
  readonly company: string;
  readonly position: string;
  readonly location: string;
  readonly image?: RawImage;
  readonly description: readonly string[];
}

interface RawProject extends PresentationFields {
  readonly title: string;
  readonly domain?: string;
  readonly type?: string;
  readonly dateRange?: string;
  readonly image?: RawImage;
  readonly description: readonly string[];
  readonly links?: readonly TitleLink[];
}

type RawAcademicItem = string | { readonly title: string; readonly description: readonly string[] };

interface RawAcademic extends PresentationFields {
  readonly dateRange: string;
  readonly institution: string;
  readonly image?: RawImage;
  readonly description: readonly RawAcademicItem[];
}

interface RawBulletEntry extends PresentationFields {
  readonly organization: string;
  readonly role?: string;
  readonly dateRange: string;
  readonly bullets: readonly string[];
  readonly image?: RawImage;
}

interface RawInterest extends PresentationFields {
  readonly label: string;
  readonly emoji?: string;
  readonly items: readonly string[];
}

interface RawToolkitSection extends PresentationFields {
  readonly name: string;
  readonly tagline?: string;
  readonly dataFile: string;
  readonly image?: RawImage;
}

interface RawInteractive extends PresentationFields {
  readonly slug: string;
  readonly name: string;
  readonly subtitle: string;
  readonly synopsis: string;
  readonly href: string;
  readonly image: RawImage;
}

export const ABOUT_SLUG = "joshua-nee";

export const TOP_HACKATHON_COUNT = 5;

const DEFAULT_TINT: Record<TitleKind, string> = {
  about: "#2b3446",
  work: "#4a1f1f",
  project: "#1f3346",
  hackathon: "#3a2350",
  education: "#4a3a1f",
  toolkit: "#1f4640",
  activity: "#4a1f3a",
  volunteering: "#2f4a1f",
  interest: "#46301f",
  interactive: "#262626",
};

const KIND_CATEGORY: Record<TitleKind, CategoryId | null> = {
  about: null,
  work: "experience",
  project: "projects",
  hackathon: "projects",
  education: "education",
  toolkit: "skills",
  activity: "personal",
  volunteering: "personal",
  interest: "personal",
  interactive: null,
};

const TOOLKIT_DATA: Record<string, { skills: readonly Skill[]; description?: string }> = {
  "skills/programming.json": programming,
  "skills/frontend.json": frontend,
  "skills/backend.json": backend,
  "skills/devops.json": devops,
  "skills/database.json": database,
  "skills/communications.json": communications,
  "skills/ml.json": ml,
  "skills/devtools.json": devtools,
};

const INTERACTIVE: readonly RawInteractive[] = [
  {
    slug: "terminal",
    name: "Terminal",
    subtitle: "Interactive · About Me",
    synopsis: "My background, told the way a shell would tell it: whoami, whereis, and cat.",
    href: "/terminal",
    image: { src: "/assets/terminal.png", alt: "Terminal" },
    tint: "#253241",
  },
  {
    slug: "qr-code",
    name: "QR Code",
    subtitle: "Interactive · Share",
    synopsis: "Scan-ready résumé and LinkedIn QR codes for career fairs and coffee chats.",
    href: "/qr",
    image: { src: "/assets/qr_code.png", alt: "QR code" },
    tint: "#2b2b2b",
  },
];

const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const PLACEMENTS = [
  { label: "1st Place", pattern: /\b(1st|first) place\b|\bplaced (1st|first)\b/i },
  { label: "2nd Place", pattern: /\b(2nd|second) place\b|\bplaced (2nd|second)\b/i },
  { label: "3rd Place", pattern: /\b(3rd|third) place\b|\bplaced (3rd|third)\b/i },
  { label: "4th Place", pattern: /\b(4th|fourth) place\b|\bplaced (4th|fourth)\b/i },
  { label: "5th Place", pattern: /\b(5th|fifth) place\b|\bplaced (5th|fifth)\b/i },
];

const parseAward = (text: string): Award | undefined => {
  const fieldMatch = text.match(/([\d,]+)\+?\s+(?:developers|participants|builders|projects|teams)/i);
  const field = fieldMatch ? Number(fieldMatch[1].replace(/,/g, "")) : undefined;

  const placementIndex = PLACEMENTS.findIndex(({ pattern }) => pattern.test(text));
  if (placementIndex !== -1) {
    return { label: PLACEMENTS[placementIndex].label, placement: placementIndex + 1, field };
  }
  if (/\b(2nd|second) runner-up\b/i.test(text)) {
    return { label: "3rd Place", placement: 3, field };
  }
  if (/\brunner-up\b/i.test(text)) {
    return { label: "2nd Place", placement: 2, field };
  }
  if (/\bwon\b|\baward\b/i.test(text)) {
    return { label: "Award Winner", placement: 1.5, field };
  }
  return undefined;
};

const logoImage = (image?: RawImage): TitleImage | undefined =>
  image ? { src: image.src, alt: image.alt, fit: "contain" } : undefined;

const numberedEpisodes = (label: string, bullets: readonly string[]): Episode[] =>
  bullets.map((text, index) => ({ title: `${label} ${index + 1}`, text }));

const listEpisode = (title: string, items: readonly string[]): Episode =>
  items.length === 1 ? { title, text: items[0] } : { title, items };

const dated = (dateRange: string) => {
  const { start, end } = parseDateRange(dateRange);
  return {
    dateRange,
    start,
    end,
    yearLabel: formatYearLabel(start, end),
  };
};

type TitleDraft = Omit<Title, "slug" | "category" | "tint" | "links"> &
  Partial<Pick<Title, "links">> & { readonly slugSource: string; readonly tint?: string };

const drafts: TitleDraft[] = [];

drafts.push({
  slugSource: ABOUT_SLUG,
  kind: "about",
  name: "Joshua Nee",
  subtitle: aboutData.description[0],
  synopsis: aboutData.description.slice(1, 3).join(" "),
  episodes: numberedEpisodes("Chapter", aboutData.description),
  image: { src: "/assets/profile_photo.png", alt: "Joshua Nee", fit: "cover" },
  links: [
    { label: "Résumé", url: RESUME_HREF },
    ...getAllLinks().map((link) => ({ label: link.label, url: link.url })),
  ],
});

(workData.content as readonly RawWork[]).forEach((entry) => {
  drafts.push({
    slugSource: entry.company,
    kind: "work",
    name: entry.company,
    subtitle: `${entry.position} · ${entry.location}`,
    ...dated(entry.dateRange),
    synopsis: entry.description[0] ?? "",
    episodes: numberedEpisodes("Contribution", entry.description),
    image: logoImage(entry.image),
    art: entry.art,
    tint: entry.tint,
  });
});

(academicsData.content as readonly RawAcademic[]).forEach((entry) => {
  const facts = entry.description.filter((item): item is string => typeof item === "string");
  const groups = entry.description.filter(
    (item): item is Exclude<RawAcademicItem, string> => typeof item !== "string"
  );
  const degree = facts[0] ?? "";

  drafts.push({
    slugSource: entry.institution,
    kind: "education",
    name: entry.institution,
    subtitle: degree,
    ...dated(entry.dateRange),
    synopsis: "",
    episodes: [
      ...groups.map((group) => listEpisode(group.title.replace(/:$/, ""), group.description)),
    ],
    image: logoImage(entry.image),
    art: entry.art,
    tint: entry.tint,
  });
});

(projectsData.content as readonly RawProject[]).forEach((entry) => {
  const isHackathon = (entry.type ?? "").toLowerCase() === "hackathon";
  const text = entry.description.join(" ");

  drafts.push({
    slugSource: entry.title,
    kind: isHackathon ? "hackathon" : "project",
    name: entry.title,
    domain: entry.domain,
    ...(entry.dateRange ? dated(entry.dateRange) : {}),
    synopsis: entry.description[0] ?? "",
    episodes: numberedEpisodes("Highlight", entry.description),
    image: logoImage(entry.image),
    art: entry.art,
    tint: entry.tint,
    links: entry.links ?? [],
    award: isHackathon ? parseAward(text) : undefined,
  });
});

(toolkitIndex.sections as readonly RawToolkitSection[]).forEach((section) => {
  const data = TOOLKIT_DATA[section.dataFile];
  if (!data) {
    return;
  }

  drafts.push({
    slugSource: section.name,
    kind: "toolkit",
    name: section.name,
    subtitle: `${data.skills.length} tools`,
    synopsis: section.tagline ?? data.description ?? "",
    episodes: [],
    skills: data.skills,
    image: logoImage(section.image),
    art: section.art,
    tint: section.tint,
  });
});

(extracurricularsData.items as readonly RawBulletEntry[]).forEach((entry) => {
  const [institution, ...rest] = entry.organization.split(", ");
  const name = rest.length ? rest.join(", ") : institution;

  drafts.push({
    slugSource: entry.organization,
    kind: "activity",
    name,
    subtitle: rest.length ? institution : undefined,
    ...dated(entry.dateRange),
    synopsis: entry.bullets[0] ?? "",
    episodes: numberedEpisodes("Contribution", entry.bullets),
    image: logoImage(entry.image),
    art: entry.art,
    tint: entry.tint,
  });
});

(volunteeringData.items as readonly RawBulletEntry[]).forEach((entry) => {
  drafts.push({
    slugSource: entry.organization,
    kind: "volunteering",
    name: entry.organization,
    subtitle: entry.role,
    ...dated(entry.dateRange),
    synopsis: entry.bullets[0] ?? "",
    episodes: numberedEpisodes("Contribution", entry.bullets),
    image: logoImage(entry.image),
    art: entry.art,
    tint: entry.tint,
  });
});

(interestsData.categories as readonly RawInterest[]).forEach((entry) => {
  drafts.push({
    slugSource: entry.label,
    kind: "interest",
    name: entry.label,
    subtitle: entry.emoji,
    synopsis: "",
    episodes: numberedEpisodes(entry.label === "Languages" ? "Language" : "Interest", entry.items),
    emoji: entry.emoji,
    art: entry.art,
    tint: entry.tint,
  });
});

INTERACTIVE.forEach((entry) => {
  drafts.push({
    slugSource: entry.slug,
    kind: "interactive",
    name: entry.name,
    subtitle: entry.subtitle,
    synopsis: entry.synopsis,
    episodes: [],
    href: entry.href,
    image: logoImage(entry.image),
    art: entry.art,
    tint: entry.tint,
  });
});

const buildCatalog = (): Title[] => {
  const used = new Set<string>();
  const titles = drafts.map(({ slugSource, tint, links, ...draft }): Title => {
    let slug = slugify(slugSource);
    if (used.has(slug)) {
      slug = `${slug}-${draft.kind}`;
    }
    used.add(slug);

    return {
      ...draft,
      slug,
      category: KIND_CATEGORY[draft.kind],
      tint: tint ?? DEFAULT_TINT[draft.kind],
      links: links ?? [],
    };
  });

  const ranked = titles
    .filter((title) => title.kind === "hackathon" && title.award)
    .sort((a, b) => recencyKey(b.start, b.end) - recencyKey(a.start, a.end));

  return titles.map((title) => {
    const rank = ranked.indexOf(title);
    return rank === -1 || rank >= TOP_HACKATHON_COUNT ? title : { ...title, rank: rank + 1 };
  });
};

export const CATALOG: readonly Title[] = buildCatalog();

const BY_SLUG = new Map(CATALOG.map((title) => [title.slug, title]));

export const getTitle = (slug: string): Title | undefined => BY_SLUG.get(slug);

export const getTitles = (slugs: readonly string[]): Title[] =>
  slugs.map((slug) => BY_SLUG.get(slug)).filter((title): title is Title => Boolean(title));

export const getTitlesByKind = (kind: TitleKind): Title[] =>
  CATALOG.filter((title) => title.kind === kind);

export const getTitlesByCategory = (category: CategoryId): Title[] =>
  CATALOG.filter((title) => title.category === category);

export const getTopHackathons = (): Title[] =>
  CATALOG.filter((title) => title.rank).sort((a, b) => (a.rank ?? 0) - (b.rank ?? 0));
