# Agent Team Context — thelaunch.space

Last updated: 2026-03-01
Source of truth: `openclaw-config-global/my-openclaw-agent-setup-v2/` (READ-ONLY VPS mirror)

This doc captures the current agent team — what each agent does, what it pushes to Convex, and what that means for Launch Control. Load this file when working on Launch Control features, Kanban interactions, or anything agent-related.

---

## The Team at a Glance

| Agent | Status | Model | Role | Slack Channel |
|-------|--------|-------|------|---------------|
| **Parthasarathi** | ACTIVE | Opus 4.5 | Orchestrator | DM `D0AD3R8FC14` |
| **Vibhishana** | ACTIVE | Sonnet 4.5 | Reddit/community scanner → SEO briefs | #vibhishana-seo |
| **Vyasa** | ACTIVE | Opus 4.5 | Blog writer + citation enrichment | #vyasa-blogs |
| **Vidura** | ACTIVE | Sonnet 4.5 | SEO intelligence — clusters, tools, LLM citations | #vidura-seo-strategy `C0AFTEV7Q6Q` |
| **Valmiki** | ACTIVE | Sonnet 4.5 | LinkedIn extraction — mines blogs for posts | #valmiki-content `C0AD3SHGV2A` |
| **Shakti** | ACTIVE | Sonnet 4.5 | Personal assistant + daily planner | #shakti-ops `C0AHGSHF1FD` |
| **Sanjaya** | PAUSED | — | Lead scout | #sanjaya-scouting-leads |

---

## Agent Details + Convex Interactions

### Parthasarathi — Orchestrator

**What he does:**
- Manages cron jobs, health checks (8 AM / 1 PM / 3 PM IST)
- 7 PM daily due diligence: reconciles which briefs/blogs were created vs. pushed to Convex, retries any missed pushes
- Only agent who edits other agents' crons and workspace docs
- Pushes activity updates to Launch Control after health checks

**Convex pushes:**
- `/push/activity` — health check results, config changes, due diligence summaries
- Payload: `{ agentName: "Parthasarathi", action: "health_check" | "config_change" | "due_diligence", message, dedupKey, timestamp }`

---

### Vibhishana — SEO Research

**What she does:**
- **9 AM IST:** Scans Reddit + service business communities (pivot 2026-02-25: away from tech/SaaS, toward domain-expert service owners — healthcare, legal, finance, education)
- **11 AM + 2 PM + 5 PM:** Creates one SEO research brief per run (reduced to 1/day on 2026-02-19)
- **6 PM:** Evening report + Convex status sync
- **Monday 10 AM:** Weekly community discovery (3-5 new ICP communities)
- Runs **Feedback-First Protocol** at every cron: checks for `needs_revision` briefs before new work

**Brief revision flow (important for Kanban):**
- **MINOR revision** — same topic/ICP: updates in place, same slug, appends `revisionHistory` array, status → `pending_review`
- **MAJOR pivot** — new topic: marks old brief `dropped`, creates new brief with new slug

**Convex pushes:**
- `/push/questions` — batch upsert after every scan (dedup by URL)
- `/push/briefs` — one brief per run (upsert by slug, status: `pending_review`)
- `/push/activity` — after scan (`scan_complete`) and after each brief (`brief_created`)

**Reads from Convex:**
- `/query/briefs?status=needs_revision` — feedback items to process first
- `/query/briefs?status=pending_review` — queue depth check before adding more

**Brief status flow:**
```
pending_review → [krishna sets] needs_revision → [vibhishana revises] → pending_review
pending_review → [krishna approves] brief_ready → [vyasa picks up]
```

**Field note:** `revisionHistory` is an array of objects appended on MINOR revisions:
```json
{ "version": 1, "title": "...", "primaryKeyword": "...", "suggestedStructure": "...", "feedback": "...", "revisedAt": "ISO timestamp" }
```

---

### Vyasa — Blog Writer

