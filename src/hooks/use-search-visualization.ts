// src/hooks/use-search-visualization.ts
import { useState } from "react";

type SearchAlgorithm = "linear" | "binary";

const DEFAULT_ARRAY = [1, 3, 5, 7, 9, 12, 15, 18, 21, 25, 28, 31, 35, 38, 42];

export const useSearchVisualization = (initialArray: number[] = []) => {
  const [array, setArray] = useState<number[]>(
    initialArray.length ? initialArray : DEFAULT_ARRAY,
  );
  const [searchValue, setSearchValue] = useState<number>(15);
  const [isSearching, setIsSearching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [foundIndex, setFoundIndex] = useState<number>(-1);
  const [searchAlgorithm, setSearchAlgorithm] =
    useState<SearchAlgorithm>("linear");
  const [speed, setSpeed] = useState<number>(500);
  const [comparisons, setComparisons] = useState<number>(0);
  const [visitedIndices, setVisitedIndices] = useState<number[]>([]);
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);

  const resetVisualizationState = () => {
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setComparisons(0);
    setVisitedIndices([]);
    setEliminatedIndices([]);
  };

  const onResetVisualization = () => {
    resetVisualizationState();
    setIsSearching(false);
  };

  const runLinearSearch = (target: number) => {
    let step = 0;
    const interval = setInterval(() => {
      if (step >= array.length) {
        clearInterval(interval);
        setIsSearching(false);
        return;
      }

      setCurrentIndex(step);
      setVisitedIndices((prev) => [...prev, step]);
      setComparisons((prev) => prev + 1);

      if (array[step] === target) {
        setFoundIndex(step);
        clearInterval(interval);
        setIsSearching(false);
        return;
      }

      step++;
    }, speed);
  };

  const runBinarySearch = (target: number) => {
    let low = 0;
    let high = array.length - 1;

    const step = () => {
      if (low > high) {
        setIsSearching(false);
        return;
      }

      const mid = Math.floor((low + high) / 2);
      setCurrentIndex(mid);
      setVisitedIndices((prev) => [...prev, mid]);
      setComparisons((prev) => prev + 1);

      if (array[mid] === target) {
        setFoundIndex(mid);
        setIsSearching(false);
        return;
      }

      if (array[mid] < target) {
        setEliminatedIndices((prev) => [
          ...prev,
          ...Array.from({ length: mid - low + 1 }, (_, i) => low + i),
        ]);
        low = mid + 1;
      } else {
        setEliminatedIndices((prev) => [
          ...prev,
          ...Array.from({ length: high - mid + 1 }, (_, i) => mid + i),
        ]);
        high = mid - 1;
      }

      setTimeout(step, speed);
    };

    setTimeout(step, speed);
  };

  const onStartSearch = () => {
    if (isSearching) return;
    resetVisualizationState();
    setIsSearching(true);

    if (searchAlgorithm === "linear") {
      runLinearSearch(searchValue);
    } else {
      runBinarySearch(searchValue);
    }
  };

  return {
    array,
    setArray,
    searchValue,
    setSearchValue,
    isSearching,
    setIsSearching,
    currentIndex,
    setCurrentIndex,
    foundIndex,
    setFoundIndex,
    searchAlgorithm,
    setSearchAlgorithm,
    speed,
    setSpeed,
    comparisons,
    setComparisons,
    visitedIndices,
    setVisitedIndices,
    eliminatedIndices,
    setEliminatedIndices,
    onStartSearch,
    onResetVisualization,
  };
};
