// src/algorithms/types/sortingAlgorithms.ts
//
// ─── HOW TO ADD A NEW SORTING ALGORITHM ──────────────────────────────────────
//
//  1. Create a new file in src/algorithms/utils/sortingAlgorithms/
//     Use any existing file as a template (e.g. bubbleSort.ts)
//
//  2. Implement your sort function, then export a `definition` object:
//
//       export const definition: SortingAlgorithmDefinition = {
//         key: "mySort",          ← unique key, camelCase
//         name: "My Sort",        ← display name shown in the UI
//         func: mySort,           ← your sort function
//       };
//
//  That's it. No imports to add here, no registry to update manually.
//
// ─────────────────────────────────────────────────────────────────────────────

import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SortingAlgorithmDefinition {
  key: string;
  name: string;
  func: (array: ArrayElement[]) => SortingStep[];
}

// ── Auto-import all algorithm definitions ─────────────────────────────────────
// Vite's import.meta.glob eagerly imports every file in the folder.
// Each file must export a `definition` object matching SortingAlgorithmDefinition.

const modules = import.meta.glob<{ definition: SortingAlgorithmDefinition }>(
  "@/algorithms/utils/sorting-algorithms/*.ts",
  { eager: true },
);

// ── Build registry ────────────────────────────────────────────────────────────

export const SORTING_ALGORITHMS: Record<string, SortingAlgorithmDefinition> =
  Object.values(modules).reduce(
    (acc, mod) => {
      if (mod.definition) {
        acc[mod.definition.key] = mod.definition;
      }
      return acc;
    },
    {} as Record<string, SortingAlgorithmDefinition>,
  );

export type SortingAlgorithmKey = string;
