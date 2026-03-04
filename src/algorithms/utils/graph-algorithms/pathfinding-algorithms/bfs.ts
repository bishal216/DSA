// src/algorithms/utils/graph-algorithms/pathfinding-algorithms/bfs.ts

import type { GraphAlgorithmDefinition } from "@/algorithms/registry/graph-algorithms-registry";
import type {
  GraphAlgorithmOptions,
  GraphData,
  GraphStep,
  PathfindingStepMetadata,
} from "@/algorithms/types/graph";

function buildStep(
  stepType: GraphStep["stepType"],
  message: string,
  subMessage: string,
  currentId: string | null,
  visited: Set<string>,
  queue: string[],
  previous: Record<string, string | null>,
  path: string[],
  pathEdgeIds: Set<string>,
  graph: GraphData,
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep["nodeStates"] = {};
  const edgeStates: GraphStep["edgeStates"] = {};

  for (const id of visited) nodeStates[id] = "visited";
  for (const id of queue) nodeStates[id] ??= "candidate";
  if (currentId) nodeStates[currentId] = "current";
  for (const id of path) {
    if (nodeStates[id] !== "current") nodeStates[id] = "visited";
  }
  for (const edge of graph.edges) {
    if (pathEdgeIds.has(edge.id)) edgeStates[edge.id] = "tree";
  }

  const distances: Record<string, number> = {};
  for (const id of visited) distances[id] = 0; // BFS doesn't track distances

  const metadata: PathfindingStepMetadata = {
    distances,
    previous: { ...previous },
    path: [...path],
    frontier: [...queue],
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

function bfs(
  graphData: GraphData,
  options?: GraphAlgorithmOptions,
): GraphStep[] {
  const steps: GraphStep[] = [];
  const { nodes, edges } = graphData;
  if (nodes.length === 0) return steps;

  const startId = options?.startNodeId ?? nodes[0].id;
  const endId = options?.endNodeId ?? nodes.at(-1)!.id;

  const visited = new Set<string>();
  const previous: Record<string, string | null> = {};
  const queue: string[] = [startId];
  visited.add(startId);
  previous[startId] = null;

  const adj: Record<string, { to: string; edgeId: string }[]> = {};
  for (const n of nodes) adj[n.id] = [];
  for (const e of edges) {
    adj[e.from].push({ to: e.to, edgeId: e.id });
    adj[e.to].push({ to: e.from, edgeId: e.id });
  }

  steps.push(
    buildStep(
      "initial",
      `BFS: finding shortest path (fewest hops) from ${startId} to ${endId}`,
      "Explores all neighbours at the current depth before moving deeper.",
      null,
      visited,
      queue,
      previous,
      [],
      new Set(),
      graphData,
      true,
    ),
  );

  while (queue.length > 0) {
    const currentId = queue.shift()!;

    steps.push(
      buildStep(
        "visit",
        `Dequeued node ${currentId}`,
        `Queue: [${queue.join(", ")}]`,
        currentId,
        visited,
        queue,
        previous,
        [],
        new Set(),
        graphData,
        true,
      ),
    );

    if (currentId === endId) {
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
          `${path.length - 1} hops`,
          null,
          visited,
          [],
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
          `BFS complete: ${path.join(" → ")} (${path.length - 1} hops)`,
          `Visited ${visited.size} nodes`,
          null,
          visited,
          [],
          previous,
          path,
          pathEdgeIds,
          graphData,
          true,
        ),
      );
      return steps;
    }

    for (const { to } of adj[currentId]) {
      if (visited.has(to)) continue;

      visited.add(to);
      previous[to] = currentId;
      queue.push(to);

      steps.push(
        buildStep(
          "explore",
          `Discovered ${to} from ${currentId} — added to queue`,
          `Queue: [${queue.join(", ")}]`,
          currentId,
          visited,
          queue,
          previous,
          [],
          new Set(),
          graphData,
        ),
      );
    }
  }

  steps.push(
    buildStep(
      "complete",
      `No path found from ${startId} to ${endId}`,
      `${endId} is unreachable`,
      null,
      visited,
      [],
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
  key: "bfs",
  name: "Breadth-First Search",
  category: "pathfinding",
  func: bfs,
};
