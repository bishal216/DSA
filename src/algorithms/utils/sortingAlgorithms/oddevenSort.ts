import { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

export const oddEvenSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;
  let sorted = false;

  while (!sorted) {
    sorted = true;

    // Odd indexed pass
    for (let i = 1; i < n - 1; i += 2) {
      comparisons++;
      steps.push({
        array: [...array],
        comparing: [i, i + 1],
        stepType: "comparison",
        isMajorStep: i === 1,
        sorted: [],
        message:
          i === 1
            ? `Odd-Even Sort compares adjacent elements in two alternating passes. First, the odd-indexed pairs like ${array[i].value} and ${array[i + 1].value}`
            : `Comparing ${array[i].value} and ${array[i + 1].value}`,
      });

      if (array[i].value > array[i + 1].value) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        swaps++;
        sorted = false;
        steps.push({
          array: [...array],
          swapping: [i, i + 1],
          stepType: "swapping",
          isMajorStep: i === 1,
          sorted: [],
          message: `Swapped ${array[i].value} and ${array[i + 1].value}`,
        });
      }
    }

    // Even indexed pass
    for (let i = 0; i < n - 1; i += 2) {
      comparisons++;
      steps.push({
        array: [...array],
        comparing: [i, i + 1],
        stepType: "comparison",
        isMajorStep: i === 0,
        sorted: [],
        message:
          i === 0
            ? `Now, compare even-indexed pairs like ${array[i].value} and ${array[i + 1].value}`
            : `Comparing ${array[i].value} and ${array[i + 1].value}`,
      });

      if (array[i].value > array[i + 1].value) {
        [array[i], array[i + 1]] = [array[i + 1], array[i]];
        swaps++;
        sorted = false;
        steps.push({
          array: [...array],
          swapping: [i, i + 1],
          stepType: "swapping",
          isMajorStep: i === 0,
          sorted: [],
          message: `Swapped ${array[i].value} and ${array[i + 1].value}`,
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
