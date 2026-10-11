import { displayFont, netflixSans } from '@/lib/fonts';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from "next";
import React from 'react';
import '../styles/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#141414',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://joshuanee.vercel.app/'),
  title: {
    default: "Joshua Nee | Software Engineer",
    template: "%s | Joshua Nee",
  },
  description:
    "Software Engineer portfolio - CMU Master's student in Software Engineering, former Shopee backend engineer. Specializing in backend development, full-stack applications, and enterprise-scale systems.",
  keywords: [
    "Joshua Nee",
    "software engineer",
    "backend developer",
    "full stack developer",
    "CMU",
    "Carnegie Mellon University",
    "Shopee",
    "portfolio",
    "Next.js",
    "React",
    "TypeScript",
    "Golang",
    "Python",
  ],
  authors: [{ name: "Joshua Nee" }],
  creator: "Joshua Nee",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Joshua Nee | Software Engineer",
    title: "Joshua Nee | Software Engineer",
    description:
      "CMU Master's student & former Shopee backend engineer. Explore my projects, experience, and technical skills.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Joshua Nee | Software Engineer",
    description:
      "CMU Master's student & former Shopee backend engineer. Explore my projects, experience, and technical skills.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${netflixSans.variable} ${displayFont.variable} antialiased bg-[#141414] text-neutral-100`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
