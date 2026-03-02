// src/config/algorithm-config.ts
// Feature registry for all algorithm sections.
// Used by: home page cards, search, routes/config.tsx, navigation.

import GraphAlgorithmsPage from "@/pages/algorithms/graphAlgorithmsPage";
import MSTPage from "@/pages/algorithms/MSTPage";
import PathFindingPage from "@/pages/algorithms/PathFindingPage";
import SearchPage from "@/pages/algorithms/search-page";
import SortPage from "@/pages/algorithms/sort-page";
import StringMatchingPage from "@/pages/algorithms/string-comparison-page";
import type { LucideIcon } from "lucide-react";
import { MoveRight, Search, SortAsc, Trees } from "lucide-react";
import type { ComponentType } from "react";

export type AlgorithmStatus = "active" | "beta" | "in-development";

export interface AlgorithmConfig {
  id: string;
  title: string;
  description: string;
  path: string; // relative path, no leading slash
  status: AlgorithmStatus;
  icon: LucideIcon;
  type: string;
  tags: string[];
  features: string[];
  pageComponent: ComponentType;
}

export const ALGORITHM_CONFIG: AlgorithmConfig[] = [
  {
    id: "sorting-algorithms",
    title: "Sorting Algorithms",
    description:
      "Visualize various sorting algorithms and understand their mechanics.",
    path: "algorithms/sorting",
    status: "active",
    icon: SortAsc,
    type: "Algorithms",
    tags: ["sorting", "algorithm", "algorithms"],
    features: ["Bubble Sort", "Merge Sort", "Quick Sort"],
    pageComponent: SortPage,
  },
  {
    id: "searching-algorithms",
    title: "Search Algorithms",
    description:
      "Explore different searching algorithms and see how they operate on data structures.",
    path: "algorithms/searching",
    status: "active",
    icon: Search,
    type: "Algorithms",
    tags: ["search", "algorithm", "algorithms"],
    features: ["Linear Search", "Binary Search"],
    pageComponent: SearchPage,
  },
  {
    id: "minimum-spanning-tree",
    title: "MST Algorithms",
    description:
      "Learn about Minimum Spanning Tree algorithms and their applications in graph theory.",
    path: "algorithms/mst",
    status: "active",
    icon: Trees,
    type: "Algorithms",
    tags: ["mst", "minimum spanning tree", "algorithm", "algorithms"],
    features: ["Kruskal's Algorithm", "Prim's Algorithm"],
    pageComponent: MSTPage,
  },
  {
    id: "pathfinding-algorithms",
    title: "Pathfinding Algorithms",
    description:
      "Visualize pathfinding algorithms like Dijkstra's and A* to understand how they find the shortest path.",
    path: "algorithms/pathfinding",
    status: "beta",
    icon: MoveRight,
    type: "Algorithms",
    tags: ["pathfinding", "algorithm", "algorithms"],
    features: ["Dijkstra's Algorithm", "A* Algorithm"],
    pageComponent: PathFindingPage,
  },
  {
    id: "graph-algorithms",
    title: "Graph Algorithms",
    description:
      "Explore various graph algorithms, including traversal and shortest path algorithms.",
    path: "algorithms/graph",
    status: "beta",
    icon: MoveRight,
    type: "Algorithms",
    tags: ["graph", "algorithm", "algorithms"],
    features: ["BFS", "DFS", "Topological Sort"],
    pageComponent: GraphAlgorithmsPage,
  },
  {
    id: "string-matching-algorithms",
    title: "String Matching Algorithms",
    description:
      "Understand string matching algorithms and their applications in text processing.",
    path: "algorithms/string-matching",
    status: "in-development",
    icon: MoveRight,
    type: "Algorithms",
    tags: ["string matching", "algorithm", "algorithms"],
    features: ["Knuth-Morris-Pratt", "Rabin-Karp", "Boyer-Moore"],
    pageComponent: StringMatchingPage,
  },
];

// ─── Derived helpers — import these instead of filtering the array manually ───

/** Only the configs shown as active cards on the home page */
export const activeAlgorithms = ALGORITHM_CONFIG.filter(
  (a) => a.status === "active" || a.status === "beta",
);

/** Quick lookup by id — used by search */
export const algorithmById = Object.fromEntries(
  ALGORITHM_CONFIG.map((a) => [a.id, a]),
) satisfies Record<string, AlgorithmConfig>;
