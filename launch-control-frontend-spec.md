# Launch Control — Frontend Spec

Status: BRAINSTORMING — Not building yet
Created: 2026-02-15
Last updated: 2026-02-15

---

## Design Philosophy

Launch Control is a **public storefront window**, not an admin panel. Visitors from LinkedIn press their face against the glass and watch Krishna's AI team work. The design matches thelaunch.space's "Quiet Luxury" aesthetic — off-white base, clean typography, layered shadows, subtle micro-interactions.

**Visual reference:** Nothing Phone style header — minimal, typographic, confident. The dashboard itself is clean and usable, not flashy.

**One rule:** Everything on the public view answers one question: **"Is this real?"**

---

## URL

`thelaunch.space/launch-control`

---

## Page Structure

```
/launch-control
│
├── Header
│   "Launch Control" — minimal, clean, Nothing-phone inspired
│   No hero section. Just the title + maybe a subtle live pulse dot.
│
├── Agent Status Cards (all 5 agents)
│   ├── Parthasarathi — Orchestrator
│   ├── Vibhishana — SEO Scanner + Brief Writer
│   ├── Vyasa — Blog Writer
│   ├── Sanjaya — "Coming Soon" badge
│   └── Valmiki — "Coming Soon" badge
│   Each card: status dot + current task or countdown + click to expand
│
├── Scoreboard (stats row)
│   Numbers count up on load (animation)
│   Shows: questions analyzed | briefs written | blogs published | human hours saved | $ saved
│
├── Activity Feed (last 7 days)
│   Clean log style with agent avatars
│   Scrollable timeline of milestones
│
├── [Admin only] Briefs Section
│   Full list of briefs with status tags
│   Click to read full markdown content
│
└── Footer CTA
    "Want an AI team like this? Let's talk"
```

---

## Agent Status Cards

### Layout
- 5 cards in a responsive row/grid
- Active agents (Parthasarathi, Vibhishana, Vyasa): full cards with live data
- Inactive agents (Sanjaya, Valmiki): same card style but with "Coming Soon" badge overlay

### Card Content (Public View)
- **Agent avatar** (character portrait from `/public/agent-avatars/`)
- **Agent name + role** (one line)
- **Status indicator dot:**
  - Green = working (currently executing a task)
  - Orange = idle (between scheduled runs)
  - Red = paused/error
- **If working:** Show task name (e.g., "Scanning Reddit questions")
- **If idle:** Show countdown timer — "Next run in 47 min" (counts down in real-time)
- **Last 7 days summary:** e.g., "52 questions scanned, 3 briefs written"

### Card Click Behavior
- **Expand inline (accordion style)** — card expands in place, no page navigation
- **Public expanded view:** Last 7 days summary, role description, link to `/build-your-ai-team/[agent]`
- **Admin expanded view:** Everything above PLUS:
  - For Vibhishana: recent briefs list (click to read), recent questions scanned
  - For Vyasa: blog queue, recent published posts
  - For Parthasarathi: recent activity log, health check status

### "Coming Soon" Agents (Sanjaya, Valmiki)
- Same card shape/size as active agents
- Muted/slightly faded styling
- "Coming Soon" badge (subtle, not loud)
- Avatar still visible (teases the character)
- No status dot, no countdown, no click-to-expand

### Status Logic
- **Working:** Determined by `agentActivity` — if the agent pushed a "started" activity within the last N minutes (configurable per agent based on typical run duration)
- **Idle:** Default state. Show countdown to next scheduled run.
- **Paused/Error:** If the agent pushed an "error" activity or hasn't reported in 24+ hours

### Agent Schedules (for countdown timer)
| Agent | Schedule (IST) | Runs |
|-------|---------------|------|
| Vibhishana (scanning) | 9:00 AM | 1x/day |
| Vibhishana (briefs) | 11:00 AM, 2:00 PM, 5:00 PM | 3x/day |
| Vyasa (blog writing) | 4:00 PM | 1x/day |
| Parthasarathi (orchestration) | Continuous/as-needed | Throughout day |

