import { Stack, STACK_EMPTY_STEP, StackStep } from "@/data-structures/stack";
import { useCallback, useEffect, useRef, useState } from "react";

export type StackOperation = "push" | "pop" | "peek";

export function useStack() {
  const [items, setItems] = useState<(number | string)[]>([]);
  const [inputValue, setInputValue] = useState("42");
  const [steps, setSteps] = useState<StackStep[]>([STACK_EMPTY_STEP]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStepMode, setIsStepMode] = useState(false);
  const [speed, setSpeed] = useState<number[]>([600]);
  const [currentOperation, setCurrentOperation] =
    useState<StackOperation | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const operationRef = useRef(currentOperation);
  operationRef.current = currentOperation;
  const inputRef = useRef(inputValue);
  inputRef.current = inputValue;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const parseInput = (val: string): number | string =>
    val.trim() === "" ? 0 : isNaN(Number(val)) ? val.trim() : Number(val);

  const applyResult = useCallback(
    (operation: StackOperation, value: string) => {
      const parsed = parseInput(value);
      setItems((prev) => {
        switch (operation) {
          case "push":
            return [...prev, parsed];
          case "pop":
            return prev.slice(0, -1);
          case "peek":
            return prev;
        }
      });
    },
    [],
  );

  const buildAndSetSteps = useCallback(
    (operation: StackOperation, value: string): StackStep[] => {
      const current = itemsRef.current;
      const parsed = parseInput(value);
      let newSteps: StackStep[];

      switch (operation) {
        case "push":
          newSteps = Stack.generatePushSteps(current, parsed);
          break;
        case "pop":
          newSteps = Stack.generatePopSteps(current);
          break;
        case "peek":
          newSteps = Stack.generatePeekSteps(current);
          break;
      }

      setSteps(newSteps);
      setCurrentStep(0);
      setCurrentOperation(operation);
      return newSteps;
    },
    [],
  );

  const runAnimation = useCallback(
    (newSteps: StackStep[], operation: StackOperation, value: string) => {
      setIsRunning(true);
      setIsPaused(false);
      let step = 0;

      intervalRef.current = setInterval(() => {
        step++;
        if (step >= newSteps.length) {
          clearTimer();
          setIsRunning(false);
          setCurrentStep(newSteps.length - 1);
          applyResult(operation, value);
          return;
        }
        setCurrentStep(step);
      }, speed[0]);
    },
    [speed, clearTimer, applyResult],
  );

  const onStart = useCallback(
    (operation: StackOperation) => {
      clearTimer();
      const newSteps = buildAndSetSteps(operation, inputRef.current);
      if (!isStepMode) {
        runAnimation(newSteps, operation, inputRef.current);
      }
    },
    [clearTimer, buildAndSetSteps, isStepMode, runAnimation],
  );

  const onPauseResume = useCallback(() => {
    if (isPaused) {
      setIsPaused(false);
      setIsRunning(true);
      let step = currentStep;
      intervalRef.current = setInterval(() => {
        step++;
        if (step >= stepsRef.current.length) {
          clearTimer();
          setIsRunning(false);
          setCurrentStep(stepsRef.current.length - 1);
          if (operationRef.current)
            applyResult(operationRef.current, inputRef.current);
          return;
        }
        setCurrentStep(step);
      }, speed[0]);
    } else {
      clearTimer();
      setIsPaused(true);
      setIsRunning(false);
    }
  }, [isPaused, currentStep, speed, clearTimer, applyResult]);

  const onStepForward = useCallback(() => {
    const total = stepsRef.current.length;
    if (currentStep < total - 1) {
      const next = currentStep + 1;
      setCurrentStep(next);
      if (next === total - 1 && operationRef.current) {
        applyResult(operationRef.current, inputRef.current);
      }
    }
  }, [currentStep, applyResult]);

  const onStepBackward = useCallback(() => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  }, [currentStep]);

  const reset = useCallback(() => {
    clearTimer();
    setItems([]);
    setSteps([STACK_EMPTY_STEP]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentOperation(null);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  const displayStep = steps[currentStep] ?? STACK_EMPTY_STEP;

  return {
    items,
    inputValue,
    setInputValue,
    steps,
    currentStep,
    isRunning,
    isPaused,
    isStepMode,
    setIsStepMode,
    speed,
    setSpeed,
    currentOperation,
    displayStep,
    onStart,
    onPauseResume,
    onStepForward,
    onStepBackward,
    reset,
  };
}
