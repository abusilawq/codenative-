"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/shared/code-block";
import { Check, X, RotateCw, Sparkles } from "lucide-react";
import type { FlipCard as FlipCardType } from "@/lib/types";
import { getLanguage, type LanguageCode } from "@/lib/i18n/languages";

interface Props {
  card: FlipCardType;
  language: LanguageCode;
  onAnswer: (correct: boolean) => void;
}

export function FlipCard({ card, language, onAnswer }: Props) {
  const [flipped, setFlipped] = useState(false);
  const lang = getLanguage(language);

  return (
    <div dir={lang.rtl ? "rtl" : "ltr"} className="w-full max-w-2xl mx-auto">
      <div className="[perspective:1200px] min-h-[420px] mb-5">
        <motion.div
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full min-h-[420px]"
          style={{ transformStyle: "preserve-3d" }}
        >
          {/* FRONT */}
          <div
            className="absolute inset-0 glass-strong rounded-3xl p-6 sm:p-8 flex flex-col cursor-pointer overflow-hidden"
            style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
            onClick={() => setFlipped(true)}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-gold-500/[0.04] via-transparent to-purple-500/[0.04] pointer-events-none" />

            <div className="relative flex items-center justify-between mb-4">
              <Badge>{card.difficulty}</Badge>
              <span className="text-[10px] uppercase tracking-widest text-white/30">Click anywhere to flip</span>
            </div>

            <div className="relative flex-1 flex flex-col justify-center gap-4 min-h-0">
              <p className="text-lg sm:text-xl leading-relaxed font-medium text-white/95">{card.front}</p>
              {card.code && (
                <div onClick={(e) => e.stopPropagation()}>
                  <CodeBlock code={card.code} language={card.codeLang} />
                </div>
              )}
            </div>

            <div className="relative text-[11px] text-white/30 font-mono pt-3 mt-2 border-t border-white/5">
              {card.concept}
            </div>
          </div>

          {/* BACK */}
          <div
            className="absolute inset-0 glass-strong rounded-3xl p-6 sm:p-8 flex flex-col cursor-pointer overflow-hidden bg-gold-500/[0.06]"
            style={{
              backfaceVisibility: "hidden",
              WebkitBackfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
            onClick={() => setFlipped(false)}
          >
            <div className="flex items-center justify-between mb-4">
              <Badge variant="success" className="gap-1">
                <Sparkles className="h-3 w-3" /> Answer
              </Badge>
              <span className="text-[10px] uppercase tracking-widest text-white/40">Tap to flip back</span>
            </div>
            <div className="flex-1 overflow-auto text-base sm:text-lg leading-relaxed text-white/95 whitespace-pre-wrap">
              {card.back}
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {flipped ? (
          <motion.div
            key="rate"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex gap-3 justify-center"
          >
            <Button
              variant="outline"
              size="lg"
              onClick={() => {
                onAnswer(false);
                setFlipped(false);
              }}
              className="gap-2 min-w-[140px]"
            >
              <X className="h-4 w-4" /> Got it wrong
            </Button>
            <Button
              size="lg"
              onClick={() => {
                onAnswer(true);
                setFlipped(false);
              }}
              className="gap-2 min-w-[140px]"
            >
              <Check className="h-4 w-4" /> I knew it
            </Button>
          </motion.div>
        ) : (
          <motion.div key="reveal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
            <Button variant="ghost" onClick={() => setFlipped(true)} className="gap-2">
              <RotateCw className="h-4 w-4" /> Reveal answer
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
