"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { AgentChatConfig, ChatMessage } from "./types";

interface Props {
  message: ChatMessage;
  agent: AgentChatConfig;
  isStreaming?: boolean;
}

export default function MessageBubble({ message, agent, isStreaming }: Props) {
  const isUser = message.role === "user";

  if (isUser) {
    return (
      <div className="flex justify-end py-1">
        <div className="max-w-[80%] sm:max-w-[70%] bg-accent-blue text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm leading-relaxed">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-3 py-1">
      {/* Agent avatar */}
      <div
        className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5 overflow-hidden"
        style={{ backgroundColor: agent.accentHex }}
      >
        <img
          src={agent.avatarPath}
          alt={agent.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-semibold" style={{ color: agent.accentHex }}>
            {agent.name}
          </span>
          {isStreaming && (
            <span className="inline-block w-1 h-4 bg-current animate-pulse rounded-sm" style={{ color: agent.accentHex }} />
          )}
        </div>
        <div className="text-sm text-text-primary leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-2 [&_li]:mb-0.5 [&_h1]:text-base [&_h1]:font-semibold [&_h1]:mb-1 [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:mb-1 [&_h3]:text-sm [&_h3]:font-medium [&_h3]:mb-1 [&_code]:bg-black/[0.06] [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_pre]:bg-black/[0.06] [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:text-xs [&_strong]:font-semibold [&_blockquote]:border-l-2 [&_blockquote]:border-border-color [&_blockquote]:pl-3 [&_blockquote]:text-text-secondary">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {message.content}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
