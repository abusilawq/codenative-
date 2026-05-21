import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, MODELS } from "@/lib/anthropic";
import { buildExplainPrompt } from "@/lib/prompts";
import { extractJSON } from "@/lib/parse-json";
import type { LanguageCode } from "@/lib/i18n/languages";
import type { Difficulty } from "@/lib/store";
import type { ExplainResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  code: string;
  language: LanguageCode;
  difficulty: Difficulty;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    if (!body.code || body.code.trim().length < 3) {
      return NextResponse.json({ error: "Code is too short" }, { status: 400 });
    }
    if (body.code.length > 8000) {
      return NextResponse.json({ error: "Code exceeds 8,000 character limit" }, { status: 400 });
    }

    const { system, user } = buildExplainPrompt(body);

    const message = await anthropic.messages.create({
      model: MODELS.sonnet,
      max_tokens: 4096,
      system,
      messages: [{ role: "user", content: user }],
    });

    const text = message.content
      .filter((b): b is Anthropic.TextBlock => b.type === "text")
      .map((b) => b.text)
      .join("");

    const result = extractJSON<ExplainResult>(text);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[/api/explain]", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
