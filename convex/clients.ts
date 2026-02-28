import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Upsert — dedup by slug, used by Shakti via HTTP endpoint
export const upsert = internalMutation({
  args: {
    name: v.string(),
    slug: v.string(),
    type: v.string(),
    status: v.string(),
    notes: v.optional(v.string()),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("clients")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, args);
      return { id: existing._id, action: "updated" as const };
    } else {
      const id = await ctx.db.insert("clients", args);
      return { id, action: "created" as const };
    }
  },
});

// Returns all active clients
export const getAll = internalQuery({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("clients")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});
