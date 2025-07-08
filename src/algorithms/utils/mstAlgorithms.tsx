import { GraphData, Edge, MSTAlgorithmStep } from "@/algorithms/types/graph";
import { UnionFind } from "@/algorithms/utils/unionFind";
export function runKruskal(graphData: GraphData): MSTAlgorithmStep[] {
  const steps: MSTAlgorithmStep[] = [];
  const sortedEdges = [...graphData.edges].sort((a, b) => a.weight - b.weight);
  const mstEdges: Edge[] = [];
  const rejectedEdges: Edge[] = [];
  const remainingEdges = [...sortedEdges];

  const nodeIds = graphData.nodes.map((n) => n.id);
  const uf = new UnionFind(nodeIds);

  steps.push({
    mstEdges: [],
    currentEdge: null,
    rejectedEdges: [],
    description:
      "Kruskal's Algorithm Start: All edges sorted by weight. Initialize Union-Find to detect cycles.",
    components: uf.getComponents(),
    remainingEdges: [...remainingEdges],
  });

  for (const edge of sortedEdges) {
    remainingEdges.splice(
      remainingEdges.findIndex((e) => e.id === edge.id),
      1,
    );
    const rootFrom = uf.find(edge.from);
    const rootTo = uf.find(edge.to);

    const canAdd = uf.union(edge.from, edge.to);

    if (canAdd) {
      mstEdges.push(edge);
      steps.push({
        mstEdges: [...mstEdges],
        currentEdge: edge,
        currentEdgeAccepted: true,
        rejectedEdges: [...rejectedEdges],
        description:
          `Edge ${edge.from}-${edge.to} (weight: ${edge.weight}) added.\n` +
          `No cycle: ${edge.from} in '${rootFrom}', ${edge.to} in '${rootTo}'.`,
        components: uf.getComponents(),
        remainingEdges: [...remainingEdges],
      });
    } else {
      rejectedEdges.push(edge);
      steps.push({
        mstEdges: [...mstEdges],
        currentEdge: edge,
        currentEdgeAccepted: false,
        rejectedEdges: [...rejectedEdges],
        description:
          `Edge ${edge.from}-${edge.to} (weight: ${edge.weight}) rejected.\n` +
          `Cycle detected: ${edge.from} and ${edge.to} already in '${rootFrom}'.`,
        components: uf.getComponents(),
        remainingEdges: [...remainingEdges],
      });
    }
  }

  steps.push({
    mstEdges: [...mstEdges],
    currentEdge: null,
    rejectedEdges: [...rejectedEdges],
    description: `Kruskal's Algorithm Complete.\nTotal MST edges: ${mstEdges.length}, Rejected: ${rejectedEdges.length}.`,
    components: uf.getComponents(),
    remainingEdges: [],
  });

  return steps;
}

export function runPrim(graphData: GraphData): MSTAlgorithmStep[] {
  const steps: MSTAlgorithmStep[] = [];
  const mstEdges: Edge[] = [];
  const rejectedEdges: Edge[] = [];
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
    mstEdges.push(minEdge);

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
