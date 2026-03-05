import AgentsPage from "@/components/agents/AgentsPage";

interface Props {
  params: Promise<{ conversationId: string }>;
}

export default async function AgentsConversationPage({ params }: Props) {
  const { conversationId } = await params;
  return <AgentsPage initialConversationId={conversationId} />;
}
