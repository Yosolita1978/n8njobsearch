import { RoleForm } from "@/components/role-form";

export default function LandingPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:py-16">
      <section className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Build a job hunter that works while you sleep.
        </h1>
        <p className="text-lg text-muted">
          In a few short sessions you will build your own workflow that hunts
          for jobs, scores them, and drafts a tailored cover letter. It is built
          around a role that matters to you, not a demo. You do not need to be an
          engineer.
        </p>
      </section>

      <section className="mt-8">
        <div className="aspect-video w-full overflow-hidden rounded-xl border border-border bg-card">
          <iframe
            className="h-full w-full"
            src="https://www.youtube.com/embed/wja5DA7yT0w"
            title="Job hunter demo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          />
        </div>
        <p className="mt-2 text-sm text-muted">
          90 seconds: a daily run finds a remote job, scores it, and drops a
          tailored cover letter into Google Drive.
        </p>
      </section>

      <section className="mt-8 rounded-xl border border-border bg-card p-5">
        <h2 className="text-lg font-semibold">The trap this beats</h2>
        <p className="mt-2 text-muted">
          Checking boards by hand is slow, and many jobs marked remote actually
          want you to be local. Your hunter reads each posting, keeps only the
          truly remote ones, and flags the sneaky ones.
        </p>
      </section>

      <section className="mt-8 rounded-xl border border-accent/30 bg-card p-5">
        <RoleForm />
      </section>
    </div>
  );
}
