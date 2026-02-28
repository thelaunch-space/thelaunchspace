# Launch Control — Product Requirements Document

Status: LIVE IN PRODUCTION
Created: 2026-02-14
Last updated: 2026-02-28 (13 tables: clients + projects + tasks added for Shakti, 9 new HTTP endpoints)
URL: `thelaunch.space/launch-control`

---

## 1. The Name & URL

**Name:** Launch Control
**URL:** `thelaunch.space/launch-control`

Why Launch Control:
- "Launch" ties to the brand (thelaunch.space)
- Globally understood — NASA/space metaphor, no cultural barrier
- Not saturated — "Mission Control" is taken by 5+ products, "Launch Control" is open
- Sells well — "I built Launch Control for my AI team. I can build one for yours."

---

## 2. Problem & Objective

### Problem
1. **Visibility gap:** Agents produce output on VPS. Krishna can't easily review it — no clear URL, no click-to-review workflow.
2. **Proof gap:** The 30-day challenge posts say "my AI employees did X." No way for the audience to verify it. Every post is "trust me."
3. **Scaling gap:** Google Sheets works now but won't scale as agent output grows.

### Objective
Build a **live, public-facing dashboard** showing Krishna's AI agents working in real-time. Dual purpose:
- **For Krishna:** Review agent output easily (briefs, questions, blog status) without SSH-ing into VPS
- **For the audience:** "Don't believe me? Watch them work." A live link that proves the AI employee system is real
- **For selling the service:** When a potential client asks "can you really do this?" — send them Launch Control. The demo IS the pitch.

### Strategic Value
- **Proof > claims.** A live dashboard is permanently self-updating proof.
- **Compounds over time.** 400 questions today → 1,000+ in a month.
- **Content multiplier.** Launch Control itself becomes the highest-value content piece.
- **Connects to `/hire-your-24x7-team` page.** Pitch page secondary CTA links here as proof.

---

## 3. Architecture

```
AGENT SIDE (VPS — Partha configures)
    Vibhishana → curl POST → Convex HTTP Action /ingestQuestions (batch)
    Vibhishana → curl POST → Convex HTTP Action /ingestBrief
    Vyasa      → curl POST → Convex HTTP Action /ingestBlog
    Vidura     → curl POST → Convex HTTP Action /ingestTopicCluster
    Vidura     → curl POST → Convex HTTP Action /ingestToolOpportunity
    All agents → curl POST → Convex HTTP Action /ingestActivity

    Auth: Bearer token (shared secret stored on VPS + Convex env var)
    Dual-write: agents keep posting to Slack + Sheets as before

CONVEX BACKEND
    HTTP Actions (convex/http.ts) → validate shared secret → internalMutation → writes to DB
    Database tables: questions, briefs, blogs, agentActivity, topicClusters, toolOpportunities, pitchBookings, documents
    Public queries (no auth): list questions, briefs metadata, blogs, agent status
    Admin queries (auth required): full brief content, activity log, scanner analysis

FRONTEND (thelaunch.space/launch-control)
    Public view (no login): Agent status, scoreboard, daily timeline, preview tabs with blur + waitlist CTA
    Krishna view (logged in): Full data access, sortable tables, brief reader modal, SEO metadata
```

### Data Flow (Real-Time)
```
Agent does work on VPS → curl POST to Convex HTTP Action → validates secret → internalMutation
→ Data written to Convex DB → WebSocket pushes to all subscribed frontends → instant UI update
```

---

## 4. Convex Schema (as deployed — 13 tables)

**Production deployment:** `curious-iguana-738`
**HTTP base URL:** `https://curious-iguana-738.convex.site`
**All POST endpoints require:** `Authorization: Bearer <AGENT_API_KEY>`

### Table 1: `questions` (Vibhishana's Reddit scans — 15 fields)

