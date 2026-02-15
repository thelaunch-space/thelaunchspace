# Todo — thelaunch.space Landing Page + Blog

Last updated: 2026-02-15

## Priority: High
- [ ] **Launch Control frontend** — build `/launch-control` page (public view + admin view, real-time via Convex subscriptions). 50 real records in Convex (13 briefs, 7 blogs, 30 questions) ready for frontend dev.
- [ ] Build out free tools pages (`/tools/[tool-slug]`)

## Priority: Medium
- [ ] Add Vitest + React Testing Library for lead capture flow
- [ ] Add basic error boundary component
- [ ] Clean up Netlify: remove duplicate site (`thelaunch-space-v2` if still present)
- [ ] Fix branch protection: disable "require status checks" (deploy previews not configured, checks always fail)

## Priority: Low
- [ ] Consider next/image for optimized image loading
- [ ] Add loading skeleton for particle effects init
- [ ] Consider Netlify deploy previews for PR review (currently using local preview)

## Priority: Low-Medium
- [ ] Regenerate Valmiki avatar using updated sage prompt (design-system-v2.md)

## Priority: Low-Medium
- [ ] Set up Convex Production deployment + env vars on Netlify for production deploy (dev works, prod URL swap needed on VPS skill files when going live)

## Done (moved from above)
- [x] Launch Control Convex backend — schema, HTTP endpoints, Clerk auth, provider wiring, curl-tested
- [x] Launch Control SKILL.md — 3 separate skill files (scanner, blog, activity) created and deployed on VPS
- [x] Convex schema enriched — all 12 scanner fields, all 14 blog-queue columns (matches Partha's full audit)
- [x] Historical data backfill — 50 records (13 briefs, 7 blogs, 30 questions) in Convex dev
- [x] Build "My AI Employees" section — agent index + detail pages for all 5 agents
- [x] Build out blog pages (`/blogs/[topic]/[title]`) — AI agent creates via PRs
- [x] Add `/?cta=open` deep link for blog CTAs to open modal directly
- [x] Add `robots.txt` and `sitemap.xml` — done (auto-discovers blog posts from filesystem)
- [x] Add analytics tracking — GA4 via next/script (`NEXT_PUBLIC_GA_MEASUREMENT_ID`)
- [x] Add site-wide navigation (NavBar) with blog link
- [x] Blog index page (`/blogs`) listing all posts by category
- [x] Blog category index pages (`/blogs/[topic]/`) — dynamic route with filtered listings
