import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addMessage = mutation({
  args: {
    conversationId: v.id("agentConversations"),
    role: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("agentMessages", {
      conversationId: args.conversationId,
      role: args.role,
      content: args.content,
      createdAt: now,
    });
  },
});

export const listMessages = query({
  args: {
    conversationId: v.id("agentConversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("agentMessages")
      .withIndex("by_conversationId_createdAt", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();
  },
});

export const getLastNMessages = query({
  args: {
    conversationId: v.id("agentConversations"),
    n: v.number(),
  },
  handler: async (ctx, args) => {
    const all = await ctx.db
      .query("agentMessages")
      .withIndex("by_conversationId_createdAt", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();
    return all.slice(-args.n);
  },
});
