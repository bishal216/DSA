// Wraps the existing algorithm GraphCanvas for the data structure page.
// The only difference between the two is state type names — this adapter
// maps DS states → algorithm states so no changes are needed to the original.

import type {
  EdgeState as AlgoEdgeState,
  NodeState as AlgoNodeState,
  GraphData,
} from "@/algorithms/types/graph";
import GraphCanvas from "@/components/algorithms/graph/graph-canvas";
import type {
  EdgeState as DSEdgeState,
  NodeState as DSNodeState,
} from "@/data-structures/graph-ds";

interface Props {
  graph: GraphData;
  nodeStates: Record<string, DSNodeState>;
  edgeStates: Record<string, DSEdgeState>;
  directed: boolean;
  onNodeMove: (nodeId: string, x: number, y: number) => void;
}

const NODE_STATE_MAP: Record<DSNodeState, AlgoNodeState> = {
  idle: "default",
  active: "current",
  adding: "visited",
  removing: "rejected",
  highlight: "candidate",
};

const EDGE_STATE_MAP: Record<DSEdgeState, AlgoEdgeState> = {
  idle: "default",
  active: "current",
  adding: "tree",
  removing: "rejected",
  highlight: "candidate",
};

export function GraphDSCanvas({
  graph,
  nodeStates,
  edgeStates,
  directed,
  onNodeMove,
}: Props) {
  const mappedNodeStates: Record<string, AlgoNodeState> = {};
  for (const [id, state] of Object.entries(nodeStates)) {
    mappedNodeStates[id] = NODE_STATE_MAP[state];
  }

  const mappedEdgeStates: Record<string, AlgoEdgeState> = {};
  for (const [id, state] of Object.entries(edgeStates)) {
    mappedEdgeStates[id] = EDGE_STATE_MAP[state];
  }

  return (
    <GraphCanvas
      graph={graph}
      nodeStates={mappedNodeStates}
      edgeStates={mappedEdgeStates}
      onNodeMove={onNodeMove}
      directed={directed}
    />
  );
}
