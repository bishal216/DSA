// src/hooks/use-sort-visualization.ts
import { useSortingEngine } from "@/hooks/use-sorting-engine";
import { useCallback, useState } from "react";
import { useArray } from "./use-array";

export const useSortVisualization = (defaultSize = 20) => {
  const [speed, setSpeed] = useState([50]);
  const [isStepMode, setIsStepMode] = useState(false);

  const {
    array,
    setArray,
    generateArray,
    resetArray,
    setCustomArray,
    comparisons,
    setComparisons,
    swaps,
    setSwaps,
    arraySize,
    setArraySize,
  } = useArray(defaultSize);

  const {
    steps,
    currentStep,
    isRunning,
    setIsRunning,
    isPaused,
    setIsPaused,
    pauseResume,
    stepForward,
    generateSteps,
    startExecuting,
    clearTimeouts,
    algorithm,
    setAlgorithm,
  } = useSortingEngine({ array, setArray, setComparisons, setSwaps });

  const startSorting = useCallback(() => {
    clearTimeouts();
    setIsPaused(false);
    const newSteps = generateSteps(algorithm);

    if (!isStepMode) {
      // startExecuting sets the ref synchronously before running,
      // avoiding the stale closure bug with setIsRunning + executeSteps
      startExecuting(newSteps, speed[0]);
    } else {
      // Step mode — steps ready, engine stays idle
      setIsRunning(false);
    }
  }, [
    clearTimeouts,
    setIsPaused,
    setIsRunning,
    generateSteps,
    startExecuting,
    algorithm,
    isStepMode,
    speed,
  ]);

  const handlePauseResume = useCallback(() => {
    pauseResume(speed[0]);
  }, [pauseResume, speed]);

  const handleStopSorting = useCallback(() => {
    clearTimeouts();
    setIsRunning(false);
    setIsPaused(false);
  }, [clearTimeouts, setIsRunning, setIsPaused]);

  const handleSeekToStep = useCallback(
    (step: number) => {
      if (isRunning) return;
      stepForward(step - currentStep);
    },
    [isRunning, stepForward, currentStep],
  );

  return {
    // controls
    algorithm,
    setAlgorithm,
    arraySize,
    setArraySize,
    speed,
    setSpeed,
    isStepMode,
    setIsStepMode,

    // core data
    array,
    steps,
    currentStep,
    comparisons,
    swaps,

    // engine state
    isRunning,
    isPaused,

    // actions
    startSorting,
    handlePauseResume,
    handleStopSorting,
    handleSeekToStep,
    stepForward,
    resetArray,
    generateArray,
    setCustomArray,
  };
};
