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

export interface AlgorithmStep {
  mstEdges: string[];
  currentEdge: Edge | null;
  rejectedEdges: string[];
  description: string;
}

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
