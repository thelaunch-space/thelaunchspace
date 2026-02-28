# Product Requirements — thelaunch.space Landing Page + Blog

Last updated: 2026-02-28 (pricing corrected, URL corrected, blog counts updated, 7 agents, Shakti added)

## Core Concept
"Tweet-sized" landing page — deliver the full value prop instantly, no scrolling. Reflects agency ethos: cut bureaucracy, deliver fast. Also hosts SEO-optimized blog posts for programmatic content marketing.

## Target Audience
Ambitious founders and product leaders who prioritize execution and clarity over lengthy process.

## Layout Rules (Non-Negotiable)
- All primary landing page content visible within first fold (desktop + mobile)
- No vertical scrolling required for main pitch
- Fully responsive: small phones → large desktops

## Features

### Hero Section
- Headline: "21 days. idea to revenue"
- Tagline: "We think like your cofounder, and build like your CTO"
- Social links: X (Twitter), LinkedIn in header
- CTA button: "Get Your Launch Roadmap" → opens lead capture modal

### Services Overview ("What We Do")
- Secondary view (state toggle, not new route)
- Three tiers: Landing Pages ($500), MVPs ($1.5k-4k), Retainers ($2k+/mo)
- Back navigation to hero

### Animated Client Dock
- macOS-style dock with 7 client logos
- Desktop: magnification on hover + tooltip (name + project description)
- Mobile: tap to reveal tooltip
- Tooltip rendered via React Portal (prevents clipping)

### Lead Capture Modal
- Fields: project description (min 10 chars), email OR WhatsApp (toggle)
- Submits to Make.com webhook
- Success confirmation (2s display)
- Loading state during submission
- Directly accessible from blog CTAs via `/?cta=open`

### Visual Polish
- Particle effects background (tsparticles)
- Framer Motion animations (modal, fadeIn, scaleIn, heroAppear)
- Light "Quiet Luxury" theme — off-white base, surface elevation, layered shadows, noise grain texture, blue/purple accents
- Google Fonts: Inter (body), Cormorant Garamond (headings), JetBrains Mono (labels)

