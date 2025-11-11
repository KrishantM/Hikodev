import { create } from "zustand";

import type { Difficulty } from "@/lib/types";

interface HikeFilterState {
  region?: string;
  difficulty: Difficulty[];
  overnight?: boolean;
  tags: string[];
  setRegion(region?: string): void;
  toggleDifficulty(difficulty: Difficulty): void;
  setOvernight(value?: boolean): void;
  toggleTag(tag: string): void;
  reset(): void;
}

export const useHikeFilters = create<HikeFilterState>((set, get) => ({
  region: undefined,
  difficulty: [],
  overnight: undefined,
  tags: [],
  setRegion: (region) => set({ region }),
  toggleDifficulty: (difficulty) => {
    const { difficulty: current } = get();
    set({
      difficulty: current.includes(difficulty)
        ? current.filter((value) => value !== difficulty)
        : [...current, difficulty],
    });
  },
  setOvernight: (value) => set({ overnight: value }),
  toggleTag: (tag) => {
    const { tags } = get();
    set({
      tags: tags.includes(tag) ? tags.filter((item) => item !== tag) : [...tags, tag],
    });
  },
  reset: () => set({ region: undefined, difficulty: [], overnight: undefined, tags: [] }),
}));
