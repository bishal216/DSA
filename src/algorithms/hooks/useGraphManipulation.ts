import { useCallback, useEffect, useState } from "react";
import { useGraph } from "@/algorithms/hooks/useGraph";

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
  const [edgeFromNode, setEdgeFromNode] = useState<string>("");
  const [edgeToNode, setEdgeToNode] = useState<string>("");
  const [edgeWeight, setEdgeWeight] = useState<number>(0);

  const [edgeForm, setEdgeForm] = useState({
    from: "",
    to: "",
    weight: "",
  });

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
    const nodeCount = graphData.nodes.length;
    const nodeId = String.fromCharCode(65 + nodeCount);
    addNode({
      id: nodeId,
      x: 350,
      y: 200,
      label: nodeId,
    });
  }, [graphData.nodes, addNode]);

  const handleAddEdge = useCallback(() => {
    const { from, to, weight } = edgeForm;

    if (!from || !to || !weight) return;
    console.log("Adding edge:", from, to, weight);
    if (from === to) return;

    const weightNum = parseInt(weight, 10);
    if (isNaN(weightNum)) return;

    const edgeExists = graphData.edges.some(
      (edge) =>
        (edge.from === from && edge.to === to) ||
        (edge.from === to && edge.to === from),
    );
    if (edgeExists) return;

    addEdge({
      id: `${from}${to}`,
      from,
      to,
      weight: weightNum,
    });

    resetEdgeForm();
  }, [edgeForm, graphData.edges, addEdge, resetEdgeForm]);

  const handleClearGraph = useCallback(() => {
    clearGraph();
    resetEdgeForm();
  }, [clearGraph, resetEdgeForm]);

  useEffect(() => {
    setEdgeForm({
      from: edgeFromNode,
      to: edgeToNode,
      weight: String(edgeWeight),
    });
  }, [edgeFromNode, edgeToNode, edgeWeight]);

  useEffect(() => {
    generateRandomGraph(nodeCount, edgeCount);
  }, [nodeCount, edgeCount, generateRandomGraph]);

  return {
    graphData,
    updateNodePosition,
    generateRandomGraph,
    resetGraph,
    edgeForm,
    handleEdgeFormChange,
    handleAddNode,
    handleAddEdge,
    edgeFromNode,
    setEdgeFromNode,
    edgeToNode,
    setEdgeToNode,
    edgeWeight,
    setEdgeWeight,
    handleClearGraph,
    nodeCount,
    setNodeCount,
    edgeCount,
    setEdgeCount,
  };
}
