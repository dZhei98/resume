"use client";

import { TopBadge } from "@/components/browse/ui/Badges";
import { NfButton } from "@/components/browse/ui/Buttons";
import TitleArt from "@/components/browse/ui/TitleArt";
import { RESUME_HREF } from "@/constants/profiles";
import { getLinkedInUrl } from "@/lib/links";
import type { Episode, Skill, Title, TitleLink } from "@/types";
import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import React from "react";
import { IoLogoLinkedin, IoPlay } from "react-icons/io5";

export const FOCUS_RING =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white";

const isExternalUrl = (url: string) => /^https?:\/\//.test(url);

export const getDisplaySynopsis = (title: Title): string | null =>
  title.synopsis &&
  !title.episodes
    .map((episode) => episode.text)
    .join(" ")
    .includes(title.synopsis)
    ? title.synopsis
    : null;

export const EpisodeBody: React.FC<{ episode: Episode; className?: string }> = ({
  episode,
  className = "",
}) => (
  <div className={`space-y-1.5 leading-relaxed text-netflix-muted ${className}`}>
    {episode.text && <p>{episode.text}</p>}
    {episode.items && (
      <ul className="space-y-1">
        {episode.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    )}
  </div>
);

export const getJumpLabel = (title: Title): "Episodes" | "Proficiency" | null =>
  title.episodes.length ? "Episodes" : title.skills?.length ? "Proficiency" : null;

export const TitleMedia: React.FC<{ title: Title; sizes: string }> = ({ title, sizes }) =>
  title.kind === "about" && title.image ? (
    <Image
      src={title.image.src}
      alt={title.image.alt}
      fill
      priority
      sizes={sizes}
      className="object-cover object-top"
    />
  ) : (
    <TitleArt
      title={title}
      showName={false}
      priority
      sizes={sizes}
      logoBadgeClassName="left-3 top-3 h-12 w-12 rounded-md md:left-6 md:top-6 md:h-16 md:w-16"
    />
  );

type PrimaryActionProps = {
  title: Title;
  size: "md" | "lg";
  onJump: () => void;
  className?: string;
};

export const PrimaryAction: React.FC<PrimaryActionProps> = ({
  title,
  size,
  onJump,
  className = "",
}) => {
  const icon = (
    <IoPlay aria-hidden className={size === "lg" ? "text-2xl md:text-3xl" : "text-2xl"} />
  );
  const [link] = title.links;
  const jumpLabel = getJumpLabel(title);

  if (title.kind === "interactive" && title.href) {
    return (
      <NfButton size={size} icon={icon} href={title.href} className={className}>
        Play
      </NfButton>
    );
  }

  if (title.kind === "about") {
    return (
      <NfButton size={size} icon={icon} href={RESUME_HREF} className={className}>
        Résumé
      </NfButton>
    );
  }

  if (link) {
    return (
      <NfButton size={size} icon={icon} href={link.url} className={className}>
        {link.label}
      </NfButton>
    );
  }

  return jumpLabel ? (
    <NfButton size={size} icon={icon} onClick={onJump} className={className}>
      {jumpLabel}
    </NfButton>
  ) : null;
};

export const SecondaryAction: React.FC<{ title: Title; size: "md" | "lg"; className?: string }> = ({
  title,
  size,
  className = "",
}) =>
  title.kind === "about" ? (
    <NfButton
      variant="secondary"
      size={size}
      href={getLinkedInUrl()}
      icon={<IoLogoLinkedin aria-hidden className={size === "lg" ? "text-2xl md:text-3xl" : "text-2xl"} />}
      className={`bg-[rgba(42,42,42,0.75)] backdrop-blur-sm hover:bg-[rgba(70,70,70,0.85)] ${className}`}
    >
      LinkedIn
    </NfButton>
  ) : null;

export const TitleBadges: React.FC<{ title: Title; rankClassName: string }> = ({
  title,
  rankClassName,
}) => {
  if (!title.rank) {
    return null;
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <span className="inline-flex items-center gap-2">
        <TopBadge />
        <span className={`text-white ${rankClassName}`}>
          #{title.rank} in Hackathons Today
        </span>
      </span>
    </div>
  );
};

export const InfoLine: React.FC<{ label: string; children: React.ReactNode }> = ({
  label,
  children,
}) => (
  <p className="leading-snug">
    <span className="text-netflix-gray">{label}: </span>
    <span className="text-white">{children}</span>
  </p>
);

export const LinkAnchor: React.FC<{ link: TitleLink; className?: string }> = ({
  link,
  className = "",
}) => {
  const external = isExternalUrl(link.url);

  return (
    <a
      href={link.url}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={`${FOCUS_RING} ${className}`}
    >
      {link.label}
    </a>
  );
};

const LEVEL_FILL: Record<string, number> = {
  proficient: 100,
  experienced: 75,
  intermediate: 50,
};

export const SkillBars: React.FC<{ skills: readonly Skill[]; className?: string }> = ({
  skills,
  className = "",
}) => {
  const reduceMotion = useReducedMotion();

  return (
    <ul className={`grid gap-x-8 gap-y-4 ${className}`}>
      {skills.map((skill) => {
        const fill = LEVEL_FILL[skill.level.toLowerCase()] ?? 35;

        return (
          <li key={skill.name} className="space-y-1.5">
            <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-wide">
              <span className="text-white">{skill.name}</span>
              <span className="text-netflix-muted">{skill.level}</span>
            </div>
            <div aria-hidden className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-netflix-red"
                initial={reduceMotion ? false : { width: 0 }}
                animate={{ width: `${fill}%` }}
                transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
              />
            </div>
          </li>
        );
      })}
    </ul>
  );
};
