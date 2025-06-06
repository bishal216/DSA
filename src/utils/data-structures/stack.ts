import { ListNode } from "@/utils/data-structures/LinkedListNode";

export class Stack {
  private top: ListNode | null;
  size: number;

  constructor() {
    this.top = null;
    this.size = 0;
  }
  // Three main methods: push, pop, peek
  push(value: number): { success: boolean; message: string } {
    const newNode = new ListNode(value);
    newNode.next = this.top;
    this.top = newNode;
    this.size++;
    return { success: true, message: `Pushed ${value} onto the stack` };
  }

  pop(): { success: boolean; value?: number; message: string } {
    if (this.isEmpty()) {
      return { success: false, message: "Stack is empty" };
    }

    const poppedValue = this.top!.value;
    this.top = this.top!.next;
    this.size--;
    return {
      success: true,
      value: poppedValue,
      message: `Popped ${poppedValue} from the stack`,
    };
  }

  peek(): { success: boolean; value?: number; message: string } {
    if (this.isEmpty()) {
      return { success: false, message: "Stack is empty" };
    }

    return {
      success: true,
      value: this.top!.value,
      message: `Top element is ${this.top!.value}`,
    };
  }
  // Additional methods for stack operations
  getLength(): number {
    return this.size;
  }

  isEmpty(): boolean {
    return this.top === null;
  }

  // ---------------- Utility methods ----------------
  // Convert stack to an array of ListNode objects
  toArray(): ListNode[] {
    const result: ListNode[] = [];
    let current = this.top;

    while (current) {
      result.push(current);
      current = current.next;
    }

    return result;
  }
  // Convert stack to an array of values
  clear(): void {
    this.top = null;
    this.size = 0;
  }
}
