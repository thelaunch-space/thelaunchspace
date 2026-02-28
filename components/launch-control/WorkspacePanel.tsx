"use client";

import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { Plus, Trash2 } from "lucide-react";

const CLIENT_TYPES = ["internal", "retainer", "project", "prospect"];
const CLIENT_STATUSES = ["active", "paused", "completed", "prospect"];
const PROJECT_STATUSES = ["active", "on-hold", "completed", "cancelled"];

function statusClass(status: string) {
  switch (status) {
    case "active":    return "bg-emerald-500/10 text-emerald-700 border-emerald-500/20";
    case "paused":    return "bg-amber-500/10 text-amber-700 border-amber-500/20";
    case "on-hold":   return "bg-amber-500/10 text-amber-700 border-amber-500/20";
    case "completed": return "bg-sky-500/10 text-sky-700 border-sky-500/20";
    case "cancelled": return "bg-rose-500/10 text-rose-600 border-rose-500/20";
    case "prospect":  return "bg-violet-500/10 text-violet-700 border-violet-500/20";
    default:          return "bg-surface-alt text-text-secondary border-border-color/40";
  }
}

function AddClientForm({ onDone }: { onDone: () => void }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState("internal");
  const [submitting, setSubmitting] = useState(false);
  const createClient = useMutation(api.clients.create);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !slug.trim()) return;
    setSubmitting(true);
    try {
      await createClient({ name: name.trim(), slug: slug.trim(), type });
      onDone();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2 flex-wrap">
      <input
        autoFocus
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
        }}
        className="text-xs bg-surface-alt rounded-lg px-2.5 py-1.5 text-text-primary placeholder-text-secondary/50 border border-border-color/40 focus:outline-none focus:border-accent-blue/50 w-32"
      />
      <input
        type="text"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="text-xs bg-surface-alt rounded-lg px-2.5 py-1.5 text-text-primary placeholder-text-secondary/50 border border-border-color/40 focus:outline-none focus:border-accent-blue/50 w-28 font-mono"
      />
      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="text-xs bg-surface-alt rounded-lg px-2.5 py-1.5 text-text-primary border border-border-color/40 focus:outline-none focus:border-accent-blue/50"
      >
        {CLIENT_TYPES.map((t) => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
      <button type="button" onClick={onDone} className="text-xs text-text-secondary hover:text-text-primary transition-colors px-1.5">
        Cancel
      </button>
      <button
        type="submit"
        disabled={!name.trim() || !slug.trim() || submitting}
        className="text-xs px-3 py-1.5 rounded-lg bg-accent-blue text-white font-medium disabled:opacity-40 transition-opacity"
      >
        {submitting ? "Adding…" : "Add"}
      </button>
    </form>
  );
}

