// src/routes/index.tsx
import { HomeLayout, RootLayout } from "@/pages/Layout";
import RouterError from "@/pages/router-error";
import { createHashRouter } from "react-router-dom";
import { appRoutes, publicRoutes } from "./config";

export const router = createHashRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <RouterError />,
    children: publicRoutes,
  },
  {
    path: "/app/*",
    element: <RootLayout />,
    errorElement: <RouterError />,
    children: appRoutes,
  },
]);
