"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";
import { AgentChatConfig } from "./types";

interface Props {
  agents: AgentChatConfig[];
  selectedAgent: AgentChatConfig;
  onSelectAgent: (agent: AgentChatConfig) => void;
}

export default function AgentTopNav({ agents, selectedAgent, onSelectAgent }: Props) {
  return (
    <div className="h-14 flex items-center justify-between px-4 border-b border-border-color/60 bg-surface/80 backdrop-blur-sm shrink-0">
      {/* Logo */}
      <Link href="/" className="shrink-0">
        <img src="/logo.png" alt="thelaunch.space" className="h-8 w-auto" />
      </Link>

      {/* Agent pills — scrollable on mobile */}
      <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none px-2 flex-1 justify-center mx-4">
        {agents.map((agent) => {
          const isActive = agent.id === selectedAgent.id;
          return (
            <button
              key={agent.id}
              onClick={() => onSelectAgent(agent)}
              title={`${agent.name} — ${agent.role}`}
              className={`group relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-150 shrink-0 ${
                isActive
                  ? "bg-surface shadow-sm border border-border-color/60"
                  : "hover:bg-black/[0.04] text-text-secondary"
              }`}
            >
              {/* Accent ring when active */}
              <div
                className={`w-6 h-6 rounded-full overflow-hidden ring-2 transition-all ${
                  isActive ? "ring-offset-1" : "ring-transparent"
                }`}
                style={isActive ? { "--tw-ring-color": agent.accentHex } as React.CSSProperties : undefined}
              >
                <img
                  src={agent.avatarPath}
                  alt={agent.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to colored circle if avatar missing
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
                {/* Colored fallback behind image */}
                <div
                  className="w-full h-full rounded-full flex items-center justify-center text-white text-[10px] font-bold -mt-6"
                  style={{ backgroundColor: agent.accentHex }}
                >
                  {agent.name[0]}
                </div>
              </div>
              <span className={isActive ? "text-text-primary" : "text-text-secondary"}>
                {agent.name}
              </span>
              {/* Active accent dot */}
              {isActive && (
                <span
                  className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full border-2 border-white"
                  style={{ backgroundColor: agent.accentHex }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* User button */}
      <div className="shrink-0">
        <UserButton afterSignOutUrl="/admin" />
      </div>
    </div>
  );
}
