export type StepType =
  | "comparison"
  | "swapping"
  | "informSorted"
  | "informCompleted"
  | "gapInfo" // For algorithms like Shell Sort that use gaps
  | "flip" // For algorithms like Pancake Sort that involve flipping elements;
  | "bucketAssign" // For algorithms like Bucket Sort that assign elements to buckets
  | "reconstruct" // For algorithms like Bucket Sort that reconstruct the array from buckets
  | "partition" // For algorithms like Quick Sort that partition the array
  | "pivot" // For algorithms like Quick Sort that identify a pivot element
  | "merge" // For algorithms like Merge Sort that merge subarrays
  | "divide"; // For algorithms like Merge Sort that divide the array into subarrays

export interface ArrayElement {
  value: number; // The value of the element
  id: number; // Unique identifier for the element
  isSorted?: boolean; // Indicates if the element is in its final sorted position
  isPivot?: boolean; // Indicates if the element is a pivot in partitioning algorithms
  depth?: number; // Depth of recursion or iteration in the algorithm
}

export interface SortingStep {
  array: ArrayElement[]; // The current state of the array
  comparing?: number[]; // Indices of elements being compared
  swapping?: number[]; // Indices of elements being swapped
  merging?: number[]; // Indices of elements being merged (for merge sort)
  sorted?: number[]; // Indices of elements in their final sorted position
  message?: string; // Optional message for the step, e.g., "Swapping 3 and 5"
  isMajorStep?: boolean; // Indicates if this is a major step in the algorithm
  stepType?: StepType; // Type of step: "comparison" or "swapping"
  activeSublistLeft?: number[]; // For divide steps in merge sort, indices of the left sublist
  activeSublistRight?: number[]; // For divide steps in merge sort, indices of the right sublist
  depth?: number; // Depth of recursion in the algorithm
  pivot?: number; // Index of the pivot element in partitioning algorithms
  bucketIndex?: number; // Index of the active bucket in bucket sort
}
