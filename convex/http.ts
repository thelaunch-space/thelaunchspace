import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

const http = httpRouter();

function validateAuth(request: Request): boolean {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) return false;
  const token = authHeader.slice(7);
  return token === process.env.AGENT_API_KEY;
}

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

function jsonResponse(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json", ...corsHeaders() },
  });
}

function errorResponse(error: unknown) {
  const message = error instanceof Error ? error.message : "Unknown error";
  return jsonResponse({ success: false, error: message }, 400);
}

http.route({
  path: "/ingestQuestions",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
      // Accept: bare array [{...}], wrapped {"questions": [{...}]}, or single object {...}
      const questions = Array.isArray(body)
        ? body
        : Array.isArray(body.questions)
          ? body.questions
          : [body];
      const result = await ctx.runMutation(internal.questions.ingestBatch, { questions });
      return jsonResponse({ success: true, ...result });
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

http.route({
  path: "/ingestBrief",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
      const result = await ctx.runMutation(internal.briefs.ingest, body);
      return jsonResponse({ success: true, ...result });
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

http.route({
  path: "/ingestBlog",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
      const result = await ctx.runMutation(internal.blogs.ingest, body);
      return jsonResponse({ success: true, ...result });
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

http.route({
  path: "/ingestActivity",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
      const result = await ctx.runMutation(internal.agentActivity.ingest, body);
      return jsonResponse({ success: true, ...result });
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

http.route({
  path: "/ingestTopicCluster",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
      const result = await ctx.runMutation(internal.topicClusters.ingest, body);
      return jsonResponse({ success: true, ...result });
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

http.route({
  path: "/ingestToolOpportunity",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
      const result = await ctx.runMutation(internal.toolOpportunities.ingest, body);
      return jsonResponse({ success: true, ...result });
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

http.route({
  path: "/updateBlogEnrichment",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
      await ctx.runMutation(internal.blogs.updateEnrichment, body);
      return jsonResponse({ success: true });
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

http.route({
  path: "/updateBriefStatus",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
      const result = await ctx.runMutation(internal.briefs.updateStatus, body);
      return jsonResponse(result);
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

http.route({
  path: "/upsertBrief",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
      const result = await ctx.runMutation(internal.briefs.upsert, body);
      return jsonResponse({ success: true, ...result });
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

// Handle CORS preflight for all ingestion routes
for (const path of ["/ingestQuestions", "/ingestBrief", "/ingestBlog", "/ingestActivity", "/ingestTopicCluster", "/ingestToolOpportunity", "/updateBlogEnrichment", "/updateBriefStatus", "/upsertBrief"]) {
  http.route({
    path,
    method: "OPTIONS",
    handler: httpAction(async () => {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }),
  });
}

export default http;