| Field | Type | Required | Source |
|-------|------|----------|--------|
| `title` | string | yes | Reddit post title |
| `subreddit` | string | yes | e.g., "r/smallbusiness" |
| `url` | string | yes | Reddit thread URL |
| `questionPain` | string | yes | Pain point extracted by scanner |
| `icpRelevance` | string | yes | "HIGH" / "MEDIUM" / "LOW" |
| `launchSpaceAngle` | string | yes | How thelaunch.space addresses this |
| `contentPotential` | string | yes | "Strong blog candidate" / "Blog candidate" / "Watch" |
| `engagement` | string | yes | e.g., "15 upvotes, 23 comments" |
| `notes` | string | optional | Scanner notes |
| `postDate` | string | optional | When Reddit post was made |
| `scannedAt` | string | yes | When Vibhishana scanned it |
| `status` | string | yes | "new" / "brief_created" / "skipped" |
| `briefCreated` | boolean | optional | Was a brief created from this? |
| `agentName` | string | yes | Always "Vibhishana" |
| `batchId` | string | optional | Groups questions from same scan |

Indexes: `by_scannedAt`, `by_agentName`, `by_status`, `by_url`

### Table 2: `briefs` (Vibhishana's research briefs — 20 fields)

| Field | Type | Required | Source |
|-------|------|----------|--------|
| `title` | string | yes | Brief title (blog-queue col A) |
| `slug` | string | yes | URL slug (blog-queue col B) |
| `primaryKeyword` | string | yes | Target SEO keyword (col C) |
| `longTailKeywords` | string[] | optional | Supporting keywords (col D) |
| `finalKeywords` | string[] | optional | Final keyword list (col L) |
| `icpProblem` | string | optional | ICP pain point (col F) |
| `competitiveGap` | string | optional | What's missing in top results (col G) |
| `launchSpaceAngle` | string | optional | Our unique angle (col H) |
| `suggestedStructure` | string | optional | H2/H3 outline (col I) |
| `researchNotes` | string | optional | Research context (col J) |
| `rankingNotes` | string | optional | Post-publish ranking notes (col N) |
| `contentMarkdown` | string | optional | Full brief as markdown (~500 lines, ~17KB) |
| `sourceQuestionId` | string | optional | Link back to questions table |
| `sourceUrls` | string[] | optional | Reddit thread URLs used |
| `blogUrl` | string | optional | Published blog URL (col M) |
| `category` | string | optional | e.g., "Founder-Phase", "Operations" |
| `status` | string | yes | "pending_review" / "approved" / "needs_revision" / "brief_ready" / "writing" / "published" / "dropped" |
| `createdAt` | string | yes | When brief was created |
| `updatedAt` | string | optional | Last modification |
| `krishnaFeedback` | string | optional | Feedback from Kanban dropdown. Vibhishana reads at cron start. |
| `revisionHistory` | object[] | optional | Snapshots of previous versions on minor in-place revisions. Each entry: `{version, title, primaryKeyword, suggestedStructure?, feedback, revisedAt}`. |
| `agentName` | string | yes | Always "Vibhishana" |

Indexes: `by_status`, `by_agentName`, `by_createdAt`, `by_category`

### Table 3: `blogs` (Vyasa's output — 10 fields + enrichment)

| Field | Type | Required |
|-------|------|----------|
| `title` | string | yes |
| `slug` | string | yes |
| `url` | string | optional |
| `keyword` | string | yes |
| `status` | string | yes | "writing" / "pr_created" / "published" / "dropped" |
| `agentName` | string | yes | Always "Vyasa" |
| `wordCount` | number | yes |
| `publishedAt` | string | optional |
| `createdAt` | string | yes |
| `briefId` | string | optional |
| `enrichmentCount` | number | optional |
| `lastEnrichmentDate` | string | optional |
| `enrichmentLog` | string | optional |

Indexes: `by_status`, `by_agentName`, `by_createdAt`, `by_slug`

### Table 4: `agentActivity` (All agents — milestones only)

