# Work Mode Kanban Board — Feature Spec

**Status:** Planned (not yet implemented)
**Date:** 2026-02-19 (refined after brainstorm with Claude Code + Parthasarathi's full status audit + agent push verification + data source decision)
**Context:** Krishna needs operational visibility into what needs his attention vs. what agents are handling. As the system scales (5+ agents producing daily output), there's no clear "what do I need to do next?" view.

---

## The Problem

Launch Control is currently a **showcase/demo** — it shows visitors what the AI agents produce. But for Krishna (the operator), there's no operational view. He can't see at a glance:
- What's waiting on him (review a brief, approve a blog, follow up a lead)
- What agents are actively working on
- What's blocked and why
- What's been completed

As agent output scales, this becomes unmanageable without a task board.

## The Solution

A **Demo/Work mode toggle** in the Launch Control HeaderBar (admin-only).

- **Demo mode** (default) = current tabs view (Overview, Blogs, Communities, Questions, Briefs, Strategy, Meetings) — what visitors see
- **Work mode** = Kanban-style board replacing the center column, showing tasks by status with clear ownership

Only visible when signed in as admin. Visitors never see the toggle or the Kanban.

---

## Core Design Principle: Status Changes Drive Everything

**No manual assignment. No drag-and-drop orchestration.** The system auto-derives column placement and task ownership from each artifact's status field.

When Krishna approves a brief, the brief's status changes from `pending_review` → `brief_ready`. The Kanban automatically:
- Moves the card from "To Do" to "In Progress"
- Changes the owner from "Krishna" to "Vyasa"

When Vyasa finishes and creates a PR, the blog's status becomes `pr_created`. The Kanban automatically:
- Shows a new card in "To Do" assigned to Krishna ("Review blog PR")

**The status change IS the assignment.** No extra steps.

---

## Critical: Data Source Decision — Convex as Single Source of Truth

**Decision: Option C — Rewire agents to read from Convex. Deprecate Google Sheets.**

Agents currently READ from Google Sheets (via `sheets-helper.js` scripts) and WRITE to both Sheets + Convex. If the Kanban only updates Convex, agents wouldn't see approvals (they'd still read stale Sheets data). Three options were evaluated:

- ~~Option A (visibility only)~~ — Kanban shows data but Krishna still approves in Sheets. Defeats the purpose.
- ~~Option B (dual-write)~~ — Kanban updates both Convex and Sheets. Sync bugs inevitable. Throw-away work.
- **Option C (rewire agents)** — Add Convex read endpoints, update agent helper scripts to read from Convex. Sheets becomes archive. **Selected.**

**Why Option C wins (per Parthasarathi):** The rewiring is ~2 days. Only need 3-4 Convex HTTP read endpoints + update 2-3 helper scripts. Dual-write sync bugs are worse than the upfront migration work.

**Work split:**
| Who | What |
|-----|------|
| **Us (Claude Code + Krishna)** | Add Convex read endpoints to `convex/` folder, deploy to production |
| **Partha** | Rewire `vyasa-sheets-helper.js`, `sheets-helper.js`, `vidura-sheets-helper.js` to call Convex endpoints |
| **Us** | Build Kanban frontend + Convex mutations (in parallel) |
| **Partha** | Add `writing` status push to Vyasa's blog skill |
| **Partha** | Add Valmiki Convex ingest endpoint + `linkedinPosts` push |

**After migration:** Sheets becomes read-only archive. All live workflow happens in Convex. No sync logic needed.

---

## Agent Push Reality (Verified Feb 19, 2026)

Parthasarathi verified the actual skill files. **Agents only push the initial status.** All status progression is manual (will be handled by the Kanban).

| Table | What Agents Push | Everything Else |
|-------|-----------------|----------------|
| `briefs` | `pending_review` (Vibhishana) | All other statuses set by Kanban |
| `blogs` | `pr_created` (Vyasa) | `writing` to be added (Partha updating skill). `published` set by Kanban. |
| `topicClusters` | `planned` (Vidura) | All other statuses set by Kanban |
| `toolOpportunities` | `proposed` (Vidura) | All other statuses set by Kanban |
| `linkedinPosts` | `drafted` (Valmiki, future) | All other statuses set by Kanban |

