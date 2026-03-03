// src/algorithms/utils/sortingAlgorithms/cocktailSort.ts
//
// NOTE: Consider adding `activeRange?: [number, number]` to SortingStep in your
// types — it's cleaner than activeSublistLeft/Right for a single contiguous window.
// The steps below use activeSublistLeft to stay compatible with the current types.

import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import type { SortingAlgorithmDefinition } from "@/algorithms/types/sorting-algorithms-registry";

/** Returns all indices in the inclusive range [from, to]. */
function activeWindow(from: number, to: number): number[] {
  return Array.from({ length: to - from + 1 }, (_, k) => from + k);
}

function cocktailSort(array: ArrayElement[]): SortingStep[] {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const n = arr.length;
  const sorted = new Set<number>();

  let start = 0;
  let end = n - 1;
  let swapped = true;

  // Descriptive opening step — avoids the isFirstStep flag in the loop
  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "comparison",
    comparing: [],
    sorted: [],
    activeSublistLeft: activeWindow(start, end),
    isMajorStep: true,
    message:
      "Cocktail sort starts — will alternate forward and backward passes",
  });

  while (swapped) {
    swapped = false;

    // ── Forward pass ──────────────────────────────────────────────────────────
    for (let i = start; i < end; i++) {
      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "comparison",
        comparing: [i, i + 1],
        sorted: [...sorted],
        activeSublistLeft: activeWindow(start, end),
        message: `Forward pass: comparing ${arr[i].value} and ${arr[i + 1].value}`,
      });

      if (arr[i].value > arr[i + 1].value) {
        const [a, b] = [arr[i].value, arr[i + 1].value];
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
        swapped = true;

        steps.push({
          array: arr.map((e) => ({ ...e })),
          stepType: "swap",
          swapping: [i, i + 1],
          sorted: [...sorted],
          activeSublistLeft: activeWindow(start, end),
          message: `Swapping ${a} and ${b}`,
        });
      }
    }

    sorted.add(end);
    steps.push({
      array: arr.map((e) => ({ ...e })),
      stepType: "sorted",
      sorted: [...sorted],
      isMajorStep: true,
      message: `${arr[end].value} is now in its final position (end of forward pass)`,
    });

    if (!swapped) break;

    swapped = false;
    end--;

    // ── Backward pass ─────────────────────────────────────────────────────────
    for (let i = end; i > start; i--) {
      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "comparison",
        comparing: [i - 1, i],
        sorted: [...sorted],
        activeSublistLeft: activeWindow(start, end),
        message: `Backward pass: comparing ${arr[i - 1].value} and ${arr[i].value}`,
      });

      if (arr[i - 1].value > arr[i].value) {
        const [a, b] = [arr[i - 1].value, arr[i].value];
        [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
        swapped = true;

        steps.push({
          array: arr.map((e) => ({ ...e })),
          stepType: "swap",
          swapping: [i - 1, i],
          sorted: [...sorted],
          activeSublistLeft: activeWindow(start, end),
          message: `Swapping ${a} and ${b}`,
        });
      }
    }

    // Only mark start as sorted if the backward pass actually did work —
    // avoids a false "sorted" highlight on an early-exit pass
    if (swapped) {
      sorted.add(start);
      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "sorted",
        sorted: [...sorted],
        isMajorStep: true,
        message: `${arr[start].value} is now in its final position (end of backward pass)`,
      });
    }

    start++;
  }

  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "complete",
    sorted: Array.from({ length: n }, (_, i) => i),
    isMajorStep: true,
    message: "Array sorted!",
  });

  return steps;
}

// ── Registration ──────────────────────────────────────────────────────────────
// This is the only place you need to touch to add this algorithm to the app.

export const definition: SortingAlgorithmDefinition = {
  key: "cocktail",
  name: "Cocktail Sort",
  func: cocktailSort,
};
