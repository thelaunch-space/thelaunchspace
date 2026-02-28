# Todo — thelaunch.space Landing Page + Blog

Last updated: 2026-02-28 (context audit — redirect targets updated to /your-ai-team, stale Convex error noted)

## Priority: High
- [ ] **Production blog cleanup** — 4 junk/duplicate blog entries still in production Convex (`final-test-blog-1772095578`, `canonical-test-2026-02-26`, and pr_created duplicates of `ai-generated-code-deployment-reality` + `why-mvp-costs-too-much-validation-first`). Can drop them directly via Kanban dropdown now that "Drop" option exists. Or run `migrations:dropJunkBlogs` against prod with deploy key.
- [ ] **Fix `/admin` sign-up flow** — Currently, Clerk's `<SignIn>` component at `/admin` still shows a "Sign up" link/option. This is wrong: (1) `/admin` should be sign-in ONLY for `krishna@thelaunch.space` — no sign-up. (2) If someone does sign up (e.g., finds `/admin`), they should NOT see the full admin dashboard. Admin view (Documents, Meetings tabs, full data) must be gated to Krishna's account only, not any authenticated user. Need to either: disable Clerk sign-up entirely, or add an admin email check in the dashboard that shows a "request access" message for non-Krishna accounts.
- [ ] **Verify Daily Timeline times** — hardcoded in `lib/launch-control-types.ts`. Ask Parthasarathi to confirm they match actual VPS cron jobs.
- [x] **Update Vidura skill URL to production** — DONE. VPS skill confirmed pointing to prod (`curious-iguana-738`). Stale dev-pointing copies in `skills/` folder deleted (Feb 19).
- [x] **Deploy Vidura Convex changes to production** — DONE. Netlify auto-deploys Convex via `npx convex deploy --cmd 'npm run build'` on every merge to `main`. Vidura commit is on `main`.
- [ ] **Investigate question count mismatch** — Prod Convex has 771 questions, Google Sheet has 891. ~120 questions missing from Convex. Check if agent pushes are failing or URLs differ.
- [ ] **Diagnose Convex 500 error on /ingestBrief** — Vibhishana getting HTTP 500 (not auth issue). Request ID: `a07937d936186671`. *May be stale — agents have been running without obvious failures. Verify against Convex dashboard logs if briefs stop flowing.*
- [ ] **Fix "cron delivery target is missing"** — 5+ agent crons failing post-recovery. Delivery config has `mode: "announce"` but no channel/to target. Needs Partha to patch cron configs on VPS.
- [ ] **Set up 301 redirects** — `/build-your-ai-team` → `/your-ai-team`, `/build-your-ai-team/[agent]` → `/your-ai-team#team`. Old agent detail pages still exist as routes but navbar no longer links to them. (Note: `/hire-your-24x7-team` → `/your-ai-team` redirect is already live as of 2026-02-27.)
- [x] **Launch Control public view updates** — DONE. All public tabs open (no blur). Blogs, Questions, Communities, Strategy, Briefs fully visible. Documents + Meetings admin-only. (2026-02-25)
- [ ] Build out free tools pages (`/tools/[tool-slug]`) — Vidura's tool opportunities data now feeds tool ideas via Convex

## Priority: Medium
- [ ] Add Vitest + React Testing Library for lead capture flow
- [ ] Add basic error boundary component
- [ ] Clean up Netlify: remove duplicate site (`thelaunch-space-v2` if still present)
- [ ] Fix branch protection: disable "require status checks" (deploy previews not configured, checks always fail)
- [ ] Delete test brief from Convex dev (`jd7efw8gxba5hc5c3jqvmkwvs9817nw6`)

## Priority: Low
- [ ] Consider next/image for optimized image loading
- [ ] Add loading skeleton for particle effects init
- [ ] Consider Netlify deploy previews for PR review (currently using local preview)
- [ ] Regenerate Valmiki avatar using updated sage prompt (design-system-v2.md)

