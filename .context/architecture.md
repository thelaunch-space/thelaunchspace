# Architecture — thelaunch.space Landing Page

Last updated: 2026-02-07

## Overview
Next.js 14 App Router application. Server-side rendered for SEO/crawlability. Landing page content rendered as a client component for interactivity. Webhook proxy via API route (server-side, no secrets exposed to browser).

## File Structure
```
app/
├── layout.tsx              # Root layout (next/font, metadata API)
├── page.tsx                # Server Component → renders <LandingPage />
├── globals.css             # Tailwind directives + custom keyframes
├── api/lead/route.ts       # POST handler (proxies to Make.com webhook)
├── blogs/[topic]/[title]/  # Future blog routes (placeholder)
└── tools/[tool-slug]/      # Future tool routes (placeholder)
components/
├── LandingPage.tsx         # "use client" — main landing page (hero + services)
├── Modal.tsx               # "use client" — lead capture form
├── XIcon.tsx               # Pure SVG component
└── ui/
    ├── dock.tsx            # "use client" — macOS-style magnification dock
    └── sparkles.tsx        # "use client" — tsparticles background
lib/
├── utils.ts               # cn() (clsx+tailwind-merge), scaleValue()
└── submit-lead.ts          # Client fetch to /api/lead
public/                     # Static assets (logos, OG image, favicon)
```

## Component Tree
```
RootLayout (Server)
└── page.tsx (Server)
    └── LandingPage ("use client")
        ├── SparklesCore      — Particle effects background
        ├── Header             — Logo, social links (X, LinkedIn)
        ├── Hero / WhatWeDo    — State-toggled views (useState)
        ├── Dock               — Client logos with magnification
        │   └── Tooltip (Portal) — Rendered outside DOM tree
        ├── CTA Button         — Opens Modal
        └── Modal              — Lead capture form → /api/lead
```

## Data Flow
1. User fills Modal form → client-side validation
2. `submitLead()` POSTs to `/api/lead` (Next.js API route)
3. API route proxies to Make.com webhook (server-side, URL never exposed)
4. Make.com processes lead (external)
5. Modal shows success/error state

## State Management
- `useState` only — no global state, no context
- `showWhatWeDo` — toggles hero vs services view
- `isModalOpen` — toggles lead capture modal
- Modal manages its own form state internally

## Styling
- Tailwind utility-first with custom theme
- Framer Motion for animations
- CSS keyframes for hero animations (fadeIn, scaleIn, heroAppear)
- `clamp()` for fluid typography
- Dark theme: `#101018` base, blue/purple accents
- Fonts via `next/font/google` (self-hosted, CSS variables)

## Build & Deploy
- `next build` produces optimized output in `.next/`
- Landing page is statically prerendered (SSG)
- API route runs server-side
- Deploy to Vercel or any Node.js hosting
