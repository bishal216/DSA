// src/algorithms/utils/graph-algorithms/mst-algorithms/kruskal.ts

import type {
  Edge,
  GraphData,
  GraphStep,
  MSTStepMetadata,
} from "@/algorithms/types/graph";
import type { GraphAlgorithmDefinition } from "@/algorithms/types/graph-algorithms-registry";
import { UnionFind } from "@/algorithms/utils/unionFind";

function buildStep(
  stepType: GraphStep["stepType"],
  message: string,
  subMessage: string,
  mstEdges: Edge[],
  rejectedEdges: Edge[],
  currentEdge: Edge | null,
  remainingEdges: Edge[],
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep["nodeStates"] = {};
  const edgeStates: GraphStep["edgeStates"] = {};

  for (const e of mstEdges) {
    edgeStates[e.id] = "tree";
    nodeStates[e.from] ??= "visited";
    nodeStates[e.to] ??= "visited";
  }
  for (const e of rejectedEdges) {
    edgeStates[e.id] = "rejected";
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

function kruskal(graphData: GraphData): GraphStep[] {
  const steps: GraphStep[] = [];
  const sorted = [...graphData.edges].sort((a, b) => a.weight - b.weight);
  const mstEdges: Edge[] = [];
  const rejectedEdges: Edge[] = [];
  const uf = new UnionFind(graphData.nodes.map((n) => n.id));

  steps.push(
    buildStep(
      "initial",
      "Edges sorted by weight — lightest to heaviest",
      "Greedily pick the smallest edge that does not create a cycle.",
      mstEdges,
      rejectedEdges,
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
        `Checking edge ${edge.from}–${edge.to} (weight ${edge.weight})`,
        "Will adding this edge create a cycle?",
        mstEdges,
        rejectedEdges,
        edge,
        remaining,
      ),
    );

    const willCycle = uf.find(edge.from) === uf.find(edge.to);

    if (!willCycle) {
      uf.union(edge.from, edge.to);
      mstEdges.push(edge);
      steps.push(
        buildStep(
          "decision",
          `Added ${edge.from}–${edge.to} — no cycle created`,
          `MST edges: ${mstEdges.length}`,
          mstEdges,
          rejectedEdges,
          edge,
          remaining,
          true,
        ),
      );
    } else {
      rejectedEdges.push(edge);
      steps.push(
        buildStep(
          "decision",
          `Rejected ${edge.from}–${edge.to} — would create a cycle`,
          `Rejected edges: ${rejectedEdges.length}`,
          mstEdges,
          rejectedEdges,
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
        `${mstEdges.length} accepted, ${rejectedEdges.length} rejected`,
        mstEdges,
        rejectedEdges,
        null,
        remaining,
      ),
    );
  }

  steps.push(
    buildStep(
      "complete",
      `MST complete — ${mstEdges.length} edges, total weight ${mstEdges.reduce((s, e) => s + e.weight, 0)}`,
      `${rejectedEdges.length} edges rejected`,
      mstEdges,
      rejectedEdges,
      null,
      [],
      true,
    ),
  );

  return steps;
}

export const definition: GraphAlgorithmDefinition = {
  key: "kruskal",
  name: "Kruskal's Algorithm",
  category: "mst",
  func: kruskal,
};
