// src/algorithms/utils/graph-algorithms/mst-algorithms/reverseDelete.ts

import type {
  Edge,
  GraphData,
  GraphStep,
  MSTStepMetadata,
} from "@/algorithms/types/graph";
import type { GraphAlgorithmDefinition } from "@/algorithms/types/graph-algorithms-registry";
import { UnionFind } from "@/algorithms/utils/unionFind";

function isConnected(edges: Edge[], nodeIds: string[]): boolean {
  if (nodeIds.length === 0) return true;
  const uf = new UnionFind(nodeIds);
  for (const e of edges) uf.union(e.from, e.to);
  return nodeIds.every((id) => uf.find(id) === uf.find(nodeIds[0]));
}

function buildStep(
  stepType: GraphStep["stepType"],
  message: string,
  subMessage: string,
  mstEdges: Edge[],
  removedEdges: Edge[],
  currentEdge: Edge | null,
  remainingEdges: Edge[],
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep["nodeStates"] = {};
  const edgeStates: GraphStep["edgeStates"] = {};

  for (const e of mstEdges) {
    edgeStates[e.id] = "tree";
    if (!nodeStates[e.from]) nodeStates[e.from] = "visited";
    if (!nodeStates[e.to]) nodeStates[e.to] = "visited";
  }
  for (const e of removedEdges) edgeStates[e.id] = "rejected";
  if (currentEdge) {
    edgeStates[currentEdge.id] = "current";
    nodeStates[currentEdge.from] = "current";
    nodeStates[currentEdge.to] = "current";
  }

  const metadata: MSTStepMetadata = {
    mstEdges: [...mstEdges],
    rejectedEdges: [...removedEdges],
    totalWeight: mstEdges.reduce((s, e) => s + e.weight, 0),
    remainingEdges: [...remainingEdges],
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

function reverseDelete(graphData: GraphData): GraphStep[] {
  const steps: GraphStep[] = [];
  const sorted = [...graphData.edges].sort((a, b) => b.weight - a.weight);
  const mstEdges: Edge[] = [...graphData.edges];
  const removedEdges: Edge[] = [];
  const nodeIds = graphData.nodes.map((n) => n.id);

  steps.push(
    buildStep(
      "initial",
      "Start with all edges — remove heaviest ones that don't disconnect the graph",
      "Edges will be considered heaviest first.",
      mstEdges,
      removedEdges,
      null,
      sorted,
      true,
    ),
  );

  for (const [i, edge] of sorted.entries()) {
    const remaining = sorted.slice(i + 1);

    steps.push(
      buildStep(
        "check",
        `Considering removal of ${edge.from}-${edge.to} (weight ${edge.weight})`,
        "Would removing this edge disconnect the graph?",
        mstEdges,
        removedEdges,
        edge,
        remaining,
      ),
    );

    const tempEdges = mstEdges.filter((e) => e.id !== edge.id);
    const stillConnected = isConnected(tempEdges, nodeIds);

    if (stillConnected) {
      const idx = mstEdges.findIndex((e) => e.id === edge.id);
      mstEdges.splice(idx, 1);
      removedEdges.push(edge);
      steps.push(
        buildStep(
          "decision",
          `Removed ${edge.from}-${edge.to} — graph stays connected`,
          `${removedEdges.length} edge${removedEdges.length !== 1 ? "s" : ""} removed so far`,
          mstEdges,
          removedEdges,
          edge,
          remaining,
          true,
        ),
      );
    } else {
      steps.push(
        buildStep(
          "decision",
          `Kept ${edge.from}-${edge.to} — removal would disconnect the graph`,
          `This edge is a bridge — it must stay in the MST`,
          mstEdges,
          removedEdges,
          edge,
          remaining,
          true,
        ),
      );
    }

    steps.push(
      buildStep(
        "summary",
        `Weight so far: ${mstEdges.reduce((s, e) => s + e.weight, 0)}`,
        `${mstEdges.length} edges kept, ${removedEdges.length} removed`,
        mstEdges,
        removedEdges,
        null,
        remaining,
      ),
    );
  }

  steps.push(
    buildStep(
      "complete",
      `MST complete — ${mstEdges.length} edges, total weight ${mstEdges.reduce((s, e) => s + e.weight, 0)}`,
      `${removedEdges.length} edges removed`,
      mstEdges,
      removedEdges,
      null,
      [],
      true,
    ),
  );

  return steps;
}

export const definition: GraphAlgorithmDefinition = {
  key: "reverseDelete",
  name: "Reverse Delete Algorithm",
  category: "mst",
  func: reverseDelete,
};
