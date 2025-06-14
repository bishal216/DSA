import { SortingStep, ArrayElement } from "@/algorithms/types/sorting";

export const quickSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = arr.map((el) => ({ ...el }));
  const sortedIndices: Set<number> = new Set();
  const depths = new Array(arr.length).fill(0);
  let currentPivotIndex: number | null = null;

  const getSnapshot = (): ArrayElement[] =>
    array.map((el, idx) => ({
      ...el,
      isSorted: sortedIndices.has(idx),
      isPivot: currentPivotIndex === idx,
      depth: depths[idx],
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

  const swap = (i: number, j: number) => {
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  };

  const quickSortHelper = (left: number, right: number, depth: number = 0) => {
    if (left >= right) return;

    const pivotIndex = right;
    const pivotValue = array[pivotIndex].value;
    currentPivotIndex = pivotIndex;

    pushStep(
      {
        stepType: "pivot",
        pivot: pivotIndex,
        activeSublistLeft: Array.from(
          { length: right - left + 1 },
          (_, i) => left + i
        ),
        depth,
        message: `Choose pivot ${pivotValue} at index ${pivotIndex} (depth ${depth})`,
      },
      left,
      right,
      depth
    );

    let i = left;
    for (let j = left; j < right; j++) {
      pushStep(
        {
          stepType: "comparison",
          comparing: [j, pivotIndex],
          activeSublistLeft: [j],
          activeSublistRight: [pivotIndex],
          depth,
          message: `Compare ${array[j].value} with pivot ${pivotValue}`,
        },
        left,
        right,
        depth
      );

      if (array[j].value < pivotValue) {
        if (i !== j) {
          swap(i, j);
          pushStep(
            {
              stepType: "swapping",
              swapping: [i, j],
              depth,
              message: `Swap ${array[i].value} and ${array[j].value}`,
            },
            left,
            right,
            depth
          );
        }
        i++;
      }
    }

    if (i !== pivotIndex) {
      swap(i, pivotIndex);
      pushStep(
        {
          stepType: "swapping",
          swapping: [i, pivotIndex],
          depth,
          message: `Move pivot ${pivotValue} to index ${i}`,
        },
        left,
        right,
        depth
      );
    }

    sortedIndices.add(i);
    pushStep(
      {
        stepType: "informSorted",
        sorted: Array.from(sortedIndices),
        depth,
        message: `Pivot ${pivotValue} placed at index ${i}, subarray [${left}..${right}] partially sorted`,
      },
      left,
      right,
      depth
    );

    currentPivotIndex = null;

    quickSortHelper(left, i - 1, depth + 1);
    quickSortHelper(i + 1, right, depth + 1);
  };

  quickSortHelper(0, array.length - 1);

  pushStep({
    stepType: "informCompleted",
    sorted: [...Array(array.length).keys()],
    depth: 0,
    message: "Sorting complete!",
  });

  return steps;
};
