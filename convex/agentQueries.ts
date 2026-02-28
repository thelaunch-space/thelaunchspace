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

export const getAllClients = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("clients")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});

export const getAllProjects = internalQuery({
  args: { clientSlug: v.optional(v.string()) },
  handler: async (ctx, { clientSlug }) => {
    if (clientSlug) {
      return await ctx.db
        .query("projects")
        .withIndex("by_clientSlug", (q) => q.eq("clientSlug", clientSlug))
        .collect();
    }
    return await ctx.db.query("projects").collect();
  },
});

export const getTasksByFilters = internalQuery({
  args: {
    status: v.optional(v.string()),
    clientSlug: v.optional(v.string()),
    projectSlug: v.optional(v.string()),
  },
  handler: async (ctx, { status, clientSlug, projectSlug }) => {
    let results;

    if (clientSlug) {
      results = await ctx.db
        .query("tasks")
        .withIndex("by_clientSlug", (q) => q.eq("clientSlug", clientSlug))
        .collect();
    } else if (status) {
      results = await ctx.db
        .query("tasks")
        .withIndex("by_status", (q) => q.eq("status", status))
        .collect();
    } else {
      results = await ctx.db.query("tasks").collect();
    }

    if (projectSlug) results = results.filter((t) => t.projectSlug === projectSlug);
    if (status && clientSlug) results = results.filter((t) => t.status === status);

    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
});
