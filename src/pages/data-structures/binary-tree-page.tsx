import { PlaybackControls } from "@/components/controls/playback-control";
import { TreeControls } from "@/components/data-structures/tree/tree-controls";
import { TreeVisualizer } from "@/components/data-structures/tree/tree-visualizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { TreeType, useBinaryTree } from "@/hooks/use-binary-tree";
import { useState } from "react";

const TREE_TYPES: { value: TreeType; label: string; description: string }[] = [
  {
    value: "bst",
    label: "Binary Search Tree",
    description:
      "Left values smaller, right values larger. Height O(log n) to O(n).",
  },
  {
    value: "avl",
    label: "AVL Tree",
    description: "Self-balancing BST. Rotations keep height strictly O(log n).",
  },
  {
    value: "minHeap",
    label: "Min Heap",
    description: "Parent always smaller than children. Root holds the minimum.",
  },
  {
    value: "maxHeap",
    label: "Max Heap",
    description: "Parent always larger than children. Root holds the maximum.",
  },
];

export default function BinaryTreePage() {
  const [treeType, setTreeType] = useState<TreeType>("bst");

  const {
    inputValue,
    setInputValue,
    steps,
    currentStep,
    isRunning,
    isPaused,
    isStepMode,
    setIsStepMode,
    speed,
    setSpeed,
    currentOperation,
    displayStep,
    onStart,
    onPauseResume,
    onStepForward,
    onStepBackward,
    reset,
  } = useBinaryTree(treeType);

  const selected = TREE_TYPES.find((t) => t.value === treeType)!;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold">{selected.label}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {selected.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:items-stretch">
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Tree Type</label>
                <Select
                  value={treeType}
                  onValueChange={(v) => setTreeType(v as TreeType)}
                  disabled={isRunning}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TREE_TYPES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <TreeVisualizer
            nodes={displayStep.nodes}
            rootId={displayStep.rootId}
            treeType={treeType}
            message={displayStep.message}
          />
        </div>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1">
            <TreeControls
              inputValue={inputValue}
              setInputValue={setInputValue}
              isRunning={isRunning}
              treeType={treeType}
              onStart={onStart}
              onReset={reset}
            />
            <Separator />
            <PlaybackControls
              speed={speed}
              setSpeed={setSpeed}
              isStepMode={isStepMode}
              setIsStepMode={setIsStepMode}
              steps={steps}
              currentStep={currentStep}
              isRunning={isRunning}
              isPaused={isPaused}
              comparisons={0}
              swaps={0}
              onStart={() => currentOperation && onStart(currentOperation)}
              onPauseResume={onPauseResume}
              onStepForward={onStepForward}
              onStepBackward={onStepBackward}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
