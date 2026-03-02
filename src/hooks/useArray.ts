import { useState, useCallback, useEffect } from "react";
import { ArrayElement } from "@/algorithms/types/elements";

/**
 * Custom hook to manage an array for visualizations.
 * Provides functionality to generate random arrays, create custom arrays,
 * reset the array, and track comparisons and swaps.
 *
 * @param {number} initialSize - Initial size of the array (default is 20).
 * @returns {Object} - Contains methods and state for managing the array.
 */
export const useArray = (initialSize: number = 20) => {
  const [arraySize, setArraySize] = useState(initialSize);
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [originalArray, setOriginalArray] = useState<ArrayElement[]>([]);
  const [comparisons, setComparisons] = useState(0);
  const [swaps, setSwaps] = useState(0);

  const updateArrayState = useCallback((newArray: ArrayElement[]) => {
    setArray(newArray);
    setOriginalArray([...newArray]);
    setComparisons(0);
    setSwaps(0);
  }, []);

  const generateArray = useCallback(() => {
    const newArray: ArrayElement[] = Array.from(
      { length: arraySize },
      (_, i) => ({
        value: Math.floor(Math.random() * 300) + 10,
        id: i,
      }),
    );
    updateArrayState(newArray);
  }, [arraySize, updateArrayState]);

  const setCustomArray = useCallback(
    (customArray: number[]) => {
      const newArray: ArrayElement[] = customArray.map((value, index) => ({
        value,
        id: index,
      }));
      updateArrayState(newArray);
    },
    [updateArrayState],
  );

  const resetArray = useCallback(() => {
    const reset = originalArray.map(({ value }, index) => ({
      value,
      id: index,
    }));
    setArray(reset);
    setComparisons(0);
    setSwaps(0);
  }, [originalArray]);

  useEffect(() => {
    generateArray();
  }, [generateArray]);

  return {
    array,
    setArray,
    arraySize,
    setArraySize,
    generateArray,
    setCustomArray,
    resetArray,
    comparisons,
    setComparisons,
    swaps,
    setSwaps,
  };
};
