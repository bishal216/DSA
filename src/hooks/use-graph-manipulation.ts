// src/hooks/use-graph-manipulation.ts
import { useGraph } from "@/hooks/use-graph";
import { useCallback, useEffect, useRef, useState } from "react";

export function useGraphManipulation() {
  const {
    graphData,
    addNode,
    addEdge,
    updateNodePosition,
    clearGraph,
    generateRandomGraph,
    resetGraph,
  } = useGraph();

  const [nodeCount, setNodeCount] = useState(5);
  const [edgeCount, setEdgeCount] = useState(10);

  const [edgeForm, setEdgeForm] = useState({
    from: "",
    to: "",
    weight: "",
  });

  // Generate once on mount only — user controls nodeCount/edgeCount
  // and calls generateRandomGraph explicitly via the returned function
  const didMount = useRef(false);
  useEffect(() => {
    if (!didMount.current) {
      didMount.current = true;
      generateRandomGraph(nodeCount, edgeCount);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const resetEdgeForm = useCallback(() => {
    setEdgeForm({ from: "", to: "", weight: "" });
  }, []);

  const handleEdgeFormChange = useCallback(
    (field: keyof typeof edgeForm, value: string) => {
      setEdgeForm((prev) => ({ ...prev, [field]: value }));
    },
    [],
  );

  const handleAddNode = useCallback(() => {
    const count = graphData.nodes.length;
    const nodeId = String.fromCharCode(65 + count);
    addNode({ id: nodeId, x: 350, y: 200, label: nodeId });
  }, [graphData.nodes, addNode]);

  const handleAddEdge = useCallback(() => {
    const { from, to, weight } = edgeForm;

    if (!from || !to || !weight) return;
    if (from === to) return;

    const weightNum = parseInt(weight, 10);
    if (isNaN(weightNum)) return;

    const edgeExists = graphData.edges.some(
      (edge) =>
        (edge.from === from && edge.to === to) ||
        (edge.from === to && edge.to === from),
    );
    if (edgeExists) return;

    addEdge({ id: `${from}${to}`, from, to, weight: weightNum });
    resetEdgeForm();
  }, [edgeForm, graphData.edges, addEdge, resetEdgeForm]);

  const handleClearGraph = useCallback(() => {
    clearGraph();
    resetEdgeForm();
  }, [clearGraph, resetEdgeForm]);

  const handleGenerateRandom = useCallback(() => {
    generateRandomGraph(nodeCount, edgeCount);
    resetEdgeForm();
  }, [generateRandomGraph, nodeCount, edgeCount, resetEdgeForm]);

  return {
    graphData,
    updateNodePosition,
    resetGraph,
    edgeForm,
    handleEdgeFormChange,
    handleAddNode,
    handleAddEdge,
    handleClearGraph,
    handleGenerateRandom,
    nodeCount,
    setNodeCount,
    edgeCount,
    setEdgeCount,
  };
}
