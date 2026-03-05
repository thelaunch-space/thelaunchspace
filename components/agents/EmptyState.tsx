"use client";

import { AgentChatConfig } from "./types";

interface Props {
  selectedAgent: AgentChatConfig;
  onNewChat: () => void;
}

export default function EmptyState({ selectedAgent, onNewChat }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl mb-5 shadow-lg overflow-hidden"
        style={{ backgroundColor: selectedAgent.accentHex }}
      >
        <img
          src={selectedAgent.avatarPath}
          alt={selectedAgent.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const el = e.target as HTMLImageElement;
            el.style.display = "none";
          }}
        />
      </div>

      <h2 className="text-base font-semibold text-text-primary mb-1">
        Chat with {selectedAgent.name}
      </h2>
      <p className="text-sm text-text-secondary mb-6 max-w-xs">
        {selectedAgent.role}
      </p>

      <button
        onClick={onNewChat}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-sm"
        style={{ backgroundColor: selectedAgent.accentHex }}
      >
        Start a conversation
      </button>
    </div>
  );
}
