# Convex Write API Reference — Canonical Single Source of Truth

**Version:** 2026-02-26
**Status:** AUTHORITATIVE — All agents must align their docs to this file.
**Companion doc:** `CONVEX-GET-REFERENCE.md` — GET (read) endpoints spec. To be shared after this audit is complete.
**Purpose:** This document defines the exact, final Convex write API surface: POST endpoint paths, request schemas, response shapes, and allowed status values for every table. It eliminates the naming inconsistencies and redundancies that have caused sync bugs.

> **Deployment note (updated 2026-02-26):** Canonical `/push/*` and `/update/*` endpoint paths are now LIVE in production after Phase 0 deploy. Old alias paths remain active permanently — agents can migrate at their own pace. See Section 3c for the full alias → canonical mapping.

---

## How to Use This Document (Parthasarathi)

1. **Read Section 2** — understand the naming problems being fixed and why.
2. **Read Section 3** — the canonical endpoint paths going forward.
3. **Read Section 4** — the exact field names and allowed values for each table.
4. **Check your agent skill files and helper scripts** against this reference.
5. **Report back:** For each endpoint your agents currently call, confirm whether they're using the canonical path or an old alias. Flag any field name mismatches.
6. **After review**, draft the GET endpoint response shapes (Section 6 — stub left for you).

---

## 1. Base URL and Authentication

| Environment | Base URL |
|-------------|----------|
| **Production** | `https://curious-iguana-738.convex.site` |
| **Dev** | `https://impartial-pelican-672.convex.site` |

**Auth:** All write endpoints require a Bearer token header.
```
Authorization: Bearer <AGENT_API_KEY>
```
The API key is stored on VPS at: `/home/node/openclaw/credentials/convex-api-key.txt`

Read it in shell scripts with:
```bash
CONVEX_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
```

---

## 2. The Naming Problem (Read This First)

The current endpoint set grew organically and has three problems:

**Problem 1 — Singular vs. plural inconsistency**
- `/ingestQuestions` (plural) vs. `/ingestBrief` (singular) vs. `/ingestBlog` (singular)
- No consistent rule.

**Problem 2 — `ingest` vs. `upsert` with no clear rule**
- Some things use `ingest`, some use `upsert`, with no semantic difference to agents.
- Worse: `/ingestBrief` and `/upsertBrief` call **different mutations** with **different behavior**.
  - `/ingestBrief` → always INSERTs (no dedup). Running twice = duplicate records. **This is a bug.**
  - `/upsertBrief` → checks for existing slug first, updates if found. This is correct behavior.

**Problem 3 — Redundant aliases with no clear winner**
- `/ingestBlog` and `/upsertBlog` call the **exact same mutation** — they're identical. One is redundant.
- `/ingestQuestions` and `/upsertQuestions` also call the **exact same mutation**. One is redundant.

**The fix:** A single consistent convention, documented here. Old endpoints stay alive as aliases forever (zero broken agents) but agents should migrate to canonical paths.

---

## 3. Canonical Endpoint Reference

### Convention Rules
- All resource names in paths are **plural** (questions, briefs, blogs, not question/brief/blog)
- All resource names use **kebab-case** for multi-word names (topic-clusters, tool-opportunities, linkedin-posts)
- Write new/upsert operations use prefix **`/push/`**
- Partial update operations use prefix **`/update/`**
- Read operations use prefix **`/query/`** (GET method)

---

### 3a. Write Endpoints (POST) — Currently Live

All require `Authorization: Bearer <AGENT_API_KEY>`.
All return: `{ "success": true, ... }` on success, `{ "success": false, "error": "..." }` on failure.

---

#### `POST /push/questions`
**Purpose:** Upsert one or more Reddit questions. Deduplicates by `url` field.
**Called by:** Vibhishana
**Old aliases (still work):** `/ingestQuestions`, `/upsertQuestions`

