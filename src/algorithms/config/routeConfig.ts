import SortPage from "@/algorithms/pages/sortPage";
import SearchPage from "@/algorithms/pages/searchPage";
import mstPage from "@/algorithms/pages/MSTPage";
import PathFindingPage from "@/algorithms/pages/PathFindingPage";
import GraphAlgorithmsPage from "@/algorithms/pages/graphAlgorithmsPage";
import StringMatchingPage from "../pages/stringComparisonPage";
import { RouteConfig } from "@/algorithms/types/routes";
import { SortAsc, Search, Trees, MoveRight } from "lucide-react";
export const ALGORITHM_ROUTE_CONFIG: RouteConfig[] = [
  {
    title: "Sorting Algorithms",
    description:
      "Visualize various sorting algorithms and understand their mechanics.",
    path: "/algorithms/sorting",
    id: "sorting-algorithms",
    status: "active",
    icon: SortAsc,
    type: "Algorithms",
    pageComponent: SortPage,
    tags: ["sorting", "algorithm", "algorithms"],
    features: ["Bubble Sort", "Quick Sort", "Merge Sort", "Insertion Sort"],
  },
  {
    title: "Searching Algorithms",
    description:
      "Explore different searching algorithms and see how they operate on data structures.",
    path: "/algorithms/searching",
    id: "searching-algorithms",
    status: "active",
    icon: Search,
    type: "Algorithms",
    pageComponent: SearchPage,
    tags: ["search", "algorithm", "algorithms"],
    features: ["Linear Search", "Binary Search"],
  },
  {
    title: "Minimum Spanning Tree",
    description:
      "Learn about Minimum Spanning Tree algorithms and their applications in graph theory.",
    path: "/algorithms/mst",
    id: "minimum-spanning-tree",
    status: "active",
    icon: Trees,
    type: "Algorithms",
    pageComponent: mstPage,
    tags: ["mst", "minimum spanning tree", "algorithm", "algorithms"],
    features: ["Kruskal's Algorithm", "Prim's Algorithm"],
  },
  {
    title: "Pathfinding Algorithms",
    description:
      "Visualize pathfinding algorithms like Dijkstra's and A* to understand how they find the shortest path in a graph.",
    path: "/algorithms/pathfinding",
    id: "pathfinding-algorithms",
    status: "beta",
    icon: MoveRight,
    type: "Algorithms",
    pageComponent: PathFindingPage,
    tags: ["pathfinding", "algorithm", "algorithms"],
    features: ["Dijkstra's Algorithm", "A* Algorithm"],
  },
  {
    title: "Graph Algorithms",
    description:
      "Explore various graph algorithms, including traversal and shortest path algorithms.",
    path: "/algorithms/graph",
    id: "graph-algorithms",
    status: "beta",
    icon: MoveRight,
    type: "Algorithms",
    pageComponent: GraphAlgorithmsPage,
    tags: ["graph", "algorithm", "algorithms"],
    features: ["BFS", "DFS", "Topological Sort"],
  },
  {
    title: "String Matching Algorithms",
    description:
      "Understand string matching algorithms and their applications in text processing.",
    path: "/algorithms/string-matching",
    id: "string-matching-algorithms",
    status: "in-development",
    icon: MoveRight,
    type: "Algorithms",
    pageComponent: StringMatchingPage,
    tags: ["string matching", "algorithm", "algorithms"],
    features: ["Knuth-Morris-Pratt", "Rabin-Karp", "Boyer-Moore"],
  },
] as const;
