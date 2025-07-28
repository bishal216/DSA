import { GraphData, Node, PathfindingStep } from "@/algorithms/types/graph";

export function runDijkstra(
  graphData: GraphData,
  startNode: string = "",
  endNode: string = "",
): PathfindingStep[] {
  const steps: PathfindingStep[] = [];
  const { nodes, edges } = graphData;

  //   Find start and end nodes
  if (!startNode) {
    startNode = nodes.length > 0 ? nodes[0].id : "";
  }
  if (!endNode) {
    endNode = nodes.length > 1 ? nodes[1].id : "";
  }

  // Initialize data structures
  const nodeMap = new Map<string, Node>(nodes.map((node) => [node.id, node]));
  const distances: Record<string, number> = {};
  const previousNodes: Record<string, string | null> = {};
  const visited = new Set<string>();
  const unvisited = new Set<string>(nodes.map((n) => n.id));

  nodes.forEach((node) => {
    distances[node.id] = node.id === startNode ? 0 : Infinity;
    previousNodes[node.id] = null;
  });

  // Initial step
  steps.push({
    stepType: "initial",
    description: "Starting Dijkstra's algorithm",
    subDescription: `Finding path from ${startNode} to ${endNode}`,
    currentNode: null,
    visitedNodes: [],
    frontierNodes: [startNode],
    path: [],
    distances: { ...distances },
    previousNodes: { ...previousNodes },
  });

  while (unvisited.size > 0) {
    // Get node with smallest distance
    let currentId: string | null = null;
    let smallestDistance = Infinity;

    unvisited.forEach((nodeId) => {
      if (distances[nodeId] < smallestDistance) {
        smallestDistance = distances[nodeId];
        currentId = nodeId;
      }
    });

    if (!currentId || distances[currentId] === Infinity) break;
    const currentNode = nodeMap.get(currentId)!;

    // Explore step
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

    // Visit neighbors
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

    // Visited step
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

    // Early exit if we've reached the end
    if (currentId === endNode) break;
  }

  // Reconstruct path
  const path: string[] = [];
  let current: string | null = endNode;
  while (current) {
    path.unshift(current);
    current = previousNodes[current];
  }

  // Path step
  steps.push({
    stepType: "path",
    description: path[0] === startNode ? "Path found!" : "No path exists",
    subDescription: `Total distance: ${distances[endNode]}`,
    currentNode: null,
    visitedNodes: Array.from(visited),
    frontierNodes: [],
    path: [...path],
    distances: { ...distances },
    previousNodes: { ...previousNodes },
  });

  // Complete step
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
