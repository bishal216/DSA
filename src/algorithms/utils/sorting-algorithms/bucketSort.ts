// src/algorithms/utils/sorting-algorithms/bucketSort.ts
//
// NOTE: Add "insert" to StepType in your sorting types:
//   | "insert"
// This is used below for insertion sort placements within buckets.

import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import type { SortingAlgorithmDefinition } from "@/algorithms/types/sorting-algorithms-registry";

function bucketSort(array: ArrayElement[]): SortingStep[] {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const n = arr.length;

  if (n <= 1) return [];

  const maxVal = Math.max(...arr.map((e) => e.value));
  const minVal = Math.min(...arr.map((e) => e.value));
  const bucketCount = Math.ceil(Math.sqrt(n));
  const range = (maxVal - minVal + 1) / bucketCount;

  // Mirrors `buckets` but stores original arr indices instead of values.
  // This lets us map bucket-local positions back to main array indices
  // so `comparing`/`swapping` fields remain meaningful to the visualizer.
  const bucketIndices: number[][] = Array.from(
    { length: bucketCount },
    () => [],
  );
  const buckets: ArrayElement[][] = Array.from(
    { length: bucketCount },
    () => [],
  );

  // ── Step 1: Distribute into buckets ────────────────────────────────────────
  for (let i = 0; i < n; i++) {
    const b = Math.min(
      Math.floor((arr[i].value - minVal) / range),
      bucketCount - 1,
    );
    buckets[b].push({ ...arr[i] });
    bucketIndices[b].push(i);

    steps.push({
      array: arr.map((e) => ({ ...e })),
      stepType: "bucket-assign",
      comparing: [i], // highlight the element being distributed
      bucketIndex: b,
      buckets: buckets.map((bkt) => bkt.map((e) => e.value)),
      message: `Assigned ${arr[i].value} to bucket ${b}`,
    });
  }

  // ── Step 2: Sort each bucket with insertion sort (visualised) ───────────────
  for (let b = 0; b < bucketCount; b++) {
    const bucket = buckets[b];

    for (let i = 1; i < bucket.length; i++) {
      const key = { ...bucket[i] };
      const keyIdx = bucketIndices[b][i];
      let j = i - 1;

      // Comparison step: show which two elements we're evaluating
      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "comparison",
        comparing: [bucketIndices[b][j], keyIdx],
        bucketIndex: b,
        buckets: buckets.map((bkt) => bkt.map((e) => e.value)),
        message: `Bucket ${b}: comparing ${bucket[j].value} and ${key.value}`,
      });

      // Emit a step for each individual shift (was previously a silent loop)
      while (j >= 0 && bucket[j].value > key.value) {
        bucket[j + 1] = { ...bucket[j] };
        bucketIndices[b][j + 1] = bucketIndices[b][j];

        steps.push({
          array: arr.map((e) => ({ ...e })),
          stepType: "comparison",
          comparing: [bucketIndices[b][j], keyIdx],
          bucketIndex: b,
          buckets: buckets.map((bkt) => bkt.map((e) => e.value)),
          message: `Bucket ${b}: shifting ${bucket[j].value} right to make room for ${key.value}`,
        });

        j--;
      }

      bucket[j + 1] = key;
      bucketIndices[b][j + 1] = keyIdx;

      // "insert" stepType — semantically correct vs "swap" for placement
      steps.push({
        array: arr.map((e) => ({ ...e })),
        // @ts-expect-error — add "insert" to StepType union to remove this
        stepType: "insert",
        comparing: [keyIdx],
        bucketIndex: b,
        buckets: buckets.map((bkt) => bkt.map((e) => e.value)),
        message: `Bucket ${b}: inserted ${key.value} at position ${j + 1}`,
        isMajorStep: true,
      });
    }
  }

  // ── Step 3: Reconstruct array from buckets ──────────────────────────────────
  const sortedIndices: number[] = [];
  let idx = 0;

  for (let b = 0; b < bucketCount; b++) {
    for (const el of buckets[b]) {
      // Use the bucket element's own identity (not the displaced arr[idx] id)
      arr[idx] = { ...el };
      sortedIndices.push(idx);

      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "bucket-reconstruct",
        bucketIndex: b,
        buckets: buckets.map((bkt) => bkt.map((e) => e.value)),
        sorted: [...sortedIndices],
        message: `Placed ${el.value} from bucket ${b} into position ${idx}`,
      });

      idx++;
    }
  }

  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "complete",
    sorted: Array.from({ length: n }, (_, i) => i),
    message: "Bucket sort complete!",
  });

  return steps;
}

// ── Registration ──────────────────────────────────────────────────────────────
// This is the only place you need to touch to add this algorithm to the app.

export const definition: SortingAlgorithmDefinition = {
  key: "bucket",
  name: "Bucket Sort",
  func: bucketSort,
};