| Field | Type | Required |
|-------|------|----------|
| `agentName` | string | yes | "Parthasarathi" / "Vibhishana" / "Vyasa" / "Vidura" |
| `action` | string | yes | "health_check" / "scan_complete" / "brief_created" / "blog_published" / "document_created" |
| `status` | string | yes | "active" / "completed" / "error" |
| `message` | string | yes | One-line description |
| `timestamp` | string | yes | ISO timestamp |
| `metadata` | any | optional |
| `dedupKey` | string | optional | Idempotent insert key — prevents duplicate activity entries |

Indexes: `by_agentName`, `by_timestamp`, `by_agentName_timestamp`, `by_dedupKey`

### Table 5: `topicClusters` (Vidura's SEO content planning)

| Field | Type | Required |
|-------|------|----------|
| `pillarName` | string | yes |
| `clusterTopic` | string | yes |
| `status` | string | yes | "planned" / "brief-ready" / "published" |
| `blogUrl` | string | optional |
| `targetKeyword` | string | yes |
| `intentType` | string | yes | "informational" / "comparison" / "decision" |
| `agentName` | string | yes | Always "Vidura" |
| `createdAt` | string | yes |
| `updatedAt` | string | optional |

### Table 6: `toolOpportunities` (Vidura's interactive tool proposals)

| Field | Type | Required |
|-------|------|----------|
| `sourceQuestion` | string | yes |
| `whyTool` | string | yes |
| `toolName` | string | yes |
| `toolSolution` | string | yes |
| `targetKeyword` | string | yes |
| `complexity` | string | yes | "simple" / "medium" |
| `status` | string | yes | "proposed" / "approved" / "rejected" / "built" / "live" |
| `krishnaNotes` | string | optional |
| `agentName` | string | yes | Always "Vidura" |
| `createdAt` | string | yes |

### Table 7: `pitchBookings` (Pitch page meeting form)

| Field | Type | Required |
|-------|------|----------|
| `companyName` | string | yes |
| `websiteUrl` | string | yes |
| `email` | string | yes |
| `contentChallenge` | string | optional |
| `whatsappNumber` | string | optional |
| `whatsappCountryCode` | string | optional |
| `whatsappConsent` | boolean | yes |
| `selectedDate` | string | yes |
| `selectedTimeIST` | string | yes |
| `isCustomTime` | boolean | yes |
| `source` | string | yes | "pitch-page" |
| `createdAt` | string | yes |
| `status` | string | yes | "new" / "contacted" / "scheduled" / "completed" |

### Table 8: `documents` (Agent research/strategy docs — 10 fields)

| Field | Type | Required |
|-------|------|----------|
| `title` | string | yes |
| `slug` | string | yes | Unique identifier for dedup |
| `content` | string | yes | Full markdown content |
| `summary` | string | optional | Short description |
| `category` | string | yes | "research" / "strategy" / "brief" / "process" / "analysis" |
| `tags` | string[] | optional | Flexible tagging |
| `agentName` | string | yes | Who created it |
| `filePath` | string | optional | VPS path for reference |
| `createdAt` | string | yes |
| `updatedAt` | string | optional |

Indexes: `by_slug`, `by_agentName`, `by_category`, `by_createdAt`

### Table 9: `linkedinPosts` (Valmiki's LinkedIn drafts — LIVE as of 2026-02-26)

