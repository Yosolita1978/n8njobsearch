"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useProgress } from "@/lib/progress";

// The single required input on the landing page. Writing a role unlocks
// the course and is woven into lesson copy from then on.

export function RoleForm() {
  const router = useRouter();
  const { hydrated, role, setRole } = useProgress();
  const [draft, setDraft] = useState("");

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
        Your target role, in one sentence
      </label>
      <input
        id="role"
        name="role"
        type="text"
        value={value}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="a fully remote instructional designer role"
        className="w-full rounded-lg border border-border bg-card px-4 py-3 text-base outline-none focus:border-accent"
        autoComplete="off"
      />
      <button
        type="submit"
        disabled={value.trim().length === 0}
        className="w-full rounded-lg bg-accent px-4 py-3 text-base font-semibold text-white disabled:opacity-40"
      >
        Start the course
      </button>
      <p className="text-xs text-muted">
        This stays in your browser only. Nothing is sent anywhere.
      </p>
    </form>
  );
}
