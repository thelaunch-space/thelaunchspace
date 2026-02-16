"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@clerk/nextjs";
import Scoreboard from "./Scoreboard";
import DailyTimeline from "./DailyTimeline";
import type { WeeklyStats } from "@/lib/launch-control-types";

// Lazy-load tab panels to avoid heavy initial bundle
const CommunitiesPanel = dynamic(() => import("./CommunitiesPanel"));
const CommunitiesPreview = dynamic(() => import("./CommunitiesPreview"));
const QuestionsTable = dynamic(() => import("./QuestionsTable"));
const QuestionsPreview = dynamic(() => import("./QuestionsPreview"));
const BriefsPanel = dynamic(() => import("./BriefsPanel"));
const BriefsPreview = dynamic(() => import("./BriefsPreview"));
const MeetingsPanel = dynamic(() => import("./MeetingsPanel"));

type Tab = "overview" | "communities" | "questions" | "briefs" | "meetings";

const TABS: { label: string; value: Tab }[] = [
  { label: "Overview", value: "overview" },
  { label: "Communities", value: "communities" },
  { label: "Questions", value: "questions" },
  { label: "Briefs", value: "briefs" },
  { label: "Meetings", value: "meetings" },
];

interface CenterTabsProps {
  weeklyStats: WeeklyStats | undefined;
  allTimeStats: WeeklyStats | undefined;
}

export default function CenterTabs({ weeklyStats, allTimeStats }: CenterTabsProps) {
  const { isSignedIn } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div>
      {/* Tab bar */}
      <div className="flex items-center gap-1 mb-4 overflow-x-auto scrollbar-hide -mx-1 px-1">
        {TABS.filter((t) => t.value !== "meetings" || isSignedIn).map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.value
                ? "bg-surface text-text-primary shadow-sm border border-border-color/40"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-alt/60"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "overview" && (
        <div className="space-y-5">
          <Scoreboard weeklyStats={weeklyStats} allTimeStats={allTimeStats} />
          <DailyTimeline />
        </div>
      )}
      {activeTab === "questions" && (
        <div className="rounded-2xl border border-border-color/40 bg-surface overflow-hidden">
          {isSignedIn ? <QuestionsTable /> : <QuestionsPreview />}
        </div>
      )}
      {activeTab === "briefs" && (
        <div className="rounded-2xl border border-border-color/40 bg-surface overflow-hidden">
          {isSignedIn ? <BriefsPanel /> : <BriefsPreview />}
        </div>
      )}
      {activeTab === "communities" && (
        <div className="rounded-2xl border border-border-color/40 bg-surface overflow-hidden">
          {isSignedIn ? <CommunitiesPanel /> : <CommunitiesPreview />}
        </div>
      )}
      {activeTab === "meetings" && isSignedIn && (
        <div className="rounded-2xl border border-border-color/40 bg-surface overflow-hidden">
          <MeetingsPanel />
        </div>
      )}
    </div>
  );
}
