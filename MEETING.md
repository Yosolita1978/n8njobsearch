# 45-Minute Live Walkthrough — The Job Hunter Workflow

**Audience:** software engineers who have never touched n8n.
**Goal of the talk:** they leave understanding *the basics of how an n8n workflow works* — having seen one real automation run end to end — and wanting to build their own.
**This is NOT the course.** The course is for building. This talk is for *seeing it work* and grasping the core ideas. Show, don't make them build along.

**The course is live → https://n8njobsearch.vercel.app/** — point them here at the end. It walks every node step-by-step with screenshots, and has a "Working from a template" section where they import the finished workflow in one click.

**Where "the basics" live:** the data model + a few real nodes (**0:05–0:30**) is the teaching. The bug story (**0:30–0:40**) is the payoff that makes it stick. If you only have time for one thing, it's 0:05–0:15.

---

## Before you start (prep checklist)

- [ ] Workflow open in n8n, **already tested today** with a fresh run.
- [ ] At least one job in the DB deleted so a live run produces a *new* match (so the alert actually fires on stage). SQL: `delete from public.job_alerts where url = '<job url>';` (run in Supabase).
- [ ] Telegram open on your phone **and** mirrored on screen, so the alert landing is visible to the room.
- [ ] The Google Drive "Cover Letters" folder open in a tab.
- [ ] Score gate temporarily lowered enough that at least one job qualifies for a letter during the demo (put it back to 7 after).
- [ ] **Course open in a tab** at https://n8njobsearch.vercel.app/ for the hand-off.
- [ ] **Fallback ready:** the ~90s demo video on the course landing page plays if live n8n / SerpApi / OpenAI stalls. If anything hangs >15s on stage, cut to it and keep talking.
- [ ] Credentials panel closed / secrets not on screen.

---

## Run of show (timings are targets, not laws)

### 0:00–0:05 — Hook: watch it work (no theory yet)
- One sentence: *"Every morning a small robot checks a job board, scores what it finds, and writes me a cover letter for the good ones. Here it is."*
- **Hit Execute on the live workflow.** Let it run.
- While it runs, narrate the shape out loud — *search → filter → remember → score → deliver* — pointing at the canvas, not explaining yet.
- Payoff: the Telegram alert lands on your phone (on screen), and a cover letter appears in the Drive folder.
- *"That's the whole thing. For the next 40 minutes I'll show you how it works — and the one bug that taught me how n8n really behaves."*

### 0:05–0:15 — The one mental model engineers need (THE BASICS)
This is the part that makes n8n "click" for programmers. Keep it concrete on the canvas.
- **Everything is a list of items.** Each item is `{ "json": { ... } }`. Most nodes run once per item. Open a node's output panel and show a real item.
- **Expressions** are `{{ }}` — small code that pulls a value out of the item flowing in. Show one live (e.g. `{{ $json.url }}`).
- **`$json` is the current item; `$('Node Name')` reaches an earlier node by name.** Show both. This is the vocabulary everything else uses.
- **Nodes are typed steps wired left to right; one output can fan out to many.** Point at a node that feeds two others.
- Anchor line: *"If you understand 'list of items' and 'expressions', you can read this entire workflow."*

### 0:15–0:30 — Walk 3–4 real nodes, reading the output panel each time
Don't tour every node. Pick these and **open the output panel** on each so they see real data move (real node names in **bold**):
1. **HTTP Request → SerpApi** — a real search for the role. Show `organic_results`. *"Real data, not a demo."*
2. **Remote Gate (Code node)** — the honest part. The site has no machine-readable "remote" field, so we read the visible label and scrape JSON-LD. And critically: jobs that are "remote but must be local" get **flagged, not dropped.** *"Real data has no neat flag. You scrape what's on the page, not what you wish was there."*
3. **AI Agent + OpenAI Chat Model** — the agent is the orchestrator, the chat model is the brain plugged into it. It reads the posting and returns `{score, reason}` as JSON. Show the output. Flag the gotcha: *"It comes back as a string of JSON, not an object — you parse it with `JSON.parse`."*
4. **Deliver — Create a row → Telegram + Google Sheets** — one node's output fans out to several. Show the saved row and the alert.
- Thread the dedup idea in passing: *"The **Get many rows** and **Check for new alerts** nodes remember every url already saved, so tomorrow it only alerts on jobs it hasn't seen."*

### 0:30–0:40 — The peak: the bug that teaches the lesson
This is the emotional and intellectual center. Slow down here.
- Set it up: *"I built this, it worked, I shipped it. Then one morning two strong matches came in — and **both cover letters had the same job's title.** The letter text was right. The title was wrong."*
- Show why on the canvas (the `doc_title` in the **Prep Doc** Set node):
  - `.first()` always returns the first job → every letter gets its title.
  - `$itemIndex` *looks* right, but **order isn't preserved across an AI node either.**
- The real lesson: *"AI nodes break paired-item links and ordering. The fix isn't a cleverer index — it's a different shape."*
- The fix: **Loop Over Items**, batch size 1. Process exactly one job at a time, so every reference is unambiguous again. Show the loop and the loop-back wire. *"The loop-back wire is what makes it iterate — without it, it runs once and stops."*
- Why engineers care: this is a concurrency/data-provenance bug in disguise — familiar territory, new tool. That's the hook that makes them respect n8n instead of dismissing it.

### 0:40–0:45 — Land it and hand off
- Recap in one breath: *"Search, filter honestly, remember, score, deliver, and don't trust pairing across an AI node."*
- The ask: *"You're engineers — you'll build this faster than I did."*
- **Show the live course: https://n8njobsearch.vercel.app/** — self-paced, 9 modules, every node with screenshots, and it makes you reproduce that bug on purpose.
- **Mention the shortcut:** the "Working from a template" section lets them **import the whole finished workflow** in one click and just reconnect their own credentials (SerpApi, Supabase, OpenAI, Telegram, Google) — no building from scratch required.
- Open Q&A.

---

## If you're running long
Cut from the **0:15–0:30** node walk first — drop to two nodes (Remote Gate + AI scoring). **Never cut 0:05–0:15 (the basics) or the bug story (0:30–0:40)** — those are the whole point.

## If you're running short
Expand the bug story: open both wrong documents from a real two-match run and let the room sit with "same title" before you reveal why. Discomfort is the teacher here.

## One-line answers for likely questions
- *"Why n8n and not a script?"* — You could script it. n8n gives you the schedule, the retries, the credentials, and a visual data panel for free, and non-engineers on your team can read it.
- *"Does the AI make stuff up in the letter?"* — It's grounded: the prompt gets your real resume and the real job description, nothing else. No invented experience.
- *"Is the scraping fragile?"* — Yes, deliberately shown that way. The course teaches reading the output panel and flagging nuance rather than pretending the data is clean.
- *"Can I just get the workflow?"* — Yes. The course's "Working from a template" section has the whole thing as an importable file; you reconnect your own credentials and go.
- *"Where do the API keys / secrets live?"* — In each person's own n8n credentials, never in the workflow file or the course. The shared template ships with placeholders.
