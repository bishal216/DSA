import React from "react";
// UI
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { iconMap } from "@/utils/iconmap";
import { Badge } from "@/components/ui/badge";
// Types
import {
  SORTING_ALGORITHMS,
  SortingAlgorithmKey,
} from "../types/sortingAlgorithms";
import { SortingControlsProps } from "../types/sortInterface";

export const SortingControls: React.FC<SortingControlsProps> = ({
  generateArray,
  resetArray,
  comparisons,
  swaps,
  arraySize,
  setArraySize,
  algorithm,
  setAlgorithm,
  speed,
  setSpeed,
  isStepMode,
  setIsStepMode,
  steps,
  setSteps,
  currentStep,
  setCurrentStep,
  isRunning,
  setIsRunning,
  isPaused,
  startSorting,
  handlePauseResume,
  stepForward,
}) => {
  const handleReset = () => {
    resetArray();
    setIsStepMode(false);
    setIsRunning(false);
    setSteps([]);
    setCurrentStep(0);
  };

  const handleShuffle = () => {
    generateArray();
    setIsStepMode(false);
    setIsRunning(false);
    setSteps([]);
    setCurrentStep(0);
  };
  return (
    <Card className="lg:col-span-1">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Algorithm</label>
          <Select
            value={algorithm}
            onValueChange={(v) => setAlgorithm(v as SortingAlgorithmKey)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(SORTING_ALGORITHMS).map(([key, { name }]) => (
                <SelectItem key={key} value={key}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">
            Array Size: {arraySize[0]}
          </label>
          <Slider
            value={arraySize}
            onValueChange={setArraySize}
            min={5}
            max={50}
            step={1}
            className="mt-2"
            disabled={isRunning && !isPaused}
          />
        </div>

        <div>
          <label className="text-sm font-medium">Speed: {speed[0]}%</label>
          <Slider
            value={speed}
            onValueChange={setSpeed}
            min={1}
            max={100}
            step={1}
            className="mt-2"
            disabled={isRunning && !isPaused}
          />
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="stepMode"
            checked={isStepMode}
            onChange={(e) => setIsStepMode(e.target.checked)}
            className="rounded"
          />
          <label htmlFor="stepMode" className="text-sm font-medium">
            Step Mode
          </label>
        </div>

        <div className="space-y-2">
          {!isStepMode ? (
            <div className="flex space-x-2">
              <Button
                onClick={startSorting}
                disabled={isRunning}
                className="flex-1"
                variant="outline"
              >
                <iconMap.Play className="size-4 mr-2" />
                Generate Steps
              </Button>
              {(isRunning || isPaused) && (
                <Button onClick={handlePauseResume} variant="outline">
                  {isPaused ? <iconMap.Play /> : <iconMap.Pause />}
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Button
                onClick={startSorting}
                className="w-full"
                variant="outline"
              >
                <iconMap.Play className="size-4 mr-2" />
                Prepare Steps
              </Button>
              <div className="flex space-x-2">
                <Button
                  onClick={() => stepForward(1)}
                  disabled={currentStep >= steps.length - 1}
                  variant="outline"
                  className="flex-1"
                >
                  +1 Step
                </Button>
                <Button
                  onClick={() => stepForward(10)}
                  disabled={currentStep >= steps.length - 1}
                  variant="outline"
                  className="flex-1"
                >
                  +10 Steps
                </Button>
              </div>
            </div>
          )}

          <div className="flex space-x-2">
            <Button onClick={handleReset} variant="outline" className="flex-1">
              <iconMap.RotateCcw className="size-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleShuffle}
              variant="outline"
              className="flex-1"
            >
              <iconMap.Shuffle className="size-4 mr-2" />
              Shuffle
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Comparisons:</span>
            <Badge variant="secondary">{comparisons}</Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">Swaps:</span>
            <Badge variant="secondary">{swaps}</Badge>
          </div>
          {isStepMode && steps.length > 0 && (
            <div className="flex justify-between">
              <span className="text-sm">Step:</span>
              <Badge variant="secondary">
                {currentStep + 1}/{steps.length}
              </Badge>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
