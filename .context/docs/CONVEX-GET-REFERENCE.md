# Convex Read (GET) Endpoints — Spec

**Version:** 2026-02-26
**Status:** FINALISED — Response shapes confirmed by Parthasarathi. Ready to build.
**Companion doc:** `CONVEX-API-REFERENCE.md` — POST endpoints and schemas (write API, fully implemented)
**Purpose:** Define the GET endpoints that let agents read from Convex instead of Google Sheets. Once built and deployed, helper scripts (`vyasa-sheets-helper.js`, `sheets-helper.js`, `vidura-sheets-helper.js`) switch from reading Sheets to reading Convex. Sheets becomes archive-only.

---

## Convention

All GET endpoints follow the same pattern as write endpoints:
- **Path prefix:** `/query/`
- **Auth:** `Authorization: Bearer <AGENT_API_KEY>` (same key as write endpoints — no unauthenticated reads)
- **Base URL:** `https://curious-iguana-738.convex.site`
- **Method:** GET
- **Empty response:** List endpoints return `[]`. Count endpoints return `{ "count": 0, "slugs": [] }`. Agents handle empty gracefully.
- **Pagination:** Not needed. Max ~100 records on the largest endpoint (topic-clusters). All returned in one response.

---

## Endpoints — Phase 0 (build now)

### `GET /query/briefs`

**Called by:** Vyasa, Vibhishana
**Query param:** `?status=<value>`

| Caller | Status queried | Calls per day | Why |
|--------|---------------|---------------|-----|
| Vyasa | `?status=brief_ready` | 1 (11 AM cron) | Find one approved brief to write into a full blog post |
| Vibhishana | `?status=pending_review` | 1–3 (before each brief run) | Check queue depth + slug list before creating new briefs |

---

#### Vyasa — `GET /query/briefs?status=brief_ready`

**Confirmed response shape:**
```json
[
  {
    "_id": "<convex_id>",
    "title": "How to Hire Your First Employee",
    "slug": "how-to-hire-first-employee-small-business",
    "primaryKeyword": "how to hire first employee",
    "longTailKeywords": ["hiring first employee checklist", "small business first hire"],
    "sourceUrls": ["https://reddit.com/r/smallbusiness/comments/..."],
    "icpProblem": "Owner is doing everything themselves, burning out",
    "competitiveGap": "Most articles focus on compliance, not the emotional shift",
    "launchSpaceAngle": "AI can handle candidate screening, saving 10+ hours",
    "suggestedStructure": "## Why Your First Hire Feels Impossible\n## The 5-Step Framework\n...",
    "researchNotes": "Reddit threads show cost anxiety is primary blocker",
    "contentMarkdown": "# Full brief content...",
    "category": "Operations",
    "createdAt": "2026-02-26T11:00:00.000Z"
  }
]
```

**Implementation notes:**
- Vyasa picks **ONE brief per cron run** — the script uses `response[0]` (first item). Return the full list sorted oldest-first; the script takes the first.
- No `?limit=1` param needed — script handles it client-side.
- Return empty array `[]` if no `brief_ready` briefs exist — script checks `if (response.length > 0)`.

---

#### Vibhishana — `GET /query/briefs?status=pending_review`

**Confirmed response shape:**
```json
{
  "count": 4,
  "slugs": [
    "how-to-hire-first-employee-small-business",
    "ai-tools-for-customer-support"
  ],
  "titles": [
    "How to Hire Your First Employee",
    "AI Tools for Customer Support"
  ]
}
```

**Implementation notes:**
- `count` — Vibhishana checks if queue is backlogged (>5 pending = hold off creating more briefs)
- `slugs` — dedup check before creating a new brief (is this topic already queued?)
- `titles` — included for readability (helps Vibhishana identify topics without mapping slugs mentally)
- Return `{ "count": 0, "slugs": [], "titles": [] }` when empty.

---

### `GET /query/topic-clusters`

**Called by:** Vidura
**Query params:** None — returns **all clusters, all statuses**
**Calls per day:** 1 (Monday 10:30 AM cron)
**Max records:** ~50–100 (grows over months, no pagination needed)

**Confirmed response shape:**
```json
[
  {
    "_id": "<convex_id>",
    "pillarName": "AI for Small Business Operations",
    "clusterTopic": "Hiring and HR automation",
    "status": "planned",
    "targetKeyword": "AI hiring tools small business",
    "intentType": "informational"
  }
]
```

**Implementation notes:**
- Return **all statuses** (`planned`, `in_progress`, `complete`) — Vidura needs the full picture for dedup and strategic analysis.
- Return `[]` if table is empty.

---

### `GET /query/tool-opportunities`

**Called by:** Vidura
**Query params:** None — returns **all opportunities, all statuses**
**Calls per day:** 1 (Friday 10:30 AM cron)
**Max records:** ~30–50 (grows over months, no pagination needed)

**Confirmed response shape:**
```json
[
  {
    "_id": "<convex_id>",
    "toolName": "Hiring Cost Calculator",
    "toolSolution": "Interactive calculator: salary + benefits + tax vs. productivity gain",
    "status": "proposed",
    "targetKeyword": "cost to hire an employee calculator",
    "complexity": "simple"
  }
]
```

**Implementation notes:**
- Return **all statuses** (`proposed`, `approved`, `rejected`, `building`, `built`) — Vidura needs to see the full pipeline for dedup and prioritization.
- Return `[]` if table is empty.

---

## Endpoint — Future (design alongside `linkedinPosts` table build)

### `GET /query/linkedin-posts`

**Called by:** Valmiki
**Status:** ⏳ NOT YET — the `linkedinPosts` Convex table doesn't exist yet. Design this endpoint when the table is built in Phase 0.

**What Valmiki will use it for:** Check which `sourceBlogSlug` values have already been processed (to avoid re-extracting insights from the same blog), and pull any `needs_revision` posts along with `krishnaFeedback` for rework.

---

## Confirmed Operational Details

| Detail | Answer |
|--------|--------|
| Vyasa picks one or all briefs? | **One per cron run.** Script uses `response[0]`. Return full list sorted oldest-first. |
| Pagination needed? | **No.** Largest endpoint (topic-clusters) has ~50–100 records max. |
| Auth on GET endpoints? | **Yes.** Same `Authorization: Bearer <AGENT_API_KEY>` header as write endpoints. |
| Empty array handling? | **Graceful.** Scripts check `response.length > 0` or `response[0]`. Return `[]` for lists, `{ count: 0, slugs: [], titles: [] }` for count endpoints. |
| Call frequency? | ~5–8 GET calls per day total. No rate limit concerns. |

---

## What Happens After Build

Once endpoints are deployed:
1. Share endpoint URLs with Parthasarathi
2. Parthasarathi rewires helper scripts:
   - `vyasa-sheets-helper.js` → reads from `/query/briefs?status=brief_ready`
   - `sheets-helper.js` (Vibhishana) → reads from `/query/briefs?status=pending_review`
   - `vidura-sheets-helper.js` → reads from `/query/topic-clusters` and `/query/tool-opportunities`
3. After scripts are tested end-to-end: Google Sheets becomes archive-only

---

## Change Log

| Date | Change |
|------|--------|
| 2026-02-26 | Document created as stub. |
| 2026-02-26 | Rewritten with pre-filled response shapes. Sent to Parthasarathi for verification. |
| 2026-02-26 | Parthasarathi verified. Vyasa shape updated with 6 missing fields. Vibhishana + Vidura shapes confirmed. Status: FINALISED. |
