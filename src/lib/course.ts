import { modules as modulesEn } from "@/content/course";
import { modulesEs } from "@/content/course.es";
import type { Lesson, Module } from "@/content/types";

// Read-only helpers over the course content. No state here.

// The two languages the course ships in. Stored as a learner preference
// (see ProgressProvider) and passed into the helpers below to choose which
// set of strings to read.
export type Lang = "en" | "es";

// The module set for a language. Structure (ids, ordering) is identical
// across languages; only the display strings differ. Keeping ids stable is
// what lets saved progress and lesson URLs survive a language switch.
export function getModules(lang: Lang): Module[] {
  return lang === "es" ? modulesEs : modulesEn;
}

export type LocatedLesson = {
  module: Module;
  lesson: Lesson;
};

// Every lesson in course order, paired with its module.
export function allLessons(lang: Lang = "en"): LocatedLesson[] {
  const out: LocatedLesson[] = [];
  for (const mod of getModules(lang)) {
    for (const lesson of mod.lessons) {
      out.push({ module: mod, lesson });
    }
  }
  return out;
}

export function totalLessonCount(): number {
  return allLessons().length;
}

// Progress is tracked by module, over the numbered build only — not the
// template shortcut or the optional advanced track. A module counts as done
// when every lesson inside it is done.
const SPECIAL_MODULE_IDS = new Set(["m11-template", "m12-advanced"]);

export function mainModules(lang: Lang = "en"): Module[] {
  return getModules(lang).filter((m) => !SPECIAL_MODULE_IDS.has(m.id));
}

export function totalMainModuleCount(): number {
  return mainModules().length;
}

export function completedMainModuleCount(
  isComplete: (lessonId: string) => boolean,
): number {
  return mainModules().filter((m) =>
    m.lessons.every((lesson) => isComplete(lesson.id)),
  ).length;
}

export function findLesson(
  moduleId: string,
  lessonId: string,
  lang: Lang = "en",
): LocatedLesson | null {
  const mod = getModules(lang).find((m) => m.id === moduleId);
  if (!mod) return null;
  const lesson = mod.lessons.find((l) => l.id === lessonId);
  if (!lesson) return null;
  return { module: mod, lesson };
}

// The previous and next lessons in course order, for the lesson footer nav.
export function adjacentLessons(
  lessonId: string,
  lang: Lang = "en",
): {
  prev: LocatedLesson | null;
  next: LocatedLesson | null;
} {
  const flat = allLessons(lang);
  const index = flat.findIndex((entry) => entry.lesson.id === lessonId);
  if (index === -1) return { prev: null, next: null };
  return {
    prev: index > 0 ? flat[index - 1] : null,
    next: index < flat.length - 1 ? flat[index + 1] : null,
  };
}

export function lessonHref(moduleId: string, lessonId: string): string {
  return `/course/${moduleId}/${lessonId}`;
}
