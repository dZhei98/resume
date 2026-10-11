import BrowseHome from "@/components/browse/home/BrowseHome";
import { getProfile, isProfileId } from "@/constants/profiles";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ profile: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { profile } = await params;
  return isProfileId(profile) ? { title: getProfile(profile).name } : {};
}

export default async function ProfileHomePage({ params }: PageProps) {
  const { profile } = await params;
  if (!isProfileId(profile)) {
    notFound();
  }
  return <BrowseHome profileId={profile} />;
}
