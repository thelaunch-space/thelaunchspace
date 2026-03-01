# Shakti [PA] — Personal Assistant Agent: Implementation Plan

**Created:** 2026-02-28
**Last updated:** 2026-02-28
**Status:** All phases complete. Phases 0+1 (Convex + LC UI) in production. Phase 2 (Shakti VPS setup) complete as of 2026-02-28 — Shakti live, 4 crons running, 3 clients + 16 projects seeded in prod Convex.
**Folder:** `openclaw-config-global/new-agent-brainstorm/`

---

## Implementation Progress

### What's done

**Phase 0 — Convex Foundation** ✅ Complete (deployed to dev instance)

| Item | File | Status |
|------|------|--------|
| `clients` table (schema) | `convex/schema.ts` | ✅ Done |
| `projects` table (schema) | `convex/schema.ts` | ✅ Done |
| `tasks` table (schema) | `convex/schema.ts` | ✅ Done |
| HTTP `GET /query/clients` | `convex/http.ts` | ✅ Done |
| HTTP `GET /query/projects` | `convex/http.ts` | ✅ Done |
| HTTP `GET /query/tasks` | `convex/http.ts` | ✅ Done |
| HTTP `POST /push/clients` | `convex/http.ts` | ✅ Done |
| HTTP `POST /push/projects` | `convex/http.ts` | ✅ Done |
| HTTP `POST /push/tasks` | `convex/http.ts` | ✅ Done |
| HTTP `POST /update/task-status` | `convex/http.ts` | ✅ Done |
| CORS OPTIONS loop updated | `convex/http.ts` | ✅ Done |
| Public `clients.list` query | `convex/clients.ts` | ✅ Done |
| Public `clients.listAll` query (all statuses, for admin) | `convex/clients.ts` | ✅ Done |
| Public `clients.create` mutation | `convex/clients.ts` | ✅ Done |
| Public `clients.updateStatus` mutation | `convex/clients.ts` | ✅ Done |
| Public `clients.remove` mutation | `convex/clients.ts` | ✅ Done |
| Public `projects.listByClient` query | `convex/projects.ts` | ✅ Done |
| Public `projects.create` mutation (type optional, defaults to "general") | `convex/projects.ts` | ✅ Done |
| Public `projects.updateStatus` mutation | `convex/projects.ts` | ✅ Done |
| Public `projects.remove` mutation | `convex/projects.ts` | ✅ Done |
| Public `shaktiTasks.create` mutation | `convex/shaktiTasks.ts` | ✅ Done |
| Public `shaktiTasks.listDone` query (filterable by client/project) | `convex/shaktiTasks.ts` | ✅ Done |
| Public `shaktiTasks.remove` mutation | `convex/shaktiTasks.ts` | ✅ Done |
| `getBoard` includes `tasks` table | `convex/workboard.ts` | ✅ Done |
| `updateArtifactStatus` handles `"task"` type | `convex/workboard.ts` | ✅ Done |
| Convex deployed to dev instance | — | ✅ Done (`npx convex dev --once`) |
| Typecheck + lint passing | — | ✅ Done |
| **Seed data (clients + projects)** | Convex dashboard or curl | ✅ Done (3 clients, 16 projects seeded to prod 2026-02-28) |
| Deployed to production | `git push main` | ✅ Done |

**Phase 1 — Launch Control UI** ✅ Complete

| Item | File | Status |
|------|------|--------|
| `WorkBoardCard.tsx` renders `task` type (client/project slugs, taskType badge, estimatedHours) | `components/launch-control/WorkBoardCard.tsx` | ✅ Done |
| `AddTaskForm.tsx` — Quick Task + Client Task modes | `components/launch-control/AddTaskForm.tsx` | ✅ Done (new file) |
| `WorkBoardColumn.tsx` — `+` button uses `AddTaskForm` | `components/launch-control/WorkBoardColumn.tsx` | ✅ Done |
| `WorkspacePanel.tsx` — Clients + Projects admin tables with inline add forms | `components/launch-control/WorkspacePanel.tsx` | ✅ Done (new file) |
| `WorkspacePanel.tsx` — Status editing (inline select, all valid statuses) | `components/launch-control/WorkspacePanel.tsx` | ✅ Done |
| `WorkspacePanel.tsx` — Delete buttons (clients, projects, tasks) | `components/launch-control/WorkspacePanel.tsx` | ✅ Done |
| `WorkspacePanel.tsx` — Add project bug fixed (auto-selects client filter) | `components/launch-control/WorkspacePanel.tsx` | ✅ Done |
| `WorkspacePanel.tsx` — Task History section (done tasks by client/project) | `components/launch-control/WorkspacePanel.tsx` | ✅ Done |
| `WorkspacePanel.tsx` — Project type field removed from Add Project form | `components/launch-control/WorkspacePanel.tsx` | ✅ Done |
| `AdminTabs.tsx` — "Workspace" tab added | `components/launch-control/AdminTabs.tsx` | ✅ Done |
| `AdminTab` type includes `"workspace"` | `lib/launch-control-types.ts` | ✅ Done |

---

### What's pending

**Immediate (before pushing to production):**
- [ ] Seed clients and projects via Convex dashboard (data in Phase 0 → Seed Data section below)
- [ ] Test locally: verify Client Task form populates from seeded data
- [ ] `git checkout main && git merge staging && git push` → production deploy

**Phase 2 — Shakti VPS Setup (Track B): ✅ COMPLETE (2026-02-28)**
- [x] `#shakti-ops` Slack channel created (C0AJKV6H2G0)
- [ ] Google Calendar OAuth credential — deferred until Shakti is settled
- [x] Client files drafted and saved to VPS: `clients/beacon-house.md`, `clients/edutechplus.md`, `clients/thelaunch-space.md` (self-contained, no local Mac paths)
- [x] Shakti workspace on VPS: SOUL.md, AGENTS.md, MEMORY.md, pace-model.md, USER.md, IDENTITY.md, TOOLS.md, HEARTBEAT.md, memory/, clients/
- [x] 4 crons registered (7AM/4:30PM/9:30PM IST daily + Sunday 10AM IST)
- [x] Parthasarathi AGENTS.md updated — Shakti in watched paths + team table
- [x] 3 clients + 16 projects seeded in production Convex (`curious-iguana-738`)

