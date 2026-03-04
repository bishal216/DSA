// src/algorithms/types/graph-algorithms-registry.ts
//
// ─── HOW TO ADD A NEW GRAPH ALGORITHM ────────────────────────────────────────
//
//  1. Create a new file in the appropriate subfolder:
//       src/algorithms/utils/graph-algorithms/mst-algorithms/
//       src/algorithms/utils/graph-algorithms/pathfinding-algorithms/
//       src/algorithms/utils/graph-algorithms/scc-algorithms/
//       src/algorithms/utils/graph-algorithms/traversal-algorithms/
//
//  2. Implement your algorithm, then export a `definition` object:
//
//       export const definition: GraphAlgorithmDefinition = {
//         key: "myAlgorithm",
//         name: "My Algorithm",
//         category: "mst",           ← "mst" | "pathfinding" | "scc" | "traversal"
//         func: myAlgorithm,
//       };
//
//  That's it. No imports to add here, no registry to update manually.
//
// ─────────────────────────────────────────────────────────────────────────────

import type {
  GraphAlgorithmOptions,
  GraphData,
  GraphStep,
} from "@/algorithms/types/graph";

// ── Types ─────────────────────────────────────────────────────────────────────

export type GraphAlgorithmCategory =
  | "mst"
  | "pathfinding"
  | "scc"
  | "traversal";

export interface GraphAlgorithmDefinition {
  key: string;
  name: string;
  category: GraphAlgorithmCategory;
  func: (graph: GraphData, options?: GraphAlgorithmOptions) => GraphStep[];
}

// ── Auto-import all algorithm definitions ─────────────────────────────────────

const modules = import.meta.glob<{ definition: GraphAlgorithmDefinition }>(
  "@/algorithms/utils/graph-algorithms/**/*.ts",
  { eager: true },
);

// ── Build registry ────────────────────────────────────────────────────────────

export const GRAPH_ALGORITHMS: Record<string, GraphAlgorithmDefinition> =
  Object.values(modules).reduce(
    (acc, mod) => {
      if (mod.definition) {
        acc[mod.definition.key] = mod.definition;
      }
      return acc;
    },
    {} as Record<string, GraphAlgorithmDefinition>,
  );

// ── Per-category helpers ──────────────────────────────────────────────────────

export function getAlgorithmsByCategory(
  category: GraphAlgorithmCategory,
): GraphAlgorithmDefinition[] {
  return Object.values(GRAPH_ALGORITHMS).filter(
    (def) => def.category === category,
  );
}

export type GraphAlgorithmKey = string;
