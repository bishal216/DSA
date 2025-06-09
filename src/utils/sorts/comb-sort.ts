import { ArrayElement, SortingStep } from "@/types/sorting";
import { stepCount } from "@/utils/sorting-utils";

export const combSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;

  let comparisons = 0;
  let swaps = 0;

  let gap = n;
  const shrink = 1.3;
  let sorted = false;

  while (!sorted) {
    // Shrink gap
    gap = Math.floor(gap / shrink);
    if (gap <= 1) {
      gap = 1;
      sorted = true;
    }

    for (let i = 0; i + gap < n; i++) {
      comparisons++;

      steps.push({
        array: [...array],
        comparing: [i, i + gap],
        stepType: "comparison",
        isMajorStep: stepCount(steps, "comparison") === 0,
        sorted: [], // Optional: Could highlight last sorted chunk
        message:
          stepCount(steps, "comparison") === 0
            ? `In comb sort, elements are compared at a gap like ${array[i].value} and ${array[i + gap].value}`
            : `Comparing ${array[i].value} and ${array[i + gap].value}`,
      });

      if (array[i].value > array[i + gap].value) {
        swaps++;
        sorted = false;

        [array[i], array[i + gap]] = [array[i + gap], array[i]];

        steps.push({
          array: [...array],
          swapping: [i, i + gap],
          stepType: "swapping",
          isMajorStep: stepCount(steps, "swapping") === 0,
          sorted: [],
          message: `Swapped ${array[i].value} and ${array[i + gap].value}`,
        });
      }
    }
  }

  steps.push({
    array: [...array],
    stepType: "informCompleted",
    isMajorStep: true,
    sorted: Array.from({ length: n }, (_, i) => i),
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};
