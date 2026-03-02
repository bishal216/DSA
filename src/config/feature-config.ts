// src/config/feature-config.ts
// Unified registry for ALL features — algorithms, data structures, problems.
// Used by: home page sections, search index, routes/config.tsx

import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";

// ── Shared interface ──────────────────────────────────────────────────────────

export type FeatureStatus = "active" | "beta" | "in-development";

export interface FeatureConfig {
  id: string;
  title: string;
  description: string;
  path: string; // relative — no leading slash, no /app/ prefix
  status: FeatureStatus;
  icon: LucideIcon;
  type: string; // "Algorithms" | "Data Structures" | "Problems"
  tags: string[];
  features: string[]; // bullet points shown on the card
  pageComponent?: ComponentType; // only needed when routes are derived from this config
}
