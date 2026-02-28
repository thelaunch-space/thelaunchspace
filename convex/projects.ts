import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Upsert — dedup by slug, used by Shakti via HTTP endpoint
export const upsert = internalMutation({
  args: {
    clientSlug: v.string(),
    name: v.string(),
    slug: v.string(),
    type: v.string(),
    status: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return { id: existing._id, action: "updated" as const };
    } else {
      const id = await ctx.db.insert("projects", args);
      return { id, action: "created" as const };
    }
  },
});

// Returns all projects, optionally filtered by clientSlug
export const getAll = internalQuery({
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

// Returns projects for a specific client
export const getByClientSlug = internalQuery({
  args: { clientSlug: v.string() },
  handler: async (ctx, { clientSlug }) => {
    return await ctx.db
      .query("projects")
      .withIndex("by_clientSlug", (q) => q.eq("clientSlug", clientSlug))
      .collect();
  },
});
