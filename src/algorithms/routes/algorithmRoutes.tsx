import React from "react";
import { ALGORITHM_ROUTE_CONFIG } from "../config/routeConfig";

export const algorithmRoutes = ALGORITHM_ROUTE_CONFIG.map((route) => {
  return {
    path: route.path, // relative path, no leading slash
    element: React.createElement(route.pageComponent)
  };
});
