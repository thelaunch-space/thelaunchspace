"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AddTaskFormProps {
  onClose: () => void;
}

type Mode = "quick" | "client";

const TASK_TYPES = ["content", "seo", "dev", "ops", "research", "outreach", "strategy", "other"];
const PRIORITY_OPTIONS = [
  { label: "High", value: 3 },
  { label: "Med", value: 2 },
  { label: "Low", value: 1 },
];

export default function AddTaskForm({ onClose }: AddTaskFormProps) {
  const [mode, setMode] = useState<Mode>("quick");

  // Quick task state
  const [quickTitle, setQuickTitle] = useState("");
  const [quickDesc, setQuickDesc] = useState("");

  // Client task state
  const [clientSlug, setClientSlug] = useState("");
  const [projectSlug, setProjectSlug] = useState("");
  const [title, setTitle] = useState("");
  const [taskType, setTaskType] = useState("content");
  const [priority, setPriority] = useState(2);
  const [estimatedHours, setEstimatedHours] = useState("");
  const [deadline, setDeadline] = useState("");
  const [description, setDescription] = useState("");
  const [showDesc, setShowDesc] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const createManual = useMutation(api.manualTasks.create);
  const createTask = useMutation(api.shaktiTasks.create);

  const clients = useQuery(api.clients.list);
  const projects = useQuery(
    api.projects.listByClient,
    clientSlug ? { clientSlug } : "skip"
  );

  async function handleQuickSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!quickTitle.trim()) return;
    setSubmitting(true);
    try {
      await createManual({ title: quickTitle.trim(), description: quickDesc.trim() || undefined });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleClientSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientSlug || !projectSlug || !title.trim()) return;
    setSubmitting(true);
    try {
      await createTask({
        clientSlug,
        projectSlug,
        title: title.trim(),
        taskType,
        priority,
        status: "todo",
        estimatedHours: estimatedHours ? parseFloat(estimatedHours) : undefined,
        deadline: deadline || undefined,
        description: description.trim() || undefined,
      });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-xl border border-border-color/60 bg-surface p-3 space-y-2.5 shadow-sm">
      {/* Mode tabs */}
      <div className="flex gap-1 bg-surface-alt rounded-lg p-0.5">
        {(["quick", "client"] as Mode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`flex-1 text-[11px] font-medium py-1 rounded-md transition-colors ${
              mode === m
                ? "bg-white text-text-primary shadow-sm"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {m === "quick" ? "Quick Task" : "Client Task"}
          </button>
        ))}
      </div>

      {mode === "quick" ? (
        <form onSubmit={handleQuickSubmit} className="space-y-2">
          <input
            autoFocus
            type="text"
            placeholder="Task title"
            value={quickTitle}
            onChange={(e) => setQuickTitle(e.target.value)}
            className="w-full text-xs bg-surface-alt rounded-lg px-3 py-2 text-text-primary placeholder-text-secondary/50 border border-border-color/40 focus:outline-none focus:border-accent-blue/50"
          />
          <textarea
            placeholder="Description (optional)"
            value={quickDesc}
            onChange={(e) => setQuickDesc(e.target.value)}
            rows={2}
            className="w-full text-xs bg-surface-alt rounded-lg px-3 py-2 text-text-primary placeholder-text-secondary/50 border border-border-color/40 focus:outline-none focus:border-accent-blue/50 resize-none"
          />
          <div className="flex items-center gap-2 justify-end">
            <button type="button" onClick={onClose} className="text-xs text-text-secondary hover:text-text-primary transition-colors px-2 py-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!quickTitle.trim() || submitting}
              className="text-xs px-3 py-1.5 rounded-lg bg-accent-blue text-white font-medium disabled:opacity-40 transition-opacity"
            >
              {submitting ? "Adding…" : "Add"}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleClientSubmit} className="space-y-2">
          {/* Client select */}
          <select
            autoFocus
            value={clientSlug}
            onChange={(e) => { setClientSlug(e.target.value); setProjectSlug(""); }}
            className="w-full text-xs bg-surface-alt rounded-lg px-3 py-2 text-text-primary border border-border-color/40 focus:outline-none focus:border-accent-blue/50"
          >
            <option value="">Select client…</option>
            {clients?.map((c) => (
              <option key={c._id} value={c.slug}>{c.name}</option>
            ))}
          </select>

          {/* Project select */}
          <select
            value={projectSlug}
            onChange={(e) => setProjectSlug(e.target.value)}
            disabled={!clientSlug}
            className="w-full text-xs bg-surface-alt rounded-lg px-3 py-2 text-text-primary border border-border-color/40 focus:outline-none focus:border-accent-blue/50 disabled:opacity-50"
          >
            <option value="">Select project…</option>
            {projects?.map((p) => (
              <option key={p._id} value={p.slug}>{p.name}</option>
            ))}
          </select>

          {/* Title */}
          <input
            type="text"
            placeholder="Task title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-xs bg-surface-alt rounded-lg px-3 py-2 text-text-primary placeholder-text-secondary/50 border border-border-color/40 focus:outline-none focus:border-accent-blue/50"
          />

          {/* Task type + priority */}
          <div className="grid grid-cols-2 gap-2">
            <select
              value={taskType}
              onChange={(e) => setTaskType(e.target.value)}
              className="text-xs bg-surface-alt rounded-lg px-3 py-2 text-text-primary border border-border-color/40 focus:outline-none focus:border-accent-blue/50"
            >
              {TASK_TYPES.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
            <select
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="text-xs bg-surface-alt rounded-lg px-3 py-2 text-text-primary border border-border-color/40 focus:outline-none focus:border-accent-blue/50"
            >
              {PRIORITY_OPTIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>

          {/* Est. hours + deadline */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              placeholder="Est. hours"
              value={estimatedHours}
              onChange={(e) => setEstimatedHours(e.target.value)}
              min="0"
              step="0.5"
              className="text-xs bg-surface-alt rounded-lg px-3 py-2 text-text-primary placeholder-text-secondary/50 border border-border-color/40 focus:outline-none focus:border-accent-blue/50"
            />
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="text-xs bg-surface-alt rounded-lg px-3 py-2 text-text-primary border border-border-color/40 focus:outline-none focus:border-accent-blue/50"
            />
          </div>

          {/* Description toggle */}
          {showDesc ? (
            <textarea
              placeholder="Description (optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full text-xs bg-surface-alt rounded-lg px-3 py-2 text-text-primary placeholder-text-secondary/50 border border-border-color/40 focus:outline-none focus:border-accent-blue/50 resize-none"
            />
          ) : (
            <button
              type="button"
              onClick={() => setShowDesc(true)}
              className="text-[11px] text-text-secondary/60 hover:text-text-secondary transition-colors"
            >
              + Add description
            </button>
          )}

          <div className="flex items-center gap-2 justify-end">
            <button type="button" onClick={onClose} className="text-xs text-text-secondary hover:text-text-primary transition-colors px-2 py-1">
              Cancel
            </button>
            <button
              type="submit"
              disabled={!clientSlug || !projectSlug || !title.trim() || submitting}
              className="text-xs px-3 py-1.5 rounded-lg bg-orange-500 text-white font-medium disabled:opacity-40 transition-opacity"
            >
              {submitting ? "Adding…" : "Add Task"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
