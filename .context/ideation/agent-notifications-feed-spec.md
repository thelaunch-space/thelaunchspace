# Agent Notifications Feed — Slack Replacement Design Spec

Last updated: 2026-03-05

## Goal

Replace Slack as the communication channel between AI agents and Krishna. All cron reports, status updates, alerts, and agent-to-human messages should appear in the `/agents` web UI — removing the need to keep Slack open for operational awareness.

---

## What Currently Happens on Slack

Every agent sends messages to Slack in several categories:

| Category | Example | Agent(s) |
|----------|---------|---------|
| Cron start/end reports | "7 AM brief complete. Scanned 3 communities, found 2 briefs." | All agents |
| Status updates | "Blog PR created: `/blogs/topic/slug`" | Vyasa |
| Anomaly / error alerts | "Convex push failed — HTTP 500. Retrying in 1h." | All agents |
| Daily digests | "Sunday digest: 14 tasks across 3 clients..." | Shakti |
| Interactive | Krishna asks a question → agent replies in thread | Parthasarathi (DM) |

The interactive (DM) flow already works via `/agents` chat. The gap is the **cron/proactive messages** — agents push these to Slack because there's no web-based inbox for them.

---

## Proposed Architecture: Live Feed

### Concept

A **Live Feed** panel inside `/agents` — a reverse-chronological stream of all agent-generated notifications. Think: a team Slack channel, but purpose-built for this specific workflow.

The feed is separate from the Chat window. Chat = direct conversations. Feed = operational updates the agents push autonomously.

### Where It Lives

Two options considered:

**Option A — Feed tab in AgentTopNav**
- Add a "Feed" tab/pill alongside the agent selector in the top nav
- Clicking "Feed" replaces the chat area with the notifications stream
- Pro: Clean separation, no new layout needed
- Con: You can't see the feed while in a chat

**Option B — Feed as a persistent right panel (collapsible)**
- Right panel alongside the existing sidebar + chat layout
- Can be open/collapsed independently
- Pro: Ambient awareness — see feed without leaving a conversation
- Con: Tighter on mobile, more layout work

**Recommendation: Option A (Feed tab) for Phase 1.** Simpler to build, easier to test. Promote to persistent panel in Phase 2 once usage patterns are clear.

---

## Convex Schema Addition

New table: `agentNotifications`

```typescript
agentNotifications: defineTable({
  agentId: v.string(),          // "main" | "vibhishana" | "vyasa" etc.
  agentName: v.string(),        // "Parthasarathi"
  category: v.string(),         // "cron_report" | "status_update" | "alert" | "digest"
  title: v.string(),            // Short summary: "7 AM brief complete"
  body: v.string(),             // Full message text (markdown supported)
  severity: v.string(),         // "info" | "success" | "warning" | "error"
  readAt: v.optional(v.string()), // ISO timestamp — null = unread
  createdAt: v.string(),
})
  .index("by_createdAt", ["createdAt"])
  .index("by_agentId", ["agentId"])
  .index("by_unread", ["readAt"]),
```

### New HTTP Endpoint

```
POST /push/notifications
Auth: Bearer <AGENT_API_KEY>
Body: {
  agentId: string,
  agentName: string,
  category: "cron_report" | "status_update" | "alert" | "digest",
  title: string,
  body: string,           // markdown
  severity: "info" | "success" | "warning" | "error"
}
```

This is the ONLY change required on the Convex + VPS side. Agents call this endpoint in addition to (or instead of) their Slack push.

---

## UI Design

### Feed View Layout

```
+----------------------------------------------------------+
|  thelaunch.space    [P][Vi][Vy][Vd][Vm][Sk]  [Feed •3]  |  ← Feed pill with unread badge
+------------------+---------------------------------------+
| + New Chat       |  Live Feed                 [Mark all read]
|                  |  ─────────────────────────────────────
| [Sidebar shows   |  [●] Shakti · 2 min ago    ← unread dot
|  conversations   |  Sunday digest ready
|  as usual]       |  14 tasks across 3 clients. Beacon House: ...
|                  |  ─────────────────────────────────────
|                  |  [✓] Vyasa · 1h ago         ← read
|                  |  Blog PR created
|                  |  `/blogs/seo/long-tail-keywords-for-consultants`
|                  |  ─────────────────────────────────────
|                  |  [!] Vibhishana · 3h ago    ← warning/alert styling
|                  |  Convex push failed
|                  |  HTTP 500 on /push/briefs. Will retry at next cron.
|                  |
+------------------+---------------------------------------+
```

