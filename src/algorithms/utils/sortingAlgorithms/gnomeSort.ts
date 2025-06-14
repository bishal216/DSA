import { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import { stepCount } from "@/algorithms/utils/helpers";

export const gnomeSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;
  let index = 0;

  while (index < n) {
    if (index === 0) {
      index++;
      continue;
    }

    comparisons++;

    steps.push({
      array: [...array],
      comparing: [index - 1, index],
      stepType: "comparison",
      isMajorStep: stepCount(steps, "comparison") === 0,
      sorted: Array.from({ length: index }, (_, i) => i),
      message:
        stepCount(steps, "comparison") === 0
          ? `In gnome sort, we compare adjacent elements like ${array[index - 1].value} and ${array[index].value}`
          : `Comparing ${array[index - 1].value} and ${array[index].value}`,
    });

    if (array[index - 1].value <= array[index].value) {
      index++;
    } else {
      swaps++;
      [array[index - 1], array[index]] = [array[index], array[index - 1]];

      steps.push({
        array: [...array],
        swapping: [index - 1, index],
        stepType: "swapping",
        isMajorStep: stepCount(steps, "swapping") === 0,
        sorted: Array.from({ length: index }, (_, i) => i),
        message: `Swapped ${array[index - 1].value} and ${array[index].value}`,
      });

      index--;
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
