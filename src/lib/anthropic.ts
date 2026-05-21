import Anthropic from "@anthropic-ai/sdk";

if (!process.env.ANTHROPIC_API_KEY) {
  console.warn("[CodeNative] ANTHROPIC_API_KEY is not set — AI calls will fail.");
}

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

export const MODELS = {
  /** High-quality explanations & stories */
  sonnet: "claude-sonnet-4-6",
  /** Cheap fast tasks: flashcards, importance scoring */
  haiku: "claude-haiku-4-5-20251001",
} as const;