**This means:** No risk of agents overwriting Kanban status changes. Clean separation — agents create, Kanban manages.

---

## Kanban Columns (5)

| Column | Meaning |
|--------|---------|
| **Backlog** | Exists but hasn't been prioritized yet (tool ideas, topic clusters) |
| **To Do** | Needs action — waiting on Krishna or ready for an agent to pick up |
| **In Progress** | Actively being worked on (by Krishna or an agent) |
| **Blocked** | Stuck — needs attention to unblock |
| **Done** | Completed |

---

## Status Mapping Table (the heart of the system)

This table defines how each artifact's status maps to a Kanban column and owner. The board reads this mapping and auto-populates. **Validated against Parthasarathi's full Google Sheets audit (Feb 19, 2026).**

Status names use `brief_ready` (matching Sheets convention, not `approved`) per Krishna's decision.

### Briefs — blog-queue tab (Vibhishana → Krishna → Vyasa pipeline)

| Brief Status | Kanban Column | Owner | What's Happening | Who Sets It | Current Count |
|-------------|---------------|-------|-----------------|-------------|---------------|
| `pending_review` | To Do | Krishna | Krishna needs to review this brief | Vibhishana (agent push) | 14 |
| `needs_revision` | Blocked | Vibhishana | Brief needs fixes before it can proceed | Krishna (Kanban action) | 3 |
| `brief_ready` | In Progress | Vyasa | Approved, waiting for Vyasa's cron to pick up | Krishna (Kanban action) | 4 |
| `writing` | In Progress | Vyasa | Vyasa is actively writing the blog | Vyasa (agent push — Partha adding this) | 0 |
| `pr_created` | To Do | Krishna | PR ready — Krishna needs to review and merge | Vyasa (agent push) | 1 |
| `published` | Done | — | Blog merged and live on site | Krishna (Kanban action after merge) | 11 |
| `dropped` | Done | — | Topic rejected or abandoned | Krishna (Kanban action) | 3 |

**Who pushes what (clean split):**
- Agents push: `pending_review` (Vibhishana creates brief), `writing` (Vyasa starts blog), `pr_created` (Vyasa finishes blog)
- Krishna sets via Kanban: `brief_ready`, `needs_revision`, `published`, `dropped`

### Blogs — Convex blogs table (Vyasa → Krishna pipeline)

| Blog Status | Kanban Column | Owner | What's Happening | Who Sets It |
|------------|---------------|-------|-----------------|-------------|
| `writing` | In Progress | Vyasa | Blog being written | Vyasa (agent push) |
| `pr_created` | To Do | Krishna | PR ready — Krishna needs to review and merge | Vyasa (agent push) |
| `published` | Done | — | Live on site | Krishna (Kanban action after merge) |

### LinkedIn Posts — NEW Convex table needed (Valmiki → Krishna pipeline)

| Post Status | Kanban Column | Owner | What's Happening | Who Sets It |
|------------|---------------|-------|-----------------|-------------|
| `drafted` | To Do | Krishna | Valmiki created draft, Krishna needs to review | Valmiki (agent push) |
| `scheduled` | In Progress | Krishna | Krishna approved, queued to post | Krishna (Kanban action) |
| `posted` | Done | — | Published on LinkedIn | Krishna (Kanban action) |
| `skipped` | Done | — | Day was skipped | Krishna (Kanban action) |

**Additional metadata (from Sheets):** Category column with values: AN (Announcement), SC (Scoreboard), AS (Agent Story), LE (Lesson), lead_gen, credibility.

### Leads / Pitch Bookings

