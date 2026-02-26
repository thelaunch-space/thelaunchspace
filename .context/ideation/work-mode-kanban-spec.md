# Work Mode Kanban Board — Feature Spec

**Status:** All phases complete — deployed to dev 2026-02-26
**Last updated:** 2026-02-26

---

## START HERE — Session Handoff

> Read this section first if you're picking this up fresh. It summarises what happened, why we're building this, and exactly what to do next.

### The Big Picture

Krishna runs 5 AI agents (Parthasarathi, Vibhishana, Vyasa, Vidura, Valmiki) on OpenClaw that produce daily SEO blogs, strategy, and content for thelaunch.space. Currently agents write data to both **Google Sheets** and **Convex** (dual-write). The problem: when a Kanban is built inside Launch Control and Krishna approves something there, it updates Convex — but agents still read their work queues from Sheets and would never see the approval.

**The goal:** Make Convex the single source of truth. Agents read AND write from Convex. Sheets becomes archive-only. On top of that, build a **Work Mode Kanban** inside the Launch Control dashboard — so Krishna can see at a glance what's waiting on him, what agents are working, and what's done.

### What's Already Done (as of 2026-02-26)

| Task | Status |
|------|--------|
| Canonical Convex write endpoints deployed to production | ✅ Done |
| Full agent audit — all skill files migrated to canonical paths | ✅ Done |
| Dedup bug fixed (Vibhishana was using `/ingestBrief`) | ✅ Done |
| Vidura field name mismatches fixed | ✅ Done |
| Vyasa `writing` status push added | ✅ Done |
| Activity skill wired into all agent AGENTS.md files | ✅ Done |
| GET endpoint spec written + confirmed by Parthasarathi | ✅ Done |
| All reference docs finalised | ✅ Done |
| **Phase 0** — `linkedinPosts` + `manualTasks` schema, GET routes, OPTIONS CORS | ✅ Done |
| **Phase 1** — `convex/workboard.ts` getBoard + updateArtifactStatus, WorkBoard types | ✅ Done |
| **Phase 2** — Work Mode toggle, WorkBoard, WorkBoardColumn, WorkBoardCard, AddManualTaskForm | ✅ Done |
| `npx convex dev --once` clean + typecheck + lint pass | ✅ Done |

### What to Build Next — Phase 0

**Phase 0 is entirely in `convex/` files. No frontend yet.**

**Step 1 — Fix `convex/schema.ts`:**
- Add `linkedinPosts` table (schema in Technical Implementation section below)
- Add `manualTasks` table (schema in Technical Implementation section below)
- Fix `topicClusters` schema comment: remove `"brief-ready"` — valid values are `planned · in_progress · complete`
- Fix `toolOpportunities` schema comment: remove `"live"` — canonical value is `"built"`
- Remove `briefCreated: boolean` from `questions` schema (deprecated field)
- Run `npx convex dev --once` after changes

**Step 2 — Build GET routes in `convex/http.ts`:**
3 new GET routes (exact response shapes in `.context/docs/CONVEX-GET-REFERENCE.md`):
- `GET /query/briefs?status=<value>` — full brief objects for `brief_ready` (Vyasa), or `{ count, slugs, titles }` for `pending_review` (Vibhishana)
- `GET /query/topic-clusters` — all clusters, all statuses (Vidura)
- `GET /query/tool-opportunities` — all tool opportunities, all statuses (Vidura)
- `GET /query/linkedin-posts` — stub, once `linkedinPosts` table exists
- Add all 4 paths to the CORS OPTIONS preflight loop
- Run `npx convex dev --once` after changes

**Step 3 — Deploy:**
- Test on dev instance (localhost:3000)
- Push to main → Netlify auto-deploys Convex to production
- Tell Parthasarathi endpoints are live so he can rewire helper scripts

**After Phase 0 → Phase 1 (Kanban backend) → Phase 2 (Kanban frontend).**

### Key Files to Read Before Starting

