// src/pages/algorithms/SCCPage.tsx

import { getAlgorithmsByCategory } from "@/algorithms/types/graph-algorithms-registry";
import GraphCanvas from "@/components/algorithms/graph-canvas";
import SCCStepDisplay from "@/components/algorithms/scc-step-display";
import GraphControls from "@/components/controls/graph-controls";
import GraphEditor from "@/components/controls/graph-editor";
import { useSCCVisualization } from "@/hooks/use-scc-visualization";

const SCC_ALGORITHM_OPTIONS = getAlgorithmsByCategory("scc").map((def) => ({
  value: def.key,
  label: def.name,
}));

interface SCCPageProps {
  title: string;
}

const SCCPage = ({ title }: SCCPageProps) => {
  const {
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
    algorithm,
    setAlgorithm,
    steps,
    currentStep,
    isRunning,
    isPaused,
    nodeStates,
    edgeStates,
    currentStepData,
    metadata,
    speed,
    setSpeed,
    isStepMode,
    setIsStepMode,
    startVisualization,
    handlePauseResume,
    stepForward,
    stepBackward,
  } = useSCCVisualization();

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">{title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="space-y-4">
          <GraphControls
            algorithms={SCC_ALGORITHM_OPTIONS}
            selectedAlgorithm={algorithm}
            setSelectedAlgorithm={setAlgorithm}
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

        <div className="lg:col-span-3 space-y-4">
          {/* directed=true enables arrowheads on canvas */}
          <GraphCanvas
            graph={graphData}
            nodeStates={nodeStates}
            edgeStates={edgeStates}
            onNodeMove={updateNodePosition}
            directed
          />

          {currentStepData && (
            <SCCStepDisplay
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

export default SCCPage;
