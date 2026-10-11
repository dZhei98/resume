"use client";

import academicsData from "@/data/professional/academics.json";
import figlet from "figlet";
import standardFont from "figlet/fonts/Standard";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ColorMode, TerminalOutput } from "react-terminal-ui";
import tinygradient from "tinygradient";
import "./terminal.css";

const Terminal = dynamic(
  () => import("react-terminal-ui").then((mod) => mod.default),
  { ssr: false }
);

figlet.parseFont("Standard", standardFont);

const lolcatGradient = tinygradient([
  { color: "#22c55e", pos: 0 },
  { color: "#86efac", pos: 0.45 },
  { color: "#a3e635", pos: 0.65 },
  { color: "#facc15", pos: 0.8 },
  { color: "#f97316", pos: 1 },
]);

const figletText = figlet.textSync("About Me", {
  horizontalLayout: "default",
  verticalLayout: "default",
});
const rawFigletLines = figletText.split("\n");
let figletStart = 0;
let figletEnd = rawFigletLines.length;
while (figletStart < figletEnd && rawFigletLines[figletStart].trim() === "") {
  figletStart += 1;
}
while (figletEnd > figletStart && rawFigletLines[figletEnd - 1].trim() === "") {
  figletEnd -= 1;
}
const asciiLines = rawFigletLines.slice(figletStart, figletEnd);
const lolcatLines = asciiLines.map((line) => {
  const colors = lolcatGradient.hsv(Math.max(line.length, 1), "short");
  return line.split("").map((char, index) => ({
    char,
    color: colors[index]?.toHexString() ?? "#e2e8f0",
  }));
});

const academicEntry = academicsData.content?.[0];
const academicText = (academicEntry?.description ?? [])
  .map((entry) => {
    if (typeof entry === "string") {
      return entry;
    }
    if (entry && typeof entry === "object" && "title" in entry) {
      const details = Array.isArray(entry.description)
        ? entry.description.map((item: string) => `  - ${item}`)
        : [];
      return [entry.title, ...details].join("\n");
    }
    return "";
  })
  .filter(Boolean)
  .join("\n");

const PromptLine = ({ text, delay = 0 }: { text: string; delay?: number }) => (
  <TerminalOutput>
    <span
      className="inline-flex items-center gap-2 text-slate-100 animate-line-in motion-reduce:animate-none"
      style={{ animationDelay: `${delay}s` }}
    >
      <span className="text-emerald-400">➜</span>
      <span className="text-emerald-300">~</span>
      <span>{text}</span>
    </span>
  </TerminalOutput>
);

const OutputLine = ({ text, delay = 0 }: { text: string; delay?: number }) => (
  <TerminalOutput>
    <span
      className="text-slate-200 animate-line-in motion-reduce:animate-none"
      style={{ animationDelay: `${delay}s` }}
    >
      {text}
    </span>
  </TerminalOutput>
);

const TerminalPage = () => {
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const handleTerminalBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }
    router.push("/stalker");
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen text-slate-100">
      <div className="mx-auto w-full max-w-6xl px-6 pb-20 pt-10">
        <Link
          href="/stalker"
          className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70 transition hover:border-white/30 hover:text-white"
        >
          <span className="text-base leading-none">{"<"}</span>
          Back
        </Link>

        <div className="relative mt-10" style={{ opacity: isReady ? 1 : 0, transition: 'opacity 0.3s ease-in' }}>
          <div className="terminal-shell animate-terminal-in motion-reduce:animate-none">
            <Terminal
              name="Terminal"
              colorMode={ColorMode.Dark}
              height="auto"
              redBtnCallback={handleTerminalBack}
              yellowBtnCallback={handleTerminalBack}
              greenBtnCallback={handleTerminalBack}
            >
              <PromptLine text='figlet "About Me" | lolcat' delay={0.1} />
              <TerminalOutput>
                <pre
                  className="text-[clamp(1rem,2.6vw,1.7rem)] leading-tight animate-line-in motion-reduce:animate-none"
                  style={{ animationDelay: "0.18s" }}
                >{lolcatLines.map((line, lineIndex) => (
                  <span key={`lolcat-line-${lineIndex}`}>
                    {line.map((cell, cellIndex) => (
                      <span
                        key={`lolcat-cell-${lineIndex}-${cellIndex}`}
                        style={{ color: cell.color }}
                      >
                        {cell.char}
                      </span>
                    ))}
                    {lineIndex < lolcatLines.length - 1 ? "\n" : ""}
                  </span>
                ))}</pre>
              </TerminalOutput>

              <PromptLine text="whoami" delay={0.3} />
              <OutputLine text="joshua.nee" delay={0.36} />

              <PromptLine text="whereis Joshua" delay={0.42} />
              <OutputLine text="Joshua: University/Masters/Carnegie Mellon University" delay={0.48} />

              <PromptLine
                text='stat -f "Joined at: %Sm %Sd %SY" University/Masters/Carnegie Mellon University'
                delay={0.54}
              />
              <OutputLine text="Joined at: Aug 25 2025" delay={0.6} />

              <PromptLine text="cat /University/Masters/Carnegie Mellon University" delay={0.66} />
              <TerminalOutput>
                <pre
                  className="text-slate-200 leading-relaxed whitespace-pre-wrap break-words animate-line-in motion-reduce:animate-none"
                  style={{ animationDelay: "0.72s" }}
                >{academicText}</pre>
              </TerminalOutput>
            </Terminal>
          </div>

          <div className="relative z-10 mx-auto mt-10 w-52 sm:w-64 lg:absolute lg:right-6 lg:top-6 lg:mt-0 lg:w-72 lg:translate-x-0 animate-photo-in motion-reduce:animate-none">
            <div className="rounded-full border border-white/20 bg-white/5 p-2 shadow-[0_25px_60px_rgba(0,0,0,0.55)]">
              <Image
                src="/assets/profile_photo.png"
                alt="Joshua Nee"
                width={520}
                height={520}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TerminalPage;
