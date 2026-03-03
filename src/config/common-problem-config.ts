// src/config/common-problem-config.ts
import { MoveRight } from "lucide-react";
import type { FeatureConfig } from "./feature-config";

export const commonProblemConfigs: FeatureConfig[] = [
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
    // No pageComponent — coming soon
  },
];
