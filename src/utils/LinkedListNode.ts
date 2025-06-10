// Re-export all node classes
export { ListNode } from "@/utils/data-structures/list-node";
export { DoublyListNode } from "@/utils/data-structures/doubly-list-node";

// Re-export all list classes
export { SinglyLinkedList } from "@/utils/data-structures/singly-linked-list";
export { DoublyLinkedList } from "@/utils/data-structures/doubly-linked-list";
export { CircularLinkedList } from "@/utils/data-structures/circular-linked-list";

// Re-export types
export type {
  ListType,
  QueueType,
  OperationResult,
  ValueOperationResult,
  SearchResult,
} from "@/types/types";

// Import the classes for union types
import { SinglyLinkedList } from "@/utils/data-structures/singly-linked-list";
import { DoublyLinkedList } from "@/utils/data-structures/doubly-linked-list";
import { CircularLinkedList } from "@/utils/data-structures/circular-linked-list";
import { ListNode } from "@/utils/data-structures/list-node";
import { DoublyListNode } from "@/utils/data-structures/doubly-list-node";

// Union types for compatibility
export type AnyLinkedList =
  | SinglyLinkedList
  | DoublyLinkedList
  | CircularLinkedList;

export type AnyListNode = ListNode | DoublyListNode;
