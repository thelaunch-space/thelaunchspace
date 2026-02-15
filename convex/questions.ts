import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

const questionValidator = v.object({
  // Core identification
  title: v.string(),
  subreddit: v.string(),
  url: v.string(),
  // Scanner analysis
  questionPain: v.string(),
  icpRelevance: v.string(),
  launchSpaceAngle: v.string(),
  contentPotential: v.string(),
  engagement: v.string(),
  notes: v.optional(v.string()),
  // Dates
  postDate: v.optional(v.string()),
  scannedAt: v.string(),
  // Status
  status: v.string(),
  briefCreated: v.optional(v.boolean()),
  // Agent metadata
  agentName: v.string(),
  batchId: v.optional(v.string()),
});

export const ingestBatch = internalMutation({
  args: {
    questions: v.array(questionValidator),
  },
  handler: async (ctx, args) => {
    for (const q of args.questions) {
      await ctx.db.insert("questions", q);
    }
    return { inserted: args.questions.length };
  },
});

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    return await ctx.db
      .query("questions")
      .order("desc")
      .take(limit);
  },
});

export const listFullDetails = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("questions")
      .order("desc")
      .take(limit);
  },
});
