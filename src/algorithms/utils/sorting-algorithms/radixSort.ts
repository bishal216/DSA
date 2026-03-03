// src/algorithms/utils/sortingAlgorithms/radixSort.ts
//
// NOTE: Add `radixDigit?: number` to SortingStep in your sorting types.
// This communicates which digit position (1 = ones, 10 = tens, 100 = hundreds…)
// is active so the visualizer can label the current pass.
//
// LSD (least significant digit first) implementation.

import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import type { SortingAlgorithmDefinition } from "@/algorithms/types/sorting-algorithms-registry";

/** Returns the digit at position `place` (1, 10, 100, …) of `value`. */
function getDigit(value: number, place: number): number {
  return Math.floor(Math.abs(value) / place) % 10;
}

/** Number of digits in the largest value — determines how many passes to run. */
function digitCount(value: number): number {
  if (value === 0) return 1;
  return Math.floor(Math.log10(Math.abs(value))) + 1;
}

export const radixSort = (array: ArrayElement[]): SortingStep[] => {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const n = arr.length;

  if (n <= 1) return [];

  const snapshot = () => arr.map((e) => ({ ...e }));

  const maxDigits = digitCount(Math.max(...arr.map((e) => e.value)));

  // ── Opening step ────────────────────────────────────────────────────────────
  steps.push({
    array: snapshot(),
    stepType: "comparison",
    comparing: [],
    sorted: [],
    isMajorStep: true,
    message: `Radix sort (LSD) — ${maxDigits} pass${maxDigits > 1 ? "es" : ""} required, one per digit position`,
  });

  // ── LSD passes: ones → tens → hundreds … ───────────────────────────────────
  for (let pass = 0; pass < maxDigits; pass++) {
    const place = Math.pow(10, pass); // 1, 10, 100, …
    const buckets: ArrayElement[][] = Array.from({ length: 10 }, () => []);
    const bucketIndices: number[][] = Array.from({ length: 10 }, () => []);

    // Pass announcement
    steps.push({
      array: snapshot(),
      stepType: "gap", // reuse "gap" as a pass-boundary marker (semantically similar)
      sorted: [],
      radixDigit: place,
      isMajorStep: true,
      message: `Pass ${pass + 1}: sorting by ${place === 1 ? "ones" : place === 10 ? "tens" : place === 100 ? "hundreds" : `${place}s`} digit`,
    });

    // ── Distribute into 10 buckets by current digit ─────────────────────────
    for (let i = 0; i < n; i++) {
      const digit = getDigit(arr[i].value, place);
      buckets[digit].push({ ...arr[i] });
      bucketIndices[digit].push(i);

      steps.push({
        array: snapshot(),
        stepType: "bucket-assign",
        comparing: [i],
        bucketIndex: digit,
        buckets: buckets.map((b) => b.map((e) => e.value)),
        sorted: [],
        radixDigit: place,
        message: `Digit ${digit}: assigned ${arr[i].value} to bucket ${digit}`,
      });
    }

    // ── Reconstruct arr from buckets in order ───────────────────────────────
    steps.push({
      array: snapshot(),
      stepType: "bucket-reconstruct",
      comparing: [],
      sorted: [],
      radixDigit: place,
      isMajorStep: true,
      message: `Pass ${pass + 1}: reconstructing array from buckets`,
    });

    let idx = 0;
    const sortedSoFar: number[] = [];

    for (let digit = 0; digit < 10; digit++) {
      for (const el of buckets[digit]) {
        arr[idx] = { ...el };
        sortedSoFar.push(idx);

        steps.push({
          array: snapshot(),
          stepType: "bucket-reconstruct",
          comparing: [idx],
          bucketIndex: digit,
          buckets: buckets.map((b) => b.map((e) => e.value)),
          sorted: pass === maxDigits - 1 ? [...sortedSoFar] : [], // only mark sorted on final pass
          radixDigit: place,
          message: `Placed ${el.value} from bucket ${digit} into position ${idx}`,
        });

        idx++;
      }
    }
  }

  steps.push({
    array: snapshot(),
    stepType: "complete",
    sorted: Array.from({ length: n }, (_, i) => i),
    isMajorStep: true,
    message: "Radix sort complete!",
  });

  return steps;
};

// ── Registration ──────────────────────────────────────────────────────────────
// This is the only place you need to touch to add this algorithm to the app.

export const definition: SortingAlgorithmDefinition = {
  key: "radix",
  name: "Radix Sort",
  func: radixSort,
};
