# Launch Control — Frontend Spec

Status: LIVE IN PRODUCTION
Last updated: 2026-02-19 (moved from .context/ root, trimmed overlap with prd.md)

**For architecture, schema, endpoints, and decisions, see `launch-control/prd.md`.**

---

## Design Philosophy

Launch Control is a **public storefront window**, not an admin panel. Visitors from LinkedIn press their face against the glass and watch Krishna's AI team work. The design matches thelaunch.space's "Quiet Luxury" aesthetic — off-white base, clean typography, layered shadows, subtle micro-interactions.

**One rule:** Everything on the public view answers one question: **"Is this real?"**

---

## Layout: 3-Column Dashboard

```
+-----------+------------------------------------------+---------------+
|           |                                          |               |
|  AGENTS   |           CENTER CONTENT                 |  LIVE FEED    |
|  SIDEBAR  |                                          |               |
|           |  [Public: Scoreboard + Daily Timeline]    |  Real-time    |
|  Agent 1  |  [Admin: 7 Tabs]                         |  activity     |
|  Agent 2  |                                          |  log          |
|  Agent 3  |                                          |               |
|  Agent 4  |                                          |               |
|  Agent 5  |                                          |               |
|           |                                          |               |
+-----------+------------------------------------------+---------------+
```

### Column Widths
- **Desktop (>=1024px):** CSS Grid `grid-cols-[240px_1fr_320px]`
- **Tablet (768-1023px):** `grid-cols-[200px_1fr]` — feed drops below center
- **Mobile (<768px):** Single column, sidebar becomes horizontal avatar strip

---

## Header Bar

```
[Logo/Icon] Launch Control     3 AGENTS ACTIVE  ·  127 QUESTIONS     Sat, Feb 15     [UserButton]
```

