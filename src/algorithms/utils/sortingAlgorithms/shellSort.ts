import { ArrayElement, SortingStep } from "@/algorithms/types/sorting";
import { stepCount } from "@/algorithms/utils/helpers";

export const shellSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;

  for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
    steps.push({
      array: [...array],
      stepType: "gapInfo",
      isMajorStep: true,
      sorted: [],
      message: `Starting new pass with gap ${gap}`,
    });

    for (let i = gap; i < n; i++) {
      const temp = array[i];
      let j = i;

      steps.push({
        array: [...array],
        comparing: [i - gap, i],
        stepType: "comparison",
        isMajorStep: stepCount(steps, "comparison") === 0,
        sorted: [],
        message:
          stepCount(steps, "comparison") === 0
            ? `Shell sort compares elements at a distance of gap ${gap}, like ${array[i - gap].value} and ${temp.value}`
            : `Comparing ${array[i - gap].value} and ${temp.value}`,
      });

      while (j >= gap && array[j - gap].value > temp.value) {
        comparisons++;
        steps.push({
          array: [...array],
          comparing: [j - gap, j],
          stepType: "comparison",
          isMajorStep: false,
          sorted: [],
          message: `Comparing ${array[j - gap].value} and ${temp.value}`,
        });

        array[j] = array[j - gap];
        swaps++;
        steps.push({
          array: [...array],
          swapping: [j, j - gap],
          stepType: "swapping",
          isMajorStep: stepCount(steps, "swapping") === 0,
          sorted: [],
          message: `Moved ${array[j].value} to position ${j}`,
        });

        j -= gap;
      }

      array[j] = temp;

      steps.push({
        array: [...array],
        swapping: [j, i],
        stepType: "swapping",
        isMajorStep: true,
        sorted: [],
        message: `Inserted ${temp.value} at position ${j}`,
      });
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
