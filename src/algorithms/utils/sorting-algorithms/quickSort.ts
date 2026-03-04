// src/algorithms/utils/sortingAlgorithms/quickSort.ts

import type { SortingAlgorithmDefinition } from "@/algorithms/registry/sorting-algorithms-registry";
import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

export const quickSort = (array: ArrayElement[]): SortingStep[] => {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const sortedIndices = new Set<number>();

  const snapshot = () => arr.map((e) => ({ ...e }));

  // Spread on both sides so no two positions ever share an object reference
  const swap = (i: number, j: number) => {
    [arr[i], arr[j]] = [{ ...arr[j] }, { ...arr[i] }];
  };

  const quickSortHelper = (left: number, right: number, depth: number = 0) => {
    if (left >= right) {
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
      stepType: "partition",
      pivot: pivotIndex,
      activeSublistLeft: activeRange,
      activeSublistRight: activeRange, // same range — both sides represent the active window
      sorted: [...sortedIndices], // carry confirmed-sorted state
      depth,
      isMajorStep: true,
      message: `Depth ${depth}: pivot is ${pivotValue} at index ${pivotIndex}`,
    });

    // ── Partition loop ────────────────────────────────────────────────────────
    let i = left;
    for (let j = left; j < right; j++) {
      const [valJ, valPivot] = [arr[j].value, pivotValue];

      steps.push({
        array: snapshot(),
        stepType: "comparison",
        comparing: [j, pivotIndex], // comparing is sufficient — no need for activeSublistLeft/Right here
        pivot: pivotIndex,
        sorted: [...sortedIndices], // carry confirmed-sorted state
        depth,
        message: `Depth ${depth}: compare ${valJ} with pivot ${valPivot}`,
      });

      if (arr[j].value < pivotValue) {
        if (i !== j) {
          const [a, b] = [arr[i].value, arr[j].value];
          swap(i, j);

          steps.push({
            array: snapshot(),
            stepType: "swap",
            swapping: [i, j],
            pivot: pivotIndex,
            sorted: [...sortedIndices], // carry confirmed-sorted state
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
        stepType: "swap",
        swapping: [i, pivotIndex],
        pivot: i,
        sorted: [...sortedIndices], // carry confirmed-sorted state
        depth,
        message: `Depth ${depth}: place pivot ${a} at index ${i} (swapped with ${b})`,
      });
    }

    sortedIndices.add(i);

    steps.push({
      array: snapshot(),
      stepType: "sorted",
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
    stepType: "complete",
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
