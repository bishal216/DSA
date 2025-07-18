import { GraphData, Edge, MSTAlgorithmStep } from "@/algorithms/types/graph";
import { UnionFind } from "@/algorithms/utils/unionFind";

export function runKruskal(graphData: GraphData): MSTAlgorithmStep[] {
  const steps: MSTAlgorithmStep[] = [];
  const sortedEdges = [...graphData.edges].sort((a, b) => a.weight - b.weight);
  const mstEdges: Edge[] = [];
  const rejectedEdges: Edge[] = [];
  const nodeIds = graphData.nodes.map((n) => n.id);
  const uf = new UnionFind(nodeIds);

  // Initial step
  steps.push({
    stepType: "initial",
    mstEdges: [],
    currentEdge: null,
    rejectedEdges: [],
    description: "All edges are sorted by weight (lightest to heaviest)",
    subDescription: "Start with the smallest unchecked edge.",
    remainingEdges: [...sortedEdges],
    visitedNodes: [],
  });

  for (const [index, edge] of sortedEdges.entries()) {
    const remainingEdges = sortedEdges.slice(index + 1);
    const fromRoot = uf.find(edge.from);
    const toRoot = uf.find(edge.to);

    // Step 1: Checking the edge
    steps.push({
      stepType: "check",
      mstEdges: [...mstEdges],
      currentEdge: edge,
      rejectedEdges: [...rejectedEdges],
      description: `Edge ${edge.from}-${edge.to} (weight ${edge.weight})`,
      subDescription: "Checking if this edge will create a cycle.",
      remainingEdges,
      visitedNodes: [...new Set(mstEdges.flatMap((e) => [e.from, e.to]))],
    });

    const willCreateCycle = fromRoot === toRoot;

    // Step 2: Decision
    if (!willCreateCycle) {
      uf.union(edge.from, edge.to);
      mstEdges.push(edge);
      steps.push({
        stepType: "decision",
        mstEdges: [...mstEdges],
        currentEdge: edge,
        currentEdgeAccepted: true,
        rejectedEdges: [...rejectedEdges],
        description: "Doesn't create a cycle",
        subDescription: `Edge ${edge.from}-${edge.to} added to MST.`,
        remainingEdges,
        visitedNodes: [...new Set(mstEdges.flatMap((e) => [e.from, e.to]))],
      });
    } else {
      rejectedEdges.push(edge);
      steps.push({
        stepType: "decision",
        mstEdges: [...mstEdges],
        currentEdge: edge,
        currentEdgeAccepted: false,
        rejectedEdges: [...rejectedEdges],
        description: `Edge ${edge.from}-${edge.to} would create a cycle.`,
        subDescription: `Rejected edge`,
        remainingEdges,
        visitedNodes: [...new Set(mstEdges.flatMap((e) => [e.from, e.to]))],
      });
    }

    // Step 3: Summary after each edge
    steps.push({
      stepType: "summary",
      mstEdges: [...mstEdges],
      currentEdge: null,
      rejectedEdges: [...rejectedEdges],
      description: `Progress: ${mstEdges.length} edges | Total weight: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}`,
      subDescription: `Rejected edges: ${rejectedEdges.length}`,
      remainingEdges,
      visitedNodes: [...new Set(mstEdges.flatMap((e) => [e.from, e.to]))],
    });
  }

  // Final step
  steps.push({
    stepType: "complete",
    mstEdges: [...mstEdges],
    currentEdge: null,
    rejectedEdges: [...rejectedEdges],
    description: `MST Complete: ${mstEdges.length} edges | Total weight: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}`,
    subDescription: `Rejected edges: ${rejectedEdges.length}`,
    remainingEdges: [],
    visitedNodes: [...new Set(mstEdges.flatMap((e) => [e.from, e.to]))],
  });

  return steps;
}
