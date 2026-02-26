"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface AddManualTaskFormProps {
  onClose: () => void;
}

export default function AddManualTaskForm({ onClose }: AddManualTaskFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const createTask = useMutation(api.manualTasks.create);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;

    setSubmitting(true);
    try {
      await createTask({ title: title.trim(), description: description.trim() || undefined });
      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-border-color/60 bg-surface p-3 space-y-2 shadow-sm">
      <input
        autoFocus
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-xs bg-surface-alt rounded-lg px-3 py-2 text-text-primary placeholder-text-secondary/50 border border-border-color/40 focus:outline-none focus:border-accent-blue/50"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="w-full text-xs bg-surface-alt rounded-lg px-3 py-2 text-text-primary placeholder-text-secondary/50 border border-border-color/40 focus:outline-none focus:border-accent-blue/50 resize-none"
      />
      <div className="flex items-center gap-2 justify-end">
        <button
          type="button"
          onClick={() => { onClose(); }}
          className="text-xs text-text-secondary hover:text-text-primary transition-colors px-2 py-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || submitting}
          className="text-xs px-3 py-1.5 rounded-lg bg-accent-blue text-white font-medium disabled:opacity-40 transition-opacity"
        >
          {submitting ? "Adding…" : "Add"}
        </button>
      </div>
    </form>
  );
}
