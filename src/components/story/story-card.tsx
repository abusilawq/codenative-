"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bookmark, Volume2, VolumeX } from "lucide-react";
import { useState, useCallback } from "react";
import type { StoryResult } from "@/lib/types";
import { getLanguage, type LanguageCode } from "@/lib/i18n/languages";

interface Props {
  story: StoryResult;
  language: LanguageCode;
  onSave?: () => void;
  saved?: boolean;
}

const BCP47: Record<string, string> = {
  uz: "uz-UZ", kk: "kk-KZ", ky: "ky-KG", tg: "tg-TJ", tk: "tk-TM",
  ru: "ru-RU", tr: "tr-TR", az: "az-AZ", en: "en-US", es: "es-ES",
  pt: "pt-BR", fr: "fr-FR", de: "de-DE", it: "it-IT", zh: "zh-CN",
  ja: "ja-JP", ko: "ko-KR", hi: "hi-IN", ar: "ar-SA", id: "id-ID",
};

export function StoryCard({ story, language, onSave, saved }: Props) {
  const [speaking, setSpeaking] = useState(false);
  const lang = getLanguage(language);

  const speak = useCallback(() => {
    if (typeof window === "undefined" || !window.speechSynthesis) return;
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const utter = new SpeechSynthesisUtterance(`${story.title}. ${story.story}`);
    utter.lang = BCP47[language] ?? "en-US";
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utter);
    setSpeaking(true);
  }, [speaking, story, language]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      dir={lang.rtl ? "rtl" : "ltr"}
    >
      <Card className="overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gold-500/5 via-transparent to-purple-500/5 pointer-events-none" />
        <CardContent className="p-8 relative">
          <div className="flex items-start justify-between gap-3 mb-5">
            <div className="flex-1">
              <Badge variant="default" className="mb-3">
                {story.analogy}
              </Badge>
              <h2 className="font-display text-3xl md:text-4xl text-gradient-gold leading-tight">
                {story.title}
              </h2>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={speak} aria-label="Read aloud">
                {speaking ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </Button>
              {onSave && (
                <Button variant="ghost" size="icon" onClick={onSave} aria-label="Save story">
                  <Bookmark className={`h-5 w-5 ${saved ? "fill-gold-400 text-gold-400" : ""}`} />
                </Button>
              )}
            </div>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-white/85 leading-relaxed whitespace-pre-line mb-7"
          >
            {story.story}
          </motion.p>

          <div className="space-y-2 mb-6">
            <h4 className="text-xs uppercase tracking-widest text-white/40 font-semibold">Mapping</h4>
            {story.mapping.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: lang.rtl ? 10 : -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.08 }}
                className="flex items-center gap-3 p-3 rounded-xl glass"
              >
                <span className="text-sm text-white/80">{m.story_element}</span>
                <span className="text-gold-400">→</span>
                <code className="text-sm font-mono text-gold-300">{m.code_concept}</code>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="border-l-2 border-gold-500 pl-4 italic text-white/90"
          >
            {story.takeaway}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
