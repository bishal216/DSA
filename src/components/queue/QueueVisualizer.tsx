import { useState, useEffect } from "react";
import { Queue } from "@/utils/queues/queue";
import { ListNode } from "@/utils/LinkedListNode";
import toast from "react-hot-toast";
import { Card, CardContent } from "@/components/ui/card";
import ReduxCollapsible from "@/components/ui/collapsible-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Eye, RotateCcw, Hash, CheckCircle } from "lucide-react";

const QueueVisualizer = () => {
  const [queue, setQueue] = useState(new Queue());
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Initialize with some sample data
    const newQueue = new Queue();
    newQueue.enqueue(10);
    newQueue.enqueue(20);
    newQueue.enqueue(30);

    setQueue(newQueue);
    setNodes(newQueue.toArray());
  }, []);

  const updateVisualization = () => {
    setNodes(queue.toArray());
  };

  const animateOperation = async (highlightFrontOnly: boolean = false) => {
    setIsAnimating(true);
    if (nodes.length > 0 && highlightFrontOnly) {
      setHighlightedNode(nodes[0].id);
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

    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }

    const result = queue.enqueue(value);
    updateVisualization();
    toast.success(result.message);
    setInputValue("");
  };

  const handleDequeue = async () => {
    await animateOperation(true);

    const result = queue.dequeue();
    updateVisualization();

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handlePeek = async () => {
    await animateOperation(true);

    const result = queue.peek();

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
    const length = queue.getLength();
    toast.success(`Queue size: ${length}`);
  };

  const handleCheckEmpty = () => {
    const isEmpty = queue.isEmpty();
    toast.success(`Queue is ${isEmpty ? "empty" : "not empty"}`);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Visualization */}
      <Card className="mb-6 h-min-[300px]">
        <CardContent>
          {nodes.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">🚶‍♀️</div>
                <p>Empty queue</p>
                <p className="text-sm">Enqueue some elements to get started!</p>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 p-6 overflow-x-auto">
              {nodes.map((node, index) => (
                <div key={node.id} className="flex items-center">
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
                    {index === 0 && (
                      <Badge
                        variant="outline"
                        className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-cyan-600 border-cyan-300"
                      >
                        FRONT
                      </Badge>
                    )}
                    {index === nodes.length - 1 && (
                      <Badge
                        variant="outline"
                        className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs font-semibold text-blue-600 border-blue-300"
                      >
                        REAR
                      </Badge>
                    )}
                  </div>
                  {index < nodes.length - 1 && (
                    <ArrowRight className="w-6 h-6 text-gray-400 mx-2" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Operations */}
      <div className="grid md:grid-cols-2 gap-6">
        <ReduxCollapsible title="Queue Operations">
          <CardContent className="space-y-3">
            <p className="text-sm text-gray-400 mb-0">
              Enqueue a new value to the queue:
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isAnimating}
              />
              <Button
                onClick={handleEnqueue}
                disabled={isAnimating}
                variant={"outline"}
              >
                Enqueue
              </Button>
            </div>
            <hr className="my-2" />
            <p className="text-sm text-gray-400 mb-0">
              Dequeue the front value from the queue:
            </p>
            <Button
              onClick={handleDequeue}
              disabled={isAnimating}
              variant="outline"
              className="w-full"
            >
              Dequeue
            </Button>
            <hr className="my-2" />
            <p className="text-sm text-gray-400 mb-0">
              Peek at the front value of the queue:
            </p>
            <Button
              onClick={handlePeek}
              disabled={isAnimating}
              variant="outline"
              className="w-full"
            >
              <Eye className="w-4 h-4 mr-2" />
              Peek
            </Button>
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
              <Hash className="w-4 h-4 mr-2" />
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
              <CheckCircle className="w-4 h-4 mr-2" />
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
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </CardContent>
        </ReduxCollapsible>
      </div>
    </div>
  );
};

export default QueueVisualizer;
