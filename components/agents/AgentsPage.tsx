"use client";

import { useState, useCallback, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { CHAT_AGENTS, AgentChatConfig, ChatConversation, ChatMessage } from "./types";
import AgentTopNav from "./AgentTopNav";
import ConversationSidebar from "./ConversationSidebar";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import EmptyState from "./EmptyState";

interface Props {
  initialConversationId: string | null;
}

export default function AgentsPage({ initialConversationId }: Props) {
  const { userId, isSignedIn } = useAuth();

  const [selectedAgent, setSelectedAgent] = useState<AgentChatConfig>(CHAT_AGENTS[0]);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(initialConversationId);
  const [streamingContent, setStreamingContent] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [pendingContent, setPendingContent] = useState("");

  // Convex queries
  const conversations = useQuery(
    api.agentConversations.listConversations,
    isSignedIn && userId
      ? { agentId: selectedAgent.id, userId }
      : "skip"
  ) as ChatConversation[] | undefined;

  const messages = useQuery(
    api.agentMessages.listMessages,
    activeConversationId
      ? { conversationId: activeConversationId as Id<"agentConversations"> }
      : "skip"
  ) as ChatMessage[] | undefined;

  const conversation = useQuery(
    api.agentConversations.getConversation,
    activeConversationId
      ? { conversationId: activeConversationId as Id<"agentConversations"> }
      : "skip"
  );

  // Clear pendingContent once the Convex subscription delivers the saved message
  useEffect(() => {
    if (pendingContent && messages?.length) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === "assistant") {
        setPendingContent("");
      }
    }
  }, [messages, pendingContent]);

  // When loading a deep-linked conversation, sync selectedAgent from Convex data
  useEffect(() => {
    if (conversation?.agentId) {
      const agent = CHAT_AGENTS.find((a) => a.id === conversation.agentId);
      if (agent && agent.id !== selectedAgent.id) {
        setSelectedAgent(agent);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation?.agentId]);

  // Convex mutations
  const createConversation = useMutation(api.agentConversations.createConversation);
  const addMessage = useMutation(api.agentMessages.addMessage);
  const updateTitle = useMutation(api.agentConversations.updateConversationTitle);
  const updateMeta = useMutation(api.agentConversations.updateConversationMeta);

  const handleSelectAgent = useCallback((agent: AgentChatConfig) => {
    setSelectedAgent(agent);
    setActiveConversationId(null);
  }, []);

  const handleSelectConversation = useCallback((id: string) => {
    setActiveConversationId(id);
  }, []);

  const handleNewChat = useCallback(async () => {
    if (!userId) return;
    const id = await createConversation({
      agentId: selectedAgent.id,
      agentName: selectedAgent.name,
      userId,
    });
    setActiveConversationId(id);
  }, [userId, selectedAgent, createConversation]);

  const handleSend = useCallback(async (text: string) => {
    if (!userId || !activeConversationId || isStreaming) return;

    const convId = activeConversationId as Id<"agentConversations">;

    // Save user message to Convex
    await addMessage({ conversationId: convId, role: "user", content: text });

    // Auto-title from first message (first 60 chars)
    const currentMessages = messages ?? [];
    if (currentMessages.length === 0) {
      const title = text.slice(0, 60) + (text.length > 60 ? "..." : "");
      await updateTitle({ conversationId: convId, title });
    }

    // Build messages array for API (last 40 messages + new user message)
    const historyMessages = currentMessages.slice(-39).map((m) => ({
      role: m.role,
      content: m.content,
    }));
    const apiMessages = [...historyMessages, { role: "user", content: text }];

    // Stream from proxy
    setIsStreaming(true);
    setStreamingContent("");
    const streamStart = Date.now();
    const dbg = (msg: string) => console.log(`[STREAM T+${((Date.now() - streamStart) / 1000).toFixed(1)}s] ${msg}`);

    try {
      dbg(`Fetching /api/agent-chat agent=${selectedAgent.id}`);
      const response = await fetch("/api/agent-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: apiMessages,
          agentId: selectedAgent.id,
          conversationId: activeConversationId,
        }),
      });

      dbg(`Response status=${response.status}`);
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("No response body");

      const decoder = new TextDecoder();
      let fullContent = "";
      let chunkCount = 0;
      let dataEventCount = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          dbg(`reader done=true. chunks=${chunkCount} events=${dataEventCount} len=${fullContent.length}`);
          break;
        }

        chunkCount++;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");

        for (const line of lines) {
          if (line.startsWith(": ")) {
            dbg(`keepalive`);
            continue;
          }
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") {
            dbg(`[DONE] received. len=${fullContent.length}`);
            break;
          }

          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.choices?.[0]?.delta?.content;
            if (delta) {
              dataEventCount++;
              fullContent += delta;
              setStreamingContent(fullContent);
              if (dataEventCount <= 3 || dataEventCount % 20 === 0) {
                dbg(`delta #${dataEventCount}: "${delta.slice(0, 40)}" (total=${fullContent.length})`);
              }
            }
          } catch {
            dbg(`parse fail: "${data.slice(0, 60)}"`);
          }
        }
      }

      // Save complete response to Convex
      dbg(`Saving ${fullContent.length} chars to Convex...`);
      if (fullContent) {
        // Keep text visible as "pending" until Convex subscription delivers it
        setPendingContent(fullContent);
        setIsStreaming(false);
        setStreamingContent("");
        await addMessage({ conversationId: convId, role: "assistant", content: fullContent });
        await updateMeta({
          conversationId: convId,
          lastMessageAt: new Date().toISOString(),
          messageCount: (currentMessages.length + 2),
        });
        dbg(`Saved OK`);
      } else {
        dbg(`WARNING: empty fullContent, nothing saved`);
        setIsStreaming(false);
        setStreamingContent("");
      }
    } catch (err) {
      dbg(`CATCH: ${err}`);
      console.error("[AgentsPage] Stream error:", err);
      try {
        await addMessage({
          conversationId: convId,
          role: "assistant",
          content: "Sorry, I couldn't reach the agent. Please try again.",
        });
      } catch (saveErr) {
        dbg(`CATCH save also failed: ${saveErr}`);
      }
      setIsStreaming(false);
      setStreamingContent("");
    }
  }, [userId, activeConversationId, isStreaming, messages, selectedAgent, addMessage, updateTitle, updateMeta]);

  // Auth gate
  if (!isSignedIn) {
    return (
      <div className="h-full flex items-center justify-center bg-[#F5F5F0]">
        <div className="text-center space-y-3">
          <p className="text-text-primary font-medium">Sign in to chat with your agents</p>
          <a
            href="/admin"
            className="inline-flex items-center px-4 py-2 rounded-xl bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue/90 transition-colors"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  const allMessages: ChatMessage[] = messages ?? [];

  return (
    <div className="h-full flex flex-col">
      <AgentTopNav
        agents={CHAT_AGENTS}
        selectedAgent={selectedAgent}
        onSelectAgent={handleSelectAgent}
      />
      <div className="flex-1 flex overflow-hidden">
        <ConversationSidebar
          conversations={conversations ?? []}
          activeConversationId={activeConversationId}
          selectedAgent={selectedAgent}
          onSelectConversation={handleSelectConversation}
          onNewChat={handleNewChat}
        />
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeConversationId ? (
            <>
              <ChatWindow
                messages={allMessages}
                streamingContent={streamingContent}
                pendingContent={pendingContent}
                isStreaming={isStreaming}
                selectedAgent={selectedAgent}
              />
              <ChatInput
                onSend={handleSend}
                isStreaming={isStreaming}
                agentName={selectedAgent.name}
              />
            </>
          ) : (
            <EmptyState
              selectedAgent={selectedAgent}
              onNewChat={handleNewChat}
            />
          )}
        </div>
      </div>
    </div>
  );
}
