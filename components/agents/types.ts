// Shared types for the Agent Chat UI
// Used by: AgentsPage, AgentTopNav, ConversationSidebar, ChatWindow, MessageBubble, ChatInput, EmptyState

export interface AgentChatConfig {
  id: string;          // OpenClaw agent ID: "main" | "vibhishana" | "vyasa" | "vidura" | "valmiki" | "shakti"
  name: string;        // "Parthasarathi"
  role: string;        // "Operations Orchestrator"
  accentHex: string;   // "#2563EB"
  avatarPath: string;  // "/agents/parthasarathi.png"
}

export interface ChatConversation {
  _id: string;
  agentId: string;
  agentName: string;
  title: string;
  lastMessageAt: string;
  messageCount: number;
  userId: string;
  createdAt: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

// Static agent roster for the chat UI
// OpenClaw agent ID "main" = Parthasarathi (the orchestrator)
export const CHAT_AGENTS: AgentChatConfig[] = [
  {
    id: "main",
    name: "Parthasarathi",
    role: "Operations Orchestrator",
    accentHex: "#2563EB",
    avatarPath: "/agents/parthasarathi.png",
  },
  {
    id: "vibhishana",
    name: "Vibhishana",
    role: "Research Intelligence Analyst",
    accentHex: "#10B981",
    avatarPath: "/agents/vibhishana.png",
  },
  {
    id: "vyasa",
    name: "Vyasa",
    role: "SEO Blog Writer",
    accentHex: "#7C3AED",
    avatarPath: "/agents/vyasa.png",
  },
  {
    id: "vidura",
    name: "Vidura",
    role: "SEO Intelligence Advisor",
    accentHex: "#06B6D4",
    avatarPath: "/agents/vidura.png",
  },
  {
    id: "valmiki",
    name: "Valmiki",
    role: "LinkedIn Growth Engine",
    accentHex: "#F43F5E",
    avatarPath: "/agents/valmiki.png",
  },
  {
    id: "shakti",
    name: "Shakti",
    role: "Personal AI Assistant",
    accentHex: "#4F46E5",
    avatarPath: "/agents/shakti.png",
  },
];