| Booking Status | Kanban Column | Owner | What's Happening | Who Sets It |
|---------------|---------------|-------|-----------------|-------------|
| `new` | To Do | Krishna | New lead — needs follow-up | System (form submission) |
| `contacted` | In Progress | Krishna | Reached out, waiting for response | Krishna (Kanban action) |
| `scheduled` | In Progress | Krishna | Call booked | Krishna (Kanban action) |
| `completed` | Done | — | Handled | Krishna (Kanban action) |

### Tool Opportunities — tool-opportunities tab (Vidura → future Vishwakarma pipeline)

| Tool Status | Kanban Column | Owner | What's Happening | Who Sets It | Current Count |
|------------|---------------|-------|-----------------|-------------|---------------|
| `proposed` | Backlog | — | Unprioritized tool idea from Vidura | Vidura (agent push) | 8 |
| `approved` | To Do | — | Decided to build (future: Vishwakarma picks up) | Krishna (Kanban action) | 0 |
| `rejected` | Done | — | Krishna rejected the idea | Krishna (Kanban action) | 0 |
| `building` | In Progress | Vishwakarma | Being built (future) | Vishwakarma (agent push, future) | 0 |
| `built` | Done | — | Tool is live on site | Krishna / Vishwakarma (future) | 0 |

### Topic Clusters — topic-clusters tab (Vidura → content pipeline)

| Cluster Status | Kanban Column | Owner | What's Happening | Who Sets It | Current Count |
|---------------|---------------|-------|-----------------|-------------|---------------|
| `planned` | Backlog | — | Cluster identified, no content yet | Vidura (agent push) | 3 |
| `in_progress` | In Progress | — | Has some published content | Vidura (agent push) | 3 |
| `complete` | Done | — | All core subtopics published | Vidura (agent push) | 0 |

### Manual Tasks (Krishna creates these himself)

| Manual Status | Kanban Column | Owner |
|--------------|---------------|-------|
| `todo` | To Do | Krishna |
| `in_progress` | In Progress | Krishna |
| `blocked` | Blocked | Krishna |
| `done` | Done | Krishna |

### Items NOT on the Kanban Board

| Data | Why Not | Where It Lives |
|------|---------|---------------|
| Questions (772+) | Data inputs, not tasks. Feed into briefs. | Demo mode Questions tab |
| Question relevance (HIGH/MED/LOW) | Filtering metadata, not workflow status | Questions table |
| Question action (Watch/Brief/Skip) | Vibhishana's triage, not Krishna's task | Questions table |
| Enrichment cycle | Counter only, no status per enrichment | Blogs table (enrichmentCount field) |
| Cron health / agent status | Monitoring, not tasks | Future: Agent Health dashboard |

---

## How Status Updates Work (no override layer)

**V1 design decision: status changes are REAL mutations on source data.**

When Krishna clicks "Approve" on a brief card in Work mode:
1. A Convex mutation fires: `updateBriefStatus(briefId, "brief_ready")`
2. The brief's `status` field in the `briefs` table changes to `"brief_ready"`
3. The Kanban re-renders (Convex real-time subscription) — card moves from "To Do" to "In Progress", owner changes to Vyasa
4. When Vyasa's cron runs, he queries Convex for `status == "brief_ready"` briefs and picks them up

**No override layer. No separate `workboardItems` table for overrides.** Status changes on the source data are the single source of truth.

The only exception: **manual tasks** live in their own `manualTasks` table (since they have no source artifact).

---

## Action Buttons Per Card Type

Instead of drag-and-drop, each card shows **contextual action buttons** based on its type and current status.

| Card Type + Status | Actions Available |
|-------------------|-------------------|
| Brief (pending_review) | **Approve** / **Needs Revision** / **Drop** / View |
| Brief (needs_revision) | View (waiting on Vibhishana) |
| Brief (brief_ready) | View (waiting for Vyasa) |
| Blog (pr_created) | **View PR** / View Blog |
| LinkedIn Post (drafted) | **Schedule** / **Skip** / View |
| LinkedIn Post (scheduled) | **Mark Posted** / View |
| Booking (new) | **Mark Contacted** / View |
| Booking (contacted) | **Mark Scheduled** / **Mark Complete** |
| Tool (proposed) | **Approve to Build** / **Reject** |
| Manual task | **Start** / **Complete** / **Block** / Delete |

