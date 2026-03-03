// src/algorithms/utils/sortingAlgorithms/countingSort.ts
//
// NOTE: Add "count" to StepType in your sorting types:
//   | "count"
// This is used for the count-array accumulation phase.

import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import type { SortingAlgorithmDefinition } from "@/algorithms/types/sorting-algorithms-registry";

export const countingSort = (array: ArrayElement[]): SortingStep[] => {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const n = arr.length;

  if (n <= 1) return [];

  const snapshot = () => arr.map((e) => ({ ...e }));

  const maxVal = Math.max(...arr.map((e) => e.value));
  const minVal = Math.min(...arr.map((e) => e.value));
  const range = maxVal - minVal + 1;

  // count[i] = how many times (minVal + i) appears in arr
  const count = new Array<number>(range).fill(0);

  // ── Opening step ────────────────────────────────────────────────────────────
  steps.push({
    array: snapshot(),
    stepType: "comparison",
    comparing: [],
    sorted: [],
    isMajorStep: true,
    message: `Counting sort — values range from ${minVal} to ${maxVal} (${range} buckets)`,
  });

  // ── Phase 1: Count occurrences ──────────────────────────────────────────────
  steps.push({
    array: snapshot(),
    stepType: "count",
    comparing: [],
    sorted: [],
    isMajorStep: true,
    message: "Phase 1: counting how many times each value appears",
  });

  for (let i = 0; i < n; i++) {
    const bucketIdx = arr[i].value - minVal;
    count[bucketIdx]++;

    steps.push({
      array: snapshot(),
      stepType: "count",
      comparing: [i],
      bucketIndex: bucketIdx,
      // Reuse buckets field to expose the live count array to the visualizer
      buckets: [count.map((c) => c)],
      sorted: [],
      message: `Counted ${arr[i].value} — bucket ${bucketIdx} now has count ${count[bucketIdx]}`,
    });
  }

  // ── Phase 2: Accumulate counts (prefix sum) ─────────────────────────────────
  steps.push({
    array: snapshot(),
    stepType: "count",
    comparing: [],
    sorted: [],
    isMajorStep: true,
    message: "Phase 2: accumulating counts to find final positions",
  });

  for (let i = 1; i < range; i++) {
    count[i] += count[i - 1];

    steps.push({
      array: snapshot(),
      stepType: "count",
      comparing: [],
      bucketIndex: i,
      buckets: [count.map((c) => c)],
      sorted: [],
      message: `Bucket ${i}: cumulative count is now ${count[i]}`,
    });
  }

  // ── Phase 3: Reconstruct output array ──────────────────────────────────────
  steps.push({
    array: snapshot(),
    stepType: "bucket-reconstruct",
    comparing: [],
    sorted: [],
    isMajorStep: true,
    message: "Phase 3: placing elements into their final positions",
  });

  // Traverse input right-to-left for stability
  const output = new Array<ArrayElement>(n);
  const sortedIndices: number[] = [];

  for (let i = n - 1; i >= 0; i--) {
    const bucketIdx = arr[i].value - minVal;
    const position = count[bucketIdx] - 1;
    output[position] = { ...arr[i] };
    count[bucketIdx]--;

    steps.push({
      array: snapshot(), // main arr unchanged during reconstruction — output is the focus
      stepType: "bucket-reconstruct",
      comparing: [i],
      bucketIndex: bucketIdx,
      buckets: [output.filter(Boolean).map((e) => e.value)],
      sorted: [...sortedIndices],
      message: `Placed ${arr[i].value} at output position ${position}`,
    });
  }

  // Write output back into arr and emit final sorted steps
  for (let i = 0; i < n; i++) {
    arr[i] = { ...output[i] };
    sortedIndices.push(i);
  }

  steps.push({
    array: snapshot(),
    stepType: "complete",
    sorted: Array.from({ length: n }, (_, i) => i),
    isMajorStep: true,
    message: "Counting sort complete!",
  });

  return steps;
};

// ── Registration ──────────────────────────────────────────────────────────────
// This is the only place you need to touch to add this algorithm to the app.

export const definition: SortingAlgorithmDefinition = {
  key: "counting",
  name: "Counting Sort",
  func: countingSort,
};
