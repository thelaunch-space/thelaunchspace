# Launch Control — Product Requirements Document

Status: LIVE IN PRODUCTION
Created: 2026-02-14
Last updated: 2026-02-19 (merged from live-dashboard-convex.md + launch-control-frontend-spec.md)
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
    Database tables: questions, briefs, blogs, agentActivity, topicClusters, toolOpportunities, pitchBookings
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

## 4. Convex Schema (as deployed — 7 tables)

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

Indexes: `by_scannedAt`, `by_agentName`, `by_status`

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
| `status` | string | yes | "pending_review" / "approved" / "needs_revision" / "brief_ready" / "writing" / "published" |
| `createdAt` | string | yes | When brief was created |
| `updatedAt` | string | optional | Last modification |
| `agentName` | string | yes | Always "Vibhishana" |

Indexes: `by_status`, `by_agentName`, `by_createdAt`, `by_category`

### Table 3: `blogs` (Vyasa's output — 10 fields + enrichment)

| Field | Type | Required |
|-------|------|----------|
| `title` | string | yes |
| `slug` | string | yes |
| `url` | string | optional |
| `keyword` | string | yes |
| `status` | string | yes | "writing" / "pr_created" / "published" |
| `agentName` | string | yes | Always "Vyasa" |
| `wordCount` | number | yes |
| `publishedAt` | string | optional |
| `createdAt` | string | yes |
| `briefId` | string | optional |
| `enrichmentCount` | number | optional |
| `lastEnrichmentDate` | string | optional |
| `enrichmentLog` | any | optional |

Indexes: `by_status`, `by_agentName`, `by_createdAt`

### Table 4: `agentActivity` (All agents — milestones only)

| Field | Type | Required |
|-------|------|----------|
| `agentName` | string | yes | "Parthasarathi" / "Vibhishana" / "Vyasa" / "Vidura" |
| `action` | string | yes | "health_check" / "scan_complete" / "brief_created" / "blog_published" |
| `status` | string | yes | "active" / "completed" / "error" |
| `message` | string | yes | One-line description |
| `timestamp` | string | yes | ISO timestamp |
| `metadata` | any | optional |

Indexes: `by_agentName`, `by_timestamp`, `by_agentName_timestamp`

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

---

## 5. HTTP Endpoints

| Endpoint | Method | Agent | Payload |
|----------|--------|-------|---------|
| `/ingestQuestions` | POST | Vibhishana | Array OR single object (normalizes to array) |
| `/ingestBrief` | POST | Vibhishana | Single brief with all 20 fields |
| `/ingestBlog` | POST | Vyasa | Blog metadata |
| `/ingestActivity` | POST | All agents | Milestone activity |
| `/ingestTopicCluster` | POST | Vidura | Topic cluster data |
| `/ingestToolOpportunity` | POST | Vidura | Tool opportunity data |

All require `Authorization: Bearer <AGENT_API_KEY>`. CORS preflight (OPTIONS) handled.

### Query Functions

**Public (no auth):** `questions.listRecent`, `briefs.listMetadata`, `briefs.getPublicBrief`, `blogs.listRecent`, `agentActivity.agentStatuses`, `agentActivity.recentFeed`, `agentActivity.weeklyStats`, `agentActivity.allTimeStats`, `agentActivity.agentTodayActivity`, `agentActivity.agentWeeklySummary`

**Admin (auth required):** `questions.listFullDetails`, `questions.communityBreakdown`, `briefs.getFullBrief`, `briefs.listFull`, `agentActivity.fullLog`

---

## 6. Auth

- **Provider:** Clerk (ClerkProvider wraps ConvexProviderWithClerk)
- **Middleware:** `middleware.ts` — permissive `clerkMiddleware()`, does not block any route
- **Admin queries:** Check `ctx.auth.getUserIdentity()` — throw if not authenticated
- **Waitlist gate:** No public "Sign in" button. `WaitlistCTA.tsx` shows email input; only `krishna@thelaunch.space` reveals Clerk SignIn/SignUp. Other emails captured as leads.

---

## 7. What's Public vs. Private

| Data | Public? | Notes |
|------|---------|-------|
| Agent statuses (active/sleeping) | Yes | Public query |
| Activity feed | Yes | Public query |
| Scoreboard stats | Yes | Weekly + all-time counts |
| Question titles + subreddits + URLs | Top 3 rows | Via QuestionsPreview. Titles link to Reddit. |
| Scanner analysis (pain, angles, ICP relevance) | Admin only | Requires Clerk auth |
| Brief metadata (titles, status) | Top 3 rows | Via BriefsPreview |
| Brief content (rendered markdown) | Top 3 only | Via `getPublicBrief` — strips sensitive SEO fields |
| Full brief list + SEO metadata sidebar | Admin only | Requires Clerk auth |
| Blog titles + URLs | Yes | Already public |
| Communities (subreddits monitored) | Placeholder only | CommunitiesPreview uses fake subreddit names |
| Sort/filter/scroll on tables | Admin only | Preview components: no scroll, max 320px height |

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
| Center content (admin) | 7 tabs: Overview / Blogs / Communities / Questions / Briefs / Strategy / Meetings |
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

---

## 11. Build Progress

**All steps DONE (shipped Feb 15-18, 2026):**

- [x] Convex backend — 7 tables, 6+ HTTP endpoints, Clerk auth, 12+ indexes
- [x] Agent skills — 4 SKILL.md files deployed on VPS, test pushes confirmed
- [x] Frontend dashboard — 28 components, 3-column layout, 7 tabs
- [x] Public preview tabs — blur + waitlist CTA for non-auth visitors
- [x] Admin view — full brief reader, sortable tables, SEO metadata
- [x] Mobile QA — 12 files fixed for responsive layout
- [x] FTUE spotlight tour — GuidedTour.tsx
- [x] Geo-detected cost savings — INR/USD via middleware cookie
- [x] Production deployment — Clerk prod, Convex prod, Netlify env vars, VPS skills updated
- [x] Historical data backfill — 605 records in production

**Production data:** 554 questions, 14 briefs, 7 blogs, 30 activity entries (as of Feb 15 backfill).

---

## 12. Phase 2 (After MVP — deferred)

- Approve/flag/revision actions on briefs from dashboard
- Two-way agent communication (send instructions back to agents)
- Internal notes/comments on briefs
- Brief diff/version comparison
- Agent-level pages showing live data instead of static marketing copy
- Public metrics counters (total questions, briefs, blogs)
- Work Mode Kanban board (spec at `.context/ideation/work-mode-kanban-spec.md`)
