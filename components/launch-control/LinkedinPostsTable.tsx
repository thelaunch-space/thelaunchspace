"use client";

import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { X, Copy, Check } from "lucide-react";
import type { Doc } from "@/convex/_generated/dataModel";

type LinkedinPost = Doc<"linkedinPosts">;

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending_review: { label: "Pending Review", color: "text-amber-700", bg: "bg-amber-500/10" },
  needs_revision: { label: "Needs Revision", color: "text-red-700",   bg: "bg-red-500/10" },
  approved:       { label: "Approved",        color: "text-blue-700",  bg: "bg-blue-500/10" },
  draft_ready:    { label: "Draft Ready",     color: "text-emerald-700", bg: "bg-emerald-500/10" },
  dropped:        { label: "Dropped",         color: "text-text-secondary", bg: "bg-surface-alt" },
  posted:         { label: "Posted",          color: "text-emerald-700", bg: "bg-emerald-500/10" },
  skipped:        { label: "Skipped",         color: "text-text-secondary", bg: "bg-surface-alt" },
};

function inferPhase(post: LinkedinPost): { label: string; color: string } {
  if (post.status === "draft_ready" || post.status === "posted" || post.status === "skipped") {
    return post.draftText
      ? { label: "Post-Draft", color: "text-emerald-600" }
      : { label: "Post-Brief", color: "text-amber-600" };
  }
  if (post.status === "approved") return { label: "Writing…", color: "text-blue-500" };
  if (post.status === "needs_revision") return { label: "Needs Revision", color: "text-red-500" };
  if (post.status === "dropped") return { label: "Dropped", color: "text-text-secondary" };
  return { label: "Post-Brief", color: "text-amber-600" };
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className="ml-1 shrink-0 p-0.5 rounded text-text-secondary/50 hover:text-text-secondary transition-colors"
      title="Copy"
    >
      {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
    </button>
  );
}

