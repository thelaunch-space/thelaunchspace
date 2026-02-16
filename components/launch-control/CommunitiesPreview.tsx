"use client";

import PreviewGate from "./PreviewGate";
import { PLACEHOLDER_COMMUNITIES } from "@/lib/community-data";

/**
 * Public read-only preview of communities panel.
 * Shows placeholder community table with blur — actual subreddit names
 * are not exposed to non-authenticated visitors.
 */
export default function CommunitiesPreview() {
  return (
    <PreviewGate>
      {/* Mobile: card view */}
      <div className="md:hidden space-y-3 p-3">
        {PLACEHOLDER_COMMUNITIES.map((item) => (
          <div
            key={item.name}
            className="rounded-xl border border-border-color/30 p-3 space-y-2"
          >
            <p className="text-sm font-medium text-text-primary">{item.name}</p>
            <p className="text-[11px] text-text-secondary leading-relaxed">{item.reason}</p>
            <span className="text-[10px] font-mono text-text-secondary">
              {item.count} questions
            </span>
          </div>
        ))}
      </div>

      {/* Desktop: table view */}
      <div className="hidden md:block">
        <table className="w-full text-xs">
          <thead className="sticky top-0 z-[1]">
            <tr className="border-b border-border-color/30 bg-surface-alt">
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Community</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Why It Was Picked</th>
              <th className="text-left px-3 py-2.5 font-medium text-text-secondary">Relevant Qs</th>
            </tr>
          </thead>
          <tbody>
            {PLACEHOLDER_COMMUNITIES.map((item) => (
              <tr key={item.name} className="border-b border-border-color/10">
                <td className="px-3 py-2.5 font-medium text-text-primary whitespace-nowrap">{item.name}</td>
                <td className="px-3 py-2.5 text-text-secondary">{item.reason}</td>
                <td className="px-3 py-2.5 text-text-secondary font-mono whitespace-nowrap">{item.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </PreviewGate>
  );
}
