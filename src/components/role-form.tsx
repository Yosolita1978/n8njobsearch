"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProgress } from "@/lib/progress";
import { ui } from "@/content/ui";
import type { Lang } from "@/lib/course";

// The single required input on the landing page. Writing a role unlocks
// the course and is woven into lesson copy from then on.

export function RoleForm() {
  const router = useRouter();
  const { hydrated, role, lang, setRole } = useProgress();
  const [draft, setDraft] = useState("");

  const activeLang: Lang = hydrated ? lang : "en";
  const t = ui[activeLang].roleForm;

  // Once hydrated, seed the box with any role already saved.
  const value = draft || (hydrated ? role : "");

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const trimmed = value.trim();
    if (trimmed.length === 0) return;
    setRole(trimmed);
    router.push("/course");
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label htmlFor="role" className="block text-sm font-medium">
        {t.label}
      </label>
      <input
        id="role"
        name="role"
        type="text"
        value={value}
        onChange={(event) => setDraft(event.target.value)}
        placeholder={t.placeholder}
        className="w-full rounded-lg border border-border bg-card px-4 py-3 text-base outline-none focus:border-accent"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={value.trim().length === 0}
        className="w-full rounded-lg bg-accent px-4 py-3 text-base font-semibold text-white disabled:opacity-40"
      >
        {t.submit}
      </button>
      <p className="text-xs text-muted">{t.privacy}</p>
    </form>
  );
}
