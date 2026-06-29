"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Lang } from "@/lib/course";

// The learner's state lives only in their browser. We store their target
// role, the ids of the lessons they have marked done, their rubric marks,
// and their chosen language.

const ROLE_KEY = "n8njob.role";
const DONE_KEY = "n8njob.completed";
const RUBRIC_KEY = "n8njob.rubric";
const LANG_KEY = "n8njob.lang";

// Rubric marks: one map from "<rubricId>:<criterionId>" to the chosen
// level label, persisted under a single key like the lessons array.
type RubricMarks = Record<string, string>;

function rubricMarkKey(rubricId: string, criterionId: string): string {
  return `${rubricId}:${criterionId}`;
}

type ProgressValue = {
  hydrated: boolean; // true once we have read localStorage on the client
  role: string;
  setRole: (role: string) => void;
  lang: Lang; // chosen interface/content language; defaults to "en"
  setLang: (lang: Lang) => void;
  completed: string[];
  isComplete: (lessonId: string) => boolean;
  toggleComplete: (lessonId: string) => void;
  completedCount: number;
  rubricMark: (rubricId: string, criterionId: string) => string | null;
  setRubricMark: (rubricId: string, criterionId: string, label: string) => void;
  resetAll: () => void;
};

const ProgressContext = createContext<ProgressValue | null>(null);

function readArray(raw: string | null): string[] {
  if (!raw) return [];
  const parsed: unknown = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new Error("Stored progress is not an array.");
  }
  return parsed.filter((item): item is string => typeof item === "string");
}

function readMarks(raw: string | null): RubricMarks {
  if (!raw) return {};
  const parsed: unknown = JSON.parse(raw);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("Stored rubric marks are not an object.");
  }
  const out: RubricMarks = {};
  for (const [key, value] of Object.entries(parsed)) {
    if (typeof value === "string") out[key] = value;
  }
  return out;
}

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);
  const [role, setRoleState] = useState("");
  const [completed, setCompleted] = useState<string[]>([]);
  const [marks, setMarks] = useState<RubricMarks>({});
  const [lang, setLangState] = useState<Lang>("en");

  // Read from localStorage once, on the client, after first render.
  useEffect(() => {
    setRoleState(window.localStorage.getItem(ROLE_KEY) ?? "");
    setCompleted(readArray(window.localStorage.getItem(DONE_KEY)));
    setMarks(readMarks(window.localStorage.getItem(RUBRIC_KEY)));
    // Only "es" overrides the default; anything else (missing, garbage) is "en".
    setLangState(window.localStorage.getItem(LANG_KEY) === "es" ? "es" : "en");
    setHydrated(true);
  }, []);

  const setRole = useCallback((next: string) => {
    setRoleState(next);
    window.localStorage.setItem(ROLE_KEY, next);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(LANG_KEY, next);
  }, []);

  const toggleComplete = useCallback((lessonId: string) => {
    setCompleted((current) => {
      const next = current.includes(lessonId)
        ? current.filter((id) => id !== lessonId)
        : [...current, lessonId];
      window.localStorage.setItem(DONE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const isComplete = useCallback(
    (lessonId: string) => completed.includes(lessonId),
    [completed],
  );

  const rubricMark = useCallback(
    (rubricId: string, criterionId: string) =>
      marks[rubricMarkKey(rubricId, criterionId)] ?? null,
    [marks],
  );

  const setRubricMark = useCallback(
    (rubricId: string, criterionId: string, label: string) => {
      setMarks((current) => {
        const next = { ...current, [rubricMarkKey(rubricId, criterionId)]: label };
        window.localStorage.setItem(RUBRIC_KEY, JSON.stringify(next));
        return next;
      });
    },
    [],
  );

  const resetAll = useCallback(() => {
    setRoleState("");
    setCompleted([]);
    setMarks({});
    window.localStorage.removeItem(ROLE_KEY);
    window.localStorage.removeItem(DONE_KEY);
    window.localStorage.removeItem(RUBRIC_KEY);
  }, []);

  const value: ProgressValue = {
    hydrated,
    role,
    setRole,
    lang,
    setLang,
    completed,
    isComplete,
    toggleComplete,
    completedCount: completed.length,
    rubricMark,
    setRubricMark,
    resetAll,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

// Fail loudly if used outside the provider, rather than returning a
// silent default that hides the wiring mistake.
export function useProgress(): ProgressValue {
  const value = useContext(ProgressContext);
  if (!value) {
    throw new Error("useProgress must be used inside a ProgressProvider.");
  }
  return value;
}