**Request body:** Array of question objects (preferred) or single object.
```json
[
  {
    "title": "How do I hire my first employee?",
    "subreddit": "r/smallbusiness",
    "url": "https://reddit.com/r/smallbusiness/comments/...",
    "questionPain": "Doesn't know where to start with hiring",
    "icpRelevance": "HIGH",
    "launchSpaceAngle": "AI can handle initial candidate screening",
    "contentPotential": "Strong blog candidate",
    "engagement": "45 upvotes, 67 comments",
    "notes": "Multiple replies mention cost as blocker",
    "postDate": "2026-02-20",
    "scannedAt": "2026-02-26T09:00:00.000Z",
    "status": "new",
    "agentName": "Vibhishana",
    "batchId": "scan-2026-02-26-morning"
  }
]
```

**Response:**
```json
{ "success": true, "inserted": 12, "updated": 3 }
```

**Dedup behavior:** Matches on `url`. If found, updates `scannedAt`, `engagement`, `icpRelevance`, `contentPotential`, `notes`. All other fields preserved.

---

#### `POST /push/briefs`
**Purpose:** Upsert a research brief. Deduplicates by `slug` field.
**Called by:** Vibhishana
**Old aliases (still work):** `/upsertBrief`
**⚠️ Do NOT use:** `/ingestBrief` — this is the broken alias that always inserts without dedup and can create duplicates. Agents must migrate away from this.

**Request body:**
```json
{
  "title": "How to Hire Your First Employee as a Small Business Owner",
  "slug": "how-to-hire-first-employee-small-business",
  "primaryKeyword": "how to hire first employee",
  "longTailKeywords": ["hiring first employee checklist", "small business first hire"],
  "finalKeywords": ["how to hire first employee", "first employee small business"],
  "icpProblem": "Owner is doing everything themselves, burning out",
  "competitiveGap": "Most articles focus on compliance, not the emotional/operational shift",
  "launchSpaceAngle": "AI can handle candidate screening, saving owners 10+ hours",
  "suggestedStructure": "## Why Your First Hire Feels Impossible\n## The 5-Step Framework\n...",
  "researchNotes": "Reddit threads show cost anxiety is primary blocker",
  "rankingNotes": null,
  "contentMarkdown": "# Full brief content here...",
  "sourceQuestionId": "<convex_id_of_source_question>",
  "sourceUrls": ["https://reddit.com/r/smallbusiness/comments/..."],
  "blogUrl": null,
  "category": "Operations",
  "status": "pending_review",
  "createdAt": "2026-02-26T11:00:00.000Z",
  "agentName": "Vibhishana"
}
```

**Response:**
```json
{ "success": true, "id": "<convex_id>", "action": "inserted" }
// or
{ "success": true, "id": "<convex_id>", "action": "updated" }
```

**Dedup behavior:** Matches on `slug`. If found, patches all provided fields including `updatedAt`.

---

#### `POST /push/blogs`
**Purpose:** Upsert a blog entry. Deduplicates by `slug` field.
**Called by:** Vyasa
**Old aliases (still work):** `/ingestBlog`, `/upsertBlog`

**Request body:**
```json
{
  "title": "How to Hire Your First Employee as a Small Business Owner",
  "slug": "how-to-hire-first-employee-small-business",
  "url": "https://thelaunch.space/blogs/how-to-hire-first-employee-small-business",
  "keyword": "how to hire first employee",
  "status": "pr_created",
  "agentName": "Vyasa",
  "wordCount": 2400,
  "publishedAt": null,
  "createdAt": "2026-02-26T11:30:00.000Z",
  "briefId": "<convex_id_of_source_brief>"
}
```

**Response:**
```json
{ "success": true, "id": "<convex_id>", "action": "inserted" }
```

**Dedup behavior:** Matches on `slug`. If found, updates `title`, `url`, `keyword`, `status`, `wordCount`, `publishedAt`, `briefId`.

---

#### `POST /push/activity`
**Purpose:** Log an agent milestone event. Deduplicates by `dedupKey` to prevent duplicate entries.
**Called by:** All agents (Parthasarathi, Vibhishana, Vyasa, Vidura, Valmiki)
**Old aliases (still work):** `/ingestActivity`

