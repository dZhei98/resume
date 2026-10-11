import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/constants/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: ["selector"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#000000",
        secondary: "#FFFFFF",
        accent: "#84CC16",
        netflix: {
          red: "#E50914",
          "red-dark": "#B20710",
          bg: "#141414",
          surface: "#181818",
          elevated: "#2F2F2F",
          gray: "#808080",
          muted: "#B3B3B3",
          light: "#E5E5E5",
          green: "#46D369",
          button: "rgba(109,109,110,0.7)",
          "button-hover": "rgba(109,109,110,0.4)",
        },
      },
      fontFamily: {
        netflix: ["var(--font-netflix)", "Helvetica Neue", "Helvetica", "Arial", "sans-serif"],
        display: ["var(--font-display)", "Impact", "sans-serif"],
      },
      spacing: {
        gutter: "4%",
      },
    },
  },
  plugins: [],
};
export default config;
