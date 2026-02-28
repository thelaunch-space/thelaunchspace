# Valmiki LinkedIn Pipeline — Launch Control Integration Spec

> Created: 2026-02-28
> Status: Ready to build — open this folder in Claude Code to implement

---

## The Problem

Valmiki (the LinkedIn Growth Engine agent) runs daily at 7 PM IST and produces 1-2 LinkedIn post drafts, extracted from published blogs. Right now those drafts land in Slack (#valmiki-content) and that's where they die.

There's no structured place to:
- Read the draft alongside its source blog
- Leave revision feedback that Valmiki can pick up next run
- Track what got approved, what got posted, what's performing
- Close the Feedback-First loop (like Vibhishana and Vyasa already have)

The result: Krishna has to hunt Slack for drafts, give feedback manually in chat, and Valmiki has no reliable way to receive that feedback before its next run.

---

## The Goal

Give Valmiki the same review-and-feedback loop that the brief pipeline and blog pipeline already have:

1. **Valmiki pushes drafts to Convex** after every run (structured, queryable)
2. **Launch Control shows a LinkedIn Posts tab** — drafts with source blog, insight label, ICP result, status
3. **Krishna reviews in LC** — approves, requests revision with typed feedback, marks posted
4. **Valmiki checks Convex for `needs_revision` items** at the start of every cron (Feedback-First) before picking new work
5. **After Krishna posts to LinkedIn** — marks the post as `posted`, pastes URL, Valmiki tracks metrics

This mirrors exactly how Vibhishana's briefs flow: agent pushes → human reviews → feedback in Convex → agent reads feedback next cron → fixes first → then new work.

---

## What Needs to Be Built

### 1. Convex Schema — new `linkedinPosts` table

Add to `convex/schema.ts`:

```typescript
linkedinPosts: defineTable({
  // Source
  sourceBlogSlug: v.string(),         // exact slug from published blog (URL segment)
  sourceBlogTitle: v.string(),         // human-readable title

  // Insight
  insightLabel: v.string(),            // 2-5 word named label (e.g. "The Delegation Trap")
  insightNumber: v.number(),           // which insight from the blog (1 of 3, 2 of 3, etc.)
  icpPassFail: v.string(),             // "pass" | "fail" — did it pass the 45-year-old founder test

  // Draft content
  draftText: v.string(),               // full LinkedIn post draft
  ctaType: v.string(),                 // "value-exchange" | "question" | "soft-offer" | etc.

  // Status tracking
  status: v.string(),                  // "pending_review" | "needs_revision" | "approved" | "posted" | "dropped"
  feedbackText: v.optional(v.string()), // Krishna's revision notes

  // Post tracking (after posting)
  postedAt: v.optional(v.number()),    // Unix timestamp
  linkedinUrl: v.optional(v.string()), // URL to live post

  // Metrics (Valmiki fills in on Saturday review)
  likes: v.optional(v.number()),
  comments: v.optional(v.number()),
  saves: v.optional(v.number()),
  dmsGenerated: v.optional(v.number()),

  // Meta
  createdAt: v.number(),               // Unix timestamp
  updatedAt: v.number(),
  agentRunDate: v.string(),            // "2026-02-28" — which run produced this
})
  .index("by_status", ["status"])
  .index("by_source_blog", ["sourceBlogSlug"])
  .index("by_created_at", ["createdAt"])
```

**Dedup key:** `sourceBlogSlug + insightLabel` — Valmiki uses upsert so re-runs don't create duplicates.

---

### 2. Convex HTTP Endpoints — 3 new routes

Add to `convex/http.ts` (following same pattern as `/push/briefs`, `/push/blogs`):

**`POST /push/linkedin-posts`** — Valmiki writes drafts
- Auth: AGENT_API_KEY header
- Body: array of linkedin post objects (same fields as schema above)
- Behavior: upsert by `(sourceBlogSlug, insightLabel)` — idempotent, safe to re-run
- Returns: `{ inserted, updated, total }`

**`GET /query/linkedin-posts`** — Dashboard reads + Valmiki reads feedback
- Public (no auth) for dashboard preview
- Query params: `?status=pending_review`, `?status=needs_revision`, `?limit=20`, `?offset=0`
- Returns: array of post objects sorted by `createdAt` desc
- For Valmiki's feedback check: `?status=needs_revision` returns posts needing revision

**`POST /update/linkedin-post`** — Krishna sets feedback + status
- Auth: Admin only (Clerk JWT check, same pattern as other admin mutations)
- Body: `{ id, status, feedbackText?, postedAt?, linkedinUrl?, likes?, comments?, saves?, dmsGenerated? }`
- Behavior: partial update — only updates provided fields

---

### 3. Launch Control Frontend — new LinkedIn Posts tab

**Location:** Add as a new tab in the center panel of Launch Control (`/launch-control`)

**Tab label:** "LinkedIn Posts" (or "Valmiki")

**Tab contents — two views:**

**Public view** (all visitors, same blur-overlay pattern as other tabs):
- Top 3 posts visible (pending_review or approved)
- Shows: insight label, source blog title (linked), status badge, truncated draft (first 100 chars)
- Blur overlay + waitlist CTA below row 3

**Admin view** (Clerk auth, same pattern as existing admin gate):
- All posts, paginated
- Full draft text visible
- Per-post actions:
  - **"Needs Revision"** button → opens inline text input → saves feedbackText + sets status to `needs_revision`
  - **"Approve"** button → sets status to `approved`
  - **"Mark Posted"** button → opens inline input for LinkedIn URL → saves URL + postedAt timestamp + sets status to `posted`
- Filter tabs within the panel: All | Pending Review | Needs Revision | Approved | Posted

**Card design per post:**
```
┌─────────────────────────────────────────────────────┐
│ [insight label]          [status badge]  [source blog] →
│
│ [draft text — full in admin, truncated in public]
│
│ ICP: ✓ Pass   CTA: value-exchange   Run: Feb 28
│
│ [Needs Revision ↗]  [Approve ✓]  [Mark Posted ✓]    │  ← admin only
│
│ [Feedback shown here if needs_revision]
└─────────────────────────────────────────────────────┘
```

---

### 4. Agent Side — Valmiki skill file + AGENTS.md update

> **Do NOT build this as part of this Claude Code session.** This is handled separately — Krishna sends a prompt to Parthasarathi, who writes the skill file on VPS. Documented here so the full picture is clear.

What Valmiki needs on VPS:
- New skill file: `skills/convex-push-linkedin-post/SKILL.md` — mirrors the pattern of `convex-push-blog/SKILL.md`
- AGENTS.md update: add Feedback-First check (`node scripts/linkedin-pipeline-helper.js list-needs-revision` or direct HTTP call to `/query/linkedin-posts?status=needs_revision`) at start of every 7 PM cron
- AGENTS.md update: after drafting posts, call the new skill to push to Convex before posting to Slack

The Feedback-First behavior is already documented in Valmiki's AGENTS.md (it checks for `needs_revision` via Convex). Once the endpoint exists, the existing protocol kicks in automatically.

---

## Build Order

Build in this sequence — each step unblocks the next:

1. **Schema** — add `linkedinPosts` table to `convex/schema.ts`, run `npx convex dev --once`
2. **HTTP endpoints** — add 3 routes to `convex/http.ts`, deploy
3. **Convex queries/mutations** — internal functions backing the HTTP routes
4. **LC tab** — add "LinkedIn Posts" tab to the center panel, public view first
5. **Admin actions** — feedback input + status update buttons (admin-gated)
6. **Wire to real data** — verify real Convex data flows through (use test records first)

---

## Key Constraints (don't break these)

- Follow same auth pattern as existing admin mutations (Clerk JWT)
- Use same blur-overlay + waitlist CTA pattern for public view (rows 4+)
- Upsert by `(sourceBlogSlug, insightLabel)` — never insert duplicates
- Status values must match exactly what Valmiki will send: `pending_review`, `needs_revision`, `approved`, `posted`, `dropped`
- `feedbackText` is always optional — only present when status is `needs_revision`
- Keep this tab consistent with the Briefs tab UI pattern (same card spacing, status badge colors, etc.)

---

## What This Unlocks

Once built:
- **Full visibility:** Every LinkedIn draft is reviewable in Launch Control alongside briefs and blogs — the whole content pipeline in one place
- **Structured feedback loop:** Krishna types feedback once → Valmiki reads it next run → revises → re-submits → Krishna approves — no Slack hunting
- **Metrics tracking:** Valmiki fills in likes/comments/saves/DMs on Saturday review — data lives in Convex, can be surfaced in scoreboard later
- **Public social proof:** The public view of the LinkedIn Posts tab shows visitors that Krishna's AI team is actively producing content — live evidence of the system working