**Request body:**
```json
{
  "agentName": "Vibhishana",
  "action": "scan_complete",
  "status": "completed",
  "message": "Scanned r/smallbusiness, r/entrepreneur and found 18 new questions",
  "timestamp": "2026-02-26T09:15:00.000Z",
  "dedupKey": "scan_complete:2026-02-26:r/smallbusiness,r/entrepreneur",
  "metadata": {
    "subreddits": ["r/smallbusiness", "r/entrepreneur"],
    "inserted": 18,
    "updated": 4
  }
}
```

**Response:**
```json
{ "success": true, "id": "<convex_id>", "deduplicated": false }
// or if duplicate:
{ "success": true, "id": "<existing_id>", "deduplicated": true }
```

**Dedup behavior:** If `dedupKey` is provided, checks for existing entry with same key. If found, returns existing ID and does NOT insert.

**`dedupKey` naming convention:** `{action}:{date}:{context}` — e.g., `scan_complete:2026-02-26:r/smallbusiness`

---

#### `POST /push/topic-clusters`
**Purpose:** Upsert a topic cluster. Deduplicates by `pillarName` + `clusterTopic` composite.
**Called by:** Vidura
**Old aliases (still work):** `/ingestTopicCluster`

**Request body:**
```json
{
  "pillarName": "AI for Small Business Operations",
  "clusterTopic": "Hiring and HR automation for small teams",
  "status": "planned",
  "targetKeyword": "AI hiring tools small business",
  "intentType": "informational",
  "agentName": "Vidura",
  "createdAt": "2026-02-26T14:00:00.000Z"
}
```

**Response:**
```json
{ "success": true, "id": "<convex_id>", "action": "inserted" }
```

---

#### `POST /push/tool-opportunities`
**Purpose:** Upsert a free tool proposal. Deduplicates by `toolName`.
**Called by:** Vidura
**Old aliases (still work):** `/ingestToolOpportunity`

**Request body:**
```json
{
  "sourceQuestion": "How do I calculate if I can afford to hire someone?",
  "whyTool": "High-intent calculator query — users want to run the numbers themselves",
  "toolName": "Hiring Cost Calculator",
  "toolSolution": "Interactive calculator: salary + benefits + tax + training vs. productivity gain",
  "targetKeyword": "cost to hire an employee calculator",
  "complexity": "simple",
  "status": "proposed",
  "agentName": "Vidura",
  "createdAt": "2026-02-26T15:00:00.000Z"
}
```

**Response:**
```json
{ "success": true, "id": "<convex_id>", "action": "inserted" }
```

---

#### `POST /push/documents`
**Purpose:** Upsert a research or strategy document. Deduplicates by `slug`.
**Called by:** Any agent (Vidura primarily)
**Old aliases (still work):** `/upsertDocument`

**Request body:**
```json
{
  "title": "Weekly SEO Strategy — Feb Week 4",
  "slug": "vidura-seo-strategy-2026-w09",
  "content": "# Full markdown content here...",
  "summary": "Topic clusters for Q1, keyword opportunities in AI hiring space",
  "category": "strategy",
  "tags": ["seo", "weekly", "vidura"],
  "agentName": "Vidura",
  "filePath": "/home/node/openclaw/workspace/vidura/strategy-2026-w09.md",
  "createdAt": "2026-02-26T16:00:00.000Z"
}
```

**Response:**
```json
{ "success": true, "id": "<convex_id>", "action": "inserted" }
```

---

#### `POST /push/linkedin-posts`
**Purpose:** Upsert a LinkedIn post draft from Valmiki's pipeline.
**Called by:** Valmiki
**Status:** ⚠️ NOT YET BUILT — endpoint does not exist yet. Planned for Phase 0.
**Old aliases:** None (new endpoint).

**Planned request body:**
```json
{
  "insightName": "The Invisible Labor Trap",
  "draftText": "Full post draft here (1,200-1,600 chars)...",
  "sourceBlogSlug": "how-to-hire-first-employee-small-business",
  "sourceBlogTitle": "How to Hire Your First Employee as a Small Business Owner",
  "insightNumber": 2,
  "source": "blog",
  "icpPass": true,
  "icpFailReason": null,
  "hookStrategy": "loss-aversion",
  "ctaType": "question",
  "status": "draft_ready",
  "agentName": "Valmiki",
  "createdAt": "2026-02-26T19:00:00.000Z"
}
```

