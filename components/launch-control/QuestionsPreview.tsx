"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { ICP_RELEVANCE_CONFIG } from "@/lib/launch-control-types";
import PreviewGate from "./PreviewGate";

/**
 * Public read-only preview of the questions table.
 * Shows the 3 most recent questions with a blur fade.
 */
export default function QuestionsPreview() {
  const questions = useQuery(api.questions.listRecent, { limit: 6 });

  if (questions === undefined) {
    return (
      <div className="space-y-2 animate-pulse p-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-10 bg-surface-alt rounded" />
        ))}
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <p className="text-xs text-text-secondary italic text-center py-8">
        No questions scanned yet
      </p>
    );
  }

  return (
    <PreviewGate>
      {/* Mobile: card view */}
      <div className="md:hidden space-y-3 p-3">
        {questions.map((q) => {
          const relConfig = ICP_RELEVANCE_CONFIG[q.icpRelevance] ?? { color: "text-text-secondary", bg: "bg-surface-alt" };
          return (
            <div key={q._id} className="rounded-xl border border-border-color/30 p-3 space-y-2">
              <a
                href={q.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-medium text-text-primary hover:text-accent-blue transition-colors line-clamp-2 block"
              >
                {q.title}
              </a>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-alt text-text-secondary">{q.subreddit}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${relConfig.bg} ${relConfig.color}`}>{q.icpRelevance}</span>
              </div>
              <p className="text-[11px] text-text-secondary line-clamp-2">{q.questionPain}</p>
            </div>
          );
        })}
      </div>

      {/* Desktop: table view */}
      <div className="hidden md:block">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-border-color/30 bg-surface-alt/50">
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Title</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Subreddit</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Pain Point</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">ICP</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Scanned</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => {
              const relConfig = ICP_RELEVANCE_CONFIG[q.icpRelevance] ?? { color: "text-text-secondary", bg: "bg-surface-alt" };
              return (
                <tr key={q._id} className="border-b border-border-color/10">
                  <td className="px-3 py-2.5 max-w-[260px]">
                    <a
                      href={q.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-text-primary hover:text-accent-blue transition-colors font-medium line-clamp-1 block"
                    >
                      {q.title}
                    </a>
                  </td>
                  <td className="px-3 py-2.5 text-text-secondary font-mono whitespace-nowrap">{q.subreddit}</td>
                  <td className="px-3 py-2.5 text-text-secondary max-w-[200px] line-clamp-1">{q.questionPain}</td>
                  <td className="px-3 py-2.5">
                    <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${relConfig.bg} ${relConfig.color}`}>
                      {q.icpRelevance}
                    </span>
                  </td>
                  <td className="px-3 py-2.5 text-text-secondary font-mono whitespace-nowrap">
                    {new Date(q.scannedAt).toLocaleDateString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </PreviewGate>
  );
}
