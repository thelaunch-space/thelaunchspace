"use client";

import { useMemo } from "react";
import { Plus, MessageSquare } from "lucide-react";
import { ChatConversation } from "./types";

interface Props {
  conversations: ChatConversation[];
  activeConversationId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  mobile?: boolean;
}

function groupByDate(conversations: ChatConversation[]) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const weekAgo = new Date(today.getTime() - 7 * 86400000);

  const groups: { label: string; items: ChatConversation[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "This week", items: [] },
    { label: "Older", items: [] },
  ];

  for (const convo of conversations) {
    const d = new Date(convo.lastMessageAt);
    if (d >= today) groups[0].items.push(convo);
    else if (d >= yesterday) groups[1].items.push(convo);
    else if (d >= weekAgo) groups[2].items.push(convo);
    else groups[3].items.push(convo);
  }

  return groups.filter((g) => g.items.length > 0);
}

export default function ConversationSidebar({
  conversations,
  activeConversationId,
  onSelectConversation,
  onNewChat,
  mobile,
}: Props) {
  const groups = useMemo(() => groupByDate(conversations), [conversations]);

  return (
    <div className={`${mobile ? "w-full flex" : "w-64 hidden md:flex"} shrink-0 h-full flex-col ${mobile ? "" : "border-r border-border-color/60"} bg-surface/50`}>
      {/* Header */}
      <div className="p-3 pb-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-black/[0.04] transition-colors"
        >
          <Plus size={16} className="shrink-0" />
          New chat
        </button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto py-2 px-2 space-y-4">
        {groups.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <MessageSquare size={20} className="mx-auto mb-2 text-text-secondary/40" />
            <p className="text-xs text-text-secondary/60">No conversations yet</p>
            <p className="text-xs text-text-secondary/40 mt-1">Start a new chat above</p>
          </div>
        ) : (
          groups.map((group) => (
            <div key={group.label}>
              <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-text-secondary/50">
                {group.label}
              </p>
              <div className="space-y-0.5">
                {group.items.map((convo) => (
                  <button
                    key={convo._id}
                    onClick={() => onSelectConversation(convo._id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-colors truncate ${
                      convo._id === activeConversationId
                        ? "bg-black/[0.06] text-text-primary font-medium"
                        : "text-text-secondary hover:text-text-primary hover:bg-black/[0.04]"
                    }`}
                  >
                    <span className="block truncate">{convo.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
