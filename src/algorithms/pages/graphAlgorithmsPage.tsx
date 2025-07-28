import { useState, useEffect, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import { Plus, Trash2 } from "lucide-react";
import { GraphCanvas } from "@/algorithms/components/graphAlgoCanvas";
import { ControlPanel } from "@/algorithms/components/ControlPanel";
import { AlgorithmInfo } from "@/algorithms/components/AlgorithmInfo";
import {
  GraphData,
  Node,
  Edge,
  GraphAlgorithmStep,
} from "@/algorithms/types/graph";
import {
  topologicalSort,
  kosarajuSCC,
  tarjanSCC,
  depthFirstSearch,
  breadthFirstSearch,
  detectCycleDirected,
  detectCycleUndirected,
} from "@/algorithms/utils/graphAlgorithms";

import { toast } from "sonner";

const GraphAlgorithmsPage = () => {
  const [graph, setGraph] = useState<GraphData>({ nodes: [], edges: [] });
  const [selectedAlgorithm, setSelectedAlgorithm] =
    useState<string>("topological");
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState([500]);
  const [currentStep, setCurrentStep] = useState(0);
  const [algorithmSteps, setAlgorithmSteps] = useState<GraphAlgorithmStep[]>(
    [],
  );
  const [nodeStates, setNodeStates] = useState<Map<string, string>>(new Map());
  const [edgeStates, setEdgeStates] = useState<Map<string, string>>(new Map());
  const [isAddingNode, setIsAddingNode] = useState(false);
  const [isAddingEdge, setIsAddingEdge] = useState(false);
  const [selectedNodes, setSelectedNodes] = useState<string[]>([]);

  const algorithms = {
    topological: "Topological Sort",
    kosaraju: "Kosaraju SCC",
    tarjan: "Tarjan SCC",
    dfs: "Depth First Search",
    bfs: "Breadth First Search",
    cycleDirected: "Cycle Detection (Directed)",
    cycleUndirected: "Cycle Detection (Undirected)",
  };

  const runAlgorithm = () => {
    if (graph.nodes.length === 0) {
      toast.error("Please add some nodes to the graph first");
      return;
    }

    let steps: GraphAlgorithmStep[] = [];

    switch (selectedAlgorithm) {
      case "topological":
        steps = topologicalSort(graph);
        break;
      case "kosaraju":
        steps = kosarajuSCC(graph);
        break;
      case "tarjan":
        steps = tarjanSCC(graph);
        break;
      case "dfs":
        steps = depthFirstSearch(graph, graph.nodes[0].id);
        break;
      case "bfs":
        steps = breadthFirstSearch(graph, graph.nodes[0].id);
        break;
      case "cycleDirected":
        steps = detectCycleDirected(graph);
        break;
      case "cycleUndirected":
        steps = detectCycleUndirected(graph);
        break;
      default:
        return;
    }

    setAlgorithmSteps(steps);
    setCurrentStep(0);
    resetStates();
    toast.success(
      `${algorithms[selectedAlgorithm]} algorithm loaded with ${steps.length} steps`,
    );
  };

  const resetStates = () => {
    setNodeStates(new Map());
    setEdgeStates(new Map());
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const applyStep = useCallback(
    (step: GraphAlgorithmStep) => {
      const newNodeStates = new Map(nodeStates);
      const newEdgeStates = new Map(edgeStates);

      if (step.nodeId) {
        newNodeStates.set(step.nodeId, step.state || "visited");
      }

      if (step.edgeId) {
        newEdgeStates.set(step.edgeId, step.state || "active");
      }

      if (step.nodes) {
        step.nodes.forEach((nodeId: string) => {
          newNodeStates.set(nodeId, step.state || "visited");
        });
      }

      setNodeStates(newNodeStates);
      setEdgeStates(newEdgeStates);
    },
    [edgeStates, nodeStates],
  );

  const nextStep = useCallback(() => {
    if (currentStep < algorithmSteps.length) {
      const step = algorithmSteps[currentStep];
      applyStep(step);
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep, algorithmSteps, applyStep]);

  useEffect(() => {
    if (isPlaying && currentStep < algorithmSteps.length) {
      const timer = setTimeout(() => {
        nextStep();
      }, 1100 - speed[0]);
      return () => clearTimeout(timer);
    } else if (isPlaying && currentStep >= algorithmSteps.length) {
      setIsPlaying(false);
      toast.success("Algorithm execution completed!");
    }
  }, [isPlaying, currentStep, speed, algorithmSteps.length, nextStep]);

  const handleCanvasClick = (x: number, y: number) => {
    if (isAddingNode) {
      const newNode: Node = {
        id: `node-${Date.now()}`,
        label: `${graph.nodes.length + 1}`,
        x,
        y,
      };
      setGraph({
        ...graph,
        nodes: [...graph.nodes, newNode],
      });
      setIsAddingNode(false);
      toast.success("Node added!");
    }
  };

  const handleNodeClick = (nodeId: string) => {
    if (isAddingEdge) {
      if (selectedNodes.length === 0) {
        setSelectedNodes([nodeId]);
        toast.info("Select the target node");
      } else if (selectedNodes.length === 1 && selectedNodes[0] !== nodeId) {
        const newEdge: Edge = {
          id: `edge-${Date.now()}`,
          from: selectedNodes[0],
          to: nodeId,
          weight: 1, // Default weight, can be modified later
        };
        setGraph({
          ...graph,
          edges: [...graph.edges, newEdge],
        });
        setSelectedNodes([]);
        setIsAddingEdge(false);
        toast.success("Edge added!");
      }
    }
  };

  const clearGraph = () => {
    setGraph({ nodes: [], edges: [] });
    resetStates();
    setAlgorithmSteps([]);
    toast.success("Graph cleared!");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="lg:col-span-3">
        <Card className="p-6 bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">Graph Canvas</h2>
            <div className="flex gap-2">
              <Button
                variant={isAddingNode ? "primary" : "outline"}
                size="sm"
                onClick={() => {
                  setIsAddingNode(!isAddingNode);
                  setIsAddingEdge(false);
                  setSelectedNodes([]);
                }}
                className="text-white border-slate-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Node
              </Button>
              <Button
                variant={isAddingEdge ? "primary" : "outline"}
                size="sm"
                onClick={() => {
                  setIsAddingEdge(!isAddingEdge);
                  setIsAddingNode(false);
                  setSelectedNodes([]);
                }}
                className="text-white border-slate-600"
              >
                <Plus className="w-4 h-4 mr-1" />
                Edge
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={clearGraph}
                className="text-white border-slate-600"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {isAddingNode && (
            <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
              <p className="text-blue-200 text-sm">
                Click anywhere on the canvas to add a node
              </p>
            </div>
          )}

          {isAddingEdge && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500/30 rounded-lg">
              <p className="text-green-200 text-sm">
                {selectedNodes.length === 0
                  ? "Click on a node to start adding an edge"
                  : "Click on another node to complete the edge"}
              </p>
            </div>
          )}

          <GraphCanvas
            graph={graph}
            nodeStates={nodeStates}
            edgeStates={edgeStates}
            onCanvasClick={handleCanvasClick}
            onNodeClick={handleNodeClick}
            selectedNodes={selectedNodes}
          />
        </Card>
      </div>

      <div className="space-y-4">
        <ControlPanel
          selectedAlgorithm={selectedAlgorithm}
          onAlgorithmChange={setSelectedAlgorithm}
          algorithms={algorithms}
          isPlaying={isPlaying}
          onPlayPause={() => setIsPlaying(!isPlaying)}
          onReset={resetStates}
          onRun={runAlgorithm}
          speed={speed}
          onSpeedChange={setSpeed}
          currentStep={currentStep}
          totalSteps={algorithmSteps.length}
        />

        <AlgorithmInfo
          algorithm={selectedAlgorithm}
          currentStep={algorithmSteps[currentStep - 1]}
        />
      </div>
    </div>
  );
};

export default GraphAlgorithmsPage;
