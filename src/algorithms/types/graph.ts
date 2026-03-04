// src/algorithms/types/graph.ts

// ── Primitives ────────────────────────────────────────────────────────────────

export interface Node {
  id: string;
  x: number;
  y: number;
  label: string;
}

export interface Edge {
  id: string;
  from: string;
  to: string;
  weight: number;
}

export interface GraphData {
  nodes: Node[];
  edges: Edge[];
}

// ── Canvas state maps ─────────────────────────────────────────────────────────

export type NodeState =
  | "default"
  | "visited"
  | "current"
  | "candidate"
  | "rejected"
  | "component"; // SCC — same component coloring

export type EdgeState =
  | "default"
  | "tree" // in MST / spanning tree
  | "current" // being examined this step
  | "candidate" // frontier / considered
  | "rejected" // explicitly discarded
  | "back" // DFS back edge
  | "cross" // DFS cross edge
  | "forward"; // DFS forward edge

// ── Step metadata (family-specific, read by StepDisplay) ─────────────────────

export interface MSTStepMetadata {
  mstEdges: Edge[];
  rejectedEdges: Edge[];
  totalWeight: number;
  remainingEdges?: Edge[]; // Kruskal / Reverse Delete
  frontierEdges?: Edge[]; // Prim
  components?: Record<string, string[]>; // Borůvka — root → member nodes
  boruvkaRound?: number;
}

export interface PathfindingStepMetadata {
  distances: Record<string, number>;
  previous: Record<string, string | null>;
  path: string[]; // reconstructed path so far
  frontier: string[]; // nodes in the queue/heap
}

export interface SCCStepMetadata {
  discoveryTime: Record<string, number>;
  finishTime: Record<string, number>;
  components: string[][]; // each inner array is one SCC
  stack: string[]; // Tarjan / Kosaraju stack
  componentIndex: Record<string, number>; // nodeId 2192 component number (for coloring)
}

export interface TraversalStepMetadata {
  order: string[]; // visit order so far
  stack: string[]; // DFS stack
  queue: string[]; // BFS queue
}

export type GraphStepMetadata =
  | MSTStepMetadata
  | PathfindingStepMetadata
  | SCCStepMetadata
  | TraversalStepMetadata;

// ── Step type unions ──────────────────────────────────────────────────────────

export type GraphStepType =
  // shared
  | "initial"
  | "complete"
  | "summary"
  // MST
  | "check"
  | "decision"
  // pathfinding
  | "explore"
  | "visit"
  | "path"
  // SCC / traversal
  | "discover"
  | "finish"
  | "scc"
  // generic
  | "process";

// ── Core step type ────────────────────────────────────────────────────────────

export interface GraphStep {
  stepType: GraphStepType;
  message: string;
  subMessage?: string;
  isMajorStep?: boolean;

  // Canvas reads only these — no algorithm-specific props on canvas
  nodeStates: Record<string, NodeState>;
  edgeStates: Record<string, EdgeState>;

  // Family-specific data for StepDisplay — canvas never reads this
  metadata: GraphStepMetadata;
}

// ── Algorithm options (per-algorithm params beyond the graph) ─────────────────

export interface GraphAlgorithmOptions {
  startNodeId?: string;
  endNodeId?: string;
}

// ── Component prop interfaces ─────────────────────────────────────────────────

export interface GraphCanvasProps {
  graph: GraphData;
  nodeStates: Record<string, NodeState>;
  edgeStates: Record<string, EdgeState>;
  onNodeMove: (nodeId: string, x: number, y: number) => void;
  directed?: boolean;
}
