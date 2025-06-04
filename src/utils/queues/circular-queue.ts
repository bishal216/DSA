export class CircularQueue {
  private queue: (number | undefined)[];
  private front: number;
  private rear: number;
  private capacity: number;
  private count: number;

  constructor(capacity: number = 8) {
    this.capacity = capacity;
    this.queue = new Array(capacity);
    this.front = 0;
    this.rear = -1;
    this.count = 0;
  }

  enqueue(value: number): { success: boolean; message: string } {
    if (this.isFull()) {
      return { success: false, message: "Queue is full" };
    }

    this.rear = (this.rear + 1) % this.capacity;
    this.queue[this.rear] = value;
    this.count++;

    return {
      success: true,
      message: `Enqueued ${value} to the circular queue`,
    };
  }

  dequeue(): { success: boolean; value?: number; message: string } {
    if (this.isEmpty()) {
      return { success: false, message: "Queue is empty" };
    }

    const dequeuedValue = this.queue[this.front];
    this.queue[this.front] = undefined;
    this.front = (this.front + 1) % this.capacity;
    this.count--;

    return {
      success: true,
      value: dequeuedValue ?? undefined,
      message: `Dequeued ${dequeuedValue ?? "undefined"} from the circular queue`,
    };
  }

  peek(): { success: boolean; value?: number; message: string } {
    if (this.isEmpty()) {
      return { success: false, message: "Queue is empty" };
    }

    return {
      success: true,
      value: this.queue[this.front],
      message: `Front element is ${this.queue[this.front]}`,
    };
  }

  search(value: number): { found: boolean; position: number; message: string } {
    if (this.isEmpty()) {
      return { found: false, position: -1, message: "Queue is empty" };
    }

    for (let i = 0; i < this.count; i++) {
      const index = (this.front + i) % this.capacity;
      if (this.queue[index] === value) {
        return {
          found: true,
          position: i,
          message: `Found ${value} at position ${i} from front`,
        };
      }
    }

    return {
      found: false,
      position: -1,
      message: `Value ${value} not found in the circular queue`,
    };
  }

  getLength(): number {
    return this.count;
  }

  isEmpty(): boolean {
    return this.count === 0;
  }

  isFull(): boolean {
    return this.count === this.capacity;
  }

  getCapacity(): number {
    return this.capacity;
  }

  toArray(): {
    value: number | undefined;
    index: number;
    isActive: boolean;
    isFront: boolean;
    isRear: boolean;
  }[] {
    const result = [];

    for (let i = 0; i < this.capacity; i++) {
      const isActive = this.count > 0 && this.isIndexActive(i);
      const isFront = i === this.front && !this.isEmpty();
      const isRear = i === this.rear && !this.isEmpty();

      result.push({
        value: this.queue[i],
        index: i,
        isActive,
        isFront,
        isRear,
      });
    }

    return result;
  }

  private isIndexActive(index: number): boolean {
    if (this.isEmpty()) return false;

    if (this.front <= this.rear) {
      return index >= this.front && index <= this.rear;
    } else {
      return index >= this.front || index <= this.rear;
    }
  }

  clear(): void {
    this.queue = new Array(this.capacity);
    this.front = 0;
    this.rear = -1;
    this.count = 0;
  }

  resize(newCapacity: number): { success: boolean; message: string } {
    if (newCapacity < this.count) {
      return {
        success: false,
        message: "New capacity is smaller than current queue size",
      };
    }

    const oldQueue = this.toArray()
      .filter((item) => item.isActive)
      .map((item) => item.value!);

    this.capacity = newCapacity;
    this.queue = new Array(newCapacity);
    this.front = 0;
    this.rear = -1;
    this.count = 0;

    oldQueue.forEach((value) => this.enqueue(value));

    return {
      success: true,
      message: `Resized queue to capacity ${newCapacity}`,
    };
  }
}
