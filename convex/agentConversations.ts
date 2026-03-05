import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const createConversation = mutation({
  args: {
    agentId: v.string(),
    agentName: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("agentConversations", {
      agentId: args.agentId,
      agentName: args.agentName,
      title: "New conversation",
      userId: args.userId,
      messageCount: 0,
      lastMessageAt: now,
      createdAt: now,
    });
  },
});

export const listConversations = query({
  args: {
    agentId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const conversations = await ctx.db
      .query("agentConversations")
      .withIndex("by_userId_agentId", (q) =>
        q.eq("userId", args.userId).eq("agentId", args.agentId)
      )
      .collect();
    // Sort by lastMessageAt descending
    return conversations.sort(
      (a, b) =>
        new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
    );
  },
});

export const updateConversationTitle = mutation({
  args: {
    conversationId: v.id("agentConversations"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, { title: args.title });
  },
});

export const updateConversationMeta = mutation({
  args: {
    conversationId: v.id("agentConversations"),
    lastMessageAt: v.string(),
    messageCount: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: args.lastMessageAt,
      messageCount: args.messageCount,
    });
  },
});

export const getConversation = query({
  args: {
    conversationId: v.id("agentConversations"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.conversationId);
  },
});
