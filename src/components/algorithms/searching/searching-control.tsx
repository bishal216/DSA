// src/components/search/SearchControls.tsx

import type { SearchAlgorithmKey } from "@/algorithms/registry/searching-algorithms-registry";
import type { SearchStep } from "@/algorithms/types/searching";
import { SearchAlgorithmSelector } from "@/components/algorithms/searching/search-algorithm-selector";
import { SearchStats } from "@/components/algorithms/searching/search-stats";
import { ArrayControls } from "@/components/controls/array-controls";
import { PlaybackControls } from "@/components/controls/playback-control";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

const SEARCH_ARRAY_SIZE = 15;

interface SearchControlsProps {
  array: number[];
  setSortedArray: (array: number[]) => void;
  searchValue: number;
  setSearchValue: (value: number) => void;
  algorithm: SearchAlgorithmKey;
  setAlgorithm: (algorithm: SearchAlgorithmKey) => void;
  speed: number[];
  setSpeed: (speed: number[]) => void;
  isStepMode: boolean;
  setIsStepMode: (val: boolean) => void;
  steps: SearchStep[];
  currentStep: number;
  isRunning: boolean;
  isPaused: boolean;
  onStart: () => void;
  handlePauseResume: () => void;
  stepForward: (count?: number) => void;
}

export function SearchControls({
  setSortedArray,
  searchValue,
  setSearchValue,
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
  onStart,
  handlePauseResume,
  stepForward,
}: SearchControlsProps) {
  const [arraySize, setArraySize] = useState(SEARCH_ARRAY_SIZE);

  const currentStepData = steps[currentStep];
  const isFound = (currentStepData?.foundIndex ?? -1) !== -1;
  const isComplete = currentStepData?.stepType === "complete";

  const handleShuffle = () => {
    const newArray = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * 100) + 1,
    );
    setSortedArray(newArray);
  };

  const handleCustomArray = (values: number[]) => {
    setSortedArray(values);
  };

  const handleReset = () => {
    // no-op here — stop is handled by handleStopSearch in the page
  };

  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchAlgorithmSelector
          algorithm={algorithm}
          setAlgorithm={setAlgorithm}
          disabled={isRunning && !isPaused}
        />
        <Separator />

        <div>
          <Label htmlFor="searchValue">Search Value</Label>
          <Input
            id="searchValue"
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(Number(e.target.value))}
            disabled={isRunning && !isPaused}
            className="mt-1"
          />
        </div>
        <Separator />

        <ArrayControls
          arraySize={arraySize}
          setArraySize={setArraySize}
          onReset={handleReset}
          onShuffle={handleShuffle}
          onCustomArray={handleCustomArray}
          disabled={isRunning && !isPaused}
        />
        <Separator />

        {/* Reuse SortPlaybackControls — search now has the same step infrastructure */}
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
          onStart={onStart}
          onPauseResume={handlePauseResume}
          onStepForward={stepForward}
        />
        <Separator />

        <SearchStats
          comparisons={currentStep}
          found={isFound}
          isSearching={isRunning}
          notFound={isComplete && !isFound}
        />
      </CardContent>
    </Card>
  );
}
