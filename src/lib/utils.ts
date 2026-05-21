import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("en-US", { notation: "compact" }).format(n);
}

export function truncate(str: string, max = 80): string {
  return str.length > max ? `${str.slice(0, max - 1)}…` : str;
}

export function detectLanguageFromCode(code: string): string {
  const trimmed = code.trim();
  if (/^\s*(import|from)\s+\w+|def\s+\w+\(|print\(/.test(trimmed)) return "python";
  if (/^\s*(import|export)\s+|const\s+\w+\s*=|function\s+\w+\(|=>/.test(trimmed)) return "javascript";
  if (/interface\s+\w+|type\s+\w+\s*=|:\s*(string|number|boolean)/.test(trimmed)) return "typescript";
  if (/^\s*(public|private|protected)\s+(class|static)|System\.out\.println/.test(trimmed)) return "java";
  if (/^\s*#include|int\s+main\s*\(/.test(trimmed)) return "cpp";
  if (/fn\s+\w+\(|let\s+mut\s+|impl\s+/.test(trimmed)) return "rust";
  if (/^\s*package\s+\w+|func\s+\w+\(/.test(trimmed)) return "go";
  if (/<\?php|\$\w+\s*=/.test(trimmed)) return "php";
  if (/^\s*<!DOCTYPE|<html|<div/.test(trimmed)) return "html";
  if (/^\s*\.\w+\s*{|@media/.test(trimmed)) return "css";
  return "plaintext";
}
