export type StackNodeState =
  | "idle"
  | "active"
  | "pushing"
  | "popping"
  | "peeking"
  | "top";

export interface StackNode {
  id: string;
  value: number | string;
  state: StackNodeState;
}

export interface StackStepMetadata {
  operation: "push" | "pop" | "peek" | "init";
  size: number;
  topValue?: number | string;
  result?: string;
}

export interface StackStep {
  nodes: StackNode[];
  message: string;
  subMessage?: string;
  isMajorStep?: boolean;
  metadata?: StackStepMetadata;
}

export const STACK_EMPTY_STEP: StackStep = {
  nodes: [],
  message: "Select an operation to begin",
  subMessage: "Push, pop, or peek to visualize the stack",
  metadata: { operation: "init", size: 0 },
};

function makeNodes(
  items: (number | string)[],
  overrides: Partial<Record<number, StackNodeState>> = {},
): StackNode[] {
  return items.map((v, i) => ({
    id: `node-${i}`,
    value: v,
    state: overrides[i] ?? (i === items.length - 1 ? "top" : "idle"),
  }));
}

export class Stack {
  static generatePushSteps(
    current: (number | string)[],
    value: number | string,
  ): StackStep[] {
    const steps: StackStep[] = [];
    const topIdx = current.length - 1;

    // Step 1: Announce intent
    steps.push({
      nodes: makeNodes(current),
      message: `push(${value})`,
      subMessage:
        current.length === 0
          ? "Stack is empty — placing first element"
          : `Current top is ${current[topIdx]}`,
      isMajorStep: true,
      metadata: {
        operation: "push",
        size: current.length,
        topValue: current[topIdx],
      },
    });

    // Step 2: New node appearing
    const arriving: StackNode[] = [
      ...current.map((v, i) => ({
        id: `node-${i}`,
        value: v,
        state: "idle" as StackNodeState,
      })),
      { id: `node-${current.length}`, value, state: "pushing" },
    ];
    steps.push({
      nodes: arriving,
      message: `Placing ${value} on top of the stack`,
      subMessage: "New element is being pushed",
      metadata: {
        operation: "push",
        size: current.length + 1,
        topValue: value,
      },
    });

    // Step 3: Settled
    const after = [...current, value];
    steps.push({
      nodes: makeNodes(after),
      message: `${value} pushed successfully`,
      subMessage: `Stack size: ${after.length}`,
      isMajorStep: true,
      metadata: {
        operation: "push",
        size: after.length,
        topValue: value,
        result: "OK",
      },
    });

    return steps;
  }

  static generatePopSteps(current: (number | string)[]): StackStep[] {
    const steps: StackStep[] = [];

    if (current.length === 0) {
      steps.push({
        nodes: [],
        message: "pop() — Stack underflow!",
        subMessage: "Cannot pop from an empty stack",
        isMajorStep: true,
        metadata: { operation: "pop", size: 0, result: "underflow" },
      });
      return steps;
    }

    const topIdx = current.length - 1;
    const topValue = current[topIdx];

    // Step 1: Identify top
    steps.push({
      nodes: makeNodes(current),
      message: `pop()`,
      subMessage: `Top element is ${topValue}`,
      isMajorStep: true,
      metadata: { operation: "pop", size: current.length, topValue },
    });

    // Step 2: Highlight removal
    steps.push({
      nodes: makeNodes(current, { [topIdx]: "popping" }),
      message: `Removing ${topValue} from the top`,
      subMessage: "Element is leaving the stack",
      metadata: { operation: "pop", size: current.length, topValue },
    });

    // Step 3: Result
    const after = current.slice(0, -1);
    steps.push({
      nodes: makeNodes(after),
      message: `Popped ${topValue}`,
      subMessage:
        after.length > 0
          ? `New top: ${after[after.length - 1]} — Stack size: ${after.length}`
          : "Stack is now empty",
      isMajorStep: true,
      metadata: {
        operation: "pop",
        size: after.length,
        topValue: after[after.length - 1],
        result: String(topValue),
      },
    });

    return steps;
  }

  static generatePeekSteps(current: (number | string)[]): StackStep[] {
    const steps: StackStep[] = [];

    if (current.length === 0) {
      steps.push({
        nodes: [],
        message: "peek() — Stack is empty",
        subMessage: "Nothing to peek at",
        isMajorStep: true,
        metadata: { operation: "peek", size: 0, result: "undefined" },
      });
      return steps;
    }

    const topIdx = current.length - 1;
    const topValue = current[topIdx];

    // Step 1: Look at top
    steps.push({
      nodes: makeNodes(current, { [topIdx]: "peeking" }),
      message: `peek()`,
      subMessage: `Examining the top element`,
      isMajorStep: true,
      metadata: { operation: "peek", size: current.length, topValue },
    });

    // Step 2: Return value
    steps.push({
      nodes: makeNodes(current),
      message: `peek() returned ${topValue}`,
      subMessage: "Stack is unchanged",
      isMajorStep: true,
      metadata: {
        operation: "peek",
        size: current.length,
        topValue,
        result: String(topValue),
      },
    });

    return steps;
  }
}
