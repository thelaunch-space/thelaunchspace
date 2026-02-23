"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowLeft, FileText, ChevronRight } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import DocumentReaderModal from "./DocumentReaderModal";

/* ─── Agent Config ────────────────────────────────────────────────────────── */

interface AgentMeta {
  id: string;
  name: string;
  role: string;
  accentHex: string;
  /** Tailwind ring color for hover/selected state */
  ringClass: string;
  /** Tailwind bg/text for the doc count pill */
  pillBg: string;
  pillText: string;
}

const AGENT_META: AgentMeta[] = [
  {
    id: "parthasarathi",
    name: "Parthasarathi",
    role: "Operations Orchestrator",
    accentHex: "#003DA5",
    ringClass: "ring-[#003DA5]/40",
    pillBg: "bg-[#003DA5]/8",
    pillText: "text-[#003DA5]",
  },
  {
    id: "vibhishana",
    name: "Vibhishana",
    role: "Research Intelligence",
    accentHex: "#5A9A80",
    ringClass: "ring-accent-emerald/40",
    pillBg: "bg-accent-emerald/8",
    pillText: "text-accent-emerald",
  },
  {
    id: "vyasa",
    name: "Vyasa",
    role: "SEO Blog Writer",
    accentHex: "#6D28D9",
    ringClass: "ring-accent-purple/40",
    pillBg: "bg-accent-purple/8",
    pillText: "text-accent-purple",
  },
  {
    id: "vidura",
    name: "Vidura",
    role: "SEO Strategist",
    accentHex: "#0D9488",
    ringClass: "ring-[#0D9488]/40",
    pillBg: "bg-[#0D9488]/8",
    pillText: "text-[#0D9488]",
  },
  {
    id: "valmiki",
    name: "Valmiki",
    role: "LinkedIn Growth Engine",
    accentHex: "#E11D48",
    ringClass: "ring-accent-rose/40",
    pillBg: "bg-accent-rose/8",
    pillText: "text-accent-rose",
  },
  {
    id: "sanjaya",
    name: "Sanjaya",
    role: "Lead Intelligence Scout",
    accentHex: "#D97706",
    ringClass: "ring-accent-amber/40",
    pillBg: "bg-accent-amber/8",
    pillText: "text-accent-amber",
  },
];

/* ─── Category Config ─────────────────────────────────────────────────────── */

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  research: { label: "Research", color: "text-blue-700", bg: "bg-blue-500/10 border-blue-500/20" },
  strategy: { label: "Strategy", color: "text-cyan-700", bg: "bg-cyan-500/10 border-cyan-500/20" },
  brief: { label: "Brief", color: "text-emerald-700", bg: "bg-emerald-500/10 border-emerald-500/20" },
  process: { label: "Process", color: "text-amber-700", bg: "bg-amber-500/10 border-amber-500/20" },
  analysis: { label: "Analysis", color: "text-purple-700", bg: "bg-purple-500/10 border-purple-500/20" },
};

