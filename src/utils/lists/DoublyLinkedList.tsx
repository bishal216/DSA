import { DoublyListNode } from "@/utils/nodes/DoublyListNode";
import {
  OperationResult,
  ValueOperationResult,
  SearchResult,
} from "@/utils/types";

export class DoublyLinkedList {
  head: DoublyListNode | null;
  tail: DoublyListNode | null;
  size: number;

  constructor() {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }

  insert(value: number, position?: number): OperationResult {
    const newNode = new DoublyListNode(value);

    if (position === undefined || position === 0) {
      if (!this.head) {
        this.head = this.tail = newNode;
      } else {
        newNode.next = this.head;
        this.head.prev = newNode;
        this.head = newNode;
      }
      this.size++;
      return { success: true, message: `Inserted ${value} at the beginning` };
    }

    if (position < 0 || position > this.size) {
      return { success: false, message: "Invalid position" };
    }

    if (position === this.size) {
      return this.append(value);
    }

    let current: DoublyListNode | null = this.head;
    for (let i = 0; i < position; i++) {
      current = current!.next;
    }

    newNode.next = current;
    newNode.prev = current!.prev;
    current!.prev!.next = newNode;
    current!.prev = newNode;
    this.size++;
    return {
      success: true,
      message: `Inserted ${value} at position ${position}`,
    };
  }

  append(value: number): OperationResult {
    const newNode = new DoublyListNode(value);

    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail!.next = newNode;
      this.tail = newNode;
    }

    this.size++;
    return { success: true, message: `Appended ${value} to the end` };
  }

  delete(value: number): OperationResult {
    if (!this.head) {
      return { success: false, message: "List is empty" };
    }

    let current = this.head;

    while (current) {
      if (current.value === value) {
        // Re-link previous node
        if (current.prev) {
          current.prev.next = current.next;
        } else {
          this.head = current.next;
        }

        // Re-link next node
        if (current.next) {
          current.next.prev = current.prev;
        } else {
          this.tail = current.prev;
        }

        this.size--;
        return { success: true, message: `Deleted ${value} from the list` };
      }
      if (current.next) {
        current = current.next;
      } else {
        break;
      }
    }

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

    if (position === this.size - 1) {
      return this.deleteLast();
    }

    let current = this.head;
    for (let i = 0; i < position; i++) {
      current = current!.next;
    }

    const deletedValue = current!.value;
    current!.prev!.next = current!.next;
    current!.next!.prev = current!.prev;
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
      this.head = this.tail = null;
    } else {
      this.head = this.head!.next;
      this.head!.prev = null;
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

    const deletedValue = this.tail!.value;

    if (this.size === 1) {
      this.head = this.tail = null;
    } else {
      this.tail = this.tail!.prev;
      this.tail!.next = null;
    }

    this.size--;
    return {
      success: true,
      message: `Deleted last node with value ${deletedValue}`,
    };
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
    let current = this.head;
    let position = 0;

    while (current) {
      if (current.value === value) {
        return {
          found: true,
          position,
          message: `Found ${value} at position ${position}`,
        };
      }
      current = current.next;
      position++;
    }

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

  toArray(): DoublyListNode[] {
    const result: DoublyListNode[] = [];
    let current = this.head;

    while (current) {
      result.push(current);
      current = current.next;
    }

    return result;
  }

  clear(): void {
    this.head = null;
    this.tail = null;
    this.size = 0;
  }
}
