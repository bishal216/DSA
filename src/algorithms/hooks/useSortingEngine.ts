import { useRef, useState, useEffect } from "react";
import { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import {
  SortingAlgorithmKey,
  SORTING_ALGORITHMS,
} from "@/algorithms/types/sortingAlgorithms";
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

  // Use refs to keep latest values accessible inside async callbacks
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPausedRef = useRef(isPaused);
  const isRunningRef = useRef(isRunning);
  const currentStepRef = useRef(currentStep);

  // Counters refs
  const comparisonsCountRef = useRef(0);
  const swapsCountRef = useRef(0);

  // Sync refs with state
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
    comparisonsCountRef.current = 0;
    swapsCountRef.current = 0;
    setComparisons(0);
    setSwaps(0);

    setIsPaused(false);
    isPausedRef.current = false;

    setIsRunning(true);
    isRunningRef.current = true;
    return generatedSteps;
  };

  const executeSteps = (steps: SortingStep[], index: number, speed: number) => {
    clearTimeouts();

    // If finished
    if (index >= steps.length) {
      setIsRunning(false);
      isRunningRef.current = false;
      setIsPaused(false);
      isPausedRef.current = false;
      return;
    }

    if (isPausedRef.current || !isRunningRef.current) {
      return; // do nothing if paused or stopped
    }

    const step = steps[index];
    setArray([...step.array]);
    setCurrentStep(index);
    currentStepRef.current = index;

    // Update counts correctly
    if (step.comparing) {
      comparisonsCountRef.current += 1;
      setComparisons(comparisonsCountRef.current);
    }
    if (step.swapping) {
      swapsCountRef.current += 1;
      setSwaps(swapsCountRef.current);
    }

    // Schedule next step
    timeoutRef.current = setTimeout(
      () => {
        executeSteps(steps, index + 1, speed);
      },
      1000 - speed * 10
    );
  };

  const pauseResume = (speed: number) => {
    setIsPaused((prev) => {
      const newPaused = !prev;
      isPausedRef.current = newPaused;

      if (!newPaused) {
        // Resuming: continue from current step
        if (isRunningRef.current) {
          executeSteps(steps, currentStepRef.current + 1, speed);
        }
      } else {
        // Pausing: clear any timeouts to stop progression
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
    if (step) {
      setArray([...step.array]);
      // Recalculate counts up to this step
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
    }
  };

  return {
    algorithm,
    setAlgorithm,
    steps,
    setSteps,
    currentStep,
    setCurrentStep,
    isRunning,
    setIsRunning,
    isPaused,
    setIsPaused,
    generateSteps,
    executeSteps,
    pauseResume,
    stepForward,
    clearTimeouts,
  };
};
