"use client";

import { motion } from "framer-motion";
import { TIMELINE_STEPS } from "@/lib/pitch-data";

export default function TimelineSection() {
  return (
    <section>
      <motion.h2
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.5 }}
        className="font-display tracking-[-0.02em] text-2xl md:text-3xl text-text-primary"
      >
        Your 4-Week Journey
      </motion.h2>

      {/* Mobile: vertical timeline */}
      <div className="mt-8 md:hidden relative pl-8">
        <div className="absolute left-3 top-1 bottom-1 w-[2px] bg-accent-blue/20" />
        {TIMELINE_STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
            className="relative pb-8 last:pb-0"
          >
            <div className="absolute -left-5 top-0 w-6 h-6 rounded-full bg-accent-blue flex items-center justify-center">
              <span className="text-[10px] font-mono font-bold text-white">{step.week}</span>
            </div>
            <h3 className="font-display tracking-[-0.02em] text-lg text-text-primary">{step.title}</h3>
            <p className="text-text-secondary text-sm mt-1 leading-relaxed">{step.description}</p>
            <p className="text-accent-blue text-sm font-medium mt-2">{step.outcome}</p>
          </motion.div>
        ))}
      </div>

      {/* Desktop: horizontal 4-col grid */}
      <div className="mt-8 hidden md:grid md:grid-cols-4 gap-6">
        {TIMELINE_STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, delay: i * 0.12 }}
          >
            <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center mb-3">
              <span className="text-xs font-mono font-bold text-white">{step.week}</span>
            </div>
            <h3 className="font-display tracking-[-0.02em] text-lg text-text-primary">{step.title}</h3>
            <p className="text-text-secondary text-sm mt-1 leading-relaxed">{step.description}</p>
            <p className="text-accent-blue text-sm font-medium mt-2">{step.outcome}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
