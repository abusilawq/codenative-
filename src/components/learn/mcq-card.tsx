"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/shared/code-block";
import { Check, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { MCQCard as MCQType } from "@/lib/types";
import { getLanguage, type LanguageCode } from "@/lib/i18n/languages";

interface Props {
  card: MCQType;
  language: LanguageCode;
  onAnswer: (correct: boolean) => void;
}

export function MCQCard({ card, language, onAnswer }: Props) {
  const [picked, setPicked] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const lang = getLanguage(language);
  const correct = picked === card.correctIndex;

  const submit = () => {
    if (picked === null) return;
    setSubmitted(true);
    onAnswer(picked === card.correctIndex);
  };

  return (
    <div dir={lang.rtl ? "rtl" : "ltr"} className="w-full max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-6 sm:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.04] via-transparent to-cyan-500/[0.04] pointer-events-none" />

        <div className="relative flex items-center justify-between mb-4">
          <Badge>{card.difficulty}</Badge>
          <Badge variant="secondary">Multiple choice</Badge>
        </div>

        <h3 className="relative text-lg sm:text-xl font-medium text-white/95 mb-4 leading-relaxed">
          {card.question}
        </h3>

        {card.code && (
          <div className="relative mb-5">
            <CodeBlock code={card.code} language={card.codeLang} />
          </div>
        )}

        <div className="relative space-y-2 mb-5">
          {card.options.map((opt, i) => {
            const isPicked = picked === i;
            const isCorrect = i === card.correctIndex;
            const showState = submitted;
            return (
              <motion.button
                key={i}
                disabled={submitted}
                onClick={() => !submitted && setPicked(i)}
                initial={{ opacity: 0, x: lang.rtl ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3",
                  "hover:border-white/20 hover:bg-white/[0.04]",
                  !showState && isPicked && "border-gold-500/50 bg-gold-500/10",
                  !showState && !isPicked && "border-white/10 bg-white/[0.02]",
                  showState && isCorrect && "border-emerald-500/60 bg-emerald-500/10",
                  showState && isPicked && !isCorrect && "border-red-500/60 bg-red-500/10",
                  showState && !isCorrect && !isPicked && "border-white/5 bg-white/[0.01] opacity-50"
                )}
              >
                <div
                  className={cn(
                    "flex-shrink-0 w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold transition-colors",
                    !showState && isPicked && "border-gold-500 bg-gold-500 text-navy-900",
                    !showState && !isPicked && "border-white/20 text-white/60",
                    showState && isCorrect && "border-emerald-500 bg-emerald-500 text-navy-900",
                    showState && isPicked && !isCorrect && "border-red-500 bg-red-500 text-white"
                  )}
                >
                  {showState && isCorrect ? (
                    <Check className="h-4 w-4" />
                  ) : showState && isPicked && !isCorrect ? (
                    <X className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(65 + i)
                  )}
                </div>
                <span className="flex-1 text-sm sm:text-base text-white/90">{opt}</span>
              </motion.button>
            );
          })}
        </div>

        <AnimatePresence>
          {submitted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="relative overflow-hidden"
            >
              <div
                className={cn(
                  "rounded-xl p-4 border mb-4",
                  correct
                    ? "border-emerald-500/30 bg-emerald-500/[0.06]"
                    : "border-red-500/30 bg-red-500/[0.06]"
                )}
              >
                <div className="flex items-center gap-2 mb-2">
                  {correct ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <X className="h-4 w-4 text-red-400" />
                  )}
                  <span className={cn("font-semibold text-sm", correct ? "text-emerald-300" : "text-red-300")}>
                    {correct ? "Correct!" : "Not quite"}
                  </span>
                </div>
                <p className="text-sm text-white/80 leading-relaxed">{card.explanation}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative flex justify-end">
          {!submitted ? (
            <Button onClick={submit} disabled={picked === null} size="lg">
              Submit <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={() => onAnswer(correct)}
              variant="outline"
              size="lg"
              className="pointer-events-none opacity-60"
            >
              Loading next…
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
