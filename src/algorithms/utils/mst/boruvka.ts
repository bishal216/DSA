import { GraphData, Edge, MSTAlgorithmStep } from "@/algorithms/types/graph";
import { UnionFind } from "@/algorithms/utils/unionFind";

export function runBoruvka(graphData: GraphData): MSTAlgorithmStep[] {
  const steps: MSTAlgorithmStep[] = [];
  const mstEdges: Edge[] = [];
  const nodeIds = graphData.nodes.map((n) => n.id);
  const uf = new UnionFind(nodeIds);
  let components = nodeIds.length;

  // Initial step
  steps.push({
    stepType: "initial",
    mstEdges: [],
    currentEdge: null,
    rejectedEdges: [],
    description: "Starting Borůvka's algorithm",
    subDescription: `Initial state with ${components} components (one per node).`,
    remainingEdges: [...graphData.edges],
    visitedNodes: [],
  });

  let iteration = 1;
  while (components > 1) {
    // Find cheapest edge for each component
    const cheapestEdges = new Map<string, Edge>();

    // Step 1: Find cheapest edges for each component
    steps.push({
      stepType: "check",
      mstEdges: [...mstEdges],
      currentEdge: null,
      rejectedEdges: [],
      description: `Iteration ${iteration}: Finding cheapest edges for each component`,
      subDescription: `Current components: ${components}`,
      remainingEdges: [...graphData.edges],
      visitedNodes: [],
    });

    for (const edge of graphData.edges) {
      const fromRoot = uf.find(edge.from);
      const toRoot = uf.find(edge.to);

      if (fromRoot !== toRoot) {
        // Check if this is the cheapest edge for either component
        if (
          !cheapestEdges.has(fromRoot) ||
          edge.weight < cheapestEdges.get(fromRoot)!.weight
        ) {
          cheapestEdges.set(fromRoot, edge);
        }

        if (
          !cheapestEdges.has(toRoot) ||
          edge.weight < cheapestEdges.get(toRoot)!.weight
        ) {
          cheapestEdges.set(toRoot, edge);
        }
      }
    }

    // Step 2: Add the cheapest edges
    const addedThisRound = new Set<string>();
    let edgesAdded = 0;

    for (const [component, edge] of cheapestEdges) {
      if (addedThisRound.has(edge.id)) continue;

      const fromRoot = uf.find(edge.from);
      const toRoot = uf.find(edge.to);

      if (fromRoot !== toRoot) {
        steps.push({
          stepType: "check",
          mstEdges: [...mstEdges],
          currentEdge: edge,
          rejectedEdges: [],
          description: `Considering edge ${edge.from}-${edge.to} (weight ${edge.weight}) for component ${component}`,
          subDescription: "Cheapest edge connecting this component to another",
          remainingEdges: [...graphData.edges],
          visitedNodes: [],
        });

        uf.union(edge.from, edge.to);
        mstEdges.push(edge);
        addedThisRound.add(edge.id);
        edgesAdded++;

        steps.push({
          stepType: "decision",
          mstEdges: [...mstEdges],
          currentEdge: edge,
          currentEdgeAccepted: true,
          rejectedEdges: [],
          description: `Added edge ${edge.from}-${edge.to} to MST`,
          subDescription: `Merged components ${fromRoot} and ${toRoot}`,
          remainingEdges: [...graphData.edges],
          visitedNodes: [],
        });
      }
    }

    // Step 3: Summary after each iteration
    const newComponents = nodeIds.filter((id) => uf.find(id) === id).length;
    components = newComponents;

    steps.push({
      stepType: "summary",
      mstEdges: [...mstEdges],
      currentEdge: null,
      rejectedEdges: [],
      description: `After iteration ${iteration}: ${edgesAdded} edges added`,
      subDescription: `Components reduced from ${components + edgesAdded} to ${components}`,
      remainingEdges: [...graphData.edges],
      visitedNodes: [],
    });

    iteration++;
  }

  // Final step
  steps.push({
    stepType: "complete",
    mstEdges: [...mstEdges],
    currentEdge: null,
    rejectedEdges: [],
    description: `MST Complete: ${mstEdges.length} edges | Total weight: ${mstEdges.reduce((sum, e) => sum + e.weight, 0)}`,
    subDescription: `All nodes connected in a single component`,
    remainingEdges: [],
    visitedNodes: [],
  });

  return steps;
}