- Left: "Launch Control" in Cormorant Garamond, bold
- Center: Key stats in JetBrains Mono (uppercase, small) — real-time via Convex
- Right: Current date + Clerk UserButton (when signed in)
- Background: `surface` (#FFFFFF) with `shadow-nav` beneath. Sticky top (z-50).

---

## Left Column: Agents Sidebar

### Agent Row
```
[Avatar 36px] [Status dot] Agent Name
                            Role (one line)
```

| Agent | Status |
|-------|--------|
| Parthasarathi | Active (green/orange) |
| Vibhishana | Active (green/orange) |
| Vyasa | Active (green/orange) |
| Vidura | Active (green/orange) |
| Sanjaya | Coming Soon (red muted) |
| Valmiki | Coming Soon (red muted) |

"Coming Soon" agents: muted opacity (~60%), red dot with no pulse.

### Expanded Panel (click agent row)

Full-bleed portrait with CSS `mask-image` feathering, status badge, today's activity (completed ✓ / upcoming ◌), this week summary, "View Full Profile →" link to `/build-your-ai-team/[agent]`.

---

## Right Column: Live Feed

Real-time activity log. Most recent on top.

### Filter Tabs
`[All] [Tasks] [Milestones]`

- **Tasks:** scan_complete, brief_created, blog_published
- **Milestones:** health_check, agent started/stopped

Data source: `agentActivity` table via `useQuery()`. Default: last 7 days. New entries slide in with Framer Motion animation.

---

## Center Column: Tabs

### Tab Bar (visible to everyone)
```
[Overview]  [Blogs]  [Communities]  [Questions]  [Briefs]  [Strategy]  [Meetings]
```

Each tab renders preview (public) or full (admin) based on `isSignedIn`. All tab panels use `next/dynamic` for lazy loading. Meetings tab admin-only.

### Overview Tab (default)

**Scoreboard:** 5 stat cards with count-up animation + "This Week"/"All Time" toggle. Hero pair layout for Hours Saved + Cost Saved with geo-detected currency (INR/USD).

**Cost Savings Formula:**
```
weeklyHumanHours = (questionsScanned / 50) * 2.5 + briefsWritten * 4 + blogsPublished * 4 + 5 * 3
weeklyCostSavings = (questionsScanned / 50) * 112.50 + briefsWritten * 180 + blogsPublished * 300 + 5 * 180
```

**Daily Timeline:** Chronological view of today's pipeline (11 scheduled items from `lib/launch-control-types.ts`). Completed (✓), Active (●), Upcoming (◌).

### Blogs Tab
- **Public:** BlogsPreview — top rows with blur overlay
- **Admin:** BlogsTable — sortable table merging local BlogPost data + Convex enrichment. Columns: Title, Category, Keyword, Words, Enrichment, Status, Published.

### Communities Tab
- **Public:** CommunitiesPreview — placeholder subreddit names (not real) with blur
- **Admin:** CommunitiesPanel — sortable table with "Why It Was Picked" reasoning column

### Questions Tab
- **Public:** QuestionsPreview — top 3 rows, titles link to Reddit, blur overlay
- **Admin:** QuestionsTable — scrollable table with frozen header + left column, mobile card view

#### Questions Table Columns
| Column | Width | Content |
|--------|-------|---------|
| Title (frozen left) | ~300px | Reddit post title (clickable → Reddit URL) |
| Subreddit | ~140px | e.g., "r/smallbusiness" |
| ICP Relevance | ~100px | HIGH (green) / MEDIUM (amber) / LOW (gray) badge |
| Content Potential | ~140px | "Strong blog candidate" / "Blog candidate" / "Watch" |
| Pain Point | ~250px | Extracted pain point |
| thelaunch.space Angle | ~250px | How we address this |
| Engagement | ~120px | "15 upvotes, 23 comments" |
| Status | ~120px | "new" / "brief_created" / "skipped" badge |
| Brief Created | ~80px | Yes/No indicator |
| Scanned At | ~120px | Date |

### Briefs Tab
- **Public:** BriefsPreview — top 3 clickable briefs + public reader modal (`getPublicBrief` strips SEO fields)
- **Admin:** BriefsPanel → BriefCard → BriefReaderModal

#### Brief Card
Title (prominent) + metadata (slug · category · date) + primary keyword + ICP problem (truncated) + status badge + "Read Brief →" button.

#### Brief Reader Modal
Near-fullscreen (~90vh × 1200px max-width). Left (~70%): `react-markdown` + `remark-gfm`. Right (~30%): SEO metadata sidebar (keywords, competitive gap, angles, source URLs). Typography: max content width ~680px, line-height 1.7.

### Strategy Tab
- **Public:** StrategyPreview — top rows with blur
- **Admin:** StrategyPanel — Vidura's topic clusters table + tool opportunities table with color-coded badges

### Meetings Tab (admin only)
MeetingsPanel showing pitch page bookings from `pitchBookings` Convex table.

---

## Agent Status Logic

- **Working (green):** Agent pushed `status: "active"` within window (Vibhishana scan: 30 min, briefs: 20 min, Vyasa: 60 min, Parthasarathi: 15 min)
- **Idle (orange):** Default. Has reported recently but not currently active.
- **Paused/Coming Soon (red):** Hasn't reported in 24+ hours, or "coming soon" agent.

### Agent Schedules (IST)

| Time | Agent | Task |
|------|-------|------|
| 8:00 AM | Parthasarathi | Morning health check |
| 9:00 AM | Vibhishana | Reddit community scan |
| 11:00 AM | Vibhishana | First research brief |
| 1:00 PM | Parthasarathi | Midday check & task routing |
| 2:00 PM | Vibhishana | Second research brief |
| 3:00 PM | Parthasarathi | Pre-delivery check |
| 3:30 PM | Vyasa | Blog writing begins |
| 5:00 PM | Vibhishana | Third research brief |
| 5:30 PM | Vyasa | Blog published via PR |
| 6:00 PM | Vibhishana | Evening pattern report |
| 7:00 PM | Parthasarathi | Due diligence report |

---

## Micro-Interactions

- **Status dots:** Green pulse (2s loop), orange static, red slow blink (3s)
- **Scoreboard:** Numbers count up from 0 over ~1.5s, staggered 200ms, intersection observer trigger
- **Agent panel:** Slides in with staggered content fade-in (Framer Motion)
- **Live feed:** New entries slide in from top with fade + green flash on "LIVE FEED" dot
- **Brief modal:** Scale-up 0.95→1 + fade on open, scale down + fade on close

---

## Component Breakdown (28 components)

```
components/launch-control/
├── LaunchControlDashboard.tsx    — Main client component (3-col CSS Grid, top-level useQuery hooks)
├── HeaderBar.tsx                 — Sticky top bar: title, stat pills, date, Clerk UserButton
├── AgentSidebar.tsx              — Left column: agent list, click-to-expand
├── AgentExpandedPanel.tsx        — Slide-out agent detail (portrait, stats, schedule)
├── AgentAvatarStrip.tsx          — Mobile-only horizontal avatar scroll strip
├── StatusDot.tsx                 — Green/orange/red animated dot
├── Scoreboard.tsx                — Count-up stats + toggle + geo currency + SavingsTooltip
├── DailyTimeline.tsx             — Today's pipeline (11 scheduled items)
├── TimelineItem.tsx              — Single timeline entry (completed/active/upcoming)
├── CenterTabs.tsx                — 7 tabs, preview vs full based on auth
├── AdminTabs.tsx                 — Admin-only tab management
├── LiveFeed.tsx                  — Right column: real-time log with filter tabs
├── CommunitiesPanel.tsx          — Admin: subreddit breakdown
├── CommunitiesPreview.tsx        — Public: placeholder with blur
├── QuestionsTable.tsx            — Admin: sortable table, frozen header/col, mobile cards
├── QuestionsPreview.tsx          — Public: top 3 rows + blur
├── BriefsPanel.tsx               — Admin: brief cards list
├── BriefsPreview.tsx             — Public: top 3 clickable + blur + public reader
├── PreviewGate.tsx               — Blur overlay + waitlist CTA (shared by previews)
├── BriefCard.tsx                 — Individual brief card
├── BriefReaderModal.tsx          — Near-fullscreen markdown reader + SEO sidebar
├── BlogsTable.tsx                — Admin: sortable blog table (local + Convex data)
├── BlogsPreview.tsx              — Public: blog preview with blur
├── StrategyPanel.tsx             — Admin: topic clusters + tool opportunities
├── StrategyPreview.tsx           — Public: strategy preview with blur
├── MeetingsPanel.tsx             — Admin: pitch page bookings
├── GuidedTour.tsx                — FTUE spotlight tour (5 desktop / 4 mobile steps)
└── WaitlistCTA.tsx               — Email gate: krishna@ reveals auth, others → lead capture
```

---

## FTUE Guided Tour

Spotlight tour for first-time non-admin visitors. Uses `data-tour` attributes, CSS box-shadow cutout overlay, viewport-clamped tooltip placement. localStorage `lc_tour_completed` flag. Auto-starts 800ms after page load.

**Desktop steps (5):** scoreboard → tab-bar → pipeline → agent-sidebar → live-feed
**Mobile steps (4):** scoreboard → tab-bar → pipeline → agent-strip

---

## Responsive Design

### Desktop (1280px+)
Full 3-column layout.

### Desktop Small (1024px-1279px)
Left sidebar collapses to icon-only mode (avatars only).

### Tablet (768px-1023px)
Left sidebar hidden (hamburger/drawer). Right column moves below center. Center goes full width. Scoreboard wraps to 2 rows.

### Mobile (< 768px)
Single column. Header simplified. Agents as horizontal scroll strip. Scoreboard as 2×2 grid. Tables become card-based layout. Brief modal takes full screen. **Mobile is the primary design target** — LinkedIn audience clicks from phones.
