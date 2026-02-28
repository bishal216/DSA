import { GraphData, Node, PathfindingStep } from "@/algorithms/types/graph";

export function runDijkstra(
  graphData: GraphData,
  startNode: string = "",
  endNode: string = "",
): PathfindingStep[] {
  const steps: PathfindingStep[] = [];
  const { nodes, edges } = graphData;

  const resolvedStart = startNode || (nodes.length > 0 ? nodes[0].id : "");
  const resolvedEnd = endNode || (nodes.length > 1 ? nodes[1].id : "");

  const nodeMap = new Map<string, Node>(nodes.map((node) => [node.id, node]));
  const distances: Record<string, number> = {};
  const previousNodes: Record<string, string | null> = {};
  const visited = new Set<string>();
  const unvisited = new Set<string>(nodes.map((n) => n.id));

  nodes.forEach((node) => {
    distances[node.id] = node.id === resolvedStart ? 0 : Infinity;
    previousNodes[node.id] = null;
  });

  steps.push({
    stepType: "initial",
    description: "Starting Dijkstra's algorithm",
    subDescription: `Finding path from ${resolvedStart} to ${resolvedEnd}`,
    currentNode: null,
    visitedNodes: [],
    frontierNodes: [resolvedStart],
    path: [],
    distances: { ...distances },
    previousNodes: { ...previousNodes },
  });

  while (unvisited.size > 0) {
    let currentId: string | null = null;
    let smallestDistance = Infinity;

    for (const nodeId of unvisited) {
      if (distances[nodeId] < smallestDistance) {
        smallestDistance = distances[nodeId];
        currentId = nodeId;
      }
    }

    if (!currentId || distances[currentId] === Infinity) break;

    const currentNode = nodeMap.get(currentId)!;

    steps.push({
      stepType: "explore",
      description: `Exploring node ${currentId}`,
      subDescription: `Current distance: ${distances[currentId]}`,
      currentNode,
      visitedNodes: Array.from(visited),
      frontierNodes: Array.from(unvisited),
      path: [],
      distances: { ...distances },
      previousNodes: { ...previousNodes },
    });

    const neighbors = edges.filter(
      (e) => e.from === currentId || e.to === currentId,
    );

    for (const edge of neighbors) {
      const neighborId = edge.from === currentId ? edge.to : edge.from;
      if (visited.has(neighborId)) continue;

      const newDistance = distances[currentId] + edge.weight;
      if (newDistance < distances[neighborId]) {
        distances[neighborId] = newDistance;
        previousNodes[neighborId] = currentId;
      }
    }

    visited.add(currentId);
    unvisited.delete(currentId);

    steps.push({
      stepType: "visit",
      description: `Visited node ${currentId}`,
      subDescription: `Updated distances to neighbors`,
      currentNode,
      visitedNodes: Array.from(visited),
      frontierNodes: Array.from(unvisited),
      path: [],
      distances: { ...distances },
      previousNodes: { ...previousNodes },
    });

    if (currentId === resolvedEnd) break;
  }

  const path: string[] = [];
  let current: string | null = resolvedEnd;
  while (current) {
    path.unshift(current);
    current = previousNodes[current];
  }

  steps.push({
    stepType: "path",
    description: path[0] === resolvedStart ? "Path found!" : "No path exists",
    subDescription: `Total distance: ${distances[resolvedEnd]}`,
    currentNode: null,
    visitedNodes: Array.from(visited),
    frontierNodes: [],
    path: [...path],
    distances: { ...distances },
    previousNodes: { ...previousNodes },
  });

  steps.push({
    stepType: "complete",
    description: "Algorithm complete",
    subDescription: `Visited ${visited.size} nodes`,
    currentNode: null,
    visitedNodes: Array.from(visited),
    frontierNodes: [],
    path: [...path],
    distances: { ...distances },
    previousNodes: { ...previousNodes },
  });

  return steps;
}
