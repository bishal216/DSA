import { useState, useCallback, useEffect, useMemo } from "react";
import GraphCanvas from "@/algorithms/components/graphCanvas";
import AlgorithmControls from "@/algorithms/components/GraphAlgorithmControls";
import GraphEditor from "@/algorithms/components/GraphEditor";
import StepDisplay from "@/algorithms/components/stepDisplay";
import { MSTAlgorithmStep } from "@/algorithms/types/graph";
import { runKruskal } from "@/algorithms/utils/mst/kruskal";
import { runPrim } from "@/algorithms/utils/mst/prim";
import { runReverseDelete } from "../utils/mst/reverse-delete";
import { runBoruvka } from "../utils/mst/boruvka";
import { useGraphManipulation } from "@/algorithms/hooks/useGraphManipulation";
import { usePlayback } from "@/algorithms/hooks/usePlayback";

const MSTPage = () => {
  const {
    graphData,
    handleAddNode,
    handleAddEdge,
    edgeFromNode,
    setEdgeFromNode,
    edgeToNode,
    setEdgeToNode,
    edgeWeight,
    setEdgeWeight,
    updateNodePosition,
    handleClearGraph,
    nodeCount,
    setNodeCount,
    edgeCount,
    setEdgeCount,
  } = useGraphManipulation();

  const [algorithm, setAlgorithm] = useState<
    "kruskal" | "prim" | "reverse-delete" | "boruvka"
  >("kruskal");

  const [steps, setSteps] = useState<MSTAlgorithmStep[]>([]);

  const {
    currentStep,
    setCurrentStep,
    isPlaying,
    setIsPlaying,
    play,
    reset,
    stepForward,
    stepBackward,
  } = usePlayback(steps.length);

  const generateSteps = useCallback(() => {
    if (algorithm === "kruskal") {
      return runKruskal(graphData);
    } else if (algorithm === "reverse-delete") {
      return runReverseDelete(graphData);
    } else if (algorithm === "boruvka") {
      return runBoruvka(graphData);
    } else {
      // Default to Prim's algorithm
      return runPrim(graphData);
    }
  }, [algorithm, graphData]);

  useEffect(() => {
    const newSteps = generateSteps();
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [generateSteps, setIsPlaying, setCurrentStep]);

  const currentStepData = useMemo(
    () =>
      steps[currentStep] || {
        mstEdges: [],
        currentEdge: null,
        rejectedEdges: [],
        description: "Ready to start",
      },
    [steps, currentStep],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="space-y-4">
        <AlgorithmControls
          algorithms={[
            { value: "kruskal", label: "Kruskal's Algorithm" },
            { value: "prim", label: "Prim's Algorithm" },
            { value: "reverse-delete", label: "Reverse Delete Algorithm" },
            // { value: "boruvka", label: "Boruvka's Algorithm" },
          ]}
          selectedAlgorithm={algorithm}
          setSelectedAlgorithm={(value) =>
            setAlgorithm(
              value as "kruskal" | "prim" | "reverse-delete" | "boruvka",
            )
          }
          isPlaying={isPlaying}
          handlePlay={play}
          handleReset={reset}
          handleStepForward={stepForward}
          handleStepBackward={stepBackward}
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
          graph={graphData}
          defaultNodes={graphData.nodes}
          defaultEdges={graphData.edges}
          candidateEdges={currentStepData.frontierEdges}
          currentEdge={currentStepData.currentEdge}
          visitedNodes={currentStepData.visitedNodes}
          visitedEdges={currentStepData.mstEdges}
          rejectedEdges={currentStepData.rejectedEdges}
          onNodeMove={updateNodePosition}
        />
        <StepDisplay
          step={currentStepData}
          algorithm={algorithm}
          graphData={graphData}
        />
      </div>
    </div>
  );
};

export default MSTPage;
