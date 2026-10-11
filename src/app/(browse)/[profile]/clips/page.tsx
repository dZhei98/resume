import ClipsFeed from "@/components/browse/clips/ClipsFeed";
import { isProfileId } from "@/constants/profiles";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Clips",
};

export default async function ClipsPage({ params }: { params: Promise<{ profile: string }> }) {
  const { profile } = await params;
  if (!isProfileId(profile)) {
    notFound();
  }
  return <ClipsFeed />;
}
