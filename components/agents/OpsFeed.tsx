"use client";

import { useState, useMemo, useCallback } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { CronUpdateMessage, AgentChatConfig } from "./types";
import OpsFeedInbox from "./OpsFeedInbox";
import OpsFeedDetail from "./OpsFeedDetail";

interface Props {
  selectedAgent: AgentChatConfig | null;
}

export default function OpsFeed({ selectedAgent }: Props) {
  const [selectedUpdateId, setSelectedUpdateId] = useState<string | null>(null);
  // Mobile: track whether detail is shown (back button returns to inbox)
  const [mobileShowDetail, setMobileShowDetail] = useState(false);

  // Query cron updates — pass agentId only when a specific agent is selected
  const agentIdFilter = selectedAgent ? selectedAgent.id : undefined;
  const updates = useQuery(
    api.agentConversations.listCronUpdates,
    { agentId: agentIdFilter, limit: 100 }
  ) as CronUpdateMessage[] | undefined;

  const updatesList = updates ?? [];

  const selectedUpdate = useMemo(() => {
    if (!selectedUpdateId) return null;
    return updatesList.find((u) => u._id === selectedUpdateId) ?? null;
  }, [selectedUpdateId, updatesList]);

  const handleSelectUpdate = useCallback((id: string) => {
    setSelectedUpdateId(id);
    setMobileShowDetail(true);
  }, []);

  const handleBack = useCallback(() => {
    setMobileShowDetail(false);
  }, []);

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Inbox — hidden on mobile when detail is shown */}
      <div className={`${mobileShowDetail ? "hidden md:flex" : "flex"} w-full md:w-auto border-r border-gray-200`}>
        <OpsFeedInbox
          updates={updatesList}
          selectedUpdateId={selectedUpdateId}
          onSelectUpdate={handleSelectUpdate}
        />
      </div>

      {/* Detail — hidden on mobile when inbox is shown */}
      <div className={`${mobileShowDetail ? "flex" : "hidden md:flex"} flex-1`}>
        <OpsFeedDetail
          update={selectedUpdate}
          onBack={handleBack}
          showBackButton={mobileShowDetail}
        />
      </div>
    </div>
  );
}
