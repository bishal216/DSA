import { ArrayElement, SortingStep } from "@/types/sorting";
export const pancakeSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;
  let comparisons = 0;
  let swaps = 0;

  const flip = (end: number) => {
    let start = 0;
    while (start < end) {
      [array[start], array[end]] = [array[end], array[start]];
      swaps++;
      steps.push({
        array: [...array],
        swapping: [start, end],
        stepType: "swapping",
        isMajorStep: false,
        sorted: [],
        message: `Flipped ${array[end].value} and ${array[start].value}`,
      });
      start++;
      end--;
    }
  };

  for (let size = n; size > 1; size--) {
    let maxIdx = 0;

    for (let i = 1; i < size; i++) {
      comparisons++;
      steps.push({
        array: [...array],
        comparing: [maxIdx, i],
        stepType: "comparison",
        isMajorStep: false,
        sorted: [],
        message: `Comparing ${array[maxIdx].value} and ${array[i].value}`,
      });

      if (array[i].value > array[maxIdx].value) {
        maxIdx = i;
        steps.push({
          array: [...array],
          comparing: [maxIdx],
          stepType: "comparison",
          isMajorStep: false,
          sorted: [],
          message: `New max found: ${array[maxIdx].value} at index ${maxIdx}`,
        });
      }
    }

    if (maxIdx !== size - 1) {
      if (maxIdx !== 0) {
        steps.push({
          array: [...array],
          stepType: "flip",
          isMajorStep: true,
          sorted: [],
          message: `Flipping top ${maxIdx + 1} to bring ${array[maxIdx].value} to front`,
        });
        flip(maxIdx);
      }

      steps.push({
        array: [...array],
        stepType: "flip",
        isMajorStep: true,
        sorted: [],
        message: `Flipping top ${size} to move ${array[0].value} to correct position`,
      });
      flip(size - 1);
    }

    steps.push({
      array: [...array],
      sorted: [size - 1],
      stepType: "informSorted",
      isMajorStep: true,
      message: `Element ${array[size - 1].value} is in its final position`,
    });
  }

  steps.push({
    array: [...array],
    sorted: Array.from({ length: n }, (_, i) => i),
    stepType: "informCompleted",
    isMajorStep: true,
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};
