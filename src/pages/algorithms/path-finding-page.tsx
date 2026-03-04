// src/pages/algorithms/PathfindingPage.tsx

import { getAlgorithmsByCategory } from "@/algorithms/registry/graph-algorithms-registry";
import GraphCanvas from "@/components/algorithms/graph/graph-canvas";
import GraphControls from "@/components/algorithms/graph/graph-controls";
import GraphEditor from "@/components/algorithms/graph/graph-editor";
import PathfindingStepDisplay from "@/components/algorithms/graph/pathfinding-step-display";
import { usePathfindingVisualization } from "@/hooks/use-pathfinding-visualization";
import { useMemo } from "react";

const PATHFINDING_ALGORITHM_OPTIONS = getAlgorithmsByCategory(
  "pathfinding",
).map((def) => ({
  value: def.key,
  label: def.name,
}));

interface PathfindingPageProps {
  title: string;
}

const PathfindingPage = ({ title }: PathfindingPageProps) => {
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
    startNodeId,
    setStartNodeId,
    endNodeId,
    setEndNodeId,
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
  } = usePathfindingVisualization();

  // Both start and end node selectors
  const additionalSelects = useMemo(
    () => [
      {
        label: "Start Node",
        value: startNodeId ?? graphData.nodes[0]?.id ?? "",
        onChange: (id: string) => setStartNodeId(id),
        options: graphData.nodes.map((n) => ({
          value: n.id,
          label: n.label ?? n.id,
        })),
      },
      {
        label: "End Node",
        value: endNodeId ?? graphData.nodes.at(-1)?.id ?? "",
        onChange: (id: string) => setEndNodeId(id),
        options: graphData.nodes.map((n) => ({
          value: n.id,
          label: n.label ?? n.id,
        })),
      },
    ],
    [graphData.nodes, startNodeId, endNodeId, setStartNodeId, setEndNodeId],
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-center">{title}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="space-y-4">
          <GraphControls
            algorithms={PATHFINDING_ALGORITHM_OPTIONS}
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

        <div className="lg:col-span-3 space-y-4">
          <GraphCanvas
            graph={graphData}
            nodeStates={nodeStates}
            edgeStates={edgeStates}
            onNodeMove={updateNodePosition}
          />

          {currentStepData && (
            <PathfindingStepDisplay
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

export default PathfindingPage;
