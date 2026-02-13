# Blog Owner Guide

> This is for you (the repo owner / non-technical founder). It explains how to set up GitHub permissions, protect your live site, and review blog posts that the AI agent submits.

---

## How It All Works (The Big Picture)

```
Your AI agent (via OpenClaw)
  writes a blog post as code
  and submits it as a "Pull Request" (PR)
        ↓
You get a notification on GitHub
        ↓
You review it (optionally preview on your laptop)
        ↓
You click "Merge" on GitHub
        ↓
Netlify auto-deploys → blog page is live on thelaunch.space
```

The agent can never publish anything on its own. Every blog post goes through you first.

---

## Git & GitHub Concepts (Quick Reference)

If you're not deeply technical, here's all you need to know:

### Key Terms

| Concept | Simple explanation |
|---------|-------------------|
| **Branch** | A copy of the code where you make changes without affecting the live site |
| **Pull Request (PR)** | "Here are my proposed changes — review before they go live" |
| **Merge** | "Approved — make it live" |
| **Request Changes** | "Fix these things first" (PR stays open, agent updates it) |
| **Close PR** | "Nope, throw this away" (nothing happens to the live site) |
| **`main` branch** | The live site. Protected. Only gets changes through merged PRs. |
| **`staging` branch** | Your personal workspace for landing page changes |
| **`blog/*` branches** | The agent's workspace for blog posts |

### What is a Pull Request?

A PR is literally a **request** that says: "I've made changes on this branch — please **pull** them into another branch."

Think of it like a Google Doc suggestion. Someone proposes edits, you see exactly what changed (highlighted in green/red), and you either approve or reject.

**Without PRs:**
```
You code on staging → push staging → merge into main → Live
```

**With PRs:**
```
Someone codes on a branch → Opens a PR → You review → Approve & Merge → Live
```

The PR is the review step in between. It's where you pause and say "let me look at this before it goes live."

### What Happens When You Don't Approve?

You have 3 options on any PR:

| Action | What it does |
|--------|-------------|
| **Approve & Merge** | Changes go into `main`, Netlify deploys, page goes live |
| **Request Changes** | You leave a comment saying what's wrong. The PR stays open. The agent (or you) fixes it and pushes again to the same branch. The PR updates automatically. |
| **Close PR** | Reject it entirely. Nothing happens. Changes are thrown away. The site stays exactly as it was. |

Nothing goes live unless you click Merge. Closing a PR is harmless — no code is lost from main, no damage done.

### Your Workflow for Your Own Changes (Landing Page, etc.)

For your own work on the landing page or non-blog stuff, you can keep doing what you've been doing:

```bash
# Work on staging as usual
git checkout staging
# ... make changes, test locally ...
git add <files>
git commit -m "your message"
git push origin staging

# When ready to go live, merge to main via PR on GitHub:
# Go to GitHub → Pull requests → New pull request
# Base: main ← Compare: staging
# Create PR → Review it → Merge it yourself
```

Using PRs even for yourself is good practice — it gives you a clear history of what went live and when.

---

## One-Time Setup (Do These Once)

### 1. Protect the `main` Branch

This ensures nobody (including the agent) can push directly to the live site. Everything must go through a Pull Request that you approve.

1. Go to your repo: https://github.com/thelaunch-space/thelaunch-space-tweet-sized-landing-page
2. Click **Settings** (top menu)
3. In the left sidebar, click **Branches**
4. Click **Add branch protection rule** (or "Add classic branch protection rule")
5. In "Branch name pattern", type: `main`
6. Check these boxes:
   - ✅ **Require a pull request before merging**
   - ✅ **Require approvals** → set to **1**
7. Click **Create** (or **Save changes**)

Now even if someone has write access, they can't push to `main` — they have to open a PR that you approve.

### 2. Create a GitHub Token for the Agent

This gives the agent limited access to your repo — just enough to create branches and open PRs, nothing more.

1. Go to: https://github.com/settings/tokens?type=beta (GitHub → Settings → Developer Settings → Fine-grained tokens)
2. Click **Generate new token**
3. Name it something like: `openclaw-blog-agent`
4. Set expiration to whatever you're comfortable with (e.g., 90 days — you can regenerate later)
5. **Resource owner**: Select `thelaunch-space` (your org)
6. **Repository access**: Select **Only select repositories** → pick `thelaunch-space-tweet-sized-landing-page`
7. **Permissions** (under Repository permissions):

   | Permission | Set to |
   |-----------|--------|
   | **Contents** | Read and write |
   | **Pull requests** | Read and write |
   | **Metadata** | Read *(auto-selected)* |

   Leave everything else as "No access".

8. Click **Generate token**
9. **Copy the token** — you'll give this to OpenClaw. You won't see it again.

### What this token allows the agent to do:
- ✅ Create new branches
- ✅ Add files to those branches
- ✅ Open Pull Requests for your review
- ✅ Read the repo contents

### What this token does NOT allow:
- ❌ Push directly to `main` (blocked by branch protection)
- ❌ Merge Pull Requests (only you can do this)
- ❌ Delete branches or files
- ❌ Change repo settings
- ❌ Access any other repository

### 3. Give the Token to OpenClaw

In your OpenClaw setup, configure the GitHub integration with:
- **Repository:** `thelaunch-space/thelaunch-space-tweet-sized-landing-page`
- **Token:** *(the token you just generated)*

