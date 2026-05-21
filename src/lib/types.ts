export interface ExplainResult {
  summary: string;
  language: string;
  lines: Array<{ line: number; code: string; explanation: string }>;
  concepts: Array<{ term: string; definition: string }>;
}

export interface StoryResult {
  title: string;
  analogy: string;
  story: string;
  mapping: Array<{ story_element: string; code_concept: string }>;
  takeaway: string;
}

export interface RepoTourFile {
  path: string;
  category: "config" | "source" | "docs" | "tests" | "assets" | "other";
  importance: number;
  description: string;
}

export interface RepoTourResult {
  overview: string;
  startHere: string;
  learningPath: string[];
  files: RepoTourFile[];
}

export type FlashcardKind = "flip" | "mcq";

export interface FlipCard {
  kind: "flip";
  front: string;
  /** Optional code snippet shown above the front prompt with syntax highlighting */
  code?: string;
  codeLang?: string;
  back: string;
  concept: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface MCQCard {
  kind: "mcq";
  question: string;
  /** Optional code snippet shown above the question */
  code?: string;
  codeLang?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  concept: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export type Flashcard = FlipCard | MCQCard;

export interface FlashcardResult {
  cards: Flashcard[];
}
