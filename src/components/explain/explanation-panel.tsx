"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { ExplainResult } from "@/lib/types";
import { Sparkles, AlertCircle } from "lucide-react";
import { getLanguage, type LanguageCode } from "@/lib/i18n/languages";

interface Props {
  result: ExplainResult | null;
  loading: boolean;
  error: string | null;
  language: LanguageCode;
  activeLine: number | null;
  onLineClick: (line: number) => void;
}

export function ExplanationPanel({ result, loading, error, language, activeLine, onLineClick }: Props) {
  const lang = getLanguage(language);
  const isRTL = lang.rtl;

  if (loading) {
    return (
      <div className="space-y-4 p-6">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="pt-4 space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center mb-3">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>
        <p className="text-white/80 font-medium mb-1">Something went wrong</p>
        <p className="text-sm text-white/50 max-w-sm">{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-gold/20 flex items-center justify-center mb-4 shadow-glow">
          <Sparkles className="h-8 w-8 text-gold-400" />
        </div>
        <h3 className="font-display text-xl mb-2">Paste code, click Explain</h3>
        <p className="text-sm text-white/50 max-w-sm">
          Get a line-by-line breakdown in <span className="text-gold-400">{lang.nativeName}</span>.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full" dir={isRTL ? "rtl" : "ltr"}>
      <div className="p-6 space-y-6">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Badge className="mb-3">{result.language}</Badge>
          <p className="text-white/90 leading-relaxed">{result.summary}</p>
        </motion.div>

        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold">
            Line-by-line
          </h4>
          <AnimatePresence>
            {result.lines.map((line, i) => (
              <motion.button
                key={`${line.line}-${i}`}
                onClick={() => onLineClick(line.line)}
                initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={cn(
                  "w-full text-left p-3 rounded-xl border transition-all",
                  activeLine === line.line
                    ? "bg-gold-500/10 border-gold-500/40 shadow-glow"
                    : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10"
                )}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    line {line.line}
                  </Badge>
                  <code className="text-xs font-mono text-gold-300/80 truncate flex-1">{line.code}</code>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{line.explanation}</p>
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {result.concepts?.length > 0 && (
          <div className="space-y-3 pt-4 border-t border-white/5">
            <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold">Key concepts</h4>
            <div className="space-y-2">
              {result.concepts.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.05 }}
                  className="glass p-3 rounded-xl"
                >
                  <div className="font-mono text-sm text-gold-400 mb-1">{c.term}</div>
                  <div className="text-sm text-white/70">{c.definition}</div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ScrollArea>
  );
}