Also provide the agent with the two instruction docs:
- `docs/BLOG-AGENT-INSTRUCTIONS.md`
- `docs/BLOG-STYLE-REFERENCE.md`

### 4. Set the Webhook URL in Netlify

If you haven't already (from the Next.js migration):
1. Go to Netlify → your site → **Site configuration** → **Environment variables**
2. Add: `WEBHOOK_URL` = your Make.com webhook URL
3. *(Remove the old `VITE_WEBHOOK_URL` if it's still there)*

---

## Your Review Workflow (Every Time a Blog Post is Submitted)

### What You'll See

When the agent submits a blog post, you'll get a GitHub notification (email or GitHub mobile app). The PR will look like:

> **Add blog: Why Founders Fail at MVPs**
>
> ## New Blog Post
> - **Title:** Why Founders Fail at MVPs (And How to Fix It)
> - **Topic:** startup-mvps
> - **URL:** thelaunch.space/blogs/startup-mvps/why-founders-fail-at-mvps
> - **Summary:** Covers the 5 most common MVP mistakes founders make...

### Quick Review (If You Just Want to Check and Merge)

1. Open the PR on GitHub
2. Click the **Files changed** tab
3. You'll see one file: `app/blogs/<topic>/<slug>/page.tsx`
4. Skim the content — does it read well? Is the title good?
5. If it looks good, click **Merge pull request** → **Confirm merge**
6. Netlify auto-deploys in ~1-2 minutes
7. Visit `thelaunch.space/blogs/<topic>/<slug>` to see it live

### Full Review (If You Want to Preview Locally)

1. Open Terminal on your Mac
2. Navigate to your project folder:
   ```
   cd ~/Desktop/Work/thelaunch.space/project\ folders/thelaunch.space\ projects/completed-projects/thelaunch-space-tweet-sized-landing-page
   ```
3. Pull the agent's branch:
   ```
   git fetch origin
   git checkout blog/<topic>/<slug>
   ```
4. Start the dev server:
   ```
   npm run dev
   ```
5. Open `http://localhost:3000/blogs/<topic>/<slug>` in your browser
6. Check:
   - Does it look right? (dark background, correct fonts, proper spacing)
   - Does the content read well?
   - Is the back link working? (← thelaunch.space)
   - Is the CTA button at the bottom?
7. When done, go back to GitHub and merge (or request changes)
8. Switch back to main:
   ```
   git checkout main
   git pull
   ```

### If Something Looks Wrong

You have two options:

**Option A: Tell the agent to fix it**
On the PR page, click **Review changes** → **Request changes**, and write what you want fixed in plain English. Example: *"The opening paragraph is too long. Make it 2 sentences. Also change the title to 'How to Ship an MVP in 21 Days'."* The agent reads this, makes the fix, pushes to the same branch, and the PR updates automatically.

**Option B: Ask Claude Code to fix it**
If the agent doesn't get it right, or you want more direct control:
1. In Terminal, checkout the agent's branch:
   ```
   git fetch origin
   git checkout blog/<topic>/<slug>
   ```
2. Open Claude Code in this project
3. Prompt it in plain English: *"Open the blog post at app/blogs/startup-mvps/why-founders-fail/page.tsx and make the opening paragraph shorter"*
4. Review the change, then push:
   ```
   git add .
   git commit -m "Revise opening paragraph"
   git push origin blog/<topic>/<slug>
   ```
5. The PR on GitHub updates automatically with your fix. Now you can merge it.

You don't need to know how to code — just describe what you want changed and let Claude Code or the agent handle the actual edit.

---

## What to Check in Each Blog Post

Here's a simple checklist for your review:

| Check | What to look for |
|-------|-----------------|
| **Content quality** | Does it read well? Is it helpful? Not spammy? |
| **Title** | Clear, compelling, not too long |
| **Only touches `app/blogs/`** | The PR should only add ONE new file. If it modifies anything else, reject it. |
| **URL makes sense** | The folder path = the URL. Does it look clean? |
| **Has a CTA** | Should link back to thelaunch.space homepage |

You don't need to verify the SEO metadata or code structure — the agent's instructions already enforce that. Focus on content quality and whether you'd be proud to have it on your site.

---

## FAQ

**Q: Can the agent accidentally break the live landing page?**
A: No. The agent can only add files inside `app/blogs/`. It cannot modify the landing page, components, or config. And nothing goes live until you merge.

**Q: What if I want to delete a blog post later?**
A: Delete the folder (e.g., `app/blogs/startup-mvps/why-founders-fail-at-mvps/`) and push to `main`. Netlify rebuilds and the page is gone.

**Q: What if the agent submits garbage?**
A: Just close the PR without merging. Nothing happens. The blog post never goes live.

**Q: How fast do new posts go live after merging?**
A: Netlify typically rebuilds in 1-2 minutes after a merge.

**Q: What if I need to edit a blog post after it's live?**
A: Edit the `page.tsx` file directly on GitHub (click the pencil icon), or pull locally, edit, commit, push to `main`.

**Q: What happens if the GitHub token expires?**
A: The agent stops being able to create PRs. Just generate a new token (same steps as setup) and update it in OpenClaw.

**Q: Can I have multiple agents or people submitting blog posts?**
A: Yes. Each creates their own branch and PR. You review and merge each one independently.
