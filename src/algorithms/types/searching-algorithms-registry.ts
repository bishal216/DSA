// src/algorithms/types/searching-algorithms-registry.ts
//
// ─── HOW TO ADD A NEW SEARCH ALGORITHM ───────────────────────────────────────
//
//  1. Create a new file in src/algorithms/utils/searching-algorithms/
//     Use any existing file as a template (e.g. linearSearch.ts)
//
//  2. Implement your search function, then export a `definition` object:
//
//       export const definition: SearchAlgorithmDefinition = {
//         key: "mySearch",        ← unique key, camelCase
//         name: "My Search",      ← display name shown in the UI
//         func: mySearch,         ← your search function
//       };
//
//  That's it. No imports to add here, no registry to update manually.
//
// ─────────────────────────────────────────────────────────────────────────────

import type { SearchStep } from "@/algorithms/types/searching";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SearchAlgorithmDefinition {
  key: string;
  name: string;
  func: (array: number[], target: number) => SearchStep[];
}

// ── Auto-import all algorithm definitions ─────────────────────────────────────
// Vite's import.meta.glob eagerly imports every file in the folder.
// Each file must export a `definition` object matching SearchAlgorithmDefinition.

const modules = import.meta.glob<{ definition: SearchAlgorithmDefinition }>(
  "@/algorithms/utils/searching-algorithms/*.ts",
  { eager: true },
);

// ── Build registry ────────────────────────────────────────────────────────────

export const SEARCH_ALGORITHMS: Record<string, SearchAlgorithmDefinition> =
  Object.values(modules).reduce(
    (acc, mod) => {
      if (mod.definition) {
        acc[mod.definition.key] = mod.definition;
      }
      return acc;
    },
    {} as Record<string, SearchAlgorithmDefinition>,
  );

export type SearchAlgorithmKey = string;
