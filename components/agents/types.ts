// Shared types for the Agent Chat UI
// Used by: AgentsPage, AgentTopNav, ConversationSidebar, ChatWindow, MessageBubble, ChatInput, EmptyState

export interface AgentChatConfig {
  id: string;          // OpenClaw agent ID: "main" | "vibhishana" | "vyasa" | "vidura" | "valmiki" | "shakti"
  name: string;        // "Parthasarathi"
  role: string;        // "Operations Orchestrator"
  accentHex: string;   // "#2563EB"
  avatarPath: string;  // "/agent-avatars/parthasarathi.png"
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
    accentHex: "#6B9BF7",
    avatarPath: "/agent-avatars/parthasarathi.png",
  },
  {
    id: "vibhishana",
    name: "Vibhishana",
    role: "Research Intelligence Analyst",
    accentHex: "#5EDCB3",
    avatarPath: "/agent-avatars/vibhishana.png",
  },
  {
    id: "vyasa",
    name: "Vyasa",
    role: "SEO Blog Writer",
    accentHex: "#A78BFA",
    avatarPath: "/agent-avatars/vyasa.png",
  },
  {
    id: "vidura",
    name: "Vidura",
    role: "SEO Intelligence Advisor",
    accentHex: "#5CC8E4",
    avatarPath: "/agent-avatars/vidura.png",
  },
  {
    id: "valmiki",
    name: "Valmiki",
    role: "LinkedIn Growth Engine",
    accentHex: "#F98DA0",
    avatarPath: "/agent-avatars/valmiki.png",
  },
  {
    id: "shakti",
    name: "Shakti",
    role: "Personal AI Assistant",
    accentHex: "#8B83F0",
    avatarPath: "/agent-avatars/shakti.png",
  },
];

export interface CronUpdateMessage {
  _id: string;
  conversationId: string;
  role: string;
  content: string;
  createdAt: string;
  jobName?: string;
  messageType?: string;
  agentId: string;
  agentName: string;
}
