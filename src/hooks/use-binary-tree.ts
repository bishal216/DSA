import {
  AVLNode,
  AVLSteps,
  avlDeleteMutate,
  avlInsertMutate,
} from "@/data-structures/avl-tree";

import {
  BSTNode,
  BSTSteps,
  HeapSteps,
  TREE_EMPTY_STEP,
  TreeStep,
  bstDeleteMutate,
  bstInsertMutate,
  heapExtractMutate,
  heapInsertMutate,
} from "@/data-structures/binary-tree";
import { useCallback, useEffect, useRef, useState } from "react";

export type TreeType = "bst" | "avl" | "minHeap" | "maxHeap";

export type BSTOperation =
  | "insert"
  | "delete"
  | "search"
  | "inorder"
  | "preorder"
  | "postorder"
  | "levelOrder"
  | "dfs";

export type AVLOperation =
  | "insert"
  | "delete"
  | "search"
  | "inorder"
  | "preorder"
  | "postorder"
  | "levelOrder";

export type HeapOperation = "insert" | "extract";

export type TreeOperation = BSTOperation | AVLOperation | HeapOperation;

export function useBinaryTree(treeType: TreeType = "bst") {
  const [bstRoot, setBstRoot] = useState<BSTNode | null>(null);
  const [avlRoot, setAvlRoot] = useState<AVLNode | null>(null);
  const [heapArr, setHeapArr] = useState<number[]>([]);

  const [inputValue, setInputValue] = useState("42");
  const [steps, setSteps] = useState<TreeStep[]>([TREE_EMPTY_STEP]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStepMode, setIsStepMode] = useState(false);
  const [speed, setSpeed] = useState([600]);
  const [currentOperation, setCurrentOperation] =
    useState<TreeOperation | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const bstRootRef = useRef(bstRoot);
  bstRootRef.current = bstRoot;
  const avlRootRef = useRef(avlRoot);
  avlRootRef.current = avlRoot;
  const heapArrRef = useRef(heapArr);
  heapArrRef.current = heapArr;
  const opRef = useRef(currentOperation);
  opRef.current = currentOperation;
  const inputRef = useRef(inputValue);
  inputRef.current = inputValue;
  const treeTypeRef = useRef(treeType);
  treeTypeRef.current = treeType;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const parseValue = (val: string): number =>
    isNaN(Number(val.trim())) ? 0 : Number(val.trim());

  const buildSteps = useCallback(
    (op: TreeOperation, value: number): TreeStep[] => {
      const tt = treeTypeRef.current;
      if (tt === "bst") {
        const root = bstRootRef.current;
        switch (op as BSTOperation) {
          case "insert":
            return BSTSteps.insert(root, value);
          case "delete":
            return BSTSteps.delete(root, value);
          case "search":
            return BSTSteps.search(root, value);
          case "inorder":
            return BSTSteps.inorder(root);
          case "preorder":
            return BSTSteps.preorder(root);
          case "postorder":
            return BSTSteps.postorder(root);
          case "levelOrder":
            return BSTSteps.levelOrder(root);
          case "dfs":
            return BSTSteps.dfs(root);
        }
      }
      if (tt === "avl") {
        const root = avlRootRef.current;
        switch (op as AVLOperation) {
          case "insert":
            return AVLSteps.insert(root, value);
          case "delete":
            return AVLSteps.delete(root, value);
          case "search":
            return AVLSteps.search(root, value);
          case "inorder":
            return AVLSteps.inorder(root);
          case "preorder":
            return AVLSteps.preorder(root);
          case "postorder":
            return AVLSteps.postorder(root);
          case "levelOrder":
            return AVLSteps.levelOrder(root);
        }
      }
      const arr = heapArrRef.current;
      const isMin = tt === "minHeap";
      switch (op as HeapOperation) {
        case "insert":
          return HeapSteps.insert(arr, value, isMin);
        case "extract":
          return HeapSteps.extract(arr, isMin);
      }
      return [TREE_EMPTY_STEP];
    },
    [],
  );

  const applyResult = useCallback((op: TreeOperation, value: number) => {
    const tt = treeTypeRef.current;
    if (tt === "bst") {
      if (op === "insert") setBstRoot((p) => bstInsertMutate(p, value));
      else if (op === "delete") setBstRoot((p) => bstDeleteMutate(p, value));
      return;
    }
    if (tt === "avl") {
      if (op === "insert") setAvlRoot((p) => avlInsertMutate(p, value));
      else if (op === "delete") setAvlRoot((p) => avlDeleteMutate(p, value));
      return;
    }
    const isMin = tt === "minHeap";
    if (op === "insert") setHeapArr((p) => heapInsertMutate(p, value, isMin));
    if (op === "extract") setHeapArr((p) => heapExtractMutate(p, isMin));
  }, []);

  const runAnimation = useCallback(
    (newSteps: TreeStep[], op: TreeOperation, value: number) => {
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
    (op: TreeOperation) => {
      clearTimer();
      const value = parseValue(inputRef.current);
      const newSteps = buildSteps(op, value);
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
            applyResult(opRef.current, parseValue(inputRef.current));
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
      if (next === total - 1 && opRef.current)
        applyResult(opRef.current, parseValue(inputRef.current));
    }
  }, [currentStep, applyResult]);

  const onStepBackward = useCallback(() => {
    if (currentStep > 0) setCurrentStep((p) => p - 1);
  }, [currentStep]);

  const reset = useCallback(() => {
    clearTimer();
    setBstRoot(null);
    setAvlRoot(null);
    setHeapArr([]);
    setSteps([TREE_EMPTY_STEP]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentOperation(null);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);
  useEffect(() => {
    reset();
  }, [treeType]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
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
    displayStep: steps[currentStep] ?? TREE_EMPTY_STEP,
    onStart,
    onPauseResume,
    onStepForward,
    onStepBackward,
    reset,
  };
}
