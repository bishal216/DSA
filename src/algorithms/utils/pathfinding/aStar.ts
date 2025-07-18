import { GraphData, PathfindingStep, Node } from "@/algorithms/types/graph";

// Heuristic function for A* algorithm
export function heuristic(a: Node, b: Node): number {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
}

export function euclideanHeuristic(
  nodePositions: Record<string, { x: number; y: number }>,
) {
  return (a: string, b: string) => {
    const dx = nodePositions[a].x - nodePositions[b].x;
    const dy = nodePositions[a].y - nodePositions[b].y;
    return Math.sqrt(dx * dx + dy * dy);
  };
}

export function runAStar(
  graphData: GraphData,
  startNode: string = "",
  endNode: string = "",
): PathfindingStep[] {
  const steps: PathfindingStep[] = [];
  const { nodes, edges } = graphData;

  if (!startNode) {
    startNode = nodes.length > 0 ? nodes[0].id : "";
  }
  if (!endNode) {
    endNode = nodes.length > 1 ? nodes[1].id : "";
  }
  const nodeMap = new Map<string, Node>(nodes.map((node) => [node.id, node]));
  const start = nodeMap.get(startNode)!;
  const end = nodeMap.get(endNode)!;

  // Initialize data structures
  const openSet = new Set<string>([startNode]);
  const closedSet = new Set<string>();
  const gScore: Record<string, number> = {};
  const fScore: Record<string, number> = {};
  const cameFrom: Record<string, string | null> = {};

  nodes.forEach((node) => {
    gScore[node.id] = node.id === startNode ? 0 : Infinity;
    fScore[node.id] = node.id === startNode ? heuristic(start, end) : Infinity;
    cameFrom[node.id] = null;
  });

  // Initial step
  steps.push({
    stepType: "initial",
    description: "Starting A* algorithm",
    subDescription: `Finding path from ${startNode} to ${endNode}`,
    currentNode: null,
    visitedNodes: [],
    frontierNodes: [startNode],
    path: [],
    distances: { ...gScore },
    previousNodes: { ...cameFrom },
  });

  while (openSet.size > 0) {
    // Get node with lowest fScore
    let currentId: string | null = null;
    let lowestFScore = Infinity;

    openSet.forEach((nodeId) => {
      if (fScore[nodeId] < lowestFScore) {
        lowestFScore = fScore[nodeId];
        currentId = nodeId;
      }
    });

    if (!currentId) break;
    const current = nodeMap.get(currentId)!;

    // Check if we've reached the goal
    if (currentId === endNode) {
      // Reconstruct path
      const path: string[] = [];
      let temp: string | null = currentId;
      while (temp) {
        path.unshift(temp);
        temp = cameFrom[temp];
      }

      steps.push({
        stepType: "path",
        description: "Path found!",
        subDescription: `Total cost: ${gScore[endNode]}`,
        currentNode: null,
        visitedNodes: Array.from(closedSet),
        frontierNodes: [],
        path: [...path],
        distances: { ...gScore },
        previousNodes: { ...cameFrom },
      });

      break;
    }

    // Explore step
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

    // Visit neighbors
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

      // This path is better
      cameFrom[neighborId] = currentId;
      gScore[neighborId] = tentativeGScore;
      fScore[neighborId] = gScore[neighborId] + heuristic(neighbor, end);
    }

    // Visited step
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

  // Complete step
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