function CategoryBadge({ category }: { category: string }) {
  const c = CATEGORY_CONFIG[category] ?? {
    label: category,
    color: "text-text-secondary",
    bg: "bg-surface-alt border-border-color/30",
  };
  return (
    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded border ${c.bg} ${c.color}`}>
      {c.label}
    </span>
  );
}

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function DocumentsPanel() {
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocId, setSelectedDocId] = useState<Id<"documents"> | null>(null);

  // Fetch all doc metadata (no content field — lightweight)
  const documents = useQuery(api.documents.listMetadata);

  // Compute doc counts per agent
  const docCounts = useMemo(() => {
    if (!documents) return {};
    const counts: Record<string, number> = {};
    for (const doc of documents) {
      const key = doc.agentName.toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [documents]);

  // Filter documents for current view
  const filteredDocs = useMemo(() => {
    if (!documents) return [];

    let docs = documents;

    // If searching, search across all agents
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      docs = docs.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          (d.summary && d.summary.toLowerCase().includes(q)) ||
          d.agentName.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q)
      );
    } else if (selectedAgent) {
      // Filter by selected agent
      docs = docs.filter(
        (d) => d.agentName.toLowerCase() === selectedAgent.toLowerCase()
      );
    }

    return docs;
  }, [documents, searchQuery, selectedAgent]);

  const isSearching = searchQuery.trim().length > 0;
  const showAgentPicker = !selectedAgent && !isSearching;

  const selectedAgentMeta = selectedAgent
    ? AGENT_META.find((a) => a.id === selectedAgent)
    : null;

  return (
    <>
      <div className="p-4">
        {/* Search bar — always visible */}
        <div className="relative mb-4">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/50"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all documents..."
            className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-border-color/40 bg-surface-alt/30 text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-accent-blue/40 focus:bg-white transition-colors"
          />
        </div>

        <AnimatePresence mode="wait">
          {showAgentPicker ? (
            /* ─── Agent Picker Grid ─────────────────────────────── */
            <motion.div
              key="agent-picker"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              <p className="meta-label text-text-secondary mb-3">
                Browse by agent
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {AGENT_META.map((agent) => {
                  const count = docCounts[agent.id] || 0;

                  return (
                    <button
                      key={agent.id}
                      onClick={() => setSelectedAgent(agent.id)}
                      className={`group relative flex flex-col items-center gap-2.5 p-4 rounded-xl border border-border-color/30 bg-white transition-all hover:shadow-card-hover hover:border-border-color/60 hover:-translate-y-0.5 text-center`}
                    >
                      {/* Avatar */}
                      <div
                        className="relative w-14 h-14 rounded-full overflow-hidden border-2 transition-all"
                        style={{
                          borderColor: `${agent.accentHex}20`,
                        }}
                      >
                        <img
                          src={`/agent-avatars/${agent.id}.png`}
                          alt={agent.name}
                          className="w-full h-full object-cover"
                        />
                        {/* Subtle accent glow on hover */}
                        <div
                          className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          style={{
                            boxShadow: `inset 0 0 0 2px ${agent.accentHex}40`,
                          }}
                        />
                      </div>

                      {/* Name + role */}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-text-primary leading-tight">
                          {agent.name}
                        </p>
                        <p className="text-[10px] text-text-secondary mt-0.5 leading-tight">
                          {agent.role}
                        </p>
                      </div>

                      {/* Doc count pill */}
                      <span
                        className={`text-[10px] font-mono font-medium px-2 py-0.5 rounded-full ${agent.pillBg} ${agent.pillText}`}
                      >
                        {documents === undefined ? "—" : count}{" "}
                        {count === 1 ? "doc" : "docs"}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Total count */}
              {documents !== undefined && (
                <p className="text-[10px] text-text-secondary/60 text-center mt-3 font-mono">
                  {documents.length} documents total
                </p>
              )}
            </motion.div>
          ) : (
            /* ─── Document List View ────────────────────────────── */
            <motion.div
              key="doc-list"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
            >
              {/* Header: back button + agent info OR search results label */}
              <div className="flex items-center gap-2.5 mb-3">
                {!isSearching && (
                  <button
                    onClick={() => setSelectedAgent(null)}
                    className="p-1.5 -ml-1.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-alt/60 transition-colors"
                    aria-label="Back to agents"
                  >
                    <ArrowLeft size={16} />
                  </button>
                )}

                {isSearching ? (
                  <p className="text-xs text-text-secondary">
                    {filteredDocs.length} result{filteredDocs.length !== 1 ? "s" : ""} for &ldquo;{searchQuery}&rdquo;
                  </p>
                ) : selectedAgentMeta ? (
                  <div className="flex items-center gap-2.5">
                    <img
                      src={`/agent-avatars/${selectedAgentMeta.id}.png`}
                      alt={selectedAgentMeta.name}
                      className="w-7 h-7 rounded-full object-cover border border-border-color/40"
                    />
                    <div>
                      <p className="text-sm font-semibold text-text-primary leading-tight">
                        {selectedAgentMeta.name}
                      </p>
                      <p className="text-[10px] text-text-secondary">
                        {filteredDocs.length} document{filteredDocs.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                ) : null}
              </div>

              {/* Loading state */}
              {documents === undefined ? (
                <div className="space-y-2.5 animate-pulse">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="rounded-xl border border-border-color/30 p-3.5"
                    >
                      <div className="h-3.5 bg-surface-alt rounded w-3/4 mb-2" />
                      <div className="h-3 bg-surface-alt rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : filteredDocs.length === 0 ? (
                <div className="text-center py-10">
                  <FileText
                    size={28}
                    className="mx-auto text-text-secondary/30 mb-2"
                  />
                  <p className="text-xs text-text-secondary">
                    {isSearching
                      ? "No documents match your search"
                      : "No documents from this agent yet"}
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredDocs.map((doc) => {
                    // Find agent color for the left accent
                    const agentMeta = AGENT_META.find(
                      (a) =>
                        a.name.toLowerCase() === doc.agentName.toLowerCase() ||
                        a.id === doc.agentName.toLowerCase()
                    );

                    return (
                      <button
                        key={doc._id}
                        onClick={() => setSelectedDocId(doc._id)}
                        className="w-full text-left group flex items-start gap-3 p-3 rounded-xl border border-border-color/20 hover:border-border-color/50 hover:bg-surface-alt/30 transition-all"
                      >
                        {/* Accent bar */}
                        <div
                          className="w-0.5 h-10 rounded-full shrink-0 mt-0.5"
                          style={{
                            backgroundColor: agentMeta?.accentHex ?? "#6B7280",
                          }}
                        />

                        <div className="min-w-0 flex-1">
                          {/* Title row */}
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-xs font-semibold text-text-primary group-hover:text-accent-blue transition-colors line-clamp-1">
                              {doc.title}
                            </p>
                            <ChevronRight
                              size={14}
                              className="shrink-0 text-text-secondary/30 group-hover:text-text-secondary/60 transition-colors mt-0.5"
                            />
                          </div>

                          {/* Meta row: category + agent (if searching) + date */}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <CategoryBadge category={doc.category} />
                            {isSearching && (
                              <span className="text-[10px] text-text-secondary/60 font-mono">
                                {doc.agentName}
                              </span>
                            )}
                            <span className="text-[10px] text-text-secondary/50 font-mono">
                              {doc.createdAt}
                            </span>
                          </div>

                          {/* Summary */}
                          {doc.summary && (
                            <p className="text-[11px] text-text-secondary mt-1.5 line-clamp-2 leading-relaxed">
                              {doc.summary}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Document Reader Modal */}
      {selectedDocId && (
        <DocumentReaderModal
          documentId={selectedDocId}
          onClose={() => setSelectedDocId(null)}
        />
      )}
    </>
  );
}