**What she does:**
- **11 AM IST:** Writes one blog per day from Vibhishana's `brief_ready` briefs (reads from Convex, oldest-first)
- **3 PM + 5 PM + 8 PM IST:** Citation enrichment runs — adds stats, citations, FAQ sections to oldest un-enriched published blogs
- Uses **exact slug** from Vibhishana's brief (Valmiki depends on this URL downstream — slug changes break the LinkedIn pipeline)

**Blog push flow:**
1. When writing starts → push `status: "writing"`, `wordCount: 0`
2. After PR created → push `status: "pr_created"`, `wordCount: <actual>`, `url: "/blogs/topic/slug"`
3. After Krishna merges → Krishna updates to `status: "published"` in Kanban

**Convex pushes:**
- `/push/blogs` — twice per blog (writing start + PR created), upsert by slug
- `/update/blog-enrichment` — after each enrichment run (`enrichmentCount`, `lastEnrichmentDate`, `enrichmentLog`)
- `/push/activity` — after PR created (`blog_pr_created`)

**Reads from Convex:**
- `/query/briefs?status=brief_ready` — picks up approved briefs

**Blog status values:** `writing` → `pr_created` → `published` | `dropped`

---

### Vidura — SEO Intelligence

**What she does:**
- **Daily:** 9:30 AM morning briefing, 2:30 PM midday strategy, 7:30 PM evening review
- **Monday 10:30 AM:** Topic cluster mapping — full cluster audit, gap identification
- **Wednesday 10:30 AM:** Strategic topic generation — adds topics to blog-queue (same tab Vibhishana uses) with `source: "vidura"`
- **Friday 10:30 AM:** Tool opportunity scan — identifies Reddit questions better served as interactive tools
- Monitors LLM citations (ChatGPT/Perplexity) — spots if thelaunch.space appears for target queries

**Convex pushes:**
- `/push/topic-clusters` — Monday cluster mapping (upsert by `pillarName + clusterTopic`)
- `/push/tool-opportunities` — Friday tool scan (upsert by `toolName`)
- `/push/activity` — after cluster mapping and tool scans

**Topic cluster fields:** `pillarName`, `clusterTopic`, `status` (`planned` / `in_progress` / `complete`), `targetKeyword`, `intentType` (`informational` / `comparison` / `decision`)

**Tool opportunity fields:** `toolName`, `toolSolution`, `sourceQuestion`, `whyTool`, `targetKeyword`, `complexity` (`simple` / `medium`), `status` (`proposed` → krishna sets `approved` / `rejected`)

**Tool status flow:** `proposed` → `approved` | `rejected` → `building` → `built`

---

### Valmiki — LinkedIn Growth Engine

**What he does (2-phase post-brief workflow as of 2026-03-01):**

**Phase 1 — Post-Brief Extraction (7 PM IST daily)**
- Finds oldest Published blog not yet extracted, reads it
- Extracts 2-3 bookmark-worthy angles
- Creates one "post-brief" per angle with `insightText`, `rationale`, `hookOptions` (3-4), `ctaOptions` (3-4)
- Pushes with `status: "pending_review"` → lands in Kanban "To Do"
- Every insight gets a 2-5 word named label: "The 3-Flow Wall", "The $30K Agency Trap"

**Phase 2 — Full Draft Writing**
- After Krishna approves a post-brief (`status: "approved"`), Valmiki picks it up
- Reads the approved brief fields, writes full LinkedIn post
- Pushes back with `draftText` + `status: "draft_ready"` → returns to Kanban "To Do"

**Saturday 10 AM:** Weekly performance review (after Krishna shares metrics)

**Runs Feedback-First Protocol** at every cron: checks `needs_revision` posts before new extraction

**Content math:** 18+ published blogs = 54-90 potential posts = 11-22 weeks of content

**Convex pushes:**
- `/push/linkedin-posts` — upsert by `insightName + sourceBlogSlug`
  - **CRITICAL:** Never pass `krishnaFeedback: null` — omit the field entirely
  - Phase 2 push: include `draftText` + `status: "draft_ready"`, omit `krishnaFeedback`

