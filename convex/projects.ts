import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
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

// Public query — cascaded from client select
export const listByClient = query({
  args: { clientSlug: v.string() },
  handler: async (ctx, { clientSlug }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.db
      .query("projects")
      .withIndex("by_clientSlug", (q) => q.eq("clientSlug", clientSlug))
      .collect();
  },
});

// Toggle/update project status
export const updateStatus = mutation({
  args: { id: v.id("projects"), status: v.string() },
  handler: async (ctx, { id, status }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    await ctx.db.patch(id, { status });
  },
});

// Delete a project by ID
export const remove = mutation({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    await ctx.db.delete(id);
  },
});

// Public mutation — for admin panel "Add Project" form
export const create = mutation({
  args: {
    clientSlug: v.string(),
    name: v.string(),
    slug: v.string(),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const now = new Date().toISOString();
    const existing = await ctx.db
      .query("projects")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, type: args.type ?? "general", status: args.status ?? "active" });
      return { id: existing._id, action: "updated" as const };
    }
    const id = await ctx.db.insert("projects", {
      ...args,
      type: args.type ?? "general",
      status: args.status ?? "active",
      createdAt: now,
    });
    return { id, action: "created" as const };
  },
});
