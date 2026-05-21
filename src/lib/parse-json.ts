/**
 * Robust JSON extractor. Claude sometimes wraps JSON in markdown fences
 * despite instructions; this strips them and parses safely.
 */
export function extractJSON<T = unknown>(raw: string): T {
  let text = raw.trim();
  if (text.startsWith("```")) {
    text = text.replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "");
  }
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");
  if (firstBrace >= 0 && lastBrace > firstBrace) {
    text = text.slice(firstBrace, lastBrace + 1);
  }
  return JSON.parse(text) as T;
}
