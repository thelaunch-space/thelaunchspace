"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

interface StatBarProps {
  label: string;
  value: number;
  max: number;
  accentColor: string;
}

export default function StatBar({ label, value, max, accentColor }: StatBarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const pct = Math.round((value / max) * 100);

  return (
    <div ref={ref} className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono tracking-[0.12em] uppercase text-text-secondary">
          {label}
        </span>
        <span className="text-[10px] font-mono tracking-[0.12em] text-text-secondary">
          {value}/{max}
        </span>
      </div>
      <div className="h-2 rounded-full bg-surface-alt overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: accentColor }}
          initial={{ width: "0%" }}
          animate={isInView ? { width: `${pct}%` } : { width: "0%" }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
