// algorithmRoutes.tsx
import { ALGORITHM_CONFIG } from "@/config/algorithm-config";
import React from "react";

export const algorithmRoutes = ALGORITHM_CONFIG.map((route) => {
  return {
    path: route.path, // relative path, no leading slash
    element: React.createElement(route.pageComponent),
  };
});
