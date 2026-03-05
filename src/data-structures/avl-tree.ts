import {
  TreeNodeState,
  TreeStep,
  VisNode,
} from "@/data-structures/binary-tree";

// ── AVL Node ──────────────────────────────────────────────────────────────────

export interface AVLNode {
  id: string;
  value: number;
  left: AVLNode | null;
  right: AVLNode | null;
  parent: AVLNode | null;
  height: number;
}

let _avlId = 0;
function newAVLNode(value: number): AVLNode {
  return {
    id: `avl-${++_avlId}`,
    value,
    left: null,
    right: null,
    parent: null,
    height: 1,
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function h(node: AVLNode | null): number {
  return node?.height ?? 0;
}
function bf(node: AVLNode): number {
  return h(node.left) - h(node.right);
}
function updateHeight(node: AVLNode): void {
  node.height = 1 + Math.max(h(node.left), h(node.right));
}

export function avlClone(
  node: AVLNode | null,
  parent: AVLNode | null = null,
): AVLNode | null {
  if (!node) return null;
  const n: AVLNode = { ...node, left: null, right: null, parent };
  n.left = avlClone(node.left, n);
  n.right = avlClone(node.right, n);
  return n;
}

function findById(root: AVLNode | null, id: string): AVLNode | null {
  if (!root) return null;
  if (root.id === id) return root;
  return findById(root.left, id) ?? findById(root.right, id);
}

/** Replace the subtree rooted at `targetId` with `newSub` inside `fullRoot`.
 *  Returns the (possibly new) root of the full tree. */
function replaceSubtree(
  fullRoot: AVLNode | null,
  targetId: string,
  newSub: AVLNode,
): AVLNode {
  if (!fullRoot || fullRoot.id === targetId) {
    newSub.parent = null;
    return newSub;
  }
  function patch(node: AVLNode): void {
    if (node.left?.id === targetId) {
      node.left = newSub;
      newSub.parent = node;
      return;
    }
    if (node.right?.id === targetId) {
      node.right = newSub;
      newSub.parent = node;
      return;
    }
    if (node.left) patch(node.left);
    if (node.right) patch(node.right);
  }
  patch(fullRoot);
  return fullRoot;
}

// ── Primitive rotations (operate in-place, return new subtree root) ───────────

function rotateRight(y: AVLNode): AVLNode {
  const x = y.left!;
  const T2 = x.right;
  x.right = y;
  y.left = T2;
  x.parent = y.parent;
  y.parent = x;
  if (T2) T2.parent = y;
  updateHeight(y);
  updateHeight(x);
  return x;
}

function rotateLeft(x: AVLNode): AVLNode {
  const y = x.right!;
  const T2 = y.left;
  y.left = x;
  x.right = T2;
  y.parent = x.parent;
  x.parent = y;
  if (T2) T2.parent = x;
  updateHeight(x);
  updateHeight(y);
  return y;
}

function rebalance(node: AVLNode): AVLNode {
  updateHeight(node);
  const balance = bf(node);
  if (balance > 1) {
    if (bf(node.left!) < 0) node.left = rotateLeft(node.left!);
    return rotateRight(node);
  }
  if (balance < -1) {
    if (bf(node.right!) > 0) node.right = rotateRight(node.right!);
    return rotateLeft(node);
  }
  return node;
}

// ── BST insert (no rebalancing) ───────────────────────────────────────────────

function bstInsertOnly(root: AVLNode | null, value: number): AVLNode {
  const node = newAVLNode(value);
  if (!root) return node;
  let cur = root;
  while (true) {
    if (value < cur.value) {
      if (!cur.left) {
        cur.left = node;
        node.parent = cur;
        break;
      }
      cur = cur.left;
    } else if (value > cur.value) {
      if (!cur.right) {
        cur.right = node;
        node.parent = cur;
        break;
      }
      cur = cur.right;
    } else break; // duplicate
  }
  // Update heights bottom-up from insertion point
  let p: AVLNode | null = node.parent;
  while (p) {
    updateHeight(p);
    p = p.parent;
  }
  return root;
}

// ── Mutation exports (used by hook to commit state) ───────────────────────────

export function avlInsertMutate(root: AVLNode | null, value: number): AVLNode {
  function insert(node: AVLNode | null): AVLNode {
    if (!node) return newAVLNode(value);
    if (value < node.value) {
      node.left = insert(node.left);
      if (node.left) node.left.parent = node;
    } else if (value > node.value) {
      node.right = insert(node.right);
      if (node.right) node.right.parent = node;
    } else return node;
    return rebalance(node);
  }
  return insert(root);
}

export function avlDeleteMutate(
  root: AVLNode | null,
  value: number,
): AVLNode | null {
  function del(node: AVLNode | null): AVLNode | null {
    if (!node) return null;
    if (value < node.value) {
      node.left = del(node.left);
      if (node.left) node.left.parent = node;
    } else if (value > node.value) {
      node.right = del(node.right);
      if (node.right) node.right.parent = node;
    } else {
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      let succ = node.right;
      while (succ.left) succ = succ.left;
      node.value = succ.value;
      node.right = del(node.right);
      if (node.right) node.right.parent = node;
    }
    return rebalance(node);
  }
  return del(root);
}

// ── Snapshot helpers ──────────────────────────────────────────────────────────

function avlToVis(
  root: AVLNode | null,
  states: Record<string, TreeNodeState> = {},
  showBF = false,
): VisNode[] {
  const result: VisNode[] = [];
  function visit(node: AVLNode | null) {
    if (!node) return;
    const balance = bf(node);
    result.push({
      id: node.id,
      value: node.value,
      left: node.left?.id ?? null,
      right: node.right?.id ?? null,
      parent: node.parent?.id ?? null,
      state: states[node.id] ?? "idle",
      ...(showBF && { extra: `bf:${balance > 0 ? "+" : ""}${balance}` }),
    });
    visit(node.left);
    visit(node.right);
  }
  visit(root);
  return result;
}

function snap(
  root: AVLNode | null,
  states: Record<string, TreeNodeState>,
  message: string,
  opts?: { subMessage?: string; isMajorStep?: boolean; showBF?: boolean },
): TreeStep {
  return {
    nodes: avlToVis(root, states, opts?.showBF ?? false),
    rootId: root?.id ?? null,
    message,
    ...(opts?.subMessage !== undefined && { subMessage: opts.subMessage }),
    ...(opts?.isMajorStep && { isMajorStep: true }),
  };
}
function snapBF(
  root: AVLNode | null,
  states: Record<string, TreeNodeState>,
  message: string,
  opts?: { subMessage?: string; isMajorStep?: boolean },
): TreeStep {
  return snap(root, states, message, { ...opts, showBF: true });
}

// ── Rotation type ─────────────────────────────────────────────────────────────

type RotationType = "LL" | "RR" | "LR" | "RL";
function detectRotation(node: AVLNode): RotationType {
  const balance = bf(node);
  if (balance > 1) return bf(node.left!) >= 0 ? "LL" : "LR";
  return bf(node.right!) <= 0 ? "RR" : "RL";
}

// ── Visual rotation step generator ───────────────────────────────────────────
//
// Strategy: operate on REAL intermediate tree structures so that the layout
// algorithm places nodes at new coordinates — CSS transition does the rest.
//
// For each rotation we:
//   1. Highlight the unbalanced subtree (current tree, pre-rotation)
//   2. Apply the rotation(s) to get new tree structure(s)
//   3. Emit each intermediate structure — nodes glide to new positions
//
function buildRotationSteps(
  fullTree: AVLNode,
  unbalancedId: string,
  steps: TreeStep[],
): AVLNode {
  const unbalanced = findById(fullTree, unbalancedId)!;
  const rotType = detectRotation(unbalanced);
  const balance = bf(unbalanced);

  // Step 1 — highlight unbalanced node
  steps.push(
    snapBF(
      fullTree,
      { [unbalancedId]: "unbalanced" },
      `Node ${unbalanced.value}: bf = ${balance > 0 ? "+" : ""}${balance} — UNBALANCED`,
      {
        subMessage:
          rotType === "LL"
            ? "Left-Left → single right rotation"
            : rotType === "RR"
              ? "Right-Right → single left rotation"
              : rotType === "LR"
                ? "Left-Right → rotate left child left, then root right"
                : "Right-Left → rotate right child right, then root left",
      },
    ),
  );

  if (rotType === "LL") {
    // Highlight pivot pair
    const y = unbalanced.left!;
    steps.push(
      snapBF(
        fullTree,
        { [unbalancedId]: "unbalanced", [y.id]: "rotating" },
        `Right-rotate: ${y.value} rises, ${unbalanced.value} descends`,
        { subMessage: "Nodes moving..." },
      ),
    );

    // Apply rotation → new tree structure
    const newSub = rotateRight(avlClone(unbalanced)!);
    const newTree = avlClone(fullTree)!;
    const result = replaceSubtree(newTree, unbalancedId, newSub);
    steps.push(
      snapBF(
        result,
        { [newSub.id]: "rotating" },
        `Rotation complete — ${newSub.value} is the new subtree root`,
        { isMajorStep: true },
      ),
    );
    return result;
  }

  if (rotType === "RR") {
    const y = unbalanced.right!;
    steps.push(
      snapBF(
        fullTree,
        { [unbalancedId]: "unbalanced", [y.id]: "rotating" },
        `Left-rotate: ${y.value} rises, ${unbalanced.value} descends`,
        { subMessage: "Nodes moving..." },
      ),
    );

    const newSub = rotateLeft(avlClone(unbalanced)!);
    const newTree = avlClone(fullTree)!;
    const result = replaceSubtree(newTree, unbalancedId, newSub);
    steps.push(
      snapBF(
        result,
        { [newSub.id]: "rotating" },
        `Rotation complete — ${newSub.value} is the new subtree root`,
        { isMajorStep: true },
      ),
    );
    return result;
  }

  if (rotType === "LR") {
    const y = unbalanced.left!;
    const x = y.right!;

    // Highlight the three nodes involved
    steps.push(
      snapBF(
        fullTree,
        {
          [unbalancedId]: "unbalanced",
          [y.id]: "rotating",
          [x.id]: "rotating",
        },
        `LR case: ${x.value} will become the new subtree root`,
        { subMessage: `Step 1 of 2: left-rotate ${y.value}` },
      ),
    );

    // Step 1 — left-rotate y, splice back into full tree
    const tree1 = avlClone(fullTree)!;
    const unbal1 = findById(tree1, unbalancedId)!;
    const newY = rotateLeft(avlClone(unbal1.left)!);
    unbal1.left = newY;
    newY.parent = unbal1;
    updateHeight(unbal1);
    // x is now unbal1.left (the new left child after rotation)
    const newLeftId = unbal1.left.id;
    steps.push(
      snapBF(
        tree1,
        { [unbalancedId]: "unbalanced", [newLeftId]: "rotating" },
        `${y.value} rotated down — now right-rotate ${unbalanced.value}`,
        { subMessage: "Step 2 of 2: right-rotate the unbalanced node" },
      ),
    );

    // Step 2 — right-rotate unbalanced node
    const newSub = rotateRight(avlClone(unbal1)!);
    const tree2 = avlClone(fullTree)!;
    const result = replaceSubtree(tree2, unbalancedId, newSub);
    steps.push(
      snapBF(
        result,
        { [newSub.id]: "rotating" },
        `LR rotation complete — ${newSub.value} is the new subtree root`,
        { isMajorStep: true },
      ),
    );
    return result;
  }

  // RL
  const y = unbalanced.right!;
  const x = y.left!;

  steps.push(
    snapBF(
      fullTree,
      { [unbalancedId]: "unbalanced", [y.id]: "rotating", [x.id]: "rotating" },
      `RL case: ${x.value} will become the new subtree root`,
      { subMessage: `Step 1 of 2: right-rotate ${y.value}` },
    ),
  );

  // Step 1 — right-rotate y
  const tree1 = avlClone(fullTree)!;
  const unbal1 = findById(tree1, unbalancedId)!;
  const newY = rotateRight(avlClone(unbal1.right)!);
  unbal1.right = newY;
  newY.parent = unbal1;
  updateHeight(unbal1);
  const newRightId = unbal1.right.id;
  steps.push(
    snapBF(
      tree1,
      { [unbalancedId]: "unbalanced", [newRightId]: "rotating" },
      `${y.value} rotated down — now left-rotate ${unbalanced.value}`,
      { subMessage: "Step 2 of 2: left-rotate the unbalanced node" },
    ),
  );

  // Step 2 — left-rotate unbalanced node
  const newSub = rotateLeft(avlClone(unbal1)!);
  const tree2 = avlClone(fullTree)!;
  const result = replaceSubtree(tree2, unbalancedId, newSub);
  steps.push(
    snapBF(
      result,
      { [newSub.id]: "rotating" },
      `RL rotation complete — ${newSub.value} is the new subtree root`,
      { isMajorStep: true },
    ),
  );
  return result;
}

// ── AVL Steps ─────────────────────────────────────────────────────────────────

export class AVLSteps {
  static insert(root: AVLNode | null, value: number): TreeStep[] {
    const steps: TreeStep[] = [];
    const clone = avlClone(root);

    steps.push(
      snap(clone, {}, `insert(${value})`, {
        subMessage: clone
          ? `Comparing from root (${clone.value})`
          : "Tree is empty — creating root",
        isMajorStep: true,
      }),
    );

    if (!clone) {
      const single = newAVLNode(value);
      steps.push({
        nodes: avlToVis(single, { [single.id]: "inserting" }),
        rootId: single.id,
        message: `${value} is now the root`,
        isMajorStep: true,
      });
      return steps;
    }

    // ── BST traversal (show comparisons) ─────────────────────────────────────
    const visited: string[] = [];
    let cur: AVLNode = clone;
    while (true) {
      visited.push(cur.id);
      const states: Record<string, TreeNodeState> = {};
      visited.forEach((id) => (states[id] = "comparing"));

      if (value === cur.value) {
        steps.push(
          snap(clone, states, `${value} already exists — no duplicates`, {
            isMajorStep: true,
          }),
        );
        return steps;
      }
      const dir = value < cur.value ? "left" : "right";
      steps.push(
        snap(
          clone,
          states,
          `${value} ${value < cur.value ? "<" : ">"} ${cur.value} — go ${dir}`,
        ),
      );
      const child = cur[dir];
      if (!child) {
        const newNode = newAVLNode(value);
        cur[dir] = newNode;
        newNode.parent = cur;
        const fs: Record<string, TreeNodeState> = {};
        visited.forEach((id) => (fs[id] = "comparing"));
        fs[newNode.id] = "inserting";
        steps.push(
          snap(clone, fs, `Inserted ${value} — checking balance factors`, {
            subMessage: `Placed as ${dir} child of ${cur.value}`,
          }),
        );
        break;
      }
      cur = child;
    }

    // ── Build pre-balance tree (BST insert, heights updated, no rotations) ────
    // We clone from the original root so IDs in `clone` (which has the inserted node)
    // match the unbalanced detection walk.
    let workTree = avlClone(root)!; // fresh clone of original root
    workTree = bstInsertOnly(workTree, value)!; // insert without rebalancing

    // Collect path from root to inserted node
    const path: string[] = [];
    let walker: AVLNode | null = workTree;
    while (walker) {
      path.push(walker.id);
      if (walker.value === value) break;
      walker = value < walker.value ? walker.left : walker.right;
    }

    // Show BF pass
    steps.push(
      snapBF(workTree, {}, `Updating heights on path back to root`, {
        subMessage: "Balance factor = height(left) − height(right)",
      }),
    );

    for (let i = path.length - 2; i >= 0; i--) {
      const node = findById(workTree, path[i]);
      if (!node) continue;
      const balance = bf(node);
      steps.push(
        snapBF(
          workTree,
          { [node.id]: Math.abs(balance) > 1 ? "unbalanced" : "comparing" },
          `Node ${node.value}: bf = ${balance > 0 ? "+" : ""}${balance}${Math.abs(balance) > 1 ? " — UNBALANCED" : " ✓"}`,
        ),
      );
    }

    // ── Find first unbalanced ancestor ───────────────────────────────────────
    let unbalancedId: string | null = null;
    for (let i = path.length - 2; i >= 0; i--) {
      const node = findById(workTree, path[i]);
      if (node && Math.abs(bf(node)) > 1) {
        unbalancedId = node.id;
        break;
      }
    }

    if (!unbalancedId) {
      const finalTree = avlClone(root)
        ? avlInsertMutate(avlClone(root), value)
        : newAVLNode(value);
      steps.push(
        snapBF(finalTree, {}, `No rotation needed — tree is balanced`, {
          isMajorStep: true,
        }),
      );
      return steps;
    }

    // ── Visual rotations ──────────────────────────────────────────────────────
    buildRotationSteps(workTree, unbalancedId, steps);

    // Final committed state
    const finalTree = root
      ? avlInsertMutate(avlClone(root), value)
      : newAVLNode(value);
    steps.push(
      snapBF(finalTree, {}, `Tree balanced — insertion complete`, {
        isMajorStep: true,
      }),
    );

    return steps;
  }

  static delete(root: AVLNode | null, value: number): TreeStep[] {
    const steps: TreeStep[] = [];
    const clone = avlClone(root);

    steps.push(
      snap(clone, {}, `delete(${value})`, {
        subMessage: "Searching for node to delete",
        isMajorStep: true,
      }),
    );
    if (!clone) {
      steps.push({
        nodes: [],
        rootId: null,
        message: "Tree is empty",
        isMajorStep: true,
      });
      return steps;
    }

    let cur: AVLNode | null = clone;
    const visited: string[] = [];
    let found = false;
    while (cur) {
      visited.push(cur.id);
      const states: Record<string, TreeNodeState> = {};
      visited.forEach((id) => (states[id] = "comparing"));
      if (cur.value === value) {
        steps.push(
          snap(
            clone,
            { ...states, [cur.id]: "found" },
            `Found ${value} — deleting`,
            { subMessage: "Will rebalance on the way back up" },
          ),
        );
        found = true;
        break;
      }
      steps.push(
        snap(
          clone,
          states,
          `${value} ${value < cur.value ? "<" : ">"} ${cur.value} — go ${value < cur.value ? "left" : "right"}`,
        ),
      );
      cur = value < cur.value ? cur.left : cur.right;
    }

    if (!found) {
      steps.push(snap(clone, {}, `${value} not found`, { isMajorStep: true }));
      return steps;
    }

    steps.push(
      snap(
        clone,
        { [cur!.id]: "deleting" },
        `Removing ${value} and rebalancing`,
      ),
    );

    const newRoot = avlDeleteMutate(avlClone(root), value);
    steps.push(
      snapBF(newRoot, {}, `${value} deleted — tree rebalanced`, {
        isMajorStep: true,
      }),
    );
    return steps;
  }

  static search(root: AVLNode | null, value: number): TreeStep[] {
    const steps: TreeStep[] = [];
    const clone = avlClone(root);
    steps.push(
      snap(clone, {}, `search(${value})`, {
        subMessage: "AVL guarantees O(log n) height",
        isMajorStep: true,
      }),
    );
    if (!clone) {
      steps.push({
        nodes: [],
        rootId: null,
        message: "Tree is empty",
        isMajorStep: true,
      });
      return steps;
    }
    let cur: AVLNode | null = clone;
    const visited: string[] = [];
    while (cur) {
      visited.push(cur.id);
      const states: Record<string, TreeNodeState> = {};
      visited.forEach((id) => (states[id] = "comparing"));
      if (cur.value === value) {
        steps.push(
          snap(clone, { ...states, [cur.id]: "found" }, `Found ${value}!`, {
            isMajorStep: true,
          }),
        );
        return steps;
      }
      const dir: "left" | "right" = value < cur.value ? "left" : "right";
      steps.push(
        snap(
          clone,
          states,
          `${value} ${value < cur.value ? "<" : ">"} ${cur.value} — go ${dir}`,
        ),
      );
      cur = cur[dir];
    }
    steps.push(snap(clone, {}, `${value} not found`, { isMajorStep: true }));
    return steps;
  }

  static inorder(root: AVLNode | null): TreeStep[] {
    return AVLSteps._traversal(root, "inorder");
  }
  static preorder(root: AVLNode | null): TreeStep[] {
    return AVLSteps._traversal(root, "preorder");
  }
  static postorder(root: AVLNode | null): TreeStep[] {
    return AVLSteps._traversal(root, "postorder");
  }

  static levelOrder(root: AVLNode | null): TreeStep[] {
    const steps: TreeStep[] = [];
    const clone = avlClone(root);
    steps.push(
      snapBF(clone, {}, "levelOrder()", {
        subMessage: "Visit nodes level by level",
        isMajorStep: true,
      }),
    );
    if (!clone) {
      steps.push({
        nodes: [],
        rootId: null,
        message: "Tree is empty",
        isMajorStep: true,
      });
      return steps;
    }
    const queue: AVLNode[] = [clone];
    const visitedIds: string[] = [];
    const visitedVals: number[] = [];
    while (queue.length > 0) {
      const node = queue.shift()!;
      visitedIds.push(node.id);
      visitedVals.push(node.value);
      const states: Record<string, TreeNodeState> = {};
      visitedIds.forEach((id) => (states[id] = "traversing"));
      steps.push(
        snapBF(clone, states, `Visiting ${node.value}`, {
          subMessage: `[${visitedVals.join(", ")}]`,
        }),
      );
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    const fs: Record<string, TreeNodeState> = {};
    visitedIds.forEach((id) => (fs[id] = "traversing"));
    steps.push(
      snapBF(clone, fs, "Level-order complete", {
        subMessage: `[${visitedVals.join(", ")}]`,
        isMajorStep: true,
      }),
    );
    return steps;
  }

  private static _traversal(
    root: AVLNode | null,
    order: "inorder" | "preorder" | "postorder",
  ): TreeStep[] {
    const steps: TreeStep[] = [];
    const clone = avlClone(root);
    const desc = {
      inorder: "Left → Root → Right",
      preorder: "Root → Left → Right",
      postorder: "Left → Right → Root",
    };
    steps.push(
      snapBF(clone, {}, `${order}()`, {
        subMessage: desc[order],
        isMajorStep: true,
      }),
    );
    if (!clone) {
      steps.push({
        nodes: [],
        rootId: null,
        message: "Tree is empty",
        isMajorStep: true,
      });
      return steps;
    }
    const visitedIds: string[] = [];
    const visitedVals: number[] = [];
    function visit(node: AVLNode | null) {
      if (!node) return;
      function emit() {
        const states: Record<string, TreeNodeState> = {};
        visitedIds.forEach((id) => (states[id] = "traversing"));
        steps.push(
          snapBF(clone, states, `Visiting ${node!.value}`, {
            subMessage: `[${visitedVals.join(", ")}]`,
          }),
        );
      }
      if (order === "preorder") {
        visitedIds.push(node.id);
        visitedVals.push(node.value);
        emit();
      }
      visit(node.left);
      if (order === "inorder") {
        visitedIds.push(node.id);
        visitedVals.push(node.value);
        emit();
      }
      visit(node.right);
      if (order === "postorder") {
        visitedIds.push(node.id);
        visitedVals.push(node.value);
        emit();
      }
    }
    visit(clone);
    const fs: Record<string, TreeNodeState> = {};
    visitedIds.forEach((id) => (fs[id] = "traversing"));
    steps.push(
      snapBF(clone, fs, `${order} complete`, {
        subMessage: `[${visitedVals.join(", ")}]`,
        isMajorStep: true,
      }),
    );
    return steps;
  }
}
