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
      "We begin Kruskal's Algorithm by sorting all edges in order of weight (from lightest to heaviest). We also initialize a Union-Find structure to keep track of which nodes are connected. This will help us avoid cycles.",
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
          `We examine edge ${edge.from} → ${edge.to} (weight: ${edge.weight}).\n` +
          `Since ${edge.from} and ${edge.to} are in **different components** (` +
          `${rootFrom} and ${rootTo}), adding this edge will not form a cycle.\n\n` +
          `So we add it to the MST and merge the components.`,
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
          `We examine edge ${edge.from} → ${edge.to} (weight: ${edge.weight}).\n` +
          `But both ${edge.from} and ${edge.to} already belong to the same component (${rootFrom}).\n\n` +
          `Adding this edge would create a cycle — so we reject it.`,
        components: uf.getComponents(),
        remainingEdges: [...remainingEdges],
      });
    }
  }

  steps.push({
    mstEdges: [...mstEdges],
    currentEdge: null,
    rejectedEdges: [...rejectedEdges],
    description:
      `Kruskal's Algorithm is now complete. We have selected ${mstEdges.length} edges that form a Minimum Spanning Tree (MST) without any cycles.\n` +
      `We rejected ${rejectedEdges.length} edges that would have created cycles.`,
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
    visitedNodes: [...visitedNodes],
    description: `We start Prim's algorithm at node ${startNode}. This will be the first node in our growing Minimum Spanning Tree (MST).`,
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
        visitedNodes: [...visitedNodes],
        description:
          "We couldn't find any more edges that connect to unvisited nodes. This means the graph is disconnected, so we can't complete a full MST.",
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
      visitedNodes: [...visitedNodes],
      description: `We add edge ${minEdge.from}-${minEdge.to} (weight: ${minEdge.weight}) to the MST.\n\nThis is the lightest edge that connects any visited node to an unvisited one — expanding our tree by one node: ${newNode}.`,
    });
  }

  steps.push({
    mstEdges: [...mstEdges],
    currentEdge: null,
    rejectedEdges: [...rejectedEdges],
    visitedNodes: [...visitedNodes],
    description: `Prim's algorithm is complete!\n\nWe now have a Minimum Spanning Tree that connects all reachable nodes with ${mstEdges.length} edges.`,
  });

  return steps;
}
