import { useState } from "react";
import { useArray } from "./useArray";
import { useSortingEngine } from "@/algorithms/hooks/useSortingEngine";
export const useSortVisualization = (defaultSize = 20) => {
  const [speed, setSpeed] = useState([50]);
  const [isStepMode, setIsStepMode] = useState(false);

  const {
    array,
    setArray,
    generateArray,
    resetArray,
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
    executeSteps,
    clearTimeouts,
    algorithm,
    setAlgorithm,
    setCurrentStep,
    setSteps,
  } = useSortingEngine({ array, setArray, setComparisons, setSwaps });

  const startSorting = () => {
    clearTimeouts();
    setIsPaused(false);
    setIsRunning(true);
    const newSteps = generateSteps(algorithm);
    if (!isStepMode) {
      executeSteps(newSteps, 0, speed[0]);
    }
  };

  const handlePauseResume = () => pauseResume(speed[0]);

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
    setArray,
    steps,
    setSteps,
    currentStep,
    setCurrentStep,
    comparisons,
    swaps,

    // engine state
    isRunning,
    setIsRunning,
    isPaused,
    setIsPaused,

    // engine actions
    startSorting,
    handlePauseResume,
    stepForward,
    resetArray,
    generateArray,
  };
};
