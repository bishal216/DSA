// src/algorithms/utils/graph-algorithms/pathfinding-algorithms/astar.ts

import type {
  GraphAlgorithmOptions,
  GraphData,
  GraphStep,
  PathfindingStepMetadata,
} from "@/algorithms/types/graph";
import type { GraphAlgorithmDefinition } from "@/algorithms/types/graph-algorithms-registry";

const INF = Infinity;

function heuristic(graphData: GraphData, a: string, b: string): number {
  const na = graphData.nodes.find((n) => n.id === a);
  const nb = graphData.nodes.find((n) => n.id === b);
  if (!na || !nb) return 0;
  return Math.hypot(na.x - nb.x, na.y - nb.y) / 50; // scale to edge weight range
}

function buildStep(
  stepType: GraphStep["stepType"],
  message: string,
  subMessage: string,
  currentId: string | null,
  visited: Set<string>,
  openSet: Set<string>,
  gScore: Record<string, number>,
  previous: Record<string, string | null>,
  path: string[],
  pathEdgeIds: Set<string>,
  graph: GraphData,
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep["nodeStates"] = {};
  const edgeStates: GraphStep["edgeStates"] = {};

  for (const id of visited) nodeStates[id] = "visited";
  for (const id of openSet) nodeStates[id] ??= "candidate";
  if (currentId) nodeStates[currentId] = "current";
  for (const id of path) {
    if (nodeStates[id] !== "current") nodeStates[id] = "visited";
  }
  for (const edge of graph.edges) {
    if (pathEdgeIds.has(edge.id)) edgeStates[edge.id] = "tree";
  }

  const metadata: PathfindingStepMetadata = {
    distances: { ...gScore },
    previous: { ...previous },
    path: [...path],
    frontier: [...openSet],
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

function astar(
  graphData: GraphData,
  options?: GraphAlgorithmOptions,
): GraphStep[] {
  const steps: GraphStep[] = [];
  const { nodes, edges } = graphData;
  if (nodes.length === 0) return steps;

  const startId = options?.startNodeId ?? nodes[0].id;
  const endId = options?.endNodeId ?? nodes.at(-1)!.id;

  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const previous: Record<string, string | null> = {};
  const openSet = new Set<string>();
  const closedSet = new Set<string>();

  for (const n of nodes) {
    gScore[n.id] = INF;
    fScore[n.id] = INF;
    previous[n.id] = null;
  }
  gScore[startId] = 0;
  fScore[startId] = heuristic(graphData, startId, endId);
  openSet.add(startId);

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
      `A*: finding shortest path from ${startId} to ${endId}`,
      "Uses heuristic (Euclidean distance) to guide search toward the goal.",
      null,
      closedSet,
      openSet,
      gScore,
      previous,
      [],
      new Set(),
      graphData,
      true,
    ),
  );

  while (openSet.size > 0) {
    const currentId = [...openSet].reduce((min, id) =>
      fScore[id] < fScore[min] ? id : min,
    );

    openSet.delete(currentId);
    closedSet.add(currentId);

    steps.push(
      buildStep(
        "visit",
        `Visiting ${currentId} — g=${gScore[currentId]}, f=${fScore[currentId].toFixed(1)}`,
        `g = actual cost, h = heuristic to ${endId}, f = g + h`,
        currentId,
        closedSet,
        openSet,
        gScore,
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
          `Total cost: ${gScore[endId]}`,
          null,
          closedSet,
          new Set(),
          gScore,
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
          `A* complete: ${path.join(" → ")} (cost: ${gScore[endId]})`,
          `Explored ${closedSet.size} nodes`,
          null,
          closedSet,
          new Set(),
          gScore,
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
      if (closedSet.has(to)) continue;

      const tentativeG = gScore[currentId] + weight;
      const h = heuristic(graphData, to, endId);

      steps.push(
        buildStep(
          "explore",
          `Checking neighbour ${to} — tentative g=${tentativeG}, h=${h.toFixed(1)}, f=${(tentativeG + h).toFixed(1)}`,
          tentativeG < gScore[to]
            ? `Improvement found — updating ${to}`
            : `No improvement`,
          currentId,
          closedSet,
          openSet,
          gScore,
          previous,
          [],
          new Set(),
          graphData,
        ),
      );

      if (tentativeG < gScore[to]) {
        previous[to] = currentId;
        gScore[to] = tentativeG;
        fScore[to] = tentativeG + h;
        openSet.add(to);
      }
    }
  }

  steps.push(
    buildStep(
      "complete",
      `No path found from ${startId} to ${endId}`,
      `${endId} is unreachable`,
      null,
      closedSet,
      new Set(),
      gScore,
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
  key: "astar",
  name: "A* Search",
  category: "pathfinding",
  func: astar,
};
