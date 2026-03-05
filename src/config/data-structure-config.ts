import LinkedList from "@/pages/data-structures/linked-list-page";
import QueuePage from "@/pages/data-structures/queue-page";
import Stack from "@/pages/data-structures/stack-page";
import { GitBranch, Link, Square } from "lucide-react";
import type { FeatureConfig } from "./feature-config";

export const dataStructureConfigs: FeatureConfig[] = [
  {
    id: "linked-list",
    title: "Linked List",
    description:
      "Linear node-based structure. Includes singly, doubly, and circular variants.",
    path: "data-structures/linked-list",
    status: "active",
    icon: Link,
    type: "Data Structures",
    tags: [
      "linked list",
      "singly linked list",
      "doubly linked list",
      "circular linked list",
      "data structure",
      "sll",
      "dll",
      "cll",
    ],
    features: ["Insert", "Delete", "Search", "Traverse", "Doubly", "Circular"],
    pageComponent: LinkedList,
  },
  {
    id: "stack",
    title: "Stack",
    description:
      "Last-in, first-out structure. Used in undo, parsing, and DFS.",
    path: "data-structures/stack",
    status: "active",
    icon: Square,
    type: "Data Structures",
    tags: ["stack", "data structure", "lifo", "last in first out"],
    features: ["Push", "Pop", "Peek"],
    pageComponent: Stack,
  },
  {
    id: "queue",
    title: "Queue",
    description:
      "First-in, first-out structure. Includes linear, circular, and double-ended variants.",
    path: "data-structures/queue",
    status: "active",
    icon: GitBranch,
    type: "Data Structures",
    tags: [
      "queue",
      "deque",
      "circular queue",
      "data structure",
      "fifo",
      "first in first out",
      "double-ended queue",
    ],
    features: ["Enqueue", "Dequeue", "Peek", "Circular", "Deque"],
    pageComponent: QueuePage,
  },
];
