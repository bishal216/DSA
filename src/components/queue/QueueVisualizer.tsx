import React, { useState, useEffect } from "react";
import { Deque } from "@/utils/data-structures/deque";
import { ListNode } from "@/utils/LinkedListNode";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import ReduxCollapsible from "@/components/ui/collapsible-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { QueueType } from "@/utils/LinkedListNode";
import { iconMap } from "@/utils/iconmap";
interface QueueVisualizerProps {
  queueType: QueueType;
}
const QueueVisualizer: React.FC<QueueVisualizerProps> = ({
  queueType = "linear",
}) => {
  const [queue, setQueue] = useState(new Deque());
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Initialize with some sample data
    const newQueue = new Deque();
    newQueue.addFront(10);
    newQueue.addRear(20);
    newQueue.addRear(30);

    setQueue(newQueue);
    setNodes(newQueue.toArray());
  }, []);

  const updateVisualization = () => {
    setNodes(queue.toArray());
  };

  const animateOperation = async (
    highlightFrontOnly: boolean = false,
    highlightBackOnly: boolean = false,
  ) => {
    setIsAnimating(true);
    if (nodes.length > 0 && highlightFrontOnly) {
      setHighlightedNode(nodes[0].id);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    if (nodes.length > 0 && highlightBackOnly) {
      setHighlightedNode(nodes[nodes.length - 1].id);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }

    setHighlightedNode(null);
    setIsAnimating(false);
  };

  const handleEnqueue = async () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a value to enqueue");
      return;
    }

    const value = parseInt(inputValue, 10);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }

    const result = queue.addRear(value);
    await animateOperation(false, false);
    updateVisualization();
    toast.success(result.message);
    setInputValue("");
  };

  const handleEnqueueFront = async () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a value to enqueue");
      return;
    }

    const value = parseInt(inputValue, 10);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }

    const result = queue.addFront(value);
    updateVisualization();
    toast.success(result.message);
    setInputValue("");
  };
  const handleDequeue = async () => {
    await animateOperation(true);

    const result = queue.removeFront();
    updateVisualization();

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleDequeueRear = async () => {
    await animateOperation(false, true);

    const result = queue.removeRear();
    updateVisualization();

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handlePeek = async () => {
    await animateOperation(true);

    const result = queue.peekFront();

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handlePeekRear = async () => {
    await animateOperation(false, true);

    const result = queue.peekRear();

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleClear = () => {
    queue.clear();
    updateVisualization();
    setSearchResult(null);
    setHighlightedNode(null);
    toast.success("Queue cleared successfully");
  };

  const handleGetLength = () => {
    const length = queue.getSize();
    toast.success(`Queue size: ${length}`);
  };

  const handleCheckEmpty = () => {
    const isEmpty = queue.isEmpty();
    toast.success(`Queue is ${isEmpty ? "empty" : "not empty"}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Visualization */}
      <Card className="min-h-[20vh] flex items-center justify-center">
        <CardContent className="w-full px-4 py-6 overflow-x-auto">
          <div className="flex justify-center items-center min-w-max">
            {nodes.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-2">🚶‍♀️</div>
                  <p>Empty queue</p>
                  <p className="text-sm">
                    Enqueue some elements to get started!
                  </p>
                </div>
              </div>
            ) : (
              <div className="relative w-fit">
                <div className="flex items-center gap-0 p-6">
                  {nodes.map((node, index) => (
                    <div key={node.id} className="flex items-center">
                      {/* Node box */}
                      <div
                        className={`
                relative flex items-center justify-center w-16 h-16 rounded-lg border-2 transition-all duration-300
                ${
                  searchResult === node.id
                    ? "bg-green-100 border-green-400 shadow-green-200 shadow-lg"
                    : highlightedNode === node.id
                      ? "bg-yellow-100 border-yellow-400 shadow-yellow-200 shadow-lg"
                      : index === 0
                        ? "bg-cyan-100 border-cyan-400 shadow-md"
                        : index === nodes.length - 1
                          ? "bg-blue-100 border-blue-400 shadow-md"
                          : "bg-white border-gray-300 shadow-md"
                }
              `}
                      >
                        <span
                          className={`font-bold text-lg ${
                            searchResult === node.id
                              ? "text-green-700"
                              : highlightedNode === node.id
                                ? "text-yellow-700"
                                : index === 0
                                  ? "text-cyan-700"
                                  : index === nodes.length - 1
                                    ? "text-blue-700"
                                    : "text-gray-700"
                          }`}
                        >
                          {node.value}
                        </span>

                        {/* FRONT and REAR badges */}
                        {index === 0 && (
                          <Badge
                            variant="outline"
                            className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-cyan-600 border-cyan-300"
                          >
                            FRONT
                          </Badge>
                        )}
                        {index === nodes.length - 1 && (
                          <Badge
                            variant="outline"
                            className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-blue-600 border-blue-300"
                          >
                            REAR
                          </Badge>
                        )}
                      </div>

                      {/* Arrow between nodes */}
                      {index < nodes.length - 1 && (
                        <iconMap.ArrowRight className="w-6 h-6 text-gray-400 mx-2" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Circular return arrow */}
                {queueType === "circular" && nodes.length > 1 && (
                  <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <svg
                      width={nodes.length * 100 + 100}
                      height="120"
                      className="overflow-visible"
                    >
                      <defs>
                        <marker
                          id="queueCircularArrowhead"
                          markerWidth="10"
                          markerHeight="10"
                          refX="9"
                          refY="3"
                          orient="auto"
                          markerUnits="strokeWidth"
                        >
                          <polygon
                            points="5 0, 10 3, 5 6"
                            fill="var(--color-gray-400)"
                          />
                        </marker>
                      </defs>
                      <path
                        d={`
              M ${24 + 64 + (nodes.length - 1) * 104} ${24 + 32}
              L ${24 + 64 + (nodes.length - 1) * 104 + 24} ${24 + 32}
              L ${24 + 64 + (nodes.length - 1) * 104 + 24} 0
              L 0 0
              L 0 ${24 + 32}
              L 24 ${24 + 32}
            `}
                        stroke="var(--color-gray-400)"
                        strokeWidth="2"
                        fill="none"
                        markerEnd="url(#queueCircularArrowhead)"
                      />
                    </svg>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      {/* Operations */}
      <div className="grid md:grid-cols-2 gap-6">
        <ReduxCollapsible title="Queue Operations">
          <CardContent className="space-y-4">
            {/* ENQUEUE */}
            <div>
              <p className="text-sm text-gray-400 mb-1">Add value to queue:</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleEnqueue()}
                  disabled={isAnimating}
                />
                <Button
                  onClick={handleEnqueue}
                  disabled={isAnimating}
                  variant="outline"
                >
                  {queueType === "deque" ? "Add Rear" : "Enqueue"}
                </Button>
                {queueType === "deque" && (
                  <Button
                    onClick={handleEnqueueFront}
                    disabled={isAnimating}
                    variant="outline"
                  >
                    Add Front
                  </Button>
                )}
              </div>
            </div>

            {/* DEQUEUE */}
            <div>
              <p className="text-sm text-gray-400 mb-1">
                Remove value from queue:
              </p>
              <div
                className={`flex ${queueType === "deque" ? "gap-2" : "flex-col"}`}
              >
                <Button
                  onClick={handleDequeue}
                  disabled={isAnimating}
                  variant="outline"
                  className={queueType === "deque" ? "w-half" : "w-full"}
                >
                  Dequeue
                  {queueType === "deque" ? " Front" : ""}
                </Button>
                {queueType === "deque" && (
                  <Button
                    onClick={handleDequeueRear}
                    disabled={isAnimating}
                    variant="outline"
                  >
                    Dequeue Rear
                  </Button>
                )}
              </div>
            </div>

            {/* PEEK */}
            <div>
              <p className="text-sm text-gray-400 mb-1">Peek at values:</p>
              <div
                className={`flex ${queueType === "deque" ? "gap-2" : "flex-col"}`}
              >
                <Button
                  onClick={handlePeek}
                  disabled={isAnimating}
                  variant="outline"
                  className={queueType === "deque" ? "" : "w-full"}
                >
                  Peek Front
                </Button>
                {queueType === "deque" && (
                  <Button
                    onClick={handlePeekRear}
                    disabled={isAnimating}
                    variant="outline"
                  >
                    Peek Rear
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </ReduxCollapsible>

        <ReduxCollapsible title="Utilities">
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-400 mb-0">
              Get the current size of the queue:
            </p>
            <Button
              onClick={handleGetLength}
              variant="outline"
              className="w-full"
              disabled={isAnimating}
            >
              <iconMap.Hash className="size-4 mr-2" />
              Get Size
            </Button>
            <hr className="my-2" />
            <p className="text-sm text-gray-400 mb-0">
              Check if the queue is empty:
            </p>
            <Button
              onClick={handleCheckEmpty}
              variant="outline"
              className="w-full"
              disabled={isAnimating}
            >
              <iconMap.CheckCircle className="size-4 mr-2" />
              Check Empty
            </Button>
            <hr className="my-2" />
            <p className="text-sm text-gray-400 mb-0">
              Clear the entire queue:
            </p>
            <Button
              onClick={handleClear}
              variant="outline"
              className="w-full"
              disabled={isAnimating}
            >
              <iconMap.RotateCcw className="size-4 mr-2" />
              Clear
            </Button>
          </CardContent>
        </ReduxCollapsible>
      </div>
    </div>
  );
};

export default QueueVisualizer;
