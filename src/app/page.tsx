"use client";

import { RoleForm } from "@/components/role-form";
import { useProgress } from "@/lib/progress";
import { ui } from "@/content/ui";
import type { Lang } from "@/lib/course";

export default function LandingPage() {
  const { hydrated, lang } = useProgress();
  const activeLang: Lang = hydrated ? lang : "en";
  const t = ui[activeLang].landing;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {t.title}
        </h1>
        <p className="text-lg text-muted">{t.intro}</p>
      </section>

      <section className="mt-8">
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-card">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/wja5DA7yT0w"
            title={t.videoTitle}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <p className="mt-2 text-sm text-muted">{t.videoCaption}</p>
      </section>

      <section className="mt-8 rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">{t.trapTitle}</h2>
        <p className="mt-2 text-muted">{t.trapBody}</p>
      </section>

      <section className="mt-8 rounded-xl border border-accent/30 bg-card p-5">
        <RoleForm />
      </section>

      <section className="mt-8 border-t border-border pt-6">
        <p className="text-sm text-muted">
          {t.builtBy}{" "}
          <span className="font-medium text-foreground">Cristina Rodriguez</span>
          {" · "}
          <a
            href="https://www.yosola.co/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-2 hover:underline"
          >
            {t.website}
          </a>
          {" · "}
          <a
            href="https://www.linkedin.com/in/crissrodriguez/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline-offset-2 hover:underline"
          >
            {t.linkedin}
          </a>
        </p>
      </section>
    </div>
  );
}
