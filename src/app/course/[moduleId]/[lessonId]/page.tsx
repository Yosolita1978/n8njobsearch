import { notFound } from "next/navigation";
import {
  adjacentLessons,
  findLesson,
  getModules,
  lessonHref,
} from "@/lib/course";
import type { Lang } from "@/lib/course";
import { ui } from "@/content/ui";
import { LessonView, type LessonViewData } from "@/components/lesson-view";

// Pre-build every lesson route from the course data. Route structure (ids) is
// identical across languages, so English is the source of truth here.
export function generateStaticParams() {
  return getModules("en").flatMap((mod) =>
    mod.lessons.map((lesson) => ({
      moduleId: mod.id,
      lessonId: lesson.id,
    })),
  );
}

// Resolve one language's worth of lesson data, or null if the lesson is not
// found in that language.
function buildForLang(
  lang: Lang,
  moduleId: string,
  lessonId: string,
): LessonViewData | null {
  const located = findLesson(moduleId, lessonId, lang);
  if (!located) return null;

  const moduleIndex = getModules(lang).findIndex(
    (m) => m.id === located.module.id,
  );
  const isSpecialModule =
    located.module.id === "m11-template" || located.module.id === "m12-advanced";
  const moduleLabel = isSpecialModule
    ? located.module.title
    : ui[lang].lesson.moduleLabel(moduleIndex + 1);

  const { prev, next } = adjacentLessons(lessonId, lang);

  return {
    lesson: located.lesson,
    moduleLabel,
    prev: prev
      ? {
          href: lessonHref(prev.module.id, prev.lesson.id),
          title: prev.lesson.title,
        }
      : null,
    next: next
      ? {
          href: lessonHref(next.module.id, next.lesson.id),
          title: next.lesson.title,
        }
      : null,
  };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = await params;
  const en = buildForLang("en", moduleId, lessonId);
  const es = buildForLang("es", moduleId, lessonId);
  if (!en || !es) notFound();

  return <LessonView byLang={{ en, es }} />;
}
