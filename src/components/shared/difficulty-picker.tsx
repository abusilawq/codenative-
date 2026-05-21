"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore, type Difficulty } from "@/lib/store";
import { Sparkles, Brain, Flame } from "lucide-react";

const OPTIONS: { value: Difficulty; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: "beginner", label: "Beginner", icon: Sparkles },
  { value: "intermediate", label: "Intermediate", icon: Brain },
  { value: "advanced", label: "Advanced", icon: Flame },
];

export function DifficultyPicker() {
  const difficulty = useAppStore((s) => s.difficulty);
  const setDifficulty = useAppStore((s) => s.setDifficulty);
  return (
    <Tabs value={difficulty} onValueChange={(v) => setDifficulty(v as Difficulty)}>
      <TabsList>
        {OPTIONS.map((opt) => {
          const Icon = opt.icon;
          return (
            <TabsTrigger key={opt.value} value={opt.value} className="gap-1.5">
              <Icon className="h-3.5 w-3.5" />
              {opt.label}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
