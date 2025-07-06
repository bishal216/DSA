import { GraphData, GraphAlgorithmStep } from "@/algorithms/types/graph";

export function topologicalSort(graph: GraphData): GraphAlgorithmStep[] {
  const steps: GraphAlgorithmStep[] = [];
  const inDegree = new Map<string, number>();

  // Calculate in-degrees
  graph.nodes.forEach((node) => inDegree.set(node.id, 0));
  graph.edges.forEach((edge) => {
    inDegree.set(edge.to, (inDegree.get(edge.to) || 0) + 1);
  });

  steps.push({
    description: "Starting topological sort using Kahn's algorithm",
    details: "Initialize in-degree count for all vertices",
  });

  // Find all vertices with in-degree 0
  const queue: string[] = [];
  for (const [nodeId, degree] of inDegree) {
    if (degree === 0) {
      queue.push(nodeId);
      steps.push({
        description: `Found vertex ${nodeId} with in-degree 0`,
        nodeId,
        state: "processing",
      });
    }
  }

  const result: string[] = [];

  while (queue.length > 0) {
    const current = queue.shift()!;
    result.push(current);

    steps.push({
      description: `Processing vertex ${current}`,
      nodeId: current,
      state: "visited",
    });

    // Find all adjacent vertices
    const adjacentEdges = graph.edges.filter((e) => e.from === current);

    for (const edge of adjacentEdges) {
      const neighbor = edge.to;
      inDegree.set(neighbor, inDegree.get(neighbor)! - 1);

      steps.push({
        description: `Reducing in-degree of ${neighbor}`,
        edgeId: edge.id,
        state: "active",
      });

      if (inDegree.get(neighbor) === 0) {
        queue.push(neighbor);
        steps.push({
          description: `Vertex ${neighbor} now has in-degree 0, adding to queue`,
          nodeId: neighbor,
          state: "processing",
        });
      }
    }
  }

  if (result.length !== graph.nodes.length) {
    steps.push({
      description: "Graph contains a cycle! Topological sort not possible.",
      details: "Not all vertices were processed",
    });
  } else {
    steps.push({
      description: `Topological order: ${result.join(" → ")}`,
      details: "All vertices successfully ordered",
    });
  }

  return steps;
}

export function kosarajuSCC(graph: GraphData): GraphAlgorithmStep[] {
  const steps: GraphAlgorithmStep[] = [];
  const visited = new Set<string>();
  const stack: string[] = [];

  steps.push({
    description:
      "Starting Kosaraju's algorithm for strongly connected components",
    details: "Phase 1: DFS on original graph to fill stack",
  });

  // Phase 1: DFS on original graph
  const dfs1 = (nodeId: string) => {
    visited.add(nodeId);
    steps.push({
      description: `Visiting vertex ${nodeId} in first DFS`,
      nodeId,
      state: "visited",
    });

    const adjacentEdges = graph.edges.filter((e) => e.from === nodeId);
    for (const edge of adjacentEdges) {
      if (!visited.has(edge.to)) {
        steps.push({
          description: `Following edge to ${edge.to}`,
          edgeId: edge.id,
          state: "active",
        });
        dfs1(edge.to);
      }
    }

    stack.push(nodeId);
    steps.push({
      description: `Finished processing ${nodeId}, adding to stack`,
      nodeId,
      state: "finished",
    });
  };

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      dfs1(node.id);
    }
  }

  steps.push({
    description: "Phase 2: DFS on transposed graph in stack order",
    details: "Process vertices in reverse finishing order",
  });

  // Phase 2: DFS on transposed graph
  visited.clear();
  const sccComponents: string[][] = [];
  let currentComponent: string[] = [];

  const dfs2 = (nodeId: string) => {
    visited.add(nodeId);
    currentComponent.push(nodeId);
    steps.push({
      description: `Adding ${nodeId} to current SCC`,
      nodeId,
      state: "scc",
    });

    // Find incoming edges (transpose)
    const incomingEdges = graph.edges.filter((e) => e.to === nodeId);
    for (const edge of incomingEdges) {
      if (!visited.has(edge.from)) {
        steps.push({
          description: `Following transposed edge from ${edge.to} to ${edge.from}`,
          edgeId: edge.id,
          state: "tree",
        });
        dfs2(edge.from);
      }
    }
  };

  while (stack.length > 0) {
    const nodeId = stack.pop()!;
    if (!visited.has(nodeId)) {
      currentComponent = [];
      dfs2(nodeId);
      sccComponents.push([...currentComponent]);
      steps.push({
        description: `Found SCC: {${currentComponent.join(", ")}}`,
        nodes: [...currentComponent],
        state: "scc",
      });
    }
  }

  steps.push({
    description: `Found ${sccComponents.length} strongly connected components`,
    details: sccComponents.map((comp) => `{${comp.join(", ")}}`).join(", "),
  });

  return steps;
}

