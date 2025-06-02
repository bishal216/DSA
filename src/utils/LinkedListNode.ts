// Re-export all node classes
export { ListNode } from "@/utils/nodes/ListNode";
export { DoublyListNode } from "@/utils/nodes/DoublyListNode";

// Re-export all list classes
export { SinglyLinkedList } from "@/utils/lists/SinglyLinkedList";
export { DoublyLinkedList } from "@/utils/lists/DoublyLinkedList";
export { CircularLinkedList } from "@/utils/lists/CircularLinkedList";

// Re-export types
export type {
  ListType,
  OperationResult,
  ValueOperationResult,
  SearchResult,
} from "@/utils/types";

// Import the classes for union types
import { SinglyLinkedList } from "@/utils/lists/SinglyLinkedList";
import { DoublyLinkedList } from "@/utils/lists/DoublyLinkedList";
import { CircularLinkedList } from "@/utils/lists/CircularLinkedList";
import { ListNode } from "@/utils/nodes/ListNode";
import { DoublyListNode } from "@/utils/nodes/DoublyListNode";

// Union types for compatibility
export type AnyLinkedList =
  | SinglyLinkedList
  | DoublyLinkedList
  | CircularLinkedList;
export type AnyListNode = ListNode | DoublyListNode;
