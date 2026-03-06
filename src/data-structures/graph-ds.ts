import type { Edge, GraphData, Node } from "@/algorithms/types/graph";

// ── State types ───────────────────────────────────────────────────────────────

export type GraphVariant = "undirected" | "directed" | "weighted";

export type NodeState = "idle" | "active" | "adding" | "removing" | "highlight";
export type EdgeState = "idle" | "active" | "adding" | "removing" | "highlight";

// ── Step type — normalized state maps, not embedded in data ──────────────────

export interface GraphDSStep {
  graph: GraphData;
  nodeStates: Record<string, NodeState>;
  edgeStates: Record<string, EdgeState>;
  directed: boolean;
  weighted: boolean;
  message: string;
  subMessage?: string;
  isMajorStep?: boolean;
}

// ── Snapshot helper ───────────────────────────────────────────────────────────

function snap(
  graph: GraphData,
  directed: boolean,
  weighted: boolean,
  nodeStates: Record<string, NodeState>,
  edgeStates: Record<string, EdgeState>,
  message: string,
  opts?: { subMessage?: string; isMajorStep?: boolean },
): GraphDSStep {
  return {
    graph,
    nodeStates,
    edgeStates,
    directed,
    weighted,
    message,
    ...(opts?.subMessage !== undefined && { subMessage: opts.subMessage }),
    ...(opts?.isMajorStep && { isMajorStep: true }),
  };
}

// ── Step generators ───────────────────────────────────────────────────────────

export class GraphDSSteps {
  static addNode(
    graph: GraphData,
    directed: boolean,
    weighted: boolean,
    node: Node,
  ): GraphDSStep[] {
    const steps: GraphDSStep[] = [];

    steps.push(
      snap(graph, directed, weighted, {}, {}, `addVertex("${node.label}")`, {
        subMessage: "Creating new vertex",
        isMajorStep: true,
      }),
    );

    if (graph.nodes.some((n) => n.id === node.id)) {
      steps.push(
        snap(
          graph,
          directed,
          weighted,
          { [node.id]: "highlight" },
          {},
          `Vertex "${node.label}" already exists`,
          { isMajorStep: true },
        ),
      );
      return steps;
    }

    const newGraph: GraphData = { ...graph, nodes: [...graph.nodes, node] };

    steps.push(
      snap(
        newGraph,
        directed,
        weighted,
        { [node.id]: "adding" },
        {},
        `Vertex "${node.label}" added`,
        {
          subMessage: `Adjacency list: "${node.label}" → []  |  Matrix: new row & column`,
          isMajorStep: true,
        },
      ),
    );

    return steps;
  }

  static removeNode(
    graph: GraphData,
    directed: boolean,
    weighted: boolean,
    nodeId: string,
  ): GraphDSStep[] {
    const steps: GraphDSStep[] = [];
    const node = graph.nodes.find((n) => n.id === nodeId);
    if (!node) {
      steps.push(
        snap(graph, directed, weighted, {}, {}, `Vertex not found`, {
          isMajorStep: true,
        }),
      );
      return steps;
    }

    const incident = graph.edges.filter(
      (e) => e.from === nodeId || e.to === nodeId,
    );
    const incidentStates: Record<string, EdgeState> = {};
    incident.forEach((e) => (incidentStates[e.id] = "removing"));

    steps.push(
      snap(
        graph,
        directed,
        weighted,
        { [nodeId]: "active" },
        {},
        `removeVertex("${node.label}")`,
        {
          subMessage: `Found ${incident.length} incident edge(s)`,
          isMajorStep: true,
        },
      ),
    );

    if (incident.length > 0) {
      steps.push(
        snap(
          graph,
          directed,
          weighted,
          { [nodeId]: "removing" },
          incidentStates,
          `Removing ${incident.length} incident edge(s) first`,
          { subMessage: "All connected edges must be removed" },
        ),
      );
    }

    const newGraph: GraphData = {
      nodes: graph.nodes.filter((n) => n.id !== nodeId),
      edges: graph.edges.filter((e) => e.from !== nodeId && e.to !== nodeId),
    };

    steps.push(
      snap(
        newGraph,
        directed,
        weighted,
        {},
        {},
        `Vertex "${node.label}" removed`,
        {
          subMessage: `Removed vertex and ${incident.length} edge(s)`,
          isMajorStep: true,
        },
      ),
    );

    return steps;
  }

