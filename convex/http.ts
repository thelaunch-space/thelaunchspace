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
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

// ---------------------------------------------------------------------------
// GET query endpoints — agent read access (authenticated with AGENT_API_KEY)
// ---------------------------------------------------------------------------

http.route({
  path: "/query/briefs",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const url = new URL(request.url);
      const status = url.searchParams.get("status");

      if (!status) {
        return jsonResponse({ error: "Missing ?status query param" }, 400);
      }

      if (status !== "brief_ready" && status !== "pending_review") {
        return jsonResponse({ error: `Unknown status: ${status}` }, 400);
      }

      const briefs = await ctx.runQuery(internal.agentQueries.getBriefsByStatus, { status });

      if (status === "pending_review") {
        return jsonResponse({
          count: briefs.length,
          slugs: briefs.map((b) => b.slug),
          titles: briefs.map((b) => b.title),
        });
      }

      // brief_ready — return full brief objects
      return jsonResponse(briefs.map((b) => ({
        _id: b._id,
        title: b.title,
        slug: b.slug,
        primaryKeyword: b.primaryKeyword,
        longTailKeywords: b.longTailKeywords ?? [],
        sourceUrls: b.sourceUrls ?? [],
        icpProblem: b.icpProblem ?? null,
        competitiveGap: b.competitiveGap ?? null,
        launchSpaceAngle: b.launchSpaceAngle ?? null,
        suggestedStructure: b.suggestedStructure ?? null,
        researchNotes: b.researchNotes ?? null,
        contentMarkdown: b.contentMarkdown ?? null,
        category: b.category ?? null,
        createdAt: b.createdAt,
      })));
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

http.route({
  path: "/query/topic-clusters",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const clusters = await ctx.runQuery(internal.agentQueries.getAllTopicClusters, {});
      return jsonResponse(clusters.map((c) => ({
        _id: c._id,
        pillarName: c.pillarName,
        clusterTopic: c.clusterTopic,
        status: c.status,
        targetKeyword: c.targetKeyword,
        intentType: c.intentType,
      })));
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

http.route({
  path: "/query/tool-opportunities",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const tools = await ctx.runQuery(internal.agentQueries.getAllToolOpportunities, {});
      return jsonResponse(tools.map((t) => ({
        _id: t._id,
        toolName: t.toolName,
        toolSolution: t.toolSolution,
        status: t.status,
        targetKeyword: t.targetKeyword,
        complexity: t.complexity,
      })));
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

http.route({
  path: "/query/linkedin-posts",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const posts = await ctx.runQuery(internal.agentQueries.getAllLinkedinPosts, {});
      return jsonResponse(posts.map((p) => ({
        _id: p._id,
        insightName: p.insightName,
        sourceBlogSlug: p.sourceBlogSlug,
        insightNumber: p.insightNumber,
        status: p.status,
        krishnaFeedback: p.krishnaFeedback ?? null,
        createdAt: p.createdAt,
      })));
    } catch (error: unknown) {
      return errorResponse(error);
    }
  }),
});

http.route({
  path: "/push/linkedin-posts",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateAuth(request)) {
      return jsonResponse({ error: "Unauthorized" }, 401);
    }
    try {
      const body = await request.json();
      const result = await ctx.runMutation(internal.linkedinPosts.upsert, body);
      return jsonResponse({ success: true, ...result });
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
  "/push/linkedin-posts",
  "/update/brief-status", "/update/blog-enrichment",
  // GET query endpoints
  "/query/briefs", "/query/topic-clusters", "/query/tool-opportunities", "/query/linkedin-posts",
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
