import { useState } from "react";

export const useSearchVisualization = (initialArray = []) => {
  const [array, setArray] = useState<number[]>(
    initialArray.length
      ? initialArray
      : [1, 3, 5, 7, 9, 12, 15, 18, 21, 25, 28, 31, 35, 38, 42],
  );
  const [searchValue, setSearchValue] = useState<number>(15);
  const [isSearching, setIsSearching] = useState(false);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [foundIndex, setFoundIndex] = useState<number>(-1);
  const [searchAlgorithm, setSearchAlgorithm] = useState<"linear" | "binary">(
    "linear",
  );
  const [speed, setSpeed] = useState<number>(500);
  const [comparisons, setComparisons] = useState<number>(0);
  const [visitedIndices, setVisitedIndices] = useState<number[]>([]);
  const [eliminatedIndices, setEliminatedIndices] = useState<number[]>([]);

  const onStartSearch = () => {
    setIsSearching(true);
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setComparisons(0);
    setVisitedIndices([]);
    setEliminatedIndices([]);
  };

  const onResetVisualization = () => {
    setCurrentIndex(-1);
    setFoundIndex(-1);
    setComparisons(0);
    setVisitedIndices([]);
    setEliminatedIndices([]);
    setIsSearching(false);
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
