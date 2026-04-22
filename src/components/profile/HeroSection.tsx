"use client";

import type { ProfileHero } from "@/types";
import { motion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { TypeAnimation } from "react-type-animation";

type HeroSectionProps = {
  hero: ProfileHero;
};

const HeroSection: React.FC<HeroSectionProps> = ({ hero }) => {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/5 bg-black/40">
      <div
        className="absolute inset-0 origin-center scale-100 blur-sm"
        style={{ background: hero.background }}
        aria-hidden
      />
      {hero.imageSrc && (
        <>
          <div
            className="pointer-events-none absolute inset-0 overflow-hidden"
            aria-hidden
          >
            <div className="relative flex h-full w-full justify-end">
              <Image
                src={hero.imageSrc}
                alt={hero.imageAlt ?? "Profile"}
                height={720}
                width={540}
                className={`h-full w-auto object-contain object-right ${hero.imageShadow ? "opacity-95" : ""}`}
                priority
                style={{
                  maskImage:
                    "linear-gradient(95deg, rgba(0,0,0,0) 18%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 92%)",
                  WebkitMaskImage:
                    "linear-gradient(95deg, rgba(0,0,0,0) 18%, rgba(0,0,0,0.45) 55%, rgba(0,0,0,0) 92%)",
                }}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-black/12 to-black/28" />
            </div>
          </div>
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-br from-black/62 via-black/48 to-black/36"
            aria-hidden
          />
        </>
      )}
      <div className="relative flex flex-col gap-6 rounded-3xl bg-gradient-to-b from-black/70 via-black/30 to-black/85 px-8 py-12 sm:px-12 sm:py-16">
        <div className="flex flex-col gap-6 sm:max-w-2xl">
          <div className="flex flex-col gap-4 sm:max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.4rem] text-red-400">
              {hero.eyebrow}
            </span>
            {Array.isArray(hero.typewriterSequence) &&
              hero.typewriterSequence.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="text-4xl font-bold sm:text-5xl"
              >
                <TypeAnimation
                  sequence={hero.typewriterSequence}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                  cursor
                />
              </motion.div>
            ) : (
              <motion.h2
                className="text-4xl font-bold sm:text-5xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                {hero.title}
              </motion.h2>
            )}
            <motion.p
              className="text-base text-neutral-200 sm:text-lg"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            >
              {hero.description}
            </motion.p>
          </div>

          <motion.div
            className="flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          >
            {hero.primaryCta?.map((cta) => (
              <a
                key={cta.href}
                href={cta.href}
                target={cta.href.startsWith("/") ? "_self" : "_blank"}
                rel={cta.href.startsWith("/") ? undefined : "noopener noreferrer"}
                className="rounded bg-white px-6 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 flex items-center gap-2"
              >
                {cta.icon ? (
                  <Image
                    src={`/assets/${cta.icon}`}
                    alt={cta.label}
                    width={16}
                    height={16}
                    className="inline-block"
                  />
                ) : null}
                {cta.label}
              </a>
            ))}
            {hero.secondaryCta?.map((cta) => (
              <a
                key={cta.href}
                href={cta.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-white/40 px-6 py-2 text-sm font-semibold text-white transition hover:border-white hover:bg-white/10"
              >
                {cta.label}
              </a>
            ))}
            {hero.badge && (
              <span className="rounded-full border border-white/30 px-4 py-1 text-xs uppercase tracking-wide text-neutral-200">
                {hero.badge}
              </span>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
