import { createBrowserRouter } from "react-router-dom";
// Layout and Pages
import RootLayout from "./pages/Layout";
// Home, 404 and search results
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import SearchResults from "./pages/search-results";
// Linked Lists
import LinkedList from "./pages/linked-list";
import Signup from "./pages/signup";

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
          element: <LinkedList title="Singly Linked List" listType="singly" />,
        },
        {
          path: "/data-structures/doubly-linked-list",
          element: <LinkedList title="Doubly Linked List" listType="doubly" />,
        },
        {
          path: "/data-structures/circular-linked-list",
          element: (
            <LinkedList title="Circular Linked List" listType="circular" />
          ),
        },
        {
          path: "/signup",
          element: <Signup />,
        },
        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ],
  {
    basename: basename,
  }
);
