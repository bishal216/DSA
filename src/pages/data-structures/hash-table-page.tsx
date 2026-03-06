import { PlaybackControls } from "@/components/controls/playback-control";
import { HashTableControls } from "@/components/data-structures/hash-table/hash-table-controls";
import { HashTableVisualizer } from "@/components/data-structures/hash-table/hash-table-visualizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { HashTableType } from "@/data-structures/hash-table";
import { useHashTable } from "@/hooks/use-hash-table";
import { useState } from "react";

const TABLE_TYPES: {
  value: HashTableType;
  label: string;
  description: string;
}[] = [
  {
    value: "linear",
    label: "Linear Probing",
    description:
      "On collision, scan forward one slot at a time: h(k, i) = (h(k) + i) mod m",
  },
  {
    value: "quadratic",
    label: "Quadratic Probing",
    description:
      "On collision, probe with increasing squares: h(k, i) = (h(k) + i²) mod m",
  },
  {
    value: "double",
    label: "Double Hashing",
    description:
      "On collision, use a second hash function: h(k, i) = (h₁(k) + i·h₂(k)) mod m",
  },
  {
    value: "chaining",
    label: "Separate Chaining",
    description:
      "Each bucket holds a linked list. Multiple keys can share a bucket.",
  },
];

export default function HashTablePage() {
  const [tableType, setTableType] = useState<HashTableType>("linear");

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
  } = useHashTable(tableType);

  const selected = TABLE_TYPES.find((t) => t.value === tableType)!;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold">Hash Table</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {selected.description}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:items-stretch">
        {/* Left — type selector + visualizer */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">
                  Collision Strategy
                </label>
                <Select
                  value={tableType}
                  onValueChange={(v) => setTableType(v as HashTableType)}
                  disabled={isRunning}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TABLE_TYPES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <HashTableVisualizer
            step={displayStep}
            message={displayStep.message}
          />
        </div>

        {/* Right — controls */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1">
            <HashTableControls
              inputValue={inputValue}
              setInputValue={setInputValue}
              isRunning={isRunning}
              tableType={tableType}
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
