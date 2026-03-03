// src/hooks/use-array.ts
import { ArrayElement } from "@/types/array-element";
import { useCallback, useEffect, useState } from "react";

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
    setArray(originalArray.map(({ value }, index) => ({ value, id: index })));
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
