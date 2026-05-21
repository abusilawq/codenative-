import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, MODELS } from "@/lib/anthropic";
import { buildStoryPrompt } from "@/lib/prompts";
import { extractJSON } from "@/lib/parse-json";
import type { LanguageCode } from "@/lib/i18n/languages";
import type { StoryResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  concept: string;
  code?: string;
  language: LanguageCode;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body.concept || body.concept.trim().length < 2) {
      return NextResponse.json({ error: "Concept is required" }, { status: 400 });
    }

    const { system, user } = buildStoryPrompt(body);

    const message = await anthropic.messages.create({
      model: MODELS.sonnet,
      max_tokens: 2048,
      system,
      messages: [{ role: "user", content: user }],
    });

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const result = extractJSON<StoryResult>(text);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/story]", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
