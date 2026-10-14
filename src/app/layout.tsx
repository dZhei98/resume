import { displayFont, netflixSans } from '@/lib/fonts';
import { personJsonLd, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '@/lib/site';
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
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s | Joshua Nee",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Joshua Nee",
    "software engineer",
    "backend engineer",
    "full stack developer",
    "Carnegie Mellon University",
    "CMU MSE",
    "National University of Singapore",
    "DoorDash",
    "Shopee",
    "hackathon",
    "portfolio",
    "Golang",
    "TypeScript",
    "Python",
  ],
  authors: [{ name: "Joshua Nee", url: SITE_URL }],
  creator: "Joshua Nee",
  openGraph: {
    type: "profile",
    locale: "en_US",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    firstName: "Joshua",
    lastName: "Nee",
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    creator: "@dZhei98",
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
        className={`${netflixSans.variable} ${displayFont.variable} antialiased bg-netflix-bg text-neutral-100`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd()).replace(/</g, "\\u003c") }}
        />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
