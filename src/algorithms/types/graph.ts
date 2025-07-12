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

export interface GraphEditorProps {
  graphData: GraphData;
  addNode: () => void;
  addEdge: () => void;
  clearGraph: () => void;
  edgeFromNode: string;
  setEdgeFromNode: (value: string) => void;
  edgeToNode: string;
  setEdgeToNode: (value: string) => void;
  edgeWeight: string;
  setEdgeWeight: (value: string) => void;
  nodeCount: number;
  setNodeCount: (value: number) => void;
  edgeCount: number;
  setEdgeCount: (value: number) => void;
}

export interface AlgorithmOption {
  value: string;
  label: string;
}

export interface AlgorithmControlsProps {
  algorithms: AlgorithmOption[];
  selectedAlgorithm: string;
  setSelectedAlgorithm: (algorithm: string) => void;
  isPlaying: boolean;
  handlePlay: () => void;
  handleReset: () => void;
  handleStepForward: () => void;
  handleStepBackward: () => void;
  currentStep: number;
  totalSteps: number;
  isManual?: boolean; // optional: switch between manual/auto mode
  setIsManual?: (val: boolean) => void;
}

export interface GraphCanvasProps {
  graphData: GraphData;
  currentStep: MSTAlgorithmStep;
  onNodeMove: (nodeId: string, x: number, y: number) => void;
}

export interface MSTAlgorithmStep {
  stepType?: "initial" | "check" | "decision" | "summary" | "complete";
  description: string;
  currentEdge: Edge | null;
  currentEdgeAccepted?: boolean; // Indicates if the current edge was accepted or rejected
  mstEdges: Edge[];
  rejectedEdges: Edge[];

  remainingEdges?: Edge[]; // Remaining edges for Kruskal's algorithm
  visitedNodes?: string[]; // For Prim's algorithm, tracks visited nodes
  frontierEdges?: Edge[]; // For Prim's algorithm, tracks frontier edges
}
// ===============================================

export interface GraphAlgorithmStep {
  description: string;
  details?: string;
  nodeId?: string;
  edgeId?: string;
  nodes?: string[];
  state?: string;
  cycleFound?: boolean;
  cycleNodes?: string[];
}
