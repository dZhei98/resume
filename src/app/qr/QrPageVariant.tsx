"use client";

import academicsData from "@/data/professional/academics.json";
import workData from "@/data/professional/work.json";
import { getQrImageUrl } from "@/lib/qr";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const LEFT_CARD_TRANSFORM = "perspective(1400px) rotateY(12deg) rotateX(-2deg)";
const RIGHT_CARD_TRANSFORM = "perspective(1400px) rotateY(-12deg) rotateX(-2deg)";
const LOGO_BACKDROP = "from-[#3b3b40] via-[#1b1b20] to-[#0b0b0e]";
const SITE_URL = "http://joshuanee.vercel.app/";

const educationItems = academicsData.content.slice(0, 2).map((entry) => ({
  title: entry.institution,
  content: typeof entry.description[0] === "string" ? entry.description[0] : "",
  image: entry.image,
}));

const experienceItems = workData.content.slice(0, 2).map((entry) => ({
  title: entry.company,
  content: `${entry.position} · ${entry.location}`,
  image: entry.image,
}));

type QrPageVariantProps = {
  destinationHref: string;
  qrImagePath: string;
  qrAlt: string;
  qrAriaLabel: string;
  activeVariant: "resume" | "linkedin";
};

const variantLinks = [
  { key: "resume", label: "Resume", href: "/qr/resume" },
  { key: "linkedin", label: "LinkedIn", href: "/qr/linkedin" },
] as const;