**Phase 3 — Learning Loop:** Happens naturally after Shakti runs for 3-5 days. No separate session needed to start.

**Phase 4 — Parthasarathi AGENTS.md Trim:** Do when Partha has a quiet window. Not urgent.

---

## Resuming in a New Session

If picking this up in a new Claude Code session:

1. **For seed data:** Open Convex dashboard → dev instance (`impartial-pelican-672.convex.cloud`) → Data tab → manually insert rows into `clients` and `projects` tables using the data in the "Seed Data" table in Phase 0 below. Or run curl against `POST /push/clients` and `POST /push/projects` with AGENT_API_KEY.

2. **For production push:** Run `npm run typecheck && npm run lint` to confirm clean, then `git checkout main && git merge staging && git push`.

3. **For Phase 2 (Shakti VPS):** The setup prompt for Parthasarathi hasn't been drafted yet. Start a new session in `openclaw-config-global/`, load this doc + `krishna-and-thelaunch-space-context/` for the client context, and draft: (a) the 3 client files, (b) the full Parthasarathi setup prompt covering SOUL.md, AGENTS.md, MEMORY.md, pace-model.md, USER.md, and the 4 crons.

---

## Context — Why This Exists

Krishna runs three parallel work streams with no single system that sees all of them:
- **thelaunch.space** — own business, 5 OpenClaw agents, Launch Control GTM, investor meetings
- **Beacon House** — 14-month retainer, multiple live products, WhatsApp automation, CRM
- **EduTechPlus** — active client, Fractions V5 demo-stage, Content Optimisation Platform upcoming

Current problem: planning is blind. No visibility across all three. No system that knows what's waiting, what's late, or how long things actually take. Parthasarathi knows only the content/SEO pipeline — he has zero awareness of Beacon House or EduTechPlus.

This plan introduces **Shakti** — a new OpenClaw agent whose entire job is to be Krishna's second brain across all three work streams. She learns Krishna's pace, owns the task backlog, and plans each day with real estimates based on how Krishna actually works — not guesses.

---

## Architecture Decisions (Locked)

- **Same OpenClaw instance** — Shakti lives in `/home/node/openclaw/shakti/` on the same VPS as the existing team.
- **New dedicated Slack channel** — `#shakti-ops` (or similar). Only Shakti and Krishna use it. Parthasarathi is aware of it but does not post there.
- **Convex as task hub** — new `clients`, `projects`, `tasks` tables. Shakti reads/writes via API. Krishna sees everything in Launch Control's Kanban. No local files relay needed.
- **Parthasarathi is Agent Lead** — Parthasarathi creates and manages Shakti's crons + config, just as he does for Vibhishana, Vyasa, etc. He is the Agent Lead for the full team including the PA.
- **No agent files created by Claude Code** — all workspace setup (SOUL.md, AGENTS.md, etc.) is executed by Parthasarathi on VPS. Claude Code only designs; Krishna relays to Parthasarathi.
- **`manualTasks` stays** — existing table and Kanban cards remain unchanged for backward compatibility. Shakti exclusively uses the new `tasks` table. Long-term migration is a future phase.

---

## Two Work Tracks

All implementation work falls into one of two tracks. Do not mix them.

### Track A — Krishna + Claude Code (Mac-side, Launch Control)
Work that happens in the `thelaunchspace/` project folder.
Claude Code makes the changes. Krishna tests locally, then pushes to main.

### Track B — Krishna + Parthasarathi (VPS-side, Slack)
Work that happens on the VPS via Slack DM with Parthasarathi.
Claude Code designs and drafts the instructions. Krishna reviews and sends to Parthasarathi as a prompt.
**Claude Code never edits files inside `my-openclaw-agent-setup-v2/`.**

---

## Convex API Reference (for Shakti setup — complete as of 2026-02-28)

This section is the authoritative reference for all Shakti-accessible data. When drafting Parthasarathi's setup prompt for Shakti, use the exact field names, status values, and endpoint paths below.

### Convex Instances

| Instance | URL | When to use |
|----------|-----|-------------|
| **Dev** | `https://impartial-pelican-672.convex.cloud` | Local development only |
| **Production** | `https://curious-iguana-738.convex.cloud` | Shakti's crons always hit this |

### Auth — All HTTP endpoints

All endpoints require: `Authorization: Bearer <AGENT_API_KEY>`

The AGENT_API_KEY is stored on VPS at `/home/node/openclaw/credentials/convex-api-key.txt` (same credential used by all other agents).

---

### Valid Status Values

**Clients:** `active` | `paused` | `completed` | `prospect`

**Projects:** `active` | `on-hold` | `completed` | `cancelled`

**Tasks:** `backlog` | `todo` | `in_progress` | `blocked` | `done`

**Task types:** `build` | `review` | `debug` | `strategy` | `client-comms` | `admin`

---

### HTTP Endpoints (Shakti reads/writes via these)

#### GET /query/clients
Returns all active clients.

Response array items:
```json
{ "_id": "...", "name": "Beacon House", "slug": "beacon-house", "type": "retainer", "status": "active", "notes": null }
```

#### GET /query/projects?clientSlug=beacon-house
Returns projects for a client. `clientSlug` is optional — omit to get all projects.

Response array items:
```json
{ "_id": "...", "clientSlug": "beacon-house", "name": "CRM System", "slug": "crm", "type": "maintenance", "status": "active", "notes": null }
```

#### GET /query/tasks?status=todo&clientSlug=beacon-house&projectSlug=crm
Returns tasks filtered by any combination of `status`, `clientSlug`, `projectSlug`. All params optional.

