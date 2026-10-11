"use client";

import { AnimatePresence, motion } from "framer-motion";
import React from "react";

type DropdownProps = {
  open: boolean;
  className?: string;
  caretClassName?: string;
  children: React.ReactNode;
};

export const Dropdown: React.FC<DropdownProps> = ({
  open,
  className = "",
  caretClassName = "",
  children,
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={`absolute top-full z-10 pt-3.5 ${className}`}
      >
        <div className="relative border-t-2 border-white bg-black/90 text-white shadow-2xl">
          <span
            aria-hidden
            className={`absolute -top-[9px] h-0 w-0 border-x-[7px] border-b-[7px] border-x-transparent border-b-white ${caretClassName}`}
          />
          {children}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
);
