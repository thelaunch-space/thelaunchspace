"use client";

import { useState, useRef, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getCommunityReason } from "@/lib/community-data";

type SortKey = "subreddit" | "count" | "latestScannedAt";
type SortDir = "asc" | "desc";

interface CommunityRow {
  subreddit: string;
  count: number;
  reason: string;
  latestScannedAt: string;
}

export default function CommunitiesPanel() {
  const breakdown = useQuery(api.questions.communityBreakdown);
  const [sortKey, setSortKey] = useState<SortKey>("count");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showShadow, setShowShadow] = useState(false);

  const handleScroll = useCallback(() => {
    if (scrollRef.current) {
      setShowShadow(scrollRef.current.scrollLeft > 0);
    }
  }, []);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  if (breakdown === undefined) {
    return (
      <div className="space-y-2 animate-pulse p-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-10 bg-surface-alt rounded" />
        ))}
      </div>
    );
  }

  if (breakdown.length === 0) {
    return (
      <p className="text-xs text-text-secondary italic text-center py-8">
        No communities scanned yet — Vibhishana scans 12+ communities daily
      </p>
    );
  }

  const rows: CommunityRow[] = breakdown.map((item) => ({
    subreddit: item.subreddit,
    count: item.count,
    reason: getCommunityReason(item.subreddit),
    latestScannedAt: item.latestScannedAt,
  }));

  const sorted = [...rows].sort((a, b) => {
    let cmp: number;
    if (sortKey === "count") {
      cmp = a.count - b.count;
    } else if (sortKey === "latestScannedAt") {
      cmp = a.latestScannedAt.localeCompare(b.latestScannedAt);
    } else {
      cmp = a[sortKey].localeCompare(b[sortKey]);
    }
    return sortDir === "asc" ? cmp : -cmp;
  });

  const SortArrow = ({ col }: { col: SortKey }) => {
    if (sortKey !== col) return null;
    return <span className="ml-0.5">{sortDir === "asc" ? "↑" : "↓"}</span>;
  };

  return (
    <div className="lg:flex lg:flex-col lg:flex-1 lg:min-h-0">
      {/* Mobile: card view */}
      <div className="md:hidden space-y-3 p-3">
        {sorted.map((item) => (
          <div
            key={item.subreddit}
            className="rounded-xl border border-border-color/30 p-3 space-y-2"
          >
            <p className="text-sm font-medium text-text-primary">{item.subreddit}</p>
            <p className="text-[11px] text-text-secondary leading-relaxed">{item.reason}</p>
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-text-secondary">
                {item.count} questions
              </span>
              <span className="text-[10px] font-mono text-text-secondary">
                Last: {new Date(item.latestScannedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table view */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="hidden md:block overflow-auto scrollbar-hide rounded-lg border border-border-color/30 lg:flex-1 lg:min-h-0"
      >
        <table className="w-full text-xs min-w-[700px]">
          <thead className="sticky top-0 z-[3]">
            <tr className="border-b border-border-color/30 bg-surface-alt">
              <th
                className="sticky left-0 z-[4] bg-surface-alt text-left px-3 py-2.5 font-medium text-text-secondary cursor-pointer hover:text-text-primary transition-colors"
                style={{ boxShadow: showShadow ? "4px 0 8px -2px rgba(0,0,0,0.06)" : "none" }}
                onClick={() => toggleSort("subreddit")}
              >
                Community<SortArrow col="subreddit" />
              </th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary max-w-[300px]">
                Why It Was Picked
              </th>
              <th
                className="text-left px-3 py-2.5 font-medium text-text-secondary cursor-pointer hover:text-text-primary whitespace-nowrap"
                onClick={() => toggleSort("count")}
              >
                Relevant Qs<SortArrow col="count" />
              </th>
              <th
                className="text-left px-3 py-2.5 font-medium text-text-secondary cursor-pointer hover:text-text-primary whitespace-nowrap"
                onClick={() => toggleSort("latestScannedAt")}
              >
                Last Scanned<SortArrow col="latestScannedAt" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((item) => (
              <tr key={item.subreddit} className="border-b border-border-color/10 hover:bg-surface-alt/30 transition-colors">
                <td
                  className="sticky left-0 z-[1] bg-surface px-3 py-2.5 font-medium text-text-primary whitespace-nowrap"
                  style={{ boxShadow: showShadow ? "4px 0 8px -2px rgba(0,0,0,0.06)" : "none" }}
                >
                  {item.subreddit}
                </td>
                <td className="px-3 py-2.5 text-text-secondary max-w-[300px]">{item.reason}</td>
                <td className="px-3 py-2.5 text-text-secondary font-mono whitespace-nowrap">{item.count}</td>
                <td className="px-3 py-2.5 text-text-secondary font-mono whitespace-nowrap">
                  {new Date(item.latestScannedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
