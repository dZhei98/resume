import SearchView from "@/components/browse/search/SearchView";
import { isProfileId } from "@/constants/profiles";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Search",
};

export default async function SearchPage({ params }: { params: Promise<{ profile: string }> }) {
  const { profile } = await params;
  if (!isProfileId(profile)) {
    notFound();
  }
  return <SearchView profileId={profile} />;
}
