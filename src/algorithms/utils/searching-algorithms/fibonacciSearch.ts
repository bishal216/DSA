// src/algorithms/utils/searching-algorithms/fibonacciSearch.ts

import type { SearchAlgorithmDefinition } from "@/algorithms/registry/searching-algorithms-registry";
import type { SearchStep } from "@/algorithms/types/searching";

function fibonacciSearch(array: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const n = array.length;
  const visited: number[] = [];
  const eliminated: number[] = [];

  // Build Fibonacci numbers up to >= n
  let fibM2 = 0; // F(k-2)
  let fibM1 = 1; // F(k-1)
  let fibM = 1; // F(k)

  while (fibM < n) {
    fibM2 = fibM1;
    fibM1 = fibM;
    fibM = fibM1 + fibM2;
  }

  steps.push({
    stepType: "comparison",
    currentIndex: -1,
    visitedIndices: [],
    eliminatedIndices: [],
    foundIndex: -1,
    isMajorStep: true,
    message: `Fibonacci search: divides array using Fibonacci numbers (F=${fibM}, F-1=${fibM1}, F-2=${fibM2}) instead of halving`,
  });

  let offset = -1; // marks the eliminated left edge

  while (fibM > 1) {
    // Valid index to check
    const i = Math.min(offset + fibM2, n - 1);

    steps.push({
      stepType: "comparison",
      currentIndex: i,
      visitedIndices: [...visited],
      eliminatedIndices: [...eliminated],
      foundIndex: -1,
      low: offset + 1,
      high: offset + fibM,
      mid: i,
      isMajorStep: true,
      message: `Fibonacci step F=${fibM}: checking index ${i} (value ${array[i]})`,
    });

    if (array[i] === target) {
      steps.push({
        stepType: "found",
        currentIndex: i,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: i,
        isMajorStep: true,
        message: `Found ${target} at index ${i}`,
      });
      steps.push({
        stepType: "complete",
        currentIndex: i,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: i,
        isMajorStep: true,
        message: `Search complete — ${target} found at index ${i}`,
      });
      return steps;
    }

    visited.push(i);

    if (array[i] < target) {
      // Eliminate left portion
      for (let j = offset + 1; j <= i; j++) eliminated.push(j);

      steps.push({
        stepType: "eliminated",
        currentIndex: -1,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: -1,
        message: `${array[i]} < ${target} — eliminating left portion [${offset + 1}..${i}], shifting by F-2=${fibM2}`,
      });

      // Move two Fibonacci steps down
      fibM = fibM1;
      fibM1 = fibM2;
      fibM2 = fibM - fibM1;
      offset = i;
    } else {
      // Eliminate right portion
      for (let j = i; j <= Math.min(offset + fibM, n - 1); j++)
        eliminated.push(j);

      steps.push({
        stepType: "eliminated",
        currentIndex: -1,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: -1,
        message: `${array[i]} > ${target} — eliminating right portion, shifting by F-1=${fibM1}`,
      });

      // Move one Fibonacci step down
      fibM = fibM2;
      fibM1 = fibM1 - fibM2;
      fibM2 = fibM - fibM1;
    }
  }

  // Last element check
  if (fibM1 === 1 && offset + 1 < n) {
    const lastIdx = offset + 1;

    steps.push({
      stepType: "comparison",
      currentIndex: lastIdx,
      visitedIndices: [...visited],
      eliminatedIndices: [...eliminated],
      foundIndex: -1,
      message: `Checking last remaining element at index ${lastIdx} (value ${array[lastIdx]})`,
    });

    if (array[lastIdx] === target) {
      steps.push({
        stepType: "found",
        currentIndex: lastIdx,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: lastIdx,
        isMajorStep: true,
        message: `Found ${target} at index ${lastIdx}`,
      });
      steps.push({
        stepType: "complete",
        currentIndex: lastIdx,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: lastIdx,
        isMajorStep: true,
        message: `Search complete — ${target} found at index ${lastIdx}`,
      });
      return steps;
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
  key: "fibonacci",
  name: "Fibonacci Search",
  func: fibonacciSearch,
};
