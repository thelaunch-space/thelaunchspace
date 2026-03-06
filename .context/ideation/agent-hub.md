# Agent Hub — Ideation Doc

**Status:** Thinking stage. Not ready to build yet. Review at your own pace and add comments/questions inline.
**Last updated:** 2026-03-05

---

## The Bigger Picture First

Before getting into what to build, it helps to understand how the two main surfaces — `/agents` and `/launch-control` — should relate to each other. Right now they're muddled. Here's the clean separation:

**`/agents` = The Command Center (private)**
Everything about running and managing your agent team. For you today, and eventually for your clients when you sell this as a service.
- Talk to agents (chat)
- See what they're doing (status + live feed)
- View their identity, skills, and files (agent files)
- Review and approve their work (Kanban — moving here eventually)

**`/launch-control` = The Demo Window (public, read-only)**
A clean "look at what AI agents produce" view for prospects. No Kanban, no chat, no private tools. Just the output: blogs published, briefs created, agents running in real time. When a prospect sees this, they understand what they'd get as a client.

**Launch Control as a future product**
When someone buys your service, they get their own version of what you've built at `/agents` — their own agents, their own command center. The demo at `/launch-control` is just the public window into your instance of it. You're building the product by building this for yourself first.

---

## The Problem Right Now

To manage the agent team today, you have to check three separate places:

- **Slack** — to see what agents are doing (confirmations like "✅ Pushed brief-slug", errors like "⚠️ Convex push failed")
- **Launch Control** — to review and approve work (briefs, LinkedIn posts via Kanban)
- **/agents** — to chat with individual agents

The goal is to make `/agents` the single private command center — so Slack becomes optional, not required, for daily agent management.

---

## What We Are NOT Doing

- Not changing how agents work or when they run
- Not changing the cron schedule or timing
- Not removing Slack — agents keep posting there too. We're adding the UI as a second destination, not replacing Slack.
- Not touching how agents push data to Convex (briefs, blogs, etc.) — those flows stay identical

---

## Navigation: The Icon Rail

The current `/agents` page has a simple toggle idea (Status/Chat). That doesn't scale as we add more sections. Instead, the right model is a **persistent left icon rail** — like VS Code or Figma's sidebar — where each icon represents a section:

```
[●]  Status      — What are agents doing right now?
[💬] Chat        — Talk to any agent
[📁] Files       — Agent identity, skills, memory ("employee files")
[📋] Kanban      — Review and approve agent work (migrating here later)
```

Clicking an icon switches the main content area. The secondary panel (conversation list, agent list, file list) adjusts to match the active section. Adding a new section in the future is just a new icon — no layout rethink needed.

---

## The Four Sections

### Section 1 — Status: "What's happening right now"

Two things side by side:

**Left: Activity Feed**
Agents already push milestone updates to Convex (scan complete, brief created, blog published). There's already a live feed of this in Launch Control. We just need to bring it into `/agents`.

The gap: right now agents only log major milestones to Convex. The shorter status messages ("✅ Pushed brief-slug", "Starting Reddit scan...") only go to Slack. The fix: each agent pushes these messages to Convex too — same message, two destinations. No change to cron behavior, just an extra push call.

*What it looks like:* A scrollable live feed. Each entry: agent name + color, message, timestamp. Can filter by agent. Last 24-48 hours visible.

**Right: Cron Schedule**
The current schedule table in Launch Control is hardcoded in the codebase — written by hand as a visual placeholder. It does not reflect what's actually running on VPS. This needs to be fixed regardless.

The right approach: Parthasarathi manages all cron jobs on VPS. He pushes the current cron list to Convex at each 8 AM health check (same way agents push briefs or blogs). The UI reads from Convex. When a cron is added or changed, Parthasarathi pushes the update — UI reflects it automatically.

*What it looks like:* A chronological list for today. Each row: time (IST), which agent, what the job does. Completed jobs get a checkmark. A "NOW" marker separates past and upcoming. This same real data also feeds the public cron view in `/launch-control` — one source of truth for both.

