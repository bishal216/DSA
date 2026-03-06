import {
  ChainingSteps,
  ChainingTable,
  emptyChainingStep,
  emptyOpenStep,
  h1,
  HashStep,
  HashTableType,
  nextPrime,
  OpenSteps,
  OpenTable,
} from "@/data-structures/hash-table";
import { useCallback, useEffect, useRef, useState } from "react";

export type HashOperation = "insert" | "search" | "delete" | "rehash";

const INITIAL_SIZE = 7;

const LOAD_THRESHOLD_OPEN = 0.7;
const LOAD_THRESHOLD_CHAIN = 1.0;

export function useHashTable(tableType: HashTableType = "linear") {
  // ── Table state ─────────────────────────────────────────────────────────────
  const [openTable, setOpenTable] = useState<OpenTable>(
    new Array(INITIAL_SIZE).fill(null),
  );
  const [chainTable, setChainTable] = useState<ChainingTable>(
    Array.from({ length: INITIAL_SIZE }, () => []),
  );

  // ── Playback state ──────────────────────────────────────────────────────────
  const [inputValue, setInputValue] = useState("42");
  const [steps, setSteps] = useState<HashStep[]>([
    emptyOpenStep(INITIAL_SIZE, "linear"),
  ]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isStepMode, setIsStepMode] = useState(false);
  const [speed, setSpeed] = useState([600]);
  const [currentOperation, setCurrentOperation] =
    useState<HashOperation | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepsRef = useRef(steps);
  stepsRef.current = steps;
  const openRef = useRef(openTable);
  openRef.current = openTable;
  const chainRef = useRef(chainTable);
  chainRef.current = chainTable;
  const opRef = useRef(currentOperation);
  opRef.current = currentOperation;
  const inputRef = useRef(inputValue);
  inputRef.current = inputValue;
  const typeRef = useRef(tableType);
  typeRef.current = tableType;

  const clearTimer = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const parseValue = (v: string): number => {
    const n = Number(v.trim());
    return isNaN(n) ? 0 : Math.abs(Math.floor(n));
  };

  // ── Step builder ─────────────────────────────────────────────────────────────
  const buildSteps = useCallback(
    (op: HashOperation, key: number): HashStep[] => {
      const tt = typeRef.current;
      if (tt === "chaining") {
        const t = chainRef.current;
        switch (op) {
          case "insert": {
            const count = t.flat().length;
            if ((count + 1) / t.length > LOAD_THRESHOLD_CHAIN) {
              return [
                ...ChainingSteps.rehash(t),
                ...ChainingSteps.insert(rehashChain(t), key),
              ];
            }
            return ChainingSteps.insert(t, key);
          }
          case "search":
            return ChainingSteps.search(t, key);
          case "delete":
            return ChainingSteps.delete(t, key);
          case "rehash":
            return ChainingSteps.rehash(t);
        }
      } else {
        const t = openRef.current;
        switch (op) {
          case "insert": {
            const count = t.filter((e) => e !== null && e !== "DELETED").length;
            if ((count + 1) / t.length > LOAD_THRESHOLD_OPEN) {
              return [
                ...OpenSteps.rehash(t, tt),
                ...OpenSteps.insert(rehashOpen(t, tt), key, tt),
              ];
            }
            return OpenSteps.insert(t, key, tt);
          }
          case "search":
            return OpenSteps.search(t, key, tt);
          case "delete":
            return OpenSteps.delete(t, key, tt);
          case "rehash":
            return OpenSteps.rehash(t, tt);
        }
      }
    },
    [],
  );

  // ── Apply result (commit mutation after animation) ────────────────────────
  const applyResult = useCallback((op: HashOperation, key: number) => {
    const tt = typeRef.current;
    if (tt === "chaining") {
      setChainTable((prev) => {
        let t = prev;
        const count = t.flat().length;
        if (op === "insert" && (count + 1) / t.length > LOAD_THRESHOLD_CHAIN) {
          t = rehashChain(t);
        }
        switch (op) {
          case "insert": {
            const idx = h1(key, t.length);
            if (t[idx].includes(key)) return prev;
            return t.map((c, i) => (i === idx ? [...c, key] : c));
          }
          case "delete": {
            const idx = h1(key, t.length);
            return t.map((c, i) =>
              i === idx ? c.filter((k) => k !== key) : c,
            );
          }
          case "rehash":
            return rehashChain(t);
          default:
            return prev;
        }
      });
    } else {
      setOpenTable((prev) => {
        let t = [...prev];
        const count = t.filter((e) => e !== null && e !== "DELETED").length;
        if (op === "insert" && (count + 1) / t.length > LOAD_THRESHOLD_OPEN) {
          t = rehashOpen(t, tt);
        }
        switch (op) {
          case "insert":
            return openInsert(t, key, tt);
          case "delete":
            return openDelete(t, key, tt);
          case "rehash":
            return rehashOpen(t, tt);
          default:
            return prev;
        }
      });
    }
  }, []);

  // ── Animation runner ──────────────────────────────────────────────────────
  const runAnimation = useCallback(
    (newSteps: HashStep[], op: HashOperation, key: number) => {
      setIsRunning(true);
      setIsPaused(false);
      let step = 0;
      intervalRef.current = setInterval(() => {
        step++;
        if (step >= newSteps.length) {
          clearTimer();
          setIsRunning(false);
          setCurrentStep(newSteps.length - 1);
          applyResult(op, key);
          return;
        }
        setCurrentStep(step);
      }, speed[0]);
    },
    [speed, clearTimer, applyResult],
  );

  const onStart = useCallback(
    (op: HashOperation) => {
      clearTimer();
      const key = parseValue(inputRef.current);
      const newSteps = buildSteps(op, key);
      setSteps(newSteps);
      setCurrentStep(0);
      setCurrentOperation(op);
      if (!isStepMode) runAnimation(newSteps, op, key);
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
    const size = INITIAL_SIZE;
    setOpenTable(new Array(size).fill(null));
    setChainTable(Array.from({ length: size }, () => []));
    const tt = typeRef.current;
    setSteps([
      tt === "chaining" ? emptyChainingStep(size) : emptyOpenStep(size, tt),
    ]);
    setCurrentStep(0);
    setIsRunning(false);
    setIsPaused(false);
    setCurrentOperation(null);
  }, [clearTimer]);

  useEffect(() => () => clearTimer(), [clearTimer]);
  useEffect(() => {
    reset();
  }, [tableType]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayStep =
    steps[currentStep] ??
    (tableType === "chaining"
      ? emptyChainingStep(INITIAL_SIZE)
      : emptyOpenStep(INITIAL_SIZE, tableType));

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
    displayStep,
    onStart,
    onPauseResume,
    onStepForward,
    onStepBackward,
    reset,
  };
}

