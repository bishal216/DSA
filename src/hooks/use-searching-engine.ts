// src/hooks/use-searching-engine.ts

import {
  SEARCH_ALGORITHMS,
  type SearchAlgorithmKey,
} from "@/algorithms/registry/searching-algorithms-registry";
import type { SearchStep } from "@/algorithms/types/searching";
import { useEffect, useRef, useState } from "react";

export const useSearchingEngine = () => {
  const [algorithm, setAlgorithm] = useState<SearchAlgorithmKey>("linear");
  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);
  const isRunningRef = useRef(false);
  const currentStepRef = useRef(0);

  useEffect(() => {
    isPausedRef.current = isPaused;
  }, [isPaused]);
  useEffect(() => {
    isRunningRef.current = isRunning;
  }, [isRunning]);
  useEffect(() => {
    currentStepRef.current = currentStep;
  }, [currentStep]);

  const clearTimeouts = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  const generateSteps = (
    array: number[],
    target: number,
    algorithmKey?: SearchAlgorithmKey,
  ) => {
    const key = algorithmKey ?? algorithm;
    const searchFn =
      SEARCH_ALGORITHMS[key]?.func ?? SEARCH_ALGORITHMS.linear.func;

    const generatedSteps = searchFn(array, target);

    setSteps(generatedSteps);
    setCurrentStep(0);
    currentStepRef.current = 0;
    setIsPaused(false);
    isPausedRef.current = false;

    return generatedSteps;
  };

  const executeSteps = (
    stepsToRun: SearchStep[],
    index: number,
    speed: number[],
  ) => {
    clearTimeouts();

    if (index >= stepsToRun.length) {
      setIsRunning(false);
      isRunningRef.current = false;
      setIsPaused(false);
      isPausedRef.current = false;
      return;
    }

    if (isPausedRef.current || !isRunningRef.current) return;

    setCurrentStep(index);
    currentStepRef.current = index;

    timeoutRef.current = setTimeout(
      () => executeSteps(stepsToRun, index + 1, speed),
      1000 - speed[0] * 10,
    );
  };

  // Synchronously sets both state and ref before executing —
  // same stale-closure fix as useSortingEngine
  const startExecuting = (stepsToRun: SearchStep[], speed: number[]) => {
    setIsRunning(true);
    isRunningRef.current = true;
    executeSteps(stepsToRun, 0, speed);
  };

  const pauseResume = (speed: number[]) => {
    setIsPaused((prev) => {
      const newPaused = !prev;
      isPausedRef.current = newPaused;

      if (!newPaused && isRunningRef.current) {
        executeSteps(steps, currentStepRef.current + 1, speed);
      } else {
        clearTimeouts();
      }

      return newPaused;
    });
  };

  const stepForward = (count: number = 1) => {
    const newIndex = Math.min(currentStepRef.current + count, steps.length - 1);
    setCurrentStep(newIndex);
    currentStepRef.current = newIndex;
  };

  return {
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
  };
};
