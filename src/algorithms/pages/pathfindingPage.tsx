import { useState, useCallback, useRef, useEffect } from "react";
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
import { toast } from "react-hot-toast";

type CellType =
  | "empty"
  | "wall"
  | "start"
  | "end"
  | "visited"
  | "path"
  | "current";

interface Cell {
  row: number;
  col: number;
  type: CellType;
  distance: number;
  heuristic: number;
  previous: Cell | null;
  fScore: number;
}

type Algorithm = "astar" | "dijkstra" | "bfs" | "dfs";

const GRID_ROWS = 25;
const GRID_COLS = 50;

const PathfindingPage = () => {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [algorithm, setAlgorithm] = useState<Algorithm>("astar");
  const [speed, setSpeed] = useState([75]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startNode, setStartNode] = useState<{
    row: number;
    col: number;
  } | null>(null);
  const [endNode, setEndNode] = useState<{ row: number; col: number } | null>(
    null
  );
  const [stats, setStats] = useState({ pathLength: 0, nodesExplored: 0 });
  const lastInteractedCell = useRef<{ row: number; col: number } | null>(null);

  // Initialize grid
  const initializeGrid = useCallback(() => {
    const newGrid: Cell[][] = [];
    for (let row = 0; row < GRID_ROWS; row++) {
      const currentRow: Cell[] = [];
      for (let col = 0; col < GRID_COLS; col++) {
        currentRow.push({
          row,
          col,
          type: "empty",
          distance: Infinity,
          heuristic: 0,
          previous: null,
          fScore: Infinity,
        });
      }
      newGrid.push(currentRow);
    }

    // Set default start and end positions
    const defaultStart = { row: 12, col: 10 };
    const defaultEnd = { row: 12, col: 40 };

    newGrid[defaultStart.row][defaultStart.col].type = "start";
    newGrid[defaultEnd.row][defaultEnd.col].type = "end";

    setStartNode(defaultStart);
    setEndNode(defaultEnd);
    setGrid(newGrid);
  }, []);

  useEffect(() => {
    initializeGrid();
  }, [initializeGrid]);

  const clearPath = () => {
    setGrid((prev) =>
      prev.map((row) =>
        row.map((cell) => ({
          ...cell,
          type:
            cell.type === "visited" ||
            cell.type === "path" ||
            cell.type === "current"
              ? "empty"
              : cell.type,
          distance: Infinity,
          previous: null,
          fScore: Infinity,
        }))
      )
    );
    setStats({ pathLength: 0, nodesExplored: 0 });
  };

  const clearWalls = () => {
    setGrid((prev) =>
      prev.map((row) =>
        row.map((cell) => ({
          ...cell,
          type: cell.type === "wall" ? "empty" : cell.type,
        }))
      )
    );
  };

  const handleCellClick = (row: number, col: number) => {
    if (isRunning) return;
    console.log("This is called once");

    setGrid((prev) => {
      console.log(`This is called twice for cell at (${row}, ${col})`);
      const newGrid = [...prev];
      const cell = newGrid[row][col];

      if (cell.type === "start" || cell.type === "end") return prev;

      if (cell.type === "wall" || cell.type === "empty") {
        console.log(`Toggling cell at (${row}, ${col}) from ${cell.type}`);
        cell.type = cell.type === "wall" ? "empty" : "wall";
      }

      return newGrid;
    });
  };

  const handleMouseDown = (row: number, col: number) => {
    if (isRunning) return;
    setIsDrawing(true);
    handleCellClick(row, col);
  };

  const handleMouseEnter = (row: number, col: number) => {
    if (isRunning || !isDrawing) return;
    handleCellClick(row, col);
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    lastInteractedCell.current = null;
  };

  // Heuristic function for A*
  const manhattanDistance = (a: Cell, b: Cell) => {
    return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
  };

  const getNeighbors = (cell: Cell, grid: Cell[][]) => {
    const neighbors: Cell[] = [];
    const { row, col } = cell;

    const directions = [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ];

    for (const [dRow, dCol] of directions) {
      const newRow = row + dRow;
      const newCol = col + dCol;

      if (
        newRow >= 0 &&
        newRow < GRID_ROWS &&
        newCol >= 0 &&
        newCol < GRID_COLS
      ) {
        neighbors.push(grid[newRow][newCol]);
      }
    }

    return neighbors;
  };

  const runAlgorithm = async () => {
    if (!startNode || !endNode) {
      toast.error("Please set start and end points");
      return;
    }

    clearPath();
    setIsRunning(true);
    setStats({ pathLength: 0, nodesExplored: 0 });

    const startCell = grid[startNode.row][startNode.col];
    const endCell = grid[endNode.row][endNode.col];

    if (algorithm === "astar") {
      await runAStar(startCell, endCell);
    } else if (algorithm === "dijkstra") {
      await runDijkstra(startCell, endCell);
    } else if (algorithm === "bfs") {
      await runBFS(startCell, endCell);
    } else if (algorithm === "dfs") {
      await runDFS(startCell, endCell);
    }

    setIsRunning(false);
  };

  const runAStar = async (start: Cell, end: Cell) => {
    const openSet: Cell[] = [start];
    const closedSet = new Set<Cell>();
    let nodesExplored = 0;

    start.distance = 0;
    start.fScore = manhattanDistance(start, end);

    while (openSet.length > 0) {
      // Find cell with lowest fScore
      let current = openSet[0];
      let currentIndex = 0;

      for (let i = 1; i < openSet.length; i++) {
        if (openSet[i].fScore < current.fScore) {
          current = openSet[i];
          currentIndex = i;
        }
      }

      openSet.splice(currentIndex, 1);
      closedSet.add(current);

      if (current === end) {
        await reconstructPath(current);
        return;
      }

      // Update grid to show current cell
      if (current !== start && current !== end) {
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[current.row][current.col].type = "current";
          return newGrid;
        });

        await new Promise((resolve) => setTimeout(resolve, 101 - speed[0]));
        nodesExplored++;
        setStats((prev) => ({ ...prev, nodesExplored }));
      }

      const neighbors = getNeighbors(current, grid);

      for (const neighbor of neighbors) {
        if (closedSet.has(neighbor) || neighbor.type === "wall") continue;

        const tentativeDistance = current.distance + 1;

        if (!openSet.includes(neighbor)) {
          openSet.push(neighbor);
        } else if (tentativeDistance >= neighbor.distance) {
          continue;
        }

        neighbor.previous = current;
        neighbor.distance = tentativeDistance;
        neighbor.heuristic = manhattanDistance(neighbor, end);
        neighbor.fScore = neighbor.distance + neighbor.heuristic;

        if (neighbor !== start && neighbor !== end) {
          setGrid((prev) => {
            const newGrid = [...prev];
            newGrid[neighbor.row][neighbor.col].type = "visited";
            return newGrid;
          });
        }
      }
    }

    toast.error("No path found!");
  };

  const runDijkstra = async (start: Cell, end: Cell) => {
    const unvisited: Cell[] = [];
    let nodesExplored = 0;

    // Initialize all cells
    for (const row of grid) {
      for (const cell of row) {
        if (cell.type !== "wall") {
          cell.distance = cell === start ? 0 : Infinity;
          cell.previous = null;
          unvisited.push(cell);
        }
      }
    }

    while (unvisited.length > 0) {
      // Sort by distance and get the closest unvisited cell
      unvisited.sort((a, b) => a.distance - b.distance);
      const current = unvisited.shift()!;

      if (current.distance === Infinity) break;

      if (current === end) {
        await reconstructPath(current);
        return;
      }

      if (current !== start && current !== end) {
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[current.row][current.col].type = "visited";
          return newGrid;
        });

        await new Promise((resolve) => setTimeout(resolve, 101 - speed[0]));
        nodesExplored++;
        setStats((prev) => ({ ...prev, nodesExplored }));
      }

      const neighbors = getNeighbors(current, grid);

      for (const neighbor of neighbors) {
        if (neighbor.type === "wall" || !unvisited.includes(neighbor)) continue;

        const tentativeDistance = current.distance + 1;

        if (tentativeDistance < neighbor.distance) {
          neighbor.distance = tentativeDistance;
          neighbor.previous = current;
        }
      }
    }

    toast.error("No path found!");
  };

  const runBFS = async (start: Cell, end: Cell) => {
    const queue: Cell[] = [start];
    const visited = new Set<Cell>([start]);
    let nodesExplored = 0;

    while (queue.length > 0) {
      const current = queue.shift()!;

      if (current === end) {
        await reconstructPath(current);
        return;
      }

      if (current !== start && current !== end) {
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[current.row][current.col].type = "visited";
          return newGrid;
        });

        await new Promise((resolve) => setTimeout(resolve, 101 - speed[0]));
        nodesExplored++;
        setStats((prev) => ({ ...prev, nodesExplored }));
      }

      const neighbors = getNeighbors(current, grid);

      for (const neighbor of neighbors) {
        if (visited.has(neighbor) || neighbor.type === "wall") continue;

        neighbor.previous = current;
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }

    toast.error("No path found!");
  };

  const runDFS = async (start: Cell, end: Cell) => {
    const stack: Cell[] = [start];
    const visited = new Set<Cell>([start]);
    let nodesExplored = 0;

    while (stack.length > 0) {
      const current = stack.pop()!;

      if (current === end) {
        await reconstructPath(current);
        return;
      }

      if (current !== start && current !== end) {
        setGrid((prev) => {
          const newGrid = [...prev];
          newGrid[current.row][current.col].type = "visited";
          return newGrid;
        });

        await new Promise((resolve) => setTimeout(resolve, 101 - speed[0]));
        nodesExplored++;
        setStats((prev) => ({ ...prev, nodesExplored }));
      }

      const neighbors = getNeighbors(current, grid);

      for (const neighbor of neighbors) {
        if (visited.has(neighbor) || neighbor.type === "wall") continue;

        neighbor.previous = current;
        visited.add(neighbor);
        stack.push(neighbor);
      }
    }

    toast.error("No path found!");
  };

  const reconstructPath = async (endCell: Cell) => {
    const path: Cell[] = [];
    let current: Cell | null = endCell;

    while (current !== null) {
      path.unshift(current);
      current = current.previous;
    }

    // Use same speed for path reconstruction
    const pathSpeed = Math.max(5, 101 - speed[0]);

    for (let i = 1; i < path.length - 1; i++) {
      setGrid((prev) => {
        const newGrid = [...prev];
        newGrid[path[i].row][path[i].col].type = "path";
        return newGrid;
      });
      await new Promise((resolve) => setTimeout(resolve, pathSpeed));
    }

    setStats((prev) => ({ ...prev, pathLength: path.length - 1 }));
    toast.success(`Path found! Length: ${path.length - 1}`);
  };

  const getCellClassName = (cell: Cell) => {
    const baseClass = "w-6 h-6 border border-gray-600 cursor-pointer";

    switch (cell.type) {
      case "start":
        return `${baseClass} bg-green-500`;
      case "end":
        return `${baseClass} bg-red-500`;
      case "wall":
        return `${baseClass} bg-brown-500 border-gray-700`;
      case "visited":
        return `${baseClass} bg-blue-300`;
      case "current":
        return `${baseClass} bg-yellow-400`;
      case "path":
        return `${baseClass} bg-blue-500`;
      default:
        return `${baseClass} bg-gray-900 hover:bg-gray-800`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Pathfinding Algorithm Visualizer
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
            onClick={clearWalls}
            className="bg-orange-600 hover:bg-orange-700"
          >
            Clear Walls
          </Button>

          <Button
            onClick={initializeGrid}
            className="bg-red-600 hover:bg-red-700"
          >
            Reset Grid
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
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-sm">Start</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-sm">End</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-800 rounded"></div>
            <span className="text-sm">Wall</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-400 rounded"></div>
            <span className="text-sm">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-300 rounded"></div>
            <span className="text-sm">Visited</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-sm">Path</span>
          </div>
        </div>

        {/* Grid */}
        <div className="flex justify-center">
          <div
            className="inline-block border-2 border-gray-600 bg-gray-900 rounded-lg p-2"
            onMouseUp={handleMouseUp}
          >
            {grid.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((cell, colIndex) => (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={getCellClassName(cell)}
                    onMouseDown={() => handleMouseDown(rowIndex, colIndex)}
                    onMouseEnter={() => handleMouseEnter(rowIndex, colIndex)}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-gray-400">
          <p>Click and drag to create walls. Green is start, red is end.</p>
        </div>
      </div>
    </div>
  );
};

export default PathfindingPage;
