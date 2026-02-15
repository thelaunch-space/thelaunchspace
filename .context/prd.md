# Product Requirements — thelaunch.space Landing Page + Blog

Last updated: 2026-02-15

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

### Site-Wide Navigation (NavBar)
- Rendered in root layout, visible on ALL pages
- Left: Logo linked to `/` — Right: "Blog" link, "AI Team" link, X icon, LinkedIn icon
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

### My AI Employees Section
- Showcase page at `/my-ai-employees` presenting all 5 AI agents as a team
- Layout: Left-sticky hero text + right-scrolling 2-column card grid
- Hero copy: "Your Brain. Your Agents. Real Output." eyebrow, "Meet My AI Employees" headline, scaling-your-thinking body copy with bold/italic emphasis
- CTAs: Primary WhatsApp (wa.me with pre-filled message), secondary LinkedIn (brand blue), tertiary email link
- 5 agents in order: Parthasarathi, Vyasa, Vibhishana, Sanjaya, Valmiki
- Partha gets highlight card (bigger), others standard size in 2-col grid
- Card sizes: highlight (h-48/h-64), standard (h-40/h-48), compact (h-28/h-36)
- Pipeline visualization section showing how agents work together
- Bottom CTA section with same WhatsApp/LinkedIn/email pattern
- Individual detail pages at `/my-ai-employees/<agent>` showing:
  - Key Responsibility Areas (KRAs) with outcomes and frequency
  - Daily rhythm / schedule
  - Proof points (stats, links, real-world catches)
- Floating CTA button appears on scroll for conversion
- Agent data structured in TypeScript for future database migration

### Launch Control Dashboard (Backend + Skills DONE, Frontend Next)
- Live, public-facing dashboard at `/launch-control` showing AI agents working in real-time
- **Backend (DONE):** Convex database with 4 tables (questions, briefs, blogs, agentActivity), 4 HTTP ingestion endpoints with Bearer token auth, Clerk authentication for admin features
- **Skills (DONE):** 3 SKILL.md files deployed on VPS — agents push data via curl on scheduled runs. 50 records backfilled (13 briefs, 7 blogs, 30 questions).
- **Public view (TODO):** Agent status cards, questions scanned, brief titles + status, blogs published, live activity feed
- **Admin view (TODO):** Full brief content (markdown rendered as HTML), full activity log, SEO metadata
- **Real-time:** Convex WebSocket subscriptions — instant UI updates when agents push data (no polling, no refresh)
- **Dual purpose:** Internal review tool (Krishna reads briefs without SSH) + marketing asset (audience watches agents work live)
- Full spec: `live-dashboard-convex.md` in project root

### Analytics
- Google Analytics (GA4) via `next/script` in root layout
- Auto-tracks page views on all routes (landing page + blog posts + agent pages)
- Measurement ID via `NEXT_PUBLIC_GA_MEASUREMENT_ID` env var
