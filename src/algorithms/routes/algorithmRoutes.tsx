import { ALGORITHM_ROUTE_CONFIG } from "../config/routeConfig";

export const algorithmRoutes = ALGORITHM_ROUTE_CONFIG.map((route) => ({
  path: route.path,
  element: <route.pageComponent />,
}));
