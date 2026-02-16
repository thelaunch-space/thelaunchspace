"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export default function SecondaryCtaSection() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5 }}
      className="relative rounded-2xl border border-border-color bg-surface shadow-card overflow-hidden px-6 py-10 md:px-12 md:py-14"
    >
      {/* Subtle accent line at top */}
      <div
        className="absolute top-0 inset-x-0 h-1"
        style={{ background: "linear-gradient(to right, #2563EB, #10B981, #7C3AED, transparent)" }}
      />

      <div className="max-w-xl mx-auto text-center">
        <p className="text-[10px] font-mono tracking-[0.12em] uppercase text-accent-blue">
          LAUNCH CONTROL
        </p>

        <h3 className="mt-3 font-display tracking-[-0.02em] text-2xl md:text-3xl text-text-primary leading-tight">
          Everything you just read?<br />
          It&apos;s running on my business. Right now.
        </h3>

        <p className="mt-4 text-text-secondary text-sm md:text-base leading-relaxed">
          This isn&apos;t a pitch deck. These agents produce the blogs on this very site,
          scan the communities I care about, and deliver briefs to my Slack every day.
          Launch Control lets you watch it all happen live.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/launch-control"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-accent-blue px-6 py-3 text-sm font-semibold text-accent-blue hover:bg-accent-blue hover:text-white transition-all duration-300 hover:-translate-y-0.5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none" />
            </svg>
            Watch the team work live
          </Link>
          <a
            href="#lead-capture"
            className="text-text-secondary hover:text-text-primary text-sm transition-colors"
          >
            or get your own team &rarr;
          </a>
        </div>
      </div>
    </motion.section>
  );
}
