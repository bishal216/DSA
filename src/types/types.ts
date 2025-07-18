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
