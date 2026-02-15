import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const ingest = internalMutation({
  args: {
    // Core identification
    title: v.string(),
    slug: v.string(),
    primaryKeyword: v.string(),
    // SEO data
    longTailKeywords: v.optional(v.array(v.string())),
    finalKeywords: v.optional(v.array(v.string())),
    // Strategic analysis
    icpProblem: v.optional(v.string()),
    competitiveGap: v.optional(v.string()),
    launchSpaceAngle: v.optional(v.string()),
    suggestedStructure: v.optional(v.string()),
    researchNotes: v.optional(v.string()),
    // Ranking
    rankingNotes: v.optional(v.string()),
    // Full content
    contentMarkdown: v.optional(v.string()),
    // Relationships
    sourceQuestionId: v.optional(v.string()),
    sourceUrls: v.optional(v.array(v.string())),
    blogUrl: v.optional(v.string()),
    // Categorization
    category: v.optional(v.string()),
    status: v.string(),
    // Timestamps
    createdAt: v.string(),
    updatedAt: v.optional(v.string()),
    // Agent metadata
    agentName: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("briefs", args);
    return { id };
  },
});

export const listMetadata = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const briefs = await ctx.db
      .query("briefs")
      .order("desc")
      .take(limit);
    return briefs.map((b) => ({
      _id: b._id,
      _creationTime: b._creationTime,
      title: b.title,
      slug: b.slug,
      primaryKeyword: b.primaryKeyword,
      category: b.category,
      status: b.status,
      agentName: b.agentName,
      createdAt: b.createdAt,
    }));
  },
});

export const getFullBrief = query({
  args: { briefId: v.id("briefs") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    return await ctx.db.get(args.briefId);
  },
});

export const listFull = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("briefs")
      .order("desc")
      .take(limit);
  },
});