---

### 3b. Partial Update Endpoints (POST) — Currently Live

---

#### `POST /update/brief-status`
**Purpose:** Update the status of an existing brief, identified by slug.
**Called by:** Vidura (after Vyasa publishes a blog, Vidura marks the brief as published)
**Old aliases (still work):** `/updateBriefStatus`

**Request body:**
```json
{
  "slug": "how-to-hire-first-employee-small-business",
  "status": "published",
  "updatedAt": "2026-02-26T12:00:00.000Z"
}
```

**Response:**
```json
{ "success": true, "id": "<convex_id>", "slug": "...", "newStatus": "published" }
// or if not found:
{ "success": false, "error": "Brief not found", "slug": "..." }
```

---

#### `POST /update/blog-enrichment`
**Purpose:** Update enrichment metadata on a blog after Vyasa's enrichment runs.
**Called by:** Vyasa
**Old aliases (still work):** `/updateBlogEnrichment`

**Request body:**
```json
{
  "slug": "how-to-hire-first-employee-small-business",
  "enrichmentCount": 2,
  "lastEnrichmentDate": "2026-02-26T15:00:00.000Z",
  "enrichmentLog": "Added 3 internal links, expanded FAQ section, added schema markup"
}
```

**Response:**
```json
{ "success": true }
```

---

### 3c. Deprecated / Do Not Use

| Endpoint | Problem | Use Instead |
|----------|---------|-------------|
| `POST /ingestBrief` | **BUG: always inserts, no dedup. Creates duplicate records if called twice for same slug.** | `POST /push/briefs` |
| `POST /ingestQuestions` | Redundant alias for `/upsertQuestions` | `POST /push/questions` |
| `POST /ingestBlog` | Redundant alias for `/upsertBlog` | `POST /push/blogs` |
| `POST /ingestActivity` | Old name | `POST /push/activity` |
| `POST /ingestTopicCluster` | Old name, singular | `POST /push/topic-clusters` |
| `POST /ingestToolOpportunity` | Old name, singular | `POST /push/tool-opportunities` |
| `POST /upsertQuestions` | Redundant alias | `POST /push/questions` |
| `POST /upsertBlog` | Redundant alias | `POST /push/blogs` |
| `POST /upsertBrief` | Old name | `POST /push/briefs` |
| `POST /upsertDocument` | Old name | `POST /push/documents` |
| `POST /updateBriefStatus` | Old name | `POST /update/brief-status` |
| `POST /updateBlogEnrichment` | Old name | `POST /update/blog-enrichment` |

**Important:** All deprecated endpoints remain active in production. They are NOT being deleted. This is a migration — agents can update at their own pace. Nothing will break if agents keep using old paths. But `/ingestBrief` should be prioritized for migration because of the dedup bug.

---

## 4. Table Schemas and Allowed Values

### Table: `questions`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Reddit post title |
| `subreddit` | string | yes | Include `r/` prefix e.g. `"r/smallbusiness"` |
| `url` | string | yes | Full Reddit thread URL. **Dedup key.** |
| `questionPain` | string | yes | 1-2 sentence pain point extraction |
| `icpRelevance` | string | yes | See allowed values below |
| `launchSpaceAngle` | string | yes | How thelaunch.space addresses this |
| `contentPotential` | string | yes | See allowed values below |
| `engagement` | string | yes | Free text e.g. `"45 upvotes, 67 comments"` |
| `notes` | string | optional | Any additional scanner notes |
| `postDate` | string | optional | ISO date when Reddit post was made |
| `scannedAt` | string | yes | ISO timestamp when Vibhishana scanned |
| `status` | string | yes | See allowed values below |
| `agentName` | string | yes | Always `"Vibhishana"` |
| `batchId` | string | optional | Groups questions from same scan run |

**⚠️ Redundant field (do not populate going forward):**
- `briefCreated: boolean` — This duplicates `status: "brief_created"`. Ignored by new logic. Will be removed in next schema cleanup.

**Allowed values — `icpRelevance`:** `"HIGH"` · `"MEDIUM"` · `"LOW"`

