import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// Called by VPS proxy via HTTP endpoint /push/agent-message
export const insertFromAgent = internalMutation({
  args: {
    conversationId: v.id("agentConversations"),
    content: v.string(),
    isError: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    // Insert the assistant message
    await ctx.db.insert("agentMessages", {
      conversationId: args.conversationId,
      role: "assistant",
      content: args.content,
      createdAt: now,
    });

    // Update conversation meta
    const conversation = await ctx.db.get(args.conversationId);
    if (conversation) {
      await ctx.db.patch(args.conversationId, {
        lastMessageAt: now,
        messageCount: (conversation.messageCount ?? 0) + 1,
      });
    }
  },
});

// Called by agents via HTTP endpoint /push/cron-update
// Finds or creates the cron_log conversation for the given agentId, then inserts the message
export const insertFromCronUpdate = internalMutation({
  args: {
    agentId: v.string(),
    agentName: v.string(),
    jobName: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    // System userId for cron updates — not tied to a real Clerk user
    const systemUserId = "system_cron";

    // Find existing cron_log conversation for this agent
    const existing = await ctx.db
      .query("agentConversations")
      .withIndex("by_userId_agentId", (q) =>
        q.eq("userId", systemUserId).eq("agentId", args.agentId)
      )
      .filter((q) => q.eq(q.field("type"), "cron_log"))
      .first();

    let conversationId;
    if (existing) {
      conversationId = existing._id;
    } else {
      // Create the cron_log conversation
      conversationId = await ctx.db.insert("agentConversations", {
        agentId: args.agentId,
        agentName: args.agentName,
        title: `${args.agentName} Ops Log`,
        userId: systemUserId,
        messageCount: 0,
        lastMessageAt: now,
        createdAt: now,
        type: "cron_log",
      });
    }

    // Insert the cron update message
    await ctx.db.insert("agentMessages", {
      conversationId,
      role: "assistant",
      content: args.content,
      createdAt: now,
      jobName: args.jobName,
      messageType: "cron_update",
    });

    // Update conversation meta
    const conv = await ctx.db.get(conversationId);
    if (conv) {
      await ctx.db.patch(conversationId, {
        lastMessageAt: now,
        messageCount: (conv.messageCount ?? 0) + 1,
      });
    }

    return { conversationId: conversationId.toString() };
  },
});

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
