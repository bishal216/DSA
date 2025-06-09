import { ArrayElement, SortingStep } from "@/types/sorting";

export const selectionSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...array],
        comparing: [minIdx, j],
        stepType: "comparison",
        sorted: Array.from({ length: i }, (_, k) => k),
        isMajorStep: false,
        message: `Comparing ${array[minIdx].value} and ${array[j].value}`,
      });

      if (array[j].value < array[minIdx].value) {
        minIdx = j;

        steps.push({
          array: [...array],
          comparing: [i, minIdx],
          stepType: "comparison",
          sorted: Array.from({ length: i }, (_, k) => k),
          isMajorStep: false,
          message: `${array[minIdx].value} is the new minimum`,
        });
      }
    }

    if (minIdx !== i) {
      const a = array[i];
      const b = array[minIdx];
      [array[i], array[minIdx]] = [b, a];

      steps.push({
        array: [...array],
        swapping: [i, minIdx],
        stepType: "swapping",
        sorted: Array.from({ length: i + 1 }, (_, k) => k),
        isMajorStep: true,
        message: `Swapped ${a.value} and ${b.value}`,
      });
    }

    steps.push({
      array: [...array],
      stepType: "informSorted",
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      isMajorStep: true,
      message: `Element ${array[i].value} is now in its final position`,
    });
  }

  steps.push({
    array: [...array],
    stepType: "informCompleted",
    sorted: Array.from({ length: n }, (_, i) => i),
    isMajorStep: true,
    message: `Sorting complete!`,
  });

  return steps;
};