export function tarjanSCC(graph: GraphData): GraphAlgorithmStep[] {
  const steps: GraphAlgorithmStep[] = [];
  const stack: string[] = [];
  const onStack = new Set<string>();
  const ids = new Map<string, number>();
  const lowLinks = new Map<string, number>();
  let id = 0;
  const sccComponents: string[][] = [];

  steps.push({
    description:
      "Starting Tarjan's algorithm for strongly connected components",
    details: "Single DFS pass with low-link values",
  });

  const dfs = (nodeId: string) => {
    stack.push(nodeId);
    onStack.add(nodeId);
    ids.set(nodeId, id);
    lowLinks.set(nodeId, id);
    id++;

    steps.push({
      description: `Visiting ${nodeId}, assigned ID ${ids.get(nodeId)}`,
      nodeId,
      state: "visited",
    });

    const adjacentEdges = graph.edges.filter((e) => e.from === nodeId);
    for (const edge of adjacentEdges) {
      const neighbor = edge.to;

      if (!ids.has(neighbor)) {
        steps.push({
          description: `Following tree edge to unvisited ${neighbor}`,
          edgeId: edge.id,
          state: "tree",
        });
        dfs(neighbor);
      }

      if (onStack.has(neighbor)) {
        steps.push({
          description: `Back edge to ${neighbor}, updating low-link`,
          edgeId: edge.id,
          state: "back",
        });
        lowLinks.set(
          nodeId,
          Math.min(lowLinks.get(nodeId)!, lowLinks.get(neighbor)!),
        );
      }
    }

    // Check if this is the root of an SCC
    if (ids.get(nodeId) === lowLinks.get(nodeId)) {
      const component: string[] = [];
      let current: string;

      do {
        current = stack.pop()!;
        onStack.delete(current);
        component.push(current);
        steps.push({
          description: `Popping ${current} from stack for SCC`,
          nodeId: current,
          state: "scc",
        });
      } while (current !== nodeId);

      sccComponents.push(component);
      steps.push({
        description: `Found SCC: {${component.join(", ")}}`,
        nodes: component,
        state: "scc",
      });
    }
  };

  for (const node of graph.nodes) {
    if (!ids.has(node.id)) {
      dfs(node.id);
    }
  }

  steps.push({
    description: `Found ${sccComponents.length} strongly connected components`,
    details: sccComponents.map((comp) => `{${comp.join(", ")}}`).join(", "),
  });

  return steps;
}

export function depthFirstSearch(
  graph: GraphData,
  startNodeId: string,
): GraphAlgorithmStep[] {
  const steps: GraphAlgorithmStep[] = [];
  const visited = new Set<string>();
  const stack = [startNodeId];

  steps.push({
    description: `Starting DFS from vertex ${startNodeId}`,
    details: "Using iterative approach with explicit stack",
  });

  while (stack.length > 0) {
    const current = stack.pop()!;

    if (!visited.has(current)) {
      visited.add(current);
      steps.push({
        description: `Visiting vertex ${current}`,
        nodeId: current,
        state: "visited",
      });

      const adjacentEdges = graph.edges.filter((e) => e.from === current);
      for (const edge of adjacentEdges) {
        if (!visited.has(edge.to)) {
          stack.push(edge.to);
          steps.push({
            description: `Adding ${edge.to} to stack`,
            edgeId: edge.id,
            state: "active",
          });
        }
      }
    }
  }

  steps.push({
    description: "DFS traversal completed",
    details: `Visited ${visited.size} vertices`,
  });

  return steps;
}

export function breadthFirstSearch(
  graph: GraphData,
  startNodeId: string,
): GraphAlgorithmStep[] {
  const steps: GraphAlgorithmStep[] = [];
  const visited = new Set<string>();
  const queue = [startNodeId];

  steps.push({
    description: `Starting BFS from vertex ${startNodeId}`,
    details: "Using queue for level-by-level traversal",
  });

  visited.add(startNodeId);
  steps.push({
    description: `Adding ${startNodeId} to queue and marking as visited`,
    nodeId: startNodeId,
    state: "processing",
  });

  while (queue.length > 0) {
    const current = queue.shift()!;

    steps.push({
      description: `Processing vertex ${current}`,
      nodeId: current,
      state: "visited",
    });

    const adjacentEdges = graph.edges.filter((e) => e.from === current);
    for (const edge of adjacentEdges) {
      if (!visited.has(edge.to)) {
        visited.add(edge.to);
        queue.push(edge.to);
        steps.push({
          description: `Discovering ${edge.to}, adding to queue`,
          edgeId: edge.id,
          state: "active",
          nodeId: edge.to,
        });
      }
    }
  }

  steps.push({
    description: "BFS traversal completed",
    details: `Visited ${visited.size} vertices`,
  });

  return steps;
}

