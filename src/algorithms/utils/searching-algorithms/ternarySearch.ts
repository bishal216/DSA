// src/algorithms/utils/searching-algorithms/ternarySearch.ts
//
// NOTE: Ternary search on a sorted array works correctly for finding an exact
// value — it divides into thirds and eliminates one third per step.
// It is less efficient than binary search (more comparisons) but visually
// distinct and educational.

import type { SearchStep } from "@/algorithms/types/searching";
import type { SearchAlgorithmDefinition } from "@/algorithms/types/searching-algorithms-registry";

function ternarySearch(array: number[], target: number): SearchStep[] {
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
    message: `Ternary search: divides array into thirds — two midpoints checked per iteration`,
  });

  while (low <= high) {
    const mid1 = low + Math.floor((high - low) / 3);
    const mid2 = high - Math.floor((high - low) / 3);

    // Check mid1
    steps.push({
      stepType: "comparison",
      currentIndex: mid1,
      visitedIndices: [...visited],
      eliminatedIndices: [...eliminated],
      foundIndex: -1,
      low,
      high,
      mid: mid1,
      isMajorStep: true,
      message: `Window [${low}..${high}] — checking first third boundary: index ${mid1} (value ${array[mid1]})`,
    });

    if (array[mid1] === target) {
      steps.push({
        stepType: "found",
        currentIndex: mid1,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: mid1,
        isMajorStep: true,
        message: `Found ${target} at index ${mid1}`,
      });
      steps.push({
        stepType: "complete",
        currentIndex: mid1,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: mid1,
        isMajorStep: true,
        message: `Search complete — ${target} found at index ${mid1}`,
      });
      return steps;
    }

    visited.push(mid1);

    // Check mid2 (only if different from mid1)
    if (mid1 !== mid2) {
      steps.push({
        stepType: "comparison",
        currentIndex: mid2,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: -1,
        low,
        high,
        mid: mid2,
        message: `Checking second third boundary: index ${mid2} (value ${array[mid2]})`,
      });

      if (array[mid2] === target) {
        steps.push({
          stepType: "found",
          currentIndex: mid2,
          visitedIndices: [...visited],
          eliminatedIndices: [...eliminated],
          foundIndex: mid2,
          isMajorStep: true,
          message: `Found ${target} at index ${mid2}`,
        });
        steps.push({
          stepType: "complete",
          currentIndex: mid2,
          visitedIndices: [...visited],
          eliminatedIndices: [...eliminated],
          foundIndex: mid2,
          isMajorStep: true,
          message: `Search complete — ${target} found at index ${mid2}`,
        });
        return steps;
      }

      visited.push(mid2);
    }

    // Eliminate one third
    if (target < array[mid1]) {
      // Target is in left third — eliminate middle and right
      for (let i = mid1; i <= high; i++) eliminated.push(i);

      steps.push({
        stepType: "eliminated",
        currentIndex: -1,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: -1,
        low,
        high,
        message: `${target} < ${array[mid1]} — target in left third [${low}..${mid1 - 1}], eliminating [${mid1}..${high}]`,
      });

      high = mid1 - 1;
    } else if (target > array[mid2]) {
      // Target is in right third — eliminate left and middle
      for (let i = low; i <= mid2; i++) eliminated.push(i);

      steps.push({
        stepType: "eliminated",
        currentIndex: -1,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: -1,
        low,
        high,
        message: `${target} > ${array[mid2]} — target in right third [${mid2 + 1}..${high}], eliminating [${low}..${mid2}]`,
      });

      low = mid2 + 1;
    } else {
      // Target is in middle third — eliminate left and right
      for (let i = low; i < mid1; i++) eliminated.push(i);
      for (let i = mid2 + 1; i <= high; i++) eliminated.push(i);

      steps.push({
        stepType: "eliminated",
        currentIndex: -1,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: -1,
        low,
        high,
        message: `Target between mid1 and mid2 — narrowing to middle third [${mid1 + 1}..${mid2 - 1}]`,
      });

      low = mid1 + 1;
      high = mid2 - 1;
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
  key: "ternary",
  name: "Ternary Search",
  func: ternarySearch,
};
