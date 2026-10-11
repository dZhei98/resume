import AnimatedBackground from "@/components/layout/AnimatedBackground";
import { ubuntuMono } from "@/lib/fonts";
import React from "react";

export default function StandaloneLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className={ubuntuMono.className}>
      <AnimatedBackground />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
