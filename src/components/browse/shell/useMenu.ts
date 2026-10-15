"use client";

import { usePathname } from "next/navigation";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";

const HOVER_CLOSE_DELAY = 200;

const HOVER_QUERY = "(hover: hover)";

const isHover = (event: React.PointerEvent) =>
  event.pointerType === "mouse" && window.matchMedia(HOVER_QUERY).matches;

export const useMenu = () => {
  const [open, setOpen] = useState(false);
  const [closeTimer, setCloseTimer] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pointerTypeRef = useRef("");
  const pathname = usePathname();
  const [menuPathname, setMenuPathname] = useState(pathname);

  if (menuPathname !== pathname) {
    setMenuPathname(pathname);
    setOpen(false);
  }

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (closeTimer === null) {
      return;
    }
    const timer = window.setTimeout(() => {
      setOpen(false);
      setCloseTimer(null);
    }, HOVER_CLOSE_DELAY);
    return () => window.clearTimeout(timer);
  }, [closeTimer]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current?.contains(event.target as Node)) {
        return;
      }
      setOpen(false);
      if (event.pointerType === "mouse") {
        return;
      }
      const swallowClick = (click: MouseEvent) => {
        click.preventDefault();
        click.stopPropagation();
        release();
      };
      const release = () => {
        document.removeEventListener("click", swallowClick, true);
        document.removeEventListener("pointerdown", release, true);
      };
      document.addEventListener("click", swallowClick, true);
      document.addEventListener("pointerdown", release, true);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const rootProps = {
    ref: rootRef,
    onPointerEnter: (event: React.PointerEvent) => {
      if (!isHover(event)) {
        return;
      }
      setCloseTimer(null);
      setOpen(true);
    },
    onPointerLeave: (event: React.PointerEvent) => {
      if (isHover(event)) {
        setCloseTimer(event.timeStamp);
      }
    },
    onBlur: (event: React.FocusEvent) => {
      const next = event.relatedTarget;
      if (next instanceof Node && !rootRef.current?.contains(next)) {
        setOpen(false);
      }
    },
  };

  const triggerProps = {
    ref: triggerRef,
    type: "button" as const,
    "aria-expanded": open,
    onPointerDown: (event: React.PointerEvent) => {
      pointerTypeRef.current = event.pointerType;
    },
    onClick: () => {
      const viaMouse = pointerTypeRef.current === "mouse";
      pointerTypeRef.current = "";
      setOpen((current) => viaMouse || !current);
    },
  };

  return { open, close, rootProps, triggerProps };
};
