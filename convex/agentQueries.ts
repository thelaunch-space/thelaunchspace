// Internal queries used by HTTP GET routes — returns data for agent read endpoints
import { internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const getBriefsByStatus = internalQuery({
  args: { status: v.string() },
  handler: async (ctx, { status }) => {
    const results = await ctx.db
      .query("briefs")
      .withIndex("by_status", (q) => q.eq("status", status))
      .collect();
    return results.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },
});

export const getAllTopicClusters = internalQuery({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db.query("topicClusters").collect();
    return results.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },
});

export const getAllToolOpportunities = internalQuery({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db.query("toolOpportunities").collect();
    return results.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },
});

export const getAllLinkedinPosts = internalQuery({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db.query("linkedinPosts").collect();
    return results.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },
});