Once Parthasarathi is pushing real data, the hardcoded `DAILY_SCHEDULE` array in the codebase gets deleted. It was always wrong.

---

### Section 2 — Chat: "Talk to any agent"

The existing chat interface, completely unchanged. Persistent conversation history per agent, streaming responses, same proxy to VPS.

One important clarification: **chatting with Parthasarathi via the web UI works exactly the same as chatting in any other OpenClaw interface.** He still has all his VPS tools — file editing, running git, updating cron schedules, sending messages to other agents. The web UI is just a new front door to the same Parthasarathi. The conversation being saved to Convex is just a side effect that gives you history — it doesn't change what he can do.

---

### Section 3 — Agent Files: "Employee files"

Each agent on VPS has a set of files that define who they are:
- `SOUL.md` — their personality, values, how they think
- `IDENTITY.md` — their role, capabilities, how they introduce themselves
- `HEARTBEAT.md` — their daily schedule and cron behavior
- `MEMORY.md` — what they've learned and remember across sessions
- `skills/` folder — individual SKILL.md files for each capability (e.g., how to push to Convex, how to create a GitHub PR)

Right now you can only see these by digging into the local file mirror or asking Parthasarathi. There's no clean UI for it.

**How it works:** Parthasarathi already auto-commits and pushes all these files to GitHub at 10 PM daily. We extend that sync: he also pushes the content of SOUL.md, IDENTITY.md, HEARTBEAT.md, and each SKILL.md to Convex's `documents` table (which already exists for exactly this kind of content). The UI reads from Convex and displays them as clean readable pages.

*What it looks like:* Selecting an agent shows their "file." Tabs within the file: Soul, Identity, Heartbeat, Memory, Skills. Each tab shows the markdown content. Read-only. Updates automatically after Parthasarathi's 10 PM sync.

This gives you a single place to review and understand each agent — useful when onboarding a client to show them what their agents "are."

---

### Section 4 — Kanban: "Review and approve work" (migrating here later)

Currently lives in `/launch-control`. The plan is to move it to `/agents` so the command center is truly complete. When this happens, `/launch-control` becomes purely public-facing — no private tools at all.

This is a later phase. The Kanban is fully functional where it is. Moving it is a UI relocation, not a rebuild. Plan it, but don't rush it.

---

## What Stays in Slack / What Changes

| Today | After this build |
|-------|-----------------|
| Agent confirmations (✅/⚠️) — Slack only | Slack + `/agents` activity feed |
| Milestone logs (scan_complete, brief_created) — Convex + Launch Control | Same data, now also in `/agents` Status |
| Cron schedule — hardcoded and inaccurate | Parthasarathi pushes real schedule → both `/agents` and `/launch-control` read from Convex |
| Agent files (SOUL.md, skills) — VPS only, no UI | Parthasarathi pushes to Convex → visible in `/agents` Files section |
| Agent chat — `/agents` | Unchanged |
| Kanban — `/launch-control` | Stays for now, moves to `/agents` in a later phase |

---

## Resilience: What Happens When OpenClaw Updates?

OpenClaw and Convex are fully decoupled. Here's what that means in practice:

- Convex stores data. It doesn't care what version OpenClaw is running.
- The web chat proxy talks to VPS via one standard endpoint (`/v1/chat/completions`). OpenClaw updates don't change this format — it follows the standard OpenAI API shape.
- Agent files get pushed to Convex at 10 PM by Parthasarathi. An OpenClaw update might add new capabilities but the push mechanism stays the same.

**The only real risk:** if an OpenClaw update changes how a SKILL.md works internally, agents might push data in a slightly different format. But the Convex schema is flexible enough to handle minor variations, and Parthasarathi would catch any breakage in his health checks.

**Short version:** Update OpenClaw freely. It doesn't break the UI or Convex.

---

## Convex Free Tier — How Long Does It Last?

Current estimated monthly write volume:

