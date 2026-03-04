// src/algorithms/utils/sortingAlgorithms/combSort.ts

import type { SortingAlgorithmDefinition } from "@/algorithms/registry/sorting-algorithms-registry";
import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

export const combSort = (array: ArrayElement[]): SortingStep[] => {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const n = arr.length;

  let comparisons = 0;
  let swaps = 0;

  let gap = n;
  const shrink = 1.3;
  let sorted = false;

  // Descriptive opening step — avoids re-scanning steps[] to detect first comparison
  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "comparison",
    comparing: [],
    sorted: [],
    gap,
    isMajorStep: true,
    message: `Comb sort starts with gap ${gap} — elements far apart are compared first`,
  });

  while (!sorted) {
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }

    for (let i = 0; i + gap < n; i++) {
      comparisons++;

      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "comparison",
        comparing: [i, i + gap],
        sorted: [],
        gap, // current gap visible to the visualizer
        message: `Gap ${gap}: comparing ${arr[i].value} and ${arr[i + gap].value}`,
      });

      if (arr[i].value > arr[i + gap].value) {
        swaps++;
        sorted = false;

        // Capture values before the swap so the message is correct
        const [a, b] = [arr[i].value, arr[i + gap].value];
        [arr[i], arr[i + gap]] = [arr[i + gap], arr[i]];

        steps.push({
          array: arr.map((e) => ({ ...e })),
          stepType: "swap", // was "swapping" — not a valid StepType
          swapping: [i, i + gap],
          sorted: [],
          gap,
          message: `Gap ${gap}: swapped ${a} and ${b}`,
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
  key: "comb",
  name: "Comb Sort",
  func: combSort,
};
