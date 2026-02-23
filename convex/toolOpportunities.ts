import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";
import { logActivityIfNew } from "./lib/activityHelper";

export const ingest = internalMutation({
  args: {
    sourceQuestion: v.string(),
    whyTool: v.string(),
    toolName: v.string(),
    toolSolution: v.string(),
    targetKeyword: v.string(),
    complexity: v.string(),
    status: v.string(),
    krishnaNotes: v.optional(v.string()),
    agentName: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    // Dedup by toolName
    const existing = await ctx.db
      .query("toolOpportunities")
      .withIndex("by_toolName", (q) => q.eq("toolName", args.toolName))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        sourceQuestion: args.sourceQuestion,
        whyTool: args.whyTool,
        toolSolution: args.toolSolution,
        targetKeyword: args.targetKeyword,
        complexity: args.complexity,
        status: args.status,
        krishnaNotes: args.krishnaNotes,
      });
      return { id: existing._id, action: "updated" as const };
    }

    const id = await ctx.db.insert("toolOpportunities", args);

    await logActivityIfNew(ctx, {
      agentName: args.agentName,
      action: "tool_scan",
      message: `Identified tool opportunity: '${args.toolName}'`,
      dedupKey: `tool_scan:${args.toolName}`,
    });

    return { id, action: "inserted" as const };
  },
});

export const listRecent = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const tools = await ctx.db
      .query("toolOpportunities")
      .order("desc")
      .take(limit);
    return tools.map((t) => ({
      _id: t._id,
      _creationTime: t._creationTime,
      toolName: t.toolName,
      targetKeyword: t.targetKeyword,
      status: t.status,
      complexity: t.complexity,
      sourceQuestion: t.sourceQuestion,
    }));
  },
});

export const listFull = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const limit = args.limit ?? 50;
    return await ctx.db
      .query("toolOpportunities")
      .order("desc")
      .take(limit);
  },
});
