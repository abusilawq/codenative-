"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/shared/page-shell";
import { LanguagePicker } from "@/components/shared/language-picker";
import { FlipCard } from "@/components/learn/flip-card";
import { MCQCard } from "@/components/learn/mcq-card";
import { StreakBadge } from "@/components/learn/streak-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import { Flame, Loader2, Sparkles, Trophy, Shuffle, ListChecks, Layers } from "lucide-react";
import type { Flashcard } from "@/lib/types";
import { cn } from "@/lib/utils";

type Mode = "mixed" | "flip" | "mcq";

interface SessionResult {
  card: Flashcard;
  correct: boolean;
}

export default function LearnPage() {
  const [mode, setMode] = useState<Mode>("mixed");
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<SessionResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const language = useAppStore((s) => s.language);
  const recordStudy = useAppStore((s) => s.recordStudy);

  const loadCards = useCallback(
    async (forcedMode?: Mode) => {
      const useMode = forcedMode ?? mode;
      setLoading(true);
      setError(null);
      setCards([]);
      setIndex(0);
      setResults([]);
      try {
        const recent = JSON.parse(localStorage.getItem("recent-concepts") ?? "[]") as string[];
        const res = await fetch("/api/flashcards", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ language, count: 6, recentConcepts: recent, mode: useMode }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed");
        setCards(data.cards);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [language, mode]
  );

  useEffect(() => {
    void loadCards("mixed");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      const card = cards[index];
      setResults((r) => [...r, { card, correct }]);
      if (correct) recordStudy();

      const recent = JSON.parse(localStorage.getItem("recent-concepts") ?? "[]") as string[];
      const updated = [card.concept, ...recent.filter((c) => c !== card.concept)].slice(0, 20);
      localStorage.setItem("recent-concepts", JSON.stringify(updated));

      // Auto-advance for MCQ after a short delay to let user read explanation
      if (card.kind === "mcq") {
        setTimeout(() => setIndex((i) => i + 1), 1800);
      } else {
        setIndex((i) => i + 1);
      }
    },
    [cards, index, recordStudy]
  );

  const done = cards.length > 0 && index >= cards.length;
  const score = results.filter((r) => r.correct).length;
  const accuracy = results.length > 0 ? Math.round((score / results.length) * 100) : 0;

  const currentCard = cards[index];

  const MODE_OPTIONS: { value: Mode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { value: "mixed", label: "Mixed", icon: Shuffle },
    { value: "flip", label: "Flip", icon: Layers },
    { value: "mcq", label: "MCQ", icon: ListChecks },
  ];

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-wrap items-center justify-between gap-4"
      >
        <div>
          <Flame className="h-10 w-10 text-gold-400 mb-3" />
          <h1 className="font-display text-display-md text-gradient-white mb-2">Daily Learning</h1>
          <p className="text-white/60">Flashcards & quizzes with spaced repetition.</p>
        </div>
        <StreakBadge />
      </motion.div>

      <Card className="mb-6">
        <CardContent className="p-4 sm:p-5 flex flex-col gap-3">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
            <div className="sm:w-64">
              <LanguagePicker />
            </div>
            <Tabs
              value={mode}
              onValueChange={(v) => {
                setMode(v as Mode);
                void loadCards(v as Mode);
              }}
              className="sm:ml-auto"
            >
              <TabsList>
                {MODE_OPTIONS.map((m) => {
                  const Icon = m.icon;
                  return (
                    <TabsTrigger key={m.value} value={m.value} className="gap-1.5">
                      <Icon className="h-3.5 w-3.5" /> {m.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>
            <Button onClick={() => loadCards()} disabled={loading} variant="outline">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              New session
            </Button>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card>
          <CardContent className="p-6 text-center text-destructive">{error}</CardContent>
        </Card>
      )}

      {loading && (
        <div className="max-w-2xl mx-auto space-y-4">
          <Skeleton className="h-2 w-full" />
          <Skeleton className="h-[420px] w-full" />
          <div className="flex justify-center gap-3">
            <Skeleton className="h-12 w-36" />
            <Skeleton className="h-12 w-36" />
          </div>
        </div>
      )}

      <AnimatePresence mode="wait">
        {!loading && currentCard && !done && (
          <motion.div
            key={`${index}-${currentCard.kind}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-5 max-w-2xl mx-auto">
              <div className="flex justify-between items-center text-xs text-white/60 mb-2">
                <span className="font-mono">
                  {String(index + 1).padStart(2, "0")} / {String(cards.length).padStart(2, "0")}
                </span>
                <div className="flex items-center gap-3">
                  <span className={cn("font-mono", accuracy >= 75 ? "text-emerald-400" : "text-white/60")}>
                    {results.length > 0 && `${accuracy}% accuracy`}
                  </span>
                  <span className="font-mono">{Math.round(((index + 1) / cards.length) * 100)}%</span>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-gold"
                  initial={{ width: 0 }}
                  animate={{ width: `${((index + 1) / cards.length) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {currentCard.kind === "flip" ? (
              <FlipCard card={currentCard} language={language} onAnswer={handleAnswer} />
            ) : (
              <MCQCard card={currentCard} language={language} onAnswer={handleAnswer} />
            )}
          </motion.div>
        )}

        {done && (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md mx-auto text-center"
          >
            <Card>
              <CardContent className="p-8 sm:p-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-20 h-20 rounded-full bg-gradient-gold mx-auto mb-5 flex items-center justify-center shadow-glow-lg"
                >
                  <Trophy className="h-10 w-10 text-navy-900" />
                </motion.div>
                <h2 className="font-display text-3xl mb-2">Session complete!</h2>
                <p className="text-white/70 mb-2">
                  <span className="text-gold-400 font-bold text-2xl">
                    {score}/{cards.length}
                  </span>{" "}
                  correct
                </p>
                <p className="text-sm text-white/50 mb-6">{accuracy}% accuracy</p>
                <Button onClick={() => loadCards()} size="lg" className="w-full">
                  <Sparkles className="h-4 w-4" />
                  Start a new session
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  );
}
