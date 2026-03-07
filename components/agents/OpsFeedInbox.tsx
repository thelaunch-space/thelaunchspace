"use client";

import { useMemo } from "react";
import { Radio } from "lucide-react";
import { CronUpdateMessage, CHAT_AGENTS } from "./types";

interface Props {
  updates: CronUpdateMessage[];
  selectedUpdateId: string | null;
  onSelectUpdate: (id: string) => void;
}

function formatRelativeTime(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = now - then;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "yesterday";
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function getAgentColor(agentId: string): string {
  return CHAT_AGENTS.find((a) => a.id === agentId)?.accentHex ?? "#9CA3AF";
}

export default function OpsFeedInbox({ updates, selectedUpdateId, onSelectUpdate }: Props) {
  // Group updates by date
  const groups = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);
    const weekAgo = new Date(today.getTime() - 7 * 86400000);

    const buckets: { label: string; items: CronUpdateMessage[] }[] = [
      { label: "Today", items: [] },
      { label: "Yesterday", items: [] },
      { label: "This week", items: [] },
      { label: "Older", items: [] },
    ];

    for (const u of updates) {
      const d = new Date(u.createdAt);
      if (d >= today) buckets[0].items.push(u);
      else if (d >= yesterday) buckets[1].items.push(u);
      else if (d >= weekAgo) buckets[2].items.push(u);
      else buckets[3].items.push(u);
    }

    return buckets.filter((b) => b.items.length > 0);
  }, [updates]);

  if (updates.length === 0) {
    return (
      <div className="w-full md:w-72 shrink-0 h-full flex flex-col bg-surface/50">
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
          <Radio size={20} className="mb-2 text-text-secondary/40" />
          <p className="text-xs text-text-secondary/60">No cron updates yet</p>
          <p className="text-xs text-text-secondary/40 mt-1">Agent reports will appear here</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full md:w-72 shrink-0 h-full flex flex-col bg-surface/50">
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-3">
        {groups.map((group) => (
          <div key={group.label}>
            <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-secondary/50">
              {group.label}
            </p>
            <div className="space-y-0.5">
              {group.items.map((update) => {
                const isActive = update._id === selectedUpdateId;
                const color = getAgentColor(update.agentId);
                return (
                  <button
                    key={update._id}
                    onClick={() => onSelectUpdate(update._id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl transition-colors ${
                      isActive
                        ? "bg-black/[0.06]"
                        : "hover:bg-black/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-0.5">
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: color }}
                      />
                      <span className={`text-xs font-medium truncate ${isActive ? "text-text-primary" : "text-text-secondary"}`}>
                        {update.agentName}
                      </span>
                    </div>
                    <p className={`text-xs truncate pl-4 ${isActive ? "text-text-primary" : "text-text-secondary/70"}`}>
                      {update.jobName ?? "Cron Update"}
                    </p>
                    <p className="text-[10px] text-text-secondary/50 pl-4 mt-0.5">
                      {formatRelativeTime(update.createdAt)}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
