export type StepType =
  | "comparison"
  | "swapping"
  | "informSorted"
  | "informCompleted"
  | "gapInfo" // For algorithms like Shell Sort that use gaps
  | "flip"; // For algorithms like Pancake Sort that involve flipping elements;

export interface ArrayElement {
  value: number; // The value of the element
  id: number; // Unique identifier for the element
  isSorted?: boolean; // Indicates if the element is in its final sorted position
  isPivot?: boolean; // Indicates if the element is a pivot in partitioning algorithms
}

export interface SortingStep {
  array: ArrayElement[]; // The current state of the array
  comparing?: number[]; // Indices of elements being compared
  swapping?: number[]; // Indices of elements being swapped
  sorted?: number[]; // Indices of elements in their final sorted position
  message?: string; // Optional message for the step, e.g., "Swapping 3 and 5"
  isMajorStep?: boolean; // Indicates if this is a major step in the algorithm
  stepType?: StepType; // Type of step: "comparison" or "swapping"
}

export type ComparisonSortingAlgorithm =
  | "bubble"
  | "selection"
  | "insertion"
  | "oddEven"
  | "cocktail"
  | "gnome"
  | "comb"
  | "shell"
  | "stooge"
  | "pancake";
