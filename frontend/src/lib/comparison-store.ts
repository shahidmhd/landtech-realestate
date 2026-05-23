'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const MAX_COMPARE = 3;

interface State {
  slugs: string[];
  hydrated: boolean;
  add: (slug: string) => void;
  remove: (slug: string) => void;
  toggle: (slug: string) => boolean; // returns the new "in cart" state
  clear: () => void;
  has: (slug: string) => boolean;
  isFull: () => boolean;
}

export const useCompareStore = create<State>()(
  persist(
    (set, get) => ({
      slugs: [],
      hydrated: false,
      add: (slug) =>
        set((s) =>
          s.slugs.includes(slug) || s.slugs.length >= MAX_COMPARE
            ? s
            : { slugs: [...s.slugs, slug] }
        ),
      remove: (slug) => set((s) => ({ slugs: s.slugs.filter((x) => x !== slug) })),
      toggle: (slug) => {
        const { slugs } = get();
        if (slugs.includes(slug)) {
          set({ slugs: slugs.filter((x) => x !== slug) });
          return false;
        }
        if (slugs.length >= MAX_COMPARE) return true; // already full, no-op
        set({ slugs: [...slugs, slug] });
        return true;
      },
      clear: () => set({ slugs: [] }),
      has: (slug) => get().slugs.includes(slug),
      isFull: () => get().slugs.length >= MAX_COMPARE,
    }),
    {
      name: 'luxe_compare',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ slugs: s.slugs }),
      onRehydrateStorage: () => (state) => {
        if (state) state.hydrated = true;
      },
    }
  )
);
