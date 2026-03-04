// src/algorithms/utils/sortingAlgorithms/pancakeSort.ts

import type { SortingAlgorithmDefinition } from "@/algorithms/registry/sorting-algorithms-registry";
import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

export const pancakeSort = (array: ArrayElement[]): SortingStep[] => {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  // Accumulates confirmed sorted indices (the tail, growing each outer iteration)
  const sorted: number[] = [];

  const flip = (end: number) => {
    let start = 0;
    while (start < end) {
      // Capture values before the swap so the message is correct
      const [a, b] = [arr[start].value, arr[end].value];
      [arr[start], arr[end]] = [arr[end], arr[start]];
      swaps++;

      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "flip", // was "swapping" — "flip" is the correct StepType here
        swapping: [start, end],
        sorted: [...sorted],
        message: `Flip: swapped ${a} and ${b}`,
      });

      start++;
      end--;
    }
  };

  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "comparison",
    comparing: [],
    sorted: [],
    isMajorStep: true,
    message:
      "Pancake sort finds the max in the unsorted region, flips it to the front, then flips it into place",
  });

  for (let size = n; size > 1; size--) {
    let maxIdx = 0;

    for (let i = 1; i < size; i++) {
      comparisons++;

      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "comparison",
        comparing: [maxIdx, i],
        sorted: [...sorted],
        message: `Comparing ${arr[maxIdx].value} and ${arr[i].value}`,
      });

      if (arr[i].value > arr[maxIdx].value) {
        maxIdx = i;

        steps.push({
          array: arr.map((e) => ({ ...e })),
          stepType: "comparison",
          comparing: [maxIdx],
          sorted: [...sorted],
          isMajorStep: true,
          message: `New max: ${arr[maxIdx].value} at index ${maxIdx}`,
        });
      }
    }

    if (maxIdx !== size - 1) {
      if (maxIdx !== 0) {
        steps.push({
          array: arr.map((e) => ({ ...e })),
          stepType: "flip",
          sorted: [...sorted], // was [] — carry the accumulated sorted tail
          isMajorStep: true,
          message: `Flip top ${maxIdx + 1} to bring ${arr[maxIdx].value} to front`,
        });
        flip(maxIdx);
      }

      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "flip",
        sorted: [...sorted], // was [] — carry the accumulated sorted tail
        isMajorStep: true,
        message: `Flip top ${size} to move ${arr[0].value} into position ${size - 1}`,
      });
      flip(size - 1);
    }

    // Mark this position as confirmed sorted
    sorted.push(size - 1);

    steps.push({
      array: arr.map((e) => ({ ...e })),
      stepType: "sorted", // was "informSorted" — not a valid StepType
      sorted: [...sorted], // accumulates, not just [size - 1]
      isMajorStep: true,
      message: `${arr[size - 1].value} is in its final position`,
    });
  }

  // Index 0 is sorted by elimination — add it to the sorted list
  sorted.push(0);

  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "complete", // was "informCompleted" — not a valid StepType
    sorted: Array.from({ length: n }, (_, i) => i),
    isMajorStep: true,
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};

// ── Registration ──────────────────────────────────────────────────────────────
// This is the only place you need to touch to add this algorithm to the app.

export const definition: SortingAlgorithmDefinition = {
  key: "pancake",
  name: "Pancake Sort",
  func: pancakeSort,
};
