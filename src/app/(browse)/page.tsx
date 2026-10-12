import ProfileGate from "@/components/gate/ProfileGate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return <ProfileGate />;
}
