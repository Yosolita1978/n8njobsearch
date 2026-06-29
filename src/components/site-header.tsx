"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";
import {
  completedMainModuleCount,
  totalMainModuleCount,
  type Lang,
} from "@/lib/course";
import { ui } from "@/content/ui";

const LANGS: Lang[] = ["en", "es"];

export function SiteHeader() {
  const { hydrated, role, lang, setLang, isComplete } = useProgress();
  const total = totalMainModuleCount();
  const done = completedMainModuleCount(isComplete);
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;

  // Fall back to "en" before hydration so the first client paint matches the
  // server, then re-render once we know the saved language.
  const activeLang: Lang = hydrated ? lang : "en";
  const t = ui[activeLang].nav;

  // Only show role-dependent UI after hydration, so server and client match.
  const showProgress = hydrated && role.length > 0;

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card/80 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-center justify-between gap-3 px-4 py-3">
        <Link
          href="/course"
          aria-label={t.brandHomeLabel}
          className="group flex items-center gap-2.5"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-icon.png"
            alt=""
            className="h-8 w-8 rounded-lg shadow-sm transition-transform group-hover:scale-105"
          />
          <span className="text-[15px] font-semibold tracking-tight">
            Job Hunter <span className="font-normal text-muted">{t.brandSuffix}</span>
          </span>
        </Link>

        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/"
            className="rounded-md px-2 py-1 text-muted transition-colors hover:bg-accent/5 hover:text-foreground"
          >
            {t.home}
          </Link>
          <Link
            href="/course"
            className="rounded-md px-2 py-1 text-muted transition-colors hover:bg-accent/5 hover:text-foreground"
          >
            {t.course}
          </Link>

          {/* Language toggle: flips the saved preference, like the role. */}
          <div
            role="group"
            aria-label="Language"
            className="flex items-center rounded-full border border-border bg-background p-0.5 text-xs"
          >
            {LANGS.map((code) => (
              <button
                key={code}
                type="button"
                onClick={() => setLang(code)}
                aria-pressed={activeLang === code}
                className={`rounded-full px-2 py-0.5 font-medium uppercase tracking-wide transition-colors ${
                  activeLang === code
                    ? "bg-accent text-white"
                    : "text-muted hover:text-foreground"
                }`}
              >
                {code}
              </button>
            ))}
          </div>

          {showProgress ? (
            <Link
              href="/course"
              title={role}
              aria-label={t.progressAria(done, total, role)}
              className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-1.5 transition-colors hover:border-accent/40"
            >
              <span
                role="progressbar"
                aria-valuenow={done}
                aria-valuemin={0}
                aria-valuemax={total}
                className="relative h-1.5 w-16 overflow-hidden rounded-full bg-border"
              >
                <span
                  className="absolute inset-y-0 left-0 rounded-full bg-accent transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </span>
              <span className="text-xs font-medium tabular-nums text-muted">
                {done}/{total}
              </span>
            </Link>
          ) : null}
        </nav>
      </div>
    </header>
  );
}
