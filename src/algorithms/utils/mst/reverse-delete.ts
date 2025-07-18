import { GraphData, Edge, MSTAlgorithmStep } from "@/algorithms/types/graph";
import { UnionFind } from "@/algorithms/utils/unionFind";

export function runReverseDelete(graphData: GraphData): MSTAlgorithmStep[] {
  const steps: MSTAlgorithmStep[] = [];
  const sortedEdges = [...graphData.edges].sort((a, b) => b.weight - a.weight); // Sort descending
  const mstEdges: Edge[] = [...graphData.edges]; // Start with all edges
  const rejectedEdges: Edge[] = [];
  const nodeIds = graphData.nodes.map((n) => n.id);

  // Initial step
  steps.push({
    stepType: "initial",
    mstEdges: [...mstEdges],
    currentEdge: null,
    rejectedEdges: [],
    description: "All edges sorted by weight (heaviest to lightest)",
    subDescription: "Start by considering removing the heaviest edge first.",
    remainingEdges: [...sortedEdges],
    visitedNodes: [],
  });

  for (const [index, edge] of sortedEdges.entries()) {
    const remainingEdges = sortedEdges.slice(index + 1);
    const currentMstEdges = [...mstEdges];
    const currentRejectedEdges = [...rejectedEdges];

    // Step 1: Checking the edge
    steps.push({
      stepType: "check",
      mstEdges: currentMstEdges,
      currentEdge: edge,
      rejectedEdges: currentRejectedEdges,
      description: `Considering edge ${edge.from}-${edge.to} (weight ${edge.weight})`,
      subDescription:
        "Checking if removing this edge would disconnect the graph.",
      remainingEdges,
      visitedNodes: [],
    });

    // Temporarily remove the edge
    const tempMstEdges = mstEdges.filter((e) => e.id !== edge.id);

    // Check if graph remains connected
    const uf = new UnionFind(nodeIds);
    tempMstEdges.forEach((e) => uf.union(e.from, e.to));
    const isConnected = nodeIds.every(
      (id) => uf.find(id) === uf.find(nodeIds[0]),
    );

    // Step 2: Decision
    if (isConnected) {
      // Remove the edge from MST
      mstEdges.splice(
        mstEdges.findIndex((e) => e.id === edge.id),
        1,
      );
      rejectedEdges.push(edge);

      steps.push({
        stepType: "decision",
        mstEdges: [...mstEdges],
        currentEdge: edge,
        currentEdgeAccepted: false,
        rejectedEdges: [...rejectedEdges],
        description: "Removal doesn't disconnect the graph",
        subDescription: `Edge ${edge.from}-${edge.to} removed from MST.`,
        remainingEdges,
        visitedNodes: [],
      });
    } else {
      steps.push({
        stepType: "decision",
        mstEdges: [...mstEdges],
        currentEdge: edge,
        currentEdgeAccepted: true,
        rejectedEdges: [...rejectedEdges],
        description: "Removal would disconnect the graph",
        subDescription: `Edge ${edge.from}-${edge.to} must stay in MST.`,
        remainingEdges,
        visitedNodes: [],
      });
    }

    // Step 3: Summary after each edge
    steps.push({
      stepType: "summary",
      mstEdges: [...mstEdges],
      currentEdge: null,
      rejectedEdges: [...rejectedEdges],
      description: `Progress: ${mstEdges.length} edges remaining | Total weight: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}`,
      subDescription: `Removed edges: ${rejectedEdges.length}`,
      remainingEdges,
      visitedNodes: [],
    });
  }

  // Final step
  steps.push({
    stepType: "complete",
    mstEdges: [...mstEdges],
    currentEdge: null,
    rejectedEdges: [...rejectedEdges],
    description: `MST Complete: ${mstEdges.length} edges | Total weight: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}`,
    subDescription: `Removed edges: ${rejectedEdges.length}`,
    remainingEdges: [],
    visitedNodes: [],
  });

  return steps;
}
