import {
  GraphData,
  Node,
  Edge,
  MSTAlgorithmStep,
} from "@/algorithms/types/graph";

export function runPrim(
  graphData: GraphData,
  startNode: Node = graphData.nodes[0],
): MSTAlgorithmStep[] {
  const steps: MSTAlgorithmStep[] = [];
  const mstEdges: Edge[] = [];
  const rejectedEdges: Edge[] = [];
  const visitedNodes = new Set<string>();

  if (graphData.nodes.length === 0) return steps;

  visitedNodes.add(startNode.id);

  // Initial step
  steps.push({
    stepType: "initial",
    mstEdges: [],
    currentEdge: null,
    rejectedEdges: [],
    visitedNodes: [...visitedNodes],
    description: `Starting Prim's algorithm at node ${startNode}.`,
    subDescription: "Start from the first node",
    frontierEdges: [],
  });

  const usedEdges = new Set<string>();

  while (visitedNodes.size < graphData.nodes.length) {
    let minEdge: Edge | null = null;
    let minWeight = Infinity;
    const candidateEdges: Edge[] = [];

    for (const edge of graphData.edges) {
      const fromVisited = visitedNodes.has(edge.from);
      const toVisited = visitedNodes.has(edge.to);
      const edgeUsed = usedEdges.has(edge.id);

      if (
        !edgeUsed &&
        ((fromVisited && !toVisited) || (!fromVisited && toVisited))
      ) {
        candidateEdges.push(edge);
        if (edge.weight < minWeight) {
          minWeight = edge.weight;
          minEdge = edge;
        }
      }
    }

    // Check step
    steps.push({
      stepType: "check",
      mstEdges: [...mstEdges],
      currentEdge: null,
      rejectedEdges: [...rejectedEdges],
      visitedNodes: [...visitedNodes],
      description:
        candidateEdges.length > 0
          ? `Checking ${candidateEdges.length} candidate edges .`
          : `No more candidate edges found.`,
      subDescription: `Candidate edges are the edges connecting visited nodes to unvisited nodes.`,
      frontierEdges: candidateEdges,
    });

    // Disconnected graph
    if (!minEdge) {
      steps.push({
        stepType: "decision",
        mstEdges: [...mstEdges],
        currentEdge: null,
        rejectedEdges: [...rejectedEdges],
        visitedNodes: [...visitedNodes],
        description: "No edge connects to an unvisited node.",
        subDescription:
          "The graph is disconnected, and a complete MST cannot be formed.",
        frontierEdges: [],
      });
      break;
    }

    const newNode = visitedNodes.has(minEdge.from) ? minEdge.to : minEdge.from;

    visitedNodes.add(newNode);
    usedEdges.add(minEdge.id);
    mstEdges.push(minEdge);

    // Decision step
    steps.push({
      stepType: "decision",
      mstEdges: [...mstEdges],
      currentEdge: minEdge,
      rejectedEdges: [...rejectedEdges],
      visitedNodes: [...visitedNodes],
      description: `Edge ${minEdge?.from}-${minEdge?.to} with minimum weight ${minEdge?.weight} added to MST.`,
      subDescription: `This edge expands the MST by connecting new node ${newNode}`,
      frontierEdges: [],
    });

    // Summary step
    steps.push({
      stepType: "summary",
      mstEdges: [...mstEdges],
      currentEdge: null,
      rejectedEdges: [...rejectedEdges],
      visitedNodes: [...visitedNodes],
      description: `Progress: MST edges: ${mstEdges.length}\n• Total MST weight: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}`,
      subDescription: `Visited nodes: ${[...visitedNodes].join(", ")}\n `,
    });
  }

  // Final step
  steps.push({
    stepType: "complete",
    mstEdges: [...mstEdges],
    currentEdge: null,
    rejectedEdges: [...rejectedEdges],
    visitedNodes: [...visitedNodes],
    description: `MST Complete : Final MST includes ${mstEdges.length} edges `,
    subDescription: `Total weight: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}`,
    frontierEdges: [],
  });

  return steps;
}
