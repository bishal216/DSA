import { ListNode } from "@/lib/node";

export class DoublyLinkedList<T = number> {
  head: ListNode<T> | null = null;
  tail: ListNode<T> | null = null;

  insert(value: T): void {
    const newNode = new ListNode(value);
    if (!this.head) {
      this.head = this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      if (this.tail) this.tail.next = newNode;
      this.tail = newNode;
    }
  }

  toArray(): T[] {
    const result: T[] = [];
    let current = this.head;
    while (current) {
      result.push(current.value);
      current = current.next;
    }
    return result;
  }
}
