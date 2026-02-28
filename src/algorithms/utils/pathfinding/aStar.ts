import { GraphData, Node, PathfindingStep } from "@/algorithms/types/graph";

export function heuristic(a: Node, b: Node): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function runAStar(
  graphData: GraphData,
  startNode: string = "",
  endNode: string = "",
): PathfindingStep[] {
  const steps: PathfindingStep[] = [];
  const { nodes, edges } = graphData;

  const resolvedStart = startNode || (nodes.length > 0 ? nodes[0].id : "");
  const resolvedEnd = endNode || (nodes.length > 1 ? nodes[1].id : "");

  const nodeMap = new Map<string, Node>(nodes.map((node) => [node.id, node]));
  const start = nodeMap.get(resolvedStart)!;
  const end = nodeMap.get(resolvedEnd)!;

  const openSet = new Set<string>([resolvedStart]);
  const closedSet = new Set<string>();
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const cameFrom: Record<string, string | null> = {};

  nodes.forEach((node) => {
    gScore[node.id] = node.id === resolvedStart ? 0 : Infinity;
    fScore[node.id] =
      node.id === resolvedStart ? heuristic(start, end) : Infinity;
    cameFrom[node.id] = null;
  });

  steps.push({
    stepType: "initial",
    description: "Starting A* algorithm",
    subDescription: `Finding path from ${resolvedStart} to ${resolvedEnd}`,
    currentNode: null,
    visitedNodes: [],
    frontierNodes: [resolvedStart],
    path: [],
    distances: { ...gScore },
    previousNodes: { ...cameFrom },
  });

  while (openSet.size > 0) {
    let currentId: string | null = null;
    let lowestFScore = Infinity;

    for (const nodeId of openSet) {
      if (fScore[nodeId] < lowestFScore) {
        lowestFScore = fScore[nodeId];
        currentId = nodeId;
      }
    }

    if (!currentId) break;

    const current = nodeMap.get(currentId)!;

    if (currentId === resolvedEnd) {
      const path: string[] = [];
      let temp: string | null = currentId;
      while (temp) {
        path.unshift(temp);
        temp = cameFrom[temp];
      }

      steps.push({
        stepType: "path",
        description: "Path found!",
        subDescription: `Total cost: ${gScore[resolvedEnd]}`,
        currentNode: null,
        visitedNodes: Array.from(closedSet),
        frontierNodes: [],
        path: [...path],
        distances: { ...gScore },
        previousNodes: { ...cameFrom },
      });

      break;
    }

    steps.push({
      stepType: "explore",
      description: `Exploring node ${currentId}`,
      subDescription: `Current fScore: ${fScore[currentId]}`,
      currentNode: current,
      visitedNodes: Array.from(closedSet),
      frontierNodes: Array.from(openSet),
      path: [],
      distances: { ...gScore },
      previousNodes: { ...cameFrom },
    });

    openSet.delete(currentId);
    closedSet.add(currentId);

    const neighbors = edges.filter(
      (e) => e.from === currentId || e.to === currentId,
    );

    for (const edge of neighbors) {
      const neighborId = edge.from === currentId ? edge.to : edge.from;
      if (closedSet.has(neighborId)) continue;

      const neighbor = nodeMap.get(neighborId)!;
      const tentativeGScore = gScore[currentId] + edge.weight;

      if (!openSet.has(neighborId)) {
        openSet.add(neighborId);
      } else if (tentativeGScore >= gScore[neighborId]) {
        continue;
      }

      cameFrom[neighborId] = currentId;
      gScore[neighborId] = tentativeGScore;
      fScore[neighborId] = gScore[neighborId] + heuristic(neighbor, end);
    }

    steps.push({
      stepType: "visit",
      description: `Evaluated node ${currentId}`,
      subDescription: `Updated scores for neighbors`,
      currentNode: current,
      visitedNodes: Array.from(closedSet),
      frontierNodes: Array.from(openSet),
      path: [],
      distances: { ...gScore },
      previousNodes: { ...cameFrom },
    });
  }

  steps.push({
    stepType: "complete",
    description: "Algorithm complete",
    subDescription: `Visited ${closedSet.size} nodes`,
    currentNode: null,
    visitedNodes: Array.from(closedSet),
    frontierNodes: [],
    path: [],
    distances: { ...gScore },
    previousNodes: { ...cameFrom },
  });

  return steps;
}
