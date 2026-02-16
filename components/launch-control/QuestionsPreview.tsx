"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

/**
 * Public read-only preview of the questions table.
 * Shows the 20 most recent questions openly.
 */
export default function QuestionsPreview() {
  const questions = useQuery(api.questions.listRecent, { limit: 20 });

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
    <div className="lg:flex lg:flex-col lg:flex-1 lg:min-h-0">
      {/* Mobile: card view */}
      <div className="md:hidden space-y-3 p-3">
        {questions.map((q) => (
          <div key={q._id} className="rounded-xl border border-border-color/30 p-3 space-y-2">
            <a
              href={q.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-text-primary hover:text-accent-blue transition-colors line-clamp-2 block"
            >
              {q.title}
            </a>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-surface-alt text-text-secondary">{q.subreddit}</span>
              <span className="text-[10px] text-text-secondary">&middot;</span>
              <span className="text-[10px] text-text-secondary">{new Date(q.scannedAt).toLocaleDateString()}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: table view */}
      <div className="hidden md:block overflow-auto lg:flex-1 lg:min-h-0 scrollbar-hide">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-[1]">
            <tr className="border-b border-border-color/30 bg-surface-alt">
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Title</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Subreddit</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Scanned</th>
            </tr>
          </thead>
          <tbody>
            {questions.map((q) => (
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
                <td className="px-3 py-2.5 text-text-secondary font-mono whitespace-nowrap">
                  {new Date(q.scannedAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
