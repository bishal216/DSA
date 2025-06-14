import { SortingStep, ArrayElement } from "@/algorithms/types/sorting";

export const mergeSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = arr.map((el) => ({ ...el })); // Initial deep clone

  // Keep track of sorted indices separately, do NOT mutate elements directly
  const sortedIndices: Set<number> = new Set();

  // Helper to return a snapshot array with isSorted applied only for sortedIndices
  const getSnapshot = (): ArrayElement[] =>
    array.map((el, idx) => ({
      ...el,
      isSorted: sortedIndices.has(idx),
    }));

  const mergeSortHelper = (left: number, right: number) => {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    steps.push({
      stepType: "divide",
      array: getSnapshot(),
      message: `Divide [${left}..${mid}] and [${mid + 1}..${right}]`,
    });

    mergeSortHelper(left, mid);
    mergeSortHelper(mid + 1, right);

    let i = left,
      j = mid + 1;
    const temp: ArrayElement[] = [];

    while (i <= mid && j <= right) {
      steps.push({
        stepType: "comparison",
        array: getSnapshot(),
        comparing: [i, j],
        message: `Compare indices ${i} (${array[i].value}) and ${j} (${array[j].value})`,
      });

      if (array[i].value <= array[j].value) {
        temp.push({ ...array[i++] });
      } else {
        temp.push({ ...array[j++] });
      }
    }

    while (i <= mid) temp.push({ ...array[i++] });
    while (j <= right) temp.push({ ...array[j++] });

    for (let k = 0; k < temp.length; k++) {
      array[left + k] = temp[k];
      steps.push({
        stepType: "merge",
        array: getSnapshot(),
        merging: [left + k],
        message: `Set index ${left + k} to ${temp[k].value}`,
      });
    }

    // Mark this subarray as sorted now
    for (let k = left; k <= right; k++) {
      sortedIndices.add(k);
    }

    steps.push({
      stepType: "informSorted",
      array: getSnapshot(),
      sorted: Array.from(sortedIndices),
      message: `Subarray [${left}..${right}] sorted`,
    });
  };

  mergeSortHelper(0, array.length - 1);

  steps.push({
    stepType: "informCompleted",
    array: getSnapshot(),
    sorted: [...Array(array.length).keys()],
    message: "Sorting complete!",
  });

  return steps;
};