| Field | Type | Required |
|-------|------|----------|
| `insightName` | string | yes | Dedup key with `sourceBlogSlug` |
| `draftText` | string | yes | Full post draft |
| `sourceBlogSlug` | string | yes | Source blog |
| `sourceBlogTitle` | string | optional | |
| `insightNumber` | number | yes | Which insight from this blog (1,2,3…) |
| `source` | string | yes | "blog" / "krishna-insight" |
| `icpPass` | boolean | yes | Passed ICP filter? |
| `icpFailReason` | string | optional | |
| `hookStrategy` | string | optional | "loss-aversion" / "curiosity" / "authority" / "story" / "social-proof" |
| `ctaType` | string | optional | "value-exchange" / "question" / "resource" / "follow" |
| `krishnaFeedback` | string | optional | Krishna's review feedback (stored from Kanban). Agents read this on cron start. DO NOT pass null to clear — omit the field. It clears visually from Kanban once status leaves "blocked". |
| `postedDate` | string | optional | |
| `linkedinUrl` | string | optional | |
| `status` | string | yes | "draft_ready" / "needs_revision" / "approved" / "posted" / "skipped" |
| `agentName` | string | yes | Always "Valmiki" |
| `createdAt` | string | yes | |
| `updatedAt` | string | optional | |

Indexes: `by_status`, `by_sourceBlogSlug`, `by_createdAt`

### Table 10: `manualTasks` (Krishna-created tasks — LIVE as of 2026-02-26)

| Field | Type | Required |
|-------|------|----------|
| `title` | string | yes | |
| `description` | string | optional | |
| `status` | string | yes | "todo" / "in_progress" / "blocked" / "done" |
| `assignee` | string | optional | "Krishna" or agent name |
| `createdAt` | string | yes | |
| `updatedAt` | string | yes | |

Indexes: `by_status`, `by_createdAt`

### Table 11: `clients` (Shakti's client registry — LIVE as of 2026-02-28)

| Field | Type | Required |
|-------|------|----------|
| `name` | string | yes | "Beacon House", "EduTechPlus", "thelaunch.space" |
| `slug` | string | yes | "beacon-house", "edutechplus", "thelaunch-space" |
| `type` | string | yes | "retainer" / "project" / "internal" |
| `status` | string | yes | "active" / "paused" / "completed" |
| `notes` | string | optional | Brief context |
| `createdAt` | string | yes | |

Indexes: `by_slug`, `by_status`

### Table 12: `projects` (Shakti's project registry — LIVE as of 2026-02-28)

| Field | Type | Required |
|-------|------|----------|
| `clientSlug` | string | yes | References clients.slug (denormalized) |
| `name` | string | yes | "WhatsApp Automation", "Fractions V5" |
| `slug` | string | yes | "whatsapp-automation", "fractions-v5" |
| `type` | string | yes | "feature" / "maintenance" / "internal" / "retainer" |
| `status` | string | yes | "active" / "on-hold" / "completed" |
| `notes` | string | optional | |
| `createdAt` | string | yes | |

Indexes: `by_clientSlug`, `by_slug`, `by_status`

### Table 13: `tasks` (Shakti's task backlog — LIVE as of 2026-02-28)

| Field | Type | Required |
|-------|------|----------|
| `clientSlug` | string | yes | Denormalized for filtering |
| `projectSlug` | string | yes | References projects.slug |
| `title` | string | yes | |
| `description` | string | optional | |
| `taskType` | string | yes | "build" / "review" / "debug" / "strategy" / "client-comms" / "admin" |
| `status` | string | yes | "backlog" / "todo" / "in_progress" / "blocked" / "done" |
| `priority` | number | optional | 1=high, 2=medium, 3=low |
| `estimatedHours` | number | optional | Shakti's prediction |
| `actualHours` | number | optional | Ground truth (logged at completion) |
| `deadline` | string | optional | ISO date string |
| `paceNotes` | string | optional | Shakti's learning notes on this task |
| `createdAt` | string | yes | |
| `updatedAt` | string | yes | |
| `createdBy` | string | yes | "Krishna" / "Shakti" |

Indexes: `by_clientSlug`, `by_projectSlug`, `by_status`, `by_taskType`, `by_deadline`, `by_createdAt`

WorkBoard integration: `tasks` appear as `type: "task"` cards in the Work Mode Kanban alongside `manualTasks`. Same 5 columns. Orange/amber source badge to distinguish from manual tasks.

---

## 5. HTTP Endpoints (canonical + legacy aliases)

**Canonical paths** (agents should use these):

