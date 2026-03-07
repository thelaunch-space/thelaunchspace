import { internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

// Parthasarathi pushes the full cron schedule — upserts by agentId + jobName,
// removes stale entries for agents included in the push.
export const upsertBatch = internalMutation({
  args: {
    items: v.array(
      v.object({
        agentName: v.string(),
        agentId: v.string(),
        jobName: v.string(),
        label: v.string(),
        timeIST: v.string(),
        displayTime: v.string(),
        action: v.string(),
        dayOfWeek: v.optional(v.string()),
        enabled: v.boolean(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();

    // Collect which agentIds are being pushed so we can remove stale entries
    const pushedAgentIds = new Set(args.items.map((i) => i.agentId));

    // For each agent in the push, get existing entries
    for (const agentId of pushedAgentIds) {
      const existing = await ctx.db
        .query("cronSchedule")
        .withIndex("by_agentId_jobName", (q) => q.eq("agentId", agentId))
        .collect();

      const pushedJobNames = new Set(
        args.items.filter((i) => i.agentId === agentId).map((i) => i.jobName)
      );

      // Delete entries not in the new push for this agent
      for (const entry of existing) {
        if (!pushedJobNames.has(entry.jobName)) {
          await ctx.db.delete(entry._id);
        }
      }
    }

    // Upsert each item
    let upserted = 0;
    for (const item of args.items) {
      const existing = await ctx.db
        .query("cronSchedule")
        .withIndex("by_agentId_jobName", (q) =>
          q.eq("agentId", item.agentId).eq("jobName", item.jobName)
        )
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, { ...item, updatedAt: now });
      } else {
        await ctx.db.insert("cronSchedule", { ...item, updatedAt: now });
      }
      upserted++;
    }

    return { upserted };
  },
});

// Public query — returns today's enabled schedule items sorted by timeIST
export const todaySchedule = query({
  handler: async (ctx) => {
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
    const todayDay = days[new Date().getDay()];

    const all = await ctx.db
      .query("cronSchedule")
      .withIndex("by_timeIST")
      .collect();

    return all.filter(
      (item) =>
        item.enabled &&
        (!item.dayOfWeek || item.dayOfWeek === "daily" || item.dayOfWeek === todayDay)
    );
  },
});
