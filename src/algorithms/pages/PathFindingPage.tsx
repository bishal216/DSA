import { useState, useCallback, useEffect, useMemo } from "react";
import GraphCanvas from "@/algorithms/components/graphCanvas";
import AlgorithmControls from "@/algorithms/components/GraphAlgorithmControls";
import GraphEditor from "@/algorithms/components/GraphEditor";
import { PathfindingStep } from "@/algorithms/types/graph";
import { runDijkstra } from "@/algorithms/utils/pathfinding/dijkstra";
import { runAStar } from "@/algorithms/utils/pathfinding/aStar";
import { useGraphManipulation } from "@/algorithms/hooks/useGraphManipulation";
import { usePlayback } from "@/algorithms/hooks/usePlayback";
import { Node } from "@/algorithms/types/graph";

const PathFindingPage = () => {
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

  const [algorithm, setAlgorithm] = useState<"dijkstra" | "astar">("dijkstra");
  const [steps, setSteps] = useState<PathfindingStep[]>([]);
  const [startNode, setStartNode] = useState<Node | null>(null);
  const [endNode, setEndNode] = useState<Node | null>(null);

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

  useEffect(() => {
    if (graphData.nodes.length >= 2) {
      setStartNode(graphData.nodes[0]);
      setEndNode(graphData.nodes[1]);
    } else if (graphData.nodes.length === 1) {
      setStartNode(graphData.nodes[0]);
      setEndNode(graphData.nodes[0]);
    }
  }, [graphData.nodes]);

  const generateSteps = useCallback(() => {
    if (!startNode || !endNode) return [];
    const steps =
      algorithm === "dijkstra"
        ? runDijkstra(graphData, startNode.id, endNode.id)
        : runAStar(graphData, startNode.id, endNode.id);
    console.log("Generated Steps:", steps);
    return steps;
  }, [algorithm, graphData, startNode, endNode]);

  useEffect(() => {
    if (!startNode || !endNode) return;
    const newSteps = generateSteps();
    setSteps(newSteps);
    setCurrentStep(0);
    setIsPlaying(false);
  }, [generateSteps, startNode, endNode, setCurrentStep, setIsPlaying]);

  const currentStepData = useMemo(() => {
    return steps[currentStep];
  }, [steps, currentStep]);

  const getNodeFromString = useCallback(
    (nodeId: string, graph: { nodes: Node[] }) => {
      return graph.nodes.find((node) => node.id === nodeId) || graph.nodes[0];
    },
    [],
  );

  const additionalSelects = useMemo(() => {
    return [
      {
        label: "Start Node",
        value: startNode,
        onChange: (v: string) => setStartNode(getNodeFromString(v, graphData)),
        options: graphData.nodes.map((node) => ({
          value: node,
          label: node.label || node.id,
        })),
      },
      {
        label: "End Node",
        value: endNode,
        onChange: (v: string) => setEndNode(getNodeFromString(v, graphData)),
        options: graphData.nodes.map((node) => ({
          value: node,
          label: node.label || node.id,
        })),
      },
    ];
  }, [startNode, endNode, getNodeFromString, graphData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="space-y-4">
        <AlgorithmControls
          algorithms={[
            { label: "Dijkstra", value: "dijkstra" },
            { label: "A*", value: "astar" },
          ]}
          selectedAlgorithm={algorithm}
          setSelectedAlgorithm={(value) =>
            setAlgorithm(value as "dijkstra" | "astar")
          }
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
      <div className="lg:col-span-3">
        <GraphCanvas
          graph={graphData}
          defaultNodes={graphData.nodes}
          defaultEdges={graphData.edges}
          candidateNodes={currentStepData?.frontierNodes || []}
          candidateEdges={graphData.edges.filter(
            (e) =>
              currentStepData?.frontierNodes?.includes(e.from) ||
              currentStepData?.frontierNodes?.includes(e.to),
          )}
          currentNode={currentStepData?.currentNode}
          currentEdge={graphData.edges.find(
            (e) =>
              currentStepData?.currentNode &&
              (e.from === currentStepData.currentNode.id ||
                e.to === currentStepData.currentNode.id),
          )}
          visitedNodes={currentStepData?.visitedNodes || []}
          visitedEdges={[]}
          rejectedNodes={[]}
          rejectedEdges={[]}
          onNodeMove={updateNodePosition}
        />
      </div>
    </div>
  );
};

export default PathFindingPage;
