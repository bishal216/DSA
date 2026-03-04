// src/algorithms/utils/graph-algorithms/pathfinding-algorithms/dfs.ts

import type {
  GraphAlgorithmOptions,
  GraphData,
  GraphStep,
  PathfindingStepMetadata,
} from "@/algorithms/types/graph";
import type { GraphAlgorithmDefinition } from "@/algorithms/types/graph-algorithms-registry";

function buildStep(
  stepType: GraphStep["stepType"],
  message: string,
  subMessage: string,
  currentId: string | null,
  visited: Set<string>,
  stack: string[],
  previous: Record<string, string | null>,
  path: string[],
  pathEdgeIds: Set<string>,
  graph: GraphData,
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep["nodeStates"] = {};
  const edgeStates: GraphStep["edgeStates"] = {};

  for (const id of visited) nodeStates[id] = "visited";
  for (const id of stack) nodeStates[id] ??= "candidate";
  if (currentId) nodeStates[currentId] = "current";
  for (const id of path) {
    if (nodeStates[id] !== "current") nodeStates[id] = "visited";
  }
  for (const edge of graph.edges) {
    if (pathEdgeIds.has(edge.id)) edgeStates[edge.id] = "tree";
  }

  const metadata: PathfindingStepMetadata = {
    distances: {},
    previous: { ...previous },
    path: [...path],
    frontier: [...stack],
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

function dfs(
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
  const stack: string[] = [startId];
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
      `DFS: searching for path from ${startId} to ${endId}`,
      "Explores as deep as possible before backtracking. Does not guarantee shortest path.",
      null,
      visited,
      stack,
      previous,
      [],
      new Set(),
      graphData,
      true,
    ),
  );

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    if (visited.has(currentId)) continue;

    visited.add(currentId);

    steps.push(
      buildStep(
        "visit",
        `Popped and visited node ${currentId}`,
        `Stack: [${stack.join(", ")}]`,
        currentId,
        visited,
        stack,
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
          "Note: DFS path may not be the shortest.",
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
          `DFS complete: ${path.join(" → ")}`,
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
      if (!previous.hasOwnProperty(to)) previous[to] = currentId;
      stack.push(to);

      steps.push(
        buildStep(
          "explore",
          `Pushing ${to} onto stack`,
          `Stack: [${stack.join(", ")}]`,
          currentId,
          visited,
          stack,
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
  key: "dfs",
  name: "Depth-First Search",
  category: "pathfinding",
  func: dfs,
};
