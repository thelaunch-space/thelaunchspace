import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const ingest = internalMutation({
  args: {
    agentName: v.string(),
    action: v.string(),
    status: v.string(),
    message: v.string(),
    timestamp: v.string(),
    metadata: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("agentActivity", args);
    return { id };
  },
});

export const agentStatuses = query({
  args: {},
  handler: async (ctx) => {
    const agents = ["Parthasarathi", "Vibhishana", "Vyasa"];
    const statuses = [];
    for (const agentName of agents) {
      const latest = await ctx.db
        .query("agentActivity")
        .withIndex("by_agentName_timestamp", (q) => q.eq("agentName", agentName))
        .order("desc")
        .first();
      statuses.push({
        agentName,
        lastAction: latest?.action ?? null,
        lastStatus: latest?.status ?? "offline",
        lastMessage: latest?.message ?? null,
        lastTimestamp: latest?.timestamp ?? null,
      });
    }
    return statuses;
  },
});

export const recentFeed = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 30;
    return await ctx.db
      .query("agentActivity")
      .order("desc")
      .take(limit);
  },
});

export const fullLog = query({
  args: { limit: v.optional(v.number()), agentName: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");
    const limit = args.limit ?? 100;
    if (args.agentName) {
      return await ctx.db
        .query("agentActivity")
        .withIndex("by_agentName_timestamp", (q) => q.eq("agentName", args.agentName!))
        .order("desc")
        .take(limit);
    }
    return await ctx.db
      .query("agentActivity")
      .order("desc")
      .take(limit);
  },
});
