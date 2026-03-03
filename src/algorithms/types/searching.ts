// src/algorithms/types/searching.ts

export type SearchStepType =
  | "comparison" // element is being compared against target
  | "visited" // element was checked and skipped
  | "eliminated" // binary search — half discarded
  | "found" // target located
  | "not-found" // search exhausted without result
  | "complete"; // final state

export interface SearchStep {
  // The array is fixed — indices are what change per step
  stepType: SearchStepType;
  message?: string;
  isMajorStep?: boolean;

  // Which index is currently being examined
  currentIndex: number;

  // Accumulating history
  visitedIndices: number[];
  eliminatedIndices: number[]; // binary search only

  // Result
  foundIndex: number; // -1 if not found yet

  // Binary search window
  low?: number;
  high?: number;
  mid?: number;
}