export function detectCycleDirected(graph: GraphData): GraphAlgorithmStep[] {
  const steps: GraphAlgorithmStep[] = [];
  const visited = new Set<string>();
  const recursionStack = new Set<string>();
  let cycleFound = false;

  steps.push({
    description: "Starting cycle detection in directed graph using DFS",
    details: "Using white-gray-black coloring approach",
  });

  const dfs = (nodeId: string, path: string[]): boolean => {
    visited.add(nodeId);
    recursionStack.add(nodeId);

    steps.push({
      description: `Visiting node ${nodeId}, marking as gray (in recursion stack)`,
      nodeId,
      state: "processing",
    });

    const adjacentEdges = graph.edges.filter((e) => e.from === nodeId);

    for (const edge of adjacentEdges) {
      const neighbor = edge.to;

      steps.push({
        description: `Exploring edge from ${nodeId} to ${neighbor}`,
        edgeId: edge.id,
        state: "active",
      });

      if (!visited.has(neighbor)) {
        if (dfs(neighbor, [...path, neighbor])) {
          return true;
        }
      } else if (recursionStack.has(neighbor)) {
        // Back edge found - cycle detected
        steps.push({
          description: `Back edge detected! Cycle found: ${nodeId} → ${neighbor}`,
          edgeId: edge.id,
          state: "back",
          cycleFound: true,
        });

        // Highlight the cycle
        const cycleStart = path.indexOf(neighbor);
        const cycle = path.slice(cycleStart);
        cycle.push(neighbor);

        steps.push({
          description: `Cycle detected: ${cycle.join(" → ")}`,
          nodes: cycle,
          state: "scc",
          cycleFound: true,
          cycleNodes: cycle,
        });

        return true;
      }
    }

    recursionStack.delete(nodeId);
    steps.push({
      description: `Finished processing ${nodeId}, marking as black (visited)`,
      nodeId,
      state: "visited",
    });

    return false;
  };

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id, [node.id])) {
        cycleFound = true;
        break;
      }
    }
  }

  if (!cycleFound) {
    steps.push({
      description: "No cycle found in the directed graph",
      details: "The graph is acyclic (DAG)",
    });
  }

  return steps;
}

export function detectCycleUndirected(graph: GraphData): GraphAlgorithmStep[] {
  const steps: GraphAlgorithmStep[] = [];
  const visited = new Set<string>();
  let cycleFound = false;

  steps.push({
    description: "Starting cycle detection in undirected graph using DFS",
    details: "Looking for back edges (excluding parent edges)",
  });

  const dfs = (nodeId: string, parent: string | null): boolean => {
    visited.add(nodeId);

    steps.push({
      description: `Visiting node ${nodeId}`,
      nodeId,
      state: "processing",
    });

    // Get all edges connected to this node (both incoming and outgoing for undirected)
    const connectedEdges = graph.edges.filter(
      (e) => e.from === nodeId || e.to === nodeId,
    );

    for (const edge of connectedEdges) {
      const neighbor = edge.from === nodeId ? edge.to : edge.from;

      // Skip the parent edge
      if (neighbor === parent) continue;

      steps.push({
        description: `Exploring edge to ${neighbor}`,
        edgeId: edge.id,
        state: "active",
      });

      if (!visited.has(neighbor)) {
        if (dfs(neighbor, nodeId)) {
          return true;
        }
      } else {
        // Back edge found - cycle detected
        steps.push({
          description: `Back edge detected! Cycle found involving nodes ${nodeId} and ${neighbor}`,
          edgeId: edge.id,
          state: "back",
          cycleFound: true,
        });

        steps.push({
          description: `Cycle detected in undirected graph`,
          nodes: [nodeId, neighbor],
          state: "scc",
          cycleFound: true,
        });

        return true;
      }
    }

    steps.push({
      description: `Finished processing ${nodeId}`,
      nodeId,
      state: "visited",
    });

    return false;
  };

  for (const node of graph.nodes) {
    if (!visited.has(node.id)) {
      if (dfs(node.id, null)) {
        cycleFound = true;
        break;
      }
    }
  }

  if (!cycleFound) {
    steps.push({
      description: "No cycle found in the undirected graph",
      details: "The graph is acyclic (forest/tree)",
    });
  }

  return steps;
}
