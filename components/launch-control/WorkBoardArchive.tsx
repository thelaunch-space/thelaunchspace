"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import type { WorkBoardTask } from "@/lib/launch-control-types";
import { CARD_BADGE_CONFIG, OWNER_TAG_CONFIG } from "@/lib/launch-control-types";

interface WorkBoardArchiveProps {
  tasks: WorkBoardTask[];
  loading: boolean;
}

function relativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function isoWeekKey(timestamp: string): string {
  const date = new Date(timestamp);
  const day = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const year = monday.getFullYear();
  // ISO week number
  const startOfYear = new Date(year, 0, 1);
  const week = Math.ceil(((monday.getTime() - startOfYear.getTime()) / 86400000 + startOfYear.getDay() + 1) / 7);
  return `${year}-W${String(week).padStart(2, "0")}`;
}

interface WeekGroup {
  key: string;
  label: string;
  rangeLabel: string;
  tasks: WorkBoardTask[];
  monday: Date;
}

function buildWeekGroups(tasks: WorkBoardTask[]): WeekGroup[] {
  const map = new Map<string, WeekGroup>();

  for (const task of tasks) {
    const key = isoWeekKey(task.timestamp);
    if (!map.has(key)) {
      const date = new Date(task.timestamp);
      const day = date.getDay();
      const monday = new Date(date);
      monday.setDate(date.getDate() - ((day + 6) % 7));
      monday.setHours(0, 0, 0, 0);
      const sunday = new Date(monday);
      sunday.setDate(monday.getDate() + 6);

      const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      map.set(key, {
        key,
        label: `Week of ${fmt(monday)}`,
        rangeLabel: `${fmt(monday)} – ${fmt(sunday)}`,
        tasks: [],
        monday,
      });
    }
    map.get(key)!.tasks.push(task);
  }

  // Sort newest week first
  return Array.from(map.values()).sort((a, b) => b.monday.getTime() - a.monday.getTime());
}

function CompactOwnerTag({ owner }: { owner: string }) {
  const isKrishna = owner === "Krishna";
  const config = OWNER_TAG_CONFIG[owner];

  if (isKrishna) {
    return (
      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800">
        <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
          K
        </span>
      </span>
    );
  }

  if (!config) return <span className="text-[10px] text-text-secondary">{owner}</span>;

  return (
    <span className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border ${config.bg} ${config.color} ${config.border}`}>
      <img
        src={`/agent-avatars/${owner.toLowerCase()}.png`}
        alt=""
        className="w-4 h-4 rounded-full object-cover shrink-0"
        onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
      />
    </span>
  );
}

function ArchivedCard({ task }: { task: WorkBoardTask }) {
  const badge = CARD_BADGE_CONFIG[task.type];
  return (
    <div className="bg-surface border border-border-color/20 rounded-lg px-2.5 py-2 flex flex-col gap-1 opacity-80">
      <div className="flex items-center gap-1.5">
        <span className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${badge.color} ${badge.bg}`}>
          {badge.label}
        </span>
        {task.owner && <CompactOwnerTag owner={task.owner} />}
      </div>
      <p className="text-[11px] text-text-secondary line-clamp-1">{task.title}</p>
      <p className="text-[10px] text-text-secondary/40 font-mono text-right">{relativeTime(task.timestamp)}</p>
    </div>
  );
}

export default function WorkBoardArchive({ tasks, loading }: WorkBoardArchiveProps) {
  const weekGroups = buildWeekGroups(tasks);
  // Most recent week open by default, rest collapsed
  const [openWeeks, setOpenWeeks] = useState<Set<string>>(() => {
    const s = new Set<string>();
    if (weekGroups.length > 0) s.add(weekGroups[0].key);
    return s;
  });

  function toggleWeek(key: string) {
    setOpenWeeks((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="flex flex-col flex-1 min-h-0 rounded-2xl bg-surface-alt/30 border border-border-color/20 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 shrink-0 border-b border-border-color/20">
        <span className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Archive</span>
        {tasks.length > 0 && (
          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-surface-alt text-text-secondary border border-border-color/30">
            {tasks.length}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-2 pb-2 pt-1">
        {loading ? (
          <div className="flex flex-col gap-1.5 pt-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 rounded-lg bg-surface-alt/60 animate-pulse" />
            ))}
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full py-8 px-3 text-center">
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-border-color/40 flex items-center justify-center mb-2">
              <span className="text-text-secondary/40 text-xs">✓</span>
            </div>
            <p className="text-[11px] text-text-secondary/60 leading-snug">
              Tasks completed before this week will appear here
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            {weekGroups.map((group) => {
              const isOpen = openWeeks.has(group.key);
              return (
                <div key={group.key} className="mt-1">
                  {/* Week header */}
                  <button
                    onClick={() => toggleWeek(group.key)}
                    className="w-full flex items-center gap-1.5 px-1 py-1.5 rounded-lg hover:bg-surface-alt/60 transition-colors text-left group"
                  >
                    {isOpen ? (
                      <ChevronDown size={12} className="text-text-secondary/60 shrink-0" />
                    ) : (
                      <ChevronRight size={12} className="text-text-secondary/60 shrink-0" />
                    )}
                    <span className="text-[11px] font-medium text-text-secondary group-hover:text-text-primary transition-colors truncate">
                      {group.label}
                    </span>
                    <span className="text-[10px] text-text-secondary/50 truncate hidden sm:inline">
                      · {group.rangeLabel}
                    </span>
                    <span className="ml-auto shrink-0 text-[10px] px-1 py-0.5 rounded-full bg-surface-alt text-text-secondary/60">
                      {group.tasks.length}
                    </span>
                  </button>

                  {/* Expanded tasks */}
                  {isOpen && (
                    <div className="flex flex-col gap-1 pl-1 mt-1">
                      {group.tasks.map((task) => (
                        <ArchivedCard key={task.id} task={task} />
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