**Allowed values — `contentPotential`:** `"Strong blog candidate"` · `"Blog candidate"` · `"Watch"`

**Allowed values — `status`:**
| Value | Meaning | Who Sets It |
|-------|---------|-------------|
| `new` | Just scanned, not acted on | Vibhishana (on push) |
| `brief_created` | A brief was created from this question | Vibhishana (after pushing brief) |
| `skipped` | Not actionable / not relevant | Vibhishana |

---

### Table: `briefs`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Blog title |
| `slug` | string | yes | URL-safe slug. **Dedup key.** |
| `primaryKeyword` | string | yes | Main SEO target keyword |
| `longTailKeywords` | string[] | optional | Supporting keywords |
| `finalKeywords` | string[] | optional | Final keyword list after research |
| `icpProblem` | string | optional | ICP pain point this addresses |
| `competitiveGap` | string | optional | What's missing in top search results |
| `launchSpaceAngle` | string | optional | Our unique angle |
| `suggestedStructure` | string | optional | H2/H3 outline as markdown |
| `researchNotes` | string | optional | Research context and sources |
| `rankingNotes` | string | optional | Post-publish ranking notes (filled later) |
| `contentMarkdown` | string | optional | Full brief content as markdown (~500 lines) |
| `sourceQuestionId` | string | optional | Convex `_id` of source question |
| `sourceUrls` | string[] | optional | Reddit URLs used in research |
| `blogUrl` | string | optional | Published URL (filled after publish) |
| `category` | string | optional | Topic category |
| `status` | string | yes | See allowed values below |
| `createdAt` | string | yes | ISO timestamp |
| `updatedAt` | string | optional | ISO timestamp of last update |
| `agentName` | string | yes | Always `"Vibhishana"` |

**Allowed values — `status`:**
| Value | Meaning | Who Sets It | Kanban Column |
|-------|---------|-------------|---------------|
| `pending_review` | Vibhishana created brief, Krishna must review | Vibhishana (on push) | To Do → Krishna |
| `needs_revision` | Brief has issues, sent back to Vibhishana | Krishna (Kanban action) | Blocked → Vibhishana |
| `brief_ready` | Krishna approved, Vyasa to pick up | Krishna (Kanban action) | In Progress → Vyasa |
| `writing` | Vyasa is actively writing the blog | Vyasa (on push) | In Progress → Vyasa |
| `pr_created` | Vyasa submitted PR, Krishna must review + merge | Vyasa (on push) | To Do → Krishna |
| `published` | Blog merged and live on site | Krishna (Kanban action after merge) | Done |
| `dropped` | Topic rejected, will not be written | Krishna (Kanban action) | Done |

---

### Table: `blogs`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Blog post title |
| `slug` | string | yes | URL slug. **Dedup key.** |
| `url` | string | optional | Full published URL |
| `keyword` | string | yes | Primary keyword |
| `status` | string | yes | See allowed values below |
| `agentName` | string | yes | Always `"Vyasa"` |
| `wordCount` | number | yes | Word count at time of push |
| `publishedAt` | string | optional | ISO timestamp of publish |
| `createdAt` | string | yes | ISO timestamp |
| `briefId` | string | optional | Convex `_id` of source brief |
| `enrichmentCount` | number | optional | How many enrichment passes done |
| `lastEnrichmentDate` | string | optional | ISO timestamp of last enrichment |
| `enrichmentLog` | string | optional | What was changed in last enrichment |

**Allowed values — `status`:**
| Value | Meaning | Who Sets It | Kanban Column |
|-------|---------|-------------|---------------|
| `writing` | Vyasa started writing | Vyasa (on start) | In Progress → Vyasa |
| `pr_created` | PR submitted to GitHub | Vyasa (on push) | To Do → Krishna |
| `published` | Blog merged and live | Krishna (Kanban action) | Done |

---

### Table: `topicClusters`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `pillarName` | string | yes | Pillar topic name |
| `clusterTopic` | string | yes | Sub-topic within pillar. **Dedup key with `pillarName`.** |
| `status` | string | yes | See allowed values below |
| `blogUrl` | string | optional | Published blog URL (filled after publish) |
| `targetKeyword` | string | yes | SEO keyword for this cluster |
| `intentType` | string | yes | See allowed values below |
| `agentName` | string | yes | Always `"Vidura"` |
| `createdAt` | string | yes | ISO timestamp |
| `updatedAt` | string | optional | ISO timestamp of last update |

