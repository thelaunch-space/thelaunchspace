"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { X } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { BRIEF_STATUS_CONFIG } from "@/lib/launch-control-types";
/**
 * Public read-only view of research briefs.
 * Shows brief metadata openly. Full brief content viewable via modal.
 */
export default function BriefsPreview() {
  const briefs = useQuery(api.briefs.listMetadata, { limit: 20 });
  const [selectedId, setSelectedId] = useState<Id<"briefs"> | null>(null);

  if (briefs === undefined) {
    return (
      <div className="space-y-3 animate-pulse p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-surface-alt rounded-xl" />
        ))}
      </div>
    );
  }

  if (briefs.length === 0) {
    return (
      <p className="text-xs text-text-secondary italic text-center py-8">
        No briefs created yet
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3 p-4">
          {briefs.map((b) => {
            const statusConf = BRIEF_STATUS_CONFIG[b.status] ?? { label: b.status, color: "text-text-secondary", bg: "bg-surface-alt border-border-color/30" };
            return (
              <button
                key={b._id}
                onClick={() => setSelectedId(b._id)}
                className="w-full text-left rounded-xl border border-border-color/30 bg-surface-alt/30 p-3 transition-colors hover:border-accent-blue/40 hover:bg-surface-alt/50 cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-xs font-medium line-clamp-2 text-text-primary">{b.title}</p>
                  <span className={`shrink-0 text-[10px] font-mono px-1.5 py-0.5 rounded border ${statusConf.bg} ${statusConf.color}`}>
                    {statusConf.label}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] font-mono text-text-secondary">{b.primaryKeyword}</span>
                  {b.category && (
                    <>
                      <span className="text-[10px] text-text-secondary">&middot;</span>
                      <span className="text-[10px] text-text-secondary">{b.category}</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>

      {selectedId && (
        <PublicBriefModal briefId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </>
  );
}

function PublicBriefModal({ briefId, onClose }: { briefId: Id<"briefs">; onClose: () => void }) {
  const brief = useQuery(api.briefs.getPublicBrief, { briefId });

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

  const statusConfig = brief
    ? BRIEF_STATUS_CONFIG[brief.status] ?? { label: brief.status, color: "text-text-secondary", bg: "bg-surface-alt border-border-color/30" }
    : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border-color/60 rounded-t-2xl sm:rounded-2xl shadow-card-hover w-full sm:max-w-[900px] max-h-[95vh] sm:max-h-[90vh] relative animate-scaleIn overflow-hidden flex flex-col sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-border-color/40 shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h2 className="font-display text-base sm:text-lg font-semibold text-text-primary truncate">
              {brief?.title ?? "Loading..."}
            </h2>
            {statusConfig && (
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${statusConfig.color} ${statusConfig.bg}`}>
                {statusConfig.label}
              </span>
            )}
          </div>
          <button onClick={onClose} className="p-2 text-text-secondary hover:text-text-primary transition-colors shrink-0" aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        {brief === undefined ? (
          <div className="p-8 animate-pulse space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-4 bg-surface-alt rounded" style={{ width: `${90 - i * 10}%` }} />
            ))}
          </div>
        ) : brief === null ? (
          <div className="p-8 text-center">
            <p className="text-sm text-text-secondary">Brief not found.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            {brief.contentMarkdown ? (
              <article>
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ children }) => <h1 className="font-display text-2xl font-semibold text-text-primary mb-4 tracking-tight">{children}</h1>,
                    h2: ({ children }) => <h2 className="font-display text-xl font-semibold text-text-primary mt-6 mb-3 tracking-tight">{children}</h2>,
                    h3: ({ children }) => <h3 className="font-display text-lg font-semibold text-text-primary mt-5 mb-2">{children}</h3>,
                    p: ({ children }) => <p className="text-sm text-text-secondary leading-relaxed mb-3">{children}</p>,
                    ul: ({ children }) => <ul className="text-sm text-text-secondary space-y-1 mb-3 ml-4 list-disc">{children}</ul>,
                    ol: ({ children }) => <ol className="text-sm text-text-secondary space-y-1 mb-3 ml-4 list-decimal">{children}</ol>,
                    li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                    code: ({ children, className }) => {
                      if (!className) return <code className="font-mono text-xs bg-surface-alt px-1.5 py-0.5 rounded text-accent-purple">{children}</code>;
                      return <code className="font-mono text-xs">{children}</code>;
                    },
                    pre: ({ children }) => <pre className="bg-surface-alt rounded-lg p-4 overflow-x-auto mb-3 text-xs">{children}</pre>,
                    a: ({ href, children }) => <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent-blue hover:underline">{children}</a>,
                    blockquote: ({ children }) => <blockquote className="border-l-2 border-accent-blue/30 pl-4 italic text-text-secondary mb-3">{children}</blockquote>,
                    table: ({ children }) => <div className="overflow-x-auto mb-3"><table className="w-full text-xs border-collapse">{children}</table></div>,
                    th: ({ children }) => <th className="text-left px-3 py-2 border-b border-border-color/40 font-medium text-text-primary bg-surface-alt/50">{children}</th>,
                    td: ({ children }) => <td className="px-3 py-2 border-b border-border-color/20 text-text-secondary">{children}</td>,
                  }}
                >
                  {brief.contentMarkdown}
                </ReactMarkdown>
              </article>
            ) : (
              <p className="text-sm text-text-secondary italic">No content available for this brief.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