## Done (moved from above)
- [x] **Brief revision two-path logic** — Vibhishana now decides MINOR vs MAJOR when handling `needs_revision`. MINOR: updates same slug in place, appends `revisionHistory` snapshot, sets status back to `pending_review`. MAJOR: marks old brief `dropped`, creates new brief with new slug. Partha updated Vibhishana AGENTS.md. (2026-02-27)
- [x] **`revisionHistory` schema + WorkBoardCard UI** — `revisionHistory` optional array added to `briefs` table (version, title, primaryKeyword, suggestedStructure, feedback, revisedAt). Kanban cards show `v2` pill in header and collapsible `↩ 1 revision` panel with old title (struck through), old keyword, and feedback. Deployed to prod. (2026-02-27)
- [x] **Kanban status dropdown** — Brief/blog/LinkedIn cards now use dropdown with confirm + optional feedback textarea. `krishnaFeedback` stored in Convex. Blocked cards show feedback + Slack reminder. (2026-02-26)
- [x] **Feedback-first protocol** — Parthasarathi updated Vibhishana + Valmiki AGENTS.md + central AGENTS.md. Agents now check Convex for `needs_revision` items with `krishnaFeedback` at cron start, work on those first, push result back as pending_review/draft_ready. (2026-02-26)
- [x] **`/query/briefs?status=needs_revision`** — Endpoint now supported (was returning 400). Returns full brief including `krishnaFeedback`. (2026-02-26)
- [x] **Work Mode Kanban** — Full board with 5 columns + archive, owner tags, health bars, header stats. (2026-02-26)
- [x] **Convex SSOT migration** — All agents reading from Convex. Sheets = fallback only. (2026-02-26)
- [x] Vidura agent (6th agent) — full agent data, pitch card, detail page, avatars, Convex tables, strategy pipeline, skill file
- [x] LC: Strategy tab — StrategyPanel + StrategyPreview for Vidura's topic clusters + tool opportunities
- [x] LC: Blogs tab → sortable table (BlogsTable.tsx) with enrichment data from Convex
- [x] LC: Meetings tab — MeetingsPanel for pitch bookings
- [x] Geo-detected cost savings — INR/USD pricing, middleware geo cookie, SavingsTooltip
- [x] Cost formula overhaul — per-blog agency rate, all-time stats, removed hardcoded baseline
- [x] Pricing: $99 POC / $699 Growth (launch pricing, first 10 founders)
- [x] Scoreboard hero pair layout — Hours Saved + Cost Saved as hero cards
- [x] New blogs: "Post-MVP Doubt" + "Why Your MVP Costs Too Much"
- [x] Scoreboard baseline fixed — removed hardcoded `5*3` hours / `5*180` cost
- [x] LC: Sticky tabs + frozen headers/columns (Google Sheets-style scrolling)
- [x] LC: Communities tab rebuilt as sortable table with "Why It Was Picked" reasoning column
- [x] LC: Voice fix — "your AI team" → "the AI team" + header tagline
- [x] `/hire-your-24x7-team` pitch page — 14 components, live Convex data, Pokemon stat cards, lead capture + time slots, pricing, 4-week timeline, floating dual CTA
- [x] Launch Control FTUE spotlight tour — GuidedTour.tsx with 5 desktop / 4 mobile steps, spotlight overlay, localStorage tracking
- [x] `.context/thelaunch-space-icp.md` created — full ICP profile doc
- [x] NavBar updated — "Launch Control" removed, "Hire Your 24/7 Team" added
- [x] BlogsPanel + blog-labels.ts added to Launch Control
- [x] New blog: "Best AI Tools for Non-Technical Founders to Build MVPs" + `ai-tools` category
- [x] Team hero image added (`public/agents/team-hero.png`)
- [x] LC: Public preview tabs + scoreboard toggle
- [x] Partha historical data backfill — 605 records in production Convex
- [x] Launch Control DEPLOYED TO PRODUCTION
- [x] Launch Control mobile QA — 12 files fixed
- [x] Launch Control frontend dashboard — full 3-column dashboard
- [x] Launch Control Convex backend — schema, HTTP endpoints, Clerk auth
- [x] Launch Control SKILL.md — 3 skill files deployed on VPS
- [x] Convex schema enriched — all fields match Partha's audit
- [x] Build "My AI Employees" section — agent index + detail pages for all 5 agents
- [x] Build out blog pages (`/blogs/[topic]/[title]`) — AI agent creates via PRs
- [x] Add `/?cta=open` deep link for blog CTAs to open modal directly
- [x] Add `robots.txt` and `sitemap.xml` — done (auto-discovers blog posts from filesystem)
- [x] Add analytics tracking — GA4 via next/script
- [x] Add site-wide navigation (NavBar) with blog link
- [x] Blog index page (`/blogs`) listing all posts by category
- [x] Blog category index pages (`/blogs/[topic]/`) — dynamic route with filtered listings
