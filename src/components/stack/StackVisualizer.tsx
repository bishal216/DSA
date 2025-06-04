import { useState, useEffect } from "react";
import { Stack } from "@/utils/stack";
import { ListNode } from "@/utils/LinkedListNode";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowDown } from "lucide-react";
import { toast } from "react-hot-toast";
import RadixCollapsibleCard from "../ui/collapsible-card";
const StackVisualizer = () => {
  const [stack, setStack] = useState(new Stack());
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Initialize with some sample data
    const newStack = new Stack();
    newStack.push(10);
    newStack.push(20);
    newStack.push(30);

    setStack(newStack);
    setNodes(newStack.toArray());
  }, []);

  const updateVisualization = () => {
    setNodes(stack.toArray());
  };

  const animateOperation = async (highlightTopOnly: boolean = false) => {
    setIsAnimating(true);
    if (nodes.length > 0 && highlightTopOnly) {
      setHighlightedNode(nodes[0].id);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
    setHighlightedNode(null);
    setIsAnimating(false);
  };

  const handlePush = async () => {
    if (!inputValue.trim()) {
      toast.error("Please enter a value to push");
      return;
    }

    const value = parseInt(inputValue);
    if (isNaN(value)) {
      toast.error("Please enter a valid number");
      return;
    }

    const result = stack.push(value);
    updateVisualization();
    toast.success(result.message);
    setInputValue("");
  };

  const handlePop = async () => {
    await animateOperation(true);

    const result = stack.pop();
    updateVisualization();

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handlePeek = async () => {
    await animateOperation(true);

    const result = stack.peek();

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };

  const handleClear = () => {
    stack.clear();
    updateVisualization();
    setSearchResult(null);
    setHighlightedNode(null);
    toast.success("Stack cleared successfully");
  };

  const handleGetLength = () => {
    const length = stack.getLength();
    toast.success(`Stack size: ${length}`);
  };

  const handleCheckEmpty = () => {
    const isEmpty = stack.isEmpty();
    toast.success(isEmpty ? "The stack is empty" : "The stack is not empty");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Visualization */}
      <Card>
        <CardContent>
          {nodes.length === 0 ? (
            <div className="flex items-center justify-center h-32 text-gray-500">
              <div className="text-center">
                <div className="text-4xl mb-2">📚</div>
                <p>Empty stack</p>
                <p className="text-sm">Push some elements to get started!</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 p-6">
              {nodes.map((node, index) => (
                <div key={node.id} className="flex flex-col items-center">
                  <div
                    className={`
                      relative flex items-center justify-center w-20 h-12 rounded-lg border-2 transition-all duration-300
                      ${
                        searchResult === node.id
                          ? "bg-green-100 border-green-400 shadow-green-200 shadow-lg"
                          : highlightedNode === node.id
                            ? "bg-yellow-100 border-yellow-400 shadow-yellow-200 shadow-lg"
                            : index === 0
                              ? "bg-orange-100 border-orange-400 shadow-md"
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
                              ? "text-orange-700"
                              : "text-gray-700"
                      }`}
                    >
                      {node.value}
                    </span>
                    {index === 0 && (
                      <Badge
                        variant="outline"
                        className="absolute -right-12 text-xs font-semibold text-orange-600 border-orange-300"
                      >
                        TOP
                      </Badge>
                    )}
                  </div>
                  {index < nodes.length - 1 && (
                    <ArrowDown className="w-4 h-4 text-gray-400 my-1" />
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      {/* Operations */}
      <div className="grid md:grid-cols-2 gap-6">
        <RadixCollapsibleCard title="Stack Operations">
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={isAnimating}
              />
              <Button
                onClick={handlePush}
                disabled={isAnimating}
                variant={"outline"}
              >
                Push
              </Button>
            </div>
            <Button
              onClick={handlePop}
              disabled={isAnimating}
              variant="outline"
              className="w-full"
            >
              Pop
            </Button>
            <Button
              onClick={handlePeek}
              disabled={isAnimating}
              variant="outline"
              className="w-full"
            >
              Peek
            </Button>
          </CardContent>
        </RadixCollapsibleCard>

        <RadixCollapsibleCard title="Utilities">
          <CardContent className="space-y-3">
            <Button
              onClick={handleGetLength}
              variant="outline"
              className="w-full"
              disabled={isAnimating}
            >
              Get Size
            </Button>
            <Button
              onClick={handleCheckEmpty}
              variant="outline"
              className="w-full"
              disabled={isAnimating}
            >
              Check Empty
            </Button>
            <Button
              onClick={handleClear}
              variant="outline"
              className="w-full"
              disabled={isAnimating}
            >
              Clear
            </Button>
          </CardContent>
        </RadixCollapsibleCard>
      </div>
    </div>
  );
};

export default StackVisualizer;
