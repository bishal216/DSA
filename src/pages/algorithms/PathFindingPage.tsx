import type { Node, PathfindingStep } from "@/algorithms/types/graph";
import { runAStar } from "@/algorithms/utils/pathfinding/aStar";
import { runDijkstra } from "@/algorithms/utils/pathfinding/dijkstra";
import AlgorithmControls from "@/components/graph/GraphAlgorithmControls";
import GraphCanvas from "@/components/graph/GraphCanvas";
import GraphEditor from "@/components/graph/GraphEditor";
import StepDisplay from "@/components/graph/GraphPathFindingStepDisplay";
import { useGraphManipulation } from "@/hooks/use-graph-manipulation";
import { usePlayback } from "@/hooks/use-playback";
import { useCallback, useEffect, useMemo, useState } from "react";

// ── Types ─────────────────────────────────────────────────────────────────────

type PathAlgorithm = "dijkstra" | "astar";

const PATH_ALGORITHMS: { value: PathAlgorithm; label: string }[] = [
  { value: "dijkstra", label: "Dijkstra's Algorithm" },
  { value: "astar", label: "A* Algorithm" },
];

const EMPTY_STEP: PathfindingStep = {
  stepType: "initial",
  visitedNodes: [],
  frontierNodes: [],
  previousNodes: {}, // Record<string, string | null> — not an array
  currentNode: null,
  distances: {},
  path: [],
  description: "Ready to start",
};

// ── Component ─────────────────────────────────────────────────────────────────

const PathFindingPage = () => {
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

  const [algorithm, setAlgorithm] = useState<PathAlgorithm>("dijkstra");
  const [steps, setSteps] = useState<PathfindingStep[]>([]);
  const [startNode, setStartNode] = useState<Node | undefined>(undefined);
  const [endNode, setEndNode] = useState<Node | undefined>(undefined);

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

  // Initialise start/end when the graph changes.
  // graphData (not just graphData.nodes) is the stable reference from the hook.
  useEffect(() => {
    const { nodes } = graphData;
    if (nodes.length >= 2) {
      setStartNode(nodes[0]);
      setEndNode(nodes[1]);
    } else if (nodes.length === 1) {
      setStartNode(nodes[0]);
      setEndNode(nodes[0]);
    } else {
      setStartNode(undefined);
      setEndNode(undefined);
    }
  }, [graphData]); // ← full graphData satisfies exhaustive-deps

  // ── Step generation ───────────────────────────────────────────────────────

  const generateSteps = useCallback((): PathfindingStep[] => {
    if (!startNode || !endNode) return [];
    return algorithm === "dijkstra"
      ? runDijkstra(graphData, startNode.id, endNode.id)
      : runAStar(graphData, startNode.id, endNode.id);
  }, [algorithm, graphData, startNode, endNode]);

  useEffect(() => {
    setSteps(generateSteps());
    setCurrentStep(0);
    setIsPlaying(false);
  }, [generateSteps, setCurrentStep, setIsPlaying]);

  const currentStepData = useMemo(
    () => steps[currentStep] ?? EMPTY_STEP,
    [steps, currentStep],
  );

  // ── Node selectors ────────────────────────────────────────────────────────

  const nodeOptions = useMemo(
    () =>
      graphData.nodes.map((n: Node) => ({ value: n, label: n.label ?? n.id })),
    [graphData.nodes],
  );

  const additionalSelects = useMemo(
    () => [
      {
        label: "Start Node",
        value: startNode,
        onChange: (id: string) =>
          setStartNode(graphData.nodes.find((n: Node) => n.id === id)),
        options: nodeOptions,
      },
      {
        label: "End Node",
        value: endNode,
        onChange: (id: string) =>
          setEndNode(graphData.nodes.find((n: Node) => n.id === id)),
        options: nodeOptions,
      },
    ],
    [startNode, endNode, nodeOptions, graphData.nodes],
  );

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Controls sidebar */}
      <div className="space-y-4">
        <AlgorithmControls
          algorithms={PATH_ALGORITHMS}
          selectedAlgorithm={algorithm}
          setSelectedAlgorithm={(value) => setAlgorithm(value as PathAlgorithm)}
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
          candidateNodes={currentStepData.frontierNodes ?? []}
          currentNode={currentStepData.currentNode ?? null}
          visitedNodes={currentStepData.visitedNodes ?? []}
          visitedEdges={[]}
          rejectedNodes={[]}
          rejectedEdges={[]}
          onNodeMove={updateNodePosition}
        />
        <StepDisplay step={currentStepData} />
      </div>
    </div>
  );
};

export default PathFindingPage;
