import { QueueControls } from "@/components/data-structures/queue/queue-controls";
import { QueueVisualizer } from "@/components/data-structures/queue/queue-visualizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueue } from "@/hooks/use-queue";
import type { QueueType } from "@/types/types";
import { useState } from "react";

const QUEUE_TYPES: { value: QueueType; label: string; description: string }[] =
  [
    {
      value: "linear",
      label: "Queue",
      description: "First-In, First-Out — enqueue at rear, dequeue from front.",
    },
    {
      value: "circular",
      label: "Circular Queue",
      description: "Rear wraps back to front, reusing freed space.",
    },
    {
      value: "deque",
      label: "Deque",
      description: "Double-ended — insert and remove from both ends.",
    },
  ];

export default function QueuePage() {
  const [queueType, setQueueType] = useState<QueueType>("linear");

  const { inputValue, setInputValue, isRunning, displayStep, onStart, reset } =
    useQueue(queueType);

  const selected = QUEUE_TYPES.find((t) => t.value === queueType)!;

  const handleTypeChange = (val: string) => {
    setQueueType(val as QueueType);
    reset();
  };

  return (
    <div className="flex flex-col gap-6 p-6 max-w-6xl mx-auto w-full">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-bold">{selected.label}</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {selected.description}
        </p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 lg:items-stretch">
        {/* Left column — selector + visualizer */}
        <div className="flex flex-col gap-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium">Queue Type</label>
                <Select
                  value={queueType}
                  onValueChange={handleTypeChange}
                  disabled={isRunning}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUEUE_TYPES.map(({ value, label }) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <QueueVisualizer
            nodes={displayStep.nodes}
            queueType={queueType}
            message={displayStep.message}
          />
        </div>

        {/* Right column — controls full height */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1">
            <QueueControls
              inputValue={inputValue}
              setInputValue={setInputValue}
              isRunning={isRunning}
              queueType={queueType}
              onStart={onStart}
              onReset={reset}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
