// src/components/algorithms/SortingControls.tsx
import { SortingAlgorithmKey } from "@/algorithms/registry/sorting-algorithms-registry";
import { SortingStep } from "@/algorithms/types/sorting";
import { SortAlgorithmSelector } from "@/components/algorithms/sorting/sort-algorithm-selector";
import { SortStats } from "@/components/algorithms/sorting/sort-stats";
import { ArrayControls } from "@/components/controls/array-controls";
import { PlaybackControls } from "@/components/controls/playback-control";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import React from "react";
// ── Props ─────────────────────────────────────────────────────────────────────

interface SortingControlsProps {
  // Array
  arraySize: number;
  setArraySize: (size: number) => void;
  onReset: () => void;
  onShuffle: () => void;
  setCustomArray: (values: number[]) => void;

  // Algorithm
  algorithm: SortingAlgorithmKey;
  setAlgorithm: (algo: SortingAlgorithmKey) => void;

  // Playback
  speed: number[];
  setSpeed: (speed: number[]) => void;
  isStepMode: boolean;
  setIsStepMode: (val: boolean) => void;
  steps: SortingStep[];
  currentStep: number;
  isRunning: boolean;
  isPaused: boolean;
  comparisons: number;
  swaps: number;
  startSorting: () => void;
  handlePauseResume: () => void;
  stepForward: (count?: number) => void;
}

// ── Component ─────────────────────────────────────────────────────────────────

export const SortingControls: React.FC<SortingControlsProps> = ({
  arraySize,
  setArraySize,
  setCustomArray,
  onReset,
  onShuffle,
  algorithm,
  setAlgorithm,
  speed,
  setSpeed,
  isStepMode,
  setIsStepMode,
  steps,
  currentStep,
  isRunning,
  isPaused,
  comparisons,
  swaps,
  startSorting,
  handlePauseResume,
  stepForward,
}) => {
  const isBusy = isRunning && !isPaused;

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SortAlgorithmSelector
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          disabled={isBusy}
        />
        <Separator />
        <ArrayControls
          arraySize={arraySize}
          setArraySize={setArraySize}
          onReset={onReset}
          onShuffle={onShuffle}
          onCustomArray={setCustomArray}
          disabled={isBusy}
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
          comparisons={comparisons}
          swaps={swaps}
          onStart={startSorting}
          onPauseResume={handlePauseResume}
          onStepForward={stepForward}
        />
        <Separator />
        <SortStats
          comparisons={comparisons}
          swaps={swaps}
          {...(isStepMode && { steps, currentStep })}
        />
      </CardContent>
    </Card>
  );
};
