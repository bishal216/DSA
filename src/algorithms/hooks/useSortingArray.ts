import { useState, useCallback, useEffect } from "react";
import { ArrayElement } from "@/algorithms/types/sorting";

export const useSortingArray = (initialSize: number = 20) => {
  // Stateful array size (used with sliders as [value])
  const [arraySize, setArraySize] = useState([initialSize]);

  // Main array for visualization
  const [array, setArray] = useState<ArrayElement[]>([]);
  // Copy of the original array to reset to
  const [originalArray, setOriginalArray] = useState<ArrayElement[]>([]);
  // Counts for comparisons and swaps
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  // Generates a new random array
  const generateArray = useCallback(() => {
    const size = arraySize[0];
    const newArray: ArrayElement[] = Array.from({ length: size }, (_, i) => ({
      value: Math.floor(Math.random() * 300) + 10,
      id: i,
    }));
    setArray(newArray);
    setOriginalArray([...newArray]);
    setComparisons(0);
    setSwaps(0);
  }, [arraySize]);

  // Resets array to its original state
  const resetArray = useCallback(() => {
    const reset = originalArray.map((element, index) => ({
      value: element.value,
      id: index,
    }));
    setArray(reset);
    setComparisons(0);
    setSwaps(0);
  }, [originalArray]);

  // 👇 Automatically regenerate array when size changes
  useEffect(() => {
    generateArray();
  }, [generateArray]);

  return {
    array,
    setArray,
    generateArray,
    resetArray,
    comparisons,
    setComparisons,
    swaps,
    setSwaps,
    arraySize,
    setArraySize,
  };
};
