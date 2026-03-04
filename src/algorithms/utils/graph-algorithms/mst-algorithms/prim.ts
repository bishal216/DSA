// src/algorithms/utils/graph-algorithms/mst-algorithms/prim.ts

import type { GraphAlgorithmDefinition } from "@/algorithms/registry/graph-algorithms-registry";
import type {
  Edge,
  GraphAlgorithmOptions,
  GraphData,
  GraphStep,
  MSTStepMetadata,
} from "@/algorithms/types/graph";

function buildStep(
  stepType: GraphStep["stepType"],
  message: string,
  subMessage: string,
  mstEdges: Edge[],
  rejectedEdges: Edge[],
  currentEdge: Edge | null,
  visitedNodeIds: string[],
  frontierEdges: Edge[],
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep["nodeStates"] = {};
  const edgeStates: GraphStep["edgeStates"] = {};

  for (const id of visitedNodeIds) nodeStates[id] = "visited";
  for (const e of mstEdges) edgeStates[e.id] = "tree";
  for (const e of rejectedEdges) edgeStates[e.id] = "rejected";
  for (const e of frontierEdges) {
    edgeStates[e.id] ??= "candidate";
    nodeStates[e.from] ??= "candidate";
    nodeStates[e.to] ??= "candidate";
  }
  if (currentEdge) {
    edgeStates[currentEdge.id] = "current";
    nodeStates[currentEdge.from] = "current";
    nodeStates[currentEdge.to] = "current";
  }

  const metadata: MSTStepMetadata = {
    mstEdges: [...mstEdges],
    rejectedEdges: [...rejectedEdges],
    totalWeight: mstEdges.reduce((s, e) => s + e.weight, 0),
    frontierEdges: [...frontierEdges],
  };

  return {
    stepType,
    message,
    subMessage,
    isMajorStep,
    nodeStates,
    edgeStates,
    metadata,
  };
}

function prim(
  graphData: GraphData,
  options?: GraphAlgorithmOptions,
): GraphStep[] {
  const steps: GraphStep[] = [];
  const mstEdges: Edge[] = [];
  const rejectedEdges: Edge[] = [];

  if (graphData.nodes.length === 0) return steps;

  const startId = options?.startNodeId ?? graphData.nodes[0].id;
  const visited = new Set<string>([startId]);
  const usedEdgeIds = new Set<string>();

  steps.push(
    buildStep(
      "initial",
      `Starting at node ${startId}`,
      "Grow the MST by always picking the cheapest frontier edge.",
      mstEdges,
      rejectedEdges,
      null,
      [...visited],
      [],
      true,
    ),
  );

  while (visited.size < graphData.nodes.length) {
    const frontier: Edge[] = graphData.edges.filter((e) => {
      if (usedEdgeIds.has(e.id)) return false;
      const fromIn = visited.has(e.from);
      const toIn = visited.has(e.to);
      return (fromIn && !toIn) || (!fromIn && toIn);
    });

    steps.push(
      buildStep(
        "check",
        `${frontier.length} frontier edge${frontier.length !== 1 ? "s" : ""} available`,
        "Pick the minimum weight edge crossing the cut.",
        mstEdges,
        rejectedEdges,
        null,
        [...visited],
        frontier,
      ),
    );

    if (frontier.length === 0) {
      steps.push(
        buildStep(
          "complete",
          "Graph is disconnected — no spanning tree exists",
          "Some nodes are unreachable from the start node.",
          mstEdges,
          rejectedEdges,
          null,
          [...visited],
          [],
          true,
        ),
      );
      return steps;
    }

    const minEdge = frontier.reduce((min, e) =>
      e.weight < min.weight ? e : min,
    );
    const newNodeId = visited.has(minEdge.from) ? minEdge.to : minEdge.from;

    visited.add(newNodeId);
    usedEdgeIds.add(minEdge.id);
    mstEdges.push(minEdge);

    for (const e of frontier) {
      if (e.id !== minEdge.id) rejectedEdges.push(e);
    }

    steps.push(
      buildStep(
        "decision",
        `Added ${minEdge.from}–${minEdge.to} (weight ${minEdge.weight}) — reached node ${newNodeId}`,
        `Visited: ${[...visited].join(", ")}`,
        mstEdges,
        rejectedEdges,
        minEdge,
        [...visited],
        [],
        true,
      ),
    );

    steps.push(
      buildStep(
        "summary",
        `MST weight so far: ${mstEdges.reduce((s, e) => s + e.weight, 0)}`,
        `${visited.size} of ${graphData.nodes.length} nodes reached`,
        mstEdges,
        rejectedEdges,
        null,
        [...visited],
        [],
      ),
    );
  }

  steps.push(
    buildStep(
      "complete",
      `MST complete — ${mstEdges.length} edges, total weight ${mstEdges.reduce((s, e) => s + e.weight, 0)}`,
      `All ${graphData.nodes.length} nodes connected`,
      mstEdges,
      rejectedEdges,
      null,
      [...visited],
      [],
      true,
    ),
  );

  return steps;
}

export const definition: GraphAlgorithmDefinition = {
  key: "prim",
  name: "Prim's Algorithm",
  category: "mst",
  func: prim,
};
