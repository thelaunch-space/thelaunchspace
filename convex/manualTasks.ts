import { mutation } from "./_generated/server";
import { v } from "convex/values";

export const create = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    assignee: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, { title, description, assignee, status }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const now = new Date().toISOString();
    const id = await ctx.db.insert("manualTasks", {
      title,
      description,
      assignee: assignee ?? "Krishna",
      status: status ?? "todo",
      createdAt: now,
      updatedAt: now,
    });
    return { id };
  },
});

export const update = mutation({
  args: {
    id: v.id("manualTasks"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    assignee: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...patches }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const defined = Object.fromEntries(
      Object.entries(patches).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, { ...defined, updatedAt: new Date().toISOString() });
  },
});

export const remove = mutation({
  args: { id: v.id("manualTasks") },
  handler: async (ctx, { id }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    await ctx.db.delete(id);
  },
});
