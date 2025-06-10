import { useEffect } from "react";

interface SearchVisualizerProps {
  array: number[];
  searchValue: number;
  algorithm: "linear" | "binary";
  speed: number;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
  setCurrentIndex: (index: number) => void;
  setFoundIndex: (index: number) => void;
  setComparisons: (comparisons: number) => void;
  setVisitedIndices: (indices: number[]) => void;
  setEliminatedIndices?: (indices: number[]) => void;
}

export const Visualizer = ({
  array,
  searchValue,
  algorithm,
  speed,
  isSearching,
  setIsSearching,
  setCurrentIndex,
  setFoundIndex,
  setComparisons,
  setVisitedIndices,
  setEliminatedIndices,
}: SearchVisualizerProps) => {
  useEffect(() => {
    if (!isSearching) return;

    const sleep = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms));

    const linearSearch = async () => {
      let comparisons = 0;
      const visited: number[] = [];

      for (let i = 0; i < array.length; i++) {
        setCurrentIndex(i);
        comparisons++;
        setComparisons(comparisons);

        await sleep(speed);

        if (array[i] === searchValue) {
          setFoundIndex(i);
          setIsSearching(false);
          return;
        }

        visited.push(i);
        setVisitedIndices([...visited]);
      }

      setCurrentIndex(-1);
      setIsSearching(false);
    };

    const binarySearch = async () => {
      let left = 0;
      let right = array.length - 1;
      let comparisons = 0;
      const visited: number[] = [];
      const eliminated: number[] = [];

      while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        setCurrentIndex(mid);
        comparisons++;
        setComparisons(comparisons);

        await sleep(speed);

        if (array[mid] === searchValue) {
          setFoundIndex(mid);
          setIsSearching(false);
          return;
        }

        visited.push(mid);
        setVisitedIndices([...visited]);

        // Add eliminated indices based on comparison
        if (array[mid] < searchValue) {
          // Eliminate left side (including mid)
          for (let i = left; i <= mid; i++) {
            if (!eliminated.includes(i)) {
              eliminated.push(i);
            }
          }
          left = mid + 1;
        } else {
          // Eliminate right side (including mid)
          for (let i = mid; i <= right; i++) {
            if (!eliminated.includes(i)) {
              eliminated.push(i);
            }
          }
          right = mid - 1;
        }

        if (setEliminatedIndices) {
          setEliminatedIndices([...eliminated]);
        }

        await sleep(speed / 2);
      }

      setCurrentIndex(-1);
      setIsSearching(false);
    };

    if (algorithm === "linear") {
      linearSearch();
    } else {
      binarySearch();
    }
  }, [
    isSearching,
    array,
    searchValue,
    algorithm,
    speed,
    setCurrentIndex,
    setFoundIndex,
    setComparisons,
    setVisitedIndices,
    setIsSearching,
    setEliminatedIndices,
  ]);

  return null;
};
