"use client";

import { motion } from "framer-motion";
import { useCountUp } from "@/lib/useCountUp";

interface HookSectionProps {
  weeklyStats: { questions: number; briefs: number; blogs: number } | undefined;
}

export default function HookSection({ weeklyStats }: HookSectionProps) {
  const q = weeklyStats?.questions ?? 0;
  const b = weeklyStats?.briefs ?? 0;
  const bl = weeklyStats?.blogs ?? 0;
  const hoursSaved = Math.round((q / 50) * 2.5 + b * 4 + bl * 4 + 5 * 3);

  const ready = weeklyStats !== undefined;

  const blogsCount = useCountUp(bl, 1800, 200, ready);
  const questionsCount = useCountUp(q, 1800, 400, ready);
  const hoursCount = useCountUp(hoursSaved, 1800, 600, ready);

  return (
    <section className="pt-4 md:pt-8">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
      >
        <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-text-secondary">
          YOUR AI CONTENT TEAM
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.08 }}
        className="font-display tracking-[-0.03em] text-3xl md:text-5xl lg:text-6xl text-text-primary mt-3 leading-tight"
      >
        Your SEO team that never clocks out
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.16 }}
        className="text-text-secondary text-base md:text-lg leading-relaxed mt-4 max-w-2xl"
      >
        You know you need organic content. You don&apos;t have the team, the time, or the budget.
        These agents handle it end-to-end while you run your business.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.24 }}
        className="mt-6"
      >
        {ready ? (
          <p className="text-sm text-text-secondary">
            This week:{" "}
            <span className="font-semibold text-text-primary">{blogsCount}</span> blogs published,{" "}
            <span className="font-semibold text-text-primary">{questionsCount}</span> questions found,{" "}
            <span className="font-semibold text-text-primary">{hoursCount}</span> hours saved.{" "}
            <span className="text-accent-blue font-medium">Zero human hours.</span>
          </p>
        ) : (
          <div className="h-5 w-80 bg-surface-alt rounded animate-pulse" />
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5, delay: 0.32 }}
        className="mt-8"
      >
        <a
          href="#lead-capture"
          className="inline-block rounded-xl bg-gradient-to-r from-accent-blue to-accent-purple px-6 py-3 text-sm font-semibold text-white shadow-cta hover:-translate-y-0.5 hover:shadow-cta-hover transition-all duration-300"
        >
          Get your AI team this week
        </a>
      </motion.div>

      {/* Hero nudge — bouncy entrance, points to Launch Control */}
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.9 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true }}
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 16,
          delay: 0.6,
        }}
        className="mt-5 flex items-center gap-3"
      >
        {/* Mini curved arrow */}
        <motion.svg
          width="48"
          height="28"
          viewBox="0 0 120 60"
          fill="none"
          className="flex-shrink-0"
          initial={{ opacity: 0, rotate: -15 }}
          whileInView={{ opacity: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 200, damping: 14, delay: 0.75 }}
        >
          <motion.path
            d="M8 12 C30 8, 50 42, 90 36 L84 30 M90 36 L82 42"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-accent-blue/50"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.85, ease: "easeOut" }}
          />
        </motion.svg>
        <a
          href="/launch-control"
          className="font-display italic text-text-secondary text-sm hover:text-accent-blue transition-colors"
        >
          I use this for my own business &mdash;{" "}
          <span className="text-accent-blue font-semibold not-italic">watch them work live &rarr;</span>
        </a>
      </motion.div>
    </section>
  );
}