Response array items:
```json
{
  "_id": "...",
  "clientSlug": "beacon-house",
  "projectSlug": "crm",
  "title": "Add contact export to CSV",
  "description": null,
  "taskType": "build",
  "status": "todo",
  "priority": 1,
  "estimatedHours": 2,
  "actualHours": null,
  "deadline": null,
  "paceNotes": null,
  "createdBy": "Shakti",
  "createdAt": "2026-02-28T10:00:00.000Z",
  "updatedAt": "2026-02-28T10:00:00.000Z"
}
```

#### POST /push/clients
Create or upsert a client (dedup key: `slug`).

Request body:
```json
{
  "name": "Beacon House",
  "slug": "beacon-house",
  "type": "retainer",
  "status": "active",
  "notes": "14-month retainer, Ivy League admissions platform",
  "createdAt": "2026-02-28T10:00:00.000Z"
}
```

Response: `{ "success": true, "id": "...", "action": "created" | "updated" }`

#### POST /push/projects
Create or upsert a project (dedup key: `slug`).

Request body:
```json
{
  "clientSlug": "beacon-house",
  "name": "CRM System",
  "slug": "crm",
  "type": "maintenance",
  "status": "active",
  "notes": null,
  "createdAt": "2026-02-28T10:00:00.000Z"
}
```

Response: `{ "success": true, "id": "...", "action": "created" | "updated" }`

#### POST /push/tasks
Create or upsert a task (dedup key: `clientSlug + projectSlug + title`).

Request body:
```json
{
  "clientSlug": "beacon-house",
  "projectSlug": "crm",
  "title": "Add contact export to CSV",
  "description": "Export contacts as CSV from admin view",
  "taskType": "build",
  "status": "todo",
  "priority": 1,
  "estimatedHours": 2,
  "actualHours": null,
  "deadline": null,
  "paceNotes": null,
  "createdAt": "2026-02-28T10:00:00.000Z",
  "updatedAt": "2026-02-28T10:00:00.000Z",
  "createdBy": "Shakti"
}
```

Response: `{ "success": true, "id": "...", "action": "created" | "updated" }`

#### POST /update/task-status
Update status and optional tracking fields on a task by ID.

Request body:
```json
{
  "id": "<task _id from GET /query/tasks>",
  "status": "done",
  "actualHours": 2.5,
  "paceNotes": "Took longer than expected — CSV library had encoding issues"
}
```

`actualHours` and `paceNotes` are optional. `status` is required.

Response: `{ "success": true }`

---

### Shakti's Typical API Call Pattern

**Morning brief (7 AM):**
1. `GET /query/tasks?status=todo` — what's planned
2. `GET /query/tasks?status=in_progress` — what's already running
3. `GET /query/tasks?status=blocked` — what's stuck
4. `GET /query/tasks?status=backlog` — what's waiting to be planned (flag if > 3 days old)

**When Krishna replies "go" to create calendar blocks:**
- No Convex call needed — just create Google Calendar events based on the plan Shakti already built from the GET calls above

