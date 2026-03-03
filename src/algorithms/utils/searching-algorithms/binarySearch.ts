// src/algorithms/utils/searching-algorithms/binarySearch.ts

import type { SearchStep } from "@/algorithms/types/searching";
import type { SearchAlgorithmDefinition } from "@/algorithms/types/searching-algorithms-registry";

function binarySearch(array: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const visited: number[] = [];
  const eliminated: number[] = [];

  let low = 0;
  let high = array.length - 1;

  steps.push({
    stepType: "comparison",
    currentIndex: -1,
    visitedIndices: [],
    eliminatedIndices: [],
    foundIndex: -1,
    low,
    high,
    isMajorStep: true,
    message: `Binary search: array must be sorted. Searching for ${target} in [${low}..${high}]`,
  });

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);

    steps.push({
      stepType: "comparison",
      currentIndex: mid,
      visitedIndices: [...visited],
      eliminatedIndices: [...eliminated],
      foundIndex: -1,
      low,
      high,
      mid,
      isMajorStep: true,
      message: `Window [${low}..${high}] — checking midpoint index ${mid} (value ${array[mid]})`,
    });

    if (array[mid] === target) {
      steps.push({
        stepType: "found",
        currentIndex: mid,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: mid,
        low,
        high,
        mid,
        isMajorStep: true,
        message: `Found ${target} at index ${mid}`,
      });

      steps.push({
        stepType: "complete",
        currentIndex: mid,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: mid,
        isMajorStep: true,
        message: `Search complete — ${target} found at index ${mid}`,
      });

      return steps;
    }

    visited.push(mid);

    if (array[mid] < target) {
      // Eliminate left half including mid
      for (let i = low; i <= mid; i++) eliminated.push(i);

      steps.push({
        stepType: "eliminated",
        currentIndex: -1,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: -1,
        low,
        high,
        mid,
        message: `${array[mid]} < ${target} — eliminating left half [${low}..${mid}]`,
      });

      low = mid + 1;
    } else {
      // Eliminate right half including mid
      for (let i = mid; i <= high; i++) eliminated.push(i);

      steps.push({
        stepType: "eliminated",
        currentIndex: -1,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: -1,
        low,
        high,
        mid,
        message: `${array[mid]} > ${target} — eliminating right half [${mid}..${high}]`,
      });

      high = mid - 1;
    }
  }

  // Not found
  steps.push({
    stepType: "not-found",
    currentIndex: -1,
    visitedIndices: [...visited],
    eliminatedIndices: [...eliminated],
    foundIndex: -1,
    isMajorStep: true,
    message: `${target} not found — search window exhausted`,
  });

  steps.push({
    stepType: "complete",
    currentIndex: -1,
    visitedIndices: [...visited],
    eliminatedIndices: [...eliminated],
    foundIndex: -1,
    isMajorStep: true,
    message: "Search complete — element not found",
  });

  return steps;
}

// ── Registration ──────────────────────────────────────────────────────────────

export const definition: SearchAlgorithmDefinition = {
  key: "binary",
  name: "Binary Search",
  func: binarySearch,
};