function AddProjectForm({ onDone }: { onDone: (clientSlug: string) => void }) {
  const [clientSlug, setClientSlug] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const createProject = useMutation(api.projects.create);
  const clients = useQuery(api.clients.list);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!clientSlug || !name.trim() || !slug.trim()) return;
    setSubmitting(true);
    try {
      await createProject({ clientSlug, name: name.trim(), slug: slug.trim(), type: "general" });
      onDone(clientSlug);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-2 flex-wrap">
      <select
        autoFocus
        value={clientSlug}
        onChange={(e) => setClientSlug(e.target.value)}
        className="text-xs bg-surface-alt rounded-lg px-2.5 py-1.5 text-text-primary border border-border-color/40 focus:outline-none focus:border-accent-blue/50"
      >
        <option value="">Client…</option>
        {clients?.map((c) => (
          <option key={c._id} value={c.slug}>{c.name}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (!slug) setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""));
        }}
        className="text-xs bg-surface-alt rounded-lg px-2.5 py-1.5 text-text-primary placeholder-text-secondary/50 border border-border-color/40 focus:outline-none focus:border-accent-blue/50 w-32"
      />
      <input
        type="text"
        placeholder="Slug"
        value={slug}
        onChange={(e) => setSlug(e.target.value)}
        className="text-xs bg-surface-alt rounded-lg px-2.5 py-1.5 text-text-primary placeholder-text-secondary/50 border border-border-color/40 focus:outline-none focus:border-accent-blue/50 w-28 font-mono"
      />
      <button type="button" onClick={() => onDone("")} className="text-xs text-text-secondary hover:text-text-primary transition-colors px-1.5">
        Cancel
      </button>
      <button
        type="submit"
        disabled={!clientSlug || !name.trim() || !slug.trim() || submitting}
        className="text-xs px-3 py-1.5 rounded-lg bg-accent-blue text-white font-medium disabled:opacity-40 transition-opacity"
      >
        {submitting ? "Adding…" : "Add"}
      </button>
    </form>
  );
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function WorkspacePanel() {
  const [addingClient, setAddingClient] = useState(false);
  const [addingProject, setAddingProject] = useState(false);
  const [projectFilter, setProjectFilter] = useState("");
  const [historyClientFilter, setHistoryClientFilter] = useState("");
  const [historyProjectFilter, setHistoryProjectFilter] = useState("");

  const allClients = useQuery(api.clients.listAll) ?? [];
  const updateClientStatus = useMutation(api.clients.updateStatus);
  const removeClient = useMutation(api.clients.remove);
  const updateProjectStatus = useMutation(api.projects.updateStatus);
  const removeProject = useMutation(api.projects.remove);
  const removeTask = useMutation(api.shaktiTasks.remove);

  const projects = useQuery(
    api.projects.listByClient,
    projectFilter ? { clientSlug: projectFilter } : "skip"
  );

  const historyProjects = useQuery(
    api.projects.listByClient,
    historyClientFilter ? { clientSlug: historyClientFilter } : "skip"
  );

  const doneTasks = useQuery(
    api.shaktiTasks.listDone,
    historyClientFilter
      ? { clientSlug: historyClientFilter, projectSlug: historyProjectFilter || undefined }
      : "skip"
  );

  async function handleDeleteClient(id: Id<"clients">, name: string) {
    if (!window.confirm(`Delete client "${name}"? This cannot be undone.`)) return;
    await removeClient({ id });
  }

  async function handleDeleteProject(id: Id<"projects">, name: string) {
    if (!window.confirm(`Delete project "${name}"?`)) return;
    await removeProject({ id });
  }

  async function handleDeleteTask(id: Id<"tasks">, title: string) {
    if (!window.confirm(`Delete task "${title}"?`)) return;
    await removeTask({ id });
  }

  return (
    <div className="space-y-6">
      {/* Clients section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-text-primary">Clients</span>
          {!addingClient && (
            <button
              onClick={() => setAddingClient(true)}
              className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-accent-blue transition-colors"
            >
              <Plus size={12} /> Add Client
            </button>
          )}
        </div>

        <div className="rounded-xl border border-border-color/40 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface-alt border-b border-border-color/40">
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Name</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary font-mono">Slug</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Type</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Status</th>
                <th className="px-3 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {allClients.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-text-secondary/50">No clients yet</td>
                </tr>
              ) : (
                allClients.map((c) => (
                  <tr key={c._id} className="border-b border-border-color/20 last:border-0 hover:bg-surface-alt/50">
                    <td className="px-3 py-2 text-text-primary font-medium">{c.name}</td>
                    <td className="px-3 py-2 text-text-secondary font-mono">{c.slug}</td>
                    <td className="px-3 py-2 text-text-secondary">{c.type}</td>
                    <td className="px-3 py-2">
                      <select
                        value={c.status}
                        onChange={(e) => updateClientStatus({ id: c._id, status: e.target.value })}
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded border cursor-pointer focus:outline-none bg-transparent ${statusClass(c.status)}`}
                      >
                        {CLIENT_STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-surface text-text-primary">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleDeleteClient(c._id, c.name)}
                        className="text-text-secondary/30 hover:text-rose-500 transition-colors"
                        title="Delete client"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {addingClient && <AddClientForm onDone={() => setAddingClient(false)} />}
      </div>

      {/* Projects section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-text-primary">Projects</span>
          <div className="flex items-center gap-2">
            <select
              value={projectFilter}
              onChange={(e) => setProjectFilter(e.target.value)}
              className="text-[11px] bg-surface-alt rounded-lg px-2 py-1 text-text-secondary border border-border-color/40 focus:outline-none"
            >
              <option value="">Filter by client…</option>
              {allClients.map((c) => (
                <option key={c._id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            {!addingProject && (
              <button
                onClick={() => setAddingProject(true)}
                className="flex items-center gap-1 text-[11px] text-text-secondary hover:text-accent-blue transition-colors"
              >
                <Plus size={12} /> Add Project
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border-color/40 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface-alt border-b border-border-color/40">
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Name</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Client</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Type</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Status</th>
                <th className="px-3 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {!projectFilter ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-text-secondary/50">
                    Select a client to view projects
                  </td>
                </tr>
              ) : projects === undefined ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-text-secondary/50">Loading…</td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-4 text-center text-text-secondary/50">No projects for this client</td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p._id} className="border-b border-border-color/20 last:border-0 hover:bg-surface-alt/50">
                    <td className="px-3 py-2 text-text-primary font-medium">{p.name}</td>
                    <td className="px-3 py-2 text-text-secondary font-mono">{p.clientSlug}</td>
                    <td className="px-3 py-2 text-text-secondary">{p.type}</td>
                    <td className="px-3 py-2">
                      <select
                        value={p.status}
                        onChange={(e) => updateProjectStatus({ id: p._id, status: e.target.value })}
                        className={`text-[10px] font-medium px-1.5 py-0.5 rounded border cursor-pointer focus:outline-none bg-transparent ${statusClass(p.status)}`}
                      >
                        {PROJECT_STATUSES.map((s) => (
                          <option key={s} value={s} className="bg-surface text-text-primary">{s}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleDeleteProject(p._id, p.name)}
                        className="text-text-secondary/30 hover:text-rose-500 transition-colors"
                        title="Delete project"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {addingProject && (
          <AddProjectForm
            onDone={(slug) => {
              setAddingProject(false);
              if (slug) setProjectFilter(slug);
            }}
          />
        )}
      </div>

      {/* Task History section */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-text-primary">Task History</span>
          <div className="flex items-center gap-2">
            <select
              value={historyClientFilter}
              onChange={(e) => {
                setHistoryClientFilter(e.target.value);
                setHistoryProjectFilter("");
              }}
              className="text-[11px] bg-surface-alt rounded-lg px-2 py-1 text-text-secondary border border-border-color/40 focus:outline-none"
            >
              <option value="">Client…</option>
              {allClients.map((c) => (
                <option key={c._id} value={c.slug}>{c.name}</option>
              ))}
            </select>
            {historyClientFilter && (
              <select
                value={historyProjectFilter}
                onChange={(e) => setHistoryProjectFilter(e.target.value)}
                className="text-[11px] bg-surface-alt rounded-lg px-2 py-1 text-text-secondary border border-border-color/40 focus:outline-none"
              >
                <option value="">All projects</option>
                {historyProjects?.map((p) => (
                  <option key={p._id} value={p.slug}>{p.name}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-border-color/40 overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-surface-alt border-b border-border-color/40">
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Title</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Client</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Project</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Type</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Est</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Actual</th>
                <th className="px-3 py-2 text-left font-medium text-text-secondary">Done</th>
                <th className="px-3 py-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {!historyClientFilter ? (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-center text-text-secondary/50">
                    Select a client to filter history
                  </td>
                </tr>
              ) : doneTasks === undefined ? (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-center text-text-secondary/50">Loading…</td>
                </tr>
              ) : doneTasks.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-4 text-center text-text-secondary/50">No completed tasks</td>
                </tr>
              ) : (
                doneTasks.map((t) => (
                  <tr key={t._id} className="border-b border-border-color/20 last:border-0 hover:bg-surface-alt/50">
                    <td className="px-3 py-2 text-text-primary max-w-[160px] truncate" title={t.title}>{t.title}</td>
                    <td className="px-3 py-2 text-text-secondary font-mono">{t.clientSlug}</td>
                    <td className="px-3 py-2 text-text-secondary font-mono">{t.projectSlug}</td>
                    <td className="px-3 py-2 text-text-secondary">{t.taskType}</td>
                    <td className="px-3 py-2 text-text-secondary">{t.estimatedHours != null ? `${t.estimatedHours}h` : "—"}</td>
                    <td className="px-3 py-2 text-text-secondary">{t.actualHours != null ? `${t.actualHours}h` : "—"}</td>
                    <td className="px-3 py-2 text-text-secondary">{formatDate(t.updatedAt)}</td>
                    <td className="px-3 py-2">
                      <button
                        onClick={() => handleDeleteTask(t._id, t.title)}
                        className="text-text-secondary/30 hover:text-rose-500 transition-colors"
                        title="Delete task"
                      >
                        <Trash2 size={12} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
