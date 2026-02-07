import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const webhookUrl = process.env.WEBHOOK_URL;

  if (!webhookUrl) {
    console.error("WEBHOOK_URL environment variable is not set");
    return NextResponse.json(
      { success: false, error: "Webhook URL is not configured" },
      { status: 500 }
    );
  }

  try {
    const payload = await request.json();

    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Webhook request failed:", {
        status: response.status,
        statusText: response.statusText,
        error: errorText,
      });
      return NextResponse.json(
        {
          success: false,
          error: `Webhook request failed: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error proxying to webhook:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
