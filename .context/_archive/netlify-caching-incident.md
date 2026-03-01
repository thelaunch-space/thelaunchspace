# Netlify Durable Cache Incident — Root Cause & Fix

Last updated: 2026-02-27

## What Happened

After every Netlify deploy, some pages (mainly blog pages) served stale HTML referencing old CSS/JS chunk hashes that 404'd. Result: broken styling, missing layout, JS errors on navigation. Fresh browsers / incognito affected. Home page worked fine. Blogs and other pages were broken.

Took 5 failed fix attempts over ~90 minutes before root cause was confirmed.

---

## Root Cause

**Netlify has TWO separate cache layers:**

| Layer | Auto-purged on deploy? | TTL |
|-------|----------------------|-----|
| Netlify Edge CDN | YES | Short |
| Netlify Durable Cache | **NO** | ~364 days |

`@netlify/plugin-nextjs` pre-renders Next.js pages and stores them in the **Durable Cache** with a ~364-day TTL. On a new deploy, the Durable Cache is NOT automatically purged. Old HTML (referencing old CSS/JS chunk hashes) stays cached and gets served to new visitors.

**Why the home page was fine:** The plugin's `onSuccess` hook prewarms the root URL (`/`) immediately after deploy — creating a fresh Durable Cache entry. Blog pages were never prewarmed, so their 364-day-old entries persisted.

**Why this appeared after 15 months / 65 projects:** Two conditions aligned:
1. `generateBuildId` with `COMMIT_REF` was added (commit `9029061`) — making new and old buildIds obviously different (commit SHA vs. random string), making the mismatch consistent and reproducible.
2. Previously, random buildIds + natural TTL expiry meant old HTML + new chunks rarely collided in a reproducible way.

**Confirmed via HTTP headers:**
```
# Blog page (broken):
cache-status: "Netlify Durable"; hit; ttl=31496797
x-nextjs-date: [26 minutes BEFORE the last deploy]

# Home page (working):
cache-status: "Netlify Edge"; hit
```

Two different buildIds on the same deploy: home page showed current commit SHA, blog page showed `iDUQdNLukryTFDdcS4acD` (a pre-fix random ID from a much older build).

---

## Why Previous Fixes Failed

| Commit | Attempt | Why It Failed |
|--------|---------|---------------|
| `d7f4c99` | Force fresh chunk build | Chunks ARE freshly built. Problem is old HTML in Durable Cache. |
| `6ff7a21` | `staleTimes: { dynamic: 0, static: 0 }` | Prevents client-side router cache staleness. Wrong layer. |
| `9029061` | `generateBuildId` with `COMMIT_REF` | Helps prevent router cache collisions. Doesn't purge Durable Cache. |
| `33860c3` | `Cache-Control: no-store` on `/*.html` | Wrong header (browser layer). Wrong path (Next.js pages have no `.html` in URL). |
| `34a1415` | `Cache-Control: no-store` on `/*` | Still wrong header. `/*` override actively harmed `/_next/static/` caching. |
| `NETLIFY_NEXT_SKEW_PROTECTION=true` | Skew protection env var | Only affects NEW sessions after the flag is set. Existing 364-day stale entries persist. |

---

## The Fix (Commit `6bfa8b3`)

### 1. `netlify.toml` — Prevent future stale caching

```toml
# Prevent HTML page responses from being stored in Netlify Durable Cache.
# no-store ensures every HTML response is always fresh from the Netlify Function.
[[headers]]
  for = "/*"
  [headers.values]
    Netlify-CDN-Cache-Control = "no-store"

# Static assets are content-addressed (hash in filename) — safe to cache long-term.
# This overrides the no-store rule above specifically for Next.js static chunks.
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    Netlify-CDN-Cache-Control = "durable, max-age=31536000, immutable"
```

Key detail: `Netlify-CDN-Cache-Control` is the correct header — it controls Netlify's Durable Cache layer. Regular `Cache-Control` only affects the browser / Edge CDN layer.

### 2. `app/api/deploy-hook/route.ts` — Manual + automated purge endpoint

POST route that calls Netlify's purge API to clear ALL Durable Cache entries for the site. Uses `NETLIFY_PURGE_API_TOKEN` and `SITE_ID` (both auto-injected by Netlify into Function context on all plans including free).

```bash
# Run this manually after any deploy to purge stale Durable Cache:
curl -X POST https://thelaunch.space/api/deploy-hook
# Expected response: {"purged":true,"timestamp":"..."}
```

### 3. One-time cleanup (done 2026-02-27)

Ran the curl command above after the fix deploy. Cleared all stale Durable Cache entries that had been serving old CSS chunk hashes.

---

## Step 3: Automate Purge on Every Deploy (Optional but Recommended)

The `no-store` header means new HTML responses won't be cached in Durable Cache going forward — so stale entries can't accumulate. The purge endpoint is no longer strictly necessary.

However, as a belt-and-suspenders safety net, you can wire it to auto-fire after every Netlify deploy:

**Setup in Netlify Dashboard:**
1. Site settings → Build & deploy → Deploy notifications
2. Add webhook
3. URL: `https://thelaunch.space/api/deploy-hook`
4. Event: "Deploy succeeded"
5. (Optional) Add header: `x-webhook-secret: <same value as DEPLOY_HOOK_SECRET Netlify env var>`

This makes Netlify call the purge endpoint automatically after each successful production deploy.

**DEPLOY_HOOK_SECRET:** Set this in Netlify env vars to protect the endpoint from unauthorized calls. Same value must be in the `x-webhook-secret` header sent by Netlify's webhook.

---

## Files Changed

| File | Change |
|------|--------|
| `netlify.toml` | Added `Netlify-CDN-Cache-Control: no-store` on `/*`, `durable, max-age=31536000, immutable` on `/_next/static/*` |
| `app/api/deploy-hook/route.ts` | New POST route — calls Netlify purge API |
| `next.config.mjs` | `generateBuildId` with `COMMIT_REF` (pre-existing, confirmed working) |

---

## Key Concepts for Future Debugging

- **`Netlify-CDN-Cache-Control`** controls Netlify Durable Cache (not browser cache, not Edge CDN)
- **`Cache-Control`** on its own only controls browser + Edge CDN layer — useless for Durable Cache
- **Durable Cache is NOT purged on deploy** — it has 364-day TTL and must be explicitly purged via API
- **`NETLIFY_PURGE_API_TOKEN`** and **`SITE_ID`** are auto-injected by Netlify into Function context (all plans, including free legacy)
- **Purge API:** `POST https://api.netlify.com/api/v1/purge` with `{ site_id }` body purges the entire site's Durable Cache
- **Skew protection** (`NETLIFY_NEXT_SKEW_PROTECTION=true`) handles active SPA sessions (version mismatch mid-session). It does NOT fix Durable Cache staleness. Both can coexist — they solve different problems.
