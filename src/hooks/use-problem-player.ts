import type { ProblemStep } from "@/problems/types/problem-step";
import { useCallback, useEffect, useRef, useState } from "react";

interface UseProblemPlayerOptions {
  /** Called when the animation reaches the last step */
  onComplete?: () => void;
}

export function useProblemPlayer(opts?: UseProblemPlayerOptions) {
  const [steps, setSteps] = useState<ProblemStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStepMode, setIsStepMode] = useState(false);
  const [speed, setSpeed] = useState([600]);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const speedRef = useRef(speed);
  speedRef.current = speed;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const runFrom = useCallback(
    (fromStep: number, allSteps: ProblemStep[]) => {
      setIsRunning(true);
      setIsPaused(false);
      let step = fromStep;
      intervalRef.current = setInterval(() => {
        step++;
        if (step >= allSteps.length) {
          clearTimer();
          setIsRunning(false);
          setCurrentStep(allSteps.length - 1);
          opts?.onComplete?.();
          return;
        }
        setCurrentStep(step);
      }, speedRef.current[0]);
    },
    [clearTimer, opts],
  );

  /** Load new steps and start (or just load in step mode) */
  const load = useCallback(
    (newSteps: ProblemStep[]) => {
      clearTimer();
      setSteps(newSteps);
      setCurrentStep(0);
      setIsRunning(false);
      setIsPaused(false);
      if (!isStepMode && newSteps.length > 1) {
        // small delay so the first frame renders before animation starts
        setTimeout(() => runFrom(0, newSteps), 50);
      }
    },
    [clearTimer, isStepMode, runFrom],
  );

  const onPauseResume = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      runFrom(currentStep, stepsRef.current);
    } else {
      clearTimer();
      setIsPaused(true);
      setIsRunning(false);
    }
  }, [isPaused, currentStep, clearTimer, runFrom]);

  const onStepForward = useCallback(() => {
    const total = stepsRef.current.length;
    if (currentStep < total - 1) setCurrentStep((p) => p + 1);
  }, [currentStep]);

  const onStepBackward = useCallback(() => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  }, [currentStep]);

  const reset = useCallback(() => {
    clearTimer();
    setSteps([]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
  }, [clearTimer]);

  // Restart animation when speed changes mid-run
  useEffect(() => {
    if (isRunning && !isPaused) {
      clearTimer();
      runFrom(currentStep, stepsRef.current);
    }
  }, [speed]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => () => clearTimer(), [clearTimer]);

  const displayStep: ProblemStep | null = steps[currentStep] ?? null;

  return {
    steps,
    currentStep,
    displayStep,
    isRunning,
    isPaused,
    isStepMode,
    setIsStepMode,
    speed,
    setSpeed,
    load,
    reset,
    onPauseResume,
    onStepForward,
    onStepBackward,
  };
}
