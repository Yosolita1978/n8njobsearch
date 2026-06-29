// UI-chrome strings: everything the learner sees that is NOT lesson content —
// nav labels, section headings, buttons, the landing page, the role form.
//
// Lesson content lives in course.ts / course.es.ts. This file is the small
// dictionary for the surrounding interface. Strings that include a value
// (a count, a filename) are functions so the interpolation stays in one place
// instead of being scattered across components.
//
// Structure-first: `en` is filled in and `es` mirrors it for now. Step 3 of
// the translation replaces `es: en` with a real Spanish object of the same
// shape — TypeScript will flag anything missing.

import type { Lang } from "@/lib/course";

export type UiStrings = {
  meta: {
    title: string; // browser tab title
    description: string; // SEO meta description
  };
  nav: {
    home: string;
    course: string;
    brandSuffix: string; // the muted word after the logo wordmark
    brandHomeLabel: string; // aria-label for the logo link
    progressAria: (done: number, total: number, role: string) => string;
  };
  landing: {
    title: string;
    intro: string;
    videoTitle: string;
    videoCaption: string;
    trapTitle: string;
    trapBody: string;
    builtBy: string;
    website: string;
    linkedin: string;
  };
  roleForm: {
    label: string;
    placeholder: string;
    submit: string;
    privacy: string;
  };
  course: {
    loading: string;
    needRoleTitle: string;
    needRoleBody: string;
    needRoleCta: string;
    yourRole: string;
    modulesDone: (done: number, total: number) => string;
    expectTitle: string;
    expectBody: string;
    buildTitle: string;
    moduleLabel: (n: number) => string;
  };
  lesson: {
    minutesDevice: (minutes: number, device: string) => string;
    why: string;
    steps: string;
    links: string;
    snippets: string;
    tryIt: string;
    importTitle: string;
    download: (filename: string) => string;
    watchOut: (title: string) => string;
    markDone: string;
    undoDone: string;
    backToCourse: string;
    moduleLabel: (n: number) => string;
  };
};

const en: UiStrings = {
  meta: {
    title: "Build your own job hunter",
    description:
      "A self-paced course to build a daily, AI-assisted job-hunting workflow in n8n, built around a role that matters to you.",
  },
  nav: {
    home: "Home",
    course: "Course",
    brandSuffix: "Course",
    brandHomeLabel: "Job Hunter Course home",
    progressAria: (done, total, role) =>
      `${done} of ${total} modules done. Target role: ${role}`,
  },
  landing: {
    title: "Build a job hunter that works while you sleep.",
    intro:
      "In a few short sessions you will build your own workflow that hunts for jobs, scores them, and drafts a tailored cover letter. It is built around a role that matters to you, not a demo. You do not need to be an engineer.",
    videoTitle: "Job hunter demo",
    videoCaption:
      "90 seconds: a daily run finds a remote job, scores it, and drops a tailored cover letter into Google Drive.",
    trapTitle: "The trap this beats",
    trapBody:
      "Checking boards by hand is slow, and many jobs marked remote actually want you to be local. Your hunter reads each posting, keeps only the truly remote ones, and flags the sneaky ones.",
    builtBy: "Built by",
    website: "Website",
    linkedin: "LinkedIn",
  },
  roleForm: {
    label: "Your target role, in one sentence",
    placeholder: "a fully remote instructional designer role",
    submit: "Start the course",
    privacy: "This stays in your browser only. Nothing is sent anywhere.",
  },
  course: {
    loading: "Loading…",
    needRoleTitle: "First, name your role",
    needRoleBody:
      "The whole course is built around one role you choose. Write it on the home page and the course unlocks.",
    needRoleCta: "Write my target role",
    yourRole: "Your target role",
    modulesDone: (done, total) => `${done} of ${total} modules done`,
    expectTitle: "What to expect",
    expectBody:
      "You can start from zero here. No experience needed. Go at your own pace, and in two modules you will break something on purpose so you learn how to fix it.",
    buildTitle: "The build, step by step",
    moduleLabel: (n) => `Module ${n}`,
  },
  lesson: {
    minutesDevice: (minutes, device) => `${minutes} min · ${device}`,
    why: "Why this matters",
    steps: "Steps",
    links: "Links",
    snippets: "Snippets",
    tryIt: "Try it",
    importTitle: "Import the finished workflow",
    download: (filename) => `Download ${filename}`,
    watchOut: (title) => `Watch out: ${title}`,
    markDone: "Mark this lesson done",
    undoDone: "Done — tap to undo",
    backToCourse: "Back to course →",
    moduleLabel: (n) => `Module ${n}`,
  },
};

