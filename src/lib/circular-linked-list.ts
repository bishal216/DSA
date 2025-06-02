import { ListNode } from "@/lib/node";

export class CircularLinkedList<T = number> {
  head: ListNode<T> | null = null;

  insert(value: T): void {
    const newNode = new ListNode(value);
    if (!this.head) {
      this.head = newNode;
      newNode.next = this.head;
    } else {
      let current = this.head;
      while (current.next !== this.head && current.next !== null) {
        current = current.next;
      }
      current.next = newNode;
      newNode.next = this.head;
    }
  }

  toArray(limit: number = 20): T[] {
    const result: T[] = [];
    let current = this.head;
    let count = 0;

    while (current && count < limit) {
      result.push(current.value);
      current = current.next;
      if (current === this.head) break;
      count++;
    }

    return result;
  }
}
