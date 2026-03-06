import { PlaybackControls } from "@/components/controls/playback-control";
import { GraphDSCanvas } from "@/components/data-structures/graph-ds/graph-ds-canvas";
import { GraphDSControls } from "@/components/data-structures/graph-ds/graph-ds-controls";
import { GraphRepresentation } from "@/components/data-structures/graph-ds/graph-ds-representation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { GraphVariant } from "@/data-structures/graph-ds";
import { useGraphDS } from "@/hooks/use-graph-ds";
import { useState } from "react";

const VARIANTS: { value: GraphVariant; label: string; description: string }[] =
  [
    {
      value: "undirected",
      label: "Undirected",
      description: "Edges have no direction. Adjacency is symmetric.",
    },
    {
      value: "directed",
      label: "Directed (Digraph)",
      description: "Edges are one-way: u → v does not imply v → u.",
    },
    {
      value: "weighted",
      label: "Weighted Directed",
      description: "Directed edges with numeric weights.",
    },
  ];

export default function GraphDSPage() {
  const [variant, setVariant] = useState<GraphVariant>("undirected");

  const {
    nodeLabel,
    setNodeLabel,
    fromLabel,
    setFromLabel,
    toLabel,
    setToLabel,
    weightValue,
    setWeightValue,
    steps,
    currentStep,
    isRunning,
    isPaused,
    isStepMode,
    setIsStepMode,
    speed,
    setSpeed,
    currentOp,
    displayStep,
    graphData,
    onStart,
    onPauseResume,
    onStepForward,
    onStepBackward,
    reset,
    onNodeMove,
  } = useGraphDS(variant);

  const sel = VARIANTS.find((v) => v.value === variant)!;

  return (
    <div className="flex flex-col gap-6 p-6 max-w-7xl mx-auto w-full">
      <div>
        <h1 className="text-2xl font-bold">Graph</h1>
        <p className="text-sm text-muted-foreground mt-1">{sel.description}</p>
      </div>

      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium">Graph Variant</label>
            <Select
              value={variant}
              onValueChange={(v) => setVariant(v as GraphVariant)}
              disabled={isRunning}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VARIANTS.map(({ value, label }) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6 lg:items-stretch">
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Graph Visualizer</CardTitle>
              {displayStep.message && (
                <p className="text-sm text-muted-foreground">
                  {displayStep.message}
                </p>
              )}
              {displayStep.subMessage && (
                <p className="text-xs text-muted-foreground/70">
                  {displayStep.subMessage}
                </p>
              )}
            </CardHeader>
            <CardContent>
              <div
                className="bg-muted rounded-lg overflow-hidden"
                style={{ height: 340 }}
              >
                <GraphDSCanvas
                  graph={graphData}
                  nodeStates={displayStep.nodeStates}
                  edgeStates={displayStep.edgeStates}
                  directed={displayStep.directed}
                  onNodeMove={onNodeMove}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Representations</CardTitle>
            </CardHeader>
            <CardContent className="h-52 flex flex-col">
              <GraphRepresentation
                graph={graphData}
                edgeStates={displayStep.edgeStates}
                directed={displayStep.directed}
                weighted={displayStep.weighted}
              />
            </CardContent>
          </Card>
        </div>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Controls</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 flex-1">
            <GraphDSControls
              nodeLabel={nodeLabel}
              setNodeLabel={setNodeLabel}
              fromLabel={fromLabel}
              setFromLabel={setFromLabel}
              toLabel={toLabel}
              setToLabel={setToLabel}
              weightValue={weightValue}
              setWeightValue={setWeightValue}
              isRunning={isRunning}
              weighted={variant === "weighted"}
              directed={variant !== "undirected"}
              graphData={graphData}
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
              onStart={() => currentOp && onStart(currentOp)}
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
