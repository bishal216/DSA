import { SectionItem } from "../types/interfaces";
import {
  ArrowRightFromLine,
  ArrowLeftRight,
  RotateCw,
  Square,
  GitBranch,
  ArrowRightLeft,
  RefreshCw,
  MoveRight,
} from "lucide-react";
export const dataStructures: SectionItem[] = [
  {
    type: "Linked List",
    title: "Singly Linked List",
    icon: ArrowRightFromLine,
    path: "/data-structures/singly-linked-list",
    tags: ["linked list", "singly linked list", "data structure", "sll"],
  },
  {
    type: "Linked List",
    title: "Doubly Linked List",
    icon: ArrowLeftRight,
    path: "/data-structures/doubly-linked-list",
    tags: ["linked list", "doubly linked list", "data structure", "dll"],
  },
  {
    type: "Linked List",
    title: "Circular Linked List",
    icon: RotateCw,
    path: "/data-structures/circular-linked-list",
    tags: ["linked list", "circular linked list", "data structure", "cll"],
  },
  {
    type: "Stack",
    title: "Stack (LIFO)",
    icon: Square,
    path: "/data-structures/stack",
    tags: ["stack", "data structure", "lifo", "last in first out"],
  },
  {
    type: "Queue",
    title: "Queue",
    icon: GitBranch,
    path: "/data-structures/queue/linear",
    tags: ["queue", "data structure", "fifo", "first in first out"],
  },
  {
    type: "Queue",
    title: "Circular Queue",
    icon: RefreshCw,
    path: "/data-structures/queue/circular",
    tags: ["circular queue", "data structure", "circular fifo"],
  },
  {
    type: "Queue",
    title: "Deque",
    icon: ArrowRightLeft,
    path: "/data-structures/queue/deque",
    tags: ["deque", "double-ended queue", "data structure"],
  },
  // ... other DS
];

export const commonProblems: SectionItem[] = [
  {
    type: "Common Problems",
    title: "Two Pointer",
    icon: MoveRight,
    path: "/problems/two-pointer",
    tags: ["two pointer", "sliding window", "algorithm", "problem solving"],
  },
  // ... other problems
];
