// src/algorithms/utils/sortingAlgorithms/oddEvenSort.ts

import type { SortingAlgorithmDefinition } from "@/algorithms/registry/sorting-algorithms-registry";
import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

export const oddEvenSort = (array: ArrayElement[]): SortingStep[] => {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let sorted = false;
  let passCount = 0;

  // Descriptive opening step
  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "comparison",
    comparing: [],
    sorted: [],
    isMajorStep: true,
    message:
      "Odd-Even sort alternates between two passes — odd-indexed pairs, then even-indexed pairs",
  });

  while (!sorted) {
    sorted = true;
    passCount++;

    // ── Odd-indexed pass ──────────────────────────────────────────────────────
    steps.push({
      array: arr.map((e) => ({ ...e })),
      stepType: "comparison",
      comparing: [],
      sorted: [],
      isMajorStep: true,
      message: `Pass ${passCount}: comparing odd-indexed pairs (1-2, 3-4, 5-6 …)`,
    });

    for (let i = 1; i < n - 1; i += 2) {
      comparisons++;

      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "comparison",
        comparing: [i, i + 1],
        sorted: [],
        message: `Comparing ${arr[i].value} and ${arr[i + 1].value}`,
      });

      if (arr[i].value > arr[i + 1].value) {
        const [a, b] = [arr[i].value, arr[i + 1].value];
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swaps++;
        sorted = false;

        steps.push({
          array: arr.map((e) => ({ ...e })),
          stepType: "swap", // was "swapping" — not a valid StepType
          swapping: [i, i + 1],
          sorted: [],
          message: `Swapped ${a} and ${b}`,
        });
      }
    }

    // ── Even-indexed pass ─────────────────────────────────────────────────────
    steps.push({
      array: arr.map((e) => ({ ...e })),
      stepType: "comparison",
      comparing: [],
      sorted: [],
      isMajorStep: true,
      message: `Pass ${passCount}: comparing even-indexed pairs (0-1, 2-3, 4-5 …)`,
    });

    for (let i = 0; i < n - 1; i += 2) {
      comparisons++;

      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "comparison",
        comparing: [i, i + 1],
        sorted: [],
        message: `Comparing ${arr[i].value} and ${arr[i + 1].value}`,
      });

      if (arr[i].value > arr[i + 1].value) {
        const [a, b] = [arr[i].value, arr[i + 1].value];
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swaps++;
        sorted = false;

        steps.push({
          array: arr.map((e) => ({ ...e })),
          stepType: "swap", // was "swapping" — not a valid StepType
          swapping: [i, i + 1],
          sorted: [],
          message: `Swapped ${a} and ${b}`,
        });
      }
    }
  }

  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "complete", // was "informCompleted" — not a valid StepType
    isMajorStep: true,
    sorted: Array.from({ length: n }, (_, i) => i),
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};

// ── Registration ──────────────────────────────────────────────────────────────
// This is the only place you need to touch to add this algorithm to the app.

export const definition: SortingAlgorithmDefinition = {
  key: "oddeven",
  name: "Odd-Even Sort",
  func: oddEvenSort,
};
