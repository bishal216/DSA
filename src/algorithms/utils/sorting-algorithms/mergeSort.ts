// src/algorithms/utils/sortingAlgorithms/mergeSort.ts

import type { SortingAlgorithmDefinition } from "@/algorithms/registry/sorting-algorithms-registry";
import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

export const mergeSort = (array: ArrayElement[]): SortingStep[] => {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const sortedIndices = new Set<number>();

  const snapshot = () => arr.map((e) => ({ ...e }));

  const mergeSortHelper = (left: number, right: number, depth: number = 0) => {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    const activeSublistLeft = Array.from(
      { length: mid - left + 1 },
      (_, i) => left + i,
    );
    const activeSublistRight = Array.from(
      { length: right - mid },
      (_, i) => mid + 1 + i,
    );

    // ── Divide step ───────────────────────────────────────────────────────────
    steps.push({
      array: snapshot(),
      stepType: "divide",
      activeSublistLeft,
      activeSublistRight,
      depth,
      isMajorStep: true,
      message: `Divide [${left}..${mid}] and [${mid + 1}..${right}] at depth ${depth}`,
    });

    mergeSortHelper(left, mid, depth + 1);
    mergeSortHelper(mid + 1, right, depth + 1);

    // ── Merge step ────────────────────────────────────────────────────────────
    let i = left;
    let j = mid + 1;

    // Store full element snapshots so id identity is preserved after merge
    const temp: ArrayElement[] = [];

    while (i <= mid && j <= right) {
      steps.push({
        array: snapshot(),
        stepType: "comparison",
        comparing: [i, j],
        activeSublistLeft,
        activeSublistRight,
        depth,
        message: `Depth ${depth}: compare ${arr[i].value} (pos ${i}) and ${arr[j].value} (pos ${j})`,
      });

      if (arr[i].value <= arr[j].value) {
        temp.push({ ...arr[i] });
        i++;
      } else {
        temp.push({ ...arr[j] });
        j++;
      }
    }

    while (i <= mid) {
      temp.push({ ...arr[i] });
      i++;
    }
    while (j <= right) {
      temp.push({ ...arr[j] });
      j++;
    }

    // Write merged values back, emitting a step only when the value actually changes
    for (let k = 0; k < temp.length; k++) {
      const idx = left + k;
      if (arr[idx].value !== temp[k].value) {
        arr[idx] = { ...temp[k] }; // replace element (preserves id from temp snapshot)
        steps.push({
          array: snapshot(),
          stepType: "merge", // semantic: placing a merged element, not a swap
          merging: [idx],
          activeSublistLeft,
          activeSublistRight,
          depth,
          message: `Depth ${depth}: place ${arr[idx].value} at position ${idx}`,
        });
      }
    }

    // Mark this subarray as fully sorted
    for (let k = left; k <= right; k++) sortedIndices.add(k);

    steps.push({
      array: snapshot(),
      stepType: "sorted",
      sorted: [...sortedIndices],
      activeSublistLeft,
      activeSublistRight,
      depth,
      isMajorStep: true,
      message: `Subarray [${left}..${right}] is sorted at depth ${depth}`,
    });
  };

  mergeSortHelper(0, arr.length - 1, 0);

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
  key: "merge",
  name: "Merge Sort",
  func: mergeSort,
};
