"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/**
 * Hand-drawn curved arrow SVG paths.
 * Each is a cubic bezier that curves differently for visual variety.
 * viewBox is 120x60; arrows flow left-to-right with a downward curve.
 */
const ARROW_PATHS = {
  swoop: "M8 12 C30 8, 50 42, 90 36 L84 30 M90 36 L82 42",
  bounce: "M8 16 C24 6, 60 52, 92 28 L86 22 M92 28 L84 34",
  arc: "M8 10 C40 4, 70 50, 95 32 L89 26 M95 32 L87 38",
};

type ArrowVariant = keyof typeof ARROW_PATHS;

interface TrustNudgeProps {
  message: string;
  linkText?: string;
  linkHref?: string;
  arrow?: ArrowVariant;
  flipArrow?: boolean;
  className?: string;
}

export default function TrustNudge({
  message,
  linkText,
  linkHref,
  arrow = "swoop",
  flipArrow = false,
  className = "",
}: TrustNudgeProps) {
  const path = ARROW_PATHS[arrow];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 18,
        mass: 0.8,
      }}
      className={`flex items-center gap-4 ${className}`}
    >
      {/* Hand-drawn curved arrow — bounces in separately */}
      <motion.svg
        width="80"
        height="44"
        viewBox="0 0 120 60"
        fill="none"
        className={`flex-shrink-0 ${flipArrow ? "scale-x-[-1]" : ""}`}
        initial={{ opacity: 0, x: -20, rotate: -12 }}
        whileInView={{ opacity: 1, x: 0, rotate: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 14,
          delay: 0.15,
        }}
      >
        <motion.path
          d={path}
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-accent-blue/60"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
        />
      </motion.svg>

      {/* Message — pops in with a slight overshoot */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 0.25,
        }}
      >
        <p className="font-display italic text-text-secondary text-sm md:text-base tracking-[-0.01em] leading-snug">
          {message}
        </p>
        {linkText && linkHref && (
          <Link
            href={linkHref}
            className="inline-flex items-center gap-1.5 mt-1.5 text-accent-blue hover:text-accent-blue/80 text-xs md:text-sm font-semibold transition-colors"
          >
            {linkText}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="mt-px">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        )}
      </motion.div>
    </motion.div>
  );
}
