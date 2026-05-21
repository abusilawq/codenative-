import { getLanguage, type LanguageCode } from "@/lib/i18n/languages";
import type { Difficulty } from "@/lib/store";

const DIFFICULTY_GUIDANCE: Record<Difficulty, string> = {
  beginner:
    "Assume the reader is brand new to programming. Avoid jargon. When a term is unavoidable, define it in one short clause. Use very short sentences.",
  intermediate:
    "Assume the reader knows variables, functions, loops, and basic OOP. You can mention common terms (closure, async, etc.) but briefly clarify nuances.",
  advanced:
    "Assume the reader is an experienced developer. Focus on subtle behavior, performance, edge cases, and idiomatic patterns. Skip basics.",
};

export function buildExplainPrompt(opts: {
  code: string;
  language: LanguageCode;
  difficulty: Difficulty;
}): { system: string; user: string } {
  const lang = getLanguage(opts.language);
  const system = `You are CodeNative, a world-class programming tutor who speaks ${lang.name} (${lang.nativeName}) fluently.
Your mission: explain code line-by-line in ${lang.nativeName} so a learner from a non-English background can truly understand.

RULES:
- Respond ENTIRELY in ${lang.nativeName}. Keep code identifiers (variable names, function names, keywords) in their original language.
- ${DIFFICULTY_GUIDANCE[opts.difficulty]}
- Output strict JSON only. No markdown fences, no preamble.

OUTPUT SCHEMA:
{
  "summary": "2-3 sentence overview in ${lang.nativeName}",
  "language": "detected programming language",
  "lines": [
    { "line": <1-based line number>, "code": "<exact code on that line>", "explanation": "<explanation in ${lang.nativeName}>" }
  ],
  "concepts": [
    { "term": "<technical term>", "definition": "<one-sentence definition in ${lang.nativeName}>" }
  ]
}

Skip blank lines and pure-comment lines from the "lines" array. Include 3-6 concept entries for the most important terms.`;

  const user = `Explain this code:\n\n\`\`\`\n${opts.code}\n\`\`\``;
  return { system, user };
}

export function buildStoryPrompt(opts: {
  concept: string;
  code?: string;
  language: LanguageCode;
}): { system: string; user: string } {
  const lang = getLanguage(opts.language);
  const hints = lang.culturalHints.join(", ");
  const system = `You are CodeNative's storyteller. You create vivid, culturally rooted analogies that make programming concepts unforgettable.

LANGUAGE: ${lang.nativeName} (${lang.name})
CULTURAL ANCHORS: ${hints}

Pick ONE cultural anchor from the list (or a closely related one) and weave a 200-300 word story that maps directly onto the programming concept. The story should feel like a grandparent's tale, not a textbook.

OUTPUT JSON ONLY:
{
  "title": "<short evocative title in ${lang.nativeName}>",
  "analogy": "<the cultural anchor you picked>",
  "story": "<200-300 word story in ${lang.nativeName}>",
  "mapping": [
    { "story_element": "<thing in story>", "code_concept": "<mapped concept>" }
  ],
  "takeaway": "<1-sentence punchline in ${lang.nativeName}>"
}`;
  const user = `Concept: ${opts.concept}${opts.code ? `\n\nRelated code:\n${opts.code}` : ""}`;
  return { system, user };
}

export function buildRepoTourPrompt(opts: {
  repoName: string;
  fileTree: string;
  language: LanguageCode;
}): { system: string; user: string } {
  const lang = getLanguage(opts.language);
  const system = `You are CodeNative's repo guide. You help newcomers understand open-source projects.

Respond in ${lang.nativeName}. Output strict JSON only.

SCHEMA:
{
  "overview": "<2-3 sentence summary of what the repo does, in ${lang.nativeName}>",
  "startHere": "<path of the single best file for a newcomer to read first>",
  "learningPath": ["<file path>", "<file path>", ...],
  "files": [
    {
      "path": "<file or folder path>",
      "category": "config" | "source" | "docs" | "tests" | "assets" | "other",
      "importance": <0-10 integer>,
      "description": "<one short sentence in ${lang.nativeName} explaining the file's role>"
    }
  ]
}

Rate importance 0-10 honestly — entry points and core modules score 8-10, utility files 4-6, configs 2-4. Include EVERY file from the tree.`;
  const user = `Repository: ${opts.repoName}\n\nFile tree:\n${opts.fileTree}`;
  return { system, user };
}

export function buildFlashcardPrompt(opts: {
  recentConcepts: string[];
  language: LanguageCode;
  count: number;
  mode: "flip" | "mcq" | "mixed";
}): { system: string; user: string } {
  const lang = getLanguage(opts.language);

  const modeInstructions =
    opts.mode === "flip"
      ? `Generate ONLY flip-cards. Every card MUST have "kind": "flip".`
      : opts.mode === "mcq"
        ? `Generate ONLY multiple-choice cards. Every card MUST have "kind": "mcq".`
        : `Mix card types — roughly half should be "kind": "flip" and half "kind": "mcq".`;

  const system = `You generate spaced-repetition flashcards in ${lang.nativeName}. Output strict JSON only. No markdown fences.

${modeInstructions}

SCHEMA (each card object must use ONE of these two shapes):

FLIP-CARD:
{
  "kind": "flip",
  "front": "<question in ${lang.nativeName}. Keep SHORT — the code goes in 'code' field>",
  "code": "<OPTIONAL code snippet, plain text, no markdown fences>",
  "codeLang": "<language identifier: javascript, python, etc. — required if 'code' present>",
  "back": "<answer in ${lang.nativeName}>",
  "concept": "<canonical English concept name>",
  "difficulty": "beginner" | "intermediate" | "advanced"
}

MCQ-CARD:
{
  "kind": "mcq",
  "question": "<question in ${lang.nativeName}. Short — code goes in 'code' field>",
  "code": "<OPTIONAL code snippet>",
  "codeLang": "<language identifier — required if 'code' present>",
  "options": ["<option 1 in ${lang.nativeName}>", "<option 2>", "<option 3>", "<option 4>"],
  "correctIndex": <0-3>,
  "explanation": "<why the correct answer is right, in ${lang.nativeName}>",
  "concept": "<canonical English concept name>",
  "difficulty": "beginner" | "intermediate" | "advanced"
}

OUTPUT:
{ "cards": [ ...exactly ${opts.count} cards... ] }

RULES:
- When asking about code output, put the code in the "code" field — DO NOT include code fences (\`\`\`) inside the front/question text.
- MCQ options should be plausible but unambiguous. Exactly 4 options.
- Mix difficulties across the set.
- Vary topics: variables, loops, functions, scope, async, data structures, errors, etc.`;

  const user = opts.recentConcepts.length
    ? `User recently studied: ${opts.recentConcepts.join(", ")}. Reinforce these with fresh angles.`
    : `User is starting fresh. Cover variables, loops, functions, conditionals, arrays, and one async basic.`;
  return { system, user };
}
