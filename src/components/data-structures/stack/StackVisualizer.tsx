import PushPopControls from "@/components/data-structures/stack/operations-control";
import StackNodes from "@/components/data-structures/stack/stack-nodes";
import UtilityControls from "@/components/data-structures/stack/utility-controls";
import { Card, CardContent } from "@/components/ui/card";
import RadixCollapsibleCard from "@/components/ui/radix-collapsible-card";
import { Stack } from "@/utils/data-structures/stack";
import { ListNode } from "@/utils/LinkedListNode";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const StackVisualizer = () => {
  const [stack, setStack] = useState(new Stack());
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [highlightedNode, setHighlightedNode] = useState<string | null>(null);
  const [searchResult, setSearchResult] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const newStack = new Stack();
    newStack.push(10);
    newStack.push(20);
    newStack.push(30);
    setStack(newStack);
    setNodes(newStack.toArray());
  }, []);

  const updateVisualization = () => setNodes(stack.toArray());

  const animateOperation = async (highlightTopOnly = false) => {
    setIsAnimating(true);
    if (nodes.length > 0 && highlightTopOnly) {
      setHighlightedNode(nodes[0].id);
      await new Promise((resolve) => setTimeout(resolve, 600));
    }
    setHighlightedNode(null);
    setIsAnimating(false);
  };

  const handlePush = () => {
    if (!inputValue.trim()) return toast.error("Enter value to push");
    const value = parseInt(inputValue, 10);
    if (isNaN(value)) return toast.error("Enter a valid number");

    const result = stack.push(value);
    updateVisualization();
    toast.success(result.message);
    setInputValue("");
  };

  const handlePop = async () => {
    await animateOperation(true);
    const result = stack.pop();
    updateVisualization();
    toast[result.success ? "success" : "error"](result.message);
  };

  const handlePeek = async () => {
    await animateOperation(true);
    const result = stack.peek();
    toast[result.success ? "success" : "error"](result.message);
  };

  const handleClear = () => {
    stack.clear();
    updateVisualization();
    setSearchResult(null);
    setHighlightedNode(null);
    toast.success("Stack cleared");
  };

  const handleGetLength = () => toast.success(`Size: ${stack.getLength()}`);
  const handleCheckEmpty = () =>
    toast.success(stack.isEmpty() ? "Stack is empty" : "Stack is not empty");

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardContent>
          <StackNodes
            nodes={nodes}
            highlightedNode={highlightedNode}
            searchResult={searchResult}
          />
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-6">
        <RadixCollapsibleCard title="Stack Operations">
          <CardContent>
            <PushPopControls
              inputValue={inputValue}
              setInputValue={setInputValue}
              handlePush={handlePush}
              handlePop={() => {
                void handlePop();
              }}
              handlePeek={() => {
                void handlePeek();
              }}
              isAnimating={isAnimating}
            />
          </CardContent>
        </RadixCollapsibleCard>
        <RadixCollapsibleCard title="Utilities">
          <CardContent>
            <UtilityControls
              handleClear={handleClear}
              handleCheckEmpty={handleCheckEmpty}
              handleGetLength={handleGetLength}
              isAnimating={isAnimating}
            />
          </CardContent>
        </RadixCollapsibleCard>
      </div>
    </div>
  );
};

export default StackVisualizer;
