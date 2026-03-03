// src/algorithms/utils/sortingAlgorithms/bubbleSort.ts
import type { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import type { SortingAlgorithmDefinition } from "@/algorithms/types/sorting-algorithms-registry";

function bubbleSort(array: ArrayElement[]): SortingStep[] {
  const arr = array.map((e) => ({ ...e }));
  const steps: SortingStep[] = [];
  const n = arr.length;
  const sorted: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: arr.map((e) => ({ ...e })),
        stepType: "comparison",
        comparing: [j, j + 1],
        sorted: [...sorted],
        message: `Comparing ${arr[j].value} and ${arr[j + 1].value}`,
      });

      if (arr[j].value > arr[j + 1].value) {
        const [a, b] = [arr[j].value, arr[j + 1].value];
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;

        steps.push({
          array: arr.map((e) => ({ ...e })),
          stepType: "swap",
          swapping: [j, j + 1],
          sorted: [...sorted],
          message: `Swapping ${a} and ${b}`,
        });
      }
    }

    // The element at (n - 1 - i) is now confirmed sorted
    sorted.push(n - 1 - i);

    steps.push({
      array: arr.map((e) => ({ ...e })),
      stepType: "sorted",
      sorted: [...sorted],
      isMajorStep: true,
      message: `Pass ${i + 1} complete — ${arr[n - 1 - i].value} is in its final position`,
    });

    if (!swapped) break;
  }

  steps.push({
    array: arr.map((e) => ({ ...e })),
    stepType: "complete",
    sorted: Array.from({ length: n }, (_, i) => i),
    message: "Array sorted!",
  });

  return steps;
}

// ── Registration ──────────────────────────────────────────────────────────────
// This is the only place you need to touch to add this algorithm to the app.

export const definition: SortingAlgorithmDefinition = {
  key: "bubble",
  name: "Bubble Sort",
  func: bubbleSort,
};