**Allowed values — `status`:**
| Value | Meaning | Who Sets It |
|-------|---------|-------------|
| `planned` | Cluster identified, no content yet | Vidura (on push) |
| `in_progress` | At least one cluster topic has a published blog | Vidura (update) |
| `complete` | All core subtopics have published blogs | Vidura (update) |

**Allowed values — `intentType`:** `"informational"` · `"comparison"` · `"decision"`

---

### Table: `toolOpportunities`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `sourceQuestion` | string | yes | The Reddit question that inspired this |
| `whyTool` | string | yes | Why a tool is better than a blog for this query |
| `toolName` | string | yes | Short name for the tool. **Dedup key.** |
| `toolSolution` | string | yes | What the tool does |
| `targetKeyword` | string | yes | Primary SEO keyword |
| `complexity` | string | yes | See allowed values below |
| `status` | string | yes | See allowed values below |
| `krishnaNotes` | string | optional | Krishna's review notes |
| `agentName` | string | yes | Always `"Vidura"` |
| `createdAt` | string | yes | ISO timestamp |

**Allowed values — `complexity`:** `"simple"` · `"medium"`

**Allowed values — `status`:**
| Value | Meaning | Who Sets It | Kanban Column |
|-------|---------|-------------|---------------|
| `proposed` | Vidura identified opportunity, not yet reviewed | Vidura (on push) | Backlog |
| `approved` | Krishna approved for building | Krishna (Kanban) | To Do |
| `rejected` | Krishna rejected the idea | Krishna (Kanban) | Done |
| `building` | Being actively built | Vishwakarma/future (on push) | In Progress |
| `built` | Live on thelaunch.space | Krishna (Kanban) | Done |

---

### Table: `agentActivity`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `agentName` | string | yes | See allowed values below |
| `action` | string | yes | See allowed values below |
| `status` | string | yes | See allowed values below |
| `message` | string | yes | One-line human-readable description |
| `timestamp` | string | yes | ISO timestamp |
| `metadata` | any | optional | Flexible extra context (subreddits scanned, counts, etc.) |
| `dedupKey` | string | optional | Unique key to prevent duplicate entries |

**Allowed values — `agentName`:** `"Parthasarathi"` · `"Vibhishana"` · `"Vyasa"` · `"Vidura"` · `"Valmiki"`

**Allowed values — `action`:**
| Value | Who Uses It |
|-------|------------|
| `health_check` | Parthasarathi |
| `scan_complete` | Vibhishana |
| `brief_created` | Vibhishana |
| `blog_writing_started` | Vyasa |
| `blog_pr_created` | Vyasa |
| `blog_published` | Vyasa |
| `blog_enriched` | Vyasa |
| `cluster_mapping` | Vidura |
| `tool_scan` | Vidura |
| `document_created` | Any agent |

**Allowed values — `status`:** `"active"` · `"completed"` · `"error"`

---

### Table: `documents`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Document title |
| `slug` | string | yes | Unique identifier. **Dedup key.** |
| `content` | string | yes | Full markdown content |
| `summary` | string | optional | Short 1-2 sentence description |
| `category` | string | yes | See allowed values below |
| `tags` | string[] | optional | Flexible array of tags |
| `agentName` | string | yes | Who created it |
| `filePath` | string | optional | VPS path for reference |
| `createdAt` | string | yes | ISO timestamp |
| `updatedAt` | string | optional | ISO timestamp of last update |

**Allowed values — `category`:** `"research"` · `"strategy"` · `"brief"` · `"process"` · `"analysis"`

---

### Table: `pitchBookings` (read-only from agent perspective)

Agents do not write to this table. It is populated by the pitch page form. Listed here for completeness.

**Allowed values — `status`:** `"new"` · `"contacted"` · `"scheduled"` · `"completed"`

---

### Table: `linkedinPosts` ⚠️ NOT YET BUILT

