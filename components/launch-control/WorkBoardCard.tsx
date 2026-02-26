"use client";

import { useState, useRef, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { MoreHorizontal, ExternalLink } from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import type { WorkBoardTask, KanbanColumn } from "@/lib/launch-control-types";
import { CARD_BADGE_CONFIG, KANBAN_COLUMNS, OWNER_TAG_CONFIG } from "@/lib/launch-control-types";
import BriefReaderModal from "./BriefReaderModal";

function relativeTime(timestamp: string): string {
  const diff = Date.now() - new Date(timestamp).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

// Returns the "target" status when moving a card to a given column
function columnToStatus(column: KanbanColumn, type: string): string {
  switch (type) {
    case "brief":
      if (column === "todo") return "pending_review";
      if (column === "blocked") return "needs_revision";
      if (column === "in_progress") return "brief_ready";
      if (column === "done") return "published";
      return "pending_review";
    case "blog":
      if (column === "in_progress") return "writing";
      if (column === "todo") return "pr_created";
      if (column === "done") return "published";
      return "writing";
    case "linkedin":
      if (column === "todo") return "draft_ready";
      if (column === "blocked") return "needs_revision";
      if (column === "in_progress") return "approved";
      if (column === "done") return "posted";
      return "draft_ready";
    case "booking":
      if (column === "todo") return "new";
      if (column === "in_progress") return "contacted";
      if (column === "done") return "completed";
      return "new";
    case "tool":
      if (column === "backlog") return "proposed";
      if (column === "todo") return "approved";
      if (column === "done") return "built";
      return "proposed";
    case "cluster":
      if (column === "backlog") return "planned";
      if (column === "in_progress") return "in_progress";
      if (column === "done") return "complete";
      return "planned";
    case "manual":
      if (column === "todo") return "todo";
      if (column === "in_progress") return "in_progress";
      if (column === "blocked") return "blocked";
      if (column === "done") return "done";
      return "todo";
    default:
      return "todo";
  }
}

interface WorkBoardCardProps {
  task: WorkBoardTask;
}

export default function WorkBoardCard({ task }: WorkBoardCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number } | null>(null);
  const [briefModalOpen, setBriefModalOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);

  const updateStatus = useMutation(api.workboard.updateArtifactStatus);
  const removeTask = useMutation(api.manualTasks.remove);

  const badge = CARD_BADGE_CONFIG[task.type];

  // Click-outside to close menu
  useEffect(() => {
    if (!menuOpen) return;
    function handleMouseDown(e: MouseEvent) {
      if (
        menuRef.current && !menuRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleMouseDown);
    return () => document.removeEventListener("mousedown", handleMouseDown);
  }, [menuOpen]);

  function openMenu() {
    if (menuOpen) {
      setMenuOpen(false);
      return;
    }
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + 4,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen(true);
  }

  async function handleStatusChange(newStatus: string) {
    await updateStatus({ type: task.type, id: task.id, newStatus });
  }

  async function handleDelete() {
    if (task.type !== "manual") return;
    await removeTask({ id: task.id as Id<"manualTasks"> });
  }

  function handleTitleClick() {
    if (task.type === "brief") {
      setBriefModalOpen(true);
    } else if (task.type === "blog" && task.meta.url) {
      window.open(task.meta.url as string, "_blank", "noopener,noreferrer");
    }
  }

  // Secondary metadata line — type-specific context
  function renderMeta() {
    const { type, meta } = task;

    if (type === "brief" && meta.primaryKeyword) {
      return (
        <span className="text-[10px] font-mono bg-surface-alt text-text-secondary px-1.5 py-0.5 rounded truncate max-w-full">
          {meta.primaryKeyword as string}
        </span>
      );
    }
    if (type === "blog") {
      const keyword = (meta.keyword || meta.targetKeyword) as string | undefined;
      if (keyword) return <span className="text-[10px] text-text-secondary truncate">{keyword}</span>;
    }
    if (type === "linkedin" && meta.sourceBlogTitle) {
      return (
        <span className="text-[10px] text-text-secondary truncate italic">
          ↳ {meta.sourceBlogTitle as string}
        </span>
      );
    }
    if (type === "booking" && meta.email) {
      return <span className="text-[10px] text-text-secondary truncate">{meta.email as string}</span>;
    }
    if (type === "tool" && meta.targetKeyword) {
      return <span className="text-[10px] text-text-secondary truncate">{meta.targetKeyword as string}</span>;
    }
    if (type === "cluster" && meta.pillarName) {
      return <span className="text-[10px] text-text-secondary truncate">{meta.pillarName as string}</span>;
    }
    if (type === "manual" && meta.description) {
      return <span className="text-[10px] text-text-secondary truncate italic">{meta.description as string}</span>;
    }
    return null;
  }

  // Primary action buttons — max 2 visible
  function renderActions() {
    const { type, status } = task;

    if (type === "brief") {
      if (status === "pending_review") return (
        <>
          <ActionBtn label="Approve" onClick={() => handleStatusChange("brief_ready")} primary />
          <ActionBtn label="Revise" onClick={() => handleStatusChange("needs_revision")} />
        </>
      );
      if (status === "brief_ready" || status === "writing") return (
        <ActionBtn label="View" onClick={handleTitleClick} />
      );
    }

    if (type === "blog") {
      if (status === "pr_created") return (
        <>
          {task.meta.url && (
            <ActionBtn
              label="View PR"
              onClick={() => window.open(task.meta.url as string, "_blank", "noopener,noreferrer")}
              icon={<ExternalLink size={11} />}
            />
          )}
          <ActionBtn label="Publish" onClick={() => handleStatusChange("published")} primary />
        </>
      );
    }

    if (type === "linkedin") {
      if (status === "draft_ready") return (
        <>
          <ActionBtn label="Approve" onClick={() => handleStatusChange("approved")} primary />
          <ActionBtn label="Skip" onClick={() => handleStatusChange("skipped")} />
        </>
      );
      if (status === "approved") return (
        <ActionBtn label="Mark Posted" onClick={() => handleStatusChange("posted")} primary />
      );
    }

    if (type === "booking") {
      if (status === "new") return (
        <ActionBtn label="Contacted" onClick={() => handleStatusChange("contacted")} primary />
      );
      if (status === "contacted") return (
        <>
          <ActionBtn label="Scheduled" onClick={() => handleStatusChange("scheduled")} primary />
          <ActionBtn label="Complete" onClick={() => handleStatusChange("completed")} />
        </>
      );
    }

    if (type === "tool") {
      if (status === "proposed") return (
        <>
          <ActionBtn label="Approve" onClick={() => handleStatusChange("approved")} primary />
          <ActionBtn label="Reject" onClick={() => handleStatusChange("rejected")} danger />
        </>
      );
    }

    if (type === "manual") {
      if (status === "todo") return <ActionBtn label="Start" onClick={() => handleStatusChange("in_progress")} primary />;
      if (status === "in_progress") return <ActionBtn label="Done" onClick={() => handleStatusChange("done")} primary />;
    }

    return null;
  }

  const meta = renderMeta();

  return (
    <>
      <div className="bg-surface border border-border-color/30 rounded-xl p-3 shadow-sm hover:shadow-card hover:border-border-color/60 transition-all cursor-default">
        {/* Header row: badge + overflow menu */}
        <div className="flex items-center justify-between gap-2 mb-1.5">
          <span className={`shrink-0 text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${badge.color} ${badge.bg}`}>
            {badge.label}
          </span>

          {/* Overflow menu button */}
          <button
            ref={btnRef}
            onClick={openMenu}
            className="p-1 rounded text-text-secondary/40 hover:text-text-secondary hover:bg-surface-alt transition-colors shrink-0"
            aria-label="More options"
          >
            <MoreHorizontal size={13} />
          </button>
        </div>

        {/* Title */}
        <button
          className="text-xs font-medium text-text-primary text-left line-clamp-2 leading-snug hover:text-accent-blue transition-colors w-full mb-1.5 disabled:cursor-default disabled:hover:text-text-primary"
          onClick={handleTitleClick}
          disabled={task.type !== "brief" && task.type !== "blog"}
          title={task.title}
        >
          {task.title}
        </button>

        {/* Metadata line */}
        {meta && (
          <div className="flex items-center mb-2 overflow-hidden">
            {meta}
          </div>
        )}

        {/* Footer: owner + actions + timestamp */}
        <div className="flex items-center justify-between gap-2">
          {task.owner ? (
            <OwnerTag owner={task.owner} />
          ) : (
            <span className="text-[10px] text-text-secondary">—</span>
          )}
          <div className="flex items-center gap-1 shrink-0">
            {renderActions()}
          </div>
        </div>
        <p className="text-[10px] text-text-secondary/40 font-mono text-right mt-1">
          {relativeTime(task.timestamp)}
        </p>
        <HealthBar timestamp={task.timestamp} isDone={task.column === "done"} />
      </div>

      {/* Overflow menu — fixed-position to avoid column clipping */}
      {menuOpen && menuPos && (
        <div
          ref={menuRef}
          className="fixed z-50 bg-surface border border-border-color/60 rounded-xl shadow-card-hover py-1 min-w-[160px]"
          style={{ top: menuPos.top, right: menuPos.right }}
        >
          <p className="text-[10px] text-text-secondary/60 px-3 py-1 font-medium uppercase tracking-wide">Move to</p>
          {KANBAN_COLUMNS.map((col) =>
            col.id !== task.column ? (
              <button
                key={col.id}
                onClick={() => {
                  handleStatusChange(columnToStatus(col.id, task.type));
                  setMenuOpen(false);
                }}
                className="w-full text-left text-xs text-text-secondary hover:text-text-primary hover:bg-surface-alt px-3 py-1.5 transition-colors"
              >
                {col.label}
              </button>
            ) : null
          )}

          {task.type === "manual" && (
            <>
              <div className="my-1 border-t border-border-color/40" />
              <button
                onClick={() => {
                  handleDelete();
                  setMenuOpen(false);
                }}
                className="w-full text-left text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 transition-colors"
              >
                Delete task
              </button>
            </>
          )}
          {task.type === "brief" && task.status === "pending_review" && (
            <>
              <div className="my-1 border-t border-border-color/40" />
              <button
                onClick={() => {
                  handleStatusChange("dropped");
                  setMenuOpen(false);
                }}
                className="w-full text-left text-xs text-red-600 hover:bg-red-50 px-3 py-1.5 transition-colors"
              >
                Drop brief
              </button>
            </>
          )}
        </div>
      )}

      {briefModalOpen && task.type === "brief" && (
        <BriefReaderModal
          briefId={task.id as Id<"briefs">}
          onClose={() => setBriefModalOpen(false)}
        />
      )}
    </>
  );
}

function OwnerTag({ owner, compact }: { owner: string; compact?: boolean }) {
  const isKrishna = owner === "Krishna";
  const config = OWNER_TAG_CONFIG[owner];

  if (isKrishna) {
    return (
      <span className="flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-orange-100 border border-orange-200 text-orange-800">
        <span className="w-4 h-4 rounded-full bg-orange-500 text-white text-[9px] font-bold flex items-center justify-center shrink-0">
          K
        </span>
        {!compact && <span className="text-[10px] font-medium">Krishna</span>}
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
      {!compact && <span className="text-[10px] font-medium">{owner}</span>}
    </span>
  );
}

function HealthBar({ timestamp, isDone }: { timestamp: string; isDone: boolean }) {
  if (isDone) {
    return <div className="h-[2px] w-full rounded-full bg-emerald-400 mt-1" />;
  }

  const ageMs = Date.now() - new Date(timestamp).getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  const MAX_DAYS = 14;
  const fillPct = Math.min(100, (ageDays / MAX_DAYS) * 100);

  let color: string;
  if (ageDays < 1) color = "bg-emerald-400";
  else if (ageDays < 3) color = "bg-yellow-400";
  else if (ageDays < 7) color = "bg-orange-400";
  else color = "bg-red-500";

  return (
    <div
      className="h-[2px] w-full rounded-full bg-surface-alt mt-1 overflow-hidden"
      title={`In stage for ${Math.floor(ageDays)}d`}
    >
      <div
        className={`h-full rounded-full ${color} transition-all`}
        style={{ width: `${fillPct}%` }}
      />
    </div>
  );
}

function ActionBtn({
  label,
  onClick,
  primary,
  danger,
  icon,
}: {
  label: string;
  onClick: () => void;
  primary?: boolean;
  danger?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
        primary
          ? "bg-accent-blue/10 text-accent-blue border-accent-blue/20 hover:bg-accent-blue/20"
          : danger
          ? "bg-red-500/10 text-red-600 border-red-500/20 hover:bg-red-500/20"
          : "bg-surface-alt text-text-secondary border-border-color/40 hover:text-text-primary"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
