import BrowseHome from "@/components/browse/home/BrowseHome";
import { CATEGORIES, getCategory, isCategoryId } from "@/constants/categories";
import { isProfileId } from "@/constants/profiles";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ profile: string; category: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((category) => ({ category: category.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { category } = await params;
  if (!isCategoryId(category)) {
    return {};
  }
  return {
    title: getCategory(category).label,
    alternates: { canonical: `/recruiter/genre/${category}` },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { profile, category } = await params;
  if (!isProfileId(profile) || !isCategoryId(category)) {
    notFound();
  }
  return <BrowseHome profileId={profile} category={category} />;
}
