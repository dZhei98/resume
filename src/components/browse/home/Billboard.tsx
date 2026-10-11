"use client";

import { TopBadge } from "@/components/browse/ui/Badges";
import { NfButton } from "@/components/browse/ui/Buttons";
import TitleArt from "@/components/browse/ui/TitleArt";
import { KIND_LABEL } from "@/constants/categories";
import { useOpenTitle } from "@/hooks/useTitleModal";
import type { ProfileConfig, Title } from "@/types";
import Image from "next/image";
import React from "react";
import { IoInformationCircleOutline, IoPlay } from "react-icons/io5";
import { tintAlpha } from "./TintBackdrop";

const Billboard: React.FC<{ title: Title; profile: ProfileConfig }> = ({ title, profile }) => {
  const openTitle = useOpenTitle();
  const isAbout = title.kind === "about";

  return (
    <section
      aria-label="Featured"
      className="relative hidden h-[56.25vw] max-h-[88vh] min-h-[520px] w-full overflow-hidden md:block"
    >
      {isAbout && title.image ? (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              background: `radial-gradient(55% 65% at 22% 60%, ${tintAlpha(title.tint, 0.55)} 0%, transparent 70%)`,
            }}
          />
          <div className="absolute right-0 top-0 h-full w-[58%]">
            <Image
              src={title.image.src}
              alt={title.image.alt}
              fill
              priority
              sizes="58vw"
              className="object-cover object-[center_25%]"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-[linear-gradient(90deg,#141414_0%,transparent_45%)]"
            />
          </div>
        </>
      ) : (
        <TitleArt title={title} showName={false} showLogoBadge={false} priority sizes="100vw" />
      )}
      <div
        aria-hidden
        className="absolute inset-0 bg-[linear-gradient(77deg,rgba(0,0,0,0.6),transparent_85%)]"
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-[35%] bg-gradient-to-t from-netflix-bg via-netflix-bg/40 to-transparent"
      />

      <div className="absolute bottom-[32%] left-gutter w-[40%] space-y-4 lg:w-[36%]">
        <h1 className="font-display text-[5.2vw] uppercase leading-[0.9] text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
          {title.name}
        </h1>
        {isAbout ? (
          title.subtitle ? (
            <p className="text-[length:max(0.95rem,1.5vw)] font-semibold leading-snug drop-shadow">
              {title.subtitle}
            </p>
          ) : null
        ) : title.rank ? (
          <p className="flex items-center gap-3 text-[length:max(0.95rem,1.5vw)] font-semibold drop-shadow">
            <TopBadge />
            <span>
              #{title.rank} in Hackathons Today
            </span>
          </p>
        ) : null}
        {title.domain && (
          <p className="text-[length:max(0.9rem,1.2vw)] font-semibold drop-shadow">{title.domain}</p>
        )}
        <p className="line-clamp-3 text-[length:max(0.9rem,1.2vw)] leading-snug drop-shadow">
          {title.synopsis}
        </p>
        <div className="flex flex-wrap gap-3">
          {isAbout ? (
            <NfButton size="lg" href={profile.heroAction.href} icon={<IoPlay aria-hidden />}>
              {profile.heroAction.label}
            </NfButton>
          ) : (
            <NfButton
              size="lg"
              href={title.href}
              onClick={() => openTitle(title.slug)}
              icon={<IoPlay aria-hidden />}
            >
              Play
            </NfButton>
          )}
          <NfButton
            size="lg"
            variant="secondary"
            onClick={() => openTitle(title.slug)}
            icon={<IoInformationCircleOutline aria-hidden />}
          >
            More Info
          </NfButton>
        </div>
      </div>

      <div className="absolute bottom-[32%] right-0 border-l-[3px] border-white/80 bg-[#333]/60 py-1 pl-3 pr-[4vw] text-[length:max(0.8rem,1.1vw)]">
        {KIND_LABEL[title.kind]}
      </div>
    </section>
  );
};

export default Billboard;