function PostDetailModal({ post, onClose }: { post: LinkedinPost; onClose: () => void }) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handleEsc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const statusConfig = STATUS_CONFIG[post.status] ?? {
    label: post.status,
    color: "text-text-secondary",
    bg: "bg-surface-alt",
  };
  const phase = inferPhase(post);
  const hasSidebar = !!(post.rationale || post.hookOptions?.length || post.ctaOptions?.length);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center sm:justify-center bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border-color/60 rounded-t-2xl sm:rounded-2xl shadow-card-hover w-full sm:max-w-[1100px] max-h-[95vh] sm:max-h-[90vh] relative animate-scaleIn overflow-hidden flex flex-col sm:mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 sm:py-4 border-b border-border-color/40 shrink-0">
          <div className="flex flex-col gap-0.5 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-wrap">
              <h2 className="font-display text-base sm:text-lg font-semibold text-text-primary truncate">
                {post.insightName}
              </h2>
              <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border shrink-0 ${statusConfig.color} ${statusConfig.bg} border-current/20`}>
                {statusConfig.label}
              </span>
              <span className={`text-[10px] font-medium shrink-0 ${phase.color}`}>
                {phase.label}
              </span>
            </div>
            {post.sourceBlogTitle && (
              <p className="text-[11px] text-text-secondary italic truncate">↳ {post.sourceBlogTitle}</p>
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col lg:flex-row">
            {/* Left — main content */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 space-y-6">
              {post.draftText ? (
                <>
                  {post.insightText && (
                    <div>
                      <p className="text-[11px] font-medium text-text-secondary/60 uppercase tracking-wider mb-2">Angle</p>
                      <p className="text-sm text-text-primary leading-relaxed">{post.insightText}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-[11px] font-medium text-text-secondary/60 uppercase tracking-wider mb-3">Full Draft</p>
                    <pre className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap font-sans bg-surface-alt/30 border border-border-color/20 rounded-xl p-4">
                      {post.draftText}
                    </pre>
                  </div>
                </>
              ) : (
                <>
                  {post.insightText ? (
                    <div>
                      <p className="text-[11px] font-medium text-text-secondary/60 uppercase tracking-wider mb-2">Angle / Insight</p>
                      <p className="text-sm text-text-primary leading-relaxed">{post.insightText}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-text-secondary italic">No brief content yet.</p>
                  )}
                </>
              )}
              {post.krishnaFeedback && (
                <div>
                  <p className="text-[11px] font-medium text-text-secondary/60 uppercase tracking-wider mb-2">Your Feedback</p>
                  <p className="text-sm text-amber-700 leading-relaxed bg-amber-50/50 border border-amber-200/40 rounded-xl p-3">{post.krishnaFeedback}</p>
                </div>
              )}
            </div>

            {/* Right sidebar */}
            {hasSidebar && (
              <div className="hidden sm:block lg:w-[320px] shrink-0 border-t lg:border-t-0 lg:border-l border-border-color/40 p-4 sm:p-6 bg-surface-alt/20 space-y-6">
                {post.rationale && (
                  <div>
                    <p className="text-[11px] font-medium text-text-secondary/60 uppercase tracking-wider mb-2">Why ICP will bookmark this</p>
                    <p className="text-xs text-text-secondary leading-relaxed">{post.rationale}</p>
                  </div>
                )}
                {post.hookOptions && post.hookOptions.length > 0 && (
                  <div>
                    <p className="text-[11px] font-medium text-text-secondary/60 uppercase tracking-wider mb-3">Hook Options</p>
                    <ol className="space-y-2">
                      {post.hookOptions.map((hook, i) => (
                        <li key={i} className="flex items-start gap-2 group">
                          <span className="text-[10px] font-mono text-text-secondary/40 mt-0.5 shrink-0 w-4">{i + 1}.</span>
                          <p className="text-xs text-text-secondary leading-relaxed flex-1">{hook}</p>
                          <CopyButton text={hook} />
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
                {post.ctaOptions && post.ctaOptions.length > 0 && (
                  <div>
                    <p className="text-[11px] font-medium text-text-secondary/60 uppercase tracking-wider mb-3">CTA Options</p>
                    <ol className="space-y-2">
                      {post.ctaOptions.map((cta, i) => (
                        <li key={i} className="flex items-start gap-2 group">
                          <span className="text-[10px] font-mono text-text-secondary/40 mt-0.5 shrink-0 w-4">{i + 1}.</span>
                          <p className="text-xs text-text-secondary leading-relaxed flex-1">{cta}</p>
                          <CopyButton text={cta} />
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LinkedinPostsTable() {
  const posts = useQuery(api.linkedinPosts.listAll);
  const [selectedPost, setSelectedPost] = useState<LinkedinPost | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [phaseFilter, setPhaseFilter] = useState("all");

  if (posts === undefined) {
    return (
      <div className="space-y-2 animate-pulse p-4">
        {[1, 2, 3, 4, 5].map((i) => <div key={i} className="h-10 bg-surface-alt rounded" />)}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <p className="text-xs text-text-secondary italic text-center py-8">
        No LinkedIn posts yet — Valmiki extracts daily at 7 PM
      </p>
    );
  }

  const filtered = posts.filter((p) => {
    if (statusFilter !== "all" && p.status !== statusFilter) return false;
    if (phaseFilter !== "all") {
      const hasDraft = !!p.draftText;
      if (phaseFilter === "brief" && hasDraft) return false;
      if (phaseFilter === "draft" && !hasDraft) return false;
    }
    return true;
  });

  const statuses = [...new Set(posts.map((p) => p.status))];

  const StatusBadge = ({ status }: { status: string }) => {
    const config = STATUS_CONFIG[status] ?? { label: status, color: "text-text-secondary", bg: "bg-surface-alt" };
    return (
      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${config.bg} ${config.color}`}>
        {config.label}
      </span>
    );
  };

  // Mobile cards
  const MobileCards = () => (
    <div className="md:hidden space-y-3 p-3">
      {filtered.map((post) => {
        const phase = inferPhase(post);
        return (
          <button
            key={post._id}
            onClick={() => setSelectedPost(post)}
            className="w-full text-left rounded-xl border border-border-color/30 p-3 space-y-2 hover:border-border-color/60 transition-colors"
          >
            <p className="text-xs font-medium text-text-primary line-clamp-1">{post.insightName}</p>
            <p className="text-[10px] text-text-secondary truncate">↳ {post.sourceBlogSlug}</p>
            <div className="flex items-center gap-2">
              <StatusBadge status={post.status} />
              <span className={`text-[10px] font-medium ${phase.color}`}>{phase.label}</span>
              <span className="ml-auto text-[10px] font-mono text-text-secondary/60">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="lg:flex lg:flex-col lg:flex-1 lg:min-h-0">
      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-3 shrink-0 px-3 pt-3">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-[11px] px-2 py-1 rounded-lg border border-border-color/40 bg-surface text-text-secondary"
        >
          <option value="all">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{STATUS_CONFIG[s]?.label ?? s}</option>
          ))}
        </select>
        <select
          value={phaseFilter}
          onChange={(e) => setPhaseFilter(e.target.value)}
          className="text-[11px] px-2 py-1 rounded-lg border border-border-color/40 bg-surface text-text-secondary"
        >
          <option value="all">All phases</option>
          <option value="brief">Post-Brief</option>
          <option value="draft">Post-Draft</option>
        </select>
        <span className="text-[10px] font-mono text-text-secondary self-center ml-auto">
          {filtered.length} of {posts.length}
        </span>
      </div>

      {/* Mobile cards */}
      <MobileCards />

      {/* Desktop table */}
      <div className="hidden md:block overflow-auto scrollbar-hide rounded-lg border border-border-color/30 mx-3 mb-3 lg:flex-1 lg:min-h-0">
        <table className="w-full text-xs min-w-[700px]">
          <thead className="sticky top-0 z-[3]">
            <tr className="border-b border-border-color/30 bg-surface-alt">
              <th className="sticky left-0 z-[4] bg-surface-alt text-left px-3 py-2.5 font-medium text-text-secondary max-w-[240px]">
                Insight Name
              </th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary whitespace-nowrap">Phase</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary whitespace-nowrap">Source Blog</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary whitespace-nowrap">Status</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary whitespace-nowrap">Created</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((post) => {
              const phase = inferPhase(post);
              return (
                <tr
                  key={post._id}
                  onClick={() => setSelectedPost(post)}
                  className="border-b border-border-color/10 hover:bg-surface-alt/30 transition-colors cursor-pointer"
                >
                  <td className="sticky left-0 z-[1] bg-surface px-3 py-2.5 max-w-[240px]">
                    <p className="font-medium text-text-primary truncate hover:text-accent-blue transition-colors">
                      {post.insightName}
                    </p>
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <span className={`text-[10px] font-medium ${phase.color}`}>{phase.label}</span>
                  </td>
                  <td className="px-3 py-2.5 font-mono text-text-secondary max-w-[180px] truncate">
                    {post.sourceBlogSlug}
                  </td>
                  <td className="px-3 py-2.5 whitespace-nowrap">
                    <StatusBadge status={post.status} />
                  </td>
                  <td className="px-3 py-2.5 text-text-secondary font-mono whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedPost && (
        <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      )}
    </div>
  );
}