The `...` overflow menu on each card provides: "Move to..." dropdown for manual column override (edge cases where the standard flow doesn't fit).

---

## UI Design

### Toggle Location
Small pill toggle in the HeaderBar, between the date display and the Clerk UserButton (profile avatar). Only rendered inside `<SignedIn>`.

```
[Launch Control  by logo]    tagline    [date]  [Demo|Work]  [avatar]
```

### Layout
- **Work mode keeps the 3-column layout** — agent sidebar (left) + Kanban (center) + live feed (right)
- The Kanban replaces CenterTabs in the center column
- Agent sidebar shows agent health status (useful context for the board)
- Live feed shows real-time activity (useful context for the board)

### Card Design (compact, minimalistic)
```
+------------------------------------------+
| [Brief]  Review: How to Find a CTO       |
|                                           |
| Vibhishana              [Approve] [View]  |
|                            2 hours ago    |
+------------------------------------------+
```

- **Source badge:** Tiny colored pill at top-left
  - Brief = emerald
  - Blog = purple
  - LinkedIn = sky blue (#0A66C2)
  - Lead = amber
  - Tool = cyan
  - Cluster = blue
  - Manual = gray
- **Title:** `text-sm font-medium`, 2-line clamp
- **Assignee:** Agent name or "Krishna" in small text
- **Action buttons:** Primary action(s) as small buttons, right-aligned
- **Timestamp:** Relative time in mono font
- **`...` menu:** Manual column override (for edge cases)
- **Click title:** Opens source-specific detail (brief → BriefReaderModal, blog → blog URL, etc.)

### Mobile
- Can't fit 5 columns side by side
- Show column selector pills (same style as existing tab bar) with count badges
- Tapping a pill shows that column's cards vertically below

---

## Technical Implementation

### New Convex Table: `manualTasks`

Only for user-created tasks (no source artifact).

```ts
manualTasks: defineTable({
  title: v.string(),
  description: v.optional(v.string()),
  status: v.string(),              // "todo" | "in_progress" | "blocked" | "done"
  assignee: v.optional(v.string()), // "krishna" or agent name
  createdAt: v.string(),
  updatedAt: v.string(),
})
```

### New Convex Table: `linkedinPosts`

For Valmiki's LinkedIn content pipeline.

```ts
linkedinPosts: defineTable({
  title: v.string(),
  content: v.optional(v.string()),
  category: v.optional(v.string()),  // "AN" | "SC" | "AS" | "LE" | "lead_gen" | "credibility"
  status: v.string(),                // "drafted" | "scheduled" | "posted" | "skipped"
  dayNumber: v.optional(v.number()), // Challenge day number
  scheduledDate: v.optional(v.string()),
  postedDate: v.optional(v.string()),
  createdAt: v.string(),
  updatedAt: v.string(),
})
```

### Schema Changes to Existing Tables

**Current Convex schema already has `status` on all tables.** Changes needed to align values with Sheets + Kanban needs:

| Table | Current Schema Values | Needed Values | Change |
|-------|----------------------|---------------|--------|
| `briefs` | `pending_review`, `approved`, `needs_revision`, `brief_ready`, `writing`, `published` | Add: `pr_created`, `dropped`. Remove comment for `approved` (not used — `brief_ready` is the correct approval status). | Update schema comment |
| `blogs` | `writing`, `pr_created`, `published` | Already correct | None |
| `pitchBookings` | `new`, `contacted`, `scheduled`, `completed` | Already correct | None |
| `toolOpportunities` | `proposed`, `approved`, `rejected`, `built`, `live` | Sheets uses `built` not `live`. Keep both for now. Add `building`. | Add `building` to comment |
| `topicClusters` | `planned`, `brief-ready`, `published` | Sheets uses `in_progress`, `complete` (not `brief-ready`, `published`). **Mismatch — Vidura only pushes `planned`.** | Update comment to match Sheets: `planned`, `in_progress`, `complete` |

### New Convex Read Endpoints (for agent migration)

These endpoints let agents read from Convex instead of Google Sheets:

| Endpoint | Purpose | Called By |
|----------|---------|----------|
| `GET /getReadyBriefs` | Return briefs with `status == "brief_ready"` | Vyasa (to find briefs to write) |
| `GET /getPendingBriefs` | Return briefs with `status == "pending_review"` | Vibhishana (to check pipeline) |
| `GET /getTopicClusters` | Return all topic clusters with status | Vidura (to check cluster progress) |
| `GET /getToolOpportunities` | Return all tool opportunities with status | Vidura (to check tool pipeline) |

### New Convex File: `convex/workboard.ts`

**Query: `getBoard`** (auth-gated, admin only)
1. Read all 6 source tables (briefs, blogs, linkedinPosts, pitchBookings, toolOpportunities, topicClusters)
2. Map each record to a `WorkBoardTask` using the status mapping table
3. Read `manualTasks`, map to `WorkBoardTask`
4. Return unified array sorted by timestamp (newest first within each column)

**Mutations:**
- `updateArtifactStatus(table, id, newStatus)` — update status on source record (triggers column/owner change)
- `createManualTask(title, description, assignee)` — insert manual task (status: "todo")
- `updateManualTask(id, patches)` — edit manual task
- `deleteManualTask(id)` — remove manual task

### New Frontend Components

| Component | Purpose |
|-----------|---------|
| `WorkBoard.tsx` | Main board — calls `getBoard`, renders 5 columns (desktop) or column-selector (mobile), contains "Add task" button |
| `WorkBoardColumn.tsx` | Single column — header with name + count badge, scrollable card list |
| `WorkBoardCard.tsx` | Individual task card — source badge, title, assignee, action buttons, timestamp, overflow menu |
| `AddManualTaskForm.tsx` | Inline form or modal for creating manual tasks |

### Modified Files

| File | Change |
|------|--------|
| `convex/schema.ts` | Add `manualTasks` + `linkedinPosts` tables, add `status` fields to existing tables where missing |
| `lib/launch-control-types.ts` | Add `WorkBoardTask` interface, column config, status mapping config, source badge colors |
| `components/launch-control/HeaderBar.tsx` | Add `workMode` + `onToggleWorkMode` props, render toggle pill |
| `components/launch-control/LaunchControlDashboard.tsx` | Add `workMode` state + localStorage persistence, conditional render CenterTabs vs WorkBoard |

### Toggle State
- `useState` + `localStorage` in `LaunchControlDashboard`
- Persists across page refreshes
- Only reads localStorage when `isSignedIn` is true
- Key: `lc-work-mode`

---

## Implementation Order

### Phase 0: Schema + Read Endpoints (prerequisite for everything)
1. Fix schema comments/values to match Sheets audit (briefs: add `pr_created`/`dropped`, topicClusters: `in_progress`/`complete`)
2. Add `manualTasks` + `linkedinPosts` tables to schema → `npx convex dev --once`
3. Build Convex read endpoints (`/getReadyBriefs`, `/getPendingBriefs`, `/getTopicClusters`, `/getToolOpportunities`) → `npx convex dev --once`
4. Deploy to production → `npx convex deploy`
5. Tell Partha: read endpoints are live, start rewiring agent helper scripts

### Phase 1: Kanban Backend (can start in parallel with Partha's rewiring)
6. Types + status mapping config in `lib/launch-control-types.ts`
7. `convex/workboard.ts` — `getBoard` query + `updateArtifactStatus` mutation → `npx convex dev --once`

### Phase 2: Kanban Frontend
8. Toggle in `HeaderBar.tsx` + `LaunchControlDashboard.tsx`
9. `WorkBoard.tsx` (main board container)
10. `WorkBoardColumn.tsx` (column with header + card list)
11. `WorkBoardCard.tsx` (card with actions + overflow menu)
12. `AddManualTaskForm.tsx` (inline task creation)

### Phase 3: Polish + Deploy
13. Loading skeletons, empty states, mobile column selector, mobile testing
14. Deploy to production
15. Verify end-to-end: Krishna approves brief in Kanban → Vyasa picks it up from Convex → blog gets written

### Partha's Parallel Track
- Rewire `vyasa-sheets-helper.js` to read from Convex (depends on Phase 0 step 4)
- Rewire `sheets-helper.js` (Vibhishana) to read from Convex
- Rewire `vidura-sheets-helper.js` to read from Convex
- Add `writing` status push to Vyasa's `convex-push-blog` skill
- Add Valmiki Convex ingest for `linkedinPosts` table

## Verification Checklist

- [ ] `npx convex dev --once` runs clean after schema changes
- [ ] Toggle appears next to avatar when signed in
- [ ] Toggle is invisible when signed out
- [ ] Work mode shows board with auto-populated cards from existing Convex data
- [ ] Cards show correct source badges, assignees, and action buttons
- [ ] "Approve" on a brief updates its status in Convex → card moves to In Progress
- [ ] Can add manual tasks via inline form
- [ ] Can move cards via `...` overflow menu (manual override)
- [ ] Clicking a brief card opens BriefReaderModal
- [ ] Toggle back to Demo mode — existing tabs work unchanged
- [ ] Mobile: column selector pills work, layout doesn't break
- [ ] `npm run typecheck` passes
- [ ] `npm run lint` passes

---

## Future Enhancements (Not V1)

1. **`humanId` auto-increment** — Short numeric IDs (#127) for easier reference in Slack/conversation. Add to all tables. Enables Slack `/approve 127` commands later.
2. **Slack commands** — `/approve 127`, `/pending`, `/pending briefs`. Quick actions from Slack without switching to LC.
3. **Drag-and-drop** — V1 uses action buttons + overflow menu. Could add drag-and-drop later for faster column moves.
4. **Card ordering within columns** — V1 sorts by timestamp (newest first). Could add manual ordering with position fields later.
5. **Filters** — "Show only my tasks" vs "show agent tasks" vs "show all."
6. **Notification badges** — Count badge on the Work toggle pill showing items needing Krishna's attention.

---

## Key Design Decisions Log

| Decision | Rationale |
|----------|-----------|
| Status changes are real mutations (no override layer) | Simpler architecture. Status IS the source of truth. No sync issues between override table and source data. |
| Action buttons instead of drag-and-drop | 10x simpler to build. Works perfectly on mobile. Drag-and-drop is a future enhancement. |
| Auto-derived ownership from status mapping | No manual assignment needed. `brief_ready` = Vyasa's job. System knows the workflow. |
| Manual tasks in separate table | Clean separation. Manual tasks have no source artifact. Keeps source tables focused on their domain. |
| `...` overflow menu for edge-case moves | Standard flow uses action buttons. Override available for unusual situations (deprioritize, re-assign, etc.). |
| Convex real-time subscriptions power the board | Cards update instantly when agents push new data or statuses change. No polling needed. |
| `brief_ready` not `approved` | Match Google Sheets naming convention. Avoids confusion when agents and Kanban reference the same status values. |
| Valmiki LinkedIn posts in v1 | Complete operational picture from day one. New `linkedinPosts` Convex table + ingest endpoint. |
| Status values match Sheets exactly | Consistency during migration. Agents and Kanban reference same values. |
| Questions (772+) are NOT Kanban tasks | They're data inputs that feed into briefs. Belong in Demo mode Questions tab, not the task board. |
| Option C: Rewire agents to Convex (not dual-write) | Dual-write introduces sync bugs. Rewiring is ~2 days (3-4 read endpoints + 2-3 helper scripts). Cleaner than building throwaway sync logic. |
| Agents only push initial status | Verified by Partha. No risk of agents overwriting Kanban status changes. Kanban owns all status progression. |
| Sheets becomes archive after migration | No deletion. Just stops being read by agents. Historical data preserved. |
