// src/algorithms/utils/graph-algorithms/pathfinding-algorithms/dijkstra.ts

import type {
  GraphAlgorithmOptions,
  GraphData,
  GraphStep,
  PathfindingStepMetadata,
} from "@/algorithms/types/graph";
import type { GraphAlgorithmDefinition } from "@/algorithms/types/graph-algorithms-registry";

const INF = Infinity;

function buildStep(
  stepType: GraphStep["stepType"],
  message: string,
  subMessage: string,
  currentNodeId: string | null,
  visited: Set<string>,
  frontier: Set<string>,
  distances: Record<string, number>,
  previous: Record<string, string | null>,
  path: string[],
  pathEdgeIds: Set<string>,
  graph: GraphData,
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep["nodeStates"] = {};
  const edgeStates: GraphStep["edgeStates"] = {};

  for (const id of visited) nodeStates[id] = "visited";
  for (const id of frontier) nodeStates[id] ??= "candidate";
  if (currentNodeId) nodeStates[currentNodeId] = "current";

  // Path edges take priority
  for (const edge of graph.edges) {
    if (pathEdgeIds.has(edge.id)) edgeStates[edge.id] = "tree";
  }

  for (const id of path) {
    if (nodeStates[id] !== "current") nodeStates[id] = "visited";
  }

  const metadata: PathfindingStepMetadata = {
    distances: { ...distances },
    previous: { ...previous },
    path: [...path],
    frontier: [...frontier],
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

function dijkstra(
  graphData: GraphData,
  options?: GraphAlgorithmOptions,
): GraphStep[] {
  const steps: GraphStep[] = [];
  const { nodes, edges } = graphData;
  if (nodes.length === 0) return steps;

  const startId = options?.startNodeId ?? nodes[0].id;
  const endId = options?.endNodeId ?? nodes.at(-1)!.id;

  const distances: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const visited = new Set<string>();
  const frontier = new Set<string>();

  for (const n of nodes) {
    distances[n.id] = INF;
    previous[n.id] = null;
  }
  distances[startId] = 0;
  frontier.add(startId);

  // Build adjacency list (undirected)
  const adj: Record<string, { to: string; weight: number; edgeId: string }[]> =
    {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) {
    adj[e.from].push({ to: e.to, weight: e.weight, edgeId: e.id });
    adj[e.to].push({ to: e.from, weight: e.weight, edgeId: e.id });
  }

  steps.push(
    buildStep(
      "initial",
      `Dijkstra: finding shortest path from ${startId} to ${endId}`,
      "Start with distance 0 at source; all others infinity.",
      null,
      visited,
      frontier,
      distances,
      previous,
      [],
      new Set(),
      graphData,
      true,
    ),
  );

  while (frontier.size > 0) {
    // Pick minimum distance node in frontier
    const currentId = [...frontier].reduce((min, id) =>
      distances[id] < distances[min] ? id : min,
    );

    frontier.delete(currentId);
    visited.add(currentId);

    steps.push(
      buildStep(
        "visit",
        `Visiting node ${currentId} (distance: ${distances[currentId]})`,
        `Expanding to its unvisited neighbours`,
        currentId,
        visited,
        frontier,
        distances,
        previous,
        [],
        new Set(),
        graphData,
        true,
      ),
    );

    if (currentId === endId) {
      // Reconstruct path
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
          visited,
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
          `Shortest path: ${path.join(" → ")} (distance: ${distances[endId]})`,
          `Visited ${visited.size} nodes`,
          null,
          visited,
          new Set(),
          distances,
          previous,
          path,
          pathEdgeIds,
          graphData,
          true,
        ),
      );
      return steps;
    }

    for (const { to, weight } of adj[currentId]) {
      if (visited.has(to)) continue;

      const newDist = distances[currentId] + weight;

      steps.push(
        buildStep(
          "explore",
          `Checking edge ${currentId}→${to} (weight ${weight})`,
          `Current best distance to ${to}: ${distances[to] === INF ? "∞" : distances[to]} → ${newDist < distances[to] ? newDist : "no improvement"}`,
          currentId,
          visited,
          frontier,
          distances,
          previous,
          [],
          new Set(),
          graphData,
        ),
      );

      if (newDist < distances[to]) {
        distances[to] = newDist;
        previous[to] = currentId;
        frontier.add(to);
      }
    }
  }

  steps.push(
    buildStep(
      "complete",
      `No path found from ${startId} to ${endId}`,
      `${endId} is unreachable from ${startId}`,
      null,
      visited,
      new Set(),
      distances,
      previous,
      [],
      new Set(),
      graphData,
      true,
    ),
  );

  return steps;
}

export const definition: GraphAlgorithmDefinition = {
  key: "dijkstra",
  name: "Dijkstra's Algorithm",
  category: "pathfinding",
  func: dijkstra,
};