The countdown timer calculates "next run" based on current time vs. these schedules. For Parthasarathi (no fixed schedule), show "last active X ago" instead of countdown.

---

## Scoreboard

### What It Shows
A row of key numbers — the aggregate impact of the AI team.

| Metric | Example | Source |
|--------|---------|--------|
| Reddit questions analyzed | 127 | `questions` table count (last 7 days) |
| SEO briefs written | 12 | `briefs` table count (last 7 days) |
| Blogs published | 3 | `blogs` table count (last 7 days) |
| Human hours replaced | ~103 hrs | Calculated (see formula below) |
| Cost savings | ~$5,600 | Calculated (see formula below) |

### Animation
- Numbers **count up from 0** to real value on page load (Framer Motion or similar)
- Smooth easing, ~1.5 second duration
- Staggered start per metric (left to right, slight delay)

### Cost Savings Formula (Hardcoded for MVP)

Based on research (Upwork, Glassdoor, ZipRecruiter — Feb 2026 rates):

**Per-task human equivalents:**

| Agent Task | Human Time | Hourly Rate | Cost Per Task |
|-----------|-----------|-------------|--------------|
| Vibhishana: Reddit scan (1 run, ~50-100 questions) | 2.5 hrs | $45/hr | $112.50 |
| Vibhishana: SEO brief (1 brief) | 4 hrs | $45/hr | $180 |
| Vyasa: Blog post (1 post, ~2000 words from brief) | 4 hrs | $75/hr | $300 |
| Parthasarathi: Daily orchestration | 3 hrs | $60/hr | $180 |

**Rate sources:**
- $45/hr (Vibhishana) — blended rate for SEO specialist + content strategist + market researcher. Upwork median SEO specialist: $21/hr (budget), experienced: $35-55/hr. ZipRecruiter content strategist: $35-53/hr.
- $75/hr (Vyasa) — mid-tier SEO copywriter. Upwork intermediate: $50-75/hr. Per-article: $300-600 for 2000 words.
- $60/hr (Parthasarathi) — content operations manager. ZipRecruiter: $43-75/hr. Glassdoor SEO manager: $51-90/hr.

**Calculation logic (per week, 5 working days):**

```
weeklyHumanHours =
  (questionsScanned / 50) * 2.5     // 2.5 hrs per scan run (~50 questions each)
  + briefsWritten * 4                // 4 hrs per brief
  + blogsPublished * 4               // 4 hrs per blog post
  + 5 * 3                            // 3 hrs/day orchestration × 5 days

weeklyCostSavings =
  (questionsScanned / 50) * 112.50   // scan runs × $112.50
  + briefsWritten * 180              // briefs × $180
  + blogsPublished * 300             // blogs × $300
  + 5 * 180                          // orchestration × 5 days × $180
```

For typical week (5 scan runs, 15 briefs, 5 blogs):
- Human hours: 12.5 + 60 + 20 + 15 = **~107.5 hours**
- Cost: $562.50 + $2,700 + $1,500 + $900 = **~$5,662.50**

Display as rounded numbers: "~108 human hours" and "~$5,600 saved"

**Note:** These are conservative estimates using mid-market freelancer rates, not agency rates. Defensible if questioned.

---

## Activity Feed

### Style
- **Clean log format** — factual, concise entries
- Each entry has: agent avatar (small circle) + agent name + action description + timestamp
- Scrollable, most recent on top
- Shows last 7 days by default

### Example Entries
```
[Vibhishana avatar] Vibhishana — Scanned 52 questions from 5 subreddits          2 hours ago
[Vibhishana avatar] Vibhishana — Created brief: "Why Your MVP Is Burning Money"   5 hours ago
[Vyasa avatar]      Vyasa — Published blog: "Should You Hire a Developer?"         Yesterday
[Parthasarathi avatar] Parthasarathi — Health check: all agents operational        Yesterday
```

