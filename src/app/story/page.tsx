"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/shared/page-shell";
import { LanguagePicker } from "@/components/shared/language-picker";
import { StoryCard } from "@/components/story/story-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAppStore } from "@/lib/store";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import type { StoryResult } from "@/lib/types";

const SUGGESTED_CONCEPTS = [
  "recursion", "async/await", "object-oriented programming",
  "closures", "pointers", "REST APIs", "git branching", "promises",
];

export default function StoryPage() {
  const [concept, setConcept] = useState("");
  const [story, setStory] = useState<StoryResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedThisStory, setSavedThisStory] = useState(false);

  const language = useAppStore((s) => s.language);
  const saveStory = useAppStore((s) => s.saveStory);
  const recordStudy = useAppStore((s) => s.recordStudy);

  const generate = useCallback(
    async (term: string) => {
      const target = (term || concept).trim();
      if (!target) return;
      setLoading(true);
      setError(null);
      setStory(null);
      setSavedThisStory(false);
      try {
        const res = await fetch("/api/story", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ concept: target, language }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed");
        setStory(data as StoryResult);
        recordStudy();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [concept, language, recordStudy]
  );

  const handleSave = () => {
    if (!story) return;
    saveStory({ concept: concept || story.analogy, language, content: JSON.stringify(story) });
    setSavedThisStory(true);
  };

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 max-w-3xl mx-auto text-center"
      >
        <BookOpen className="h-10 w-10 text-gold-400 mx-auto mb-4" />
        <h1 className="font-display text-display-md text-gradient-white mb-2">Story Mode</h1>
        <p className="text-white/60">
          Transform abstract programming concepts into culturally rooted stories that stick.
        </p>
      </motion.div>

      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardContent className="p-5 space-y-4">
            <div className="md:w-64">
              <LanguagePicker />
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="e.g. recursion, async/await, closures…"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && generate(concept)}
                className="flex-1"
              />
              <Button onClick={() => generate(concept)} disabled={loading || !concept.trim()} size="lg">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                Tell me a story
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_CONCEPTS.map((c) => (
                <button
                  key={c}
                  onClick={() => {
                    setConcept(c);
                    generate(c);
                  }}
                  className="text-xs px-3 py-1.5 rounded-full glass hover:bg-white/10 transition-colors"
                >
                  {c}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {loading && (
          <Card>
            <CardContent className="p-8 space-y-4">
              <Skeleton className="h-8 w-1/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </CardContent>
          </Card>
        )}

        {error && (
          <Card>
            <CardContent className="p-6 text-center text-destructive">{error}</CardContent>
          </Card>
        )}

        <AnimatePresence mode="wait">
          {story && (
            <StoryCard
              key={story.title}
              story={story}
              language={language}
              onSave={handleSave}
              saved={savedThisStory}
            />
          )}
        </AnimatePresence>
      </div>
    </PageShell>
  );
}
