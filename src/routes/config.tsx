// src/routes/config.tsx
// All RouteObject arrays. Only imported by routes/index.tsx.

import React from "react";
import type { RouteObject } from "react-router-dom";

// Pages
import Home from "@/pages/home";
import LinkedList from "@/pages/linked-list";
import MarkdownPage from "@/pages/Markdown";
import NotFound from "@/pages/not-found";
import QueuePage from "@/pages/queue";
import SearchResults from "@/pages/search-results";
import Stack from "@/pages/stack";

// Static content
import aboutContent from "@/content/about.md?raw";
import privacyContent from "@/content/privacy.md?raw";
import tosContent from "@/content/tos.md?raw";

// Feature registry — single import, derives all algorithm routes
import { ALGORITHM_CONFIG } from "@/config/algorithm-config";

// ─────────────────────────────────────────
// Public routes — rendered inside HomeLayout
// ─────────────────────────────────────────
export const publicRoutes: RouteObject[] = [
  { index: true, element: <Home /> },
  { path: "about", element: <MarkdownPage markdownContent={aboutContent} /> },
  {
    path: "privacy-policy",
    element: <MarkdownPage markdownContent={privacyContent} />,
  },
  {
    path: "terms-of-service",
    element: <MarkdownPage markdownContent={tosContent} />,
  },
];

// ─────────────────────────────────────────
// Algorithm routes — derived from the registry
// Adding a new algorithm = add one entry to ALGORITHM_CONFIG
// ─────────────────────────────────────────
const algorithmRoutes: RouteObject[] = ALGORITHM_CONFIG.map((a) => ({
  path: a.path,
  element: React.createElement(a.pageComponent),
}));

// ─────────────────────────────────────────
// Data structure routes
// ─────────────────────────────────────────
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

// ─────────────────────────────────────────
// App routes — everything inside /app/*
// ─────────────────────────────────────────
export const appRoutes: RouteObject[] = [
  ...algorithmRoutes,
  ...dataStructureRoutes,
  { path: "search", element: <SearchResults /> },
  { path: "*", element: <NotFound /> },
];
