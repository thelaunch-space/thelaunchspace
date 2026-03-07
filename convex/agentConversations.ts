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

// Returns recent cron_update messages across all agents (or filtered by agentId)
// Used by Ops Feed UI
export const listCronUpdates = query({
  args: {
    agentId: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const systemUserId = "system_cron";
    const maxItems = args.limit ?? 100;

    // Get all cron_log conversations
    let conversations;
    if (args.agentId) {
      const conv = await ctx.db
        .query("agentConversations")
        .withIndex("by_userId_agentId", (q) =>
          q.eq("userId", systemUserId).eq("agentId", args.agentId!)
        )
        .filter((q) => q.eq(q.field("type"), "cron_log"))
        .collect();
      conversations = conv;
    } else {
      conversations = await ctx.db
        .query("agentConversations")
        .withIndex("by_userId", (q) => q.eq("userId", systemUserId))
        .filter((q) => q.eq(q.field("type"), "cron_log"))
        .collect();
    }

    if (conversations.length === 0) return [];

    // Collect messages from all cron_log conversations
    const allMessages = [];
    for (const conv of conversations) {
      const messages = await ctx.db
        .query("agentMessages")
        .withIndex("by_conversationId_createdAt", (q) =>
          q.eq("conversationId", conv._id)
        )
        .order("desc")
        .take(maxItems);

      for (const msg of messages) {
        allMessages.push({
          ...msg,
          agentId: conv.agentId,
          agentName: conv.agentName,
          conversationId: conv._id,
        });
      }
    }

    // Sort by createdAt desc and limit
    allMessages.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return allMessages.slice(0, maxItems);
  },
});
