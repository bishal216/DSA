import React from "react";
import type { RouteObject } from "react-router-dom";

// Pages
import Home from "@/pages/home";
import MarkdownPage from "@/pages/Markdown";
import NotFound from "@/pages/not-found";
import SearchResults from "@/pages/search-results";

// Static content
import aboutContent from "@/content/about.md?raw";
import privacyContent from "@/content/privacy.md?raw";
import tosContent from "@/content/tos.md?raw";

// Feature registries — single import point for all configs
import { algorithmConfigs } from "@/config/algorithm-config";
import { commonProblemConfigs } from "@/config/common-problem-config";
import { dataStructureConfigs } from "@/config/data-structure-config";
import type { FeatureConfig } from "@/config/feature-config";
import type { ComponentType } from "react";

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
// Dynamic route generation from feature configs
// Routes are created only for features with pageComponent
// ─────────────────────────────────────────

/**
 * Generate routes from a feature config array.
 * title is always injected; any extra props live in config.pageProps.
 */
const generateFeatureRoutes = (configs: FeatureConfig[]): RouteObject[] =>
  configs
    .filter(
      (
        c,
      ): c is FeatureConfig & {
        pageComponent: ComponentType<Record<string, unknown>>;
      } => Boolean(c.pageComponent),
    )
    .map((c) => ({
      path: c.path,
      element: React.createElement(c.pageComponent, {
        title: c.title,
        ...c.pageProps,
      }),
    }));

// ─────────────────────────────────────────
// App routes — everything inside /app/*
// ─────────────────────────────────────────
export const appRoutes: RouteObject[] = [
  ...generateFeatureRoutes(algorithmConfigs),
  ...generateFeatureRoutes(dataStructureConfigs),
  ...generateFeatureRoutes(commonProblemConfigs),
  { path: "search", element: <SearchResults /> },
  { path: "*", element: <NotFound /> },
];
