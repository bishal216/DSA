export type StepType =
  | "comparison"
  | "swap"
  | "count"
  | "merge"
  | "divide"
  | "partition"
  | "pivot"
  | "flip"
  | "gap"
  | "bucket-assign"
  | "bucket-reconstruct"
  | "sorted"
  | "insert"
  | "complete";

export interface ArrayElement {
  value: number;
  id: number;
  // Remove isSorted, isPivot, depth — tracked on the step instead
}

export interface SortingStep {
  array: ArrayElement[];
  stepType?: StepType;
  message?: string;
  isMajorStep?: boolean;

  // Index arrays — which elements are involved in this step
  comparing?: number[];
  swapping?: number[];
  merging?: number[];
  sorted?: number[];
  pivot?: number;
  activeSublistLeft?: number[];
  activeSublistRight?: number[];

  // Algorithm-specific metadata
  gap?: number; // Shell sort
  depth?: number; // Merge/Quick sort recursion depth and for stooge sort
  bucketIndex?: number; // Bucket sort active bucket
  buckets?: number[][]; // Bucket sort bucket contents
  radixDigit?: number; // Radix sort current digit place
}
