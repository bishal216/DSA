// src/pages/algorithms/MSTPage.tsx

import { getAlgorithmsByCategory } from "@/algorithms/types/graph-algorithms-registry";
import GraphCanvas from "@/components/algorithms/graph-canvas";
import MSTStepDisplay from "@/components/algorithms/mst-step-display";
import GraphControls from "@/components/controls/graph-controls";
import GraphEditor from "@/components/controls/graph-editor";
import { useMSTVisualization } from "@/hooks/use-mst-visualization";
import { useMemo } from "react";

// ── Constants ─────────────────────────────────────────────────────────────────

const MST_ALGORITHM_OPTIONS = getAlgorithmsByCategory("mst").map((def) => ({
  value: def.key,
  label: def.name,
}));

// ── Component ─────────────────────────────────────────────────────────────────

interface MSTPageProps {
  title: string;
}

const MSTPage = ({ title }: MSTPageProps) => {
  const {
    // graph manipulation
    graphData,
    updateNodePosition,
    handleAddNode,
    handleAddEdge,
    handleClearGraph,
    handleGenerateRandom,
    edgeForm,
    handleEdgeFormChange,
    nodeCount,
    setNodeCount,
    edgeCount,
    setEdgeCount,

    // engine
    algorithm,
    setAlgorithm,
    steps,
    currentStep,
    isRunning,
    isPaused,

    // playback config
    speed,
    setSpeed,
    isStepMode,
    setIsStepMode,

    // prim start node
    startNodeId,
    setStartNodeId,

    // canvas
    nodeStates,
    edgeStates,

    // step display
    currentStepData,
    metadata,

    // actions
    startVisualization,
    handlePauseResume,
    stepForward,
    stepBackward,
  } = useMSTVisualization();

  // ── Prim start node selector ─────────────────────────────────────────────

  const additionalSelects = useMemo(() => {
    if (algorithm !== "prim") return [];
    return [
      {
        label: "Start Node",
        value: startNodeId ?? graphData.nodes[0]?.id ?? "",
        onChange: (id: string) => setStartNodeId(id),
        options: graphData.nodes.map((n) => ({
          value: n.id,
          label: n.label ?? n.id,
        })),
      },
    ];
  }, [algorithm, startNodeId, graphData.nodes, setStartNodeId]);

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">{title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* ── Controls sidebar ─────────────────────────────────────────── */}
        <div className="space-y-4">
          <GraphControls
            algorithms={MST_ALGORITHM_OPTIONS}
            selectedAlgorithm={algorithm}
            setSelectedAlgorithm={setAlgorithm}
            additionalSelects={additionalSelects}
            speed={speed}
            setSpeed={setSpeed}
            isStepMode={isStepMode}
            setIsStepMode={setIsStepMode}
            steps={steps}
            currentStep={currentStep}
            isRunning={isRunning}
            isPaused={isPaused}
            onStart={startVisualization}
            onPauseResume={handlePauseResume}
            onStepForward={stepForward}
            onStepBackward={stepBackward}
          />

          <GraphEditor
            graphData={graphData}
            addNode={handleAddNode}
            addEdge={handleAddEdge}
            clearGraph={handleClearGraph}
            generateRandom={handleGenerateRandom}
            edgeForm={edgeForm}
            handleEdgeFormChange={handleEdgeFormChange}
            nodeCount={nodeCount}
            setNodeCount={setNodeCount}
            edgeCount={edgeCount}
            setEdgeCount={setEdgeCount}
          />
        </div>

        {/* ── Canvas + step display ─────────────────────────────────────── */}
        <div className="lg:col-span-3 space-y-4">
          <GraphCanvas
            graph={graphData}
            nodeStates={nodeStates}
            edgeStates={edgeStates}
            onNodeMove={updateNodePosition}
          />

          {currentStepData && (
            <MSTStepDisplay
              step={currentStepData}
              metadata={metadata}
              algorithm={algorithm}
              graphData={graphData}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MSTPage;
