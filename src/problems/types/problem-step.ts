// ── Shared base ───────────────────────────────────────────────────────────────

export interface ProblemStepBase {
  message: string;
  subMessage?: string;
  isMajorStep?: boolean;
}

// ── DP Table ──────────────────────────────────────────────────────────────────
// Used by: Fibonacci, Coin Change, Knapsack, LCS, Egg Drop

export type DPCellState =
  | "idle" // not yet computed
  | "computing" // currently being filled
  | "dependency" // a cell the current computation reads from
  | "done" // computed
  | "optimal" // on the optimal path / traceback
  | "highlight"; // general highlight

export interface DPCell {
  value: number | null;
  state: DPCellState;
}

export interface DPTableStep extends ProblemStepBase {
  kind: "dp-table";
  /** Row labels (e.g. items for knapsack, "" for 1D) */
  rowLabels: string[];
  /** Column labels (e.g. capacities, amounts, "n") */
  colLabels: string[];
  /** table[row][col] */
  table: DPCell[][];
  /** Current cell being filled, if any */
  activeCell?: [number, number];
  /** Cells involved in the recurrence for the active cell */
  dependencyCells?: [number, number][];
  /** Traceback path (shown after table is filled) */
  optimalPath?: [number, number][];
  /** Extra info panel content (recurrence formula, current subproblem) */
  recurrence?: string;
}

// ── Recursion Tree ────────────────────────────────────────────────────────────
// Used by: Fibonacci (memoization view), Egg Drop, Karatsuba, Closest Pair, CRT

export type TreeNodeState =
  | "idle"
  | "active" // currently executing
  | "cached" // memoized hit
  | "pruned" // pruned / base case
  | "done" // returned value
  | "split" // D&C split node
  | "merge"; // D&C merge node

export interface RecursionNode {
  id: string;
  label: string; // e.g. "fib(5)", "T(4,2)"
  value?: string; // return value once known
  state: TreeNodeState;
  children: RecursionNode[];
  depth: number;
}

export interface RecursionTreeStep extends ProblemStepBase {
  kind: "recursion-tree";
  root: RecursionNode | null;
  activeNodeId?: string;
  recurrence?: string;
}

// ── Grid ──────────────────────────────────────────────────────────────────────
// Used by: N-Queens, Sudoku, Maze

export type GridCellState =
  | "idle"
  | "placed" // queen / filled cell / current path
  | "blocked" // blocked by a queen / wall
  | "trying" // currently trying this cell
  | "backtrack" // backtracking from this cell
  | "path" // solution path (maze)
  | "visited" // visited but not on final path
  | "start"
  | "end";

export interface GridCell {
  value: string | number | null; // number for Sudoku, null for others
  state: GridCellState;
  fixed?: boolean; // Sudoku given cells
}

export interface GridStep extends ProblemStepBase {
  kind: "grid";
  grid: GridCell[][];
  rows: number;
  cols: number;
  /** For N-Queens: which columns are placed per row */
  queensPlaced?: number[];
  /** For recursion tree overlay on backtracking */
  callStack?: string[];
}

// ── Timeline ──────────────────────────────────────────────────────────────────
// Used by: Activity Selection

export type ActivityState =
  | "idle"
  | "considering"
  | "selected"
  | "rejected"
  | "comparing";

export interface Activity {
  id: string;
  label: string;
  start: number;
  end: number;
  state: ActivityState;
}

export interface TimelineStep extends ProblemStepBase {
  kind: "timeline";
  activities: Activity[];
  timeRange: [number, number];
  lastSelectedEnd?: number;
}

// ── Array / Number ────────────────────────────────────────────────────────────
// Used by: Karatsuba (operands, partial products), CRT

export type ArrayCellState =
  | "idle"
  | "active"
  | "highlight"
  | "result"
  | "split";

export interface ArrayStep extends ProblemStepBase {
  kind: "array";
  /** Named rows of numbers, e.g. { x: [...], y: [...], product: [...] } */
  rows: { label: string; values: { val: string; state: ArrayCellState }[] }[];
  /** Extra equations or working shown below */
  equations?: string[];
}

// ── Huffman ───────────────────────────────────────────────────────────────────
// Used by: Huffman Encoding

export type HuffmanNodeState = "idle" | "merging" | "done" | "highlight";

export interface HuffmanNode {
  id: string;
  char?: string; // leaf node character
  freq: number;
  state: HuffmanNodeState;
  left?: HuffmanNode;
  right?: HuffmanNode;
  code?: string; // assigned code (leaves only, after encoding)
}

export interface HuffmanStep extends ProblemStepBase {
  kind: "huffman";
  /** Priority queue state at this step */
  queue: HuffmanNode[];
  /** Tree root (built up over steps) */
  root?: HuffmanNode;
  /** Code table once encoding is complete */
  codeTable?: Record<string, string>;
}

// ── Discriminated union ───────────────────────────────────────────────────────

export type ProblemStep =
  | DPTableStep
  | RecursionTreeStep
  | GridStep
  | TimelineStep
  | ArrayStep
  | HuffmanStep;

// ── Problem metadata ──────────────────────────────────────────────────────────

export type ProblemParadigm =
  | "dp"
  | "backtracking"
  | "greedy"
  | "divide-conquer";

export type VisualizerKind = ProblemStep["kind"];
