# Integrations — thelaunch.space Landing Page

Last updated: 2026-02-07

## Make.com Webhook (Active)
- **Purpose:** Lead capture → CRM pipeline
- **Client file:** `lib/submit-lead.ts` — POSTs to `/api/lead`
- **Server file:** `app/api/lead/route.ts` — proxies to Make.com webhook
- **Env var:** `WEBHOOK_URL` (server-only, in `.env.local`, no NEXT_PUBLIC_ prefix)
- **Payload:**
  ```
  {
    project_description: string
    email: string | null
    whatsapp_number: string | null
    prefer_whatsapp: boolean
  }
  ```
- **Error handling:** try-catch, console logging, user-facing error message
- **Security:** Webhook URL never reaches the browser (server-side only)

## Google Fonts (Active — Self-hosted)
- **Fonts:** Sora (400, 600, 700), Syne (700, 800)
- **Loaded in:** `app/layout.tsx` via `next/font/google` (self-hosted, no CDN)
- **CSS variables:** `--font-sora`, `--font-syne`
- **Mapped in:** `tailwind.config.js` → `fontFamily.sans` (Sora), `fontFamily.display` (Syne)
