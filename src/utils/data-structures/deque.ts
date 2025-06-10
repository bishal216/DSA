import { ListNode } from "@/utils/LinkedListNode";

// Deque implementation, acts as a double-ended queue as well as single-ended queue, circular queue
export class Deque {
  private deque: number[];

  constructor() {
    this.deque = [];
  }

  // Three main methods: Add, Remove, Peek
  // Available from both front and rear

  // Add to front
  addFront(value: number): { success: boolean; message: string } {
    this.deque.unshift(value);
    return { success: true, message: `Added ${value} to front of Queue` };
  }

  // Add to rear
  addRear(value: number): { success: boolean; message: string } {
    this.deque.push(value);
    return { success: true, message: `Added ${value} to rear of Queue` };
  }

  // Remove from front
  removeFront(): { success: boolean; value?: number; message: string } {
    if (this.isEmpty()) {
      return { success: false, message: "Queue is empty" };
    }

    const removedValue = this.deque.shift()!;
    return {
      success: true,
      value: removedValue,
      message: `Removed ${removedValue} from front of Queue`,
    };
  }

  // Remove from rear
  removeRear(): { success: boolean; value?: number; message: string } {
    if (this.isEmpty()) {
      return { success: false, message: "Queue is empty" };
    }

    const removedValue = this.deque.pop()!;
    return {
      success: true,
      value: removedValue,
      message: `Removed ${removedValue} from rear of Queue`,
    };
  }

  // Peek front
  peekFront(): { success: boolean; value?: number; message: string } {
    if (this.isEmpty()) {
      return { success: false, message: "Queue is empty" };
    }

    return {
      success: true,
      value: this.deque[0],
      message: `Front element is ${this.deque[0]}`,
    };
  }

  // Peek rear
  peekRear(): { success: boolean; value?: number; message: string } {
    if (this.isEmpty()) {
      return { success: false, message: "Queue is empty" };
    }

    const rearValue = this.deque[this.deque.length - 1];
    return {
      success: true,
      value: rearValue,
      message: `Rear element is ${rearValue}`,
    };
  }

  // Additional methods for deque operations
  getSize(): number {
    return this.deque.length;
  }

  isEmpty(): boolean {
    return this.deque.length === 0;
  }

  // ---------------- Utility methods ----------------
  toArray(): ListNode[] {
    return this.deque.map((value, index) => ({
      value,
      index,
      isFront: index === 0,
      isRear: index === this.deque.length - 1,
      next: null, // Add this property
      id: `${index}`, // Add this property
    }));
  }

  clear(): void {
    this.deque = [];
  }
}
