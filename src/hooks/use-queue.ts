import {
  QUEUE_EMPTY_STEP,
  QueueStep,
  QueueSteps,
} from "@/data-structures/queue";
import type { QueueType } from "@/types/types";
import { useCallback, useEffect, useRef, useState } from "react";

export type QueueOperation =
  | "enqueueRear"
  | "enqueueFront"
  | "dequeueFront"
  | "dequeueRear"
  | "peekFront"
  | "peekRear";

export function useQueue(queueType: QueueType = "linear") {
  const [values, setValues] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("42");
  const [steps, setSteps] = useState<QueueStep[]>([QUEUE_EMPTY_STEP]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStepMode, setIsStepMode] = useState(false);
  const [speed, setSpeed] = useState([600]);
  const [currentOperation, setCurrentOperation] =
    useState<QueueOperation | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const opRef = useRef(currentOperation);
  opRef.current = currentOperation;
  const inputRef = useRef(inputValue);
  inputRef.current = inputValue;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const parseInput = (val: string): number =>
    isNaN(Number(val.trim())) ? 0 : Number(val.trim());

  const applyResult = useCallback((op: QueueOperation, value: number) => {
    setValues((prev) => {
      switch (op) {
        case "enqueueRear":
          return [...prev, value];
        case "enqueueFront":
          return [value, ...prev];
        case "dequeueFront":
          return prev.slice(1);
        case "dequeueRear":
          return prev.slice(0, -1);
        case "peekFront":
        case "peekRear":
          return prev;
      }
    });
  }, []);

  const buildSteps = useCallback(
    (op: QueueOperation, value: number, current: number[]): QueueStep[] => {
      switch (op) {
        case "enqueueRear":
          return QueueSteps.enqueueRear(current, value);
        case "enqueueFront":
          return QueueSteps.enqueueFront(current, value);
        case "dequeueFront":
          return QueueSteps.dequeueFront(current);
        case "dequeueRear":
          return QueueSteps.dequeueRear(current);
        case "peekFront":
          return QueueSteps.peekFront(current);
        case "peekRear":
          return QueueSteps.peekRear(current);
      }
    },
    [],
  );

  const runAnimation = useCallback(
    (newSteps: QueueStep[], op: QueueOperation, value: number) => {
      setIsRunning(true);
      setIsPaused(false);
      let step = 0;
      intervalRef.current = setInterval(() => {
        step++;
        if (step >= newSteps.length) {
          clearTimer();
          setIsRunning(false);
          setCurrentStep(newSteps.length - 1);
          applyResult(op, value);
          return;
        }
        setCurrentStep(step);
      }, speed[0]);
    },
    [speed, clearTimer, applyResult],
  );

  const onStart = useCallback(
    (op: QueueOperation) => {
      clearTimer();
      const value = parseInput(inputRef.current);
      const newSteps = buildSteps(op, value, valuesRef.current);
      setSteps(newSteps);
      setCurrentStep(0);
      setCurrentOperation(op);
      if (!isStepMode) runAnimation(newSteps, op, value);
    },
    [clearTimer, buildSteps, isStepMode, runAnimation],
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
          if (opRef.current)
            applyResult(opRef.current, parseInput(inputRef.current));
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
      if (next === total - 1 && opRef.current) {
        applyResult(opRef.current, parseInput(inputRef.current));
      }
    }
  }, [currentStep, applyResult]);

  const onStepBackward = useCallback(() => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  }, [currentStep]);

  const reset = useCallback(() => {
    clearTimer();
    setValues([]);
    setSteps([QUEUE_EMPTY_STEP]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentOperation(null);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  // Reset when queueType changes externally
  useEffect(() => {
    reset();
  }, [queueType]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayStep = steps[currentStep] ?? QUEUE_EMPTY_STEP;

  return {
    values,
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
