import { ListNode } from "@/utils/LinkedListNode";

export class Queue {
  private front: ListNode | null;
  private rear: ListNode | null;
  size: number;

  constructor() {
    this.front = null;
    this.rear = null;
    this.size = 0;
  }

  enqueue(value: number): { success: boolean; message: string } {
    const newNode = new ListNode(value);

    if (this.isEmpty()) {
      this.front = this.rear = newNode;
    } else {
      this.rear!.next = newNode;
      this.rear = newNode;
    }

    this.size++;
    return { success: true, message: `Enqueued ${value} to the queue` };
  }

  dequeue(): { success: boolean; value?: number; message: string } {
    if (this.isEmpty()) {
      return { success: false, message: "Queue is empty" };
    }

    const dequeuedValue = this.front!.value;
    this.front = this.front!.next;

    if (!this.front) {
      this.rear = null;
    }

    this.size--;
    return {
      success: true,
      value: dequeuedValue,
      message: `Dequeued ${dequeuedValue} from the queue`,
    };
  }

  peek(): { success: boolean; value?: number; message: string } {
    if (this.isEmpty()) {
      return { success: false, message: "Queue is empty" };
    }

    return {
      success: true,
      value: this.front!.value,
      message: `Front element is ${this.front!.value}`,
    };
  }

  search(value: number): { found: boolean; position: number; message: string } {
    let current = this.front;
    let position = 0;

    while (current) {
      if (current.value === value) {
        return {
          found: true,
          position,
          message: `Found ${value} at position ${position} from front`,
        };
      }
      current = current.next;
      position++;
    }

    return {
      found: false,
      position: -1,
      message: `Value ${value} not found in the queue`,
    };
  }

  getLength(): number {
    return this.size;
  }

  isEmpty(): boolean {
    return this.front === null;
  }

  toArray(): ListNode[] {
    const result: ListNode[] = [];
    let current = this.front;

    while (current) {
      result.push(current);
      current = current.next;
    }

    return result;
  }

  clear(): void {
    this.front = null;
    this.rear = null;
    this.size = 0;
  }
}
