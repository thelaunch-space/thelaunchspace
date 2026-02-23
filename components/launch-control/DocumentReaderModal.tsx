"use client";

import { useEffect } from "react";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

const CATEGORY_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  research: { label: "Research", color: "text-blue-700", bg: "bg-blue-500/10 border-blue-500/20" },
  strategy: { label: "Strategy", color: "text-cyan-700", bg: "bg-cyan-500/10 border-cyan-500/20" },
  brief: { label: "Brief", color: "text-emerald-700", bg: "bg-emerald-500/10 border-emerald-500/20" },
  process: { label: "Process", color: "text-amber-700", bg: "bg-amber-500/10 border-amber-500/20" },
  analysis: { label: "Analysis", color: "text-purple-700", bg: "bg-purple-500/10 border-purple-500/20" },
};

interface DocumentReaderModalProps {
  documentId: Id<"documents">;
  onClose: () => void;
}

export default function DocumentReaderModal({ documentId, onClose }: DocumentReaderModalProps) {
  const doc = useQuery(api.documents.getDocument, { documentId });

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const catConfig = doc
    ? CATEGORY_CONFIG[doc.category] ?? {
        label: doc.category,
        color: "text-text-secondary",
        bg: "bg-surface-alt border-border-color/30",
      }
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border-color/60 rounded-t-2xl sm:rounded-2xl shadow-card-hover w-full sm:max-w-[1200px] max-h-[95vh] sm:max-h-[90vh] relative animate-scaleIn overflow-hidden flex flex-col sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-border-color/40 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h2 className="font-display text-base sm:text-lg font-semibold text-text-primary truncate">
              {doc?.title ?? "Loading..."}
            </h2>
            {catConfig && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${catConfig.color} ${catConfig.bg}`}>
                {catConfig.label}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text-secondary hover:text-text-primary transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {doc === undefined ? (
          <div className="p-8 animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-surface-alt rounded" style={{ width: `${90 - i * 10}%` }} />
            ))}
          </div>
        ) : doc === null ? (
          <div className="p-8 text-center">
            <p className="text-sm text-text-secondary">Document not found.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <div className="flex flex-col lg:flex-row">
              {/* Left: Markdown content */}
              <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
                {doc.content ? (
                  <article>
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="font-display text-2xl font-semibold text-text-primary mb-4 tracking-tight">{children}</h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="font-display text-xl font-semibold text-text-primary mt-6 mb-3 tracking-tight">{children}</h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="font-display text-lg font-semibold text-text-primary mt-5 mb-2">{children}</h3>
                        ),
                        p: ({ children }) => (
                          <p className="text-sm text-text-secondary leading-relaxed mb-3">{children}</p>
                        ),
                        ul: ({ children }) => (
                          <ul className="text-sm text-text-secondary space-y-1 mb-3 ml-4 list-disc">{children}</ul>
                        ),
                        ol: ({ children }) => (
                          <ol className="text-sm text-text-secondary space-y-1 mb-3 ml-4 list-decimal">{children}</ol>
                        ),
                        li: ({ children }) => (
                          <li className="leading-relaxed">{children}</li>
                        ),
                        code: ({ children, className }) => {
                          const isInline = !className;
                          if (isInline) {
                            return (
                              <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded text-accent-purple">{children}</code>
                            );
                          }
                          return <code className="font-mono text-xs">{children}</code>;
                        },
                        pre: ({ children }) => (
                          <pre className="bg-surface-alt rounded-lg p-4 overflow-x-auto mb-3 text-xs">{children}</pre>
                        ),
                        a: ({ href, children }) => (
                          <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">{children}</a>
                        ),
                        blockquote: ({ children }) => (
                          <blockquote className="border-l-2 border-accent-blue/30 pl-4 italic text-text-secondary mb-3">{children}</blockquote>
                        ),
                        table: ({ children }) => (
                          <div className="overflow-x-auto mb-3">
                            <table className="w-full text-xs border-collapse">{children}</table>
                          </div>
                        ),
                        th: ({ children }) => (
                          <th className="text-left px-3 py-2 border-b border-border-color/40 font-medium text-text-primary bg-surface-alt/50">{children}</th>
                        ),
                        td: ({ children }) => (
                          <td className="px-3 py-2 border-b border-border-color/20 text-text-secondary">{children}</td>
                        ),
                      }}
                    >
                      {doc.content}
                    </ReactMarkdown>
                  </article>
                ) : (
                  <p className="text-sm text-text-secondary italic">No content available for this document.</p>
                )}
              </div>

              {/* Right: Document metadata sidebar */}
              <div className="hidden sm:block lg:w-[280px] shrink-0 border-t lg:border-t-0 lg:border-l border-border-color/40 p-4 sm:p-6 bg-surface-alt/20 space-y-5">
                {/* Agent */}
                <div>
                  <p className="meta-label text-text-secondary mb-2">Created by</p>
                  <div className="flex items-center gap-2">
                    <img
                      src={`/agent-avatars/${doc.agentName.toLowerCase()}.png`}
                      alt={doc.agentName}
                      className="w-6 h-6 rounded-full object-cover border border-border-color/40"
                    />
                    <span className="text-xs font-medium text-text-primary">{doc.agentName}</span>
                  </div>
                </div>

                {/* Category */}
                <div>
                  <p className="meta-label text-text-secondary mb-2">Category</p>
                  <span className={`text-[10px] font-medium px-2 py-0.5 rounded border ${catConfig?.bg} ${catConfig?.color}`}>
                    {catConfig?.label ?? doc.category}
                  </span>
                </div>

                {/* Created */}
                <div>
                  <p className="meta-label text-text-secondary mb-2">Created</p>
                  <span className="text-xs font-mono text-text-secondary">{doc.createdAt}</span>
                </div>

                {/* Updated */}
                {doc.updatedAt && (
                  <div>
                    <p className="meta-label text-text-secondary mb-2">Last updated</p>
                    <span className="text-xs font-mono text-text-secondary">{doc.updatedAt}</span>
                  </div>
                )}

                {/* Tags */}
                {doc.tags && doc.tags.length > 0 && (
                  <div>
                    <p className="meta-label text-text-secondary mb-2">Tags</p>
                    <div className="flex flex-wrap gap-1">
                      {doc.tags.map((tag) => (
                        <span key={tag} className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-alt text-text-secondary">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* File path reference */}
                {doc.filePath && (
                  <div>
                    <p className="meta-label text-text-secondary mb-2">VPS Path</p>
                    <p className="text-[10px] font-mono text-text-secondary/70 break-all leading-relaxed">
                      {doc.filePath}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
