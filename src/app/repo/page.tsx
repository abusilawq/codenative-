"use client";

import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { PageShell } from "@/components/shared/page-shell";
import { LanguagePicker } from "@/components/shared/language-picker";
import { RepoTree } from "@/components/repo/repo-tree";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/lib/store";
import { GitBranch, Loader2, Star, MapPin } from "lucide-react";
import type { RepoTourFile, RepoTourResult } from "@/lib/types";

interface RepoMeta {
  name: string;
  description: string | null;
  stars: number;
  defaultBranch: string;
}

const SUGGESTED = [
  "https://github.com/vercel/next.js",
  "https://github.com/tailwindlabs/tailwindcss",
  "https://github.com/anthropics/anthropic-sdk-typescript",
];

export default function RepoPage() {
  const [url, setUrl] = useState("https://github.com/vercel/swr");
  const [meta, setMeta] = useState<RepoMeta | null>(null);
  const [tour, setTour] = useState<RepoTourResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<RepoTourFile | null>(null);

  const language = useAppStore((s) => s.language);
  const recordStudy = useAppStore((s) => s.recordStudy);

  const load = useCallback(
    async (target?: string) => {
      const u = (target ?? url).trim();
      if (!u) return;
      setLoading(true);
      setError(null);
      setMeta(null);
      setTour(null);
      try {
        const res = await fetch("/api/repo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: u, language }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? "Failed");
        setMeta(data.repo);
        setTour(data.tour);
        recordStudy();
      } catch (e) {
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    },
    [url, language, recordStudy]
  );

  return (
    <PageShell>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <GitBranch className="h-10 w-10 text-gold-400 mb-3" />
        <h1 className="font-display text-display-md text-gradient-white mb-2">RepoGuide</h1>
        <p className="text-white/60">
          Drop any public GitHub URL. Get a visual map and a learning path in your language.
        </p>
      </motion.div>

      <Card className="mb-6">
        <CardContent className="p-5 space-y-4">
          <div className="md:w-64">
            <LanguagePicker />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="https://github.com/owner/repo"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              className="flex-1 font-mono text-sm"
            />
            <Button onClick={() => load()} disabled={loading} size="lg">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitBranch className="h-4 w-4" />}
              Explore
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {SUGGESTED.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setUrl(s);
                  load(s);
                }}
                className="text-xs px-3 py-1.5 rounded-full glass hover:bg-white/10 transition-colors font-mono"
              >
                {s.replace("https://github.com/", "")}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="mb-6">
          <CardContent className="p-5 text-center text-destructive">{error}</CardContent>
        </Card>
      )}

      {loading && (
        <Card>
          <CardContent className="p-6 space-y-3">
            <Skeleton className="h-6 w-1/3" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-[500px] w-full" />
          </CardContent>
        </Card>
      )}

      {meta && tour && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <h2 className="font-display text-2xl">{meta.name}</h2>
                <Badge variant="secondary" className="gap-1">
                  <Star className="h-3 w-3" />
                  {meta.stars.toLocaleString()}
                </Badge>
              </div>
              {meta.description && <p className="text-white/70 mb-4">{meta.description}</p>}
              <p className="text-white/85 leading-relaxed mb-5">{tour.overview}</p>

              <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl bg-gold-500/5 border border-gold-500/20">
                <MapPin className="h-4 w-4 text-gold-400" />
                <span className="text-sm text-white/70">Start here:</span>
                <code className="text-sm font-mono text-gold-300">{tour.startHere}</code>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-lg mb-4">Visual map</h3>
              <p className="text-xs text-white/40 mb-4">
                Color = category · Size = importance · Click any file for details
              </p>
              <RepoTree files={tour.files} onNodeClick={setSelected} />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h3 className="font-display text-lg mb-4">Recommended learning path</h3>
              <ol className="space-y-2">
                {tour.learningPath.map((path, i) => {
                  const file = tour.files.find((f) => f.path === path);
                  return (
                    <li key={path} className="flex items-start gap-3 p-3 rounded-xl glass">
                      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gold-500 text-navy-900 font-bold text-sm flex items-center justify-center">
                        {i + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <code className="text-sm font-mono text-gold-300 block truncate">{path}</code>
                        {file && <p className="text-sm text-white/60 mt-1">{file.description}</p>}
                      </div>
                    </li>
                  );
                })}
              </ol>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <Dialog open={!!selected} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent>
          {selected && (
            <>
              <DialogHeader>
                <Badge className="self-start mb-1">{selected.category}</Badge>
                <DialogTitle className="font-mono text-base">{selected.path}</DialogTitle>
                <DialogDescription className="pt-2 text-base text-white/80">
                  {selected.description}
                </DialogDescription>
              </DialogHeader>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <span>Importance:</span>
                <div className="flex-1 h-2 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-gradient-gold"
                    style={{ width: `${selected.importance * 10}%` }}
                  />
                </div>
                <span className="font-mono text-gold-400">{selected.importance}/10</span>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </PageShell>
  );
}
