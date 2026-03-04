// src/algorithms/utils/graph-algorithms/scc-algorithms/kosaraju.ts

import type { GraphAlgorithmDefinition } from "@/algorithms/registry/graph-algorithms-registry";
import type {
  GraphData,
  GraphStep,
  SCCStepMetadata,
} from "@/algorithms/types/graph";

// SCC component colors cycle through these states
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
  stackNodes: string[],
  discoveryTime: Record<string, number>,
  finishTime: Record<string, number>,
  components: string[][],
  componentIndex: Record<string, number>,
  graph: GraphData,
  isMajorStep = false,
): GraphStep {
  const nodeStates: GraphStep["nodeStates"] = {};
  const edgeStates: GraphStep["edgeStates"] = {};

  // Color nodes by their component
  for (const [nodeId, idx] of Object.entries(componentIndex)) {
    nodeStates[nodeId] = SCC_COLORS[idx % SCC_COLORS.length];
  }
  // Stack nodes are candidates
  for (const id of stackNodes) nodeStates[id] ??= "candidate";
  // Currently visited but not yet assigned
  for (const id of Object.keys(discoveryTime)) nodeStates[id] ??= "visited";
  if (activeNodeId) nodeStates[activeNodeId] = "current";

  // Color tree edges within same component
  for (const edge of graph.edges) {
    const fromComp = componentIndex[edge.from];
    const toComp = componentIndex[edge.to];
    if (fromComp !== undefined && fromComp === toComp) {
      edgeStates[edge.id] = "tree";
    } else if (fromComp !== undefined && toComp !== undefined) {
      edgeStates[edge.id] = "cross";
    }
  }

  const metadata: SCCStepMetadata = {
    discoveryTime: { ...discoveryTime },
    finishTime: { ...finishTime },
    components: components.map((c) => [...c]),
    stack: [...stackNodes],
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

function kosaraju(graphData: GraphData): GraphStep[] {
  const steps: GraphStep[] = [];
  const { nodes, edges } = graphData;
  if (nodes.length === 0) return steps;

  const nodeIds = nodes.map((n) => n.id);

  // Build adjacency lists
  const adj: Record<string, string[]> = {};
  const radj: Record<string, string[]> = {}; // reversed graph
  for (const id of nodeIds) {
    adj[id] = [];
    radj[id] = [];
  }
  for (const e of edges) {
    adj[e.from].push(e.to);
    radj[e.to].push(e.from);
  }

  steps.push(
    buildStep(
      "initial",
      "Kosaraju's: two-pass DFS algorithm for SCCs",
      "Pass 1: DFS on original graph to record finish order. Pass 2: DFS on transposed graph in reverse finish order.",
      null,
      [],
      {},
      {},
      [],
      {},
      graphData,
      true,
    ),
  );

  // ── Pass 1: DFS on original graph, record finish order ───────────────────
  const visited1 = new Set<string>();
  const finishOrder: string[] = [];
  const discoveryTime: Record<string, number> = {};
  const finishTime: Record<string, number> = {};
  let timer = 0;

  steps.push(
    buildStep(
      "discover",
      "Pass 1: DFS on original graph to compute finish times",
      "Nodes will be pushed onto the finish stack in order of completion.",
      null,
      [],
      discoveryTime,
      finishTime,
      [],
      {},
      graphData,
      true,
    ),
  );

  const dfs1 = (nodeId: string) => {
    visited1.add(nodeId);
    discoveryTime[nodeId] = timer++;

    steps.push(
      buildStep(
        "discover",
        `Discovered node ${nodeId} (discovery time: ${discoveryTime[nodeId]})`,
        `DFS stack depth: ${Object.keys(discoveryTime).length - Object.keys(finishTime).length}`,
        nodeId,
        finishOrder,
        discoveryTime,
        finishTime,
        [],
        {},
        graphData,
      ),
    );

    for (const neighbour of adj[nodeId]) {
      if (!visited1.has(neighbour)) dfs1(neighbour);
    }

    finishTime[nodeId] = timer++;
    finishOrder.push(nodeId);

    steps.push(
      buildStep(
        "finish",
        `Finished node ${nodeId} (finish time: ${finishTime[nodeId]}) — pushed to stack`,
        `Finish stack: [${finishOrder.join(", ")}]`,
        nodeId,
        [...finishOrder],
        discoveryTime,
        finishTime,
        [],
        {},
        graphData,
      ),
    );
  };

  for (const id of nodeIds) {
    if (!visited1.has(id)) dfs1(id);
  }

  steps.push(
    buildStep(
      "process",
      `Pass 1 complete — finish order: [${finishOrder.join(", ")}]`,
      "Pass 2: DFS on transposed graph in reverse finish order.",
      null,
      [...finishOrder],
      discoveryTime,
      finishTime,
      [],
      {},
      graphData,
      true,
    ),
  );

  // ── Pass 2: DFS on transposed graph in reverse finish order ──────────────
  const visited2 = new Set<string>();
  const components: string[][] = [];
  const componentIndex: Record<string, number> = {};

  for (const startId of [...finishOrder].reverse()) {
    if (visited2.has(startId)) continue;

    const component: string[] = [];

    steps.push(
      buildStep(
        "scc",
        `Pass 2: starting DFS from ${startId} on transposed graph`,
        `This will discover one complete SCC`,
        startId,
        [...finishOrder],
        discoveryTime,
        finishTime,
        components,
        componentIndex,
        graphData,
        true,
      ),
    );

    const dfs2 = (nodeId: string) => {
      visited2.add(nodeId);
      component.push(nodeId);
      componentIndex[nodeId] = components.length;

      steps.push(
        buildStep(
          "discover",
          `Added ${nodeId} to SCC ${components.length + 1}`,
          `Current SCC: {${component.join(", ")}}`,
          nodeId,
          component,
          discoveryTime,
          finishTime,
          components,
          componentIndex,
          graphData,
        ),
      );

      for (const neighbour of radj[nodeId]) {
        if (!visited2.has(neighbour)) dfs2(neighbour);
      }
    };

    dfs2(startId);
    components.push([...component]);

    steps.push(
      buildStep(
        "scc",
        `SCC ${components.length} found: {${component.join(", ")}}`,
        `${components.length} SCC${components.length !== 1 ? "s" : ""} discovered so far`,
        null,
        [],
        discoveryTime,
        finishTime,
        components,
        componentIndex,
        graphData,
        true,
      ),
    );
  }

  steps.push(
    buildStep(
      "complete",
      `Kosaraju's complete — ${components.length} strongly connected component${components.length !== 1 ? "s" : ""} found`,
      components.map((c, i) => `SCC ${i + 1}: {${c.join(", ")}}`).join(" | "),
      null,
      [],
      discoveryTime,
      finishTime,
      components,
      componentIndex,
      graphData,
      true,
    ),
  );

  return steps;
}

export const definition: GraphAlgorithmDefinition = {
  key: "kosaraju",
  name: "Kosaraju's Algorithm",
  category: "scc",
  func: kosaraju,
};
