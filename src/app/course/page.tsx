"use client";

import Link from "next/link";
import type { Lesson } from "@/content/types";
import { modules } from "@/content/course";
import {
  completedMainModuleCount,
  lessonHref,
  totalMainModuleCount,
} from "@/lib/course";
import { applyRole } from "@/lib/role";
import { useProgress } from "@/lib/progress";

export default function CourseHome() {
  const { hydrated, role, isComplete } = useProgress();

  // Avoid rendering role-dependent copy until we have read localStorage,
  // so the server and client first paint match.
  if (!hydrated) {
    return <div className="mx-auto max-w-3xl px-4 py-10 text-muted">Loading…</div>;
  }

  // The course is gated on having a role. Nothing else is hard-locked.
  if (!role) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <h1 className="text-2xl font-bold">First, name your role</h1>
        <p className="mt-3 text-muted">
          The whole course is built around one role you choose. Write it on the
          home page and the course unlocks.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-lg bg-accent px-5 py-3 font-semibold text-white"
        >
          Write my target role
        </Link>
      </div>
    );
  }

  const totalModules = totalMainModuleCount();
  const doneModules = completedMainModuleCount(isComplete);

  // Three branches: the main build (numbered modules), the template shortcut,
  // and the optional advanced track. Splitting keeps the numbers to the course.
  const SPECIAL = new Set(["m11-template", "m12-advanced"]);
  const mainModules = modules.filter((m) => !SPECIAL.has(m.id));
  const templateModule = modules.find((m) => m.id === "m11-template");
  const advancedModule = modules.find((m) => m.id === "m12-advanced");

  const lessonRow = (moduleId: string, lesson: Lesson) => {
    const done = isComplete(lesson.id);
    return (
      <li key={lesson.id}>
        <Link
          href={lessonHref(moduleId, lesson.id)}
          className="flex items-center gap-3 rounded-lg border border-border bg-card px-3 py-2 hover:border-accent"
        >
          <span
            aria-hidden
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
              done
                ? "border-accent bg-accent text-white"
                : "border-border text-transparent"
            }`}
          >
            ✓
          </span>
          <span className="flex-1 text-sm">{lesson.title}</span>
          <span className="text-xs text-muted">
            {lesson.estMinutes} min · {lesson.device}
          </span>
        </Link>
      </li>
    );
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <header className="space-y-3">
        <p className="text-sm text-muted">Your target role</p>
        <h1 className="text-2xl font-bold tracking-tight">{role}</h1>
        <p className="text-sm text-muted">
          {doneModules} of {totalModules} modules done
        </p>
      </header>

      <aside className="mt-5 rounded-r-lg border-l-4 border-accent bg-accent/5 py-3 pl-4 pr-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-accent">
          What to expect
        </p>
        <p className="mt-1 text-sm text-muted">
          You can start from zero here. No experience needed. Go at your own
          pace, and in two modules you will break something on purpose so you
          learn how to fix it.
        </p>
      </aside>

      {/* Branch 1 — the main build, numbered modules. */}
      <section className="mt-8">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
          The build, step by step
        </h2>
        <ol className="mt-3 space-y-4">
          {mainModules.map((mod, index) => (
            <li
              key={mod.id}
              className="rounded-xl border border-border bg-card p-5"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                Module {index + 1}
              </p>
              <h3 className="mt-1 text-lg font-semibold">{mod.title}</h3>
              <p className="mt-1 text-sm text-muted">
                {applyRole(mod.outcome, role)}
              </p>
              <ul className="mt-3 space-y-2">
                {mod.lessons.map((lesson) => lessonRow(mod.id, lesson))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      {/* Branch 2 — the template shortcut, set apart with an accent tint. */}
      {templateModule ? (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
            {templateModule.title}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {applyRole(templateModule.outcome, role)}
          </p>
          <div className="mt-3 rounded-xl border border-accent/40 bg-accent/5 p-5">
            <ul className="space-y-2">
              {templateModule.lessons.map((lesson) =>
                lessonRow(templateModule.id, lesson),
              )}
            </ul>
          </div>
        </section>
      ) : null}

      {/* Branch 3 — optional advanced track, set apart with a dashed border. */}
      {advancedModule ? (
        <section className="mt-10">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted">
            {advancedModule.title}
          </h2>
          <p className="mt-1 text-sm text-muted">
            {applyRole(advancedModule.outcome, role)}
          </p>
          <div className="mt-3 rounded-xl border border-dashed border-border bg-card p-5">
            <ul className="space-y-2">
              {advancedModule.lessons.map((lesson) =>
                lessonRow(advancedModule.id, lesson),
              )}
            </ul>
          </div>
        </section>
      ) : null}
    </div>
  );
}
