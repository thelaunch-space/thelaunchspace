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

// ---------------------------------------------------------------------------
// Legacy aliases — kept alive permanently so existing agent skill files
// continue working without changes. Do NOT remove these.
// ---------------------------------------------------------------------------

http.route({
  path: "/upsertQuestions",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
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
  path: "/upsertBlog",
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

http.route({
  path: "/upsertDocument",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
      const result = await ctx.runMutation(internal.documents.upsert, body);
      return jsonResponse({ success: true, ...result });
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

// ---------------------------------------------------------------------------
// Canonical endpoints — the clean, permanent API surface.
// Each route calls the exact same mutation as the legacy alias above.
// Agents should migrate to these paths. Legacy aliases stay alive forever.
// ---------------------------------------------------------------------------

http.route({
  path: "/push/questions",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
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
  path: "/push/briefs",
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

http.route({
  path: "/push/blogs",
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
  path: "/push/activity",
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
  path: "/push/topic-clusters",
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
  path: "/push/tool-opportunities",
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
  path: "/push/documents",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
      const result = await ctx.runMutation(internal.documents.upsert, body);
      return jsonResponse({ success: true, ...result });
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

http.route({
  path: "/update/brief-status",
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
  path: "/update/blog-enrichment",
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

// Handle CORS preflight for all routes (legacy aliases + canonical)
for (const path of [
  // Legacy aliases — kept for backward compatibility
  "/ingestQuestions", "/ingestBrief", "/ingestBlog", "/ingestActivity",
  "/ingestTopicCluster", "/ingestToolOpportunity", "/updateBlogEnrichment",
  "/updateBriefStatus", "/upsertQuestions", "/upsertBlog", "/upsertBrief",
  "/upsertDocument",
  // Canonical paths
  "/push/questions", "/push/briefs", "/push/blogs", "/push/activity",
  "/push/topic-clusters", "/push/tool-opportunities", "/push/documents",
  "/update/brief-status", "/update/blog-enrichment",
]) {
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
