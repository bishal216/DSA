export type LinkedListNodeState =
  | "idle"
  | "head"
  | "tail"
  | "traversing"
  | "inserting"
  | "deleting"
  | "found"
  | "notFound";

export interface LinkedListNode {
  id: string;
  value: number;
  state: LinkedListNodeState;
}

export interface LinkedListStep {
  nodes: LinkedListNode[];
  message: string;
  subMessage?: string;
  isMajorStep?: boolean;
}

export const LL_EMPTY_STEP: LinkedListStep = {
  nodes: [],
  message: "Select an operation to begin",
  subMessage: "Insert nodes to visualize the list",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function stable(
  values: number[],
  overrides: Partial<Record<number, LinkedListNodeState>> = {},
): LinkedListNode[] {
  return values.map((v, i) => ({
    id: `node-${i}`,
    value: v,
    state:
      overrides[i] ??
      (values.length === 1
        ? "head"
        : i === 0
          ? "head"
          : i === values.length - 1
            ? "tail"
            : "idle"),
  }));
}

function withState(
  values: number[],
  index: number,
  state: LinkedListNodeState,
): LinkedListNode[] {
  return stable(values, { [index]: state });
}

// Produces a sequence of traversal steps from index 0 to `upTo` (inclusive)
function traverseSteps(
  values: number[],
  upTo: number,
  makeMessage: (i: number) => string,
): LinkedListStep[] {
  const steps: LinkedListStep[] = [];
  for (let i = 0; i <= upTo; i++) {
    steps.push({
      nodes: withState(values, i, "traversing"),
      message: makeMessage(i),
      subMessage: `Visiting node at index ${i} (value: ${values[i]})`,
    });
  }
  return steps;
}

// ── Step generators ───────────────────────────────────────────────────────────

export class LinkedListSteps {
  static insertHead(current: number[], value: number): LinkedListStep[] {
    const after = [value, ...current];
    const steps: LinkedListStep[] = [];

    steps.push({
      nodes: stable(current),
      message: `insertHead(${value})`,
      subMessage:
        current.length === 0
          ? "List is empty — creating first node"
          : `Current head is ${current[0]}`,
      isMajorStep: true,
    });

    steps.push({
      nodes: [
        { id: `node-new`, value, state: "inserting" },
        ...stable(current).map((n) => ({
          ...n,
          state: "idle" as LinkedListNodeState,
        })),
      ],
      message: `Placing ${value} at the head`,
      subMessage: "New node points to old head",
    });

    steps.push({
      nodes: stable(after),
      message: `${value} inserted at head`,
      subMessage: `List size: ${after.length}`,
      isMajorStep: true,
    });

    return steps;
  }

  static insertTail(current: number[], value: number): LinkedListStep[] {
    const after = [...current, value];
    const steps: LinkedListStep[] = [];

    steps.push({
      nodes: stable(current),
      message: `insertTail(${value})`,
      subMessage:
        current.length === 0
          ? "List is empty — creating first node"
          : "Traversing to find the tail",
      isMajorStep: true,
    });

    if (current.length > 0) {
      steps.push(
        ...traverseSteps(
          current,
          current.length - 1,
          (i) => `Traversing… at index ${i}`,
        ),
      );
    }

    steps.push({
      nodes: [
        ...stable(current).map((n) => ({
          ...n,
          state: "idle" as LinkedListNodeState,
        })),
        { id: `node-new`, value, state: "inserting" },
      ],
      message: `Placing ${value} at the tail`,
      subMessage: "Tail node now points to new node",
    });

    steps.push({
      nodes: stable(after),
      message: `${value} inserted at tail`,
      subMessage: `List size: ${after.length}`,
      isMajorStep: true,
    });

    return steps;
  }

  static insertAt(
    current: number[],
    value: number,
    index: number,
  ): LinkedListStep[] {
    if (index === 0) return LinkedListSteps.insertHead(current, value);
    if (index >= current.length)
      return LinkedListSteps.insertTail(current, value);

    const after = [...current.slice(0, index), value, ...current.slice(index)];
    const steps: LinkedListStep[] = [];

    steps.push({
      nodes: stable(current),
      message: `insertAt(${value}, index ${index})`,
      subMessage: `Traversing to index ${index}`,
      isMajorStep: true,
    });

    steps.push(
      ...traverseSteps(current, index - 1, (i) => `Traversing… at index ${i}`),
    );

    steps.push({
      nodes: [
        ...current.slice(0, index).map((v, i) => ({
          id: `node-${i}`,
          value: v,
          state: "idle" as LinkedListNodeState,
        })),
        { id: `node-new`, value, state: "inserting" },
        ...current.slice(index).map((v, i) => ({
          id: `node-${index + i}`,
          value: v,
          state: "idle" as LinkedListNodeState,
        })),
      ],
      message: `Inserting ${value} at index ${index}`,
      subMessage: "Re-linking pointers",
    });

    steps.push({
      nodes: stable(after),
      message: `${value} inserted at index ${index}`,
      subMessage: `List size: ${after.length}`,
      isMajorStep: true,
    });

    return steps;
  }

  static deleteByValue(current: number[], value: number): LinkedListStep[] {
    const steps: LinkedListStep[] = [];

    steps.push({
      nodes: stable(current),
      message: `delete(${value})`,
      subMessage: "Searching for value to delete",
      isMajorStep: true,
    });

    if (current.length === 0) {
      steps.push({
        nodes: [],
        message: "List is empty — nothing to delete",
        isMajorStep: true,
      });
      return steps;
    }

    const idx = current.indexOf(value);

    // Traverse up to the found/not-found position
    const searchUpTo = idx === -1 ? current.length - 1 : idx;
    steps.push(
      ...traverseSteps(
        current,
        searchUpTo,
        (i) =>
          `Checking index ${i}: ${current[i] === value ? "match!" : "no match"}`,
      ),
    );

    if (idx === -1) {
      steps.push({
        nodes: stable(current),
        message: `Value ${value} not found`,
        subMessage: "List is unchanged",
        isMajorStep: true,
      });
      return steps;
    }

    steps.push({
      nodes: withState(current, idx, "deleting"),
      message: `Found ${value} at index ${idx} — removing`,
      subMessage: "Re-linking pointers around this node",
    });

    const after = current.filter((_, i) => i !== idx);
    steps.push({
      nodes: stable(after),
      message: `${value} deleted successfully`,
      subMessage:
        after.length > 0 ? `List size: ${after.length}` : "List is now empty",
      isMajorStep: true,
    });

    return steps;
  }

  static deleteAt(current: number[], index: number): LinkedListStep[] {
    const steps: LinkedListStep[] = [];

    if (current.length === 0 || index < 0 || index >= current.length) {
      steps.push({
        nodes: stable(current),
        message:
          current.length === 0
            ? "List is empty — nothing to delete"
            : `Invalid index ${index}`,
        isMajorStep: true,
      });
      return steps;
    }

    steps.push({
      nodes: stable(current),
      message: `deleteAt(${index})`,
      subMessage: `Traversing to index ${index}`,
      isMajorStep: true,
    });

    steps.push(
      ...traverseSteps(current, index, (i) => `Traversing… at index ${i}`),
    );

    steps.push({
      nodes: withState(current, index, "deleting"),
      message: `Removing node at index ${index} (value: ${current[index]})`,
      subMessage: "Re-linking pointers",
    });

    const after = current.filter((_, i) => i !== index);
    steps.push({
      nodes: stable(after),
      message: `Node at index ${index} deleted`,
      subMessage:
        after.length > 0 ? `List size: ${after.length}` : "List is now empty",
      isMajorStep: true,
    });

    return steps;
  }

  static traverse(current: number[]): LinkedListStep[] {
    const steps: LinkedListStep[] = [];

    steps.push({
      nodes: stable(current),
      message: "traverse()",
      subMessage: "Visiting each node from head to tail",
      isMajorStep: true,
    });

    if (current.length === 0) {
      steps.push({
        nodes: [],
        message: "List is empty — nothing to traverse",
        isMajorStep: true,
      });
      return steps;
    }

    for (let i = 0; i < current.length; i++) {
      steps.push({
        nodes: withState(current, i, "traversing"),
        message: `Visiting index ${i} — value: ${current[i]}`,
        ...(i === current.length - 1
          ? { subMessage: "Reached the tail", isMajorStep: true }
          : { subMessage: `${current.length - i - 1} node(s) remaining` }),
      });
    }

    steps.push({
      nodes: stable(current),
      message: "Traversal complete",
      subMessage: `Visited ${current.length} node(s)`,
      isMajorStep: true,
    });

    return steps;
  }

  static reverseTraverse(current: number[]): LinkedListStep[] {
    const steps: LinkedListStep[] = [];

    steps.push({
      nodes: stable(current),
      message: "reverseTraverse()",
      subMessage: "Visiting each node from tail to head",
      isMajorStep: true,
    });

    if (current.length === 0) {
      steps.push({
        nodes: [],
        message: "List is empty — nothing to traverse",
        isMajorStep: true,
      });
      return steps;
    }

    for (let i = current.length - 1; i >= 0; i--) {
      steps.push({
        nodes: withState(current, i, "traversing"),
        message: `Visiting index ${i} — value: ${current[i]}`,
        ...(i === 0
          ? { subMessage: "Reached the head", isMajorStep: true }
          : { subMessage: `${i} node(s) remaining` }),
      });
    }

    steps.push({
      nodes: stable(current),
      message: "Reverse traversal complete",
      subMessage: `Visited ${current.length} node(s)`,
      isMajorStep: true,
    });

    return steps;
  }

  static search(current: number[], value: number): LinkedListStep[] {
    const steps: LinkedListStep[] = [];

    steps.push({
      nodes: stable(current),
      message: `search(${value})`,
      subMessage: "Traversing list to find value",
      isMajorStep: true,
    });

    if (current.length === 0) {
      steps.push({
        nodes: [],
        message: "List is empty — nothing to search",
        isMajorStep: true,
      });
      return steps;
    }

    for (let i = 0; i < current.length; i++) {
      const isMatch = current[i] === value;
      steps.push({
        nodes: withState(current, i, isMatch ? "found" : "traversing"),
        message: isMatch
          ? `Found ${value} at index ${i}!`
          : `Index ${i}: ${current[i]} ≠ ${value}, continuing…`,
        ...(isMatch && { subMessage: "Search complete", isMajorStep: true }),
      });
      if (isMatch) return steps;
    }

    steps.push({
      nodes: stable(current),
      message: `${value} not found in the list`,
      subMessage: "Traversal complete",
      isMajorStep: true,
    });

    return steps;
  }
}
