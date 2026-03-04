// src/algorithms/utils/sortingAlgorithms/insertionSort.ts
//
// NOTE: "insert" must be added to the StepType union in your sorting types:
//   | "insert"

import type { SortingAlgorithmDefinition } from "@/algorithms/registry/sorting-algorithms-registry";
import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

export const insertionSort = (array: ArrayElement[]): SortingStep[] => {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    // `key` is a snapshot — never mutated, safe to reference throughout this pass
    const key = { ...arr[i] };
    let j = i - 1;

    // Major step: signal which element we're about to insert
    steps.push({
      array: arr.map((e) => ({ ...e })),
      stepType: "comparison",
      comparing: [j, i],
      sorted: Array.from({ length: i }, (_, k) => k),
      isMajorStep: true,
      message: `Inserting ${key.value} — comparing with sorted region`,
    });

    // Shift elements right until we find the correct position for key
    while (j >= 0 && arr[j].value > key.value) {
      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "comparison",
        comparing: [j, j + 1],
        sorted: Array.from({ length: i }, (_, k) => k),
        message: `${arr[j].value} > ${key.value} — shifting ${arr[j].value} right`,
      });

      // Shift only — do NOT place key here
      arr[j + 1] = { ...arr[j] };

      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "insert",
        comparing: [j, j + 1],
        sorted: Array.from({ length: i }, (_, k) => k),
        message: `Shifted ${arr[j + 1].value} from position ${j} to ${j + 1}`,
      });

      j--;
    }

    // Place key in its correct position
    arr[j + 1] = { ...key };

    steps.push({
      array: arr.map((e) => ({ ...e })),
      stepType: "insert",
      comparing: [j + 1],
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      isMajorStep: true,
      message: `Inserted ${key.value} at position ${j + 1}`,
    });
  }

  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "complete", // was "informCompleted" — not a valid StepType
    sorted: Array.from({ length: n }, (_, i) => i),
    isMajorStep: true,
    message: "Sorting complete!",
  });

  return steps;
};

// ── Registration ──────────────────────────────────────────────────────────────
// This is the only place you need to touch to add this algorithm to the app.

export const definition: SortingAlgorithmDefinition = {
  key: "insertion",
  name: "Insertion Sort",
  func: insertionSort,
};
