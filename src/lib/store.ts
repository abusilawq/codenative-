"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { DEFAULT_LANGUAGE, type LanguageCode } from "@/lib/i18n/languages";

export type Difficulty = "beginner" | "intermediate" | "advanced";

interface SavedStory {
  id: string;
  concept: string;
  language: LanguageCode;
  content: string;
  createdAt: number;
}

interface AppState {
  language: LanguageCode;
  difficulty: Difficulty;
  streak: number;
  lastStudiedAt: number | null;
  savedStories: SavedStory[];

  setLanguage: (l: LanguageCode) => void;
  setDifficulty: (d: Difficulty) => void;
  recordStudy: () => void;
  saveStory: (s: Omit<SavedStory, "id" | "createdAt">) => void;
  removeStory: (id: string) => void;
}

const ONE_DAY = 1000 * 60 * 60 * 24;

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: DEFAULT_LANGUAGE,
      difficulty: "beginner",
      streak: 0,
      lastStudiedAt: null,
      savedStories: [],

      setLanguage: (language) => set({ language }),
      setDifficulty: (difficulty) => set({ difficulty }),

      recordStudy: () => {
        const now = Date.now();
        const last = get().lastStudiedAt;
        if (!last) return set({ streak: 1, lastStudiedAt: now });
        const diff = now - last;
        if (diff < ONE_DAY) return set({ lastStudiedAt: now });
        if (diff < ONE_DAY * 2) return set({ streak: get().streak + 1, lastStudiedAt: now });
        return set({ streak: 1, lastStudiedAt: now });
      },

      saveStory: (s) =>
        set({
          savedStories: [
            { ...s, id: crypto.randomUUID(), createdAt: Date.now() },
            ...get().savedStories,
          ].slice(0, 100),
        }),

      removeStory: (id) => set({ savedStories: get().savedStories.filter((s) => s.id !== id) }),
    }),
    { name: "codenative-storage" }
  )
);
