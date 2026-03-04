// src/hooks/use-sorting-engine.ts
import {
  SORTING_ALGORITHMS,
  SortingAlgorithmKey,
} from "@/algorithms/registry/sorting-algorithms-registry";
import { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import { useEffect, useRef, useState } from "react";

export const useSortingEngine = ({
  array,
  setArray,
  setComparisons,
  setSwaps,
}: {
  array: ArrayElement[];
  setArray: (arr: ArrayElement[]) => void;
  setComparisons: (count: number) => void;
  setSwaps: (count: number) => void;
}) => {
  const [algorithm, setAlgorithm] = useState<SortingAlgorithmKey>("bubble");
  const [steps, setSteps] = useState<SortingStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPausedRef = useRef(false);
  const isRunningRef = useRef(false);
  const currentStepRef = useRef(0);
  const comparisonsCountRef = useRef(0);
  const swapsCountRef = useRef(0);

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

  const generateSteps = (algorithmKey?: SortingAlgorithmKey) => {
    const key = algorithmKey ?? algorithm;
    const sortFn =
      SORTING_ALGORITHMS[key]?.func ?? SORTING_ALGORITHMS.bubble.func;
    const generatedSteps = sortFn(array);

    setSteps(generatedSteps);
    setCurrentStep(0);
    currentStepRef.current = 0;
    comparisonsCountRef.current = 0;
    swapsCountRef.current = 0;
    setComparisons(0);
    setSwaps(0);
    setIsPaused(false);
    isPausedRef.current = false;

    return generatedSteps;
  };

  const executeSteps = (
    stepsToRun: SortingStep[],
    index: number,
    speed: number,
  ) => {
    clearTimeouts();

    if (index >= stepsToRun.length) {
      setIsRunning(false);
      isRunningRef.current = false;
      setIsPaused(false);
      isPausedRef.current = false;
      return;
    }

    // Use ref directly — state update from setIsRunning may not have flushed yet
    if (isPausedRef.current || !isRunningRef.current) return;

    const step = stepsToRun[index];
    setArray([...step.array]);
    setCurrentStep(index);
    currentStepRef.current = index;

    if (step.comparing) {
      comparisonsCountRef.current += 1;
      setComparisons(comparisonsCountRef.current);
    }
    if (step.swapping) {
      swapsCountRef.current += 1;
      setSwaps(swapsCountRef.current);
    }

    timeoutRef.current = setTimeout(
      () => {
        executeSteps(stepsToRun, index + 1, speed);
      },
      1000 - speed * 10,
    );
  };

  // Synchronously sets both state and ref before executing —
  // prevents the stale closure bug where executeSteps sees isRunning=false
  // on the first call because setState is async.
  const startExecuting = (stepsToRun: SortingStep[], speed: number) => {
    setIsRunning(true);
    isRunningRef.current = true;
    executeSteps(stepsToRun, 0, speed);
  };

  const pauseResume = (speed: number) => {
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

    const step = steps[newIndex];
    if (!step) return;

    setArray([...step.array]);

    let comps = 0;
    let swps = 0;
    for (let i = 0; i <= newIndex; i++) {
      if (steps[i].comparing) comps++;
      if (steps[i].swapping) swps++;
    }
    comparisonsCountRef.current = comps;
    swapsCountRef.current = swps;
    setComparisons(comps);
    setSwaps(swps);
  };

  return {
    algorithm,
    setAlgorithm,
    steps,
    currentStep,
    setCurrentStep,
    isRunning,
    setIsRunning,
    isPaused,
    setIsPaused,
    generateSteps,
    startExecuting,
    executeSteps,
    pauseResume,
    stepForward,
    clearTimeouts,
  };
};
