"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { PageShell } from "@/components/shared/page-shell";
import { LanguagePicker } from "@/components/shared/language-picker";
import { DifficultyPicker } from "@/components/shared/difficulty-picker";
import { CodeEditor } from "@/components/explain/code-editor";
import { ExplanationPanel } from "@/components/explain/explanation-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useAppStore } from "@/lib/store";
import { Sparkles, Loader2, Code2, FileText } from "lucide-react";
import type { ExplainResult } from "@/lib/types";

const SAMPLE = `function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`;

export default function ExplainPage() {
  const [code, setCode] = useState(SAMPLE);
  const [result, setResult] = useState<ExplainResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeLine, setActiveLine] = useState<number | null>(null);
  const [mobileTab, setMobileTab] = useState<"code" | "explanation">("code");

  const language = useAppStore((s) => s.language);
  const difficulty = useAppStore((s) => s.difficulty);
  const recordStudy = useAppStore((s) => s.recordStudy);

  const explain = useCallback(async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, difficulty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed");
      setResult(data as ExplainResult);
      recordStudy();
      setMobileTab("explanation");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [code, language, difficulty, recordStudy]);

  return (
    <PageShell>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="font-display text-3xl sm:text-display-md text-gradient-white mb-2">Code Explainer</h1>
        <p className="text-white/60 text-sm sm:text-base">
          Paste any code. Get a line-by-line breakdown in your language.
        </p>
      </motion.div>

      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
          <div className="sm:w-64">
            <LanguagePicker />
          </div>
          <DifficultyPicker />
          <div className="sm:ml-auto">
            <Button onClick={explain} disabled={loading} size="lg" className="w-full sm:w-auto">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Explaining…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Explain
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile: tabbed view */}
      <div className="lg:hidden">
        <Tabs value={mobileTab} onValueChange={(v) => setMobileTab(v as "code" | "explanation")}>
          <TabsList className="w-full">
            <TabsTrigger value="code" className="flex-1 gap-1.5">
              <Code2 className="h-3.5 w-3.5" /> Code
            </TabsTrigger>
            <TabsTrigger value="explanation" className="flex-1 gap-1.5">
              <FileText className="h-3.5 w-3.5" /> Explanation
              {result && <span className="ml-1 text-[10px] bg-gold-500/20 text-gold-300 px-1.5 rounded-full">{result.lines.length}</span>}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="code">
            <Card className="overflow-hidden p-0 h-[60vh]">
              <CodeEditor value={code} onChange={setCode} highlightedLine={activeLine} className="h-full" />
            </Card>
          </TabsContent>
          <TabsContent value="explanation">
            <Card className="overflow-hidden p-0 h-[60vh]">
              <ExplanationPanel
                result={result}
                loading={loading}
                error={error}
                language={language}
                activeLine={activeLine}
                onLineClick={setActiveLine}
              />
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Desktop: side-by-side */}
      <div className="hidden lg:grid grid-cols-2 gap-4 h-[calc(100vh-260px)] min-h-[500px]">
        <Card className="overflow-hidden p-0">
          <CodeEditor value={code} onChange={setCode} highlightedLine={activeLine} className="h-full" />
        </Card>
        <Card className="overflow-hidden p-0">
          <ExplanationPanel
            result={result}
            loading={loading}
            error={error}
            language={language}
            activeLine={activeLine}
            onLineClick={setActiveLine}
          />
        </Card>
      </div>
    </PageShell>
  );
}
