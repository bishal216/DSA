import { useState, useCallback, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import GraphCanvas from "@/algorithms/components/graphCanvas";
import AlgorithmControls from "@/algorithms/components/algorithmControls";
import GraphEditor from "@/algorithms/components/graphEditor";
import StepDisplay from "@/algorithms/components/stepDisplay";
import { Node, Edge, GraphData, AlgorithmStep } from "@/algorithms/types/graph";
import { runKruskal, runPrim } from "@/algorithms/utils/mstAlgorithms";
import toast from "react-hot-toast";
const MSTPage = () => {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [
      { id: "A", x: 200, y: 150, label: "A" },
      { id: "B", x: 350, y: 100, label: "B" },
      { id: "C", x: 500, y: 150, label: "C" },
      { id: "D", x: 200, y: 300, label: "D" },
      { id: "E", x: 350, y: 350, label: "E" },
      { id: "F", x: 500, y: 300, label: "F" },
    ],
    edges: [
      { id: "AB", from: "A", to: "B", weight: 4 },
      { id: "AC", from: "A", to: "C", weight: 3 },
      { id: "AD", from: "A", to: "D", weight: 2 },
      { id: "BC", from: "B", to: "C", weight: 6 },
      { id: "BE", from: "B", to: "E", weight: 5 },
      { id: "CD", from: "C", to: "D", weight: 1 },
      { id: "CE", from: "C", to: "E", weight: 7 },
      { id: "CF", from: "C", to: "F", weight: 8 },
      { id: "DE", from: "D", to: "E", weight: 3 },
      { id: "EF", from: "E", to: "F", weight: 2 },
    ],
  });

  const [algorithm, setAlgorithm] = useState<"kruskal" | "prim">("kruskal");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [edgeFromNode, setEdgeFromNode] = useState<string>("");
  const [edgeToNode, setEdgeToNode] = useState<string>("");
  const [edgeWeight, setEdgeWeight] = useState<string>("");
  const intervalRef = useRef<number | null>(null);

  const generateSteps = useCallback(() => {
    if (algorithm === "kruskal") {
      return runKruskal(graphData);
    } else {
      return runPrim(graphData);
    }
  }, [algorithm, graphData]);

  useEffect(() => {
    const newSteps = generateSteps();
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [generateSteps]);

  const handlePlay = () => {
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            return prev;
          }
          return prev + 1;
        });
      }, 1500);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const handleNodeClick = (nodeId: string) => {
    // Only used for dragging now, no logic
    console.log(`Node clicked: ${nodeId}`);
    // You can implement any additional logic here if needed
    // For example, you could highlight the node or show its details
    // For now, we just log the node ID
    // This is a placeholder for any future functionality
  };
  const handleNodeMove = (nodeId: string, x: number, y: number) => {
    setGraphData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === nodeId ? { ...node, x, y } : node,
      ),
    }));
  };

  const addNode = () => {
    const nodeId = String.fromCharCode(65 + graphData.nodes.length);
    const newNode: Node = {
      id: nodeId,
      x: 350, // Center position
      y: 200,
      label: nodeId,
    };
    setGraphData((prev) => ({
      ...prev,
      nodes: [...prev.nodes, newNode],
    }));
    toast.success(`Added node ${nodeId} - drag to reposition`);
  };

  const addEdge = () => {
    if (!edgeFromNode || !edgeToNode || !edgeWeight) {
      toast.error("Please fill in all fields");
      return;
    }

    if (edgeFromNode === edgeToNode) {
      toast.error("Cannot create edge to the same node");
      return;
    }

    const weight = parseInt(edgeWeight);
    if (isNaN(weight) || weight <= 0) {
      toast.error("Weight must be a positive number");
      return;
    }

    // Check if edge already exists
    const edgeExists = graphData.edges.some(
      (edge) =>
        (edge.from === edgeFromNode && edge.to === edgeToNode) ||
        (edge.from === edgeToNode && edge.to === edgeFromNode),
    );

    if (edgeExists) {
      toast.error("Edge already exists between these nodes");
      return;
    }

    const newEdge: Edge = {
      id: `${edgeFromNode}${edgeToNode}`,
      from: edgeFromNode,
      to: edgeToNode,
      weight,
    };

    setGraphData((prev) => ({
      ...prev,
      edges: [...prev.edges, newEdge],
    }));

    // Clear form
    setEdgeFromNode("");
    setEdgeToNode("");
    setEdgeWeight("");

    toast.success(
      `Added edge ${edgeFromNode}-${edgeToNode} with weight ${weight}`,
    );
  };

  const clearGraph = () => {
    setGraphData({ nodes: [], edges: [] });
    setCurrentStep(0);
    setIsPlaying(false);
    setEdgeFromNode("");
    setEdgeToNode("");
    setEdgeWeight("");
    toast.success("Graph cleared");
  };

  const generateRandomGraph = () => {
    const nodeCount = Math.floor(Math.random() * 3) + 5; // 5-7 nodes
    const nodes: Node[] = [];
    const edges: Edge[] = [];

    // Generate random nodes
    for (let i = 0; i < nodeCount; i++) {
      const nodeId = String.fromCharCode(65 + i);
      nodes.push({
        id: nodeId,
        x: Math.random() * 400 + 100, // Random x between 100-500
        y: Math.random() * 200 + 100, // Random y between 100-300
        label: nodeId,
      });
    }

    // Generate random edges (ensure graph is connected)
    const usedPairs = new Set<string>();

    // First, create a minimum spanning tree to ensure connectivity
    for (let i = 1; i < nodeCount; i++) {
      const fromIdx = Math.floor(Math.random() * i);
      const toIdx = i;
      const weight = Math.floor(Math.random() * 9) + 1; // Weight 1-9

      edges.push({
        id: `${nodes[fromIdx].id}${nodes[toIdx].id}`,
        from: nodes[fromIdx].id,
        to: nodes[toIdx].id,
        weight,
      });

      usedPairs.add(`${fromIdx}-${toIdx}`);
      usedPairs.add(`${toIdx}-${fromIdx}`);
    }

    // Add some additional random edges
    const additionalEdges = Math.floor(Math.random() * 3) + 2; // 2-4 additional edges
    for (let i = 0; i < additionalEdges; i++) {
      const fromIdx = Math.floor(Math.random() * nodeCount);
      const toIdx = Math.floor(Math.random() * nodeCount);

      if (fromIdx !== toIdx && !usedPairs.has(`${fromIdx}-${toIdx}`)) {
        const weight = Math.floor(Math.random() * 9) + 1;

        edges.push({
          id: `${nodes[fromIdx].id}${nodes[toIdx].id}`,
          from: nodes[fromIdx].id,
          to: nodes[toIdx].id,
          weight,
        });

        usedPairs.add(`${fromIdx}-${toIdx}`);
        usedPairs.add(`${toIdx}-${fromIdx}`);
      }
    }

    setGraphData({ nodes, edges });
    setCurrentStep(0);
    setIsPlaying(false);
    setEdgeFromNode("");
    setEdgeToNode("");
    setEdgeWeight("");

    toast.success(
      `Generated random graph with ${nodeCount} nodes and ${edges.length} edges`,
    );
  };

  const currentStepData = steps[currentStep] || {
    mstEdges: [],
    currentEdge: null,
    rejectedEdges: [],
    description: "Ready to start",
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-6">
            <GraphCanvas
              graphData={graphData}
              mstEdges={currentStepData.mstEdges}
              currentEdge={currentStepData.currentEdge}
              rejectedEdges={currentStepData.rejectedEdges}
              selectedNodes={[]}
              onNodeClick={handleNodeClick}
              onNodeMove={handleNodeMove}
              mode="view"
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <AlgorithmControls
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          isPlaying={isPlaying}
          handlePlay={handlePlay}
          handleReset={handleReset}
          currentStep={currentStep}
          totalSteps={steps.length}
        />

        <GraphEditor
          graphData={graphData}
          addNode={addNode}
          addEdge={addEdge}
          clearGraph={clearGraph}
          generateRandomGraph={generateRandomGraph}
          edgeFromNode={edgeFromNode}
          setEdgeFromNode={setEdgeFromNode}
          edgeToNode={edgeToNode}
          setEdgeToNode={setEdgeToNode}
          edgeWeight={edgeWeight}
          setEdgeWeight={setEdgeWeight}
        />

        <StepDisplay
          description={currentStepData.description}
          currentEdge={currentStepData.currentEdge}
        />
      </div>
    </div>
  );
};

export default MSTPage;
