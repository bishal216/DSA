import { iconMap } from "@/utils/iconmap";
import SortPage from "@/algorithms/pages/sortPage";
import SearchPage from "@/algorithms/pages/searchPage";
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
] as const;
