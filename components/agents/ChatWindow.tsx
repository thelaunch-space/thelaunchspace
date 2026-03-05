"use client";

import { useEffect, useRef } from "react";
import { AgentChatConfig, ChatMessage } from "./types";
import MessageBubble from "./MessageBubble";

interface Props {
  messages: ChatMessage[];
  streamingContent: string;
  isStreaming: boolean;
  selectedAgent: AgentChatConfig;
}

export default function ChatWindow({
  messages,
  streamingContent,
  isStreaming,
  selectedAgent,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, streamingContent]);

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-3xl mx-auto px-4 py-6 space-y-1">
        {messages.length === 0 && !isStreaming ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mb-4 text-white font-bold"
              style={{ backgroundColor: selectedAgent.accentHex }}
            >
              {selectedAgent.name[0]}
            </div>
            <p className="text-sm font-medium text-text-primary">
              Chat with {selectedAgent.name}
            </p>
            <p className="text-xs text-text-secondary mt-1">{selectedAgent.role}</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble key={msg._id} message={msg} agent={selectedAgent} />
          ))
        )}

        {/* Streaming message */}
        {isStreaming && streamingContent && (
          <MessageBubble
            message={{
              _id: "streaming",
              conversationId: "",
              role: "assistant",
              content: streamingContent,
              createdAt: new Date().toISOString(),
            }}
            agent={selectedAgent}
            isStreaming
          />
        )}

        {/* Typing indicator when streaming but no content yet */}
        {isStreaming && !streamingContent && (
          <div className="flex items-start gap-3 py-2">
            <div
              className="w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-white text-xs font-bold mt-0.5"
              style={{ backgroundColor: selectedAgent.accentHex }}
            >
              {selectedAgent.name[0]}
            </div>
            <div className="flex items-center gap-1 pt-2">
              <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/40 animate-bounce [animation-delay:0ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/40 animate-bounce [animation-delay:150ms]" />
              <span className="w-1.5 h-1.5 rounded-full bg-text-secondary/40 animate-bounce [animation-delay:300ms]" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>
    </div>
  );
}
