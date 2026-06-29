"use client";

import Link from "next/link";
import type { Aside, AsideTone, Lesson } from "@/content/types";
import type { Lang } from "@/lib/course";
import { ui } from "@/content/ui";
import { applyRole } from "@/lib/role";
import { useProgress } from "@/lib/progress";
import { CopyBlock } from "@/components/copy-block";

export type NavLink = { href: string; title: string } | null;

// Everything one lesson needs to render, already resolved for a single
// language. The server route builds one of these per language and hands both
// to the view, which picks the active one — so the page can stay statically
// generated while the language stays a client-side choice.
export type LessonViewData = {
  lesson: Lesson;
  moduleLabel: string;
  prev: NavLink;
  next: NavLink;
};

// Full class strings per tone, since Tailwind cannot build class names at runtime.
const ASIDE_TONES: Record<AsideTone, { box: string; title: string; body: string }> = {
  sky: { box: "border-sky-200 bg-sky-50", title: "text-sky-700", body: "text-sky-900" },
  violet: { box: "border-violet-200 bg-violet-50", title: "text-violet-700", body: "text-violet-900" },
  emerald: { box: "border-emerald-200 bg-emerald-50", title: "text-emerald-700", body: "text-emerald-900" },
  rose: { box: "border-rose-200 bg-rose-50", title: "text-rose-700", body: "text-rose-900" },
};

export function LessonView({
  byLang,
}: {
  byLang: Record<Lang, LessonViewData>;
}) {
  const { hydrated, role, lang, isComplete, toggleComplete } = useProgress();

  // Until hydrated we do not know the language or role, so fall back to "en"
  // to match what the server rendered, then re-render once we know.
  const activeLang: Lang = hydrated ? lang : "en";
  const { lesson, moduleLabel, prev, next } = byLang[activeLang];
  const t = ui[activeLang].lesson;

  const r = hydrated ? role : "";
  const done = hydrated && isComplete(lesson.id);

  const asides = lesson.asides ?? [];
  const stepAsides = asides.filter((a) => a.after === "steps");
  const mainAsides = asides.filter((a) => a.after !== "steps");

  const renderAside = (aside: Aside) => {
    const tone = ASIDE_TONES[aside.tone ?? "sky"];
    return (
      <aside
        key={aside.title}
        className={`mt-6 rounded-lg border p-5 ${tone.box}`}
      >
        <h2
          className={`text-sm font-semibold uppercase tracking-wide ${tone.title}`}
        >
          {aside.title}
        </h2>
        <div className={`mt-2 space-y-2 ${tone.body}`}>
          {aside.body.map((para, i) => (
            <p key={i}>{applyRole(para, r)}</p>
          ))}
        </div>
      </aside>
    );
  };

  return (
    <article className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {moduleLabel}
      </p>
      <h1 className="mt-1 text-2xl font-bold tracking-tight">{lesson.title}</h1>
      <p className="mt-2 text-sm text-muted">
        {t.minutesDevice(lesson.estMinutes, lesson.device)}
      </p>

      <aside className="mt-6 rounded-r-lg border-l-4 border-accent bg-accent/5 py-4 pl-5 pr-5">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-accent">
          {t.why}
        </h2>
        <p className="mt-2">{applyRole(lesson.why, r)}</p>
      </aside>

      {lesson.watch ? (
        <section className="mt-6">
          <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-card">
            <iframe
              className="h-full w-full"
              src={lesson.watch.src}
              title={lesson.watch.caption}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <p className="mt-2 text-sm text-muted">{lesson.watch.caption}</p>
        </section>
      ) : null}

      <section className="mt-6">
        <h2 className="text-lg font-semibold">{t.steps}</h2>
        <ol className="mt-3 space-y-2">
          {lesson.steps.map((step, i) => (
            <li key={i} className="flex flex-col gap-3">
              <div className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs font-semibold text-accent">
                  {i + 1}
                </span>
                <span>{applyRole(step, r)}</span>
              </div>
              {(lesson.images ?? [])
                .filter((image) => image.afterStep === i + 1)
                .map((image, k) => (
                  <figure
                    key={k}
                    className="ml-9 overflow-hidden rounded-lg border border-border bg-card"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={image.src} alt={image.caption} className="w-full" />
                    <figcaption className="px-3 py-2 text-sm text-muted">
                      {image.caption}
                    </figcaption>
                  </figure>
                ))}
            </li>
          ))}
        </ol>
      </section>

      {stepAsides.map(renderAside)}

      {lesson.links && lesson.links.length > 0 ? (
        <section className="mt-6">
          <h2 className="text-lg font-semibold">{t.links}</h2>
          <ul className="mt-3 space-y-2">
            {lesson.links.map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-accent hover:underline"
                >
                  {link.label}
                  <span aria-hidden>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {lesson.snippets && lesson.snippets.length > 0 ? (
        <section className="mt-6 space-y-3">
          <h2 className="text-lg font-semibold">{t.snippets}</h2>
          {lesson.snippets.map((snippet, i) => (
            <CopyBlock key={i} label={snippet.label} code={snippet.code} />
          ))}
        </section>
      ) : null}

      {mainAsides.map(renderAside)}

      <section className="mt-6 rounded-xl border border-accent/30 bg-card p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
          {t.tryIt}
        </h2>
        <p className="mt-2">{applyRole(lesson.tryIt, r)}</p>
      </section>

      {lesson.download ? (
        <section className="mt-6 rounded-xl border border-accent/30 bg-card p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-accent">
            {t.importTitle}
          </h2>
          <p className="mt-2 text-muted">{lesson.download.label}</p>
          <a
            href={lesson.download.href}
            download={lesson.download.filename}
            className="mt-4 inline-block rounded-lg bg-accent px-4 py-2 font-semibold text-white"
          >
            {t.download(lesson.download.filename)}
          </a>
        </section>
      ) : null}

      {lesson.pitfall ? (
        <section className="mt-6 rounded-xl border border-amber-300 bg-amber-50 p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-amber-700">
            {t.watchOut(lesson.pitfall.title)}
          </h2>
          <p className="mt-2 text-amber-900">
            {applyRole(lesson.pitfall.body, r)}
          </p>
        </section>
      ) : null}

      <section className="mt-6 rounded-xl border-2 border-border bg-card p-5">
        <button
          type="button"
          onClick={() => toggleComplete(lesson.id)}
          disabled={!hydrated}
          className={`w-full rounded-lg px-4 py-3 font-semibold ${
            done
              ? "border border-accent text-accent"
              : "bg-accent text-white"
          }`}
        >
          {done ? t.undoDone : t.markDone}
        </button>
      </section>

      <nav className="mt-8 flex items-center justify-between gap-3 text-sm">
        {prev ? (
          <Link href={prev.href} className="text-accent hover:underline">
            ← {prev.title}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link href={next.href} className="text-right text-accent hover:underline">
            {next.title} →
          </Link>
        ) : (
          <Link href="/course" className="text-right text-accent hover:underline">
            {t.backToCourse}
          </Link>
        )}
      </nav>
    </article>
  );
}
