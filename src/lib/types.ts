// Shared type definitions for the curriculum content

export type Difficulty = "beginner" | "intermediate" | "advanced" | "interview";

export interface CodeExample {
  language: string;
  code: string;
  caption?: string;
}

export interface LessonSection {
  heading: string;
  /** Markdown-ish body content. Plain text with paragraphs separated by blank lines. */
  body: string[];
  code?: CodeExample[];
  /** Optional callout block rendered above the section body. */
  callout?: {
    type: "info" | "warning" | "tip" | "success";
    title?: string;
    text: string;
  };
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  difficulty: Difficulty;
  /** Used to show a small "what you'll learn" list under the title. */
  objectives: string[];
  sections: LessonSection[];
}

export interface Track {
  id: string;
  name: string;
  blurb: string;
  icon: "typescript" | "playwright" | "problems" | "deploy" | "home";
  lessons: Lesson[];
}

export interface PracticeProblem {
  id: string;
  title: string;
  difficulty: Difficulty;
  category: "typescript" | "playwright";
  tags: string[];
  prompt: string[];
  hints: string[];
  solutionCode: CodeExample;
  explanation: string[];
}
