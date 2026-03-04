// src/algorithms/utils/sortingAlgorithms/gnomeSort.ts

import type { SortingAlgorithmDefinition } from "@/algorithms/registry/sorting-algorithms-registry";
import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

export const gnomeSort = (array: ArrayElement[]): SortingStep[] => {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;
  let index = 0;

  // Descriptive opening step — avoids re-scanning steps[] to detect first comparison
  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "comparison",
    comparing: [],
    sorted: [],
    isMajorStep: true,
    message:
      "Gnome sort compares adjacent elements and steps backward on a swap — like a gnome arranging flower pots",
  });

  while (index < n) {
    if (index === 0) {
      index++;
      continue;
    }

    comparisons++;

    steps.push({
      array: arr.map((e) => ({ ...e })),
      stepType: "comparison",
      comparing: [index - 1, index],
      // sorted stays empty — elements to the left are relatively ordered
      // but not yet in their final global positions
      sorted: [],
      message: `Comparing ${arr[index - 1].value} and ${arr[index].value}`,
    });

    if (arr[index - 1].value <= arr[index].value) {
      index++;
    } else {
      swaps++;

      // Capture values before the swap so the message is correct
      const [a, b] = [arr[index - 1].value, arr[index].value];
      [arr[index - 1], arr[index]] = [arr[index], arr[index - 1]];

      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "swap", // was "swapping" — not a valid StepType
        swapping: [index - 1, index],
        sorted: [],
        message: `Swapped ${a} and ${b} — stepping back`,
      });

      index--;
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
  key: "gnome",
  name: "Gnome Sort",
  func: gnomeSort,
};
