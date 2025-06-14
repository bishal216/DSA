import { ArrayElement, SortingStep } from "@/algorithms/types/sorting";

export const bucketSort = (arr: ArrayElement[]): SortingStep[] => {
  const steps: SortingStep[] = [];
  const array = arr.map((el) => ({ ...el }));
  const sortedIndices = new Set<number>();
  const depths: number[] = new Array(array.length).fill(0);
  const bucketMap = new Map<number, number[]>(); // bucket index → element indices

  const getSnapshot = (): ArrayElement[] =>
    array.map((el, idx) => ({
      ...el,
      isSorted: sortedIndices.has(idx),
      depth: depths[idx],
      bucketIndex: findBucketForIndex(idx),
    }));

  const findBucketForIndex = (idx: number) => {
    for (const [bucketIdx, indices] of bucketMap.entries()) {
      if (indices.includes(idx)) return bucketIdx;
    }
    return undefined;
  };

  const pushStep = (
    step: Omit<SortingStep, "array">,
    updatedIndices: number[] = [],
    depth = 0
  ) => {
    updatedIndices.forEach((i) => (depths[i] = depth));
    steps.push({
      ...step,
      array: getSnapshot(),
    });
  };

  const n = array.length;
  if (n <= 1) return [];

  const maxVal = Math.max(...array.map((el) => el.value));
  const minVal = Math.min(...array.map((el) => el.value));

  const bucketCount = Math.ceil(Math.sqrt(n));
  const buckets: Array<ArrayElement[]> = Array.from(
    { length: bucketCount },
    () => []
  );
  const range = (maxVal - minVal + 1) / bucketCount;

  // Step 1: Distribute into buckets
  for (let i = 0; i < array.length; i++) {
    const bucketIdx = Math.floor((array[i].value - minVal) / range);
    buckets[bucketIdx].push(array[i]);
    if (!bucketMap.has(bucketIdx)) bucketMap.set(bucketIdx, []);
    bucketMap.get(bucketIdx)!.push(i);

    pushStep(
      {
        stepType: "bucketAssign",
        message: `Assign value ${array[i].value} to bucket ${bucketIdx}`,
        bucketIndex: bucketIdx,
      },
      [i],
      0
    );
  }

  // Step 2: Sort each bucket and reconstruct array
  let idx = 0;
  for (let b = 0; b < bucketCount; b++) {
    const bucket = buckets[b];
    bucket.sort((a, b) => a.value - b.value); // could visualize insertion sort here

    for (const el of bucket) {
      array[idx].value = el.value;
      sortedIndices.add(idx);

      pushStep(
        {
          stepType: "reconstruct",
          message: `Place ${el.value} back from bucket ${b}`,
        },
        [idx],
        1
      );

      idx++;
    }
  }

  pushStep({
    stepType: "informCompleted",
    sorted: [...Array(array.length).keys()],
    depth: 1,
    message: "Bucket sort complete!",
  });

  return steps;
};
