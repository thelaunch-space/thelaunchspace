"use client";

import PreviewGate from "./PreviewGate";

/**
 * Public read-only preview of communities panel.
 * Shows placeholder community cards with blur — actual subreddit names
 * are not exposed to non-authenticated visitors.
 */

const PLACEHOLDER_COMMUNITIES = [
  { name: "r/startups", count: 87 },
  { name: "r/smallbusiness", count: 64 },
  { name: "r/SaaS", count: 51 },
  { name: "r/entrepreneur", count: 43 },
  { name: "r/nocode", count: 38 },
  { name: "r/webdev", count: 29 },
];

export default function CommunitiesPreview() {
  return (
    <PreviewGate>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4">
        {PLACEHOLDER_COMMUNITIES.map((item) => (
          <div
            key={item.name}
            className="rounded-xl border border-border-color/30 bg-surface-alt/30 p-3 sm:p-4"
          >
            <p className="text-sm font-medium text-text-primary truncate">{item.name}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display text-2xl font-semibold text-text-primary">{item.count}</span>
              <span className="text-[10px] text-text-secondary font-mono">questions</span>
            </div>
          </div>
        ))}
      </div>
    </PreviewGate>
  );
}
