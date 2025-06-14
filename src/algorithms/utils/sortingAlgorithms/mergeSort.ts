import { SortingStep, ArrayElement } from "@/algorithms/types/sorting";

export const mergeSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = arr.map((el) => ({ ...el }));
  const sortedIndices: Set<number> = new Set();
  const depths = new Array(arr.length).fill(0); // track depth per element

  const getSnapshot = (): ArrayElement[] =>
    array.map((el, idx) => ({
      ...el,
      isSorted: sortedIndices.has(idx),
      depth: depths[idx], // <-- include per-element depth here
    }));

  const pushStep = (
    step: Omit<SortingStep, "array">,
    left?: number,
    right?: number,
    depth?: number
  ) => {
    if (
      typeof left === "number" &&
      typeof right === "number" &&
      typeof depth === "number"
    ) {
      for (let i = left; i <= right; i++) {
        depths[i] = depth;
      }
    }
    steps.push({
      ...step,
      array: getSnapshot(),
    });
  };

  const mergeSortHelper = (left: number, right: number, depth: number = 0) => {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);
    const activeSublistLeft = Array.from(
      { length: mid - left + 1 },
      (_, i) => left + i
    );
    const activeSublistRight = Array.from(
      { length: right - mid },
      (_, i) => mid + 1 + i
    );

    // Update depth for current subarray before recursive calls
    pushStep(
      {
        stepType: "divide",
        activeSublistLeft,
        activeSublistRight,
        depth,
        message: `Divide subarrays [${left}..${mid}] and [${mid + 1}..${right}] at depth ${depth}`,
      },
      left,
      right,
      depth
    );

    mergeSortHelper(left, mid, depth + 1);
    mergeSortHelper(mid + 1, right, depth + 1);

    let i = left,
      j = mid + 1;
    const tempValues: number[] = [];

    while (i <= mid && j <= right) {
      pushStep(
        {
          stepType: "comparison",
          comparing: [i, j],
          activeSublistLeft,
          activeSublistRight,
          depth,
          message: `Compare indices ${i} (${array[i].value}) and ${j} (${array[j].value}) at depth ${depth}`,
        },
        left,
        right,
        depth
      );

      if (array[i].value <= array[j].value) {
        tempValues.push(array[i].value);
        i++;
      } else {
        tempValues.push(array[j].value);
        j++;
      }
    }

    while (i <= mid) tempValues.push(array[i++].value);
    while (j <= right) tempValues.push(array[j++].value);

    for (let k = 0; k < tempValues.length; k++) {
      const index = left + k;
      if (array[index].value !== tempValues[k]) {
        array[index].value = tempValues[k];
        pushStep(
          {
            stepType: "swapping",
            swapping: [index],
            activeSublistLeft,
            activeSublistRight,
            depth,
            message: `Set index ${index} to ${tempValues[k]} at depth ${depth}`,
          },
          left,
          right,
          depth
        );
      }
    }

    for (let k = left; k <= right; k++) {
      sortedIndices.add(k);
    }

    pushStep(
      {
        stepType: "informSorted",
        sorted: Array.from(sortedIndices),
        depth,
        message: `Subarray [${left}..${right}] sorted at depth ${depth}`,
      },
      left,
      right,
      depth
    );
  };

  mergeSortHelper(0, array.length - 1, 0);

  pushStep({
    stepType: "informCompleted",
    sorted: [...Array(array.length).keys()],
    depth: 0,
    message: "Sorting complete!",
  });

  return steps;
};
