// src/pages/algorithms/MSTPage.tsx
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

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Component ─────────────────────────────────────────────────────────────────

interface MSTPageProps {
  title: string;
}

const MSTPage = ({ title }: MSTPageProps) => {
  const {
    graphData,
    handleAddNode,
    handleAddEdge,
    handleClearGraph,
    updateNodePosition,
    edgeForm,
    handleEdgeFormChange,
    nodeCount,
    setNodeCount,
    edgeCount,
    setEdgeCount,
  } = useGraphManipulation();

  const [algorithm, setAlgorithm] = useState<MSTAlgorithm>("kruskal");
  const [steps, setSteps] = useState<MSTAlgorithmStep[]>([]);

  // Start node for Prim — syncs to first node once graph is available
  const [startNode, setStartNode] = useState<Node | undefined>(undefined);
  useEffect(() => {
    if (!startNode && graphData.nodes.length > 0) {
      setStartNode(graphData.nodes[0]);
    }
  }, [graphData.nodes, startNode]);

  const { currentStep, isPlaying, play, reset, stepForward, stepBackward } =
    usePlayback(steps.length);

  // ── Step generation ───────────────────────────────────────────────────────
  // Steps are generated explicitly (on play/reset) rather than reactively,
  // so that dragging nodes doesn't reset the visualization mid-playback.

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

  const handlePlay = useCallback(() => {
    const newSteps = generateSteps();
    setSteps(newSteps);
    play();
  }, [generateSteps, play]);

  const handleReset = useCallback(() => {
    reset();
    setSteps([]);
  }, [reset]);

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
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">{title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Controls sidebar */}
        <div className="space-y-4">
          <AlgorithmControls
            algorithms={MST_ALGORITHMS}
            selectedAlgorithm={algorithm}
            setSelectedAlgorithm={(value) =>
              setAlgorithm(value as MSTAlgorithm)
            }
            additionalSelects={additionalSelects}
            isPlaying={isPlaying}
            handlePlay={handlePlay}
            handleReset={handleReset}
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
            edgeForm={edgeForm}
            handleEdgeFormChange={handleEdgeFormChange}
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
    </div>
  );
};

export default MSTPage;
