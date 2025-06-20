import { iconMap } from "@/utils/iconmap";
import SortPage from "@/algorithms/pages/sortPage";
import SearchPage from "@/algorithms/pages/searchPage";
import mstPage from "@/algorithms/pages/MSTPage";
import PathfindingPage from "@/algorithms/pages/pathfindingPage";
import { RouteConfig } from "@/algorithms/types/routes";

export const ALGORITHM_ROUTE_CONFIG: RouteConfig[] = [
  {
    title: "Sorting Algorithms",
    path: "/algorithms/sorting",
    icon: iconMap.SortAsc,
    type: "Algorithms",
    pageComponent: SortPage,
    tags: ["sorting", "algorithm", "algorithms"],
  },
  {
    title: "Searching Algorithms",
    path: "/algorithms/searching",
    icon: iconMap.Search,
    type: "Algorithms",
    pageComponent: SearchPage,
    tags: ["search", "algorithm", "algorithms"],
  },
  {
    title: "Minimum Spanning Tree",
    path: "/algorithms/mst",
    icon: iconMap.Trees,
    type: "Algorithms",
    pageComponent: mstPage,
    tags: ["mst", "minimum spanning tree", "algorithm", "algorithms"],
  },
  {
    title: "Pathfinding Algorithms",
    path: "/algorithms/pathfinding",
    icon: iconMap.MoveRight,
    type: "Algorithms",
    pageComponent: PathfindingPage,
    tags: ["pathfinding", "algorithm", "algorithms"],
  },
] as const;