| Endpoint | Method | Agent | Notes |
|----------|--------|-------|-------|
| `/push/questions` | POST | Vibhishana | Upsert by URL |
| `/push/briefs` | POST | Vibhishana | Upsert by slug |
| `/push/blogs` | POST | Vyasa | Upsert by slug |
| `/push/activity` | POST | All agents | Dedup by dedupKey |
| `/push/topic-clusters` | POST | Vidura | Upsert by pillarName+clusterTopic |
| `/push/tool-opportunities` | POST | Vidura | Upsert by toolName |
| `/push/documents` | POST | Any agent | Upsert by slug |
| `/push/linkedin-posts` | POST | Valmiki | Upsert by insightName+sourceBlogSlug. **Do NOT pass `krishnaFeedback: null`** — omit the field entirely. |
| `/push/clients` | POST | Shakti | Upsert by slug |
| `/push/projects` | POST | Shakti | Upsert by slug |
| `/push/tasks` | POST | Shakti | Upsert by clientSlug+projectSlug+title |
| `/update/brief-status` | POST | Any | Update brief status by slug |
| `/update/blog-enrichment` | POST | Vyasa | Update enrichment metadata by slug |
| `/update/task-status` | POST | Shakti | Update status, actualHours, paceNotes by task ID or title+projectSlug |

**GET query endpoints** (agents read from these):

| Endpoint | Method | Caller | Notes |
|----------|--------|--------|-------|
| `/query/briefs?status=brief_ready` | GET | Vyasa | Full brief objects |
| `/query/briefs?status=pending_review` | GET | Vibhishana | Count + slugs + titles |
| `/query/briefs?status=needs_revision` | GET | Vibhishana | Full brief objects including `krishnaFeedback` |
| `/query/topic-clusters` | GET | Vidura | All clusters all statuses |
| `/query/tool-opportunities` | GET | Vidura | All tools all statuses |
| `/query/linkedin-posts` | GET | Valmiki | All posts — filter client-side for needs_revision + krishnaFeedback |
| `/query/clients` | GET | Shakti | All clients |
| `/query/projects?clientSlug=<optional>` | GET | Shakti | Projects, optionally filtered by clientSlug |
| `/query/tasks?status=&clientSlug=&projectSlug=` | GET | Shakti | Tasks with flexible filtering (all params optional) |

All require `Authorization: Bearer <AGENT_API_KEY>`. Legacy alias paths (`/ingestBrief`, `/upsertBrief`, etc.) remain permanently active. See `CONVEX-API-REFERENCE.md` for full alias list.

### Query Functions

**Public (no auth):** `questions.listRecent`, `briefs.listMetadata`, `briefs.getPublicBrief`, `blogs.listRecent`, `agentActivity.agentStatuses`, `agentActivity.recentFeed`, `agentActivity.weeklyStats`, `agentActivity.allTimeStats`, `agentActivity.agentTodayActivity`, `agentActivity.agentWeeklySummary`

**Admin (auth required):** `questions.listFullDetails`, `questions.communityBreakdown`, `briefs.getFullBrief`, `briefs.listFull`, `agentActivity.fullLog`, `documents.listMetadata`, `documents.getDocument`

---

## 6. Auth

- **Provider:** Clerk (ClerkProvider wraps ConvexProviderWithClerk)
- **Middleware:** `middleware.ts` — geo cookie only (sets `geo_region=IN/INTL` from `x-country` header). **NO Clerk middleware** — it was removed on 2026-02-25 (crashes Netlify edge functions). Clerk works entirely client-side via `ClerkProvider`.
- **Admin queries:** Check `ctx.auth.getUserIdentity()` — throw if not authenticated
- **Admin login:** `/admin` page has Clerk `<SignIn>` component. Redirects to `/launch-control` after sign-in. Secret URL — no link on the site.
- **IMPORTANT:** Never add `clerkMiddleware()` to `middleware.ts` — it breaks Netlify edge functions.

