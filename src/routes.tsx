import { createBrowserRouter } from "react-router-dom";
// Layout and Pages
import RootLayout from "./pages/Layout";
// Home, 404 and search results
import Home from "./pages/home";
import NotFound from "./pages/not-found";
import SearchResults from "./pages/search-results";
// Linked Lists
import LinkedList from "./pages/linked-list";
// Queues
import QueuePage from "./pages/queue";
// Stacks
import Stack from "./pages/stack";
// Sign Up
// import Signup from "./pages/signup";

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
          path: "/data-structures/queue/linear",
          element: <QueuePage title="Linear Queue" queueType="linear" />,
        },
        {
          path: "/data-structures/queue/deque",
          element: <QueuePage title="Deque" queueType="deque" />,
        },
        {
          path: "/data-structures/queue/circular",
          element: <QueuePage title="Circular Queue" queueType="circular" />,
        },
        {
          path: "/data-structures/stack",
          element: <Stack />,
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
