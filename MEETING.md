# 45-Minute Live Walkthrough — The Job Hunter Workflow

**Audience:** software engineers who have never touched n8n.
**Goal of the talk:** they leave understanding *how n8n thinks*, having seen one real automation run end to end, and wanting to build their own (→ point them at the self-paced course).
**This is NOT the course.** The course is for building. This talk is for *seeing it work* and understanding the one hard idea. Show, don't make them build along.

---

## Before you start (prep checklist)

- [ ] Workflow open in n8n, **already tested today** with a fresh run.
- [ ] At least one job in the DB deleted so a live run produces a *new* match (so the alert actually fires on stage).
- [ ] Telegram open on your phone **and** mirrored on screen, so the alert landing is visible to the room.
- [ ] The Google Drive "Cover Letters" folder open in a tab.
- [ ] Score gate temporarily lowered enough that at least one job qualifies for a letter during the demo.
- [ ] **Fallback ready:** a 60–90s screen recording of a successful full run, in case live n8n / SerpApi / OpenAI misbehaves. If anything stalls for >15s on stage, cut to the recording and keep talking.
- [ ] Credentials panel closed / secrets not on screen.

---

## Run of show (timings are targets, not laws)

### 0:00–0:05 — Hook: watch it work (no theory yet)
- One sentence: *"Every morning a small robot checks a job board, scores what it finds, and writes me a cover letter for the good ones. Here it is."*
- **Hit Execute on the live workflow.** Let it run.
- While it runs, narrate the shape out loud — *search → filter → remember → score → deliver* — pointing at the canvas, not explaining yet.
- Payoff: the Telegram alert lands on your phone (on screen), and a cover letter appears in the Drive folder.
- *"That's the whole thing. For the next 40 minutes I'll show you how it works — and the one bug that taught me how n8n really behaves."*

### 0:05–0:15 — The one mental model engineers need
This is the part that makes n8n "click" for programmers. Keep it concrete on the canvas.
- **Everything is a list of items.** Each item is `{ "json": { ... } }`. Most nodes run once per item. Open a node's output panel and show a real item.
- **Expressions** are `{{ }}` — small code that pulls a value out of the item flowing in. Show one live (e.g. `{{ $json.url }}`).
- **`$json` is the current item; `$('Node Name')` reaches an earlier node by name.** Show both. This is the vocabulary everything else uses.
- Anchor line: *"If you understand 'list of items' and 'expressions', you can read this entire workflow."*

### 0:15–0:30 — Walk 3–4 real nodes, reading the output panel each time
Don't tour every node. Pick these four and **open the output panel** on each so they see real data move:
1. **HTTP Request → SerpApi** — a real search for the role. Show `organic_results`. *"Real data, not a demo."*
2. **Remote Gate (Code node)** — the honest part. The site has no machine-readable "remote" field, so we read the visible label and scrape JSON-LD. And critically: jobs that are "remote but must be local" get **flagged, not dropped.** *"Real data has no neat flag. You scrape what's on the page, not what you wish was there."*
3. **AI scoring (AI Agent)** — model reads the posting, returns `{score, reason}` as JSON. Show the output. Flag the gotcha: *"It comes back as a string of JSON, not an object — you parse it."*
4. **Deliver (Create a row → Telegram / Sheets)** — one node's output fans out to several. Show the saved row and the alert.
- Thread the dedup idea in passing: *"Supabase remembers every url it's seen, so tomorrow it only tells me about new jobs."*

### 0:30–0:40 — The peak: the bug that teaches the lesson
This is the emotional and intellectual center. Slow down here.
- Set it up: *"I built this, it worked, I shipped it. Then one morning two strong matches came in — and **both cover letters had the same job's title.** The letter text was right. The title was wrong."*
- Show why on the canvas:
  - `.first()` always returns the first job → every letter gets its title.
  - `$itemIndex` *looks* right, but **order isn't preserved across an AI node either.**
- The real lesson: *"AI nodes break paired-item links and ordering. The fix isn't a cleverer index — it's a different shape."*
- The fix: **Loop Over Items**, batch size 1. Process exactly one job at a time, so every reference is unambiguous again. Show the loop and the loop-back wire. *"The loop-back wire is what makes it iterate — without it, it runs once and stops."*
- Why engineers care: this is a concurrency/data-provenance bug in disguise — familiar territory, new tool. That's the hook that makes them respect n8n instead of dismissing it.

### 0:40–0:45 — Land it and hand off
- Recap in one breath: *"Search, filter honestly, remember, score, deliver, and don't trust pairing across an AI node."*
- The ask: *"You're engineers — you'll build this faster than I did. The self-paced course walks you through every node, ends with you pointing it at your own target role, and yes, it makes you reproduce that bug on purpose."*
- Show the course landing page / URL.
- Open Q&A.

---

## If you're running long
Cut from the **0:15–0:30** node walk first — drop to two nodes (Remote Gate + AI scoring). **Never cut the bug story (0:30–0:40)** — it's the whole point.

## If you're running short
Expand the bug story: open both wrong documents from a real two-match run and let the room sit with "same title" before you reveal why. Discomfort is the teacher here.

## One-line answers for likely questions
- *"Why n8n and not a script?"* — You could script it. n8n gives you the schedule, the retries, the credentials, and a visual data panel for free, and non-engineers on your team can read it.
- *"Does the AI make stuff up in the letter?"* — It's grounded: the prompt gets your real resume and the real job description, nothing else. No invented experience.
- *"Is the scraping fragile?"* — Yes, deliberately shown that way. The course teaches reading the output panel and flagging nuance rather than pretending the data is clean.
