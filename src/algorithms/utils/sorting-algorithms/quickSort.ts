// src/algorithms/utils/sortingAlgorithms/quickSort.ts
//
// NOTE: Add "pivot" to StepType in your sorting types if you want a distinct
// visual state for pivot selection. Otherwise "partition" is used below as the
// closest existing type. Also add "insert" if not already added from insertionSort.

import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import type { SortingAlgorithmDefinition } from "@/algorithms/types/sorting-algorithms-registry";

export const quickSort = (array: ArrayElement[]): SortingStep[] => {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const sortedIndices = new Set<number>();

  const snapshot = () => arr.map((e) => ({ ...e }));

  const swap = (i: number, j: number) => {
    const temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
  };

  const quickSortHelper = (left: number, right: number, depth: number = 0) => {
    if (left >= right) {
      // Single-element subarray is trivially sorted
      if (left === right) sortedIndices.add(left);
      return;
    }

    const pivotIndex = right;
    const pivotValue = arr[pivotIndex].value;

    const activeRange = Array.from(
      { length: right - left + 1 },
      (_, i) => left + i,
    );

    // ── Pivot selection step ──────────────────────────────────────────────────
    steps.push({
      array: snapshot(),
      stepType: "partition", // "pivot" not in StepType — use "partition" for selection
      pivot: pivotIndex,
      activeSublistLeft: activeRange,
      depth,
      isMajorStep: true,
      message: `Depth ${depth}: pivot is ${pivotValue} at index ${pivotIndex}`,
    });

    // ── Partition loop ────────────────────────────────────────────────────────
    let i = left;
    for (let j = left; j < right; j++) {
      // Capture values before any potential swap
      const [valJ, valPivot] = [arr[j].value, pivotValue];

      steps.push({
        array: snapshot(),
        stepType: "comparison",
        comparing: [j, pivotIndex],
        activeSublistLeft: [j],
        activeSublistRight: [pivotIndex],
        pivot: pivotIndex,
        depth,
        message: `Depth ${depth}: compare ${valJ} with pivot ${valPivot}`,
      });

      if (arr[j].value < pivotValue) {
        if (i !== j) {
          const [a, b] = [arr[i].value, arr[j].value];
          swap(i, j);

          steps.push({
            array: snapshot(),
            stepType: "swap", // was "swapping" — not a valid StepType
            swapping: [i, j],
            pivot: pivotIndex,
            depth,
            message: `Depth ${depth}: swap ${a} and ${b}`,
          });
        }
        i++;
      }
    }

    // ── Place pivot in final position ─────────────────────────────────────────
    if (i !== pivotIndex) {
      const [a, b] = [arr[i].value, arr[pivotIndex].value];
      swap(i, pivotIndex);

      steps.push({
        array: snapshot(),
        stepType: "swap", // was "swapping"
        swapping: [i, pivotIndex],
        pivot: i, // pivot has moved to index i
        depth,
        message: `Depth ${depth}: place pivot ${a} at index ${i} (swapped with ${b})`,
      });
    }

    sortedIndices.add(i);

    steps.push({
      array: snapshot(),
      stepType: "sorted", // was "informSorted"
      sorted: [...sortedIndices],
      pivot: i,
      depth,
      isMajorStep: true,
      message: `Depth ${depth}: pivot ${pivotValue} is in its final position at index ${i}`,
    });

    quickSortHelper(left, i - 1, depth + 1);
    quickSortHelper(i + 1, right, depth + 1);
  };

  quickSortHelper(0, arr.length - 1);

  steps.push({
    array: snapshot(),
    stepType: "complete", // was "informCompleted"
    sorted: Array.from({ length: arr.length }, (_, i) => i),
    isMajorStep: true,
    message: "Sorting complete!",
  });

  return steps;
};

// ── Registration ──────────────────────────────────────────────────────────────
// This is the only place you need to touch to add this algorithm to the app.

export const definition: SortingAlgorithmDefinition = {
  key: "quick",
  name: "Quick Sort",
  func: quickSort,
};
