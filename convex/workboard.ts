import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

// Unified task shape returned by getBoard
type WorkBoardTask = {
  id: string;
  type: "brief" | "blog" | "linkedin" | "booking" | "tool" | "cluster" | "manual" | "task";
  title: string;
  status: string;
  column: "backlog" | "todo" | "in_progress" | "blocked" | "done";
  owner: string | null;
  timestamp: string;
  meta: Record<string, unknown>;
};

// Status → column + owner mappings
function mapBriefStatus(status: string): { column: WorkBoardTask["column"]; owner: string | null } {
  switch (status) {
    case "pending_review": return { column: "todo", owner: "Krishna" };
    case "needs_revision":  return { column: "blocked", owner: "Vibhishana" };
    case "brief_ready":     return { column: "in_progress", owner: "Vyasa" };
    case "writing":         return { column: "in_progress", owner: "Vyasa" };
    case "published":       return { column: "done", owner: null };
    case "dropped":         return { column: "done", owner: null };
    default:                return { column: "backlog", owner: null };
  }
}

function mapBlogStatus(status: string): { column: WorkBoardTask["column"]; owner: string | null } {
  switch (status) {
    case "writing":    return { column: "in_progress", owner: "Vyasa" };
    case "pr_created": return { column: "todo", owner: "Krishna" };
    case "published":  return { column: "done", owner: null };
    case "dropped":    return { column: "done", owner: null };
    default:           return { column: "backlog", owner: null };
  }
}

function mapLinkedinStatus(status: string): { column: WorkBoardTask["column"]; owner: string | null } {
  switch (status) {
    case "draft_ready":     return { column: "todo", owner: "Krishna" };
    case "needs_revision":  return { column: "blocked", owner: "Valmiki" };
    case "approved":        return { column: "in_progress", owner: "Krishna" };
    case "posted":          return { column: "done", owner: null };
    case "skipped":         return { column: "done", owner: null };
    default:                return { column: "backlog", owner: null };
  }
}

function mapBookingStatus(status: string): { column: WorkBoardTask["column"]; owner: string | null } {
  switch (status) {
    case "new":       return { column: "todo", owner: "Krishna" };
    case "contacted": return { column: "in_progress", owner: "Krishna" };
    case "scheduled": return { column: "in_progress", owner: "Krishna" };
    case "completed": return { column: "done", owner: null };
    default:          return { column: "backlog", owner: null };
  }
}

function mapToolStatus(status: string): { column: WorkBoardTask["column"]; owner: string | null } {
  switch (status) {
    case "proposed":  return { column: "backlog", owner: null };
    case "approved":  return { column: "todo", owner: null };
    case "rejected":  return { column: "done", owner: null };
    case "building":  return { column: "in_progress", owner: "Vishwakarma" };
    case "built":     return { column: "done", owner: null };
    default:          return { column: "backlog", owner: null };
  }
}

function mapClusterStatus(status: string): { column: WorkBoardTask["column"]; owner: string | null } {
  switch (status) {
    case "planned":     return { column: "backlog", owner: null };
    case "in_progress": return { column: "in_progress", owner: null };
    case "complete":    return { column: "done", owner: null };
    default:            return { column: "backlog", owner: null };
  }
}

function mapManualStatus(status: string): { column: WorkBoardTask["column"]; owner: string | null } {
  switch (status) {
    case "todo":        return { column: "todo", owner: "Krishna" };
    case "in_progress": return { column: "in_progress", owner: "Krishna" };
    case "blocked":     return { column: "blocked", owner: "Krishna" };
    case "done":        return { column: "done", owner: null };
    default:            return { column: "todo", owner: "Krishna" };
  }
}

function mapTaskStatus(status: string): { column: WorkBoardTask["column"]; owner: string | null } {
  switch (status) {
    case "backlog":     return { column: "backlog", owner: null };
    case "todo":        return { column: "todo", owner: "Krishna" };
    case "in_progress": return { column: "in_progress", owner: "Krishna" };
    case "blocked":     return { column: "blocked", owner: "Krishna" };
    case "done":        return { column: "done", owner: null };
    default:            return { column: "backlog", owner: null };
  }
}

