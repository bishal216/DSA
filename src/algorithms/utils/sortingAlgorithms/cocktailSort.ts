import { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import { stepCount } from "@/algorithms/utils/helpers";

export const cocktailSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;

  let comparisons = 0;
  let swaps = 0;

  let start = 0;
  let end = n - 1;
  let swapped = true;

  while (swapped) {
    swapped = false;

    // Forward pass
    for (let i = start; i < end; i++) {
      comparisons++;

      steps.push({
        array: [...array],
        comparing: [i, i + 1],
        stepType: "comparison",
        sorted: [
          ...Array.from({ length: start }, (_, k) => k),
          ...Array.from({ length: n - 1 - end }, (_, k) => n - 1 - k),
        ],
        isMajorStep: stepCount(steps, "comparison") === 0,
        message:
          stepCount(steps, "comparison") === 0
            ? `In cocktail sort, we start by comparing elements forward: ${array[i].value} and ${array[i + 1].value}`
            : `Comparing ${array[i].value} and ${array[i + 1].value}`,
      });

      if (array[i].value > array[i + 1].value) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        swaps++;
        swapped = true;

        steps.push({
          array: [...array],
          swapping: [i, i + 1],
          stepType: "swapping",
          sorted: [
            ...Array.from({ length: start }, (_, k) => k),
            ...Array.from({ length: n - 1 - end }, (_, k) => n - 1 - k),
          ],
          isMajorStep: stepCount(steps, "swapping") === 0,
          message: `Swapped ${array[i].value} and ${array[i + 1].value}`,
        });
      }
    }

    steps.push({
      array: [...array],
      stepType: "informSorted",
      sorted: [end],
      isMajorStep: true,
      message: `Element ${array[end].value} is now in its final position (after forward pass)`,
    });

    if (!swapped) break;

    swapped = false;
    end--;

    // Backward pass
    for (let i = end; i > start; i--) {
      comparisons++;

      steps.push({
        array: [...array],
        comparing: [i - 1, i],
        stepType: "comparison",
        sorted: [
          ...Array.from({ length: start }, (_, k) => k),
          ...Array.from({ length: n - 1 - end }, (_, k) => n - 1 - k),
        ],
        isMajorStep: false,
        message: `Comparing ${array[i - 1].value} and ${array[i].value}`,
      });

      if (array[i - 1].value > array[i].value) {
        [array[i - 1], array[i]] = [array[i], array[i - 1]];
        swaps++;
        swapped = true;

        steps.push({
          array: [...array],
          swapping: [i - 1, i],
          stepType: "swapping",
          sorted: [
            ...Array.from({ length: start }, (_, k) => k),
            ...Array.from({ length: n - 1 - end }, (_, k) => n - 1 - k),
          ],
          isMajorStep: false,
          message: `Swapped ${array[i - 1].value} and ${array[i].value}`,
        });
      }
    }

    steps.push({
      array: [...array],
      stepType: "informSorted",
      sorted: [start],
      isMajorStep: true,
      message: `Element ${array[start].value} is now in its final position (after backward pass)`,
    });

    start++;
  }

  steps.push({
    array: [...array],
    stepType: "informCompleted",
    sorted: Array.from({ length: n }, (_, i) => i),
    isMajorStep: true,
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};
