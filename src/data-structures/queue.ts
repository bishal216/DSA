export type QueueNodeState =
  | "idle"
  | "front"
  | "rear"
  | "enqueuing"
  | "dequeuing"
  | "peeking";

export interface QueueNode {
  id: string;
  value: number;
  state: QueueNodeState;
}

export interface QueueStepMetadata {
  operation: "enqueue" | "dequeue" | "peek" | "init";
  endpoint: "front" | "rear" | "none";
  size: number;
  frontValue?: number;
  rearValue?: number;
  result?: string;
}

export interface QueueStep {
  nodes: QueueNode[];
  message: string;
  subMessage?: string;
  isMajorStep?: boolean;
  metadata?: QueueStepMetadata;
}

export const QUEUE_EMPTY_STEP: QueueStep = {
  nodes: [],
  message: "Select an operation to begin",
  subMessage: "Enqueue elements to visualize the queue",
  metadata: { operation: "init", endpoint: "none", size: 0 },
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function toNodes(
  values: number[],
  overrides: Partial<Record<number, QueueNodeState>> = {},
): QueueNode[] {
  return values.map((v, i) => ({
    id: `node-${i}`,
    value: v,
    state:
      overrides[i] ??
      (values.length === 1
        ? "front"
        : i === 0
          ? "front"
          : i === values.length - 1
            ? "rear"
            : "idle"),
  }));
}

function meta(
  op: QueueStepMetadata["operation"],
  endpoint: QueueStepMetadata["endpoint"],
  values: number[],
  result?: string,
): QueueStepMetadata {
  return {
    operation: op,
    endpoint,
    size: values.length,
    ...(values.length > 0 && {
      frontValue: values[0],
      rearValue: values[values.length - 1],
    }),
    ...(result !== undefined && { result }),
  };
}

// ── Step generators ───────────────────────────────────────────────────────────

export class QueueSteps {
  static enqueueRear(current: number[], value: number): QueueStep[] {
    const after = [...current, value];
    return [
      {
        nodes: toNodes(current),
        message: `enqueue(${value})`,
        subMessage:
          current.length === 0
            ? "Queue is empty — placing first element"
            : `Current rear is ${current[current.length - 1]}`,
        isMajorStep: true,
        metadata: meta("enqueue", "rear", current),
      },
      {
        nodes: [
          ...toNodes(current).map((n) => ({
            ...n,
            state: "idle" as QueueNodeState,
          })),
          { id: `node-${current.length}`, value, state: "enqueuing" },
        ],
        message: `Placing ${value} at the rear`,
        metadata: meta("enqueue", "rear", after),
      },
      {
        nodes: toNodes(after),
        message: `${value} enqueued successfully`,
        subMessage: `Queue size: ${after.length}`,
        isMajorStep: true,
        metadata: meta("enqueue", "rear", after, "OK"),
      },
    ];
  }

  static enqueueFront(current: number[], value: number): QueueStep[] {
    const after = [value, ...current];
    return [
      {
        nodes: toNodes(current),
        message: `addFront(${value})`,
        subMessage:
          current.length === 0
            ? "Queue is empty — placing first element"
            : `Current front is ${current[0]}`,
        isMajorStep: true,
        metadata: meta("enqueue", "front", current),
      },
      {
        nodes: [
          { id: `node-0`, value, state: "enqueuing" },
          ...toNodes(current).map((n, i) => ({
            ...n,
            id: `node-${i + 1}`,
            state: "idle" as QueueNodeState,
          })),
        ],
        message: `Placing ${value} at the front`,
        metadata: meta("enqueue", "front", after),
      },
      {
        nodes: toNodes(after),
        message: `${value} added to front successfully`,
        subMessage: `Queue size: ${after.length}`,
        isMajorStep: true,
        metadata: meta("enqueue", "front", after, "OK"),
      },
    ];
  }

  static dequeueFront(current: number[]): QueueStep[] {
    if (current.length === 0) {
      return [
        {
          nodes: [],
          message: "dequeue() — Queue is empty!",
          subMessage: "Cannot dequeue from an empty queue",
          isMajorStep: true,
          metadata: {
            operation: "dequeue",
            endpoint: "front",
            size: 0,
            result: "underflow",
          },
        },
      ];
    }
    const after = current.slice(1);
    return [
      {
        nodes: toNodes(current),
        message: `dequeue()`,
        subMessage: `Front element is ${current[0]}`,
        isMajorStep: true,
        metadata: meta("dequeue", "front", current),
      },
      {
        nodes: toNodes(current, { 0: "dequeuing" }),
        message: `Removing ${current[0]} from the front`,
        metadata: meta("dequeue", "front", current),
      },
      {
        nodes: toNodes(after),
        message: `Dequeued ${current[0]}`,
        subMessage:
          after.length > 0
            ? `New front: ${after[0]} — Queue size: ${after.length}`
            : "Queue is now empty",
        isMajorStep: true,
        metadata: meta("dequeue", "front", after, String(current[0])),
      },
    ];
  }

  static dequeueRear(current: number[]): QueueStep[] {
    if (current.length === 0) {
      return [
        {
          nodes: [],
          message: "removeRear() — Queue is empty!",
          subMessage: "Cannot remove from an empty queue",
          isMajorStep: true,
          metadata: {
            operation: "dequeue",
            endpoint: "rear",
            size: 0,
            result: "underflow",
          },
        },
      ];
    }
    const rearValue = current[current.length - 1];
    const after = current.slice(0, -1);
    return [
      {
        nodes: toNodes(current),
        message: `removeRear()`,
        subMessage: `Rear element is ${rearValue}`,
        isMajorStep: true,
        metadata: meta("dequeue", "rear", current),
      },
      {
        nodes: toNodes(current, { [current.length - 1]: "dequeuing" }),
        message: `Removing ${rearValue} from the rear`,
        metadata: meta("dequeue", "rear", current),
      },
      {
        nodes: toNodes(after),
        message: `Removed ${rearValue} from rear`,
        subMessage:
          after.length > 0
            ? `New rear: ${after[after.length - 1]} — Queue size: ${after.length}`
            : "Queue is now empty",
        isMajorStep: true,
        metadata: meta("dequeue", "rear", after, String(rearValue)),
      },
    ];
  }

  static peekFront(current: number[]): QueueStep[] {
    if (current.length === 0) {
      return [
        {
          nodes: [],
          message: "peekFront() — Queue is empty",
          isMajorStep: true,
          metadata: {
            operation: "peek",
            endpoint: "front",
            size: 0,
            result: "undefined",
          },
        },
      ];
    }
    return [
      {
        nodes: toNodes(current, { 0: "peeking" }),
        message: `peekFront()`,
        subMessage: "Examining the front element",
        isMajorStep: true,
        metadata: meta("peek", "front", current),
      },
      {
        nodes: toNodes(current),
        message: `peekFront() returned ${current[0]}`,
        subMessage: "Queue is unchanged",
        isMajorStep: true,
        metadata: meta("peek", "front", current, String(current[0])),
      },
    ];
  }

  static peekRear(current: number[]): QueueStep[] {
    if (current.length === 0) {
      return [
        {
          nodes: [],
          message: "peekRear() — Queue is empty",
          isMajorStep: true,
          metadata: {
            operation: "peek",
            endpoint: "rear",
            size: 0,
            result: "undefined",
          },
        },
      ];
    }
    const lastIdx = current.length - 1;
    return [
      {
        nodes: toNodes(current, { [lastIdx]: "peeking" }),
        message: `peekRear()`,
        subMessage: "Examining the rear element",
        isMajorStep: true,
        metadata: meta("peek", "rear", current),
      },
      {
        nodes: toNodes(current),
        message: `peekRear() returned ${current[lastIdx]}`,
        subMessage: "Queue is unchanged",
        isMajorStep: true,
        metadata: meta("peek", "rear", current, String(current[lastIdx])),
      },
    ];
  }
}
