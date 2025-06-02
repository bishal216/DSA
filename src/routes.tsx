import { createBrowserRouter } from "react-router-dom";
// Layout and Pages
import RootLayout from "./pages/Layout";
// Home, 404 and search results
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import SearchResults from "./pages/search-results";
// Linked Lists
import SinglyLinkedLisr from "./pages/singly-linked-list";
import Login from "./pages/login";
import Signup from "./pages/signup";
import PrivateRoute from "./pages/private-route";
import Dashboard from "./pages/dashboard";

const basename: string = "/DSA";
export const router = createBrowserRouter(
  [
    {
      path: "",
      element: <RootLayout />,
      children: [
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/search",
          element: <SearchResults />,
        },
        {
          path: "/data-structures/singly-linked-list",
          element: <SinglyLinkedLisr />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
        {
          path: "",
          element: <PrivateRoute />,
          children: [
            {
              path: "/dashboard",
              element: <Dashboard />,
            },
          ],
        },
      ],
    },
  ],
  {
    basename: basename,
  }
);
