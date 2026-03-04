// src/algorithms/utils/graph-algorithms/scc-algorithms/tarjan.ts

import type { GraphAlgorithmDefinition } from "@/algorithms/registry/graph-algorithms-registry";
import type {
  GraphData,
  GraphStep,
  SCCStepMetadata,
} from "@/algorithms/types/graph";

const SCC_COLORS: Array<GraphStep["nodeStates"][string]> = [
  "visited",
  "candidate",
  "component",
  "rejected",
  "current",
];

function buildStep(
  stepType: GraphStep["stepType"],
  message: string,
  subMessage: string,
  activeNodeId: string | null,
  stack: string[],
  disc: Record<string, number>,
  low: Record<string, number>,
  components: string[][],
  componentIndex: Record<string, number>,
  graph: GraphData,
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep["nodeStates"] = {};
  const edgeStates: GraphStep["edgeStates"] = {};

  for (const [nodeId, idx] of Object.entries(componentIndex)) {
    nodeStates[nodeId] = SCC_COLORS[idx % SCC_COLORS.length];
  }
  for (const id of stack) nodeStates[id] ??= "candidate";
  for (const id of Object.keys(disc)) nodeStates[id] ??= "visited";
  if (activeNodeId) nodeStates[activeNodeId] = "current";

  for (const edge of graph.edges) {
    const fromComp = componentIndex[edge.from];
    const toComp = componentIndex[edge.to];
    if (fromComp !== undefined && fromComp === toComp) {
      edgeStates[edge.id] = "tree";
    } else if (fromComp !== undefined && toComp !== undefined) {
      edgeStates[edge.id] = "cross";
    } else if (disc[edge.from] !== undefined && disc[edge.to] !== undefined) {
      // Back edge — to node is an ancestor on the stack
      if (stack.includes(edge.to)) edgeStates[edge.id] = "back";
    }
  }

  // Use finishTime as low-link values for display
  const metadata: SCCStepMetadata = {
    discoveryTime: { ...disc },
    finishTime: { ...low }, // repurposing finishTime to show low-link in display
    components: components.map((c) => [...c]),
    stack: [...stack],
    componentIndex: { ...componentIndex },
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

function tarjan(graphData: GraphData): GraphStep[] {
  const steps: GraphStep[] = [];
  const { nodes, edges } = graphData;
  if (nodes.length === 0) return steps;

  const nodeIds = nodes.map((n) => n.id);

  const adj: Record<string, string[]> = {};
  for (const id of nodeIds) adj[id] = [];
  for (const e of edges) adj[e.from].push(e.to);

  const disc: Record<string, number> = {};
  const low: Record<string, number> = {};
  const onStack: Record<string, boolean> = {};
  const stack: string[] = [];
  const components: string[][] = [];
  const componentIndex: Record<string, number> = {};
  let timer = 0;

  steps.push(
    buildStep(
      "initial",
      "Tarjan's: single-pass DFS using low-link values",
      "disc[v] = discovery time. low[v] = lowest disc reachable from v's subtree. SCC root: low[v] == disc[v].",
      null,
      [],
      disc,
      low,
      components,
      componentIndex,
      graphData,
      true,
    ),
  );

  const dfs = (nodeId: string) => {
    disc[nodeId] = low[nodeId] = timer++;
    stack.push(nodeId);
    onStack[nodeId] = true;

    steps.push(
      buildStep(
        "discover",
        `Discovered ${nodeId} — disc=${disc[nodeId]}, low=${low[nodeId]}`,
        `Stack: [${stack.join(", ")}]`,
        nodeId,
        [...stack],
        disc,
        low,
        components,
        componentIndex,
        graphData,
      ),
    );

    for (const neighbour of adj[nodeId]) {
      if (disc[neighbour] === undefined) {
        // Tree edge
        dfs(neighbour);
        low[nodeId] = Math.min(low[nodeId], low[neighbour]);

        steps.push(
          buildStep(
            "discover",
            `Back from ${neighbour} — updating low[${nodeId}] = min(${low[nodeId]}, low[${neighbour}]) = ${low[nodeId]}`,
            `disc=${disc[nodeId]}, low=${low[nodeId]}`,
            nodeId,
            [...stack],
            disc,
            low,
            components,
            componentIndex,
            graphData,
          ),
        );
      } else if (onStack[neighbour]) {
        // Back edge — neighbour is ancestor on stack
        low[nodeId] = Math.min(low[nodeId], disc[neighbour]);

        steps.push(
          buildStep(
            "discover",
            `Back edge to ${neighbour} — low[${nodeId}] = min(${low[nodeId]}, disc[${neighbour}]) = ${low[nodeId]}`,
            `${neighbour} is an ancestor on the stack`,
            nodeId,
            [...stack],
            disc,
            low,
            components,
            componentIndex,
            graphData,
          ),
        );
      }
    }

    // SCC root: low[v] == disc[v]
    if (low[nodeId] === disc[nodeId]) {
      const component: string[] = [];

      steps.push(
        buildStep(
          "scc",
          `SCC root found at ${nodeId} — low[${nodeId}] = disc[${nodeId}] = ${disc[nodeId]}`,
          "Popping stack until we reach this node.",
          nodeId,
          [...stack],
          disc,
          low,
          components,
          componentIndex,
          graphData,
          true,
        ),
      );

      while (true) {
        const top = stack.pop()!;
        onStack[top] = false;
        component.push(top);
        componentIndex[top] = components.length;

        if (top === nodeId) break;
      }

      components.push([...component]);

      steps.push(
        buildStep(
          "scc",
          `SCC ${components.length} found: {${component.join(", ")}}`,
          `${components.length} SCC${components.length !== 1 ? "s" : ""} discovered so far`,
          null,
          [...stack],
          disc,
          low,
          components,
          componentIndex,
          graphData,
          true,
        ),
      );
    }
  };

  for (const id of nodeIds) {
    if (disc[id] === undefined) dfs(id);
  }

  steps.push(
    buildStep(
      "complete",
      `Tarjan's complete — ${components.length} strongly connected component${components.length !== 1 ? "s" : ""} found`,
      components.map((c, i) => `SCC ${i + 1}: {${c.join(", ")}}`).join(" | "),
      null,
      [],
      disc,
      low,
      components,
      componentIndex,
      graphData,
      true,
    ),
  );

  return steps;
}

export const definition: GraphAlgorithmDefinition = {
  key: "tarjan",
  name: "Tarjan's Algorithm",
  category: "scc",
  func: tarjan,
};