| File | Why |
|------|-----|
| `convex/schema.ts` | Current schema — understand what exists before changing |
| `convex/http.ts` | Current HTTP routes — understand the pattern before adding GET routes |
| `.context/docs/CONVEX-API-REFERENCE.md` | All table schemas, field names, allowed status values |
| `.context/docs/CONVEX-GET-REFERENCE.md` | Exact confirmed response shapes for each GET endpoint |
| This doc (below) | Full Kanban design — columns, status mapping, UI, all phases |

### Convex Instances

| Instance | URL | Used for |
|----------|-----|----------|
| Dev | `impartial-pelican-672.convex.cloud` | Local dev — `npx convex dev --once` deploys here |
| Production | `curious-iguana-738.convex.cloud` | Live site — Netlify auto-deploys on push to `main` |

---

## Core Design Principle

**No manual assignment. No drag-and-drop.** The system auto-derives column placement and owner from each artifact's `status` field.

When Krishna approves a brief → status flips `pending_review` → `brief_ready` → card moves from "To Do" to "In Progress", owner changes to Vyasa. When Vyasa submits a PR → status becomes `pr_created` → new card appears in "To Do" assigned to Krishna.

**The status change IS the assignment.** Status changes are real mutations on source data — no separate override table. The only exception: `manualTasks` has no source artifact, so it lives in its own table.

---

## Kanban Columns (5)

| Column | Meaning |
|--------|---------|
| **Backlog** | Exists but not yet prioritised (tool ideas, topic clusters) |
| **To Do** | Needs action — waiting on Krishna or ready for an agent |
| **In Progress** | Actively being worked on |
| **Blocked** | Stuck — needs attention to unblock |
| **Done** | Completed |

---

## Status Mapping Table

This is the heart of the system — how each artifact's status maps to a Kanban column and owner.

### Briefs (Vibhishana → Krishna → Vyasa)

| Status | Column | Owner | Who Sets It |
|--------|--------|-------|-------------|
| `pending_review` | To Do | Krishna | Vibhishana (agent push) |
| `needs_revision` | Blocked | Vibhishana | Krishna (Kanban) |
| `brief_ready` | In Progress | Vyasa | Krishna (Kanban) |
| `writing` | In Progress | Vyasa | Vyasa (agent push) |
| `pr_created` | To Do | Krishna | Vyasa (agent push) |
| `published` | Done | — | Krishna (Kanban) |
| `dropped` | Done | — | Krishna (Kanban) |

### Blogs (Vyasa → Krishna)

| Status | Column | Owner | Who Sets It |
|--------|--------|-------|-------------|
| `writing` | In Progress | Vyasa | Vyasa (agent push) |
| `pr_created` | To Do | Krishna | Vyasa (agent push) |
| `published` | Done | — | Krishna (Kanban) |

### LinkedIn Posts (Valmiki → Krishna) — new `linkedinPosts` table

| Status | Column | Owner | Who Sets It |
|--------|--------|-------|-------------|
| `draft_ready` | To Do | Krishna | Valmiki (agent push) |
| `needs_revision` | Blocked | Valmiki | Krishna (Kanban) |
| `approved` | In Progress | Krishna | Krishna (Kanban) |
| `posted` | Done | — | Krishna (Kanban) |
| `skipped` | Done | — | Krishna (Kanban) |

### Leads / Pitch Bookings

| Status | Column | Owner | Who Sets It |
|--------|--------|-------|-------------|
| `new` | To Do | Krishna | System (form) |
| `contacted` | In Progress | Krishna | Krishna (Kanban) |
| `scheduled` | In Progress | Krishna | Krishna (Kanban) |
| `completed` | Done | — | Krishna (Kanban) |

### Tool Opportunities (Vidura → Vishwakarma pipeline)

| Status | Column | Owner | Who Sets It |
|--------|--------|-------|-------------|
| `proposed` | Backlog | — | Vidura (agent push) |
| `approved` | To Do | — | Krishna (Kanban) |
| `rejected` | Done | — | Krishna (Kanban) |
| `building` | In Progress | Vishwakarma | Future agent |
| `built` | Done | — | Krishna (Kanban) |

### Topic Clusters (Vidura)