function QrVariantToggle({ activeVariant }: { activeVariant: QrPageVariantProps["activeVariant"] }) {
  return (
    <nav aria-label="QR destination" className="mt-4 inline-flex rounded-full border border-white/15 bg-black/45 p-1 shadow-[0_0_28px_rgba(0,0,0,0.35)] backdrop-blur-xl">
      {variantLinks.map((variant) => {
        const isActive = variant.key === activeVariant;
        const activeClasses =
          variant.key === "linkedin"
            ? "border-sky-300/50 bg-sky-500/20 text-sky-100 shadow-[0_0_22px_rgba(56,189,248,0.24)]"
            : "border-red-300/50 bg-red-500/20 text-red-100 shadow-[0_0_22px_rgba(239,68,68,0.24)]";

        return (
          <Link
            key={variant.key}
            href={variant.href}
            aria-current={isActive ? "page" : undefined}
            className={`rounded-full border px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.24em] transition hover:border-white/30 hover:text-white sm:px-4 sm:text-xs ${isActive ? activeClasses : "border-transparent text-white/45"
              }`}
          >
            {variant.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default function QrPageVariant({
  destinationHref,
  qrImagePath,
  qrAlt,
  qrAriaLabel,
  activeVariant,
}: QrPageVariantProps) {
  const [qrImageSrc, setQrImageSrc] = useState(qrImagePath);
  const [qrAssetFailed, setQrAssetFailed] = useState(false);

  const handleQrAssetError = () => {
    if (qrAssetFailed) {
      return;
    }

    setQrAssetFailed(true);
    setQrImageSrc(
      getQrImageUrl(new URL(destinationHref, window.location.origin).toString(), 420)
    );
  };

  return (
    <div className="min-h-screen overflow-hidden text-white">
      <main className="relative isolate mx-auto flex min-h-screen w-full max-w-7xl flex-col px-3 pb-4 pt-6 sm:px-6 lg:px-8 lg:pb-6 lg:pt-8">
        <div className="mb-4 shrink-0 sm:mb-5">
          <Link
            href="/stalker"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.35em] text-white/70 transition hover:border-white/30 hover:text-white"
          >
            <span className="text-base leading-none">{"<"}</span>
            Back
          </Link>
        </div>

        <div className="relative flex flex-col pt-3 pb-4 sm:pt-4 sm:pb-5">
          <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[32px] bg-[radial-gradient(circle_at_top,rgba(229,9,20,0.28),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.04),transparent_22%),linear-gradient(135deg,#050505,#111111_52%,#050505)]" />
          <motion.div
            className="pointer-events-none absolute inset-x-[12%] top-[16%] -z-10 h-48 rounded-full bg-red-600/20 blur-3xl"
            animate={{ x: [0, 16, -12, 0], opacity: [0.45, 0.6, 0.5, 0.45] }}
            transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(transparent_0%,rgba(255,255,255,0.035)_50%,transparent_100%)] bg-[length:100%_10px] opacity-20" />

          <section className="hidden flex-1 items-center gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,420px)_minmax(0,1fr)]">
            <div className="space-y-4">
              {educationItems.map((item) => (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-[30px] border border-red-500/25 bg-black/45 p-4 shadow-[0_0_36px_rgba(239,68,68,0.16),0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                  style={{ transform: LEFT_CARD_TRANSFORM, transformOrigin: "right center" }}
                >
                  <div className="pointer-events-none absolute inset-[1px] rounded-[28px] bg-[linear-gradient(160deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_30%,rgba(239,68,68,0.16)_100%)] opacity-80" />
                  <div className="pointer-events-none absolute -left-10 top-8 h-28 w-28 rounded-full bg-red-500/20 blur-3xl" />
                  <div className="pointer-events-none absolute -inset-px rounded-[30px] border border-red-200/10" />
                  <div className={`relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${LOGO_BACKDROP} ring-1 ring-red-200/20`}>
                    <Image src={item.image.src} alt={item.image.alt} fill className="object-contain p-5 transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_42%),linear-gradient(to_top,rgba(0,0,0,0.38),transparent_55%)]" />
                  </div>
                  <p className="relative mt-2 text-lg font-semibold uppercase tracking-[0.16em] text-neutral-100">{item.title}</p>
                  <p className="relative mt-2 text-xs uppercase tracking-[0.14em] text-neutral-300/85">{item.content}</p>
                </article>
              ))}
            </div>

            <div className="flex flex-col items-center gap-5">
              <header className="text-center">
                <div className="relative inline-flex flex-col items-center">
                  <div className="pointer-events-none absolute inset-x-[18%] top-4 h-8 rounded-full bg-red-500/20 blur-2xl" />
                  <p className="relative bg-gradient-to-b from-white via-white to-red-100 bg-clip-text text-[clamp(2.35rem,5.4vw,5rem)] font-bold uppercase tracking-[0.32em] text-transparent drop-shadow-[0_8px_28px_rgba(255,255,255,0.12)]">
                    Joshua Nee
                  </p>
                </div>
                <div className="mx-auto mt-3 h-px w-32 bg-gradient-to-r from-transparent via-red-500/90 to-transparent" />
                <p className="mt-3 text-xs uppercase tracking-[0.45em] text-red-300/90 sm:text-sm">{SITE_URL}</p>
                <QrVariantToggle activeVariant={activeVariant} />
              </header>

              <div className="group relative mx-auto flex items-center justify-center overflow-hidden rounded-[30px] border border-red-500/25 bg-black/45 p-5 shadow-[0_0_36px_rgba(239,68,68,0.16),0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-[1px] rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_32%,rgba(239,68,68,0.16)_100%)] opacity-80" />
                <div className="pointer-events-none absolute left-1/2 top-0 h-28 w-36 -translate-x-1/2 rounded-full bg-red-500/20 blur-3xl" />
                <div className="pointer-events-none absolute -inset-px rounded-[30px] border border-red-200/10" />
                <motion.div
                  className="absolute inset-3 rounded-[26px] border border-red-400/15"
                  animate={{ opacity: [0.35, 0.6, 0.35] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                />
                <Link
                  href={destinationHref}
                  aria-label={qrAriaLabel}
                  className="relative block h-[320px] w-[320px] overflow-hidden rounded-[28px] p-2 shadow-[0_0_50px_rgba(229,9,20,0.18)] transition hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300 xl:h-[360px] xl:w-[360px]"
                >
                  {qrImageSrc ? (
                    <Image src={qrImageSrc} alt={qrAlt} fill className="object-contain p-5" unoptimized onError={handleQrAssetError} />
                  ) : null}
                </Link>
              </div>

              <footer className="text-center text-sm uppercase tracking-[0.34em] text-red-100/85 sm:text-base">
                <div>DESIGNING <span className="text-red-500">EXPERIENCES.</span></div>
                <div className="mt-1.5">DEVELOPING <span className="text-red-500">SOLUTIONS.</span></div>
              </footer>
            </div>

            <div className="space-y-4">
              {experienceItems.map((item) => (
                <article
                  key={item.title}
                  className="group relative overflow-hidden rounded-[30px] border border-red-500/25 bg-black/45 p-4 shadow-[0_0_36px_rgba(239,68,68,0.16),0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl"
                  style={{ transform: RIGHT_CARD_TRANSFORM, transformOrigin: "left center" }}
                >
                  <div className="pointer-events-none absolute inset-[1px] rounded-[28px] bg-[linear-gradient(200deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_30%,rgba(239,68,68,0.16)_100%)] opacity-80" />
                  <div className="pointer-events-none absolute -right-10 top-8 h-28 w-28 rounded-full bg-red-500/20 blur-3xl" />
                  <div className="pointer-events-none absolute -inset-px rounded-[30px] border border-red-200/10" />
                  <div className={`relative mb-4 aspect-[4/3] overflow-hidden rounded-2xl bg-gradient-to-br ${LOGO_BACKDROP} ring-1 ring-red-200/20`}>
                    <Image src={item.image.src} alt={item.image.alt} fill className="object-contain p-5 transition duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_42%),linear-gradient(to_top,rgba(0,0,0,0.38),transparent_55%)]" />
                  </div>
                  <p className="relative mt-2 text-lg font-semibold uppercase tracking-[0.16em] text-neutral-100">{item.title}</p>
                  <p className="relative mt-2 text-xs uppercase tracking-[0.14em] text-neutral-300/85">{item.content}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="flex flex-1 flex-col items-center justify-center gap-4 lg:hidden">
            <div className="grid w-full max-w-[320px] grid-cols-2 gap-3">
              {experienceItems.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br ${LOGO_BACKDROP}`}>
                    <Image src={item.image.src} alt={item.image.alt} fill className="object-contain p-3" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_42%),linear-gradient(to_top,rgba(0,0,0,0.28),transparent_55%)]" />
                  </div>
                  <p className="mt-2 text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-neutral-100">{item.title}</p>
                </article>
              ))}
            </div>

            <div className="flex flex-col items-center justify-center gap-3">
              <header className="text-center">
                <div className="relative inline-flex flex-col items-center">
                  <div className="pointer-events-none absolute inset-x-[16%] top-3 h-7 rounded-full bg-red-500/20 blur-2xl" />
                  <p className="relative whitespace-nowrap bg-gradient-to-b from-white via-white to-red-100 bg-clip-text text-[clamp(1.2rem,5.1vw,2.35rem)] font-bold uppercase tracking-[0.12em] text-transparent drop-shadow-[0_8px_28px_rgba(255,255,255,0.12)]">
                    Joshua Nee
                  </p>
                </div>
                <div className="mx-auto mt-2 h-px w-24 bg-gradient-to-r from-transparent via-red-500/90 to-transparent" />
                <p className="mt-2 text-[10px] uppercase tracking-[0.22em] text-red-300/90">{SITE_URL}</p>
                <QrVariantToggle activeVariant={activeVariant} />
              </header>

              <div className="relative w-full max-w-[286px] overflow-hidden rounded-[30px] border border-red-500/25 bg-black/45 p-4 shadow-[0_0_36px_rgba(239,68,68,0.16),0_24px_80px_rgba(0,0,0,0.55)] backdrop-blur-xl">
                <div className="pointer-events-none absolute inset-[1px] rounded-[28px] bg-[linear-gradient(180deg,rgba(255,255,255,0.12),rgba(255,255,255,0.02)_32%,rgba(239,68,68,0.16)_100%)] opacity-80" />
                <div className="pointer-events-none absolute -inset-px rounded-[30px] border border-red-200/10" />
                <Link
                  href={destinationHref}
                  aria-label={qrAriaLabel}
                  className="relative block aspect-square overflow-hidden rounded-[24px] p-2 transition hover:scale-[1.01] focus:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                >
                  {qrImageSrc ? (
                    <Image src={qrImageSrc} alt={qrAlt} fill className="object-contain p-4" unoptimized onError={handleQrAssetError} />
                  ) : null}
                </Link>
              </div>

              <footer className="text-center text-sm uppercase tracking-[0.24em] text-red-100/85">
                <div>DESIGNING <span className="text-red-500">EXPERIENCES.</span></div>
                <div className="mt-1">DEVELOPING <span className="text-red-500">SOLUTIONS.</span></div>
              </footer>
            </div>

            <div className="grid w-full max-w-[320px] grid-cols-2 gap-3">
              {educationItems.map((item) => (
                <article key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-xl bg-gradient-to-br ${LOGO_BACKDROP}`}>
                    <Image src={item.image.src} alt={item.image.alt} fill className="object-contain p-3" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.14),transparent_42%),linear-gradient(to_top,rgba(0,0,0,0.28),transparent_55%)]" />
                  </div>
                  <p className="mt-2 text-[10px] font-semibold uppercase leading-tight tracking-[0.12em] text-neutral-100">{item.title}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