// ── Pure mutation helpers (used both in buildSteps and applyResult) ───────────

function rehashOpen(table: OpenTable, type: HashTableType): OpenTable {
  const newSize = nextPrime(table.length * 2);
  const newTable = new Array<number | "DELETED" | null>(newSize).fill(null);
  const existing = table.filter(
    (e): e is number => e !== null && e !== "DELETED",
  );
  for (const key of existing) {
    for (let i = 0; i < newSize; i++) {
      const idx = probeIdx(key, i, newSize, type);
      if (newTable[idx] === null) {
        newTable[idx] = key;
        break;
      }
    }
  }
  return newTable;
}

function rehashChain(table: ChainingTable): ChainingTable {
  const newSize = nextPrime(table.length * 2);
  const newTable: ChainingTable = Array.from({ length: newSize }, () => []);
  for (const key of table.flat()) {
    newTable[h1(key, newSize)].push(key);
  }
  return newTable;
}

function openInsert(
  table: OpenTable,
  key: number,
  type: HashTableType,
): OpenTable {
  const t = [...table];
  const size = t.length;
  for (let i = 0; i < size; i++) {
    const idx = probeIdx(key, i, size, type);
    if (t[idx] === null || t[idx] === "DELETED") {
      t[idx] = key;
      return t;
    }
    if (t[idx] === key) return t; // duplicate
  }
  return t;
}

function openDelete(
  table: OpenTable,
  key: number,
  type: HashTableType,
): OpenTable {
  const t = [...table];
  const size = t.length;
  for (let i = 0; i < size; i++) {
    const idx = probeIdx(key, i, size, type);
    if (t[idx] === null) return t;
    if (t[idx] === key) {
      t[idx] = "DELETED";
      return t;
    }
  }
  return t;
}

function probeIdx(
  key: number,
  i: number,
  size: number,
  type: HashTableType,
): number {
  const base = h1(key, size);
  switch (type) {
    case "linear":
      return (base + i) % size;
    case "quadratic":
      return (base + i * i) % size;
    case "double":
      return (base + i * (1 + (key % (size - 1)))) % size;
    default:
      return base;
  }
}
