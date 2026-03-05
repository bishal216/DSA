import {
  LinkedListStep,
  LinkedListSteps,
  LL_EMPTY_STEP,
} from "@/data-structures/linked-list";
import type { ListType } from "@/types/types";
import { useCallback, useEffect, useRef, useState } from "react";

export type LinkedListOperation =
  | "insertHead"
  | "insertTail"
  | "insertAt"
  | "deleteByValue"
  | "deleteAt"
  | "traverse"
  | "reverseTraverse"
  | "search";

export function useLinkedList(listType: ListType = "singly") {
  const [values, setValues] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState("42");
  const [positionInput, setPositionInput] = useState("0");
  const [steps, setSteps] = useState<LinkedListStep[]>([LL_EMPTY_STEP]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStepMode, setIsStepMode] = useState(false);
  const [speed, setSpeed] = useState([600]);
  const [currentOperation, setCurrentOperation] =
    useState<LinkedListOperation | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const valuesRef = useRef(values);
  valuesRef.current = values;
  const opRef = useRef(currentOperation);
  opRef.current = currentOperation;
  const inputRef = useRef(inputValue);
  inputRef.current = inputValue;
  const posRef = useRef(positionInput);
  posRef.current = positionInput;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const parseValue = (val: string): number =>
    isNaN(Number(val.trim())) ? 0 : Number(val.trim());

  const parsePosition = (val: string): number =>
    Math.max(0, isNaN(Number(val.trim())) ? 0 : Math.floor(Number(val.trim())));

  const applyResult = useCallback(
    (op: LinkedListOperation, value: number, position: number) => {
      setValues((prev) => {
        switch (op) {
          case "insertHead":
            return [value, ...prev];
          case "insertTail":
            return [...prev, value];
          case "insertAt":
            return [...prev.slice(0, position), value, ...prev.slice(position)];
          case "deleteByValue":
            return prev.filter((v) => v !== value);
          case "deleteAt":
            return prev.filter((_, i) => i !== position);
          case "traverse":
          case "reverseTraverse":
          case "search":
            return prev;
        }
      });
    },
    [],
  );

  const buildSteps = useCallback(
    (
      op: LinkedListOperation,
      value: number,
      position: number,
      current: number[],
    ): LinkedListStep[] => {
      switch (op) {
        case "insertHead":
          return LinkedListSteps.insertHead(current, value);
        case "insertTail":
          return LinkedListSteps.insertTail(current, value);
        case "insertAt":
          return LinkedListSteps.insertAt(current, value, position);
        case "deleteByValue":
          return LinkedListSteps.deleteByValue(current, value);
        case "deleteAt":
          return LinkedListSteps.deleteAt(current, position);
        case "traverse":
          return LinkedListSteps.traverse(current);
        case "reverseTraverse":
          return LinkedListSteps.reverseTraverse(current);
        case "search":
          return LinkedListSteps.search(current, value);
      }
    },
    [],
  );

  const runAnimation = useCallback(
    (
      newSteps: LinkedListStep[],
      op: LinkedListOperation,
      value: number,
      position: number,
    ) => {
      setIsRunning(true);
      setIsPaused(false);
      let step = 0;
      intervalRef.current = setInterval(() => {
        step++;
        if (step >= newSteps.length) {
          clearTimer();
          setIsRunning(false);
          setCurrentStep(newSteps.length - 1);
          applyResult(op, value, position);
          return;
        }
        setCurrentStep(step);
      }, speed[0]);
    },
    [speed, clearTimer, applyResult],
  );

  const onStart = useCallback(
    (op: LinkedListOperation) => {
      clearTimer();
      const value = parseValue(inputRef.current);
      const position = parsePosition(posRef.current);
      const newSteps = buildSteps(op, value, position, valuesRef.current);
      setSteps(newSteps);
      setCurrentStep(0);
      setCurrentOperation(op);
      if (!isStepMode) runAnimation(newSteps, op, value, position);
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
          if (opRef.current) {
            applyResult(
              opRef.current,
              parseValue(inputRef.current),
              parsePosition(posRef.current),
            );
          }
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
        applyResult(
          opRef.current,
          parseValue(inputRef.current),
          parsePosition(posRef.current),
        );
      }
    }
  }, [currentStep, applyResult]);

  const onStepBackward = useCallback(() => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  }, [currentStep]);

  const reset = useCallback(() => {
    clearTimer();
    setValues([]);
    setSteps([LL_EMPTY_STEP]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentOperation(null);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);
  useEffect(() => {
    reset();
  }, [listType]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayStep = steps[currentStep] ?? LL_EMPTY_STEP;

  return {
    values,
    inputValue,
    setInputValue,
    positionInput,
    setPositionInput,
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