const es: UiStrings = {
  meta: {
    title: "Crea tu propio buscador de empleo",
    description:
      "Un curso a tu ritmo para construir un flujo de trabajo diario de búsqueda de empleo asistido por IA en n8n, construido en torno a un rol que te importa.",
  },
  nav: {
    home: "Inicio",
    course: "Curso",
    brandSuffix: "Curso",
    brandHomeLabel: "Inicio del curso Job Hunter",
    progressAria: (done, total, role) =>
      `${done} de ${total} módulos completados. Rol objetivo: ${role}`,
  },
  landing: {
    title: "Crea un buscador de empleo que trabaja mientras duermes.",
    intro:
      "En unas pocas sesiones cortas crearás tu propio flujo de trabajo que busca empleos, los evalúa por ti y redacta una carta de presentación a medida. Está construido en torno a un rol que te importa, no a una demo. No necesitas ser ingeniero/a.",
    videoTitle: "Demo del buscador de empleo",
    videoCaption:
      "90 segundos: una ejecución diaria encuentra un empleo remoto, lo evalúa por ti y deja una carta de presentación a medida en Google Drive.",
    trapTitle: "La trampa que esto evita",
    trapBody:
      "Revisar los portales a mano es lento, y muchos empleos marcados como remotos en realidad quieren que estés en el sitio. Tu buscador lee cada anuncio, se queda solo con los verdaderamente remotos y marca los tramposos.",
    builtBy: "Creado por",
    website: "Sitio web",
    linkedin: "LinkedIn",
  },
  roleForm: {
    label: "Tu rol objetivo, en una frase",
    placeholder: "un puesto de diseñador/a instruccional totalmente remoto",
    submit: "Empezar el curso",
    privacy: "Esto se queda solo en tu navegador. No se envía nada a ningún sitio.",
  },
  course: {
    loading: "Cargando…",
    needRoleTitle: "Primero, define tu rol",
    needRoleBody:
      "Todo el curso se construye en torno a un rol que tú eliges. Escríbelo en la página de inicio y el curso se desbloquea.",
    needRoleCta: "Escribir mi rol objetivo",
    yourRole: "Tu rol objetivo",
    modulesDone: (done, total) => `${done} de ${total} módulos completados`,
    expectTitle: "Qué esperar",
    expectBody:
      "Puedes empezar desde cero aquí. No hace falta experiencia. Ve a tu propio ritmo y, en dos módulos, romperás algo a propósito para aprender a arreglarlo.",
    buildTitle: "La construcción, paso a paso",
    moduleLabel: (n) => `Módulo ${n}`,
  },
  lesson: {
    minutesDevice: (minutes, device) =>
      `${minutes} min · ${
        device === "laptop" ? "portátil" : device === "phone" ? "móvil" : device
      }`,
    why: "Por qué importa",
    steps: "Pasos",
    links: "Enlaces",
    snippets: "Fragmentos",
    tryIt: "Pruébalo",
    importTitle: "Importa el flujo de trabajo terminado",
    download: (filename) => `Descargar ${filename}`,
    watchOut: (title) => `Cuidado: ${title}`,
    markDone: "Marcar esta lección como hecha",
    undoDone: "Hecho — toca para deshacer",
    backToCourse: "Volver al curso →",
    moduleLabel: (n) => `Módulo ${n}`,
  },
};

export const ui: Record<Lang, UiStrings> = {
  en,
  es,
};
