import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, MODELS } from "@/lib/anthropic";
import { buildFlashcardPrompt } from "@/lib/prompts";
import { extractJSON } from "@/lib/parse-json";
import type { LanguageCode } from "@/lib/i18n/languages";
import type { FlashcardResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  language: LanguageCode;
  count?: number;
  recentConcepts?: string[];
  mode?: "flip" | "mcq" | "mixed";
}

export async function POST(req: Request) {
  try {
    const {
      language,
      count = 6,
      recentConcepts = [],
      mode = "mixed",
    } = (await req.json()) as Body;

    const { system, user } = buildFlashcardPrompt({ language, count, recentConcepts, mode });

    const message = await anthropic.messages.create({
      model: MODELS.haiku,
      max_tokens: 3072,
      system,
      messages: [{ role: "user", content: user }],
    });

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const result = extractJSON<FlashcardResult>(text);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/flashcards]", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
