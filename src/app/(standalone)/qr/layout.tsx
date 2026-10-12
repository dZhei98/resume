import type { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "QR Codes",
  robots: { index: false, follow: true },
};

export default function QrLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
