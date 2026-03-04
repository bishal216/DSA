// src/algorithms/types/string-matching-registry.ts
//
// ─── HOW TO ADD A NEW STRING MATCHING ALGORITHM ───────────────────────────────
//
//  1. Create a file in:
//       src/algorithms/utils/string-matching-algorithms/
//
//  2. Export a `definition` object:
//
//       export const definition: StringMatchingAlgorithmDefinition = {
//         key: "myAlgorithm",
//         name: "My Algorithm",
//         func: myAlgorithm,
//       };
//
// ─────────────────────────────────────────────────────────────────────────────

import type {
  StringMatchingOptions,
  StringMatchingStep,
} from "@/algorithms/types/string-matching";

export interface StringMatchingAlgorithmDefinition {
  key: string;
  name: string;
  func: (options: StringMatchingOptions) => StringMatchingStep[];
}

const modules = import.meta.glob<{
  definition: StringMatchingAlgorithmDefinition;
}>("@/algorithms/utils/string-matching-algorithms/*.ts", { eager: true });

export const STRING_MATCHING_ALGORITHMS: Record<
  string,
  StringMatchingAlgorithmDefinition
> = Object.values(modules).reduce(
  (acc, mod) => {
    if (mod.definition) acc[mod.definition.key] = mod.definition;
    return acc;
  },
  {} as Record<string, StringMatchingAlgorithmDefinition>,
);

export type StringMatchingAlgorithmKey = string;
