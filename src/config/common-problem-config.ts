// src/config/data.ts
// Data structures and common problems — same FeatureConfig shape as algorithms.
// Paths are relative (no /app/ prefix) — routes/config.tsx and search add the prefix.

import { MoveRight } from "lucide-react";
import type { FeatureConfig } from "./feature-config";

export const commonProblems: FeatureConfig[] = [
  {
    id: "two-pointer",
    title: "Two Pointer",
    description:
      "Solve array and string problems efficiently using two indices.",
    path: "problems/two-pointer",
    status: "in-development",
    icon: MoveRight,
    type: "Problems",
    tags: ["two pointer", "sliding window", "algorithm", "problem solving"],
    features: ["Pair Sum", "Remove Duplicates", "Palindrome Check"],
  },
];