| Status | Column | Owner | Who Sets It |
|--------|--------|-------|-------------|
| `planned` | Backlog | — | Vidura (agent push) |
| `in_progress` | In Progress | — | Vidura (agent push) |
| `complete` | Done | — | Vidura (agent push) |

### Manual Tasks (Krishna-created, no source artifact)

| Status | Column | Owner |
|--------|--------|-------|
| `todo` | To Do | Krishna |
| `in_progress` | In Progress | Krishna |
| `blocked` | Blocked | Krishna |
| `done` | Done | Krishna |

### NOT on the Kanban

| Data | Why Not |
|------|---------|
| Questions (772+) | Data inputs that feed into briefs — not tasks |
| Enrichment cycles | Counter only, no per-enrichment status |
| Cron health / agent status | Future: Agent Health dashboard |

---

## Action Buttons Per Card Type

| Card Type + Status | Actions |
|-------------------|---------|
| Brief (pending_review) | **Approve** / **Needs Revision** / **Drop** / View |
| Brief (needs_revision) | View (waiting on Vibhishana) |
| Brief (brief_ready) | View (waiting for Vyasa) |
| Blog (pr_created) | **View PR** / View Blog |
| LinkedIn Post (draft_ready) | **Approve** / **Skip** / View |
| LinkedIn Post (approved) | **Mark Posted** / View |
| Booking (new) | **Mark Contacted** / View |
| Booking (contacted) | **Mark Scheduled** / **Mark Complete** |
| Tool (proposed) | **Approve to Build** / **Reject** |
| Manual task | **Start** / **Complete** / **Block** / Delete |

`...` overflow menu on each card → "Move to..." for manual column override.

---

## UI Design

### Toggle Location
Small pill in the HeaderBar, between date display and Clerk avatar. Admin-only (`<SignedIn>`).
```
[Launch Control  by logo]    tagline    [date]  [Demo|Work]  [avatar]
```

### Layout
3-column layout preserved in Work mode — agent sidebar (left) + **Kanban** (center, replaces CenterTabs) + live feed (right).

### Card Design
```
+------------------------------------------+
| [Brief]  Review: How to Find a CTO       |
|                                           |
| Vibhishana              [Approve] [View]  |
|                            2 hours ago    |
+------------------------------------------+
```

- **Source badge** (top-left pill): Brief = emerald · Blog = purple · LinkedIn = sky blue · Lead = amber · Tool = cyan · Cluster = blue · Manual = gray
- **Title:** `text-sm font-medium`, 2-line clamp
- **Assignee:** small text below title
- **Action buttons:** right-aligned
- **Timestamp:** relative time, mono font
- **Click title:** opens detail view (brief → BriefReaderModal, blog → URL, etc.)

### Mobile
Column selector pills (same style as existing tab bar) with count badges. Tapping a pill shows that column's cards vertically.

---

## Technical Implementation

### New Convex Tables

```ts
// Add to convex/schema.ts

manualTasks: defineTable({
  title: v.string(),
  description: v.optional(v.string()),
  status: v.string(),               // "todo" | "in_progress" | "blocked" | "done"
  assignee: v.optional(v.string()), // "Krishna" or agent name
  createdAt: v.string(),
  updatedAt: v.string(),
}),

linkedinPosts: defineTable({
  insightName: v.string(),           // Dedup key with sourceBlogSlug + insightNumber
  draftText: v.string(),
  sourceBlogSlug: v.string(),
  sourceBlogTitle: v.optional(v.string()),
  insightNumber: v.number(),
  source: v.string(),                // "blog" | "krishna-insight"
  icpPass: v.boolean(),
  icpFailReason: v.optional(v.string()),
  hookStrategy: v.optional(v.string()),
  ctaType: v.optional(v.string()),
  krishnaFeedback: v.optional(v.string()),
  postedDate: v.optional(v.string()),
  linkedinUrl: v.optional(v.string()),
  status: v.string(),                // "draft_ready" | "needs_revision" | "approved" | "posted" | "skipped"
  agentName: v.string(),             // "Valmiki"
  createdAt: v.string(),
  updatedAt: v.optional(v.string()),
}),
```

