import type { MSTAlgorithmStep, Node } from "@/algorithms/types/graph";
import { runBoruvka } from "@/algorithms/utils/mst/boruvka";
import { runKruskal } from "@/algorithms/utils/mst/kruskal";
import { runPrim } from "@/algorithms/utils/mst/prim";
import { runReverseDelete } from "@/algorithms/utils/mst/reverse-delete";
import AlgorithmControls from "@/components/graph/GraphAlgorithmControls";
import GraphCanvas from "@/components/graph/GraphCanvas";
import GraphEditor from "@/components/graph/GraphEditor";
import StepDisplay from "@/components/graph/GraphMSTStepDisplay";
import { useGraphManipulation } from "@/hooks/use-graph-manipulation";
import { usePlayback } from "@/hooks/use-playback";
import { useCallback, useEffect, useMemo, useState } from "react";

// ── Types ────────────────────────────────────────────────────────────────────

type MSTAlgorithm = "kruskal" | "prim" | "reverse-delete" | "boruvka";

const MST_ALGORITHMS: { value: MSTAlgorithm; label: string }[] = [
  { value: "kruskal", label: "Kruskal's Algorithm" },
  { value: "prim", label: "Prim's Algorithm" },
  { value: "reverse-delete", label: "Reverse Delete Algorithm" },
  { value: "boruvka", label: "Borůvka's Algorithm" },
];

const EMPTY_STEP: MSTAlgorithmStep = {
  mstEdges: [],
  currentEdge: null,
  rejectedEdges: [],
  frontierEdges: [],
  visitedNodes: [],
  description: "Ready to start",
  stepType: "initial",
  totalWeight: 0,
  candidateEdges: [],
};

// ── Component ────────────────────────────────────────────────────────────────

const MSTPage = () => {
  const {
    graphData,
    handleAddNode,
    handleAddEdge,
    handleClearGraph,
    updateNodePosition,
    edgeFromNode,
    setEdgeFromNode,
    edgeToNode,
    setEdgeToNode,
    edgeWeight,
    setEdgeWeight,
    nodeCount,
    setNodeCount,
    edgeCount,
    setEdgeCount,
  } = useGraphManipulation();

  const [algorithm, setAlgorithm] = useState<MSTAlgorithm>("kruskal");
  const [steps, setSteps] = useState<MSTAlgorithmStep[]>([]);
  const [startNode, setStartNode] = useState<Node | undefined>(
    graphData.nodes[0],
  );

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

  // ── Step generation ───────────────────────────────────────────────────────

  const generateSteps = useCallback((): MSTAlgorithmStep[] => {
    switch (algorithm) {
      case "kruskal":
        return runKruskal(graphData);
      case "reverse-delete":
        return runReverseDelete(graphData);
      case "boruvka":
        return runBoruvka(graphData);
      case "prim":
        return runPrim(graphData, startNode);
    }
  }, [algorithm, graphData, startNode]);

  useEffect(() => {
    setSteps(generateSteps());
    setCurrentStep(0);
    setIsPlaying(false);
  }, [generateSteps, setCurrentStep, setIsPlaying]);

  const currentStepData = useMemo(
    () => steps[currentStep] ?? EMPTY_STEP,
    [steps, currentStep],
  );

  // ── Start node selector (Prim only) ───────────────────────────────────────

  const additionalSelects = useMemo(() => {
    if (algorithm !== "prim") return [];
    return [
      {
        label: "Start Node",
        value: startNode,
        onChange: (id: string) =>
          setStartNode(graphData.nodes.find((n: Node) => n.id === id)),
        options: graphData.nodes.map((n: Node) => ({
          value: n,
          label: n.label ?? n.id,
        })),
      },
    ];
  }, [algorithm, startNode, graphData.nodes]);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Controls sidebar */}
      <div className="space-y-4">
        <AlgorithmControls
          algorithms={MST_ALGORITHMS}
          selectedAlgorithm={algorithm}
          setSelectedAlgorithm={(value) => setAlgorithm(value as MSTAlgorithm)}
          additionalSelects={additionalSelects}
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

      {/* Canvas + step display */}
      <div className="lg:col-span-3">
        <GraphCanvas
          graph={graphData}
          defaultNodes={graphData.nodes}
          defaultEdges={graphData.edges}
          candidateEdges={currentStepData.frontierEdges ?? []}
          currentEdge={currentStepData.currentEdge}
          visitedNodes={currentStepData.visitedNodes ?? []}
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
