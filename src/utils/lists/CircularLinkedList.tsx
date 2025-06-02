import { ListNode } from "@/utils/nodes/ListNode";
import {
  OperationResult,
  ValueOperationResult,
  SearchResult,
} from "@/utils/types";

export class CircularLinkedList {
  head: ListNode | null;
  size: number;

  constructor() {
    this.head = null;
    this.size = 0;
  }

  insert(value: number, position?: number): OperationResult {
    const newNode = new ListNode(value);

    if (this.size === 0) {
      this.head = newNode;
      newNode.next = newNode; // Point to itself
      this.size++;
      return { success: true, message: `Inserted ${value} as the first node` };
    }

    if (position === undefined || position === 0) {
      const tail = this.getTail();
      newNode.next = this.head;
      tail!.next = newNode;
      this.head = newNode;
      this.size++;
      return { success: true, message: `Inserted ${value} at the beginning` };
    }

    if (position < 0 || position > this.size) {
      return { success: false, message: "Invalid position" };
    }

    if (position === this.size) {
      return this.append(value);
    }

    let current = this.head;
    for (let i = 0; i < position - 1; i++) {
      current = current!.next;
    }

    newNode.next = current!.next;
    current!.next = newNode;
    this.size++;
    return {
      success: true,
      message: `Inserted ${value} at position ${position}`,
    };
  }

  append(value: number): OperationResult {
    const newNode = new ListNode(value);

    if (!this.head) {
      this.head = newNode;
      newNode.next = newNode;
    } else {
      const tail = this.getTail();
      newNode.next = this.head;
      tail!.next = newNode;
    }

    this.size++;
    return { success: true, message: `Appended ${value} to the end` };
  }

  delete(value: number): OperationResult {
    if (!this.head) {
      return { success: false, message: "List is empty" };
    }

    if (this.size === 1 && this.head.value === value) {
      this.head = null;
      this.size--;
      return { success: true, message: `Deleted ${value} (list is now empty)` };
    }

    if (this.head.value === value) {
      const tail = this.getTail();
      tail!.next = this.head.next;
      this.head = this.head.next;
      this.size--;
      return { success: true, message: `Deleted ${value} from the beginning` };
    }

    let current = this.head;
    do {
      if (current.next!.value === value) {
        current.next = current.next!.next;
        this.size--;
        return { success: true, message: `Deleted ${value} from the list` };
      }
      current = current.next!;
    } while (current !== this.head);

    return { success: false, message: `Value ${value} not found` };
  }

  deleteAtPosition(position: number): OperationResult {
    if (position < 0 || position >= this.size) {
      return { success: false, message: "Invalid position" };
    }

    if (this.isEmpty()) {
      return { success: false, message: "List is empty" };
    }

    if (position === 0) {
      return this.deleteFirst();
    }

    let current = this.head;
    for (let i = 0; i < position - 1; i++) {
      current = current!.next;
    }

    const deletedValue = current!.next!.value;
    current!.next = current!.next!.next;
    this.size--;
    return {
      success: true,
      message: `Deleted ${deletedValue} at position ${position}`,
    };
  }

  deleteFirst(): OperationResult {
    if (this.isEmpty()) {
      return { success: false, message: "List is empty" };
    }

    const deletedValue = this.head!.value;

    if (this.size === 1) {
      this.head = null;
    } else {
      const tail = this.getTail();
      tail!.next = this.head!.next;
      this.head = this.head!.next;
    }

    this.size--;
    return {
      success: true,
      message: `Deleted first node with value ${deletedValue}`,
    };
  }

  deleteLast(): OperationResult {
    if (this.isEmpty()) {
      return { success: false, message: "List is empty" };
    }

    if (this.size === 1) {
      return this.deleteFirst();
    }

    let current = this.head;
    while (current!.next!.next !== this.head) {
      current = current!.next;
    }

    const deletedValue = current!.next!.value;
    current!.next = this.head;
    this.size--;
    return {
      success: true,
      message: `Deleted last node with value ${deletedValue}`,
    };
  }

  getTail(): ListNode | null {
    if (!this.head) return null;

    let current = this.head;
    while (current.next !== this.head) {
      current = current.next!;
    }
    return current;
  }

  getAtIndex(index: number): ValueOperationResult {
    if (index < 0 || index >= this.size) {
      return { success: false, message: "Invalid index" };
    }

    if (this.isEmpty()) {
      return { success: false, message: "List is empty" };
    }

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current!.next;
    }

    return {
      success: true,
      value: current!.value,
      message: `Value at index ${index} is ${current!.value}`,
    };
  }

  search(value: number): SearchResult {
    if (!this.head) {
      return {
        found: false,
        position: -1,
        message: `Value ${value} not found in the list`,
      };
    }

    let current = this.head;
    let position = 0;

    do {
      if (current.value === value) {
        return {
          found: true,
          position,
          message: `Found ${value} at position ${position}`,
        };
      }
      current = current.next!;
      position++;
    } while (current !== this.head);

    return {
      found: false,
      position: -1,
      message: `Value ${value} not found in the list`,
    };
  }

  getLength(): number {
    return this.size;
  }

  isEmpty(): boolean {
    return this.head === null;
  }

  toArray(): ListNode[] {
    if (!this.head) return [];

    const result: ListNode[] = [];
    let current = this.head;

    do {
      result.push(current);
      current = current.next!;
    } while (current !== this.head);

    return result;
  }

  clear(): void {
    this.head = null;
    this.size = 0;
  }
}
