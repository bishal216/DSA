// src/algorithms/utils/graph-algorithms/mst-algorithms/boruvka.ts

import type { GraphAlgorithmDefinition } from "@/algorithms/registry/graph-algorithms-registry";
import type {
  Edge,
  GraphData,
  GraphStep,
  MSTStepMetadata,
} from "@/algorithms/types/graph";
import { UnionFind } from "@/algorithms/utils/unionFind";

function buildStep(
  stepType: GraphStep["stepType"],
  message: string,
  subMessage: string,
  mstEdges: Edge[],
  currentEdge: Edge | null,
  componentEdges: Edge[],
  uf: UnionFind,
  boruvkaRound: number,
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep["nodeStates"] = {};
  const edgeStates: GraphStep["edgeStates"] = {};

  const components = uf.getComponents();
  const colorCycle: Array<GraphStep["nodeStates"][string]> = [
    "visited",
    "candidate",
    "current",
    "rejected",
    "component",
  ];
  Object.keys(components).forEach((root, i) => {
    const color = colorCycle[i % colorCycle.length];
    for (const nodeId of components[root]) nodeStates[nodeId] = color;
  });

  for (const e of mstEdges) edgeStates[e.id] = "tree";
  for (const e of componentEdges) {
    if (!edgeStates[e.id]) edgeStates[e.id] = "candidate";
  }
  if (currentEdge) edgeStates[currentEdge.id] = "current";

  const metadata: MSTStepMetadata = {
    mstEdges: [...mstEdges],
    rejectedEdges: [],
    totalWeight: mstEdges.reduce((s, e) => s + e.weight, 0),
    components: uf.getComponents(),
    componentEdges: [...componentEdges],
    boruvkaRound,
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

function boruvka(graphData: GraphData): GraphStep[] {
  const steps: GraphStep[] = [];
  const mstEdges: Edge[] = [];
  const nodeIds = graphData.nodes.map((n) => n.id);
  const uf = new UnionFind(nodeIds);
  let round = 1;

  steps.push(
    buildStep(
      "initial",
      `Starting with ${nodeIds.length} components — one per node`,
      "Each round finds the cheapest outgoing edge per component and merges them.",
      mstEdges,
      null,
      [],
      uf,
      round,
      true,
    ),
  );

  while (true) {
    const components = uf.getComponents();
    const numComponents = Object.keys(components).length;
    if (numComponents <= 1) break;

    const cheapest = new Map<string, Edge>();
    for (const edge of graphData.edges) {
      const rFrom = uf.find(edge.from);
      const rTo = uf.find(edge.to);
      if (rFrom === rTo) continue;
      if (!cheapest.has(rFrom) || edge.weight < cheapest.get(rFrom)!.weight)
        cheapest.set(rFrom, edge);
      if (!cheapest.has(rTo) || edge.weight < cheapest.get(rTo)!.weight)
        cheapest.set(rTo, edge);
    }

    const componentEdges = [
      ...new Map([...cheapest].map(([, e]) => [e.id, e])).values(),
    ];

    steps.push(
      buildStep(
        "check",
        `Round ${round}: cheapest edge found for each of ${numComponents} components`,
        "Will merge components connected by these edges.",
        mstEdges,
        null,
        componentEdges,
        uf,
        round,
        true,
      ),
    );

    if (componentEdges.length === 0) break;

    const prevComponents = numComponents;
    const addedThisRound = new Set<string>();

    for (const edge of componentEdges) {
      if (addedThisRound.has(edge.id)) continue;
      if (uf.find(edge.from) === uf.find(edge.to)) continue;

      steps.push(
        buildStep(
          "decision",
          `Adding ${edge.from}-${edge.to} (weight ${edge.weight})`,
          `Merging components containing ${edge.from} and ${edge.to}`,
          mstEdges,
          edge,
          componentEdges,
          uf,
          round,
        ),
      );

      uf.union(edge.from, edge.to);
      mstEdges.push(edge);
      addedThisRound.add(edge.id);
    }

    const newComponents = Object.keys(uf.getComponents()).length;
    steps.push(
      buildStep(
        "summary",
        `Round ${round} complete — ${prevComponents} components merged into ${newComponents}`,
        `MST weight so far: ${mstEdges.reduce((s, e) => s + e.weight, 0)}`,
        mstEdges,
        null,
        [],
        uf,
        round,
        true,
      ),
    );

    round++;
  }

  steps.push(
    buildStep(
      "complete",
      `MST complete — ${mstEdges.length} edges, total weight ${mstEdges.reduce((s, e) => s + e.weight, 0)}`,
      `Completed in ${round - 1} round${round - 1 !== 1 ? "s" : ""}`,
      mstEdges,
      null,
      [],
      uf,
      round,
      true,
    ),
  );

  return steps;
}

export const definition: GraphAlgorithmDefinition = {
  key: "boruvka",
  name: "Boruvka's Algorithm",
  category: "mst",
  func: boruvka,
};
