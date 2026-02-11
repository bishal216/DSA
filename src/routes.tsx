import { createBrowserRouter } from "react-router-dom";
import { HomeLayout, RootLayout } from "./pages/Layout";
import { appRoutes, publicRoutes } from "./routes/routeConfig";

const basename: string = "/";
export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: publicRoutes,
  },
  {
    path: "/app/*",
    element: <RootLayout />,
    children: appRoutes,
  },
]);


