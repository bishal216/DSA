import { GraphData, Edge, AlgorithmStep } from "@/algorithms/types/graph";

// Union-Find data structure for Kruskal's algorithm
class UnionFind {
  private parent: { [key: string]: string } = {};
  private rank: { [key: string]: number } = {};

  constructor(nodes: string[]) {
    nodes.forEach((node) => {
      this.parent[node] = node;
      this.rank[node] = 0;
    });
  }

  find(x: string): string {
    if (this.parent[x] !== x) {
      this.parent[x] = this.find(this.parent[x]);
    }
    return this.parent[x];
  }

  union(x: string, y: string): boolean {
    const rootX = this.find(x);
    const rootY = this.find(y);

    if (rootX === rootY) return false;

    if (this.rank[rootX] < this.rank[rootY]) {
      this.parent[rootX] = rootY;
    } else if (this.rank[rootX] > this.rank[rootY]) {
      this.parent[rootY] = rootX;
    } else {
      this.parent[rootY] = rootX;
      this.rank[rootX]++;
    }
    return true;
  }
}

export function runKruskal(graphData: GraphData): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const sortedEdges = [...graphData.edges].sort((a, b) => a.weight - b.weight);
  const mstEdges: string[] = [];
  const rejectedEdges: string[] = [];
  const nodeIds = graphData.nodes.map((n) => n.id);
  const uf = new UnionFind(nodeIds);

  // Initial step
  steps.push({
    mstEdges: [],
    currentEdge: null,
    rejectedEdges: [],
    description:
      "Kruskal's algorithm: Sort all edges by weight and process them one by one.",
  });

  sortedEdges.forEach((edge) => {
    const canAdd = uf.union(edge.from, edge.to);

    if (canAdd) {
      mstEdges.push(edge.id);
      steps.push({
        mstEdges: [...mstEdges],
        currentEdge: edge,
        rejectedEdges: [...rejectedEdges],
        description: `Added edge ${edge.from}-${edge.to} (weight: ${edge.weight}) to MST. No cycle formed.`,
      });
    } else {
      rejectedEdges.push(edge.id);
      steps.push({
        mstEdges: [...mstEdges],
        currentEdge: edge,
        rejectedEdges: [...rejectedEdges],
        description: `Rejected edge ${edge.from}-${edge.to} (weight: ${edge.weight}). Would create a cycle.`,
      });
    }
  });

  // Final step
  steps.push({
    mstEdges: [...mstEdges],
    currentEdge: null,
    rejectedEdges: [...rejectedEdges],
    description: `Kruskal's algorithm complete! MST has ${mstEdges.length} edges.`,
  });

  return steps;
}

export function runPrim(graphData: GraphData): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const mstEdges: string[] = [];
  const rejectedEdges: string[] = [];
  const visitedNodes = new Set<string>();

  if (graphData.nodes.length === 0) return steps;

  const startNode = graphData.nodes[0].id;
  visitedNodes.add(startNode);

  steps.push({
    mstEdges: [],
    currentEdge: null,
    rejectedEdges: [],
    description: `Prim's algorithm: Starting from node ${startNode}.`,
  });

  const usedEdges = new Set<string>();

  while (visitedNodes.size < graphData.nodes.length) {
    let minEdge: Edge | null = null;
    let minWeight = Infinity;

    for (const edge of graphData.edges) {
      const fromVisited = visitedNodes.has(edge.from);
      const toVisited = visitedNodes.has(edge.to);
      const edgeUsed = usedEdges.has(edge.id);

      if (
        !edgeUsed &&
        ((fromVisited && !toVisited) || (!fromVisited && toVisited)) &&
        edge.weight < minWeight
      ) {
        minWeight = edge.weight;
        minEdge = edge;
      }
    }

    if (!minEdge) {
      steps.push({
        mstEdges: [...mstEdges],
        currentEdge: null,
        rejectedEdges: [...rejectedEdges],
        description:
          "Graph is disconnected. Cannot find a connecting edge to expand MST.",
      });
      break;
    }

    const newNode = visitedNodes.has(minEdge.from) ? minEdge.to : minEdge.from;
    visitedNodes.add(newNode);
    usedEdges.add(minEdge.id);
    mstEdges.push(minEdge.id);

    steps.push({
      mstEdges: [...mstEdges],
      currentEdge: minEdge,
      rejectedEdges: [...rejectedEdges],
      description: `Added edge ${minEdge.from}-${minEdge.to} (weight: ${minEdge.weight}) to MST. Lightest edge connecting visited to unvisited node ${newNode}.`,
    });
  }

  steps.push({
    mstEdges: [...mstEdges],
    currentEdge: null,
    rejectedEdges: [...rejectedEdges],
    description: `Prim's algorithm complete! MST has ${mstEdges.length} edges.`,
  });

  return steps;
}
