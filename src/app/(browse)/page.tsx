import ProfileGate from "@/components/gate/ProfileGate";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Who's watching?",
};

export default function HomePage() {
  return <ProfileGate />;
}
