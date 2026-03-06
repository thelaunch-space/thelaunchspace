import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

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

  // Forward to OpenClaw proxy
  let upstreamResponse: Response;
  try {
    upstreamResponse = await fetch(`${proxyUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-proxy-secret": proxySecret,
        "x-openclaw-agent-id": agentId,
      },
      body: JSON.stringify({
        model: "openclaw:main",
        messages,
        stream: true,
        user: conversationId,
      }),
    });
  } catch (err) {
    console.error("[agent-chat] Proxy connection failed:", err);
    return NextResponse.json(
      { error: "Could not reach agent proxy" },
      { status: 502 }
    );
  }

  if (!upstreamResponse.ok) {
    const errorText = await upstreamResponse.text().catch(() => "");
    console.error("[agent-chat] Proxy error:", upstreamResponse.status, errorText);
    return NextResponse.json(
      { error: `Proxy returned ${upstreamResponse.status}` },
      { status: upstreamResponse.status }
    );
  }

  // Stream the SSE response back to the browser as-is
  const stream = upstreamResponse.body;
  if (!stream) {
    return NextResponse.json({ error: "Empty proxy response" }, { status: 502 });
  }

  // [DEBUG] Wrap stream to log what flows through the Netlify function
  const startTime = Date.now();
  console.log(`[agent-chat DEBUG] Stream started for agent=${agentId} conv=${conversationId}`);

  const debugStream = stream.pipeThrough(new TransformStream({
    transform(chunk, controller) {
      const text = new TextDecoder().decode(chunk);
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      const preview = text.slice(0, 120).replace(/\n/g, "\\n");
      console.log(`[agent-chat DEBUG] T+${elapsed}s chunk (${chunk.byteLength}B): ${preview}`);
      controller.enqueue(chunk);
    },
    flush() {
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
      console.log(`[agent-chat DEBUG] T+${elapsed}s stream ended (flush)`);
    },
  }));

  return new Response(debugStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
