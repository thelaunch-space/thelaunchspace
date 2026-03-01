"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import type { KanbanColumn, WorkBoardTask } from "@/lib/launch-control-types";
import WorkBoardCard from "./WorkBoardCard";
import AddTaskForm from "./AddTaskForm";

interface WorkBoardColumnProps {
  column: KanbanColumn;
  label: string;
  tasks: WorkBoardTask[];
  loading?: boolean;
}

const COLUMN_BG: Record<KanbanColumn, string> = {
  backlog:     "bg-surface-alt/60",
  todo:        "bg-amber-50/40",
  in_progress: "bg-blue-50/40",
  blocked:     "bg-red-50/40",
  done:        "bg-emerald-50/40",
};

const COLUMN_HEADER_COLOR: Record<KanbanColumn, string> = {
  backlog:     "text-text-secondary",
  todo:        "text-amber-700",
  in_progress: "text-accent-blue",
  blocked:     "text-red-600",
  done:        "text-emerald-700",
};

function ColumnSkeleton() {
  return (
    <div className="space-y-2 px-2 pt-2">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-xl border border-border-color/30 bg-surface p-3 animate-pulse space-y-2"
          style={{ opacity: 1 - i * 0.25 }}
        >
          <div className="h-3 bg-surface-alt rounded w-3/4" />
          <div className="h-3 bg-surface-alt rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function WorkBoardColumn({ column, label, tasks, loading }: WorkBoardColumnProps) {
  const [addingTask, setAddingTask] = useState(false);

  return (
    <div className={`flex flex-col flex-1 min-h-0 rounded-2xl ${COLUMN_BG[column]}`}>
      {/* Column header */}
      <div className="flex items-center gap-2 px-3 pt-3 pb-2 shrink-0">
        <span className={`text-xs font-semibold ${COLUMN_HEADER_COLOR[column]}`}>{label}</span>
        {!loading && tasks.length > 0 && (
          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-white/70 border border-border-color/30 text-text-secondary">
            {tasks.length}
          </span>
        )}
        {(column === "todo" || column === "backlog") && !loading && (
          <button
            onClick={() => setAddingTask(true)}
            className={`ml-auto p-1 rounded-lg transition-colors ${
              column === "todo"
                ? "text-amber-600/60 hover:text-amber-700 hover:bg-white/60"
                : "text-text-secondary/50 hover:text-text-secondary hover:bg-white/60"
            }`}
            aria-label="Add task"
          >
            <Plus size={14} />
          </button>
        )}
      </div>

      {/* Cards area */}
      {loading ? (
        <ColumnSkeleton />
      ) : (
        <div className="flex-1 overflow-y-auto scrollbar-hide px-2 pb-2 space-y-2">
          {/* Inline add form at top of list */}
          {addingTask && (
            <AddTaskForm
              onClose={() => setAddingTask(false)}
              targetColumn={column === "backlog" ? "backlog" : "todo"}
            />
          )}

          {tasks.length === 0 && !addingTask ? (
            <div className="rounded-xl border border-dashed border-border-color/40 py-6 flex items-center justify-center">
              <p className="text-[11px] text-text-secondary/50">Nothing here</p>
            </div>
          ) : (
            tasks.map((task) => (
              <WorkBoardCard key={task.id} task={task} />
            ))
          )}
        </div>
      )}
    </div>
  );
}
