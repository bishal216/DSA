// src/algorithms/utils/searching-algorithms/interpolationSearch.ts

import type { SearchAlgorithmDefinition } from "@/algorithms/registry/searching-algorithms-registry";
import type { SearchStep } from "@/algorithms/types/searching";

function interpolationSearch(array: number[], target: number): SearchStep[] {
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
    message: `Interpolation search: estimates position using value distribution — faster than binary on uniform data`,
  });

  while (low <= high && target >= array[low] && target <= array[high]) {
    if (low === high) {
      steps.push({
        stepType: "comparison",
        currentIndex: low,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: -1,
        low,
        high,
        mid: low,
        message: `Single element remaining at index ${low} (value ${array[low]})`,
      });

      if (array[low] === target) {
        steps.push({
          stepType: "found",
          currentIndex: low,
          visitedIndices: [...visited],
          eliminatedIndices: [...eliminated],
          foundIndex: low,
          isMajorStep: true,
          message: `Found ${target} at index ${low}`,
        });
        steps.push({
          stepType: "complete",
          currentIndex: low,
          visitedIndices: [...visited],
          eliminatedIndices: [...eliminated],
          foundIndex: low,
          isMajorStep: true,
          message: `Search complete — ${target} found at index ${low}`,
        });
        return steps;
      }
      break;
    }

    // Interpolation formula: estimate where target likely sits
    const range = array[high] - array[low];
    const pos =
      low + Math.floor(((target - array[low]) / range) * (high - low));

    steps.push({
      stepType: "comparison",
      currentIndex: pos,
      visitedIndices: [...visited],
      eliminatedIndices: [...eliminated],
      foundIndex: -1,
      low,
      high,
      mid: pos,
      isMajorStep: true,
      message: `Estimated position: index ${pos} (value ${array[pos]}) — formula: ${low} + ((${target} - ${array[low]}) / (${array[high]} - ${array[low]})) × (${high} - ${low})`,
    });

    if (array[pos] === target) {
      steps.push({
        stepType: "found",
        currentIndex: pos,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: pos,
        isMajorStep: true,
        message: `Found ${target} at index ${pos}`,
      });
      steps.push({
        stepType: "complete",
        currentIndex: pos,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: pos,
        isMajorStep: true,
        message: `Search complete — ${target} found at index ${pos}`,
      });
      return steps;
    }

    visited.push(pos);

    if (array[pos] < target) {
      for (let i = low; i <= pos; i++) eliminated.push(i);
      steps.push({
        stepType: "eliminated",
        currentIndex: -1,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: -1,
        low,
        high,
        mid: pos,
        message: `${array[pos]} < ${target} — eliminating left side [${low}..${pos}]`,
      });
      low = pos + 1;
    } else {
      for (let i = pos; i <= high; i++) eliminated.push(i);
      steps.push({
        stepType: "eliminated",
        currentIndex: -1,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: -1,
        low,
        high,
        mid: pos,
        message: `${array[pos]} > ${target} — eliminating right side [${pos}..${high}]`,
      });
      high = pos - 1;
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
  key: "interpolation",
  name: "Interpolation Search",
  func: interpolationSearch,
};
