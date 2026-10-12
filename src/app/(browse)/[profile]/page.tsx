import BrowseHome from "@/components/browse/home/BrowseHome";
import { getProfile, isProfileId } from "@/constants/profiles";
import type { ProfileId } from "@/types";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

type PageProps = {
  params: Promise<{ profile: string }>;
};

const PROFILE_DESCRIPTION: Record<ProfileId, string> = {
  recruiter:
    "Joshua Nee's résumé: backend engineering at DoorDash and Shopee, a Master's in Software Engineering at Carnegie Mellon University, and top hackathon wins.",
  developer:
    "Joshua Nee's hackathon wins, engineering projects, and technical skills across Golang, TypeScript, Python, distributed systems, and machine learning.",
  stalker:
    "The personal side of Joshua Nee: leadership, volunteering, interests, languages, and interactive experiences.",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { profile } = await params;
  if (!isProfileId(profile)) {
    return {};
  }
  return {
    title: getProfile(profile).name,
    description: PROFILE_DESCRIPTION[profile],
    alternates: { canonical: getProfile(profile).href },
  };
}

export default async function ProfileHomePage({ params }: PageProps) {
  const { profile } = await params;
  if (!isProfileId(profile)) {
    notFound();
  }
  return <BrowseHome profileId={profile} />;
}