  static addEdge(
    graph: GraphData,
    directed: boolean,
    weighted: boolean,
    edge: Edge,
  ): GraphDSStep[] {
    const steps: GraphDSStep[] = [];
    const from = graph.nodes.find((n) => n.id === edge.from);
    const to = graph.nodes.find((n) => n.id === edge.to);

    if (!from || !to) {
      steps.push(
        snap(graph, directed, weighted, {}, {}, `Vertex not found`, {
          isMajorStep: true,
        }),
      );
      return steps;
    }

    const weightLabel = weighted ? `, w=${edge.weight}` : "";
    steps.push(
      snap(
        graph,
        directed,
        weighted,
        { [from.id]: "active", [to.id]: "active" },
        {},
        `addEdge("${from.label}", "${to.label}"${weightLabel})`,
        {
          subMessage: directed
            ? "Directed: one-way connection"
            : "Undirected: two-way connection",
          isMajorStep: true,
        },
      ),
    );

    const exists = graph.edges.some(
      (e) =>
        (e.from === edge.from && e.to === edge.to) ||
        (!directed && e.from === edge.to && e.to === edge.from),
    );
    if (exists) {
      steps.push(
        snap(
          graph,
          directed,
          weighted,
          { [from.id]: "highlight", [to.id]: "highlight" },
          {},
          `Edge already exists`,
          { isMajorStep: true },
        ),
      );
      return steps;
    }

    const newGraph: GraphData = { ...graph, edges: [...graph.edges, edge] };

    steps.push(
      snap(
        newGraph,
        directed,
        weighted,
        { [from.id]: "adding", [to.id]: "adding" },
        { [edge.id]: "adding" },
        `Edge "${from.label}" → "${to.label}" added`,
        {
          subMessage: directed
            ? `Adjacency list: "${from.label}" → [..., "${to.label}"]`
            : `"${from.label}" ↔ "${to.label}" added to both adjacency lists`,
          isMajorStep: true,
        },
      ),
    );

    steps.push(
      snap(
        newGraph,
        directed,
        weighted,
        {},
        { [edge.id]: "highlight" },
        directed
          ? `Matrix[${from.label}][${to.label}] = ${weighted ? edge.weight : 1}`
          : `Matrix[${from.label}][${to.label}] = Matrix[${to.label}][${from.label}] = ${weighted ? edge.weight : 1}`,
      ),
    );

    return steps;
  }

  static removeEdge(
    graph: GraphData,
    directed: boolean,
    weighted: boolean,
    edgeId: string,
  ): GraphDSStep[] {
    const steps: GraphDSStep[] = [];
    const edge = graph.edges.find((e) => e.id === edgeId);

    if (!edge) {
      steps.push(
        snap(graph, directed, weighted, {}, {}, `Edge not found`, {
          isMajorStep: true,
        }),
      );
      return steps;
    }

    const from = graph.nodes.find((n) => n.id === edge.from);
    const to = graph.nodes.find((n) => n.id === edge.to);

    steps.push(
      snap(
        graph,
        directed,
        weighted,
        { [edge.from]: "active", [edge.to]: "active" },
        { [edge.id]: "active" },
        `removeEdge("${from?.label}", "${to?.label}")`,
        { subMessage: "Removing from all representations", isMajorStep: true },
      ),
    );

    steps.push(
      snap(
        graph,
        directed,
        weighted,
        { [edge.from]: "highlight", [edge.to]: "highlight" },
        { [edge.id]: "removing" },
        `Found edge — removing`,
      ),
    );

    const newGraph: GraphData = {
      ...graph,
      edges: graph.edges.filter((e) => e.id !== edgeId),
    };

    steps.push(
      snap(
        newGraph,
        directed,
        weighted,
        {},
        {},
        `Edge "${from?.label}" → "${to?.label}" removed`,
        {
          subMessage: "Adjacency list, matrix, and edge list updated",
          isMajorStep: true,
        },
      ),
    );

    return steps;
  }
}

// ── Representation builders ───────────────────────────────────────────────────

export function buildAdjList(
  graph: GraphData,
  edgeStates: Record<string, EdgeState>,
  directed: boolean,
  weighted: boolean,
): Record<string, Array<{ label: string; weight?: number; state: EdgeState }>> {
  const result: Record<
    string,
    Array<{ label: string; weight?: number; state: EdgeState }>
  > = {};
  graph.nodes.forEach((n) => (result[n.label] = []));
  const byId = Object.fromEntries(graph.nodes.map((n) => [n.id, n]));

  graph.edges.forEach((e) => {
    const from = byId[e.from];
    const to = byId[e.to];
    if (!from || !to) return;
    const state = edgeStates[e.id] ?? "idle";
    result[from.label].push({
      label: to.label,
      ...(weighted ? { weight: e.weight } : {}),
      state,
    });
    if (!directed) {
      result[to.label].push({
        label: from.label,
        ...(weighted ? { weight: e.weight } : {}),
        state,
      });
    }
  });

  return result;
}

export function buildMatrix(
  graph: GraphData,
  edgeStates: Record<string, EdgeState>,
  directed: boolean,
  weighted: boolean,
): {
  labels: string[];
  matrix: (number | null)[][];
  cellStates: EdgeState[][];
} {
  const n = graph.nodes.length;
  const labels = graph.nodes.map((v) => v.label);
  const matrix: (number | null)[][] = Array.from({ length: n }, () =>
    Array<number | null>(n).fill(null),
  );
  const cellStates: EdgeState[][] = Array.from({ length: n }, () =>
    Array<EdgeState>(n).fill("idle" as EdgeState),
  );

  graph.edges.forEach((e) => {
    const fi = graph.nodes.findIndex((v) => v.id === e.from);
    const ti = graph.nodes.findIndex((v) => v.id === e.to);
    if (fi === -1 || ti === -1) return;
    const val = weighted ? e.weight : 1;
    const state = edgeStates[e.id] ?? "idle";
    matrix[fi][ti] = val;
    cellStates[fi][ti] = state;
    if (!directed) {
      matrix[ti][fi] = val;
      cellStates[ti][fi] = state;
    }
  });

  return { labels, matrix, cellStates };
}

// ── Empty step ────────────────────────────────────────────────────────────────

export const EMPTY_GRAPH_DS_STEP = (
  directed: boolean,
  weighted: boolean,
): GraphDSStep => ({
  graph: { nodes: [], edges: [] },
  nodeStates: {},
  edgeStates: {},
  directed,
  weighted,
  message: "Add vertices to get started",
  subMessage: "Then connect them with edges",
});