### New Convex File: `convex/workboard.ts`

**Query: `getBoard`** (auth-gated, admin only)
1. Read all source tables (briefs, blogs, linkedinPosts, pitchBookings, toolOpportunities, topicClusters, manualTasks)
2. Map each record to a `WorkBoardTask` using the status mapping table above
3. Return unified array sorted by timestamp (newest first within each column)

**Mutations:**
- `updateArtifactStatus(table, id, newStatus)` — mutates status on the source record
- `createManualTask(title, description, assignee)`
- `updateManualTask(id, patches)`
- `deleteManualTask(id)`

### New Frontend Components

| Component | Purpose |
|-----------|---------|
| `WorkBoard.tsx` | Main board — calls `getBoard`, 5 columns (desktop) or column selector (mobile) |
| `WorkBoardColumn.tsx` | Column with header + count badge + scrollable card list |
| `WorkBoardCard.tsx` | Card with source badge, title, assignee, action buttons, timestamp, `...` menu |
| `AddManualTaskForm.tsx` | Inline form for creating manual tasks |

### Modified Files

| File | Change |
|------|--------|
| `convex/schema.ts` | Add `manualTasks` + `linkedinPosts`, fix stale schema comments |
| `lib/launch-control-types.ts` | Add `WorkBoardTask` interface, column config, status mapping, badge colors |
| `components/launch-control/HeaderBar.tsx` | Add `workMode` + `onToggleWorkMode` props, render toggle pill |
| `components/launch-control/LaunchControlDashboard.tsx` | Add `workMode` state + localStorage (`lc-work-mode`), conditional render CenterTabs vs WorkBoard |

---

## Implementation Order

### Phase 0: Schema + Read Endpoints ← START HERE
1. Fix schema comments (briefs, topicClusters, toolOpportunities, questions)
2. Add `manualTasks` + `linkedinPosts` tables → `npx convex dev --once`
3. Build GET routes (`/query/briefs`, `/query/topic-clusters`, `/query/tool-opportunities`, `/query/linkedin-posts`) → `npx convex dev --once`
4. Push to main → Netlify deploys to production
5. Notify Parthasarathi — endpoints live, begin rewiring helper scripts

### Phase 1: Kanban Backend (can run in parallel with Parthasarathi's rewiring)
6. `WorkBoardTask` types + status mapping config in `lib/launch-control-types.ts`
7. `convex/workboard.ts` — `getBoard` query + mutations → `npx convex dev --once`

### Phase 2: Kanban Frontend
8. Toggle in `HeaderBar.tsx` + `LaunchControlDashboard.tsx`
9. `WorkBoard.tsx` → `WorkBoardColumn.tsx` → `WorkBoardCard.tsx` → `AddManualTaskForm.tsx`

### Phase 3: Polish + Deploy
10. Loading skeletons, empty states, mobile column selector
11. Deploy + verify end-to-end: Krishna approves brief → Vyasa picks it up from Convex → blog written

### Parthasarathi's Parallel Track (after Phase 0)
- Rewire `vyasa-sheets-helper.js` → reads from `/query/briefs?status=brief_ready`
- Rewire `sheets-helper.js` → reads from `/query/briefs?status=pending_review`
- Rewire `vidura-sheets-helper.js` → reads from `/query/topic-clusters` + `/query/tool-opportunities`
- Wire Valmiki Convex push for `linkedinPosts` table

---

## Verification Checklist

- [ ] `npx convex dev --once` runs clean after schema changes
- [ ] Toggle appears next to avatar when signed in, invisible when signed out
- [ ] Work mode shows board auto-populated from existing Convex data
- [ ] Cards show correct source badges, assignees, action buttons
- [ ] "Approve" on a brief updates Convex status → card moves column
- [ ] Manual tasks can be created via inline form
- [ ] `...` overflow menu allows manual column override
- [ ] Clicking a brief card opens BriefReaderModal
- [ ] Toggle back to Demo mode — existing tabs work unchanged
- [ ] Mobile: column selector pills work
- [ ] `npm run typecheck` passes · `npm run lint` passes