### Your AI Team — Service Pitch Page (LIVE)
- Full scrolling ICP-focused pitch page at `/your-ai-team` (permanent redirect from `/hire-your-24x7-team`)
- **The front door.** LinkedIn/X posts → this page → lead capture or Launch Control (proof).
- 14 components under `components/pitch/`
- **Live data from Convex:** Weekly stats, agent summaries, recent questions/briefs/blogs — all real-time via `useQuery()`
- **Sections:** Hook (headline + live stats) → How It Works (4-step daily workflow) → Meet Your Team (6 active AgentStatCards + 1 coming soon) → Trust Nudge → Recent Work (tabbed Q/B/B from Convex) → 4-Week Timeline → Pricing ($299 DIY Kickstart + $1,500/mo Founder's Partnership) → Lead Capture (form + time slots, anchor #contact) → Secondary CTA (→ Launch Control) → Footer Tease
- **Agent cards:** 6 active (Parthasarathi, Vibhishana, Vyasa, Vidura, Valmiki, Shakti) + 1 coming soon (Sanjaya). Each has stat bars, skills, weekly feed.
- **Floating dual CTA** after 600px scroll: "Watch live" + "Get your AI team"
- **Pricing:** DIY Kickstart $299 one-time (₹24,999 INR) + Founder's Partnership $1,500/mo first month $750 (₹1,20,000 INR). Geo-detected currency. No strikethrough.
- Full brainstorm: `.context/hire-your-24x7-team.md`

### Site-Wide Navigation (NavBar)
- Rendered in root layout, visible on ALL pages except `/launch-control`
- Left: Logo linked to `/` — Right: "Blog" link, "Your AI Team" link (→ `/your-ai-team`), X icon, LinkedIn icon
- **No "Launch Control" link** — LC is discoverable only via pitch page secondary CTA or direct URL
- Active link highlighting via `usePathname()`
- Scroll-aware CTA on blog pages: "Get Your Launch Roadmap" button appears in navbar after 100px scroll (rounded-xl, matches navbar radius). On mobile, replaces social icons; on desktop, coexists.

### Blog System
- AI agent creates SEO-optimized blog posts via GitHub PRs
- Self-contained static pages at `/blogs/<topic>/<slug>`
- Blog index at `/blogs` — inline title row (no container), horizontal card rows per category, CTA in NavBar on scroll (no footer)
- Light "Quiet Luxury" theme consistent with landing page design
- Blog CTAs link to `/?cta=open` (directly opens lead capture modal)
- Human reviews and merges every post before it goes live
- Category index pages at `/blogs/<topic>/` show filtered post listings per topic
- **Categories:** startup-mvps (8 posts), founder-advice (10 posts), ai-tools (4 posts) — 22 total
- `lib/blog-labels.ts` — client-safe category labels (extracted from `lib/blog.ts` to avoid `fs` import in client components)

### Build Your AI Team Section
- Showcase page at `/build-your-ai-team` presenting all 7 AI agents as a team (legacy section — no navbar link)
- Layout: Left-sticky hero text + right-scrolling 2-column card grid
- Hero copy: "Your Brain. Your Agents. Real Output." eyebrow, "Meet My AI Employees" headline, scaling-your-thinking body copy with bold/italic emphasis
- CTAs: Primary WhatsApp (wa.me with pre-filled message), secondary LinkedIn (brand blue), tertiary email link
- 7 agents: Parthasarathi, Vyasa, Vibhishana, Sanjaya, Valmiki, Vidura, Shakti
- Partha gets highlight card (bigger), others standard size in 2-col grid
- Card sizes: highlight (h-48/h-64), standard (h-40/h-48), compact (h-28/h-36)
- Pipeline visualization section showing how agents work together
- Bottom CTA section with same WhatsApp/LinkedIn/email pattern
- Individual detail pages at `/build-your-ai-team/<agent>` showing:
  - Key Responsibility Areas (KRAs) with outcomes and frequency
  - Daily rhythm / schedule
  - Proof points (stats, links, real-world catches)
- Floating CTA button appears on scroll for conversion
- Agent data structured in TypeScript for future database migration

### Launch Control Dashboard (LIVE IN PRODUCTION)
- Live, public-facing dashboard at `/launch-control` showing AI agents working in real-time
- **Backend (DONE):** Convex database with 4 tables (questions, briefs, blogs, agentActivity), 4 HTTP ingestion endpoints with Bearer token auth, Clerk authentication for admin features. Production deployment: `curious-iguana-738`.
- **Skills (DONE):** 3 SKILL.md files deployed on VPS — agents push data via curl on scheduled runs. 605 records in production (554 questions, 14 briefs, 7 blogs, 30 activity entries).
- **Public view (DONE):** All 4 tabs visible (Overview, Communities, Questions, Briefs) with preview components — top rows of real data with blur overlay + waitlist CTA for non-authenticated visitors. Scoreboard with "This Week"/"All Time" toggle, daily timeline, live activity feed.
- **Admin view (DONE):** Full brief content (markdown rendered as HTML), full activity log, SEO metadata, sortable/scrollable tables.
- **Real-time:** Convex WebSocket subscriptions — instant UI updates when agents push data (no polling, no refresh)
- **FTUE Guided Tour (DONE):** Spotlight tour for first-time non-admin visitors — 5 desktop steps / 4 mobile steps highlighting scoreboard, tabs, pipeline, agents, live feed. localStorage tracking.
- **BlogsPanel (DONE):** Admin tab showing published blog posts with category badges.
- **Navigation:** Removed from navbar. Discoverable via pitch page secondary CTA ("Watch them work live →") or direct URL only.
- **Dual purpose:** Internal review tool (Krishna reads briefs without SSH) + marketing asset (audience watches agents work live)
- Full spec: `.context/launch-control/prd.md` (architecture, schema, endpoints) and `.context/launch-control/frontend-spec.md` (layout, components, responsive design)

### Analytics
- Google Analytics (GA4) via `next/script` in root layout
- Auto-tracks page views on all routes (landing page + blog posts + agent pages)
- Measurement ID via `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var