**When Krishna marks a task done (DM to #shakti-ops):**
```
POST /update/task-status
{ "id": "<task_id>", "status": "done", "actualHours": 1.5, "paceNotes": "..." }
```

**When Shakti creates a new task from Krishna's DM:**
```
POST /push/tasks
{ "clientSlug": "...", "projectSlug": "...", "title": "...", "taskType": "...", "status": "todo", "estimatedHours": 1, "createdBy": "Shakti", "createdAt": "<now>", "updatedAt": "<now>" }
```

**Weekly digest (Sunday 10 AM) — pull all completed tasks this week:**
- `GET /query/tasks?status=done` — returns all done tasks with `updatedAt`. Filter in memory to last 7 days.

---

## Phase Overview

```
Phase 0  [Track A]  Convex Foundation — schema + endpoints + workboard
Phase 1  [Track A]  Launch Control UI — new tasks view
Phase 2  [Track B]  Shakti Setup — workspace + crons + Convex wiring + Google Calendar
Phase 3  [Track B]  Shakti Learning Loop — pace model + billing intelligence
Phase 4  [Track B]  Parthasarathi AGENTS.md Trim — reduce load, add Shakti entry (when needed)
```

**Hard dependency:** Phases 2 and 3 require Phase 0 live in production (Shakti's crons call Convex endpoints).
**Phase 4 is independent** — Parthasarathi's AGENTS.md trim is not a prerequisite for Shakti's setup. It can happen after Shakti is running and stable, whenever it makes sense. It is not urgent.

---

## Phase 0 — Convex Foundation

**Track:** A (Claude Code + Krishna)
**When to start:** Immediately — Krishna is already being swamped.
**Prerequisite:** None.

### Goal
Add the `clients`, `projects`, and `tasks` tables to Convex. Expose HTTP endpoints so Shakti (and any future agent) can read and write tasks from VPS without touching local Mac files.

### Schema Changes — `convex/schema.ts`

**New table: `clients`**
```typescript
clients: defineTable({
  name: v.string(),             // "Beacon House", "EduTechPlus", "thelaunch.space"
  slug: v.string(),             // "beacon-house", "edutechplus", "thelaunch-space"
  type: v.string(),             // "retainer" | "project" | "internal"
  status: v.string(),           // "active" | "paused" | "completed"
  notes: v.optional(v.string()), // Brief context (e.g., "14-month retainer, Ivy League admissions")
  createdAt: v.string(),
})
  .index("by_slug", ["slug"])
  .index("by_status", ["status"]),
```

**New table: `projects`**
```typescript
projects: defineTable({
  clientSlug: v.string(),       // References clients.slug — denormalized for easy querying
  name: v.string(),             // "WhatsApp Automation", "Fractions V5"
  slug: v.string(),             // "whatsapp-automation", "fractions-v5"
  type: v.string(),             // "feature" | "maintenance" | "internal" | "retainer"
  status: v.string(),           // "active" | "on-hold" | "completed"
  notes: v.optional(v.string()),
  createdAt: v.string(),
})
  .index("by_clientSlug", ["clientSlug"])
  .index("by_slug", ["slug"])
  .index("by_status", ["status"]),
```

**New table: `tasks`**
```typescript
tasks: defineTable({
  clientSlug: v.string(),       // Denormalized — used for filtering and billing summaries
  projectSlug: v.string(),      // References projects.slug
  title: v.string(),
  description: v.optional(v.string()),
  taskType: v.string(),         // "build" | "review" | "debug" | "strategy" | "client-comms" | "admin"
  status: v.string(),           // "backlog" | "todo" | "in_progress" | "blocked" | "done"
  priority: v.optional(v.number()), // 1 = high, 2 = medium, 3 = low
  estimatedHours: v.optional(v.number()), // Filled by Shakti based on pace model
  actualHours: v.optional(v.number()),    // Filled by Krishna/Shakti when task completes
  deadline: v.optional(v.string()),       // ISO date string
  paceNotes: v.optional(v.string()),      // Shakti's observations on how this task went (learning data)
  createdAt: v.string(),
  updatedAt: v.string(),
  createdBy: v.string(),        // "Krishna" | "Shakti"
})
  .index("by_clientSlug", ["clientSlug"])
  .index("by_projectSlug", ["projectSlug"])
  .index("by_status", ["status"])
  .index("by_taskType", ["taskType"])
  .index("by_deadline", ["deadline"])
  .index("by_createdAt", ["createdAt"]),
```

**Why these design choices:**
- `clientSlug` and `projectSlug` are string slugs (not Convex IDs) because Shakti will reference them in HTTP API calls from VPS. String slugs are human-readable and don't require a lookup step before creating a task.
- Both are denormalized on `tasks` so Shakti can query "all tasks for beacon-house" in a single API call without a join.
- `taskType` uses a fixed vocabulary for the pace model to learn from — Shakti can only build a reliable pattern if the categories are consistent.
- `estimatedHours` is Shakti's prediction. `actualHours` is ground truth. The gap between them is how the pace model learns.

### Task Types — Rationale

| Type | Description | Typical Duration |
|---|---|---|
| `build` | New feature or product — writing code, building something | Hours to days (most variable) |
| `review` | Brief review, PR merge, content approval, code review | 15 min to 1 hour |
| `debug` | Fixing a bug or resolving a technical issue | Unpredictable — could be 15 min or 3 hours |
| `strategy` | Design session, brainstorm, planning | 30 min to 2 hours |
| `client-comms` | Client calls, status updates, follow-ups | 30 min to 1 hour |
| `admin` | Config changes, deployments, housekeeping, file updates | 15 min to 30 min |

These are exactly the buckets Shakti needs to build a pace model. Over time, Krishna's patterns within each bucket become the foundation for estimates.

### New HTTP Endpoints — `convex/http.ts`

Add these alongside existing endpoints. Same `AGENT_API_KEY` Bearer token auth.

**Read endpoints (GET):**
- `GET /query/clients` — all active clients (name, slug, type, notes)
- `GET /query/projects?clientSlug=<slug>` — all projects for a client. Optional filter; if no `clientSlug`, returns all active projects.
- `GET /query/tasks?status=<status>&clientSlug=<slug>&projectSlug=<slug>` — tasks filtered by any combination. All params optional; returns all tasks if no filters.

**Write endpoints (POST):**
- `POST /push/tasks` — create or upsert a task (dedup key: `clientSlug + projectSlug + title`)
- `POST /push/clients` — create or upsert a client (dedup key: `slug`)
- `POST /push/projects` — create or upsert a project (dedup key: `slug`)
- `POST /update/task-status` — update status, actualHours, paceNotes on a task by ID or title+projectSlug

**Add all new paths to the CORS OPTIONS loop at the bottom of `http.ts`.**

### Update `convex/workboard.ts`

The existing `getBoard` query needs to include `tasks` as a new card type alongside the existing types. Add:
- `type: "task"` to `WorkBoardTask`
- Status mapping for tasks:
  - `backlog` → column: `"backlog"`, owner: null
  - `todo` → column: `"todo"`, owner: `"Krishna"`
  - `in_progress` → column: `"in_progress"`, owner: `"Krishna"`
  - `blocked` → column: `"blocked"`, owner: `"Krishna"`
  - `done` → column: `"done"`, owner: null
- Include in `getBoard` parallel fetch and unified task array

**Important:** `manualTasks` stays in `getBoard` unchanged. Both `manualTasks` and `tasks` appear on the Kanban. They're visually distinguished by their source badge. No migration yet.

### Seed Data

After schema is deployed and endpoints are live, seed the initial clients and projects via the API. This can be done with a simple curl script or from the Convex dashboard. Suggested initial data:

**Clients:**
| Name | Slug | Type | Status |
|---|---|---|---|
| Beacon House | `beacon-house` | `retainer` | `active` |
| EduTechPlus | `edutechplus` | `project` | `active` |
| thelaunch.space | `thelaunch-space` | `internal` | `active` |

**Projects (Beacon House):**
| Name | Slug | Type | Status |
|---|---|---|---|
| Apply Landing Page | `apply-lp` | `maintenance` | `active` |
| WhatsApp Automation | `whatsapp-automation` | `feature` | `active` |
| CRM System | `crm` | `maintenance` | `active` |
| Psychometric Tool | `psychometric` | `maintenance` | `active` |
| Counseling Ops Engine | `counseling-ops` | `feature` | `active` |

**Projects (EduTechPlus):**
| Name | Slug | Type | Status |
|---|---|---|---|
| Fractions V5 | `fractions-v5` | `feature` | `active` |
| Content Optimisation Platform | `content-optimisation` | `feature` | `active` |

**Projects (thelaunch.space):**
| Name | Slug | Type | Status |
|---|---|---|---|
| OpenClaw Agents | `openclaw-agents` | `internal` | `active` |
| Launch Control | `launch-control` | `internal` | `active` |
| Social Media & GTM | `social-gtm` | `internal` | `active` |
| SEO Pipeline | `seo-pipeline` | `internal` | `active` |

### Deployment Checklist (Phase 0)
- [x] Edit `convex/schema.ts` — add clients, projects, tasks tables
- [x] Edit `convex/http.ts` — add all new GET and POST routes + CORS loop entries
- [x] Edit `convex/workboard.ts` — add `tasks` type to `getBoard` and `updateArtifactStatus`
- [x] `npx convex dev --once` — deploy to dev instance
- [x] `npm run typecheck` — must pass clean
- [ ] Test locally: create a client, create a project, create a task, verify WorkBoard shows it
- [ ] `git checkout main && git merge staging && git push` — auto-deploys to production
- [ ] Seed clients and projects via Convex dashboard or curl script
- [ ] Confirm endpoints are live: test `GET /query/clients` with AGENT_API_KEY header

---

## Phase 1 — Launch Control UI Updates

**Track:** A (Claude Code + Krishna)
**Prerequisite:** Phase 0 deployed to production.

### Goal
Make the new `tasks` table visible and useful in Launch Control. Krishna should be able to see all his tasks, filtered by client/project, in the Work Mode Kanban.

### Changes Needed

**WorkBoard UI** — The `WorkBoardCard.tsx` for a `task` type should show:
- Source badge: orange/amber pill labeled "Task"
- Title
- Client slug + Project slug (small text below title, e.g. "beacon-house / whatsapp-automation")
- Task type badge (small: "build", "review", etc.)
- Estimated hours (if set by Shakti)
- Assignee (always "Krishna" for tasks)
- Action buttons: Start / Done / Block

**Optional (can defer):** A filter bar above the Kanban to show only tasks for a specific client. Useful when the board gets crowded.

### Deployment Checklist (Phase 1)
- [x] Update `WorkBoardCard.tsx` — handle `type: "task"` with client/project labels and task type badge
- [x] Update `updateArtifactStatus` mutation in `workboard.ts` to handle `type: "task"`
- [x] `npx convex dev --once` + typecheck + lint
- [ ] Local test (requires seed data — see Phase 0 checklist)
- [ ] Merge to main and confirm in production

---

## Phase 2 — Shakti Agent Setup

**Track:** B (Parthasarathi + Slack)
**Prerequisites:** Phase 0 production-deployed, Google Calendar OAuth credential created.
**Why this order:** Shakti needs the Convex task endpoints to be live before her crons make any API calls. The 7 AM cron creates calendar events after Krishna confirms the plan — this requires Google Calendar write access to be set up before Phase 2 begins.

### Who Creates the Files

**Parthasarathi creates all agent files on VPS.** Claude Code designs the content and Krishna relays it. Nothing from this document gets executed by Claude Code on the agent side.

### Shakti — Agent Persona Design

**Name:** Shakti. Derived from the divine force that powers victories — the intelligence behind the throne. First female agent on the team.

**One-line identity:** The agent that knows how Krishna works — and plans the day before Krishna has to think about it.

**Core mission:** Look at the full backlog across all work streams. Prioritize. Estimate duration based on learned pace. Present a realistic daily plan. Create calendar blocks once the plan is confirmed. Check progress mid-day. Consolidate at end of day. Learn from every completion to get better at the next prediction.

---

### SOUL.md — Persona Design

Key principles for whoever writes this (Parthasarathi will create the actual file):

- **Planner-first, not task-tracker.** Shakti is not a to-do list. A to-do list just shows what exists. Shakti says what to do today, in what order, and how long it will realistically take.
- **Honest about capacity.** If Krishna has 8 hours of estimated work and 5 hours of available time, say so directly. Don't sugarcoat. Don't quietly drop tasks from the plan.
- **Learns explicitly, not silently.** Every time a task completes with an actual duration, Shakti logs it with a short observation. Over time, those observations become reliable estimates.
- **Scope-aware.** Knows the difference between a Beacon House "build" task and a thelaunch.space "review" task. Different contexts produce different pace patterns. Never blends them.
- **No fluff in daily briefings.** Lead with the plan. If there's a flag (deadline risk, overcommitment, something sitting stale), surface it first. Never bury the important thing.
- **Responsive to Krishna's messages.** When Krishna messages the channel directly — to add a task, mark something done, or ask what's next — Shakti responds immediately and updates Convex. No need to wait for a cron.
- **Not a content agent.** Shakti does not write posts, blogs, or strategy. She does not comment on agent quality. That's Parthasarathi's and the content agents' job.
- **Communication tone:** Calm, precise, slightly dry. Like a trusted ops lead who has been doing this for years and doesn't waste words.

---

### AGENTS.md — KRAs and Cron Design

**KRAs (Key Result Areas):**

| KRA | How to Measure |
|---|---|
| Daily plan quality | Does the morning brief accurately reflect what's actually pending? Staleness check: any "todo" tasks older than 48 hours that weren't in a recent brief? |
| Pace model accuracy | Are estimates getting closer to actuals over time? Track estimated vs actual in `pace-model.md`. Flag when variance is consistently high for a task type. |
| Backlog zero | No task should sit in "backlog" status without a plan for when it gets picked up. Surface any task > 3 days in backlog with no deadline. |
| Weekly billing summary | Every Sunday: summary of hours per client (estimated) for the week. This is the foundation of future billing intelligence. |

**Cron Jobs:**

| Time | Job | Output | Model |
|---|---|---|---|
| 7:00 AM IST | Morning Ops Brief | `#shakti-ops` | sonnet |
| 4:30 PM IST | Afternoon Progress Check | `#shakti-ops` | sonnet |
| 9:30 PM IST | Evening Consolidation | `#shakti-ops` | sonnet |
| Sunday 10:00 AM IST | Weekly Digest + Retrospective | `#shakti-ops` | sonnet |

---

**Morning Ops Brief (7 AM) — what it does:**
1. `GET /query/tasks?status=todo` + `GET /query/tasks?status=in_progress` + `GET /query/tasks?status=blocked` from Convex
2. Check any tasks with deadlines in the next 48 hours
3. Load `pace-model.md` — get estimated hours per task type per client
4. Tally: how much work exists vs a realistic 6-hour working day
5. Present in `#shakti-ops`:
   - Deadlines or blockers first (if any)
   - Suggested priority order for the day
   - Time estimate per task (from pace model)
   - Total estimated hours vs available time
   - Close with: "Reply **go** to create calendar blocks, or tell me what to adjust."
6. **On Krishna's "go" (or similar confirmation):** Create Google Calendar events for each planned task in the suggested order, with time blocks matching estimated hours. Confirm in channel: "Calendar blocked. Have a good one."

---

**Afternoon Progress Check (4:30 PM) — what it does:**
1. `GET /query/tasks?status=in_progress` + `GET /query/tasks?status=todo` from Convex
2. Check if any open PRs exist (if GitHub integration is available) — or fall back to asking Krishna directly
3. Post a brief status ping in `#shakti-ops`:
   - What's still open vs what was planned this morning
   - Any tasks overdue or likely to slip
   - "What's the status? Reply with any updates or just 'on track'."
4. On Krishna's reply: update task statuses in Convex accordingly
5. If Krishna moves a task to `done` via the Kanban instead of replying: Shakti detects this on the next cron run automatically (Convex is the source of truth)

---

**Evening Consolidation (9:30 PM) — what it does:**
1. `GET /query/tasks?status=done` filtered to today's date (tasks completed today) from Convex
2. `GET /query/tasks?status=in_progress` — anything still running
3. Post in `#shakti-ops`:
   - What got done today
   - What's still open and why
   - "Anything to log that I missed? Reply: task name | actual hours | notes. Or just 'all good'."
4. On Krishna's reply: update `actualHours` and `paceNotes` on relevant tasks via Convex API
5. Update `pace-model.md` with new data points
6. Brief summary: "Logged. Pace model updated. See you at 7."

---

**Weekly Digest + Retrospective (Sunday 10 AM) — what it does:**
1. Pull all tasks completed in the past 7 days
2. Sum `actualHours` per `clientSlug`
3. Compare estimated vs actual for the week — per task type
4. Flag any task types where estimates were consistently off
5. Show upcoming tasks with deadlines in the next 7 days
6. Retrospective section: what went well this week, what got delayed, any pattern worth noting
7. Post to `#shakti-ops`

---

**Anytime DM Interaction — Shakti always listening:**

Krishna can message `#shakti-ops` at any time. Shakti responds to:
- "Add task: [title] for [client/project], [taskType], [priority]" → creates task in Convex + adds to Kanban
- "Mark [task name] done, [X] hours" → updates status and actualHours in Convex
- "What's left today?" → pulls current open tasks and gives a quick summary
- "Block [task name] — [reason]" → marks task as blocked in Convex
- "Move [task name] to backlog" → updates status

Shakti also monitors the Kanban — if Krishna moves a card directly in Launch Control, the Convex status updates in real time and Shakti picks it up on the next cron run without needing to be told separately.

---

### MEMORY.md — Initial Structure

Shakti's memory has two distinct components:

1. **`MEMORY.md`** — standard long-term memory, same pattern as Parthasarathi. Includes: facts about Krishna's work rhythms, accumulated client context, key decisions, operational notes.

2. **`pace-model.md`** — dedicated pace learning file. Structure:

```markdown
# Pace Model

Last updated: [date]

## By Task Type (All Clients)
| Task Type | Observed Count | Avg Actual Hours | Last 3 Actuals |
|-----------|---------------|-----------------|----------------|
| build     | 0             | TBD             | —              |
| review    | 0             | TBD             | —              |
| debug     | 0             | TBD             | —              |
| strategy  | 0             | TBD             | —              |
| client-comms | 0          | TBD             | —              |
| admin     | 0             | TBD             | —              |

## By Client (build tasks only — highest variability)
| Client | Observed Count | Avg Actual Hours |
|--------|---------------|-----------------|
| beacon-house | 0 | TBD |
| edutechplus | 0 | TBD |
| thelaunch-space | 0 | TBD |

## Observations
[Shakti adds notes here over time — patterns, anomalies, Krishna's working style notes]
```

This file gets updated every evening after Krishna's log response. After 30 days it becomes genuinely predictive.

---

### USER.md — Context for Shakti

Shakti needs her own version of USER.md focused on her scope. Key sections:
- Krishna's three work streams (clients, projects, active status)
- How Krishna communicates task completion (evening consolidation + Kanban moves + anytime DMs)
- Working hours (IST, available 6-8 hours on a typical day)
- Energy patterns (building is energizing; admin/maintenance drains)
- Constraints (marketing feels inauthentic; maintenance without new challenges drains)
- What Shakti does NOT do (does not touch agent configs, does not write content)

Parthasarathi can use the existing `USER.md` as a base but trim it to Shakti's scope.

---

### Workspace File Structure

Shakti's full workspace on VPS:

```
/home/node/openclaw/shakti/
├── SOUL.md               — persona, values, communication style
├── AGENTS.md             — KRAs, cron job definitions, anytime DM behaviour, memory protocol
├── MEMORY.md             — long-term memory (work rhythms, key decisions, operational notes)
├── pace-model.md         — dedicated pace learning file (estimated vs actual hours per task type)
├── USER.md               — Krishna context: work style, energy patterns, communication preferences
└── clients/
    ├── beacon-house.md   — full context for Beacon House
    ├── edutechplus.md    — full context for EduTechPlus
    └── thelaunch-space.md — full context for thelaunch.space
```

**Why separate files per client:** Each client will evolve independently and at different rates. Editing one client's file carries zero risk to the others. Shakti can load only the relevant file when responding to a specific task query, and loads all three for the morning brief. Adding a fourth client is just adding a new file.

**What each client file contains:**

Each `clients/<client-slug>.md` should include:

```markdown
# [Client Name] ([slug])

## About the Client
[What does this client's business do? Who are their customers? What problem are they solving?]

## Relationship
- Type: retainer | project | internal
- Start date / duration
- Scope summary (what is and isn't included)
- Communication channel: WhatsApp / Slack / calls

## Key People
- [Name] — [role, what decisions they make, communication style]

## Active Projects

### [Project Name] ([slug])
- Goal: [What is this project trying to achieve?]
- Status: [Current state — in progress / blocked / waiting / complete]
- Blockers: [Any active blockers and why]
- Priority: [High / Medium / Low relative to other projects for this client]
- Notes: [Anything Shakti needs to know to plan this work accurately]

[Repeat for each project]

## Upcoming / Backlog Projects
[Projects discussed but not yet started]

## Priority Order (across projects)
[Which project takes precedence when multiple are active]
```

Shakti updates these files as projects change. Parthasarathi creates them with initial content (drafted by Claude Code) when setting up Shakti's workspace.

---

### Setup Checklist (Phase 2)

**Before sending prompt to Parthasarathi, confirm:**
- [ ] Phase 0 is live in production (Convex endpoints returning valid data)
- [ ] Slack channel `#shakti-ops` created by Krishna (or ask Parthasarathi to create it and share the channel ID)
- [ ] Google Calendar OAuth credential created and token stored on VPS (needed for morning brief calendar creation)
- [ ] Claude Code has drafted content for all three client files — ready to relay to Parthasarathi

**Parthasarathi executes on VPS:**
- [ ] Create `/home/node/openclaw/shakti/` workspace directory
- [ ] Create `SOUL.md` — based on persona design above
- [ ] Create `AGENTS.md` — KRAs, cron jobs, data access pattern, anytime DM interaction, memory protocol
- [ ] Create `MEMORY.md` — initial empty structure
- [ ] Create `pace-model.md` — initial empty table structure
- [ ] Create `USER.md` — Krishna context trimmed to Shakti's scope
- [ ] Create `clients/` subdirectory inside shakti workspace
- [ ] Create `clients/beacon-house.md` — full client context (drafted by Claude Code)
- [ ] Create `clients/edutechplus.md` — full client context (drafted by Claude Code)
- [ ] Create `clients/thelaunch-space.md` — full client context (drafted by Claude Code)
- [ ] Create 4 cron jobs: 7 AM Morning Brief, 4:30 PM Afternoon Check, 9:30 PM Evening Consolidation, Sunday 10 AM Weekly Digest
- [ ] Wire Convex API key: Shakti reads from `/home/node/openclaw/credentials/convex-api-key.txt` (same credential, already exists)
- [ ] Wire Google Calendar OAuth token for calendar event creation
- [ ] Test: manually trigger Morning Brief cron → confirm it posts to `#shakti-ops`
- [ ] Test: query `GET /query/tasks` from VPS → confirm it returns data
- [ ] Test: reply "go" to morning brief → confirm calendar events are created
- [ ] Parthasarathi posts all FILE CHANGE notifications (one per file created)

---

## Phase 3 — Shakti Learning Loop

**Track:** B (Parthasarathi + Slack)
**Prerequisite:** Phase 2 complete and Shakti running for at least 3-5 days.

### Goal
Shakti's crons are running. Krishna needs to build the habit of responding to the evening consolidation and using the Kanban to mark tasks done. A few targeted refinements once the basics are working:

1. **Billing intelligence trigger** — After 4+ weeks of `actualHours` data, add a monthly digest (first of each month): hours per client, effective rate per hour (if retainer cost is known), which client is highest value per hour. This is a new cron and an AGENTS.md update for Shakti — can be designed and sent to Parthasarathi when ready.

2. **Pace model validation** — After 30 days, review `pace-model.md` together. Are the estimates actually matching actuals? If a category is consistently off (e.g., `debug` is always 3x the estimate), adjust the default multiplier in Shakti's AGENTS.md.

3. **GitHub PR cross-reference** — The 4:30 PM check currently falls back to asking Krishna about status. Once a GitHub token is available on VPS, Shakti can check open PRs directly and surface them without prompting Krishna. Future spike — do not block Phase 3.

---

## Phase 4 — Parthasarathi AGENTS.md Trim

**Track:** B (Parthasarathi + Slack)
**Prerequisite:** Phase 0 complete. Can run in parallel with or after Phase 2 — not a blocker for Shakti.
**Why it's still worth doing:** Parthasarathi is at ~68-70% load. Once Shakti is running and adding coordination overhead, trimming his docs reduces that load and keeps him sharp. Do this when Parthasarathi has a quiet window — not before Shakti is stable.

### Goal
Move detailed reference sections out of Parthasarathi's AGENTS.md into dedicated docs he loads only when executing those specific tasks. Reduce AGENTS.md from ~440 lines to ~250-280 lines without losing any capability.

### The Document Referencing Pattern

This pattern already exists in Parthasarathi's docs (the Specialist Workflows section already references external files). This phase applies it more aggressively.

**How it works in practice:**
```
# In AGENTS.md (stays):
## 7 PM Due Diligence
Before starting, read: /home/node/openclaw/docs/7pm-due-diligence-protocol.md
Then execute the protocol exactly as documented there.

# In /home/node/openclaw/docs/7pm-due-diligence-protocol.md (new file):
## 7 PM Due Diligence Protocol
[All the detailed steps that used to be inline in AGENTS.md]
```

**Critical rule for Parthasarathi when implementing this:**
Create the reference file FIRST. Only remove the section from AGENTS.md AFTER confirming the reference file exists and reads correctly. Never leave AGENTS.md pointing to a file that doesn't exist.

### Sections to Move

**Move to `/home/node/openclaw/docs/7pm-due-diligence-protocol.md`:**
- The full reconciliation logic (brief file listing, push confirmation matching, retry logic)
- Health check verification table (8 AM, 10:30 AM, 1 PM, 7 PM specific checks)
- "Health Check Awareness" section (Vidura + enrichment monitoring specifics)

**Move to `/home/node/openclaw/docs/quality-gates.md`:**
- "Team Quality Reference" table (what good output looks like vs red flags for each agent)

**Move to `/home/node/openclaw/docs/convex-push-protocol.md`:**
- "Launch Control Data Push" section (when to push, what actions to push, the curl example)
- "Pushing Documents" section (when to push process docs, the node.js example script)

**Move to `/home/node/openclaw/docs/blog-pipeline.md`:**
- "Workflow Handoffs (Blog Pipeline)" diagram and column definitions

**What STAYS in AGENTS.md (always inline, frequently accessed):**
- Team overview table (agent names, models, channels, status) — quick reference
- Feedback-First Protocol — core operating principle, must always be visible
- How Agent Triggering Works — critical to avoid loops
- Communication Methods table — used constantly
- Proactive Behaviors list — operating principles
- Handling Requests routing table — used every DM conversation
- Memory rules — fundamental
- Safety and External vs Internal rules
- Heartbeat section

### What Gets ADDED to AGENTS.md

After trim, add a new section:

```markdown
## Shakti — PA Agent
- **Status:** ACTIVE
- **Channel:** #shakti-ops (C<channel-id-to-be-filled>)
- **Role:** Krishna's personal assistant — task management, daily planning, pace tracking, client billing intelligence
- **Workspace:** /home/node/openclaw/shakti/
- **Crons I manage:** Morning Ops Brief (7 AM), Afternoon Check (4:30 PM), Evening Consolidation (9:30 PM), Weekly Digest (Sunday 10 AM)
- **What Shakti does NOT do:** Content, SEO, blogs, agent health. Those stay with their respective agents.
- **My relationship to Shakti:** I create and manage her crons and config. I am the Agent Lead for the full team including the PA.
```

### What Krishna Sends to Parthasarathi

A single prompt covering:
1. Create these 4 reference files (with content that Claude Code drafts)
2. Update AGENTS.md to remove those sections and add references + Shakti entry
3. Confirm by posting all FILE CHANGE notifications to DM

### Deployment Checklist (Phase 4)
- [ ] Claude Code drafts the 4 reference file contents in a follow-up session
- [ ] Krishna reviews the drafts
- [ ] Krishna sends setup prompt to Parthasarathi via Slack DM
- [ ] Parthasarathi creates reference docs on VPS
- [ ] Parthasarathi updates AGENTS.md (references + new Shakti section)
- [ ] Parthasarathi confirms via FILE CHANGE notifications (5 notifications: 4 new files + AGENTS.md update)
- [ ] Parthasarathi pushes to GitHub at 10 PM
- [ ] Krishna pulls to local mirror to verify

---

## Clash Prevention Notes

These are the specific things that could go wrong if phases are executed out of order or partially.

| Risk | Mitigation |
|---|---|
| Shakti's morning brief runs before Convex `/query/tasks` endpoint is live in production | Phase 0 must be fully deployed to production AND verified before Phase 3 begins |
| Parthasarathi's AGENTS.md references a file that doesn't exist on VPS | Parthasarathi creates reference file FIRST, then removes section from AGENTS.md in same session |
| New `tasks` Kanban cards appear in WorkBoard before `updateArtifactStatus` handles "task" type | Update `workboard.ts` and schema in one atomic commit (Phase 0 handles this) |
| Shakti uses `/push/tasks` but the field names differ from what the schema expects | The field names in this document are canonical — the schema, HTTP handler, and Shakti's AGENTS.md must all use exactly the same names |
| `manualTasks` and `tasks` both appear in WorkBoard causing visual confusion | Keep their source badge colors distinct (suggested: `manualTasks` = gray, `tasks` = orange). Future migration is separate work. |
| Parthasarathi is overloaded after adding Shakti coordination to his responsibilities | Phase 4 trim is available when needed — not urgent. Check Parthasarathi's cron schedule for errors after Shakti is live. |
| 7 AM morning brief tries to create calendar events but OAuth token isn't set up | Google Calendar credential must be confirmed BEFORE Phase 3 begins. Checklist enforces this. |

---

## Open Questions (Flagged — Not Blocking Phase 0)

These are things to confirm before Phase 2 (Shakti setup) starts:

1. **Google Calendar access** — Shakti needs write access to create calendar blocks after the morning brief. This requires creating a Google OAuth credential and storing the token on VPS (similar to the existing Google Service Account). Confirm before Phase 2 begins.

2. **Afternoon check — PR integration or question?** — The 4:30 PM check can either pull open PRs from GitHub (needs a GitHub token on VPS) or simply ask Krishna directly. The question approach works fine for V1. GitHub integration can be added in Phase 3.

---

## What to Do Next (Action Order)

1. **Phase 0 — Start now.** Open a new Claude Code session in `thelaunchspace/`. Tag this document and the existing `convex/schema.ts` as context. Phase 0 and Phase 1 can happen in the same session — all Mac-side Convex + UI work.

2. **Draft Shakti's client files.** In a follow-up session in `openclaw-config-global/`, draft the content for `clients/beacon-house.md`, `clients/edutechplus.md`, and `clients/thelaunch-space.md`. These need to be ready before sending the Phase 2 setup prompt to Parthasarathi.

3. **Set up Google Calendar OAuth credential** on VPS before Phase 2 begins. Confirm with Parthasarathi that the token is stored and accessible.

4. **Send Phase 2 prompt to Parthasarathi via Slack DM.** Include all file contents: SOUL.md, AGENTS.md, MEMORY.md, pace-model.md, USER.md, and the three client files. Wait for FILE CHANGE notifications confirming each file is created.

5. **Phase 3** happens naturally — no separate session needed. Shakti runs, pace model accumulates, billing intelligence can be added when ready.

6. **Phase 4 (Parthasarathi trim)** — do this whenever Parthasarathi has a quiet window and it feels right. Not urgent.

---

*This document lives in `openclaw-config-global/new-agent-brainstorm/`. When implementation begins, move it to `_done/` after each phase completes.*
