"use client";

import { ProfileAvatar, Wordmark } from "@/components/browse/ui/Brand";
import IntroTadum from "@/components/gate/IntroTadum";
import { PROFILES } from "@/constants/profiles";
import type { ProfileId } from "@/types";
import { MotionConfig, motion, type Variants } from "framer-motion";
import Link from "next/link";
import React, { useCallback, useLayoutEffect, useRef, useState } from "react";

const STAGGER: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};

const REVEAL: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.25, ease: "easeOut" } },
};

const isPlainClick = (event: React.MouseEvent) =>
  event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;

const ProfileGate: React.FC = () => {
  const [introDone, setIntroDone] = useState(false);
  const [pendingId, setPendingId] = useState<ProfileId | null>(null);
  const gateRef = useRef<HTMLDivElement>(null);

  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  useLayoutEffect(() => {
    if (gateRef.current) {
      gateRef.current.inert = !introDone;
    }
  }, [introDone]);

  return (
    <MotionConfig reducedMotion="user">
      {!introDone && <IntroTadum onDone={handleIntroDone} />}
      <div
        ref={gateRef}
        aria-hidden={introDone ? undefined : true}
        className="flex min-h-[100dvh] flex-col bg-netflix-bg"
      >
        <header className="flex h-16 shrink-0 items-center px-4 md:h-24 md:px-gutter">
          <Wordmark className="text-[1.9rem] md:text-[2.4rem]" />
        </header>

        <main className="flex flex-1 flex-col items-center justify-center px-4 pb-16 md:pb-[8vh]">
          <motion.div
            className="flex flex-col items-center"
            variants={STAGGER}
            initial="hidden"
            animate={introDone ? "show" : "hidden"}
          >
            <motion.h1
              variants={REVEAL}
              className="text-center text-[1.75rem] font-medium text-white md:text-[max(1.75rem,3.5vw)]"
            >
              Who&apos;s watching?
            </motion.h1>

            <motion.ul
              variants={STAGGER}
              className="mt-8 flex max-w-[15rem] flex-wrap items-start justify-center gap-x-6 gap-y-8 sm:max-w-none md:mt-[2vw] md:flex-nowrap md:gap-[2vw]"
            >
              {PROFILES.map((profile) => {
                const pending = pendingId === profile.id;

                return (
                  <motion.li key={profile.id} variants={REVEAL}>
                    <Link
                      href={profile.href}
                      aria-busy={pending || undefined}
                      onClick={(event) => {
                        if (isPlainClick(event)) {
                          setPendingId(profile.id);
                        }
                      }}
                      className="group flex flex-col items-center outline-none"
                    >
                      <span className="relative block h-[6.5rem] w-[6.5rem] rounded outline outline-[3px] outline-transparent transition-[outline-color] duration-150 group-hover:outline-white group-focus-visible:outline-white md:aspect-square md:h-auto md:w-[10vw] md:min-w-[84px] md:max-w-[200px]">
                        <ProfileAvatar
                          profile={profile}
                          size={200}
                          className="h-full w-full object-cover"
                        />
                        {pending && (
                          <span
                            role="status"
                            className="absolute inset-0 flex items-center justify-center rounded bg-black/40"
                          >
                            <span
                              aria-hidden
                              className="h-[45%] w-[45%] animate-spin rounded-full border-[3px] border-netflix-red border-t-transparent"
                            />
                            <span className="sr-only">Loading {profile.name}</span>
                          </span>
                        )}
                      </span>
                      <span className="mt-2 text-base text-netflix-gray transition-colors duration-150 group-hover:text-white group-focus-visible:text-white md:mt-[0.8vw] md:text-[max(1rem,1.3vw)]">
                        {profile.name}
                      </span>
                      <span className="mt-1 hidden max-w-[11rem] text-center text-xs text-netflix-gray sm:block">
                        {profile.tagline}
                      </span>
                    </Link>
                  </motion.li>
                );
              })}
            </motion.ul>
          </motion.div>
        </main>
      </div>
    </MotionConfig>
  );
};

export default ProfileGate;
