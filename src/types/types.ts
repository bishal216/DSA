export type ListType = "singly" | "doubly" | "circular";

export type QueueType = "linear" | "deque" | "circular";

export interface OperationResult {
  success: boolean;
  message: string;
}

export interface ValueOperationResult extends OperationResult {
  value?: number;
}

export interface SearchResult {
  found: boolean;
  position: number;
  message: string;
}

export interface ArrayElement {
  value: number;
  id: number;
  isComparing?: boolean;
  isSwapping?: boolean;
  isSorted?: boolean;
  isPivot?: boolean;
}

export interface SortingStep {
  array: ArrayElement[];
  comparing?: number[];
  swapping?: number[];
  pivot?: number;
  sorted?: number[];
  message?: string;
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
