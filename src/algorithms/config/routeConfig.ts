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
    path: "/algorithms/sorting",
    icon: SortAsc,
    type: "Algorithms",
    pageComponent: SortPage,
    tags: ["sorting", "algorithm", "algorithms"],
  },
  {
    title: "Searching Algorithms",
    path: "/algorithms/searching",
    icon: Search,
    type: "Algorithms",
    pageComponent: SearchPage,
    tags: ["search", "algorithm", "algorithms"],
  },
  {
    title: "Minimum Spanning Tree",
    path: "/algorithms/mst",
    icon: Trees,
    type: "Algorithms",
    pageComponent: mstPage,
    tags: ["mst", "minimum spanning tree", "algorithm", "algorithms"],
  },
  {
    title: "Pathfinding Algorithms",
    path: "/algorithms/pathfinding",
    icon: MoveRight,
    type: "Algorithms",
    pageComponent: PathFindingPage,
    tags: ["pathfinding", "algorithm", "algorithms"],
  },
  {
    title: "Graph Algorithms",
    path: "/algorithms/graph",
    icon: MoveRight,
    type: "Algorithms",
    pageComponent: GraphAlgorithmsPage,
    tags: ["graph", "algorithm", "algorithms"],
  },
  {
    title: "String Matching Algorithms",
    path: "/algorithms/string-matching",
    icon: MoveRight,
    type: "Algorithms",
    pageComponent: StringMatchingPage,
    tags: ["string matching", "algorithm", "algorithms"],
  },
] as const;