**Reads from Convex:**
- `/query/linkedin-posts` — includes `insightText`, `rationale`, `hookOptions`, `ctaOptions`, `draftText`, `krishnaFeedback`
- Filters for `status === "approved"` (Phase 2 work) and `status === "needs_revision"` (revisions)

**LinkedIn post status values:** `pending_review` → `approved` | `needs_revision` | `dropped` → `draft_ready` → `posted` | `skipped`

**What Valmiki does NOT do:** Post directly to LinkedIn, mention source blog in posts, write X/Twitter posts

---

### Shakti — Personal Assistant + Daily Planner (new 2026-02-28)

**What she does:**
- **7 AM IST:** Morning Ops Brief — pulls todos/in-progress/blocked tasks, flags deadlines, presents day plan with hour estimates
- **4:30 PM IST:** Afternoon Progress Check — compares against morning plan
- **9:30 PM IST:** Evening Consolidation — logs actual hours, updates pace model
- **Sunday 10 AM:** Weekly Digest — hours by client, estimation accuracy, upcoming deadlines

**Work streams she tracks:**
| Client | Slug | Type |
|--------|------|------|
| Beacon House | `beacon-house` | retainer |
| EduTechPlus | `edutechplus` | retainer |
| thelaunch.space | `thelaunch-space` | internal |

**Data source:** Convex `clients`, `projects`, `tasks` tables — NOT Google Sheets

**Convex reads:**
- `/query/tasks?status=todo` — morning brief planning
- `/query/clients` — client registry
- `/query/projects?clientSlug=<slug>` — projects per client

**Convex writes:**
- `/push/tasks` — new tasks (upsert by `clientSlug + projectSlug + title`)
- `/update/task-status` — status, actualHours, paceNotes updates
- `/push/activity` — morning_plan_sent, task_created, task_completed, afternoon_check_sent, evening_consolidation_sent, weekly_digest_sent

**Task status values:** `backlog` → `todo` → `in_progress` → `blocked` → `done`
**Task types:** `build` / `review` / `debug` / `strategy` / `client-comms` / `admin`

**Rules:** Creates tasks ONLY when Krishna explicitly asks. Posts ONLY to #shakti-ops. Never creates tasks from documents without confirmation.

---

## The Blog Pipeline (end-to-end)

```
Vibhishana scans Reddit/communities (9 AM IST)
    → filters bookmark-worthy questions
    → pushes to /push/questions (dedup by URL)
    ↓
Vibhishana creates SEO brief (11 AM IST)
    → pushes to /push/briefs (status: pending_review)
    ↓
Krishna reviews in Launch Control Kanban (Work Mode)
    ↓ [needs revision]             ↓ [approves]
Vibhishana revises              status → brief_ready
    MINOR: same slug             ↓
    MAJOR: drop + new slug      Vyasa picks up brief (11 AM IST next day)
    status → pending_review         → pushes status: "writing"
                                    → writes blog post as page.tsx
                                    → creates GitHub PR
                                    → pushes status: "pr_created"
                                        ↓
                                    Krishna reviews + merges PR
                                        → status → "published"
                                            ↓
                                    Valmiki reads published blog (7 PM IST) [Phase 1]
                                        → extracts 2-3 bookmark-worthy angles
                                        → pushes post-briefs with insightText/rationale/hookOptions/ctaOptions
                                        → status: "pending_review" → lands in Kanban To Do
                                            ↓
                                    Krishna reviews post-briefs in Kanban
                                        → Approve → status: "approved"
                                        → Drop / Needs Revision
                                            ↓
                                    Valmiki picks up approved brief [Phase 2]
                                        → writes full LinkedIn post
                                        → pushes draftText + status: "draft_ready"
                                            ↓
                                    Krishna reviews draft → Mark Posted (8:30 AM)
```

---

## Feedback-First Protocol (applies to Vibhishana + Valmiki)

At the start of EVERY cron run, agents check for feedback items BEFORE doing any new work:

**Vibhishana:** `GET /query/briefs?status=needs_revision` → for each with non-null `krishnaFeedback`:
- MINOR → update in place (same slug), append to `revisionHistory`, push `status: pending_review`
- MAJOR → mark old brief `dropped`, create new brief with new slug

