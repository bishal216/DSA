// src/hooks/use-graph.ts
import { Edge, GraphData, Node } from "@/algorithms/types/graph";
import { useCallback, useEffect, useRef, useState } from "react";

export const useGraph = () => {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });

  // Snapshot of the graph at last load/generate — used for reset
  const [initialGraphData, setInitialGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });

  const initialized = useRef(false);

  const loadInitialGraph = () => {
    const initialNodes: Node[] = [
      { id: "A", x: 100, y: 100, label: "A" },
      { id: "B", x: 200, y: 200, label: "B" },
    ];
    const initialEdges: Edge[] = [{ id: "AB", from: "A", to: "B", weight: 1 }];
    setGraphData({ nodes: initialNodes, edges: initialEdges });
    setInitialGraphData({ nodes: initialNodes, edges: initialEdges });
  };

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      loadInitialGraph();
    }
  }, []);

  // Reset to the last loaded/generated snapshot
  const resetGraph = () => {
    setGraphData(initialGraphData);
  };

  const addNode = (node: Node) => {
    setGraphData((prev) => {
      if (prev.nodes.some((n) => n.id === node.id)) return prev;
      return { ...prev, nodes: [...prev.nodes, node] };
    });
  };

  const addEdge = (edge: Edge) => {
    setGraphData((prev) => {
      if (prev.edges.some((e) => e.id === edge.id)) return prev;
      return { ...prev, edges: [...prev.edges, edge] };
    });
  };

  const removeNode = (nodeId: string) => {
    setGraphData((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((node) => node.id !== nodeId),
      edges: prev.edges.filter(
        (edge) => edge.from !== nodeId && edge.to !== nodeId,
      ),
    }));
  };

  const removeEdge = (edgeId: string) => {
    setGraphData((prev) => ({
      ...prev,
      edges: prev.edges.filter((edge) => edge.id !== edgeId),
    }));
  };

  const updateNodePosition = (nodeId: string, x: number, y: number) => {
    setGraphData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === nodeId ? { ...node, x, y } : node,
      ),
    }));
  };

  const clearGraph = () => {
    setGraphData({ nodes: [], edges: [] });
  };

  const generateRandomGraph = useCallback(
    (nodeCount: number, edgeCount: number) => {
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      const usedPairs = new Set<string>();

      for (let i = 0; i < nodeCount; i++) {
        const id = String.fromCharCode(65 + i);
        newNodes.push({
          id,
          label: id,
          x: Math.floor(Math.random() * 600) + 50,
          y: Math.floor(Math.random() * 400) + 50,
        });
      }

      const maxEdges = (nodeCount * (nodeCount - 1)) / 2;
      const totalEdges = Math.min(edgeCount, maxEdges);

      while (newEdges.length < totalEdges) {
        const fromIdx = Math.floor(Math.random() * nodeCount);
        let toIdx = Math.floor(Math.random() * nodeCount);
        while (toIdx === fromIdx) {
          toIdx = Math.floor(Math.random() * nodeCount);
        }

        const from = newNodes[fromIdx].id;
        const to = newNodes[toIdx].id;
        const key = [from, to].sort().join("-");

        if (usedPairs.has(key)) continue;
        usedPairs.add(key);

        newEdges.push({
          id: key,
          from,
          to,
          weight: Math.floor(Math.random() * 20) + 1,
        });
      }

      const generated = { nodes: newNodes, edges: newEdges };
      setGraphData(generated);
      setInitialGraphData(generated); // snapshot for reset
    },
    [],
  );

  return {
    graphData,
    addNode,
    addEdge,
    removeNode,
    removeEdge,
    updateNodePosition,
    clearGraph,
    resetGraph,
    generateRandomGraph,
  };
};
