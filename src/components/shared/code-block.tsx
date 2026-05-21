"use client";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { detectLanguageFromCode } from "@/lib/utils";

interface Props {
  code: string;
  language?: string;
  className?: string;
  showCopy?: boolean;
  showLineNumbers?: boolean;
}

export function CodeBlock({ code, language, className, showCopy = true, showLineNumbers = false }: Props) {
  const [copied, setCopied] = useState(false);
  const lang = language ?? detectLanguageFromCode(code);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className={cn("relative group rounded-xl overflow-hidden border border-white/10 bg-navy-950/60", className)}>
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest text-white/40 px-2 py-1 rounded-md bg-white/5">
          {lang}
        </span>
        {showCopy && (
          <button
            onClick={copy}
            className="p-1.5 rounded-md bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Copy code"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
          </button>
        )}
      </div>
      <SyntaxHighlighter
        language={lang}
        style={oneDark}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          padding: "1rem",
          background: "transparent",
          fontSize: "0.85rem",
          fontFamily: "var(--font-jetbrains), ui-monospace, monospace",
        }}
        codeTagProps={{
          style: { fontFamily: "var(--font-jetbrains), ui-monospace, monospace" },
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