| Source | Est. per month |
|--------|---------------|
| Vibhishana questions (Reddit scans) | 1,500–3,000 |
| Briefs, blogs, LinkedIn posts, enrichments | ~330 |
| Agent activity milestones | ~500 |
| Vidura clusters + tool opportunities | ~75 |
| Shakti tasks | ~120 |
| Conversations + messages | ~200 |
| **Total today** | **~2,700–4,200/month** |

Convex free tier limit: **50,000 writes/month**.

You're currently at roughly 5–8% of the limit. Even adding verbose activity logs (another ~4,500/month), agent file syncs (~180/month from Parthasarathi), and cron config pushes (~30/month), you'd be at around 20% of the limit. Comfortable for the foreseeable future. No action needed.

---

## Hardcoded Things to Fix

The `DAILY_SCHEDULE` array in `lib/launch-control-types.ts` is the main problem — it's inaccurate and misleading. When Parthasarathi starts pushing real cron data, this array gets deleted.

Other things that are technically hardcoded but intentionally so (fine to keep):
- The 6 agents array in `components/agents/types.ts` — agent identity, colors, avatars. Only needs updating if you add or rename an agent.
- Agent name strings in some Convex queries — not a problem unless agents are renamed.

---

## What's Explicitly Deferred

These ideas are noted but not planned for this build:

- **Directives / @mention from UI** — sending tasks to agents from the UI. The problem: agents only pick them up at their next cron run (could be hours). Not a satisfying experience yet. Revisit when there's a better trigger mechanism.
- **Standup / cross-agent coordination** — agents don't talk to each other directly. Any "standup" would just be a summary of Convex data. Not urgent.
- **Replacing Slack entirely** — not the goal. Slack stays. UI is an addition, not a replacement.

---

## Build Sequence (When Ready)

**Phase 1 — UI Shell (no backend changes)**
Build the icon rail navigation. Status, Chat, Files, (Kanban placeholder). Bring the existing LiveFeed component from Launch Control into the Status section. Wire up the agent roster panel that adjusts per section. No new Convex tables yet — just restructuring the UI.

**Phase 2 — Real Cron Schedule**
Add `cronJobs` table to Convex. Add `/push/cron-config` endpoint. Send Parthasarathi the instructions to push cron config at each 8 AM health check. Delete the hardcoded `DAILY_SCHEDULE` from the codebase. Both `/agents` and `/launch-control` read cron data from Convex.

**Phase 3 — Richer Activity Messages**
Add optional `details` field to the `agentActivity` table. Update each agent's SKILL.md (via Parthasarathi) to include the verbose status message in their Convex activity pushes — the same content they currently send to Slack. Feed items in the UI get an expandable details section.

**Phase 4 — Agent Files**
Extend Parthasarathi's 10 PM sync: also push SOUL.md, IDENTITY.md, HEARTBEAT.md, and all SKILL.md files to Convex `documents` table. Build the Files section UI — per-agent file viewer with tabs.

**Phase 5 — Kanban Migration**
Move the Kanban from `/launch-control` to `/agents`. `/launch-control` becomes fully public-facing — demo only, no private tools. This is a UI relocation, not a data rebuild.

---

## Open Questions

1. **Agent activity coverage:** Do all 6 agents currently push to the `agentActivity` table in Convex, or only some? If Shakti or Valmiki are missing, their Status feed will be empty. This needs a quick audit before Phase 1 goes live.

2. **Agent Files — what to include:** SOUL.md, IDENTITY.md, HEARTBEAT.md, MEMORY.md, and skills are the obvious ones. Are there other files per agent worth surfacing (e.g., community lists, templates, research docs)?

3. **Launch Control public view — scope after Kanban moves:** Once Kanban migrates to `/agents`, what exactly stays in `/launch-control`? Current candidates: activity feed (public), blog/brief/post counts (scoreboard), agent roster (who the agents are), and the real cron schedule. Confirm this list before building Phase 5.
