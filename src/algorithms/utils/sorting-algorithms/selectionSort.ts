// src/algorithms/utils/sortingAlgorithms/selectionSort.ts

import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import type { SortingAlgorithmDefinition } from "@/algorithms/types/sorting-algorithms-registry";

export const selectionSort = (array: ArrayElement[]): SortingStep[] => {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const n = arr.length;

  // Descriptive opening step
  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "comparison",
    comparing: [],
    sorted: [],
    isMajorStep: true,
    message:
      "Selection sort finds the minimum of the unsorted region and places it at the front each pass",
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "comparison",
        comparing: [minIdx, j],
        sorted: Array.from({ length: i }, (_, k) => k),
        message: `Comparing ${arr[minIdx].value} and ${arr[j].value}`,
      });

      if (arr[j].value < arr[minIdx].value) {
        minIdx = j;

        steps.push({
          array: arr.map((e) => ({ ...e })),
          stepType: "comparison",
          comparing: [minIdx], // highlight just the new minimum candidate
          sorted: Array.from({ length: i }, (_, k) => k),
          isMajorStep: true, // finding a new min is the meaningful moment
          message: `New minimum: ${arr[minIdx].value} at index ${minIdx}`,
        });
      }
    }

    if (minIdx !== i) {
      // Capture values before the swap
      const [a, b] = [arr[i].value, arr[minIdx].value];
      [arr[i], arr[minIdx]] = [{ ...arr[minIdx] }, { ...arr[i] }];

      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "swap",
        swapping: [i, minIdx],
        sorted: Array.from({ length: i + 1 }, (_, k) => k),
        isMajorStep: true,
        message: `Swapped ${a} and ${b}`,
      });
    }

    steps.push({
      array: arr.map((e) => ({ ...e })),
      stepType: "sorted",
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      isMajorStep: true,
      message: `${arr[i].value} is now in its final position`,
    });
  }

  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "complete",
    sorted: Array.from({ length: n }, (_, i) => i),
    isMajorStep: true,
    message: "Sorting complete!",
  });

  return steps;
};

// ── Registration ──────────────────────────────────────────────────────────────
// This is the only place you need to touch to add this algorithm to the app.

export const definition: SortingAlgorithmDefinition = {
  key: "selection",
  name: "Selection Sort",
  func: selectionSort,
};
