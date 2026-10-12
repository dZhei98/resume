import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  description:
    "Joshua Nee's background told as a terminal session: Master's in Software Engineering at Carnegie Mellon University, research, teaching, and coursework.",
  alternates: { canonical: "/terminal" },
};

export default function TerminalLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
