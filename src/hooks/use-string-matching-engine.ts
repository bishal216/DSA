// src/hooks/use-string-matching-engine.ts

import type {
  StringMatchingOptions,
  StringMatchingStep,
} from "@/algorithms/types/string-matching";
import {
  STRING_MATCHING_ALGORITHMS,
  type StringMatchingAlgorithmKey,
} from "@/algorithms/types/string-matching-registry";
import { useEffect, useRef, useState } from "react";

export const useStringMatchingEngine = () => {
  const defaultKey = Object.keys(STRING_MATCHING_ALGORITHMS)[0] ?? "";

  const [algorithm, setAlgorithm] =
    useState<StringMatchingAlgorithmKey>(defaultKey);
  const [steps, setSteps] = useState<StringMatchingStep[]>([]);
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
    options: StringMatchingOptions,
    algorithmKey?: StringMatchingAlgorithmKey,
  ): StringMatchingStep[] => {
    const key = algorithmKey ?? algorithm;
    const def = STRING_MATCHING_ALGORITHMS[key];
    if (!def) return [];

    const generated = def.func(options);
    setSteps(generated);
    setCurrentStep(0);
    currentStepRef.current = 0;
    setIsPaused(false);
    isPausedRef.current = false;
    return generated;
  };

  const executeSteps = (
    stepsToRun: StringMatchingStep[],
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

  const startExecuting = (
    stepsToRun: StringMatchingStep[],
    speed: number[],
  ) => {
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

  const stepForward = (count = 1) => {
    const newIndex = Math.min(currentStepRef.current + count, steps.length - 1);
    setCurrentStep(newIndex);
    currentStepRef.current = newIndex;
  };

  const stepBackward = (count = 1) => {
    const newIndex = Math.max(currentStepRef.current - count, 0);
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
    stepBackward,
    clearTimeouts,
  };
};
