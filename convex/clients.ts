import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
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

// Public query — for browser dropdowns
export const list = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.db
      .query("clients")
      .withIndex("by_status", (q) => q.eq("status", "active"))
      .collect();
  },
});

// Returns ALL clients regardless of status (for WorkspacePanel management view)
export const listAll = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    return await ctx.db.query("clients").collect();
  },
});

// Toggle client status
export const updateStatus = mutation({
  args: { id: v.id("clients"), status: v.string() },
  handler: async (ctx, { id, status }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    await ctx.db.patch(id, { status });
  },
});

// Delete a client by ID
export const remove = mutation({
  args: { id: v.id("clients") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    await ctx.db.delete(id);
  },
});

// Public mutation — for admin panel "Add Client" form
export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    type: v.string(),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    const now = new Date().toISOString();
    const existing = await ctx.db
      .query("clients")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { ...args, status: args.status ?? "active" });
      return { id: existing._id, action: "updated" as const };
    }
    const id = await ctx.db.insert("clients", {
      ...args,
      status: args.status ?? "active",
      createdAt: now,
    });
    return { id, action: "created" as const };
  },
});
