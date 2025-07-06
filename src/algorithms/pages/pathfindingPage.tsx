import React, { useState, useCallback, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Play, RotateCcw } from "lucide-react";
import { toast } from "sonner";

type NodeStatus = "empty" | "start" | "end" | "visited" | "path" | "current";

interface GraphNode {
  id: string;
  x: number;
  y: number;
  status: NodeStatus;
  distance: number;
  heuristic: number;
  previous: GraphNode | null;
  fScore: number;
}

interface GraphEdge {
  id: string;
  from: string;
  to: string;
  weight: number;
}

interface Graph {
  nodes: Map<string, GraphNode>;
  edges: Map<string, GraphEdge>;
  adjacencyList: Map<string, string[]>;
}

type Algorithm = "astar" | "dijkstra" | "bfs" | "dfs";
type Mode =
  | "addNode"
  | "addEdge"
  | "removeNode"
  | "removeEdge"
  | "setStart"
  | "setEnd";

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 500;

const PathfindingPage = () => {
  const [graph, setGraph] = useState<Graph>({
    nodes: new Map(),
    edges: new Map(),
    adjacencyList: new Map(),
  });
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState<Algorithm>("astar");
  const [speed, setSpeed] = useState([75]);
  const [mode, setMode] = useState<Mode>("addNode");
  const [startNode, setStartNode] = useState<string | null>(null);
  const [endNode, setEndNode] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [stats, setStats] = useState({ pathLength: 0, nodesExplored: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Initialize with sample graph
  const initializeGraph = useCallback(() => {
    const newGraph: Graph = {
      nodes: new Map(),
      edges: new Map(),
      adjacencyList: new Map(),
    };

    // Create sample nodes
    const sampleNodes = [
      { id: "A", x: 100, y: 150 },
      { id: "B", x: 200, y: 100 },
      { id: "C", x: 300, y: 150 },
      { id: "D", x: 400, y: 100 },
      { id: "E", x: 500, y: 150 },
      { id: "F", x: 200, y: 250 },
      { id: "G", x: 400, y: 250 },
      { id: "H", x: 600, y: 200 },
    ];

    sampleNodes.forEach((node) => {
      const graphNode: GraphNode = {
        id: node.id,
        x: node.x,
        y: node.y,
        status: "empty",
        distance: Infinity,
        heuristic: 0,
        previous: null,
        fScore: Infinity,
      };
      newGraph.nodes.set(node.id, graphNode);
      newGraph.adjacencyList.set(node.id, []);
    });

    // Create sample edges
    const sampleEdges = [
      { from: "A", to: "B", weight: 1 },
      { from: "A", to: "F", weight: 1 },
      { from: "B", to: "C", weight: 1 },
      { from: "B", to: "D", weight: 1 },
      { from: "C", to: "E", weight: 1 },
      { from: "D", to: "G", weight: 1 },
      { from: "E", to: "H", weight: 1 },
      { from: "F", to: "G", weight: 1 },
      { from: "G", to: "H", weight: 1 },
    ];

    sampleEdges.forEach((edge, index) => {
      const edgeId = `edge_${index}`;
      const graphEdge: GraphEdge = {
        id: edgeId,
        from: edge.from,
        to: edge.to,
        weight: edge.weight,
      };
      newGraph.edges.set(edgeId, graphEdge);
      newGraph.adjacencyList.get(edge.from)?.push(edge.to);
      newGraph.adjacencyList.get(edge.to)?.push(edge.from);
    });

    // Set default start and end
    const startNodeObj = newGraph.nodes.get("A");
    const endNodeObj = newGraph.nodes.get("H");
    if (startNodeObj && endNodeObj) {
      startNodeObj.status = "start";
      endNodeObj.status = "end";
      setStartNode("A");
      setEndNode("H");
    }

    setGraph(newGraph);
  }, []);

  useEffect(() => {
    initializeGraph();
  }, [initializeGraph]);

  // Canvas drawing functions
  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw edges
    graph.edges.forEach((edge) => {
      const fromNode = graph.nodes.get(edge.from);
      const toNode = graph.nodes.get(edge.to);

      if (fromNode && toNode) {
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.strokeStyle = "#4B5563";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw weight
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = "#9CA3AF";
        ctx.font = "12px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(edge.weight.toString(), midX, midY - 5);
      }
    });

    // Draw nodes
    graph.nodes.forEach((node) => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);

      // Set node color based on status
      switch (node.status) {
        case "start":
          ctx.fillStyle = "#10B981";
          break;
        case "end":
          ctx.fillStyle = "#EF4444";
          break;
        case "visited":
          ctx.fillStyle = "#93C5FD";
          break;
        case "current":
          ctx.fillStyle = "#FBBF24";
          break;
        case "path":
          ctx.fillStyle = "#3B82F6";
          break;
        default:
          ctx.fillStyle = "#1F2937";
      }

      ctx.fill();
      ctx.strokeStyle = "#374151";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw node label
      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(node.id, node.x, node.y + 5);
    });
  }, [graph]);

  useEffect(() => {
    drawGraph();
  }, [drawGraph]);

  const clearPath = () => {
    setGraph((prev) => {
      const newGraph = { ...prev, nodes: new Map(prev.nodes) };
      newGraph.nodes.forEach((node) => {
        if (
          node.status === "visited" ||
          node.status === "path" ||
          node.status === "current"
        ) {
          node.status = "empty";
        }
        node.distance = Infinity;
        node.previous = null;
        node.fScore = Infinity;
      });
      return newGraph;
    });
    setStats({ pathLength: 0, nodesExplored: 0 });
  };

  function findClickedNode(x: number, y: number): GraphNode | null {
    for (const node of graph.nodes.values()) {
      const distance = Math.sqrt((x - node.x) ** 2 + (y - node.y) ** 2);
      if (distance <= 20) return node;
    }
    return null;
  }

  function cloneGraph(graph: Graph): Graph {
    return {
      nodes: new Map(graph.nodes),
      edges: new Map(graph.edges),
      adjacencyList: new Map(
        Array.from(graph.adjacencyList.entries()).map(([k, v]) => [k, [...v]]),
      ),
    };
  }
  function handleCanvasClick(event: React.MouseEvent<HTMLCanvasElement>) {
    if (isRunning || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedNode = findClickedNode(x, y);
    if (!clickedNode) return;

    const clickedId = clickedNode.id;

    if (mode === "removeNode") {
      setGraph((prev) => {
        const newGraph = cloneGraph(prev);

        newGraph.nodes.delete(clickedId);
        newGraph.edges.forEach((edge, id) => {
          if (edge.from === clickedId || edge.to === clickedId) {
            newGraph.edges.delete(id);
          }
        });
        newGraph.adjacencyList.forEach((neighbors) => {
          const index = neighbors.indexOf(clickedId);
          if (index > -1) neighbors.splice(index, 1);
        });

        toast.success(`Deleted node ${clickedId}`);
        return newGraph;
      });
    } else if (mode === "addEdge") {
      if (!selectedNode) {
        setSelectedNode(clickedId);
        toast.info(
          `Selected node ${clickedId}. Click another node to create edge.`,
        );
      } else if (selectedNode !== clickedId) {
        const edgeId = `edge_${graph.edges.size}`;
        const newEdge: GraphEdge = {
          id: edgeId,
          from: selectedNode,
          to: clickedId,
          weight: 1,
        };

        setGraph((prev) => {
          const newGraph = cloneGraph(prev);
          newGraph.edges.set(edgeId, newEdge);
          newGraph.adjacencyList.get(selectedNode)?.push(clickedId);
          newGraph.adjacencyList.get(clickedId)?.push(selectedNode);
          return newGraph;
        });

        setSelectedNode(null);
        toast.success(`Edge created between ${selectedNode} and ${clickedId}`);
      }
    } else if (mode === "setStart") {
      setGraph((prev) => {
        const newGraph = cloneGraph(prev);
        const updatedNode: GraphNode = {
          ...clickedNode,
          status: "start",
        };
        newGraph.nodes.set(clickedId, updatedNode);
        toast.success(`Set node ${clickedId} as START`);
        return newGraph;
      });
    } else if (mode === "setEnd") {
      setGraph((prev) => {
        const newGraph = cloneGraph(prev);
        const updatedNode: GraphNode = {
          ...clickedNode,
          status: "end",
        };
        newGraph.nodes.set(clickedId, updatedNode);
        toast.success(`Set node ${clickedId} as END`);
        return newGraph;
      });
    }
  }

  // Heuristic function for A*
  const euclideanDistance = (a: GraphNode, b: GraphNode) => {
    return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
  };

  const runAlgorithm = async () => {
    if (!startNode || !endNode) {
      toast.error("Please set start and end nodes");
      return;
    }

    clearPath();
    setIsRunning(true);
    setStats({ pathLength: 0, nodesExplored: 0 });

    const startNodeObj = graph.nodes.get(startNode);
    const endNodeObj = graph.nodes.get(endNode);

    if (!startNodeObj || !endNodeObj) {
      toast.error("Start or end node not found");
      setIsRunning(false);
      return;
    }

    if (algorithm === "astar") {
      await runAStar(startNodeObj, endNodeObj);
    } else if (algorithm === "dijkstra") {
      await runDijkstra(startNodeObj, endNodeObj);
    } else if (algorithm === "bfs") {
      await runBFS(startNodeObj, endNodeObj);
    } else if (algorithm === "dfs") {
      await runDFS(startNodeObj, endNodeObj);
    }

    setIsRunning(false);
  };

  const runAStar = async (start: GraphNode, end: GraphNode) => {
    const openSet: GraphNode[] = [start];
    const closedSet = new Set<string>();
    let nodesExplored = 0;

    start.distance = 0;
    start.fScore = euclideanDistance(start, end);

    while (openSet.length > 0) {
      // Find node with lowest fScore
      let current = openSet[0];
      let currentIndex = 0;

      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].fScore < current.fScore) {
          current = openSet[i];
          currentIndex = i;
        }
      }

      openSet.splice(currentIndex, 1);
      closedSet.add(current.id);

      if (current === end) {
        await reconstructPath(current);
        return;
      }

      // Update current node visualization
      if (current !== start && current !== end) {
        current.status = "current";
        setGraph((prev) => ({ ...prev }));
        await new Promise((resolve) => setTimeout(resolve, 101 - speed[0]));
        nodesExplored++;
        setStats((prev) => ({ ...prev, nodesExplored }));
      }

      const neighbors = graph.adjacencyList.get(current.id) || [];

      for (const neighborId of neighbors) {
        const neighbor = graph.nodes.get(neighborId);
        if (!neighbor || closedSet.has(neighborId)) continue;

        const tentativeDistance = current.distance + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (tentativeDistance >= neighbor.distance) {
          continue;
        }

        neighbor.previous = current;
        neighbor.distance = tentativeDistance;
        neighbor.heuristic = euclideanDistance(neighbor, end);
        neighbor.fScore = neighbor.distance + neighbor.heuristic;

        if (neighbor !== start && neighbor !== end) {
          neighbor.status = "visited";
        }
      }

      setGraph((prev) => ({ ...prev }));
    }

    toast.error("No path found!");
  };

  const runDijkstra = async (start: GraphNode, end: GraphNode) => {
    const unvisited: GraphNode[] = Array.from(graph.nodes.values());
    let nodesExplored = 0;

    // Initialize distances
    unvisited.forEach((node) => {
      node.distance = node === start ? 0 : Infinity;
      node.previous = null;
    });

    while (unvisited.length > 0) {
      // Sort by distance and get the closest unvisited node
      unvisited.sort((a, b) => a.distance - b.distance);
      const current = unvisited.shift()!;

      if (current.distance === Infinity) break;

      if (current === end) {
        await reconstructPath(current);
        return;
      }

      if (current !== start && current !== end) {
        current.status = "visited";
        setGraph((prev) => ({ ...prev }));
        await new Promise((resolve) => setTimeout(resolve, 101 - speed[0]));
        nodesExplored++;
        setStats((prev) => ({ ...prev, nodesExplored }));
      }

      const neighbors = graph.adjacencyList.get(current.id) || [];

      for (const neighborId of neighbors) {
        const neighbor = graph.nodes.get(neighborId);
        if (!neighbor || !unvisited.includes(neighbor)) continue;

        const tentativeDistance = current.distance + 1;

        if (tentativeDistance < neighbor.distance) {
          neighbor.distance = tentativeDistance;
          neighbor.previous = current;
        }
      }
    }

    toast.error("No path found!");
  };

  const runBFS = async (start: GraphNode, end: GraphNode) => {
    const queue: GraphNode[] = [start];
    const visited = new Set<string>([start.id]);
    let nodesExplored = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current === end) {
        await reconstructPath(current);
        return;
      }

      if (current !== start && current !== end) {
        current.status = "visited";
        setGraph((prev) => ({ ...prev }));
        await new Promise((resolve) => setTimeout(resolve, 101 - speed[0]));
        nodesExplored++;
        setStats((prev) => ({ ...prev, nodesExplored }));
      }

      const neighbors = graph.adjacencyList.get(current.id) || [];

      for (const neighborId of neighbors) {
        const neighbor = graph.nodes.get(neighborId);
        if (!neighbor || visited.has(neighborId)) continue;

        neighbor.previous = current;
        visited.add(neighborId);
        queue.push(neighbor);
      }
    }

    toast.error("No path found!");
  };

  const runDFS = async (start: GraphNode, end: GraphNode) => {
    const stack: GraphNode[] = [start];
    const visited = new Set<string>([start.id]);
    let nodesExplored = 0;

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (current === end) {
        await reconstructPath(current);
        return;
      }

      if (current !== start && current !== end) {
        current.status = "visited";
        setGraph((prev) => ({ ...prev }));
        await new Promise((resolve) => setTimeout(resolve, 101 - speed[0]));
        nodesExplored++;
        setStats((prev) => ({ ...prev, nodesExplored }));
      }

      const neighbors = graph.adjacencyList.get(current.id) || [];

      for (const neighborId of neighbors) {
        const neighbor = graph.nodes.get(neighborId);
        if (!neighbor || visited.has(neighborId)) continue;

        neighbor.previous = current;
        visited.add(neighborId);
        stack.push(neighbor);
      }
    }

    toast.error("No path found!");
  };

  const reconstructPath = async (endNode: GraphNode) => {
    const path: GraphNode[] = [];
    let current: GraphNode | null = endNode;

    while (current !== null) {
      path.unshift(current);
      current = current.previous;
    }

    const pathSpeed = Math.max(5, (101 - speed[0]) * 2);

    for (let i = 1; i < path.length - 1; i++) {
      path[i].status = "path";
      setGraph((prev) => ({ ...prev }));
      await new Promise((resolve) => setTimeout(resolve, pathSpeed));
    }

    setStats((prev) => ({ ...prev, pathLength: path.length - 1 }));
    toast.success(`Path found! Length: ${path.length - 1}`);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Graph Pathfinding Visualizer
        </h1>

        {/* Controls */}
        <div className="mb-6 flex flex-wrap gap-4 items-center justify-center">
          <Select
            value={algorithm}
            onValueChange={(value: Algorithm) => setAlgorithm(value)}
          >
            <SelectTrigger className="w-48 bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="astar">A* Algorithm</SelectItem>
              <SelectItem value="dijkstra">Dijkstra's Algorithm</SelectItem>
              <SelectItem value="bfs">Breadth-First Search</SelectItem>
              <SelectItem value="dfs">Depth-First Search</SelectItem>
            </SelectContent>
          </Select>

          <Select value={mode} onValueChange={(value: Mode) => setMode(value)}>
            <SelectTrigger className="w-48 bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="addNode">Add Node</SelectItem>
              <SelectItem value="addEdge">Add Edge</SelectItem>
              <SelectItem value="removeNode">Remove Node</SelectItem>
              <SelectItem value="setStart">Set Start</SelectItem>
              <SelectItem value="setEnd">Set End</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <span className="text-sm">Speed:</span>
            <Slider
              value={speed}
              onValueChange={setSpeed}
              max={100}
              min={1}
              step={1}
              className="w-32"
            />
          </div>

          <Button
            onClick={runAlgorithm}
            disabled={isRunning}
            className="bg-green-600 hover:bg-green-700"
          >
            <Play className="w-4 h-4 mr-2" />
            {isRunning ? "Running..." : "Visualize"}
          </Button>

          <Button onClick={clearPath} className="bg-blue-600 hover:bg-blue-700">
            <RotateCcw className="w-4 h-4 mr-2" />
            Clear Path
          </Button>

          <Button
            onClick={initializeGraph}
            className="bg-red-600 hover:bg-red-700"
          >
            Reset Graph
          </Button>
        </div>

        {/* Stats */}
        <div className="mb-6 flex gap-4 justify-center">
          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">
                  {stats.pathLength}
                </div>
                <div className="text-sm text-gray-300">Path Length</div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-600">
            <CardContent className="p-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-400">
                  {stats.nodesExplored}
                </div>
                <div className="text-sm text-gray-300">Nodes Explored</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Legend */}
        <div className="mb-6 flex gap-6 justify-center flex-wrap">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-sm">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-sm">End</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded-full"></div>
            <span className="text-sm">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 rounded-full"></div>
            <span className="text-sm">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-sm">Path</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
            <span className="text-sm">Node</span>
          </div>
        </div>

        {/* Canvas */}
        <div className="flex justify-center">
          <div className="border-2 border-gray-600 bg-gray-900 rounded-lg p-4">
            <canvas
              ref={canvasRef}
              width={CANVAS_WIDTH}
              height={CANVAS_HEIGHT}
              onClick={handleCanvasClick}
              className="cursor-pointer bg-gray-100 rounded"
            />
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400">
          <p>
            Mode:{" "}
            {mode
              .replace(/([A-Z])/g, " $1")
              .replace(/^./, (str) => str.toUpperCase())}
          </p>
          <p>
            Click to add nodes, select mode to add edges or set start/end
            points.
          </p>
          {selectedNode && <p>Selected node: {selectedNode}</p>}
        </div>
      </div>
    </div>
  );
};

export default PathfindingPage;
