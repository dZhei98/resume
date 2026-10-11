import { Bebas_Neue, Inter, Ubuntu_Mono } from "next/font/google";

export const netflixSans = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-netflix",
});

export const displayFont = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

export const ubuntuMono = Ubuntu_Mono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  preload: true,
});
