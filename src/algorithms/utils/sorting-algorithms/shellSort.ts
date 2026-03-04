// src/algorithms/utils/sortingAlgorithms/shellSort.ts
//
// NOTE: "insert" must be in the StepType union (same requirement as insertionSort).

import type { SortingAlgorithmDefinition } from "@/algorithms/registry/sorting-algorithms-registry";
import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

export const shellSort = (array: ArrayElement[]): SortingStep[] => {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  // Descriptive opening step
  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "comparison",
    comparing: [],
    sorted: [],
    isMajorStep: true,
    message:
      "Shell sort compares elements separated by a shrinking gap — starting large to move elements quickly into place",
  });

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    // Gap announcement step — carries the gap value
    steps.push({
      array: arr.map((e) => ({ ...e })),
      stepType: "gap",
      gap, // gap field was missing on every step
      isMajorStep: true,
      sorted: [],
      message: `New pass — gap is ${gap}`,
    });

    for (let i = gap; i < n; i++) {
      // Snapshot the element being inserted — spread to avoid reference sharing
      const temp = { ...arr[i] };
      let j = i;

      // Single comparison step before the shift loop — no duplicate
      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "comparison",
        comparing: [j - gap, j],
        gap,
        sorted: [],
        message: `Gap ${gap}: comparing ${arr[j - gap].value} and ${temp.value}`,
      });

      while (j >= gap && arr[j - gap].value > temp.value) {
        comparisons++;

        // Shift element right — spread to prevent two positions sharing an object
        arr[j] = { ...arr[j - gap] };
        swaps++;

        steps.push({
          array: arr.map((e) => ({ ...e })),
          stepType: "insert", // was "swap" — this is a shift, not a swap
          comparing: [j - gap, j],
          gap,
          sorted: [],
          message: `Gap ${gap}: shifted ${arr[j].value} from position ${j - gap} to ${j}`,
        });

        j -= gap;

        // Emit a comparison step for the next iteration if there is one
        if (j >= gap) {
          steps.push({
            array: arr.map((e) => ({ ...e })),
            stepType: "comparison",
            comparing: [j - gap, j],
            gap,
            sorted: [],
            message: `Gap ${gap}: comparing ${arr[j - gap].value} and ${temp.value}`,
          });
        }
      }

      arr[j] = { ...temp };

      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "insert", // was "swap" — this is an insertion, not a swap
        comparing: [j],
        gap,
        sorted: [],
        isMajorStep: true,
        message: `Gap ${gap}: inserted ${temp.value} at position ${j}`,
      });
    }
  }

  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "complete",
    isMajorStep: true,
    sorted: Array.from({ length: n }, (_, i) => i),
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};

// ── Registration ──────────────────────────────────────────────────────────────
// This is the only place you need to touch to add this algorithm to the app.

export const definition: SortingAlgorithmDefinition = {
  key: "shell",
  name: "Shell Sort",
  func: shellSort,
};
