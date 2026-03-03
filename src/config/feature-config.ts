import type { ComponentType } from "react";

/**
 * Unified config interface for all feature types (Algorithms, Data Structures, Problems)
 * pageComponent is optional for in-development features
 */
export interface FeatureConfig {
  // ── Core identification
  id: string;
  title: string;
  description: string;
  type: "Algorithms" | "Data Structures" | "Problems";

  // ── Routing & display
  path: string;
  icon: ComponentType<Record<string, unknown>>;

  // ── Feature metadata
  status: "active" | "beta" | "in-development";
  tags: string[];
  features: string[];

  // ── Page component (optional for in-development features)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageComponent?: ComponentType<any>;

  // ── Props passed to pageComponent at route creation time.
  // title is always injected automatically from the config.
  pageProps?: Record<string, unknown>;
}
