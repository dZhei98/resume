import BrowseHome from "@/components/browse/home/BrowseHome";
import { isProfileId } from "@/constants/profiles";
import { getTitle } from "@/lib/catalog";
import { INDEXED_TITLES, titlePath } from "@/lib/site";
import type { Title } from "@/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ profile: string; slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return INDEXED_TITLES.map((title) => ({ slug: title.slug }));
}

const describe = (title: Title): string => {
  const parts = [
    title.subtitle,
    title.synopsis,
    ...title.episodes.flatMap((episode) => episode.items ?? [episode.text ?? ""]),
    ...(title.skills ?? []).map((skill) => skill.name),
  ];
  const text = [...new Set(parts.filter(Boolean))].join(". ");
  return text.length > 160 ? `${text.slice(0, 157).trimEnd()}...` : text;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = getTitle(slug);
  if (!title) {
    return {};
  }
  return {
    title: title.name,
    description: describe(title),
    alternates: { canonical: titlePath(slug) },
  };
}

export default async function TitlePage({ params }: PageProps) {
  const { profile, slug } = await params;
  if (!isProfileId(profile) || !getTitle(slug)) {
    notFound();
  }
  return <BrowseHome profileId={profile} />;
}
