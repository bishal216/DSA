// src/algorithms/utils/searching-algorithms/exponentialSearch.ts

import type { SearchAlgorithmDefinition } from "@/algorithms/registry/searching-algorithms-registry";
import type { SearchStep } from "@/algorithms/types/searching";

function exponentialSearch(array: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const n = array.length;
  const visited: number[] = [];
  const eliminated: number[] = [];

  steps.push({
    stepType: "comparison",
    currentIndex: -1,
    visitedIndices: [],
    eliminatedIndices: [],
    foundIndex: -1,
    isMajorStep: true,
    message: `Exponential search: doubles range until overshoot, then binary searches within that range`,
  });

  // Check index 0 first
  steps.push({
    stepType: "comparison",
    currentIndex: 0,
    visitedIndices: [],
    eliminatedIndices: [],
    foundIndex: -1,
    message: `Checking index 0 (value ${array[0]})`,
  });

  if (array[0] === target) {
    steps.push({
      stepType: "found",
      currentIndex: 0,
      visitedIndices: [],
      eliminatedIndices: [],
      foundIndex: 0,
      isMajorStep: true,
      message: `Found ${target} at index 0`,
    });
    steps.push({
      stepType: "complete",
      currentIndex: 0,
      visitedIndices: [],
      eliminatedIndices: [],
      foundIndex: 0,
      isMajorStep: true,
      message: `Search complete — ${target} found at index 0`,
    });
    return steps;
  }

  visited.push(0);

  // ── Phase 1: find range by doubling ────────────────────────────────────────
  let bound = 1;

  while (bound < n && array[bound] <= target) {
    steps.push({
      stepType: "comparison",
      currentIndex: bound,
      visitedIndices: [...visited],
      eliminatedIndices: [...eliminated],
      foundIndex: -1,
      low: 0,
      high: bound,
      isMajorStep: true,
      message: `Range check: index ${bound} (value ${array[bound]}) — ${array[bound] <= target ? "still ≤ target, doubling range" : "overshot, binary search in [${Math.floor(bound / 2)}..${Math.min(bound, n - 1)}]"}`,
    });

    if (array[bound] === target) {
      steps.push({
        stepType: "found",
        currentIndex: bound,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: bound,
        isMajorStep: true,
        message: `Found ${target} at index ${bound}`,
      });
      steps.push({
        stepType: "complete",
        currentIndex: bound,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: bound,
        isMajorStep: true,
        message: `Search complete — ${target} found at index ${bound}`,
      });
      return steps;
    }

    // Eliminate everything before the previous bound
    const prevBound = Math.floor(bound / 2);
    for (let i = visited[visited.length - 1] + 1; i < prevBound; i++) {
      eliminated.push(i);
    }

    visited.push(bound);
    bound *= 2;
  }

  // ── Phase 2: binary search in [bound/2 .. min(bound, n-1)] ────────────────
  let low = Math.floor(bound / 2) + 1;
  let high = Math.min(bound, n - 1);

  // Eliminate everything outside the binary search window
  for (let i = 0; i < low; i++) {
    if (!eliminated.includes(i) && !visited.includes(i)) eliminated.push(i);
  }

  steps.push({
    stepType: "comparison",
    currentIndex: -1,
    visitedIndices: [...visited],
    eliminatedIndices: [...eliminated],
    foundIndex: -1,
    low,
    high,
    isMajorStep: true,
    message: `Range found — binary searching within [${low}..${high}]`,
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
      message: `Binary search: checking index ${mid} (value ${array[mid]})`,
    });

    if (array[mid] === target) {
      steps.push({
        stepType: "found",
        currentIndex: mid,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: mid,
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
        message: `${array[mid]} < ${target} — eliminating [${low}..${mid}]`,
      });
      low = mid + 1;
    } else {
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
        message: `${array[mid]} > ${target} — eliminating [${mid}..${high}]`,
      });
      high = mid - 1;
    }
  }

  steps.push({
    stepType: "not-found",
    currentIndex: -1,
    visitedIndices: [...visited],
    eliminatedIndices: [...eliminated],
    foundIndex: -1,
    isMajorStep: true,
    message: `${target} not found in array`,
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
  key: "exponential",
  name: "Exponential Search",
  func: exponentialSearch,
};
