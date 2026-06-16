// Content model for the course.
//
// All learner-facing strings may contain the token "{role}".
// At render time we replace "{role}" with the learner's saved
// target role (the one sentence they write on the landing page).
// Authoring rule: write "{role}" wherever you mean "the learner's role".
// Example: "Search the web for a {role} posting."

export type Device = "phone" | "laptop";

export type Watch = {
  src: string; // path or URL to a short screen recording
  caption: string; // one plain sentence describing what it shows
};

export type Snippet = {
  label: string; // what this snippet is, e.g. "Expression: read the role"
  code: string; // copy-paste ready text
};

export type StepImage = {
  src: string; // path under /public, e.g. "/images/trigger-input.png"
  caption: string; // what the learner is looking at and should match
  afterStep: number; // render right after this step number (1-based)
};

export type ResourceLink = {
  label: string; // what the link is, e.g. "Open SerpApi"
  href: string; // external URL; always opened in a new tab
};

export type AsideTone = "sky" | "violet" | "emerald" | "rose";

export type Aside = {
  title: string; // e.g. "Did you know?"
  body: string[]; // one or more short paragraphs of deeper, optional context
  tone?: AsideTone; // colour of the callout; defaults to sky
  after?: "steps" | "snippets"; // where it renders; defaults to after the snippets
};

export type Pitfall = {
  title: string; // the bug, named plainly
  body: string; // why it happens and how to avoid or fix it
};

export type Download = {
  label: string; // what the file is, e.g. "The finished workflow"
  href: string; // path under /public, e.g. "/job-hunter.workflow.json"
  filename: string; // suggested save name for the browser
};

export type Lesson = {
  id: string;
  moduleId: string;
  title: string;
  estMinutes: number;
  device: Device; // honest about where the work happens
  why: string; // plain framing: why this matters to the learner
  watch?: Watch; // optional short recording
  steps: string[]; // ordered, one action each
  images?: StepImage[]; // optional config screenshots, placed after a given step
  snippets?: Snippet[];
  links?: ResourceLink[]; // optional external links (sign-up pages, docs), open in a new tab
  tryIt: string; // the active task on the learner's own role
  check: string; // a result the learner can verify themselves
  asides?: Aside[]; // optional "Did you know?" deeper-context callouts
  pitfall?: Pitfall; // a bug framed as the lesson
  download?: Download; // an optional file the learner can import, e.g. the workflow
};

export type Module = {
  id: string;
  title: string;
  outcome: string; // rendered as an action: "After this you can ..."
  lessons: Lesson[];
};

// The capstone self-assessment. Scored by criterion and level, so it has
// its own shape rather than reusing Lesson.

export type RubricLevel = {
  label: string; // "Not yet" | "Working" | "Strong"
  points: number; // 0 | 1 | 2
  description: string;
};

export type RubricCriterion = {
  id: string;
  title: string;
  levels: RubricLevel[];
};

export type Rubric = {
  id: string;
  title: string;
  intro: string;
  criteria: RubricCriterion[];
  scoring: string; // how to read the total, in plain voice
};
