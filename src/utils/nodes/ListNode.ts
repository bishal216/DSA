export class ListNode {
  value: number;
  next: ListNode | null;
  id: string;

  constructor(value: number) {
    this.value = value;
    this.next = null;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}
