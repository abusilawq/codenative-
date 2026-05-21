"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { detectLanguageFromCode } from "@/lib/utils";

const Monaco = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <Skeleton className="h-full w-full" />,
});

interface Props {
  value: string;
  onChange: (v: string) => void;
  highlightedLine?: number | null;
  className?: string;
}

export function CodeEditor({ value, onChange, highlightedLine, className }: Props) {
  const detected = useMemo(() => detectLanguageFromCode(value), [value]);

  return (
    <div className={className}>
      <Monaco
        height="100%"
        language={detected}
        value={value}
        onChange={(v) => onChange(v ?? "")}
        theme="vs-dark"
        line={highlightedLine ?? undefined}
        options={{
          fontSize: 14,
          fontFamily: "var(--font-jetbrains), monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: "all",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          tabSize: 2,
          wordWrap: "on",
          automaticLayout: true,
        }}
      />
    </div>
  );
}
