import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const proxyUrl = process.env.OPENCLAW_PROXY_URL;
  const proxySecret = process.env.OPENCLAW_PROXY_SECRET;

  if (!proxyUrl || !proxySecret) {
    return NextResponse.json(
      { error: "Proxy not configured" },
      { status: 500 }
    );
  }

  let body: { messages: unknown[]; agentId: string; conversationId: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { messages, agentId, conversationId } = body;

  if (!messages || !agentId || !conversationId) {
    return NextResponse.json(
      { error: "Missing required fields: messages, agentId, conversationId" },
      { status: 400 }
    );
  }

  // Fire-and-forget: the proxy returns 200 immediately in this mode,
  // then continues collecting the full agent response in the background.
  // We MUST await the fetch — Netlify kills the process after response,
  // so an un-awaited fetch never actually sends.
  try {
    const proxyRes = await fetch(`${proxyUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-proxy-secret": proxySecret,
        "x-openclaw-agent-id": agentId,
        "x-fire-and-forget": "true",
        "x-conversation-id": conversationId,
      },
      body: JSON.stringify({
        model: "openclaw:main",
        messages,
        stream: true,
        user: conversationId,
      }),
    });

    if (!proxyRes.ok) {
      console.error("[agent-chat] Proxy returned:", proxyRes.status);
      return NextResponse.json(
        { error: `Proxy returned ${proxyRes.status}` },
        { status: proxyRes.status }
      );
    }
  } catch (err) {
    console.error("[agent-chat] Proxy connection failed:", err);
    return NextResponse.json(
      { error: "Could not reach agent proxy" },
      { status: 502 }
    );
  }

  return NextResponse.json({ ok: true });
}
