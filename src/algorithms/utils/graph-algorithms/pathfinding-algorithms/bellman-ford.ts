// src/algorithms/utils/graph-algorithms/pathfinding-algorithms/bellmanFord.ts

import type { GraphAlgorithmDefinition } from "@/algorithms/registry/graph-algorithms-registry";
import type {
  GraphAlgorithmOptions,
  GraphData,
  GraphStep,
  PathfindingStepMetadata,
} from "@/algorithms/types/graph";

const INF = Infinity;

function buildStep(
  stepType: GraphStep["stepType"],
  message: string,
  subMessage: string,
  currentEdgeFromId: string | null,
  currentEdgeToId: string | null,
  relaxedNodes: Set<string>,
  distances: Record<string, number>,
  previous: Record<string, string | null>,
  path: string[],
  pathEdgeIds: Set<string>,
  graph: GraphData,
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep["nodeStates"] = {};
  const edgeStates: GraphStep["edgeStates"] = {};

  for (const n of graph.nodes) {
    nodeStates[n.id] = distances[n.id] < INF ? "visited" : "default";
  }
  for (const id of relaxedNodes) nodeStates[id] = "candidate";
  if (currentEdgeFromId) nodeStates[currentEdgeFromId] = "current";
  if (currentEdgeToId) nodeStates[currentEdgeToId] = "current";
  for (const id of path) {
    if (nodeStates[id] !== "current") nodeStates[id] = "visited";
  }
  for (const edge of graph.edges) {
    if (pathEdgeIds.has(edge.id)) edgeStates[edge.id] = "tree";
  }

  const metadata: PathfindingStepMetadata = {
    distances: { ...distances },
    previous: { ...previous },
    path: [...path],
    frontier: [...relaxedNodes],
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

function bellmanFord(
  graphData: GraphData,
  options?: GraphAlgorithmOptions,
): GraphStep[] {
  const steps: GraphStep[] = [];
  const { nodes, edges } = graphData;
  if (nodes.length === 0) return steps;

  const startId = options?.startNodeId ?? nodes[0].id;
  const endId = options?.endNodeId ?? nodes.at(-1)!.id;
  const n = nodes.length;

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  for (const node of nodes) {
    distances[node.id] = INF;
    previous[node.id] = null;
  }
  distances[startId] = 0;

  // Build undirected edge list (each edge counts both directions)
  const allEdges = edges.flatMap((e) => [
    { from: e.from, to: e.to, weight: e.weight, id: e.id },
    { from: e.to, to: e.from, weight: e.weight, id: e.id },
  ]);

  steps.push(
    buildStep(
      "initial",
      `Bellman-Ford: shortest path from ${startId} to ${endId}`,
      `Relaxes all edges ${n - 1} times. Handles negative weights.`,
      null,
      null,
      new Set(),
      distances,
      previous,
      [],
      new Set(),
      graphData,
      true,
    ),
  );

  for (let iter = 1; iter <= n - 1; iter++) {
    const relaxedThisRound = new Set<string>();
    let anyRelaxed = false;

    steps.push(
      buildStep(
        "process",
        `Iteration ${iter} of ${n - 1} — relaxing all edges`,
        "Update distances if a shorter path is found through each edge.",
        null,
        null,
        relaxedThisRound,
        distances,
        previous,
        [],
        new Set(),
        graphData,
        true,
      ),
    );

    for (const edge of allEdges) {
      if (distances[edge.from] === INF) continue;

      const newDist = distances[edge.from] + edge.weight;

      steps.push(
        buildStep(
          "explore",
          `Edge ${edge.from}→${edge.to} (weight ${edge.weight}): ${distances[edge.from]} + ${edge.weight} = ${newDist}`,
          newDist < distances[edge.to]
            ? `Relaxing: ${distances[edge.to] === INF ? "∞" : distances[edge.to]} → ${newDist}`
            : `No improvement (current: ${distances[edge.to] === INF ? "∞" : distances[edge.to]})`,
          edge.from,
          edge.to,
          relaxedThisRound,
          distances,
          previous,
          [],
          new Set(),
          graphData,
        ),
      );

      if (newDist < distances[edge.to]) {
        distances[edge.to] = newDist;
        previous[edge.to] = edge.from;
        relaxedThisRound.add(edge.to);
        anyRelaxed = true;
      }
    }

    if (!anyRelaxed) {
      steps.push(
        buildStep(
          "summary",
          `Early termination at iteration ${iter} — no relaxations occurred`,
          "Distances have converged.",
          null,
          null,
          new Set(),
          distances,
          previous,
          [],
          new Set(),
          graphData,
          true,
        ),
      );
      break;
    }
  }

  // Reconstruct path
  if (distances[endId] < INF) {
    const path: string[] = [];
    const pathEdgeIds = new Set<string>();
    let cur: string | null = endId;
    while (cur) {
      path.unshift(cur);
      cur = previous[cur];
    }

    for (let i = 0; i < path.length - 1; i++) {
      const edge = edges.find(
        (e) =>
          (e.from === path[i] && e.to === path[i + 1]) ||
          (e.to === path[i] && e.from === path[i + 1]),
      );
      if (edge) pathEdgeIds.add(edge.id);
    }

    steps.push(
      buildStep(
        "path",
        `Path found: ${path.join(" → ")}`,
        `Total distance: ${distances[endId]}`,
        null,
        null,
        new Set(),
        distances,
        previous,
        path,
        pathEdgeIds,
        graphData,
        true,
      ),
    );

    steps.push(
      buildStep(
        "complete",
        `Bellman-Ford complete: ${path.join(" → ")} (distance: ${distances[endId]})`,
        `Processed ${n - 1} iterations`,
        null,
        null,
        new Set(),
        distances,
        previous,
        path,
        pathEdgeIds,
        graphData,
        true,
      ),
    );
  } else {
    steps.push(
      buildStep(
        "complete",
        `No path found from ${startId} to ${endId}`,
        `${endId} is unreachable`,
        null,
        null,
        new Set(),
        distances,
        previous,
        [],
        new Set(),
        graphData,
        true,
      ),
    );
  }

  return steps;
}

export const definition: GraphAlgorithmDefinition = {
  key: "bellmanFord",
  name: "Bellman-Ford Algorithm",
  category: "pathfinding",
  func: bellmanFord,
};
