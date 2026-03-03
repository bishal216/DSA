// src/hooks/use-search-visualization.ts

import { useSearchingEngine } from "@/hooks/use-searching-engine";
import { useCallback, useState } from "react";

export type { SearchAlgorithmKey } from "@/algorithms/types/searching-algorithms-registry";

const DEFAULT_ARRAY = [1, 3, 5, 7, 9, 12, 15, 18, 21, 25, 28, 31, 35, 38, 42];

export const useSearchVisualization = (initialArray: number[] = []) => {
  const [array, setArray] = useState<number[]>(
    initialArray.length ? initialArray : DEFAULT_ARRAY,
  );
  const [searchValue, setSearchValue] = useState<number>(15);
  const [speed, setSpeed] = useState<number[]>([50]);
  const [isStepMode, setIsStepMode] = useState(false);

  const {
    algorithm,
    setAlgorithm,
    steps,
    currentStep,
    isRunning,
    setIsRunning,
    isPaused,
    setIsPaused,
    generateSteps,
    startExecuting,
    pauseResume,
    stepForward,
    clearTimeouts,
  } = useSearchingEngine();

  const startSearch = useCallback(() => {
    clearTimeouts();
    setIsPaused(false);
    const newSteps = generateSteps(array, searchValue, algorithm);

    if (!isStepMode) {
      startExecuting(newSteps, speed);
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
    array,
    searchValue,
    algorithm,
    isStepMode,
    speed,
  ]);

  const handlePauseResume = useCallback(() => {
    pauseResume(speed);
  }, [pauseResume, speed]);

  const handleStopSearch = useCallback(() => {
    clearTimeouts();
    setIsRunning(false);
    setIsPaused(false);
  }, [clearTimeouts, setIsRunning, setIsPaused]);

  // Always sort before setting — binary search requires a sorted array
  const setSortedArray = useCallback((arr: number[]) => {
    setArray([...arr].sort((a, b) => a - b));
  }, []);

  return {
    // config
    array,
    setSortedArray,
    searchValue,
    setSearchValue,
    algorithm,
    setAlgorithm,
    speed,
    setSpeed,
    isStepMode,
    setIsStepMode,

    // step data
    steps,
    currentStep,

    // engine state
    isRunning,
    isPaused,

    // actions
    startSearch,
    handlePauseResume,
    handleStopSearch,
    stepForward,
  };
};
