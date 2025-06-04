export class Deque {
  private deque: number[];

  constructor() {
    this.deque = [];
  }

  // Add to front
  addFront(value: number): { success: boolean; message: string } {
    this.deque.unshift(value);
    return { success: true, message: `Added ${value} to front of deque` };
  }

  // Add to rear
  addRear(value: number): { success: boolean; message: string } {
    this.deque.push(value);
    return { success: true, message: `Added ${value} to rear of deque` };
  }

  // Remove from front
  removeFront(): { success: boolean; value?: number; message: string } {
    if (this.isEmpty()) {
      return { success: false, message: "Deque is empty" };
    }

    const removedValue = this.deque.shift()!;
    return {
      success: true,
      value: removedValue,
      message: `Removed ${removedValue} from front of deque`,
    };
  }

  // Remove from rear
  removeRear(): { success: boolean; value?: number; message: string } {
    if (this.isEmpty()) {
      return { success: false, message: "Deque is empty" };
    }

    const removedValue = this.deque.pop()!;
    return {
      success: true,
      value: removedValue,
      message: `Removed ${removedValue} from rear of deque`,
    };
  }

  // Peek front
  peekFront(): { success: boolean; value?: number; message: string } {
    if (this.isEmpty()) {
      return { success: false, message: "Deque is empty" };
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
      return { success: false, message: "Deque is empty" };
    }

    const rearValue = this.deque[this.deque.length - 1];
    return {
      success: true,
      value: rearValue,
      message: `Rear element is ${rearValue}`,
    };
  }

  search(value: number): { found: boolean; position: number; message: string } {
    if (this.isEmpty()) {
      return { found: false, position: -1, message: "Deque is empty" };
    }

    const index = this.deque.indexOf(value);
    if (index !== -1) {
      return {
        found: true,
        position: index,
        message: `Found ${value} at position ${index}`,
      };
    }

    return {
      found: false,
      position: -1,
      message: `Value ${value} not found in the deque`,
    };
  }

  getSize(): number {
    return this.deque.length;
  }

  isEmpty(): boolean {
    return this.deque.length === 0;
  }

  toArray(): {
    value: number;
    index: number;
    isFront: boolean;
    isRear: boolean;
  }[] {
    return this.deque.map((value, index) => ({
      value,
      index,
      isFront: index === 0,
      isRear: index === this.deque.length - 1,
    }));
  }

  clear(): void {
    this.deque = [];
  }
}
