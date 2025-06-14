import { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

export const insertionSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = [...arr];
  const n = array.length;

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    // Highlight the start of this insertion step
    steps.push({
      array: [...array],
      comparing: [j, i],
      stepType: "comparison",
      sorted: Array.from({ length: i }, (_, k) => k),
      isMajorStep: true,
      message: `In insertion sort, the current element ${key.value} is compared with previous sorted elements.`,
    });

    // Shift larger elements to the right
    while (j >= 0 && array[j].value > key.value) {
      // Highlight the comparison
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        stepType: "comparison",
        sorted: Array.from({ length: i }, (_, k) => k),
        isMajorStep: false,
        message: `Comparing ${array[j].value} with ${key.value}`,
      });
      array[j + 1] = array[j];
      array[j] = key; // Temporarily place key in the right position
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        stepType: "comparison",
        sorted: Array.from({ length: i }, (_, k) => k),
        isMajorStep: false,
        message: `Shifting ${array[j].value} to the right to make space for ${key.value}`,
      });
      j--;
    }
    // Insert key in the right place
    array[j + 1] = key;

    steps.push({
      array: [...array],
      swapping: [j + 1, i],
      stepType: "swapping",
      sorted: Array.from({ length: i + 1 }, (_, k) => k),
      isMajorStep: true,
      message: `Inserted ${key.value} at position ${j + 1}`,
    });
  }

  // Final confirmation step
  steps.push({
    array: [...array],
    stepType: "informCompleted",
    sorted: Array.from({ length: n }, (_, i) => i),
    isMajorStep: true,
    message: `Sorting complete!`,
  });

  return steps;
};
