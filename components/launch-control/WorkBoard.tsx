"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { KANBAN_COLUMNS, type WorkBoardTask } from "@/lib/launch-control-types";
import WorkBoardColumn from "./WorkBoardColumn";
import WorkBoardArchive from "./WorkBoardArchive";

function startOfCurrentWeek(): number {
  const now = new Date();
  const day = now.getDay(); // 0=Sun
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((day + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  return monday.getTime();
}

export default function WorkBoard() {
  const tasks = useQuery(api.workboard.getBoard) as WorkBoardTask[] | undefined;
  const [activeColumn, setActiveColumn] = useState<string>("todo");

  const weekStart = startOfCurrentWeek();

  const grouped = KANBAN_COLUMNS.reduce<Record<string, WorkBoardTask[]>>((acc, col) => {
    if (col.id === "done") {
      // Done column only shows tasks completed this week
      acc[col.id] = tasks
        ? tasks.filter((t) => t.column === "done" && new Date(t.timestamp).getTime() >= weekStart)
        : [];
    } else {
      acc[col.id] = tasks ? tasks.filter((t) => t.column === col.id) : [];
    }
    return acc;
  }, {});

  const archivedTasks: WorkBoardTask[] = tasks
    ? tasks.filter((t) => t.column === "done" && new Date(t.timestamp).getTime() < weekStart)
    : [];

  return (
    <div className="h-full flex flex-col">
      {/* Mobile: column selector pills */}
      <div className="lg:hidden flex items-center gap-1 mb-4 overflow-x-auto scrollbar-hide -mx-1 px-1 pb-1 shrink-0">
        {KANBAN_COLUMNS.map((col) => {
          const count = grouped[col.id]?.length ?? 0;
          return (
            <button
              key={col.id}
              onClick={() => setActiveColumn(col.id)}
              className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                activeColumn === col.id
                  ? "bg-surface text-text-primary shadow-sm border border-border-color/40"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-alt/60"
              }`}
            >
              {col.label}
              {count > 0 && (
                <span className={`text-[10px] px-1 py-0.5 rounded-full ${
                  activeColumn === col.id ? "bg-accent-blue/15 text-accent-blue" : "bg-surface-alt text-text-secondary"
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mobile: single active column */}
      <div className="lg:hidden flex-1 overflow-y-auto scrollbar-hide">
        {(() => {
          const col = KANBAN_COLUMNS.find((c) => c.id === activeColumn)!;
          return (
            <WorkBoardColumn
              column={col.id}
              label={col.label}
              tasks={grouped[col.id] ?? []}
              loading={tasks === undefined}
            />
          );
        })()}
      </div>

      {/* Desktop: horizontally scrollable Kanban */}
      <div className="hidden lg:flex flex-1 min-h-0 overflow-x-auto overflow-y-hidden gap-3 pb-3">
        {KANBAN_COLUMNS.map((col) => (
          <div key={col.id} className="w-[272px] flex-shrink-0 flex flex-col min-h-0">
            <WorkBoardColumn
              column={col.id}
              label={col.label}
              tasks={grouped[col.id] ?? []}
              loading={tasks === undefined}
            />
          </div>
        ))}
        {/* Archive pseudo-column */}
        <div className="w-[288px] flex-shrink-0 flex flex-col min-h-0">
          <WorkBoardArchive tasks={archivedTasks} loading={tasks === undefined} />
        </div>
      </div>
    </div>
  );
}
