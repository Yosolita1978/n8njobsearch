# 45-Minute Live Walkthrough — The Job Hunter Workflow

**Audience:** software engineers who have never touched n8n.
**Goal of the talk:** they leave understanding *the basics of how an n8n workflow works* — having seen one real automation run end to end, from a job-board search to an alert on their phone — and wanting to build their own.
**This is NOT the course.** The course is for building. This talk is for *seeing it work* and grasping the core ideas. Show, don't make them build along.

**Scope for this talk:** we follow one pipeline only — **search → filter → remember → score → deliver to Telegram.** (The workflow can also write cover letters; we're deliberately *not* covering that today so we can go deep on the core flow in 45 minutes.)

**The course is live → https://n8njobsearch.vercel.app/** — point them here at the end. It walks every node step-by-step with screenshots, and has a "Working from a template" section where they import the finished workflow in one click.

**Where "the basics" live:** triggers (how a workflow starts) + the data model + the five real stages (**0:08–0:40**) is the teaching. The first basics slide is **"How does a workflow start?" — it starts with a trigger.** If you only have time for one thing, it's the trigger idea plus the "list of items / expressions" model (0:08–0:18), and the Remote Gate node is the moment that makes it land.

---

## Before you start (prep checklist)

- [ ] Workflow open in n8n, **already tested today** with a fresh run.
- [ ] At least one job in the DB deleted so a live run produces a *new* match (so the alert actually fires on stage). SQL: `delete from public.job_alerts where url = '<job url>';` (run in Supabase).
- [ ] Telegram open on your phone **and** mirrored on screen, so the alert landing is visible to the room.
- [ ] Score gate temporarily lowered enough that at least one job qualifies as a match during the demo, so the Telegram alert fires (put it back to 7 after).
- [ ] **Course open in a tab** at https://n8njobsearch.vercel.app/ for the hand-off.
- [ ] **Fallback ready:** the ~90s demo video on the course landing page plays if live n8n / SerpApi / OpenAI stalls. If anything hangs >15s on stage, cut to it and keep talking.
- [ ] Credentials panel closed / secrets not on screen.

---

## Run of show (timings are targets, not laws)

### 0:00–0:03 — About me (slide)
- Quick and warm — this is *why* the demo exists, not a résumé read.
- Fullstack software engineer and **learning designer**.
- Founder of **ComadreLab.dev**, a bilingual web and AI studio.
- *"Currently in my 2026 job search — which is exactly why I built this."* That line earns the demo: this is a real tool I actually use, not a toy.

### 0:03–0:08 — Hook: watch it work (no theory yet)
- One sentence: *"Every morning a small robot checks a job board, scores what it finds, and pings my phone the moment a good one shows up. Here it is."*
- **Hit Execute on the live workflow.** Let it run.
- While it runs, narrate the shape out loud — *search → filter → remember → score → deliver* — pointing at the canvas, not explaining yet.
- Payoff: the Telegram alert lands on your phone (on screen).
- *"That's the whole thing. For the next 40 minutes I'll show you how it works — five steps, end to end."*

### 0:08–0:13 — How does a workflow start? (THE BASICS, part 1 — triggers slide)
This is the first basics slide. The scope here is **triggers** — keep it tight, this is the one concept to nail before anything moves.
- **A workflow does nothing until its first node fires. The trigger is always the first node.** Point at it on the canvas.
- Three common triggers: **Schedule · Webhook · Manual click.** One line each is enough.
- **Ours runs on a Schedule, every morning** — that's why I wake up to jobs already on my phone. (On stage you'll fire it with Manual click so the room sees it run now, but in production it's the schedule doing the work.)
- Anchor line: *"Pick how it starts, and the rest of the workflow is just steps wired after the trigger."*

### 0:13–0:18 — The mental model engineers need (THE BASICS, part 2)
This is the part that makes n8n "click" for programmers. Keep it concrete on the canvas.
- **Everything is a list of items.** Each item is `{ "json": { ... } }`. Most nodes run once per item. Open a node's output panel and show a real item.
- **Expressions** are `{{ }}` — small code that pulls a value out of the item flowing in. Show one live (e.g. `{{ $json.url }}`).
- **`$json` is the current item; `$('Node Name')` reaches an earlier node by name.** Show both. This is the vocabulary everything else uses.
- **Nodes are typed steps wired left to right; one output can fan out to many.** Point at a node that feeds two others.
- Anchor line: *"If you understand 'list of items' and 'expressions', you can read this entire workflow."*

### 0:18–0:40 — Walk the five stages, reading the output panel each time
This is the body of the talk. Take each stage in order, **open the output panel** on the key node so they see real data move, and tie each one back to the *search → filter → remember → score → deliver* shape (real node names in **bold**). This is where the freed-up time goes — don't rush; let them read the data on each panel.

1. **SEARCH — HTTP Request → SerpApi.** A real search for the role. Show `organic_results`. *"Real data, not a demo — this is the live job board."*
2. **FILTER — Remote Gate (Code node).** The honest part, and the moment to slow down. The site has no machine-readable "remote" field, so we read the visible label and scrape JSON-LD. And critically: jobs that are "remote but must be local" get **flagged, not dropped.** *"Real data has no neat flag. You scrape what's on the page, not what you wish was there."* This is the lesson engineers should leave with — it's why n8n's visual data panel matters.
3. **REMEMBER — Get many rows / Check for new alerts.** These nodes remember every url already saved, so tomorrow the workflow only alerts on jobs it hasn't seen. Show the existing rows, then show a new url passing the check. *"This is the difference between a script you run once and an automation you trust every morning — it has a memory."*
4. **SCORE — AI Agent + OpenAI Chat Model.** The agent is the orchestrator, the chat model is the brain plugged into it. It reads the posting and returns `{score, reason}` as JSON. Show the output. Flag the gotcha: *"It comes back as a string of JSON, not an object — you parse it with `JSON.parse` before you can use the score."*
5. **DELIVER — Create a row → Telegram.** One node's output fans out: the match is saved to the database *and* pushed to Telegram. Show the saved row, then point at the phone as the alert lands. *"That's the payoff — the good job is on my phone before I've had coffee."*

### 0:40–0:45 — Land it and hand off
- Recap in one breath: *"Search, filter honestly, remember what you've seen, score it, and deliver it where you'll actually look — your phone."*
- The ask: *"You're engineers — you'll build this faster than I did."*
- **Show the live course: https://n8njobsearch.vercel.app/** — self-paced, 9 modules, every node with screenshots.
- **Mention the shortcut:** the "Working from a template" section lets them **import the whole finished workflow** in one click and just reconnect their own credentials (SerpApi, Supabase, OpenAI, Telegram) — no building from scratch required.
- Open Q&A.

---

## If you're running long
Cut from the **0:18–0:40** stage walk first — drop to three stages (Search, Filter, Deliver), since those carry the end-to-end story. **Never cut the trigger slide or 0:13–0:18 (the basics)** — that's the whole point. The Remote Gate (Filter) is the one node to protect if you can only keep one.

## If you're running short
Expand the **Filter (Remote Gate)** beat: open a job that's labeled remote but is actually local-only, and let the room sit with "the page lied" before you show how the node flags it. Then expand the **Remember** beat — run the workflow twice live and show that the second run produces no duplicate alert. Both reinforce why this is an *automation*, not a script.

## One-line answers for likely questions
- *"Why n8n and not a script?"* — You could script it. n8n gives you the schedule, the retries, the credentials, and a visual data panel for free, and non-engineers on your team can read it.
- *"How does it not spam me every day with the same jobs?"* — The Remember step: every saved url is checked before delivery, so you only ever get alerted once per job.
- *"Is the scraping fragile?"* — Yes, deliberately shown that way. The course teaches reading the output panel and flagging nuance rather than pretending the data is clean.
- *"Can I just get the workflow?"* — Yes. The course's "Working from a template" section has the whole thing as an importable file; you reconnect your own credentials and go.
- *"Where do the API keys / secrets live?"* — In each person's own n8n credentials, never in the workflow file or the course. The shared template ships with placeholders.
- *"Does it also write cover letters?"* — It can, and the course covers that — but it's a separate part of the flow we're skipping today to focus on the core search-to-alert pipeline.
```
