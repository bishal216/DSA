type ListType = "singly" | "doubly" | "circular";

export class ListNode<T = number> {
  value: T;
  next: ListNode<T> | null;
  prev?: ListNode<T> | null;
  id: string;
  listType?: ListType;

  constructor(value: T, listType?: ListType) {
    this.value = value;
    this.next = null;
    this.prev = null;
    this.listType = listType;
    this.id = Math.random().toString(36).substr(2, 9);
  }
}
