import type { RouteObject } from "react-router-dom";
import MarkdownPage from "@/pages/Markdown";
import Home from "@/pages/home";
import LinkedList from "@/pages/linked-list";
import NotFound from "@/pages/not-found";
import QueuePage from "@/pages/queue";
import SearchResults from "@/pages/search-results";
import Stack from "@/pages/stack";
import privacyConfig from "@/context/privacy.md?raw";
import tosConfig from "@/context/tos.md?raw";
import aboutConfig from "@/context/about.md?raw";
import { algorithmRoutes } from "@/algorithms/routes/algorithmRoutes";

const publicRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
  { path: "privacy-policy", element: <MarkdownPage markdownContent={privacyConfig} /> },
  { path: "terms-of-service", element: <MarkdownPage markdownContent={tosConfig} /> },
  { path: "about", element: <MarkdownPage markdownContent={aboutConfig} /> },
];

const dataStructureRoutes: RouteObject[] = [
  {
    path: "data-structures/singly-linked-list",
    element: <LinkedList title="Singly Linked List" listType="singly" />,
  },
  {
    path: "data-structures/doubly-linked-list",
    element: <LinkedList title="Doubly Linked List" listType="doubly" />,
  },
  {
    path: "data-structures/circular-linked-list",
    element: <LinkedList title="Circular Linked List" listType="circular" />,
  },
  {
    path: "data-structures/queue/linear",
    element: <QueuePage title="Linear Queue" queueType="linear" />,
  },
  {
    path: "data-structures/queue/deque",
    element: <QueuePage title="Deque" queueType="deque" />,
  },
  {
    path: "data-structures/queue/circular",
    element: <QueuePage title="Circular Queue" queueType="circular" />,
  },
  { path: "data-structures/stack", element: <Stack /> },
];

const appRoutes: RouteObject[] = [
  ...algorithmRoutes,
  { path: "search", element: <SearchResults /> },
  ...dataStructureRoutes,
  { path: "*", element: <NotFound /> },
];

export { publicRoutes, appRoutes };