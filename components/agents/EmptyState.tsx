"use client";

import { AgentChatConfig } from "./types";

interface Props {
  selectedAgent: AgentChatConfig;
  onNewChat: () => void;
}

export default function EmptyState({ selectedAgent, onNewChat }: Props) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-12">
      {/* Full portrait image — agent images are character illustrations, not headshots */}
      <div
        className="w-44 h-44 rounded-3xl overflow-hidden mb-6 shadow-card-hover flex items-center justify-center text-white font-bold text-4xl"
        style={{ backgroundColor: selectedAgent.accentHex }}
      >
        <img
          src={selectedAgent.avatarPath}
          alt={selectedAgent.name}
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <h2 className="text-lg font-semibold text-text-primary mb-1">
        Chat with {selectedAgent.name}
      </h2>
      <p className="text-sm text-text-secondary mb-7 max-w-xs">
        {selectedAgent.role}
      </p>

      <button
        onClick={onNewChat}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90 hover:-translate-y-0.5 shadow-sm"
        style={{ backgroundColor: selectedAgent.accentHex }}
      >
        Start a conversation
      </button>
    </div>
  );
}
