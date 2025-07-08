import { useCallback, useState, useRef, useEffect } from "react";
import { Node, Edge, GraphData } from "@/algorithms/types/graph";

export const useGraph = () => {
  // ----- Graph State Management -----
  // State to hold the graph data
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });

  // State to hold a copy of the initial graph data
  // This is used to reset the graph to its initial state
  const [copyofGraphData, setCopyOfGraphData] = useState<GraphData>({
    nodes: [],
    edges: [],
  });
  // This ref is used to ensure the graph is initialized only once
  const initialized = useRef(false);

  //   ----- Graph Initialization -----
  // Initializing the graph with some default nodes and edges
  const loadInitialGraph = () => {
    const initialNodes: Node[] = [
      { id: "A", x: 100, y: 100, label: "A" },
      { id: "B", x: 200, y: 200, label: "B" },
    ];
    const initialEdges: Edge[] = [{ id: "AB", from: "A", to: "B", weight: 1 }];
    setGraphData({ nodes: initialNodes, edges: initialEdges });
    setCopyOfGraphData({ nodes: initialNodes, edges: initialEdges });
    initialized.current = true;
  };
  //    ----- Load Initial Graph -----
  // This effect runs once when the component mounts to load the initial graph
  useEffect(() => {
    if (!initialized.current) {
      loadInitialGraph();
      initialized.current = true;
    }
  }, []);

  //   ----- Graph Manipulation Functions -----
  // This function sets the graph data back to the initial state stored in copyofGraphData
  // It can be used to clear any changes made to the graph during the session
  const resetGraph = () => {
    setGraphData(copyofGraphData);
  };

  const addNode = (node: Node) => {
    setGraphData((prev) => {
      // Check if the node already exists in the graph
      // If it does, return the previous state to avoid duplicates
      // If it doesn't, add the new node to the graph
      if (prev.nodes.some((n) => n.id === node.id)) return prev;
      return { ...prev, nodes: [...prev.nodes, node] };
    });
  };

  const addEdge = (edge: Edge) => {
    setGraphData((prev) => {
      // Check if the edge already exists in the graph
      // If it does, return the previous state to avoid duplicates
      // If it doesn't, add the new edge to the graph
      if (prev.edges.some((e) => e.id === edge.id)) return prev;
      return { ...prev, edges: [...prev.edges, edge] };
    });
  };

  const removeNode = (nodeId: string) => {
    // Remove the node from the graph
    setGraphData((prev) => ({
      ...prev,
      nodes: prev.nodes.filter((node) => node.id !== nodeId),
      edges: prev.edges.filter(
        (edge) => edge.from !== nodeId && edge.to !== nodeId,
      ),
    }));
  };

  const removeEdge = (edgeId: string) => {
    // Remove the edge from the graph
    setGraphData((prev) => ({
      ...prev,
      edges: prev.edges.filter((edge) => edge.id !== edgeId),
    }));
  };

  const updateNodePosition = (nodeId: string, x: number, y: number) => {
    // For dragging nodes around the canvas
    // It updates the x and y coordinates of the node with the given nodeId
    // It uses the previous state to ensure that the update is based on the most recent graph
    setGraphData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === nodeId ? { ...node, x, y } : node,
      ),
    }));
  };

  const clearGraph = () => {
    // Clear the graph
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

      setGraphData({ nodes: newNodes, edges: newEdges });
      setCopyOfGraphData({ nodes: newNodes, edges: newEdges });
    },
    [],
  );

  useEffect(() => {
    setCopyOfGraphData(graphData);
  }, [graphData]);

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
