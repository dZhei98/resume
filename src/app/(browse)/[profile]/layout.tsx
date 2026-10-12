import Footer from "@/components/browse/shell/Footer";
import TopNav from "@/components/browse/shell/TopNav";
import TitleModal from "@/components/browse/modal/TitleModal";
import { isProfileId, PROFILES } from "@/constants/profiles";
import { notFound } from "next/navigation";
import React from "react";

export const dynamicParams = false;

export function generateStaticParams() {
  return PROFILES.map((profile) => ({ profile: profile.id }));
}

export default async function ProfileLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ profile: string }>;
}>) {
  const { profile } = await params;
  if (!isProfileId(profile)) {
    notFound();
  }

  return (
    <>
      <TopNav profileId={profile} />
      <main>{children}</main>
      <Footer />
      <TitleModal profileId={profile} />
    </>
  );
}
