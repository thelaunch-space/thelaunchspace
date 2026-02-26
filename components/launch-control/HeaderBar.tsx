"use client";

import Link from "next/link";
import { SignedIn, UserButton } from "@clerk/nextjs";

interface WorkStats {
  doneThisWeek: number;
  inProgress: number;
  blocked: number;
  todo: number;
}

interface HeaderBarProps {
  workMode?: boolean;
  onToggleWorkMode?: () => void;
  workStats?: WorkStats | null;
}

export default function HeaderBar({ workMode, onToggleWorkMode, workStats }: HeaderBarProps) {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 bg-surface/80 backdrop-blur-md border-b border-border-color/40">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-4 lg:px-6 py-2.5 flex items-center justify-between gap-3">
        {/* Left: Title + Logo attribution */}
        <div className="flex items-center gap-2.5 min-w-0">
          <h1 className="font-display text-xl sm:text-2xl font-semibold tracking-[-0.03em] text-text-primary whitespace-nowrap">
            Launch Control
          </h1>

          {/* "by thelaunch.space" with logo — desktop */}
          <div className="hidden md:flex items-center gap-1.5 pl-2.5 border-l border-border-color/40">
            <span className="text-[11px] text-text-secondary/60 font-medium">by</span>
            <Link href="/" className="opacity-60 hover:opacity-100 transition-opacity">
              <img
                src="/logo.png"
                alt="thelaunch.space"
                className="h-5 w-auto"
              />
            </Link>
          </div>
        </div>

        {/* Center: Work stats (work mode) or voice tagline (demo mode) — desktop only */}
        {workMode && workStats ? (
          <div className="hidden lg:flex items-center gap-4">
            <StatPill label="Done this week" value={workStats.doneThisWeek} color="emerald" />
            <StatPill label="In progress" value={workStats.inProgress} color="blue" />
            <StatPill label="To do" value={workStats.todo} color="default" />
            <StatPill label="Blocked" value={workStats.blocked} color={workStats.blocked > 0 ? "red" : "default"} />
          </div>
        ) : (
          <p className="hidden lg:block text-[11px] text-text-secondary font-medium italic tracking-wide">
            These agents run on my business daily. Yours will be trained on yours.
          </p>
        )}

        {/* Right: Date + Work/Demo toggle + Auth */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:block text-xs text-text-secondary font-mono">{today}</span>

          <div className="hidden sm:block w-px h-5 bg-border-color/40" />

          <SignedIn>
            {onToggleWorkMode && (
              <button
                onClick={onToggleWorkMode}
                className={`rounded-full px-3 py-1 text-xs font-medium transition-colors border ${
                  workMode
                    ? "bg-accent-blue text-white border-accent-blue"
                    : "bg-surface-alt text-text-secondary border-border-color/40 hover:text-text-primary"
                }`}
                title={workMode ? "Switch to Demo mode" : "Switch to Work mode"}
              >
                {workMode ? "Work" : "Demo"}
              </button>
            )}
            <UserButton
              appearance={{
                elements: {
                  avatarBox: "w-7 h-7",
                },
              }}
            />
          </SignedIn>
        </div>
      </div>

      {/* Mobile: work stats strip (work mode only) */}
      {workMode && workStats && (
        <div className="md:hidden flex items-center gap-3 px-3 pb-2 -mt-0.5 overflow-x-auto scrollbar-hide">
          <StatPill label="Done" value={workStats.doneThisWeek} color="emerald" />
          <StatPill label="Active" value={workStats.inProgress} color="blue" />
          <StatPill label="To do" value={workStats.todo} color="default" />
          <StatPill label="Blocked" value={workStats.blocked} color={workStats.blocked > 0 ? "red" : "default"} />
        </div>
      )}

      {/* Mobile: logo attribution (hidden in work mode) */}
      {!workMode && (
        <div className="md:hidden flex items-center gap-1.5 px-3 pb-2 -mt-0.5">
          <span className="text-[10px] text-text-secondary/50 font-medium">by</span>
          <Link href="/" className="opacity-50 hover:opacity-80 transition-opacity">
            <img
              src="/logo.png"
              alt="thelaunch.space"
              className="h-4 w-auto"
            />
          </Link>
        </div>
      )}
    </header>
  );
}

function StatPill({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "emerald" | "blue" | "red" | "default";
}) {
  const colorMap = {
    emerald: "text-emerald-700 bg-emerald-500/10 border-emerald-500/20",
    blue:    "text-blue-700    bg-blue-500/10    border-blue-500/20",
    red:     "text-red-600     bg-red-500/10     border-red-500/20",
    default: "text-text-secondary bg-surface-alt border-border-color/30",
  };

  return (
    <div className="flex items-center gap-1.5 shrink-0">
      <span className={`text-sm font-semibold tabular-nums px-1.5 py-0.5 rounded-md border ${colorMap[color]}`}>
        {value}
      </span>
      <span className="text-[11px] text-text-secondary/70">{label}</span>
    </div>
  );
}
