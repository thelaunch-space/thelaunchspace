"use client";

import { useRef, useState, useEffect } from "react";
import { useCountUp } from "@/lib/useCountUp";
import type { WeeklyStats } from "@/lib/launch-control-types";

type TimeRange = "week" | "allTime";

interface ScoreboardProps {
  weeklyStats: WeeklyStats | undefined;
  allTimeStats: WeeklyStats | undefined;
}

function StatCard({
  label,
  value,
  suffix,
  delay,
  enabled,
  accent,
}: {
  label: string;
  value: number;
  suffix?: string;
  delay: number;
  enabled: boolean;
  accent?: string;
}) {
  const display = useCountUp(value, 2000, delay, enabled);

  return (
    <div className="rounded-xl border border-border-color/40 bg-surface p-2.5 sm:p-4 text-center">
      <div className="font-display text-2xl sm:text-3xl lg:text-4xl font-semibold text-text-primary tracking-tight">
        {enabled ? display.toLocaleString() : "—"}
        {suffix && <span className="text-lg text-text-secondary">{suffix}</span>}
      </div>
      <p className={`meta-label mt-1 ${accent ? accent : "text-text-secondary"}`}>{label}</p>
    </div>
  );
}

export default function Scoreboard({ weeklyStats, allTimeStats }: ScoreboardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [range, setRange] = useState<TimeRange>("week");

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const active = range === "week" ? weeklyStats : allTimeStats;
  const q = active?.questions ?? 0;
  const b = active?.briefs ?? 0;
  const bl = active?.blogs ?? 0;
  const humanHours = Math.round((q / 50) * 2.5 + b * 4 + bl * 4 + 5 * 3);
  const costSaved = Math.round((q / 50) * 112.5 + b * 180 + bl * 300 + 5 * 180);
  const loaded = active !== undefined;

  return (
    <div ref={ref}>
      {/* Toggle header */}
      <div className="flex items-center gap-1 mb-3">
        <button
          onClick={() => setRange("week")}
          className={`meta-label px-2.5 py-1 rounded-md transition-colors ${
            range === "week"
              ? "bg-surface-alt text-text-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          This Week
        </button>
        <button
          onClick={() => setRange("allTime")}
          className={`meta-label px-2.5 py-1 rounded-md transition-colors ${
            range === "allTime"
              ? "bg-surface-alt text-text-primary"
              : "text-text-secondary hover:text-text-primary"
          }`}
        >
          All Time
        </button>
      </div>

      {/* Primary stats */}
      <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 sm:gap-3">
        <StatCard label="Questions" value={q} delay={0} enabled={visible && loaded} />
        <StatCard label="Briefs" value={b} delay={150} enabled={visible && loaded} />
        <StatCard label="Blogs" value={bl} delay={300} enabled={visible && loaded} />
        <StatCard
          label="Hours Saved"
          value={humanHours}
          suffix="h"
          delay={450}
          enabled={visible && loaded}
          accent="text-accent-emerald"
        />
        <StatCard
          label="Cost Saved"
          value={costSaved}
          suffix=""
          delay={600}
          enabled={visible && loaded}
          accent="text-accent-blue"
        />
      </div>
    </div>
  );
}
