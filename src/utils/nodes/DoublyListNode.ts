export class DoublyListNode {
  value: number;
  next: DoublyListNode | null;
  prev: DoublyListNode | null;
  id: string;

  constructor(value: number) {
    this.value = value;
    this.next = null;
    this.prev = null;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}
