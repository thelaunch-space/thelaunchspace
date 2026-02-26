import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

// Upsert a LinkedIn post draft (called from HTTP push route)
export const upsert = internalMutation({
  args: {
    insightName: v.string(),
    draftText: v.string(),
    sourceBlogSlug: v.string(),
    sourceBlogTitle: v.optional(v.string()),
    insightNumber: v.number(),
    source: v.string(),
    icpPass: v.boolean(),
    icpFailReason: v.optional(v.string()),
    hookStrategy: v.optional(v.string()),
    ctaType: v.optional(v.string()),
    krishnaFeedback: v.optional(v.string()),
    postedDate: v.optional(v.string()),
    linkedinUrl: v.optional(v.string()),
    status: v.string(),
    agentName: v.string(),
    createdAt: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    // Dedup: look up by sourceBlogSlug, then filter by insightName
    const existing = await ctx.db
      .query("linkedinPosts")
      .withIndex("by_sourceBlogSlug", (q) => q.eq("sourceBlogSlug", args.sourceBlogSlug))
      .filter((q) => q.eq(q.field("insightName"), args.insightName))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, {
        draftText: args.draftText,
        status: args.status,
        updatedAt: now,
        ...(args.sourceBlogTitle !== undefined && { sourceBlogTitle: args.sourceBlogTitle }),
        ...(args.icpFailReason !== undefined && { icpFailReason: args.icpFailReason }),
        ...(args.hookStrategy !== undefined && { hookStrategy: args.hookStrategy }),
        ...(args.ctaType !== undefined && { ctaType: args.ctaType }),
        ...(args.krishnaFeedback !== undefined && { krishnaFeedback: args.krishnaFeedback }),
        ...(args.postedDate !== undefined && { postedDate: args.postedDate }),
        ...(args.linkedinUrl !== undefined && { linkedinUrl: args.linkedinUrl }),
      });
      return { action: "updated", id: existing._id };
    } else {
      const id = await ctx.db.insert("linkedinPosts", { ...args, updatedAt: now });
      return { action: "inserted", id };
    }
  },
});

// Update the status of a LinkedIn post (called from HTTP update route)
export const updateStatus = internalMutation({
  args: {
    insightName: v.string(),
    sourceBlogSlug: v.string(),
    newStatus: v.string(),
    krishnaFeedback: v.optional(v.string()),
  },
  handler: async (ctx, { insightName, sourceBlogSlug, newStatus, krishnaFeedback }) => {
    const post = await ctx.db
      .query("linkedinPosts")
      .withIndex("by_sourceBlogSlug", (q) => q.eq("sourceBlogSlug", sourceBlogSlug))
      .filter((q) => q.eq(q.field("insightName"), insightName))
      .first();

    if (!post) {
      throw new Error(`LinkedIn post not found: ${insightName}`);
    }

    const patch: Record<string, unknown> = {
      status: newStatus,
      updatedAt: new Date().toISOString(),
    };
    if (krishnaFeedback !== undefined) {
      patch.krishnaFeedback = krishnaFeedback;
    }

    await ctx.db.patch(post._id, patch);
    return { success: true, id: post._id };
  },
});

// Internal query — returns all posts for agent dedup checks
export const queryAll = internalQuery({
  args: {},
  handler: async (ctx) => {
    const results = await ctx.db.query("linkedinPosts").collect();
    return results.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  },
});