**Valmiki:** `GET /query/linkedin-posts` → check two cases:
1. `status === "needs_revision"` AND `krishnaFeedback` not null → revise → push `status: "draft_ready"` (NEVER include `krishnaFeedback: null`)
2. `status === "approved"` → write full draft → push `draftText` + `status: "draft_ready"`

**Why:** Krishna leaves feedback directly in the Launch Control Kanban. Agents pick it up on their next scheduled run. No Slack copy-pasting required.

---

## Daily Schedule Reference (IST)

| Time | Agent | Activity |
|------|-------|----------|
| 7:00 AM | Shakti | Morning Ops Brief |
| 9:00 AM | Vibhishana | Reddit scan + question push |
| 9:30 AM | Vidura | Morning SEO briefing |
| 10:30 AM (Mon) | Vidura | Topic cluster mapping |
| 10:30 AM (Wed) | Vidura | Strategic topic generation |
| 10:30 AM (Fri) | Vidura | Tool opportunity scan |
| 11:00 AM | Vibhishana | SEO Brief #1 |
| 11:00 AM | Vyasa | Daily blog write |
| 2:00 PM | Vibhishana | SEO Brief #2 |
| 2:30 PM | Vidura | Midday strategy |
| 3:00 PM | Vyasa | Citation enrichment #1 |
| 4:30 PM | Shakti | Afternoon Progress Check |
| 5:00 PM | Vibhishana | SEO Brief #3 |
| 5:00 PM | Vyasa | Citation enrichment #2 |
| 6:00 PM | Vibhishana | Evening report + status sync |
| 7:00 PM | Valmiki | LinkedIn extraction |
| 7:30 PM | Vidura | Evening SEO review |
| 8:00 PM | Vyasa | Citation enrichment #3 |
| 9:30 PM | Shakti | Evening Consolidation |
| 10:00 AM (Sat) | Valmiki | Weekly performance review |
| 10:00 AM (Sun) | Shakti | Weekly Digest |

---

## Convex Table → Agent Ownership

| Table | Owner | Purpose |
|-------|-------|---------|
| `questions` | Vibhishana | Reddit/community scans |
| `briefs` | Vibhishana | SEO research briefs (with revisionHistory + krishnaFeedback) |
| `blogs` | Vyasa | Blog metadata + enrichment tracking |
| `agentActivity` | All agents | Milestone activity log (dedup by dedupKey) |
| `topicClusters` | Vidura | SEO content pillar/cluster map |
| `toolOpportunities` | Vidura | Interactive tool proposals |
| `pitchBookings` | Frontend (pitch page form) | Lead capture from /your-ai-team |
| `documents` | Any agent | Research reports, strategy docs, process docs |
| `linkedinPosts` | Valmiki | LinkedIn post drafts (with krishnaFeedback) |
| `manualTasks` | Krishna (via LC Kanban) | Manual one-off tasks |
| `clients` | Shakti | Client registry (beacon-house, edutechplus, thelaunch-space) |
| `projects` | Shakti | Project registry (linked to clients) |
| `tasks` | Shakti | Task backlog with pace model |

---

## Key Rules (don't forget these)

1. **Slug consistency is sacred.** Valmiki extracts LinkedIn posts using the blog URL. If Vyasa changes Vibhishana's slug, Valmiki gets a 404 and the downstream pipeline breaks.

2. **Never pass `krishnaFeedback: null` to `/push/linkedin-posts`.** Convex's `v.optional(v.string())` rejects null. Omit the field entirely — the original feedback stays in Convex as audit trail.

3. **MINOR vs MAJOR brief revision.** MINOR = same slug (same topic/ICP). MAJOR = drop old brief + new slug (completely different topic). Vibhishana decides.

4. **Shakti only creates tasks on explicit request.** She never auto-creates tasks from documents or observations.

5. **Valmiki never mentions the source blog** in a LinkedIn post. Posts must be standalone.

6. **Parthasarathi triggers agents via one-shot crons**, not by posting to their Slack channels (bot messages don't trigger agents — only human messages and cron jobs do).