// Auth-gated query — returns all kanban tasks unified from all source tables
export const getBoard = query({
  args: {},
  handler: async (ctx): Promise<WorkBoardTask[]> => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const [briefs, blogs, linkedinPosts, pitchBookings, toolOpportunities, topicClusters, manualTasks, shaktiTasksList] =
      await Promise.all([
        ctx.db.query("briefs").collect(),
        ctx.db.query("blogs").collect(),
        ctx.db.query("linkedinPosts").collect(),
        ctx.db.query("pitchBookings").collect(),
        ctx.db.query("toolOpportunities").collect(),
        ctx.db.query("topicClusters").collect(),
        ctx.db.query("manualTasks").collect(),
        ctx.db.query("tasks").collect(),
      ]);

    const tasks: WorkBoardTask[] = [];

    for (const brief of briefs) {
      const { column, owner } = mapBriefStatus(brief.status);
      tasks.push({
        id: brief._id,
        type: "brief",
        title: brief.title,
        status: brief.status,
        column,
        owner,
        timestamp: brief.updatedAt ?? brief.createdAt,
        meta: {
          slug: brief.slug,
          primaryKeyword: brief.primaryKeyword,
          category: brief.category ?? null,
          krishnaFeedback: brief.krishnaFeedback ?? null,
          revisionHistory: brief.revisionHistory ?? null,
        },
      });
    }

    for (const blog of blogs) {
      const { column, owner } = mapBlogStatus(blog.status);
      tasks.push({
        id: blog._id,
        type: "blog",
        title: blog.title,
        status: blog.status,
        column,
        owner,
        timestamp: blog.publishedAt ?? blog.createdAt,
        meta: {
          slug: blog.slug,
          url: blog.url ?? null,
          keyword: blog.keyword,
          briefId: blog.briefId ?? null,
        },
      });
    }

    for (const post of linkedinPosts) {
      const { column, owner } = mapLinkedinStatus(post.status);
      tasks.push({
        id: post._id,
        type: "linkedin",
        title: post.insightName,
        status: post.status,
        column,
        owner,
        timestamp: post.updatedAt ?? post.createdAt,
        meta: {
          sourceBlogSlug: post.sourceBlogSlug,
          sourceBlogTitle: post.sourceBlogTitle ?? null,
          insightNumber: post.insightNumber,
          draftText: post.draftText,
          krishnaFeedback: post.krishnaFeedback ?? null,
        },
      });
    }

    for (const booking of pitchBookings) {
      const { column, owner } = mapBookingStatus(booking.status);
      tasks.push({
        id: booking._id,
        type: "booking",
        title: booking.companyName,
        status: booking.status,
        column,
        owner,
        timestamp: booking.createdAt,
        meta: {
          email: booking.email,
          selectedDate: booking.selectedDate,
          selectedTimeIST: booking.selectedTimeIST,
          websiteUrl: booking.websiteUrl,
        },
      });
    }

    for (const tool of toolOpportunities) {
      const { column, owner } = mapToolStatus(tool.status);
      tasks.push({
        id: tool._id,
        type: "tool",
        title: tool.toolName,
        status: tool.status,
        column,
        owner,
        timestamp: tool.createdAt,
        meta: {
          toolSolution: tool.toolSolution,
          targetKeyword: tool.targetKeyword,
          complexity: tool.complexity,
          krishnaNotes: tool.krishnaNotes ?? null,
        },
      });
    }

    for (const cluster of topicClusters) {
      const { column, owner } = mapClusterStatus(cluster.status);
      tasks.push({
        id: cluster._id,
        type: "cluster",
        title: cluster.clusterTopic,
        status: cluster.status,
        column,
        owner,
        timestamp: cluster.updatedAt ?? cluster.createdAt,
        meta: {
          pillarName: cluster.pillarName,
          targetKeyword: cluster.targetKeyword,
          intentType: cluster.intentType,
          blogUrl: cluster.blogUrl ?? null,
        },
      });
    }

    for (const task of manualTasks) {
      const { column, owner } = mapManualStatus(task.status);
      tasks.push({
        id: task._id,
        type: "manual",
        title: task.title,
        status: task.status,
        column,
        owner,
        timestamp: task.updatedAt,
        meta: {
          description: task.description ?? null,
          assignee: task.assignee ?? "Krishna",
        },
      });
    }

    for (const t of shaktiTasksList) {
      const { column, owner } = mapTaskStatus(t.status);
      tasks.push({
        id: t._id,
        type: "task",
        title: t.title,
        status: t.status,
        column,
        owner,
        timestamp: t.updatedAt,
        meta: {
          clientSlug: t.clientSlug,
          projectSlug: t.projectSlug,
          taskType: t.taskType,
          description: t.description ?? null,
          estimatedHours: t.estimatedHours ?? null,
          priority: t.priority ?? null,
          deadline: t.deadline ?? null,
        },
      });
    }

    // Sort newest first within each type (stable sort, column grouping done on client)
    return tasks.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  },
});

// Auth-gated mutation — updates status on the source record
export const updateArtifactStatus = mutation({
  args: {
    type: v.string(),
    id: v.string(),
    newStatus: v.string(),
    feedback: v.optional(v.string()),
  },
  handler: async (ctx, { type, id, newStatus, feedback }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const now = new Date().toISOString();

    switch (type) {
      case "brief":
        await ctx.db.patch(id as Id<"briefs">, {
          status: newStatus,
          updatedAt: now,
          ...(feedback !== undefined && { krishnaFeedback: feedback }),
        });
        break;
      case "blog":
        await ctx.db.patch(id as Id<"blogs">, { status: newStatus });
        break;
      case "linkedin":
        await ctx.db.patch(id as Id<"linkedinPosts">, {
          status: newStatus,
          updatedAt: now,
          ...(feedback !== undefined && { krishnaFeedback: feedback }),
        });
        break;
      case "booking":
        await ctx.db.patch(id as Id<"pitchBookings">, { status: newStatus });
        break;
      case "tool":
        await ctx.db.patch(id as Id<"toolOpportunities">, { status: newStatus });
        break;
      case "cluster":
        await ctx.db.patch(id as Id<"topicClusters">, { status: newStatus, updatedAt: now });
        break;
      case "manual":
        await ctx.db.patch(id as Id<"manualTasks">, { status: newStatus, updatedAt: now });
        break;
      case "task":
        await ctx.db.patch(id as Id<"tasks">, {
          status: newStatus,
          updatedAt: now,
          ...(feedback !== undefined && { paceNotes: feedback }),
        });
        break;
      default:
        throw new Error(`Unknown artifact type: ${type}`);
    }
  },
});
