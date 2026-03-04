// src/algorithms/utils/searching-algorithms/jumpSearch.ts

import type { SearchAlgorithmDefinition } from "@/algorithms/registry/searching-algorithms-registry";
import type { SearchStep } from "@/algorithms/types/searching";

function jumpSearch(array: number[], target: number): SearchStep[] {
  const steps: SearchStep[] = [];
  const n = array.length;
  const blockSize = Math.floor(Math.sqrt(n));
  const visited: number[] = [];
  const eliminated: number[] = [];

  steps.push({
    stepType: "comparison",
    currentIndex: -1,
    visitedIndices: [],
    eliminatedIndices: [],
    foundIndex: -1,
    isMajorStep: true,
    message: `Jump search: block size is √${n} ≈ ${blockSize} — jumping ahead in blocks, then scanning back`,
  });

  // ── Phase 1: jump forward in blocks ────────────────────────────────────────
  let prev = 0;
  let curr = blockSize;

  while (curr < n && array[Math.min(curr, n) - 1] < target) {
    const blockEnd = Math.min(curr, n) - 1;

    steps.push({
      stepType: "comparison",
      currentIndex: blockEnd,
      visitedIndices: [...visited],
      eliminatedIndices: [...eliminated],
      foundIndex: -1,
      low: prev,
      high: blockEnd,
      isMajorStep: true,
      message: `Jumping: block end index ${blockEnd} has value ${array[blockEnd]} — still less than ${target}, jump again`,
    });

    // Eliminate the entire block we just skipped
    for (let i = prev; i <= blockEnd; i++) eliminated.push(i);
    visited.push(blockEnd);

    steps.push({
      stepType: "eliminated",
      currentIndex: -1,
      visitedIndices: [...visited],
      eliminatedIndices: [...eliminated],
      foundIndex: -1,
      low: prev,
      high: blockEnd,
      message: `Block [${prev}..${blockEnd}] eliminated — all values < ${target}`,
    });

    prev = curr;
    curr += blockSize;
  }

  // ── Phase 2: linear scan backward from block end ──────────────────────────
  const scanEnd = Math.min(curr, n) - 1;

  steps.push({
    stepType: "comparison",
    currentIndex: -1,
    visitedIndices: [...visited],
    eliminatedIndices: [...eliminated],
    foundIndex: -1,
    low: prev,
    high: scanEnd,
    isMajorStep: true,
    message: `Target may be in block [${prev}..${scanEnd}] — scanning linearly`,
  });

  for (let i = prev; i <= scanEnd; i++) {
    steps.push({
      stepType: "comparison",
      currentIndex: i,
      visitedIndices: [...visited],
      eliminatedIndices: [...eliminated],
      foundIndex: -1,
      low: prev,
      high: scanEnd,
      message: `Scanning: checking index ${i} (value ${array[i]})`,
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

    if (array[i] > target) {
      // Remaining block can't contain target
      for (let j = i; j <= scanEnd; j++) eliminated.push(j);

      steps.push({
        stepType: "eliminated",
        currentIndex: -1,
        visitedIndices: [...visited],
        eliminatedIndices: [...eliminated],
        foundIndex: -1,
        message: `${array[i]} > ${target} — target not in this block`,
      });
      break;
    }

    visited.push(i);
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
  key: "jump",
  name: "Jump Search",
  func: jumpSearch,
};
