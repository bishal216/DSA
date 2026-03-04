// src/algorithms/utils/sortingAlgorithms/stoogeSort.ts

import type { SortingAlgorithmDefinition } from "@/algorithms/registry/sorting-algorithms-registry";
import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

export const stoogeSort = (array: ArrayElement[]): SortingStep[] => {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const n = arr.length;
  let comparisons = 0;
  let swaps = 0;

  const snapshot = () => arr.map((e) => ({ ...e }));

  // Descriptive opening step
  steps.push({
    array: snapshot(),
    stepType: "comparison",
    comparing: [],
    sorted: [],
    isMajorStep: true,
    message:
      "Stooge sort recursively sorts the first 2/3, last 2/3, then first 2/3 again",
  });

  const stooge = (l: number, h: number, depth: number = 0) => {
    if (l >= h) return;

    comparisons++;

    const activeRange = Array.from({ length: h - l + 1 }, (_, i) => l + i);

    steps.push({
      array: snapshot(),
      stepType: "comparison",
      comparing: [l, h],
      activeSublistLeft: activeRange, // communicate the active recursive window
      depth,
      sorted: [],
      message: `Depth ${depth}: comparing ${arr[l].value} and ${arr[h].value} at range [${l}, ${h}]`,
    });

    if (arr[l].value > arr[h].value) {
      // Capture values before the swap so the message is correct
      const [a, b] = [arr[l].value, arr[h].value];
      [arr[l], arr[h]] = [{ ...arr[h] }, { ...arr[l] }];
      swaps++;

      steps.push({
        array: snapshot(),
        stepType: "swap",
        swapping: [l, h],
        activeSublistLeft: activeRange,
        depth,
        sorted: [],
        message: `Depth ${depth}: swapped ${a} and ${b}`,
      });
    }

    if (h - l + 1 > 2) {
      const t = Math.floor((h - l + 1) / 3);

      // Each recursive call boundary is a natural isMajorStep
      steps.push({
        array: snapshot(),
        stepType: "divide",
        activeSublistLeft: Array.from(
          { length: h - t - l + 1 },
          (_, i) => l + i,
        ),
        depth,
        sorted: [],
        isMajorStep: true,
        message: `Depth ${depth}: recursing into first 2/3 — range [${l}, ${h - t}]`,
      });
      stooge(l, h - t, depth + 1);

      steps.push({
        array: snapshot(),
        stepType: "divide",
        activeSublistLeft: Array.from(
          { length: h - (l + t) + 1 },
          (_, i) => l + t + i,
        ),
        depth,
        sorted: [],
        isMajorStep: true,
        message: `Depth ${depth}: recursing into last 2/3 — range [${l + t}, ${h}]`,
      });
      stooge(l + t, h, depth + 1);

      steps.push({
        array: snapshot(),
        stepType: "divide",
        activeSublistLeft: Array.from(
          { length: h - t - l + 1 },
          (_, i) => l + i,
        ),
        depth,
        sorted: [],
        isMajorStep: true,
        message: `Depth ${depth}: recursing into first 2/3 again — range [${l}, ${h - t}]`,
      });
      stooge(l, h - t, depth + 1);
    }
  };

  stooge(0, n - 1);

  steps.push({
    array: snapshot(),
    stepType: "complete",
    sorted: Array.from({ length: n }, (_, i) => i),
    isMajorStep: true,
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};

// ── Registration ──────────────────────────────────────────────────────────────
// This is the only place you need to touch to add this algorithm to the app.

export const definition: SortingAlgorithmDefinition = {
  key: "stooge",
  name: "Stooge Sort",
  func: stoogeSort,
};
