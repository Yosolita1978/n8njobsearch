import { notFound } from "next/navigation";
import { modules } from "@/content/course";
import {
  adjacentLessons,
  findLesson,
  lessonHref,
} from "@/lib/course";
import { LessonView } from "@/components/lesson-view";

// Pre-build every lesson route from the course data.
export function generateStaticParams() {
  return modules.flatMap((mod) =>
    mod.lessons.map((lesson) => ({
      moduleId: mod.id,
      lessonId: lesson.id,
    })),
  );
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ moduleId: string; lessonId: string }>;
}) {
  const { moduleId, lessonId } = await params;
  const located = findLesson(moduleId, lessonId);
  if (!located) notFound();

  const moduleIndex = modules.findIndex((m) => m.id === located.module.id);
  const isSpecialModule =
    located.module.id === "m11-template" || located.module.id === "m12-advanced";
  const moduleLabel = isSpecialModule
    ? located.module.title
    : `Module ${moduleIndex + 1}`;
  const { prev, next } = adjacentLessons(lessonId);

  return (
    <LessonView
      lesson={located.lesson}
      moduleLabel={moduleLabel}
      prev={
        prev
          ? {
              href: lessonHref(prev.module.id, prev.lesson.id),
              title: prev.lesson.title,
            }
          : null
      }
      next={
        next
          ? {
              href: lessonHref(next.module.id, next.lesson.id),
              title: next.lesson.title,
            }
          : null
      }
    />
  );
}
