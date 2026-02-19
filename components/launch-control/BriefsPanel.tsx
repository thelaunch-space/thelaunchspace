"use client";

import { useState } from "react";
import { usePaginatedQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import BriefCard from "./BriefCard";
import BriefReaderModal from "./BriefReaderModal";

export default function BriefsPanel() {
  const { results: briefs, status, loadMore } = usePaginatedQuery(
    api.briefs.listFullPaginated,
    {},
    { initialNumItems: 25 }
  );
  const [selectedBriefId, setSelectedBriefId] = useState<Id<"briefs"> | null>(null);

  if (status === "LoadingFirstPage") {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border-color/30 p-4">
            <div className="h-4 bg-surface-alt rounded w-3/4 mb-2" />
            <div className="h-3 bg-surface-alt rounded w-1/2" />
          </div>
        ))}
      </div>
    );
  }

  if (briefs.length === 0) {
    return (
      <p className="text-xs text-text-secondary italic text-center py-8">
        No briefs yet — Vibhishana creates 3/day from community research
      </p>
    );
  }

  return (
    <>
      <div className="space-y-3">
        {briefs.map((brief) => (
          <BriefCard
            key={brief._id}
            brief={brief}
            onClick={() => setSelectedBriefId(brief._id)}
          />
        ))}
      </div>

      {status === "CanLoadMore" && (
        <button
          onClick={() => loadMore(25)}
          className="mt-4 w-full py-2 text-xs font-medium text-text-secondary hover:text-text-primary border border-border-color/30 hover:border-border-color/60 rounded-lg transition-colors"
        >
          Load more briefs
        </button>
      )}

      {status === "LoadingMore" && (
        <div className="mt-4 text-center">
          <span className="text-xs text-text-secondary animate-pulse">Loading more…</span>
        </div>
      )}

      {selectedBriefId && (
        <BriefReaderModal
          briefId={selectedBriefId}
          onClose={() => setSelectedBriefId(null)}
        />
      )}
    </>
  );
}