### Notification Card

Each card shows:
- Agent avatar (small circle, accent color) + agent name
- Time ago (relative: "2 min ago", "1h ago", "Yesterday")
- Title (bold, 1 line)
- Body (markdown rendered, collapsible if >3 lines)
- Left border color = severity (`green` = success, `blue` = info, `yellow` = warning, `red` = error)
- Unread dot indicator

### Feed Tab in AgentTopNav

Add a "Feed" pill on the right side of the top nav (before the user avatar). Shows an unread badge count (red dot with number) when there are unread notifications.

Clicking "Feed" sets `activeConversationId = null` and `feedOpen = true` — the main content area renders `<NotificationsFeed />` instead of `<EmptyState />`.

---

## State Management in AgentsPage

Add to `AgentsPage.tsx`:

```typescript
const [showFeed, setShowFeed] = useState(false);

// When Feed is opened, mark all as read
const markAllRead = useMutation(api.agentNotifications.markAllRead);
const notifications = useQuery(api.agentNotifications.listNotifications, { limit: 50 });
const unreadCount = notifications?.filter(n => !n.readAt).length ?? 0;

const handleOpenFeed = useCallback(() => {
  setShowFeed(true);
  setActiveConversationId(null);
  markAllRead();
}, [markAllRead]);
```

---

## What Parthasarathi Needs to Change on VPS

One change per agent: add a call to `POST /push/notifications` alongside (or replacing) the Slack push.

**Migration approach — parallel run:**
1. Phase 1: Agents push to BOTH Slack AND Convex notifications. Feed goes live. Krishna monitors both.
2. Phase 2 (once feed is trusted): Remove Slack pushes one agent at a time, starting with low-stakes agents (Shakti digests, Vyasa PR notifications).
3. Phase 3: Remove Slack from cron reports entirely. Keep Slack only as a fallback alert channel (i.e., if the Convex push itself fails, fall back to Slack).

**Partha prompt outline (send after Convex endpoint is live):**
> "Partha — we're adding a web-based notification feed to replace Slack for cron reports and status messages. New endpoint live at `POST https://curious-iguana-738.convex.site/push/notifications`. For Phase 1, update each agent's cron scripts to call this endpoint in addition to Slack. Payload: `{ agentId, agentName, category, title, body, severity }`. Map existing Slack messages to these categories: cron start/end = `cron_report`, blog/brief created = `status_update`, errors = `alert`, digests = `digest`. Severity: normal ops = `info` or `success`, retries = `warning`, failures = `error`. We'll run parallel (Slack + web) until we confirm the feed is reliable, then drop Slack push per agent."

---

## Build Order

1. **Convex:** Add `agentNotifications` table to schema, `convex/agentNotifications.ts` (listNotifications, markAllRead, markRead mutations/queries), `POST /push/notifications` HTTP endpoint in `convex/http.ts`
2. **Convex deploy:** `npx convex dev --once`
3. **UI components:** `NotificationsFeed.tsx`, `NotificationCard.tsx` — use agent accent colors, markdown rendering (same `[&_p]:mb-2` pattern as MessageBubble)
4. **AgentsPage:** Add `showFeed` state, integrate `<NotificationsFeed />`
5. **AgentTopNav:** Add Feed pill with unread badge
6. **VPS:** Partha adds parallel push to `/push/notifications` (alongside Slack) for all agents
7. **Test:** Trigger a cron, verify notification appears in feed within seconds
8. **Phase 2:** Drop Slack pushes agent by agent

---

## What This Is NOT

- Not a full messaging system — notifications are one-way (agent → Krishna). Replies happen in Chat.
- Not a replacement for the Kanban — brief/blog approvals still live in Launch Control. Notifications just tell Krishna when something needs attention.
- Not a public feature — same auth gate as the rest of `/agents`.

---

## Open Questions (resolve with Krishna before building)

- Should notifications be per-agent (only see Shakti's notifications when on Shakti's tab) or global (all agents in one feed)? **Recommendation: global feed** — operational awareness requires seeing everything at a glance.
- Should the feed support replies? If yes, clicking "Reply" could open a new conversation with that agent pre-seeded with the notification context. Phase 2 consideration.
- Retention: how long to keep notifications? Recommend 30 days, then auto-purge via Convex cron.
