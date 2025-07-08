import { useState, useCallback, useEffect, useRef } from "react";
import GraphCanvas from "@/algorithms/components/graphCanvas";
import AlgorithmControls from "@/algorithms/components/algorithmControls";
import GraphEditor from "@/algorithms/components/graphEditor";
import StepDisplay from "@/algorithms/components/stepDisplay";
import { Node, Edge, AlgorithmStep } from "@/algorithms/types/graph";
import { runKruskal, runPrim } from "@/algorithms/utils/mstAlgorithms";
import { useGraph } from "@/algorithms/hooks/useGraph";

const MSTPage = () => {
  const {
    graphData,
    addNode,
    addEdge,
    updateNodePosition,
    clearGraph,
    generateRandomGraph,
  } = useGraph();
  const [nodeCount, setNodeCount] = useState(5);
  const [edgeCount, setEdgeCount] = useState(10);
  const [algorithm, setAlgorithm] = useState<"kruskal" | "prim">("kruskal");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [edgeFromNode, setEdgeFromNode] = useState<string>("");
  const [edgeToNode, setEdgeToNode] = useState<string>("");
  const [edgeWeight, setEdgeWeight] = useState<string>("");

  const intervalRef = useRef<number | null>(null);

  // Auto-generate graph on nodeCount or edgeCount change
  useEffect(() => {
    generateRandomGraph(nodeCount, edgeCount);
    setCurrentStep(0);
    setIsPlaying(false);
    setEdgeFromNode("");
    setEdgeToNode("");
    setEdgeWeight("");
  }, [nodeCount, edgeCount, generateRandomGraph]);
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
      intervalRef.current = window.setInterval(() => {
        setCurrentStep((prev) => {
          if (prev >= steps.length - 1) {
            setIsPlaying(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
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
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const handleAddNode = () => {
    // You can add some logic for node id and position here if needed
    const nodeId = String.fromCharCode(65 + graphData.nodes.length);
    const newNode: Node = {
      id: nodeId,
      x: 350,
      y: 200,
      label: nodeId,
    };
    addNode(newNode);
  };

  const handleAddEdge = () => {
    if (!edgeFromNode || !edgeToNode || !edgeWeight) {
      return;
    }

    if (edgeFromNode === edgeToNode) {
      return;
    }

    const weight = parseInt(edgeWeight, 10);
    if (isNaN(weight) || weight <= 0) {
      return;
    }

    // Check if edge exists already
    const edgeExists = graphData.edges.some(
      (edge) =>
        (edge.from === edgeFromNode && edge.to === edgeToNode) ||
        (edge.from === edgeToNode && edge.to === edgeFromNode),
    );

    if (edgeExists) {
      return;
    }

    const newEdge: Edge = {
      id: `${edgeFromNode}${edgeToNode}`,
      from: edgeFromNode,
      to: edgeToNode,
      weight,
    };

    addEdge(newEdge);

    setEdgeFromNode("");
    setEdgeToNode("");
    setEdgeWeight("");
  };

  const handleClearGraph = () => {
    clearGraph();
    setCurrentStep(0);
    setIsPlaying(false);
    setEdgeFromNode("");
    setEdgeToNode("");
    setEdgeWeight("");
  };

  const currentStepData = steps[currentStep] || {
    mstEdges: [],
    currentEdge: null,
    rejectedEdges: [],
    description: "Ready to start",
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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
          addNode={handleAddNode}
          addEdge={handleAddEdge}
          clearGraph={handleClearGraph}
          edgeFromNode={edgeFromNode}
          setEdgeFromNode={setEdgeFromNode}
          edgeToNode={edgeToNode}
          setEdgeToNode={setEdgeToNode}
          edgeWeight={edgeWeight}
          setEdgeWeight={setEdgeWeight}
          nodeCount={nodeCount}
          setNodeCount={setNodeCount}
          edgeCount={edgeCount}
          setEdgeCount={setEdgeCount}
        />
      </div>
      <div className="lg:col-span-3">
        <GraphCanvas
          graphData={graphData}
          mstEdges={currentStepData.mstEdges}
          currentEdge={currentStepData.currentEdge}
          rejectedEdges={currentStepData.rejectedEdges}
          selectedNodes={[]}
          onNodeMove={updateNodePosition}
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