---

## 7. What's Public vs. Private

| Data | Public? | Notes |
|------|---------|-------|
| Agent statuses (active/sleeping) | Yes | Public query |
| Activity feed | Yes | Public query |
| Scoreboard stats | Yes | Weekly + all-time counts |
| Question titles + subreddits + URLs | Yes — 20 recent | Via QuestionsPreview. No blur. Titles link to Reddit. |
| Scanner analysis (pain, angles, ICP relevance) | Admin only | Requires Clerk auth — extra columns in QuestionsTable |
| Brief metadata + full content (rendered markdown) | Yes — 20 briefs | All clickable, reader modal opens full brief. Admin gets SEO metadata sidebar. |
| Full brief list | Yes — 20 items | BriefsPreview. Admin: BriefsPanel with sortable full list. |
| Blog titles + URLs | Yes — 100 items | BlogsPreview. Admin: BlogsTable with enrichment data. |
| Communities (subreddits monitored) | Yes | Real subreddit data via public `communityBreakdown` query. "Why It Was Picked" reasoning. |
| Strategy (topic clusters + tool opportunities) | Yes — 20 clusters + 10 tools | StrategyPreview. Admin: StrategyPanel with full data. |
| Documents (agent research reports) | Admin only | DocumentsPanel only visible when signed in |
| Meetings (pitch bookings) | Admin only | MeetingsPanel only visible when signed in |
| Sort/filter on tables | Admin only | Public views have fixed sort by date |

---

## 8. Error Handling & Batching

**Error handling:** If a curl to Convex fails, the agent logs to Slack and moves on. Does NOT block main workflow, does NOT retry.

**Batching:** Vibhishana's morning scan finds 50-100 questions at once. HTTP Action accepts an **array** — one curl call, one mutation, all rows inserted.

**API key storage on VPS:** `/home/node/openclaw/credentials/convex-api-key.txt`

---

## 9. Agent Skills (deployed on VPS)

| File | Agent(s) | Pushes to |
|------|----------|-----------|
| `convex-push-scanner.SKILL.md` | Vibhishana | `/ingestQuestions` (batch) + `/ingestBrief` |
| `convex-push-blog.SKILL.md` | Vyasa | `/ingestBlog` |
| `convex-push-activity.SKILL.md` | All agents | `/ingestActivity` |
| `convex-push-strategy.SKILL.md` | Vidura | `/ingestTopicCluster` + `/ingestToolOpportunity` |

Key details:
- API key read from `/home/node/openclaw/credentials/convex-api-key.txt`
- Brief markdown escaped with Node.js `JSON.stringify(fs.readFileSync(...))` (jq not on VPS)
- Questions sent as batch array (one curl for 50-100 questions)
- Activity milestones only (~10-15 entries/day)

---

## 10. Decisions Log

