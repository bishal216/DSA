import { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

export const stoogeSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  let comparisons = 0;
  let swaps = 0;

  const stooge = (l: number, h: number, depth: number = 0) => {
    if (l >= h) return;

    comparisons++;
    steps.push({
      array: [...array],
      comparing: [l, h],
      stepType: "comparison",
      isMajorStep: depth === 0,
      sorted: [],
      message:
        depth === 0
          ? `Start Stooge Sort on range [${l}, ${h}] by comparing ${array[l].value} and ${array[h].value}`
          : `Compare ${array[l].value} and ${array[h].value} in recursive step`,
    });

    if (array[l].value > array[h].value) {
      [array[l], array[h]] = [array[h], array[l]];
      swaps++;
      steps.push({
        array: [...array],
        swapping: [l, h],
        stepType: "swapping",
        isMajorStep: depth === 0,
        sorted: [],
        message: `Swapped ${array[l].value} and ${array[h].value}`,
      });
    }

    if (h - l + 1 > 2) {
      const t = Math.floor((h - l + 1) / 3);
      stooge(l, h - t, depth + 1);
      stooge(l + t, h, depth + 1);
      stooge(l, h - t, depth + 1);
    }
  };

  stooge(0, array.length - 1);

  steps.push({
    array: [...array],
    sorted: Array.from({ length: array.length }, (_, i) => i),
    stepType: "informCompleted",
    isMajorStep: true,
    message: `Sorting complete! ${comparisons} comparisons, ${swaps} swaps`,
  });

  return steps;
};
