import React from "react";

export default function BrowseGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-netflix-bg font-netflix text-white">{children}</div>;
}
