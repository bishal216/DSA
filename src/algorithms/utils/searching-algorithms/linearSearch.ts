// src/algorithms/utils/searching-algorithms/linearSearch.ts

import type { SearchAlgorithmDefinition } from "@/algorithms/registry/searching-algorithms-registry";
import type { SearchStep } from "@/algorithms/types/searching";

function linearSearch(array: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const visited: number[] = [];

  steps.push({
    stepType: "comparison",
    currentIndex: 0,
    visitedIndices: [],
    eliminatedIndices: [],
    foundIndex: -1,
    isMajorStep: true,
    message: `Linear search: scanning left to right for ${target}`,
  });

  for (let i = 0; i < array.length; i++) {
    steps.push({
      stepType: "comparison",
      currentIndex: i,
      visitedIndices: [...visited],
      eliminatedIndices: [],
      foundIndex: -1,
      message: `Comparing ${array[i]} with target ${target}`,
    });

    if (array[i] === target) {
      steps.push({
        stepType: "found",
        currentIndex: i,
        visitedIndices: [...visited],
        eliminatedIndices: [],
        foundIndex: i,
        isMajorStep: true,
        message: `Found ${target} at index ${i}`,
      });

      steps.push({
        stepType: "complete",
        currentIndex: i,
        visitedIndices: [...visited],
        eliminatedIndices: [],
        foundIndex: i,
        isMajorStep: true,
        message: `Search complete — ${target} found at index ${i}`,
      });

      return steps;
    }

    visited.push(i);

    steps.push({
      stepType: "visited",
      currentIndex: -1,
      visitedIndices: [...visited],
      eliminatedIndices: [],
      foundIndex: -1,
      message: `${array[i]} ≠ ${target} — moving on`,
    });
  }

  // Not found
  steps.push({
    stepType: "not-found",
    currentIndex: -1,
    visitedIndices: [...visited],
    eliminatedIndices: [],
    foundIndex: -1,
    isMajorStep: true,
    message: `${target} not found in array`,
  });

  steps.push({
    stepType: "complete",
    currentIndex: -1,
    visitedIndices: [...visited],
    eliminatedIndices: [],
    foundIndex: -1,
    isMajorStep: true,
    message: "Search complete — element not found",
  });

  return steps;
}

// ── Registration ──────────────────────────────────────────────────────────────

export const definition: SearchAlgorithmDefinition = {
  key: "linear",
  name: "Linear Search",
  func: linearSearch,
};
