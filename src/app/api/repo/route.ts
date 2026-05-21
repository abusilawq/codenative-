import { NextResponse } from "next/server";
import type Anthropic from "@anthropic-ai/sdk";
import { anthropic, MODELS } from "@/lib/anthropic";
import { buildRepoTourPrompt } from "@/lib/prompts";
import { extractJSON } from "@/lib/parse-json";
import { fetchRepoTree, formatTreeForPrompt, parseRepoUrl } from "@/lib/github";
import type { LanguageCode } from "@/lib/i18n/languages";
import type { RepoTourResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

interface Body {
  url: string;
  language: LanguageCode;
}

export async function POST(req: Request) {
  try {
    const { url, language } = (await req.json()) as Body;
    const parsed = parseRepoUrl(url);
    if (!parsed) {
      return NextResponse.json({ error: "Invalid GitHub URL" }, { status: 400 });
    }

    const repo = await fetchRepoTree(parsed.owner, parsed.repo);
    const tree = formatTreeForPrompt(repo.files);

    const { system, user } = buildRepoTourPrompt({
      repoName: repo.name,
      fileTree: tree,
      language,
    });

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

    const tour = extractJSON<RepoTourResult>(text);
    return NextResponse.json({ repo, tour });
  } catch (err) {
    console.error("[/api/repo]", err);
    const msg = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