| Question | Decision |
|----------|----------|
| Name | Launch Control |
| URL | `thelaunch.space/launch-control` |
| Frontend location | New route on thelaunch.space (not a separate app) |
| Backend | Convex project (production: `curious-iguana-738`) |
| How agents push data | Shell/exec with curl → Convex HTTP Actions |
| Public access | Fully open read-only (no login needed to view) |
| Krishna access | Clerk auth unlocks admin features |
| Migration strategy | Dual-write (keep Slack + Sheets, add Convex) |
| MVP scope | Read-only dashboard. No signals back to agents. |
| Brief content in Convex | Store full markdown content. Frontend renders as HTML. |
| Layout | 3-column: agents sidebar (left), main content (center), live feed (right) |
| Center content (public) | Scoreboard + daily timeline + preview tabs with blur |
| Center content (admin) | 7 tabs: Overview / Blogs / Communities / Questions / Briefs / Strategy / Meetings. Documents tab planned. |
| Agent sidebar click | Expanded panel with avatar, status, today's work, weekly stats |
| Brief reader | Near-fullscreen modal with rendered markdown + SEO metadata sidebar |
| Table scrolling | Frozen header row + frozen left column + horizontal/vertical scroll |
| Scoreboard toggle | "This Week" / "All Time" switch |
| Cost framing | Show both human hours + dollar savings, geo-detected currency (INR/USD) |
| Admin login | Clerk icon hidden behind waitlist email gate |
| Mobile | Single column, agents as horizontal avatar strip, tables become card layout |
| Data freshness | WebSocket only (Convex subscriptions, no polling) |
| FTUE guided tour | Spotlight tour for first-time non-admin visitors (5 desktop / 4 mobile steps) |
| Launch Control navigation | Removed from navbar. Only via pitch page secondary CTA or direct URL. |
| Tab component loading | All tab panels use `next/dynamic` for lazy loading |
| Public preview security | CSS blur is visual only, but backend queries limit to 6 items max |
| Brief revision protocol | Two-path: MINOR (same topic/ICP) = Vibhishana updates in place, same slug, appends `revisionHistory`, status → `pending_review`. MAJOR (new topic/keyword) = old brief → `dropped`, new brief created with new slug. Vibhishana decides which path. |

---

## 11. Build Progress

**All steps DONE (shipped Feb 15-18, 2026):**

- [x] Convex backend — 13 tables, canonical /push/* + /update/* + /query/* HTTP routes + legacy aliases, Clerk auth, 20+ indexes
- [x] Agent skills — 4 SKILL.md files deployed on VPS, test pushes confirmed
- [x] Frontend dashboard — 33+ components, 3-column layout, 8 tabs (6 public + 2 admin-only)
- [x] All tabs open — no blur, full data for public visitors on all 6 non-admin tabs (as of 2026-02-25)
- [x] Admin view — full brief reader, sortable tables, SEO metadata
- [x] Mobile QA — 12 files fixed for responsive layout
- [x] FTUE spotlight tour — GuidedTour.tsx
- [x] Geo-detected cost savings — INR/USD via middleware cookie
- [x] Production deployment — Clerk prod, Convex prod, Netlify env vars, VPS skills updated
- [x] Historical data backfill — 605 records in production

**Production data:** 554 questions, 14 briefs, 7 blogs, 30 activity entries (as of Feb 15 backfill).

---

## 12. Phase 2 Progress

**SHIPPED after MVP:**
- [x] **Work Mode Kanban** (2026-02-26) — WorkBoard, WorkBoardColumn, WorkBoardCard, WorkBoardArchive, AddManualTaskForm. 5 columns (To Do/In Progress/Blocked/Done/Archive) + collapsible archive by week. Owner tags (Krishna = orange "K"; agents = colored pills). Health bar per card (green→yellow→orange→red over 14 days). Header stats live from Convex. Work mode toggle in HeaderBar. Full spec at `.context/ideation/work-mode-kanban-spec.md`.
- [x] **Kanban feedback loop** (2026-02-26) — Status dropdown (Approve/Needs Revision/Drop/Publish/Skip) + confirm step + optional feedback textarea. `krishnaFeedback` stored in briefs + linkedinPosts. Blocked cards show Slack reminder.
- [x] **Valmiki LinkedIn post pipeline** (2026-02-26) — `linkedinPosts` + `manualTasks` Convex tables. Valmiki pushes drafts via `/push/linkedin-posts`. Full spec at `.context/ideation/valmiki-linkedin-pipeline-lc-spec.md`.
- [x] **Brief revision protocol** (2026-02-27) — Two-path: MINOR (same topic) = Vibhishana updates in place, appends `revisionHistory` snapshot. MAJOR (new topic) = old brief → dropped, new brief created.

**Still deferred:**
- Two-way agent communication (send instructions back to agents) beyond the existing feedback field
- Internal notes/comments on briefs
- Agent-level pages showing live data instead of static `/build-your-ai-team/[agent]` marketing copy
- Public metrics counters on the landing page