Planned for Phase 0. Valmiki currently writes to the `linkedin-pipeline` Google Sheet. After this table is built, Valmiki writes to Convex first, Sheets as fallback.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `insightName` | string | yes | 2-5 word memorable label. **Dedup key with `sourceBlogSlug`+`insightNumber`.** |
| `draftText` | string | yes | Full LinkedIn post draft (1,200-1,600 chars) |
| `sourceBlogSlug` | string | yes | Slug of the blog this insight came from |
| `sourceBlogTitle` | string | optional | Blog title for display |
| `insightNumber` | number | yes | Which insight from this blog (1, 2, 3, etc.) |
| `source` | string | yes | `"blog"` · `"krishna-insight"` |
| `icpPass` | boolean | yes | Did this pass Valmiki's ICP filter? |
| `icpFailReason` | string | optional | Why it failed (if `icpPass` is false) |
| `hookStrategy` | string | optional | `"loss-aversion"` · `"curiosity"` · `"authority"` · `"story"` · `"social-proof"` |
| `ctaType` | string | optional | `"value-exchange"` · `"question"` · `"resource"` · `"follow"` |
| `krishnaFeedback` | string | optional | Krishna's review notes |
| `postedDate` | string | optional | ISO date when posted to LinkedIn |
| `linkedinUrl` | string | optional | Full LinkedIn post URL |
| `status` | string | yes | See allowed values below |
| `agentName` | string | yes | Always `"Valmiki"` |
| `createdAt` | string | yes | ISO timestamp |
| `updatedAt` | string | optional | ISO timestamp |

**Allowed values — `status`:**
| Value | Meaning | Who Sets It | Kanban Column |
|-------|---------|-------------|---------------|
| `draft_ready` | Valmiki finished draft + ICP check, ready for Krishna | Valmiki (on push) | To Do → Krishna |
| `needs_revision` | Krishna gave feedback, Valmiki must revise | Krishna (Kanban) | Blocked → Valmiki |
| `approved` | Krishna approved, ready to post | Krishna (Kanban) | In Progress → Krishna |
| `posted` | Live on LinkedIn | Krishna (Kanban) | Done |
| `skipped` | Won't post this one | Krishna (Kanban) | Done |

---

### Table: `manualTasks` ⚠️ NOT YET BUILT

Planned for Phase 0. For tasks Krishna creates himself with no source artifact.

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `title` | string | yes | Task description |
| `description` | string | optional | More detail if needed |
| `status` | string | yes | `"todo"` · `"in_progress"` · `"blocked"` · `"done"` |
| `assignee` | string | optional | `"Krishna"` or agent name |
| `createdAt` | string | yes | ISO timestamp |
| `updatedAt` | string | yes | ISO timestamp |

---

## 5. The Sheets-as-Fallback Pattern

Once the GET endpoints are live and agents are migrated, the agent push pattern changes:

**New (Convex-first, Sheets only on failure):**
```
Agent does work → try Convex push → if HTTP 200: done
                                   → if not 200: write to Sheets + Slack alert + add to retry queue
```

**Shell pattern:**
```bash
CONVEX_KEY=$(cat /home/node/openclaw/credentials/convex-api-key.txt)
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  "https://curious-iguana-738.convex.site/push/briefs" \
  -H "Authorization: Bearer $CONVEX_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD")

HTTP_STATUS=$(echo "$RESPONSE" | tail -1)

if [ "$HTTP_STATUS" = "200" ]; then
  echo "Convex push successful"
else
  node push-to-sheets.js
  echo "WARNING: Convex push failed (HTTP $HTTP_STATUS), fell back to Sheets"
fi
```

---

## 6. Change Log

| Date | Change |
|------|--------|
| 2026-02-26 | Document created. Canonical reference established. `/ingestBrief` dedup bug identified. All status values standardised. `linkedinPosts` and `manualTasks` tables planned. |
| 2026-02-26 | Canonical `/push/*` and `/update/*` endpoints deployed to production. |
| 2026-02-26 | Full agent audit complete. All skill files migrated. All field name/status mismatches fixed. `writing` status push added to Vyasa. Activity skill wired into all agents. |