### Data Source
- `agentActivity` table via Convex `useQuery()` subscription
- Filter: last 7 days, sorted by timestamp descending
- Real-time: new entries appear instantly via WebSocket when agents push data

### Public vs. Admin
- **Public:** See milestone entries (scan complete, brief created, blog published, health check)
- **Admin:** Same entries but with additional detail — click an entry to see metadata (e.g., which subreddits scanned, how many questions marked as high-relevance)

---

## Admin View (Krishna Logged In)

### Authentication
- Clerk login (already configured)
- Small lock/user icon in the Launch Control header — clicking it opens Clerk login
- Icon is visible but understated (doesn't distract public visitors)
- When logged in, icon changes to show authenticated state (e.g., small avatar or checkmark)

### What Unlocks When Logged In

**1. Brief Queue Section**
- Full list of all briefs from `briefs` table
- Each brief shows: title, status tag, category, date created
- Status tags: `pending_review` (yellow), `approved` (green), `needs_revision` (red), `brief_ready` (blue), `writing` (purple), `published` (green)
- **Click a brief → full markdown content expands inline below the brief card** (keeps context, scroll to read — this is the main reason Launch Control exists for Krishna)
- Brief detail view shows: all SEO metadata (primary keyword, long-tail keywords, competitive gap, ICP problem, launch space angle, suggested structure, research notes)

**2. Inside Agent Expanded Cards**
- Vibhishana's expanded card shows recent briefs (quick access — same briefs as the section above)
- Vibhishana's expanded card shows recent questions with full scanner analysis (pain point, ICP relevance, content potential, engagement, notes)
- Vyasa's expanded card shows blog queue with status

**3. Full Activity Log**
- Unfiltered activity feed (not just last 7 days)
- Filter by agent name
- Shows metadata field for each entry

### Brief Access (Two Paths)
Per Krishna's preference, briefs are accessible two ways:
1. **Quick access:** Inside Vibhishana's expanded agent card — see recent briefs, click to read
2. **Full list:** Dedicated "Briefs" section on the page — browse all briefs, filter by status/category

---

## Responsive Design

### Desktop (1024px+)
- Agent cards in a single row (5 cards)
- Scoreboard as horizontal stats row
- Activity feed in a contained column (centered, max-width)
- Brief section as cards grid or list

### Tablet (768px-1023px)
- Agent cards: 3 + 2 row layout or horizontal scroll
- Scoreboard wraps to 2 rows if needed
- Activity feed full width

### Mobile (< 768px)
- Agent cards: horizontal swipe/scroll (single row, swipeable)
- Scoreboard: 2x2 grid or vertical stack
- Activity feed: full width, compact entries
- Brief list: single column cards
- **Mobile is the primary design target** — LinkedIn audience clicks from their phone

---

## Micro-Interactions & Polish

### Status Dot Animations
- **Green (working):** Gentle pulse animation (like a heartbeat)
- **Orange (idle):** Static dot, no animation
- **Red (paused):** Slow blink

### Countdown Timer
- Updates every minute (or every second for the last 5 minutes)
- When countdown hits 0: dot transitions from orange to green with a subtle flash

### Card Expand/Collapse
- Smooth accordion animation (Framer Motion)
- Content fades in as card expands
- Other cards stay in place (no layout shift)

### Scoreboard Count-Up
- Numbers roll from 0 → real value over ~1.5s
- Staggered: each metric starts 200ms after the previous
- Easing: ease-out (fast start, gentle land)

### Activity Feed
- New entries slide in from top with fade
- Subtle entrance animation when WebSocket pushes new data

---

## Data Requirements (Convex Queries Needed)

### Public Queries (already built)
| Query | Table | Returns |
|-------|-------|---------|
| `agentStatuses()` | agentActivity | Latest status per agent |
| `recentFeed(limit)` | agentActivity | Recent activity entries |
| `listRecent(limit)` | questions | Recent questions (titles, subreddits) |
| `listRecent(limit)` | blogs | Recent published blogs |
| `listMetadata(limit)` | briefs | Brief titles + status (no content) |

### Admin Queries (already built)
| Query | Table | Returns |
|-------|-------|---------|
| `fullLog(limit, agentName)` | agentActivity | Full activity log with filter |
| `listFullDetails(limit)` | questions | Questions with scanner analysis |
| `getFullBrief(briefId)` | briefs | Full brief with markdown content |
| `listFull(limit)` | briefs | All briefs with full details |

### New Queries Needed
| Query | Table | Purpose |
|-------|-------|---------|
| `weeklyStats()` | questions, briefs, blogs | Counts for last 7 days (for scoreboard) |
| `agentWeeklySummary(agentName)` | questions, briefs, blogs, agentActivity | Per-agent 7-day stats (for card summaries) |

---

## Component Breakdown (Planned)

```
app/launch-control/
├── page.tsx                    — Server component, route entry
├── layout.tsx                  — Optional layout wrapper
└── (client components below, could be in components/launch-control/)

components/launch-control/
├── LaunchControlPage.tsx       — Main client component (orchestrates everything)
├── AgentStatusCard.tsx         — Individual agent card with expand/collapse
├── AgentCardExpanded.tsx       — Expanded content (public + admin variants)
├── Scoreboard.tsx              — Stats row with count-up animation
├── ActivityFeed.tsx            — Scrollable log of agent milestones
├── BriefQueue.tsx              — [Admin] Brief list with status filters
├── BriefReader.tsx             — [Admin] Full markdown brief rendered as HTML
├── CountdownTimer.tsx          — Live countdown to next agent run
├── StatusDot.tsx               — Green/orange/red animated dot
├── ComingSoonBadge.tsx         — Badge overlay for Sanjaya/Valmiki
└── ScoreboardNumber.tsx        — Single animated number with label
```

---

## What We're NOT Building (MVP Scope)

- No approve/flag/revision actions on briefs (Phase 2)
- No two-way communication with agents (Phase 2)
- No internal notes/comments (Phase 2)
- No brief diff/version comparison (Phase 2)
- No editable agent schedules (hardcoded for now)
- No public metrics counters (total all-time) — only rolling 7-day window
- No notification system (Krishna checks manually)
- No dark mode toggle (matches site-wide light theme)

---

## Decisions Made

| Question | Decision |
|----------|----------|
| Idle display | Countdown timer ("Next run in 47 min") — feels alive |
| Feed tone | Clean log style — factual, concise entries |
| Scoreboard animation | Count-up from 0 on page load |
| Cost framing | Show both human hours + dollar savings |
| Feed avatars | Yes, agent character portraits next to each entry |
| Page header | Minimal "Launch Control", Nothing-phone inspired |
| Card click | Expand inline (accordion) |
| Brief access | Both: quick access in agent card + full list section |
| Agent count | All 5, with "Coming Soon" badge on Sanjaya/Valmiki |
| Data freshness | WebSocket only (Convex subscriptions) |
| Admin login | Lock/user icon in header |
| Brief reader | Inline expansion below brief card |
| Empty states | Friendly message (e.g., "No blogs yet this week — Vyasa runs at 4 PM IST") |
| Partha's status | "Last active X ago" instead of countdown (no fixed schedule) |

## Open Questions

1. **Partha's schedule:** He doesn't have fixed cron times like the others. Current plan: show "last active X ago" instead of countdown. Confirm this works.
2. **Brief teaser for public:** Show first 2 lines or ICP Problem field as a teaser on public view? Or keep briefs completely hidden from public?

---

## References

- Backend spec: `live-dashboard-convex.md` (in project root)
- Design system: `.context/design-system-v2.md`
- Agent data: `lib/agents.ts`
- Convex schema: `convex/schema.ts`
- Convex queries: `convex/questions.ts`, `convex/briefs.ts`, `convex/blogs.ts`, `convex/agentActivity.ts`
