import { createBrowserRouter } from "react-router-dom";
// Layout and Pages
import RootLayout from "./pages/Layout";
// Home, 404 and search results
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import SearchResults from "./pages/search-results";
// Linked Lists
import SinglyLinkedLisr from "./pages/singly-linked-list";
import DoublyLinkedList from "./pages/doubly-linked-list";
import CircularLinkedList from "./pages/circular-linked-list";
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
          element: <SinglyLinkedLisr />,
        },
        {
          path: "/data-structures/doubly-linked-list",
          element: <DoublyLinkedList />,
        },
        {
          path: "/data-structures/circular-linked-list",
          element: <CircularLinkedList />,
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
