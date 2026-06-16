# TODO

## Collect learner emails on the landing-page form (NOT today — review the whole course first)

**What:** Add an email field to the "Your target role" form on the landing page, so the form
captures the learner's email alongside their target role.

**Files involved:**
- `src/components/role-form.tsx` — the form itself (currently: role input + submit).
- `src/app/page.tsx` — the section that renders the form.

**Why:** So I actually get the learner's email. Then I could build an n8n workflow that emails
those people a thank-you for taking the course (or similar follow-up).

**Important — this is bigger than adding an input.** Right now the whole app is client-only:
the role lives in the browser's localStorage and nothing is ever sent anywhere. The form copy
even promises this: *"This stays in your browser only. Nothing is sent anywhere."*

To collect emails I would need to:
1. Send the email somewhere I can read it — a backend (Next.js API route, a form service,
   or a Supabase table). localStorage alone never reaches me.
2. Change/remove the "Nothing is sent anywhere" line, since that would no longer be true,
   and add a short note about what the email is used for (consent).
3. Decide where the emails are stored, and keep that list somewhere the n8n thank-you
   workflow can read.

**Status:** Deferred on purpose. Revisit after reviewing the full course.
