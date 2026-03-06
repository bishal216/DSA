import { Binary, GitBranch, Layers, Network } from "lucide-react";
import type { FeatureConfig } from "./feature-config";

import ActivitySelectionPage from "@/pages/problems/activity-selection-page";
import ClosestPairPage from "@/pages/problems/closest-pair-page";
import CoinChangePage from "@/pages/problems/coin-change-page";
import CRTPage from "@/pages/problems/crt-page";
import EggDropPage from "@/pages/problems/egg-drop-page";
import FibonacciPage from "@/pages/problems/fibonacci-page";
import HuffmanPage from "@/pages/problems/huffman-page";
import KaratsubaPage from "@/pages/problems/karatsuba-page";
import KnapsackPage from "@/pages/problems/knapsack-page";
import LCSPage from "@/pages/problems/lcs-page";
import MazePage from "@/pages/problems/maze-page";
import NQueensPage from "@/pages/problems/n-queens-page";

export const commonProblemConfigs: FeatureConfig[] = [
  // ── Dynamic Programming ──────────────────────────────────────────────────
  {
    id: "fibonacci",
    title: "Fibonacci Sequence",
    description:
      "Naive recursion vs memoization vs bottom-up DP. Visualizes the recursion tree and 1D DP table.",
    path: "problems/fibonacci",
    status: "in-development",
    icon: Binary,
    type: "Problems",
    tags: [
      "fibonacci",
      "dp",
      "dynamic programming",
      "memoization",
      "recursion",
      "bottom-up",
    ],
    features: [
      "Naive Recursion",
      "Memoization",
      "Bottom-Up DP",
      "Recursion Tree",
    ],
    pageComponent: FibonacciPage,
  },
  {
    id: "coin-change",
    title: "Coin Change",
    description:
      "Find the minimum number of coins to make a target amount. Visualizes 1D DP table filling with traceback.",
    path: "problems/coin-change",
    status: "in-development",
    icon: Binary,
    type: "Problems",
    tags: [
      "coin change",
      "dp",
      "dynamic programming",
      "minimum coins",
      "unbounded knapsack",
    ],
    features: ["DP Table", "Optimal Coins Traceback"],
    pageComponent: CoinChangePage,
  },
  {
    id: "knapsack",
    title: "0/1 Knapsack",
    description:
      "Maximize value within a weight capacity. Visualizes the 2D DP table filled item by item.",
    path: "problems/knapsack",
    status: "in-development",
    icon: Binary,
    type: "Problems",
    tags: [
      "knapsack",
      "0/1 knapsack",
      "dp",
      "dynamic programming",
      "optimization",
    ],
    features: ["2D DP Table", "Item Traceback", "Weight/Value Input"],
    pageComponent: KnapsackPage,
  },
  {
    id: "lcs",
    title: "Longest Common Subsequence",
    description:
      "Find the longest subsequence common to two strings. Visualizes the 2D DP table and traceback path.",
    path: "problems/lcs",
    status: "in-development",
    icon: Binary,
    type: "Problems",
    tags: [
      "lcs",
      "longest common subsequence",
      "dp",
      "dynamic programming",
      "string",
      "diff",
    ],
    features: ["2D DP Table", "Traceback", "String Input"],
    pageComponent: LCSPage,
  },
  {
    id: "egg-drop",
    title: "Egg Drop Problem",
    description:
      "Find the minimum trials to determine the critical floor given n eggs and k floors.",
    path: "problems/egg-drop",
    status: "in-development",
    icon: Binary,
    type: "Problems",
    tags: [
      "egg drop",
      "dp",
      "dynamic programming",
      "binary search",
      "decision",
      "minimax",
    ],
    features: ["2D DP Table", "Optimal Strategy", "Decision Tree"],
    pageComponent: EggDropPage,
  },

  // ── Backtracking ─────────────────────────────────────────────────────────
  {
    id: "n-queens",
    title: "N-Queens",
    description:
      "Place N queens on an N×N board so none attack each other. Watch backtracking explore and prune.",
    path: "problems/n-queens",
    status: "in-development",
    icon: GitBranch,
    type: "Problems",
    tags: [
      "n-queens",
      "backtracking",
      "constraint satisfaction",
      "chess",
      "recursion",
    ],
    features: [
      "Grid Visualization",
      "Backtracking Steps",
      "Attack Highlighting",
    ],
    pageComponent: NQueensPage,
  },
  {
    id: "maze",
    title: "Maze Solver",
    description:
      "Find a path from start to end through a maze using backtracking. Visualizes exploration and dead-ends.",
    path: "problems/maze",
    status: "in-development",
    icon: GitBranch,
    type: "Problems",
    tags: ["maze", "backtracking", "path finding", "recursion", "grid"],
    features: ["Grid Editor", "Path Visualization", "Backtracking Steps"],
    pageComponent: MazePage,
  },

  // ── Greedy ────────────────────────────────────────────────────────────────
  {
    id: "activity-selection",
    title: "Activity Selection",
    description:
      "Select the maximum number of non-overlapping activities. Classic greedy by earliest finish time.",
    path: "problems/activity-selection",
    status: "in-development",
    icon: Layers,
    type: "Problems",
    tags: [
      "activity selection",
      "greedy",
      "interval scheduling",
      "optimization",
    ],
    features: ["Timeline Visualization", "Greedy Selection Steps"],
    pageComponent: ActivitySelectionPage,
  },
  {
    id: "huffman",
    title: "Huffman Encoding",
    description:
      "Build an optimal prefix-free code tree using a greedy priority queue. Visualizes tree construction and codes.",
    path: "problems/huffman",
    status: "in-development",
    icon: Layers,
    type: "Problems",
    tags: [
      "huffman",
      "huffman encoding",
      "greedy",
      "compression",
      "prefix code",
      "priority queue",
    ],
    features: ["Tree Construction", "Priority Queue Steps", "Code Table"],
    pageComponent: HuffmanPage,
  },

  // ── Divide & Conquer ──────────────────────────────────────────────────────
  {
    id: "karatsuba",
    title: "Karatsuba Multiplication",
    description:
      "Multiply large integers in O(n^1.585) by splitting into three recursive half-size multiplications.",
    path: "problems/karatsuba",
    status: "in-development",
    icon: Network,
    type: "Problems",
    tags: [
      "karatsuba",
      "multiplication",
      "divide and conquer",
      "fast multiplication",
      "big integer",
    ],
    features: [
      "Recursion Tree",
      "Split Visualization",
      "Step-by-step Multiplication",
    ],
    pageComponent: KaratsubaPage,
  },
  {
    id: "closest-pair",
    title: "Closest Pair of Points",
    description:
      "Find the closest pair among N points in O(n log n) using divide & conquer with a strip merge step.",
    path: "problems/closest-pair",
    status: "in-development",
    icon: Network,
    type: "Problems",
    tags: [
      "closest pair",
      "divide and conquer",
      "geometry",
      "computational geometry",
      "points",
    ],
    features: ["Point Canvas", "Divide Steps", "Strip Merge Visualization"],
    pageComponent: ClosestPairPage,
  },
  {
    id: "crt",
    title: "Chinese Remainder Theorem",
    description:
      "Solve simultaneous congruences step by step using Garner's algorithm and modular arithmetic.",
    path: "problems/crt",
    status: "in-development",
    icon: Network,
    type: "Problems",
    tags: [
      "chinese remainder theorem",
      "crt",
      "number theory",
      "modular arithmetic",
      "divide and conquer",
    ],
    features: [
      "Congruence Input",
      "Step-by-step Solution",
      "Modular Arithmetic",
    ],
    pageComponent: CRTPage,
  },
];
