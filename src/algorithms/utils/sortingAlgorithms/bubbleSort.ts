import { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import { stepCount } from "@/algorithms/utils/helpers";
export const bubbleSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;

      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        stepType: "comparison",
        sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
        isMajorStep: steps.length === 0,
        message:
          steps.length === 0
            ? `In bubble sort, we compare consecutive elements like ${array[j].value} and ${array[j + 1].value}`
            : `Comparing ${array[j].value} and ${array[j + 1].value}`,
      });

      if (array[j].value > array[j + 1].value) {
        swapped = true;
        swaps++;
        const a = array[j];
        const b = array[j + 1];
        [array[j], array[j + 1]] = [b, a];

        const isFirstSwap = stepCount(steps, "swapping") === 0;

        steps.push({
          array: [...array],
          swapping: [j, j + 1],
          stepType: "swapping",
          sorted: Array.from({ length: i }, (_, k) => n - 1 - k),
          isMajorStep: isFirstSwap,
          message: isFirstSwap
            ? `In bubble sort, we swap elements like ${a.value} and ${b.value}`
            : `Swapped ${a.value} and ${b.value}`,
        });
      }
    }

    // Mark current element as sorted
    steps.push({
      array: [...array],
      stepType: "informSorted",
      sorted: Array.from({ length: i + 1 }, (_, k) => n - 1 - k),
      isMajorStep: i < Math.min(4, array.length - 1),
      message: `Element ${array[n - i - 1].value} is now in its final position`,
    });

    if (!swapped) {
      steps.push({
        array: [...array],
        stepType: "informSorted",
        sorted: Array.from({ length: n }, (_, i) => i),
        isMajorStep: true,
        message: `No swaps in this pass, so the array is already sorted!`,
      });
      break;
    }
  }

  // Final step
  steps.push({
    array: [...array],
    stepType: "informCompleted",
    sorted: Array.from({ length: n }, (_, i) => i),
    isMajorStep: true,
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};
