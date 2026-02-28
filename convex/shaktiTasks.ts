import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Upsert — dedup by clientSlug + projectSlug + title, used by Shakti via HTTP endpoint
export const upsert = internalMutation({
  args: {
    clientSlug: v.string(),
    projectSlug: v.string(),
    title: v.string(),
    description: v.optional(v.string()),
    taskType: v.string(),
    status: v.string(),
    priority: v.optional(v.number()),
    estimatedHours: v.optional(v.number()),
    actualHours: v.optional(v.number()),
    deadline: v.optional(v.string()),
    paceNotes: v.optional(v.string()),
    createdAt: v.string(),
    updatedAt: v.string(),
    createdBy: v.string(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("tasks")
      .withIndex("by_clientSlug", (q) => q.eq("clientSlug", args.clientSlug))
      .filter((q) =>
        q.and(
          q.eq(q.field("projectSlug"), args.projectSlug),
          q.eq(q.field("title"), args.title)
        )
      )
      .first();

    const now = new Date().toISOString();

    if (existing) {
      await ctx.db.patch(existing._id, { ...args, updatedAt: now });
      return { id: existing._id, action: "updated" as const };
    } else {
      const id = await ctx.db.insert("tasks", { ...args, updatedAt: now });
      return { id, action: "created" as const };
    }
  },
});

// Update status (and optional tracking fields) on a task by ID
export const updateStatus = internalMutation({
  args: {
    id: v.string(),
    status: v.string(),
    actualHours: v.optional(v.number()),
    paceNotes: v.optional(v.string()),
  },
  handler: async (ctx, { id, status, actualHours, paceNotes }) => {
    const now = new Date().toISOString();
    await ctx.db.patch(id as Id<"tasks">, {
      status,
      updatedAt: now,
      ...(actualHours !== undefined && { actualHours }),
      ...(paceNotes !== undefined && { paceNotes }),
    });
  },
});

// Returns tasks with optional filtering by status, clientSlug, projectSlug
export const getByFilters = internalQuery({
  args: {
    status: v.optional(v.string()),
    clientSlug: v.optional(v.string()),
    projectSlug: v.optional(v.string()),
  },
  handler: async (ctx, { status, clientSlug, projectSlug }) => {
    // Use most selective available index; filter remaining fields in memory
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

    // Apply remaining in-memory filters
    if (projectSlug) results = results.filter((t) => t.projectSlug === projectSlug);
    if (status && clientSlug) results = results.filter((t) => t.status === status);

    return results.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  },
});
